import * as THREE from 'three'
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'

/* Tiga kilat untuk gerbang masuk (plan-prd/gerbang-masuk).

   Bentuknya: ray cahaya yang LARI MENYUSURI TEPI logo, satu putaran penuh,
   lalu habis. Bukan seluruh garis berkedip bareng, bukan titik-titik.

   Caranya: seluruh tepi tajam logo dikumpulkan sekali, lalu tiap ujung tepi
   diberi satu sudut (sudut jam terhadap pusat logo, sesuai yang dilihat
   kamera). Ray-nya sendiri = "jarum jam" yang berputar 360°; ujung tepi yang
   kelewatan jarum itu menyala, lengkap dengan ekor yang memudar di belakangnya.

   Kenapa sudutnya dihitung dari atan2(y, x): kamera gerbang orthographic dan
   menghadap lurus ke logo, jadi sumbu layar sejajar sumbu dunia X dan Y.
   Tidak perlu proyeksi lebih jauh. */

const DUA_PI = Math.PI * 2

/* Warna tepi -> warna kilat, persis seperti tabel di design.md.
   Indeks = kelas tepi: 0 merah, 1 tinta, 2 kertas. */
const WARNA_KILAT = [
  new THREE.Color('#FFE45C'), // tepi merah   -> kuning
  new THREE.Color('#F8FAFC'), // tepi tinta   -> putih
  new THREE.Color('#D70000'), // tepi kertas  -> merah
]

/* Tiga ray, susul-menyusul (stagger ±150ms). Masing-masing satu putaran.
   Ray terakhir selesai tepat di 1.2 detik, sesuai design.md. */
const RAY = [
  { kelas: 0, mulai: 0.0, durasi: 1.0 },
  { kelas: 1, mulai: 0.15, durasi: 1.0 },
  { kelas: 2, mulai: 0.3, durasi: 0.9 },
]

const TOTAL = 1.2 // detik
const SUDUT_EKOR = 0.6 // panjang ekor dalam radian (±34°)
const LEBAR_GARIS = 2.5 // pixel layar
const SUDUT_AWAL = Math.PI / 2 // ray mulai dari atas, berputar berlawanan arah jarum jam
const SUDUT_TEPI = 0.45 // radian (±26°); sisi yang tajam di atas ini dianggap "tepi"

/* Kelas warna satu simpul. Nilai warna dibaca apa adanya dari warna dasar
   material (sRGB), jadi tidak bisa dibandingkan langsung dengan hex sRGB.
   Yang dipakai ciri kasarnya saja: gelap = tinta, putih pudar = kertas,
   kemerahan = merah. Nada bayangan di antaranya sengaja diabaikan. */
function kelasWarna(r, g, b) {
  const maks = Math.max(r, g, b)
  if (maks < 0.18) return 1 // tinta

  const min = Math.min(r, g, b)
  const satura = (maks - min) / maks
  if (satura < 0.22 && maks > 0.45) return 2 // kertas

  if (r > g && r > b && (r - g) / r > 0.35) return 0 // merah

  return -1 // nada lain: tidak diikutkan
}

/* Kelas warna dari material satu mesh.

   Warna dasar material disimpan three dalam ruang linear, sedangkan
   cirinya di atas dibaca dalam sRGB (sesuai warna yang digambar di file).
   Jadi warnanya dikonversi balik ke sRGB dulu sebelum diklasifikasi.

   Aset logo RaLabs menyimpan warnanya per material (RALABS_Black,
   RALABS_White, RALABS_Red), bukan per simpul, jadi satu muka sudah punya
   satu warna yang pasti — persis yang dibutuhkan untuk menentukan warna
   kilatnya. */
function kelasWarnaMaterial(material, sementara) {
  if (!material?.color) return -1
  material.color.getRGB(sementara, THREE.SRGBColorSpace)
  return kelasWarna(sementara.r, sementara.g, sementara.b)
}

/* Kumpulkan tepi tajam dari satu geometry.

   EdgesGeometry bawaan three membuang vertex color, padahal warna tepi itu
   yang menentukan warna kilatnya. Jadi tepinya dibuat sendiri: tiap sisi
   segitiga dicatat dengan pasangan simpulnya, lalu sisi yang disandingkan
   dua segitiga dengan sudut normal berbeda dianggap tepi. */
