import * as THREE from 'three'

/* Sumber file logo 3D RaLabs.

   Satu file dipakai dua tempat: hero (Logo3D.jsx) dan gerbang
   (LogoGerbang.jsx). Browser cache otomatis, jadi tidak perlu duplikat
   file 1.6MB dua kali. */
export const SUMBER_LOGO = '/images/logo-ralabs-3d.glb'

/* Warna verteks (kalau aset punya) disimpan sebagai byte sRGB.

   Shader three membaca warna verteks sebagai linear, lalu output-nya
   di-sRGB-kan lagi. Tanpa konversi di tengah, hijau-biru terangkat dan
   merahnya jadi butek. Fungsi ini mengubah byte sRGB jadi linear, supaya
   bolak-balik pas lagi sama dengan warna yang digambar di aset.

   Aset logo RaLabs sendiri TIDAK punya vertex color (warnanya per
   material), jadi fungsi ini tidak berefek ke sana. Yang memakainya
   sekarang: mark InDeep dan Ibborarts di hero. */
export function siapkanWarna(geo) {
  const attr = geo.getAttribute('color')
  if (!attr) return

  const item = attr.itemSize
  const sumber = attr.array
  const maks = sumber instanceof Uint8Array ? 255 : sumber instanceof Uint16Array ? 65535 : 1
  const data = new Float32Array(attr.count * item)
  const warna = new THREE.Color()

  for (let i = 0; i < attr.count; i++) {
    const o = i * item
    const r = attr.normalized ? sumber[o] / maks : sumber[o]
    const g = attr.normalized ? sumber[o + 1] / maks : sumber[o + 1]
    const b = attr.normalized ? sumber[o + 2] / maks : sumber[o + 2]
    warna.setRGB(r, g, b, THREE.SRGBColorSpace)
    data[o] = warna.r
    data[o + 1] = warna.g
    data[o + 2] = warna.b
    if (item === 4) data[o + 3] = 1
  }

  geo.setAttribute('color', new THREE.BufferAttribute(data, item))
}

/* Warna dasar material (baseColorFactor) di file .glb.

   Penulis file .glb menulis angkanya sebagai byte sRGB:
     0.047 = 12/255  = #0c0c0c  (tinta RaLabs)
     0.973 = 248/255 = #f8fafc  (kertas RaLabs)
     0.843 = 215/255 = #d70000  (merah RaLabs)

   three membaca baseColorFactor sebagai linear (ikut aturan glTF), jadi
   angkanya dipakai mentah: hitam jadi abu terang (#3c3c3c) dan merah jadi
   #ee0000. Warna logo meleset dari palet RaLabs.

   Fungsi ini membaca ulang angka yang sama sebagai sRGB, lalu three yang
   mengonversinya ke linear. Hasilnya di layar persis sama dengan file:
   #0c0c0c, #f8fafc, #d70000. */
export function sewarnaMerek(material) {
  const warna = material?.color
  if (!warna) return
  const r = warna.r
  const g = warna.g
  const b = warna.b
  warna.setRGB(r, g, b, THREE.SRGBColorSpace)
}

/* Lampu untuk scene logo.

   Aset logo RaLabs PBR: tiga bahan (hitam, putih, merah) dengan roughness
   0.10-0.16, jadi permukaannya licin dan bentuknya hanya terbaca kalau
   ada lampu yang menyorotnya.

   Dua tema hero butuh perlakuan berbeda:
   - gelap  : latar hampir hitam (#0c0c0c). Yang membawa logo adalah muka
              putih dan merah. Lampu utama sengaja kuat supaya muka hitam
              juga dapat pantulan (specular), jadi sisi kubunya tidak
              berubah jadi lubang hitam.
   - terang : latar kertas (#f8fafc). Yang membawa logo adalah muka hitam;
              muka putih boleh menyatu dengan kertas karena dibatasi garis
              hitam di sekelilingnya. Lampu diturunkan supaya muka putih
              tidak blown out jadi putih penuh.

   Lampu RIM dinilai dari kiri depan. Posisi itu bukan asal: pantulan dari
   arah itu yang membuat huruf hitam "Labs" tetap terbaca di atas latar
   gelap, dan yang memberi gradien pada muka putih di atas kertas.

   `denganKilas` menyalakan satu lampu tambahan: cahaya kayak lampu yang
   pelan-pelan menyusul di depan logo. Yang butuh itu cuma hero, jadi
   gerbang memanggil tanpa opsi ini dan tampilannya tetap sama. */