function tepiTajam(geo, ambang) {
  const pos = geo.getAttribute('position')
  const idx = geo.getIndex()
  const jumlahSisi = Math.floor((idx ? idx.count : pos.count) / 3)
  const no = (i) => (idx ? idx.getX(i) : i)

  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const ab = new THREE.Vector3()
  const ac = new THREE.Vector3()
  const normal = new Array(jumlahSisi)

  for (let f = 0; f < jumlahSisi; f++) {
    a.fromBufferAttribute(pos, no(f * 3))
    b.fromBufferAttribute(pos, no(f * 3 + 1))
    c.fromBufferAttribute(pos, no(f * 3 + 2))
    ab.subVectors(b, a)
    ac.subVectors(c, a)
    normal[f] = new THREE.Vector3().crossVectors(ab, ac).normalize()
  }

  // Pasangan simpul selalu ditulis urut (kecil dulu) supaya sisi yang
  // dipakai dua segitiga bertemu di kunci yang sama.
  const peta = new Map()
  for (let f = 0; f < jumlahSisi; f++) {
    const i0 = no(f * 3)
    const i1 = no(f * 3 + 1)
    const i2 = no(f * 3 + 2)
    for (const [u, v] of [[i0, i1], [i1, i2], [i2, i0]]) {
      const kunci = u < v ? `${u}/${v}` : `${v}/${u}`
      let entri = peta.get(kunci)
      if (!entri) {
        entri = { u: Math.min(u, v), v: Math.max(u, v), wajah: [] }
        peta.set(kunci, entri)
      }
      entri.wajah.push(f)
    }
  }

  const hasil = []
  for (const { u, v, wajah } of peta.values()) {
    // Sisi yang cuma dipakai satu segitiga = tepi terbuka, ikut juga.
    const landai = wajah.length < 2 || normal[wajah[0]].angleTo(normal[wajah[1]]) > ambang
    if (landai) hasil.push(u, v)
  }
  return hasil
}

/* Kumpulkan semua tepi logo jadi satu daftar siap pakai.

   Posisi sudah dalam koordinat DUNIA (matrixWorld sudah diterapkan), karena
   selama urutan kilat logo sudah beku di pose kurus: tidak berputar, tidak
   bisa di-drag. Jadi posisinya cukup dihitung sekali di sini. */
function kumpulkanTepi(grup) {
  const posisi = []
  const kelas = []
  const sudut = []
  const P = new THREE.Vector3()
  const warnaSementara = new THREE.Color()

  grup.updateMatrixWorld(true)

  grup.traverse((obj) => {
    if (!obj.isMesh) return
    const geo = obj.geometry
    const pos = geo.getAttribute('position')
    if (!pos) return

    /* Satu warna untuk seluruh muka: yang dipakai untuk menentukan warna
       kilat. Diambil dari warna dasar material mesh itu, bukan dari vertex
       color — aset logo RaLabs menyimpan warna per material, dan semua simpul
       dalam satu muka memang sama warnanya. */
    const kelasMuka = kelasWarnaMaterial(obj.material, warnaSementara)

    const pasangan = tepiTajam(geo, SUDUT_TEPI)
    for (let i = 0; i < pasangan.length; i += 2) {
      for (const no of [pasangan[i], pasangan[i + 1]]) {
        P.fromBufferAttribute(pos, no).applyMatrix4(obj.matrixWorld)
        posisi.push(P.x, P.y, P.z)
        kelas.push(kelasMuka)
        // Pusat logo ada di titik asal (sudah dinormalkan waktu load),
        // jadi sudut jam di sini benar-benar sudut terhadap pusat logo.
        sudut.push(Math.atan2(P.y, P.x))
      }
    }
  })

  return {
    posisi: new Float32Array(posisi),
    kelas: new Int8Array(kelas),
    sudut: new Float32Array(sudut),
  }
}

/* buatKilat: pasang kilat ke scene yang sama dengan logo.

   scene  : scene three.js milik LogoGerbang.
   grup   : grup yang memuat model logo.
   ukurLayar : fungsi yang mengembalikan lebar/tinggi layar dalam pixel CSS,
               dibutuhkan LineMaterial supaya lebar garisnya akurat.

   Objek yang balik cuma punya empat cara pakai:
   mulai(selesai)   -> nyalakan tiga kilat, panggil selesai() saat 1.2 dtk habis
   maju()           -> dipanggil tiap frame oleh loop render
   ubahUkur(x, y)   -> dipanggil saat ukuran logo berubah (lebar garis ikut)
   mati()           -> buang semuanya (dipanggil saat komponen dilepas) */