export function pasangLampu(scene, { denganKilas = false } = {}) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.5)
  const utama = new THREE.DirectionalLight(0xffffff, 2.4)
  utama.position.set(2.4, 3.2, 4.2)
  const isi = new THREE.DirectionalLight(0xffffff, 0.7)
  isi.position.set(-3.2, -1.4, 1.6)
  const rim = new THREE.DirectionalLight(0xffffff, 3.2)
  rim.position.set(-3.5, 1.2, 2.2)

  scene.add(ambient, utama, isi, rim)

  const RIG = {
    terang: { ambient: 0.65, utama: 2.1, isi: 0.7, rim: 1.5 },
    gelap: { ambient: 0.45, utama: 2.4, isi: 0.7, rim: 3.2 },
  }

  const setTema = (tema) => {
    const r = RIG[tema] || RIG.gelap
    ambient.intensity = r.ambient
    utama.intensity = r.utama
    isi.intensity = r.isi
    rim.intensity = r.rim
  }

  /* Lampu kilas: satu PointLight hangat yang pelan-pelan menyusul di
     depan logo, kelihatan seperti lampu yang digeser pelan-pelan.

     Geraknya sinus bolak-balik, jadi waktu sudah belok ke titik awal
     tidak ada lompatan — lampu pulang ke tengah, bukan teleport.

     POSISI LAMPU PENTING. Jalurnya sengaja rendah (y = -0,3), bukan di
     atas logo. Logo itu dua bagian: kubus di atas dan tulisan "Ra Labs"
     di bawah. Kalau lampunya melintas tinggi, cahaya jatuh ke kubus
     saja dan tulisannya praktis diam — diukur, brightness tulisan cuma
     berubah 1 level dari 255. Kalau jalurnya diturunkan, cahaya ikut
     menyapu tulisan juga, dan dua-duanya bergerak (kubus 29 level,
     tulisan 32 level).

     Intensitasnya 34 (dari 48, dikurangi karena sweep-nya terlalu
     terang di mata). Bahannya gelap — tulisannya perlu cahaya lebih banyak
     biar perubahannya kelihatan, tapi jangan berlebihan.

     Ada DUA lampu: satu di depan, satu di belakang. Yang di belakang
     penting: muka yang menghadap ke belakang nggak dapat apa-apa dari
     lampu depan (garis normalnya berlawanan, jadi contribusi nol). Waktu
     logo berputar dan belok ke belakang, warnanya jadi mati. Lampu
     kembar di belakang itu yang menghidupkannya lagi, dan keduanya jalan bareng.

     Intensitasnya sama di dua tema. Di tema terang muka putih logo
     nempel sama kertas, jadi memang perlu dicek hasilnya; kalau nanti
     keputex, yang diturunkan intensitasnya, bukan logonya.

     Tidak ikut `setTema` karena ini efek, bukan penerang utama. */
  const PERIODE_KILAS = 8000 // ms, satu bolak-balik penuh
  const JALUR_KILAS = 3.2 // seberapa jauh dari tengah, dalam satuan logo
  const TINGGI_KILAS = -0.3 // tinggi jalur, supaya tulisan ikut tersapu
  const JARAK_KILAS = 2.6 // seberapa dekat di depan logo
  const CAHAYA_KILAS = 34

  let kilas = null
  let belakang = null

  /* Panggil tiap frame dari loop render hero.
     `jalan` false = pengguna minta reduced motion: lampu diem di tengah,
     cahayanya tetap ada, cuma nggak bergerak. */
  let ikutWaktu = () => {}

  if (denganKilas) {
    kilas = new THREE.PointLight(0xfff0dc, CAHAYA_KILAS, 0, 2)
    kilas.position.set(0, TINGGI_KILAS, JARAK_KILAS)
    scene.add(kilas)

    belakang = new THREE.PointLight(0xfff0dc, CAHAYA_KILAS, 0, 2)
    belakang.position.set(0, TINGGI_KILAS, -JARAK_KILAS)
    scene.add(belakang)

    ikutWaktu = (waktuMs, jalan) => {
      const x = jalan
        ? Math.sin(((waktuMs % PERIODE_KILAS) / PERIODE_KILAS) * Math.PI * 2) * JALUR_KILAS
        : 0
      kilas.position.set(x, TINGGI_KILAS, JARAK_KILAS)
      belakang.position.set(x, TINGGI_KILAS, -JARAK_KILAS)
    }
  }

  return { setTema, ikutWaktu, ambient, utama, isi, rim, kilas, belakang }
}

/* Ikuti perubahan tema tanpa bikin React render ulang.

   Tema hidup di atribut <html data-theme>, ditulis theme.js. Lampu logo
   disetel di dalam loop three.js, bukan lewat state React, jadi yang
   dipantau adalah atribut itu sendiri: begitu berubah, lampu ikut
   disetel ulang. */
export function amatiTema(panggil) {
  const baca = () => document.documentElement.getAttribute('data-theme')
  panggil(baca())
  const pemantau = new MutationObserver(() => panggil(baca()))
  pemantau.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  return () => pemantau.disconnect()
}