export function buatKilat({ scene, grup, ukurLayar }) {
  const { posisi, kelas, sudut } = kumpulkanTepi(grup)
  const jumlah = sudut.length // satu angka untuk tiap ujung tepi

  const warna = new Float32Array(jumlah * 3)
  const kepala = new Float32Array(WARNA_KILAT.length) // posisi jarum tiap kelas; -1 = ray mati

  let garis = null
  let material = null
  let mulaiPada = 0
  let sudahSelesai = false
  let panggilSelesai = null

  const hapus = () => {
    if (!garis) return
    scene.remove(garis)
    garis.geometry.dispose()
    material.dispose()
    garis = null
    material = null
  }

  return {
    mulai(selesai) {
      panggilSelesai = selesai
      if (garis) return // sudah pernah dinyalakan

      const geo = new LineSegmentsGeometry()
      // posisi: pasangan xyz xyz per segmen. warna: rgb rgb per segmen,
      // semuanya nol dulu supaya belum ada yang menyala saat mulai.
      geo.setPositions(posisi)
      geo.setColors(warna)

      material = new LineMaterial({
        color: 0xffffff,
        linewidth: LEBAR_GARIS,
        worldUnits: false, // lebar dalam pixel layar, bukan satuan dunia
        vertexColors: true, // warna dibaca dari instanceColorStart/End
        transparent: true,
        depthTest: false, // cahaya selalu di depan logo
        depthWrite: false,
      })
      // Additive: cahaya menambah ke cerah, bukan menimpa. Ini yang bikin
      // ray terasa seperti cahaya, bukan seperti garis cat.
      material.blending = THREE.AdditiveBlending

      const { x, y } = ukurLayar()
      material.resolution.set(x, y)

      garis = new LineSegments2(geo, material)
      garis.renderOrder = 999
      garis.frustumCulled = false
      scene.add(garis)

      mulaiPada = performance.now()
      sudahSelesai = false
    },

    maju() {
      if (!garis || sudahSelesai) return

      const t = (performance.now() - mulaiPada) / 1000
      if (t >= TOTAL) {
        sudahSelesai = true
        hapus()
        panggilSelesai?.()
        return
      }

      // Posisi jarum tiap kelas. Kelas tanpa ray aktif bernilai -1.
      kepala.fill(-1)
      for (const ray of RAY) {
        const p = (t - ray.mulai) / ray.durasi
        if (p < 0 || p > 1) continue
        kepala[ray.kelas] = SUDUT_AWAL + p * DUA_PI
      }

      for (let i = 0; i < jumlah; i++) {
        const o = i * 3
        const k = kelas[i]
        const sudutKepala = k >= 0 ? kepala[k] : -1

        if (sudutKepala < 0) {
          warna[o] = 0
          warna[o + 1] = 0
          warna[o + 2] = 0
          continue
        }

        // Jarak sudut dari jarum ke ujung tepi ini, dibungkus ke [0, 2π)
        // supaya "di belakang jarum" selalu bernilai positif.
        let d = sudutKepala - sudut[i]
        d -= Math.floor(d / DUA_PI) * DUA_PI

        if (d >= SUDUT_EKOR) {
          warna[o] = 0
          warna[o + 1] = 0
          warna[o + 2] = 0
          continue
        }

        // Ekor memudar di belakang kepala. Kuadrat bikin pudarnya lembut
        // di ujung ekor, tajam di kepala.
        const terang = (1 - d / SUDUT_EKOR) ** 2
        const w = WARNA_KILAT[k]
        warna[o] = w.r * terang
        warna[o + 1] = w.g * terang
        warna[o + 2] = w.b * terang
      }

      // instanceColorStart dan instanceColorEnd memakai buffer yang sama,
      // jadi cukup satu penanda needsUpdate untuk keduanya.
      garis.geometry.attributes.instanceColorStart.data.needsUpdate = true
    },

    ubahUkur(x, y) {
      material?.resolution.set(x, y)
    },

    mati() {
      hapus()
      panggilSelesai = null
    },
  }
}
