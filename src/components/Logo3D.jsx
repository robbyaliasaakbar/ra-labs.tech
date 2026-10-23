import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { buatLoaderGLTF } from './loaderGLTF.js'
import { SUMBER_LOGO, siapkanWarna, sewarnaMerek, pasangLampu, amatiTema } from './aset3d.js'

const CADANGAN = '/images/logo-preload.webp'
const PUTAR_AWAL = { x: 0.05, y: -0.32 }

/* Posisi kamera saat logo pertama kali muncul. OrbitControls memutar
   KAMERA mengelilingi logo, bukan memutar logonya, jadi "lurus depan"
   berarti kamera balik ke titik ini. Nilainya sama persis dengan yang
   dipakai di LogoGerbang.jsx buat pose kurus. */
const KAMERA_AWAL = new THREE.Vector3(0, 0, 10)
/* Lama animasi balik ke lurus depan, ms. */
const DURASI_KEMBALI = 800

/* Logo3D: model GLB logo RaLabs, dirender three.js.
   - Bisa diputar dengan drag (OrbitControls, tanpa pan/zoom) → posisi tetap,
     cuma rotasinya yang berubah. Idle → berputar pelan sendiri.
   - Material dipakai apa adanya dari file .glb (PBR, warna per material).
   - Lampu menyesuaikan tema hero, jadi logo terbaca di latar terang
     maupun gelap.
   - Reduced motion / gagal WebGL → tanpa spin, atau gambar cadangan. */
export default function Logo3D({ className = '' }) {
  const wadahRef = useRef(null)
  // Akar komponen: tempat bayangan hidup, dan tempat variabel ukuran
  // bayangan ditulis tiap frame.
  const akarRef = useRef(null)
  const [gagal, setGagal] = useState(false)

  useEffect(() => {
    const wadah = wadahRef.current
    if (!wadah) return undefined

    const kurangiGerak = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setGagal(true)
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.opacity = '0'
    renderer.domElement.style.transition = 'opacity 400ms ease-out'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    wadah.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    /* Lampu. Aset logo PBR, jadi tanpa lampu bentuknya tidak kebaca:
       muka putih jadi abu, muka hitam jadi lubang. Rig-nya menyesuaikan
       tema (terang/gelap) dan diganti ulang kalau tema hero berubah.

       `denganKilas` menyalakan satu lampu tambahan yang pelan-pelan
       menyusul di depan logo, biar logonya kelihatan hidup. */
    const lampu = pasangLampu(scene, { denganKilas: true })
    const berhentiAmati = amatiTema((tema) => lampu.setTema(tema))

    // Orthographic: ukuran objek tetap di semua sudut (tanpa gede-kecil),
    // dan frustum bisa dihitung sekali agar seluruh rotasi masuk frame.
    const kamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    kamera.position.set(0, 0, 10)
    kamera.lookAt(0, 0, 0)

    const grup = new THREE.Group()
    scene.add(grup)

    // Frustum ortho ukuran tetap; posisinya digeser per frame supaya objek
    // selalu di tengah. Skala jadi konstan, rotasi bebas, tanpa clipping.
    const sudutKotak = []
    let setengahFit = 0
    // Lebar logo paling lebar yang pernah terjadi, dari semua sudut.
    // Pembanding buat bayangan: seberapa "muka" logonya sekarang.
    let lebarMaks = 0

    // Kontrol putar: kiri-drag / satu jari. Tanpa pan & zoom, jadi objek
    // tidak bisa dipindah atau digeser dari posisinya.
    const kontrol = new OrbitControls(kamera, renderer.domElement)
    kontrol.enablePan = false
    kontrol.enableZoom = false
    kontrol.enableDamping = true
    kontrol.dampingFactor = 0.08
    kontrol.rotateSpeed = 0.9
    // Rotasi bebas: horizontal 360° dan vertikal sampai batas aman kutub.
    const POLAR_MIN = 0.35
    const POLAR_MAX = Math.PI - 0.35
    kontrol.minPolarAngle = POLAR_MIN
    kontrol.maxPolarAngle = POLAR_MAX
    // Titik pandang sedikit ke bawah → objek duduk lebih tinggi di kanvas,
    // memberi ruang bawah saat diputar (tidak terpotong).
    kontrol.target.set(0, 0, 0)
    kontrol.autoRotate = !kurangiGerak
    kontrol.autoRotateSpeed = 0.9
    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.style.cursor = 'grab'

    /* ---- Balik ke lurus depan ----
       Lepas drag: kamera pelan-pelan balik ke KAMERA_AWAL, lalu spin
       dinyalakan lagi. Cara persis yang dipakai LogoGerbang.jsx buat
       pose kurus: posisi dibaca dalam bentuk bola (spherical), lalu
       diinterpolasi lewat jalur terpendek, jadi logo tidak muter arah
       panjang cuma untuk balik ke depan. */
    const motor = {
      aktif: false,
      mulai: 0,
      dari: new THREE.Spherical(),
      ke: new THREE.Spherical(),
      deltaTheta: 0,
      deltaPhi: 0,
    }
    const offset = new THREE.Vector3()
    const sph = new THREE.Spherical()

    const mulaiKembali = () => {
      if (motor.aktif) return
      motor.aktif = true
      motor.mulai = performance.now()
      kontrol.autoRotate = false

      // Posisi bisa di mana saja hasil spin atau drag, jadi ditangkap
      // sekali di sini, bukan dihitung ulang tiap frame.
      offset.copy(kamera.position).sub(kontrol.target)
      motor.dari.setFromVector3(offset)
      offset.copy(KAMERA_AWAL).sub(kontrol.target)
      motor.ke.setFromVector3(offset)

      // Theta dibawa lewat jalur terpendek.
      const selisih = motor.ke.theta - motor.dari.theta
      motor.deltaTheta = Math.atan2(Math.sin(selisih), Math.cos(selisih))
      motor.deltaPhi = motor.ke.phi - motor.dari.phi
    }

    // Di-render tiap frame SETELAH kontrol.update(), supaya nilainya yang
    // menang terakhir.
    const majuKembali = () => {
      if (!motor.aktif) return
      const t = Math.min(1, (performance.now() - motor.mulai) / DURASI_KEMBALI)
      // ease in-out: pelan di awal, kencang di tengah, pelan di akhir.
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

      if (t < 1) {
        sph.radius = motor.dari.radius + (motor.ke.radius - motor.dari.radius) * e
        sph.phi = motor.dari.phi + motor.deltaPhi * e
        sph.theta = motor.dari.theta + motor.deltaTheta * e
        kamera.position.setFromSpherical(sph).add(kontrol.target)
        return
      }

      // Selesai: posisi dikunci di KAMERA_AWAL, lalu spin jalan lagi.
      kamera.position.copy(KAMERA_AWAL)
      motor.aktif = false
      kontrol.autoRotate = true
    }

    const saatMulai = () => {
      kontrol.autoRotate = false
      renderer.domElement.style.cursor = 'grabbing'
      // Sedang balik ke depan lalu user drag lagi: baliknya dihentikan,
      // user yang pegang kendali.
      motor.aktif = false
    }
    const saatSelesai = () => {
      renderer.domElement.style.cursor = 'grab'
      if (kurangiGerak) {
        // Gerak dimatikan: langsung lurus depan, tanpa animasi.
        kamera.position.copy(KAMERA_AWAL)
        return
      }
      mulaiKembali()
    }
    kontrol.addEventListener('start', saatMulai)
    kontrol.addEventListener('end', saatSelesai)

    const titikUji = new THREE.Vector3()

    /* Data bayangan, ditulis ulang tiap frame dari pusatkanFrustum():
       lebar logo yang kelihatan dari sudut sekarang, dan jarak dari
       bawah container ke bawah logo. */
    let lebarSekarang = 0
    let jarakBawah = 0

    const pusatkanFrustum = () => {
      if (!setengahFit || !sudutKotak.length) return
      kamera.updateMatrixWorld()
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      for (const sudut of sudutKotak) {
        titikUji.copy(sudut).applyMatrix4(kamera.matrixWorldInverse)
        if (titikUji.x < minX) minX = titikUji.x
        if (titikUji.x > maxX) maxX = titikUji.x
        if (titikUji.y < minY) minY = titikUji.y
        if (titikUji.y > maxY) maxY = titikUji.y
      }
      const cx = (minX + maxX) / 2
      const cy = (minY + maxY) / 2
      kamera.left = cx - setengahFit
      kamera.right = cx + setengahFit
      kamera.top = cy + setengahFit
      kamera.bottom = cy - setengahFit
      kamera.updateProjectionMatrix()

      // Lebar logo yang kelihatan sekarang, dalam satuan frustum.
      lebarSekarang = maxX - minX
      // Jarak bawah logo ke bawah frustum, dalam satuan frustum. Ini
      // yang bikin bayangan selalu nempel di bawah logonya.
      jarakBawah = minY - (cy - setengahFit)
    }

    /* Tulis ukuran bayangan ke CSS, biar elemen DOM-nya (yang ada di luar
       canvas) ikut berubah mengikuti rotasi logo.

       Lebarnya: logo yang kelihatan dari sudut sekarang, dikali 1,3
       (bayangan lebih lebar dari bendanya, biar kesan melayang).

       Gelap-gelapnya: pakai rasio lebar sekarang terhadap lebar
       TERLEBAR yang pernah terjadi. Makin pipih logonya, makin pudar
       bayangannya — sama seperti bayangan beneran.

       Jaraknya: jarak bawah logo ke bawah container yang dihitung di atas.
       CSS-nya yang menaruh bayangan tepat di bawah logo, dikasih celah. */
    const perbaruiBayangan = () => {
      const akar = akarRef.current
      if (!akar || !setengahFit || !lebarMaks) return
      const lebar = (lebarSekarang / (2 * setengahFit)) * 1.3
      const rasio = Math.min(1, lebarSekarang / lebarMaks)
      akar.style.setProperty('--lebar-bayang', `${(lebar * 100).toFixed(1)}%`)
      akar.style.setProperty('--padam-bayang', (0.35 + 0.65 * rasio).toFixed(3))
      akar.style.setProperty('--bawah-bayang', `${((jarakBawah / (2 * setengahFit)) * 100).toFixed(1)}%`)
    }

    let frame = 0
    let hidup = true
    let terlihat = true

    const gambar = () => {
      if (!hidup) return
      if (!terlihat) {
        frame = 0
        return
      }
      // Lampu kilas jalan terus selama logo kelihatan. Kalau pengguna minta
      // reduced motion, lampunya diem di tengah (cahaya tetap ada).
      lampu.ikutWaktu(performance.now(), !kurangiGerak)
      kontrol.update()
      majuKembali()
      pusatkanFrustum()
      perbaruiBayangan()
      renderer.render(scene, kamera)
      frame = requestAnimationFrame(gambar)
    }

    const loader = buatLoaderGLTF()
    loader.load(
      SUMBER_LOGO,
      (gltf) => {
        const model = gltf.scene

        // Normalisasi: center di origin, tinggi maksimal 1 (kamera menyesuaikan).
        const kotak = new THREE.Box3().setFromObject(model)
        const ukuran = new THREE.Vector3()
        kotak.getSize(ukuran)
        const tengah = new THREE.Vector3()
        kotak.getCenter(tengah)
        model.position.sub(tengah)
        const skala = 1 / Math.max(ukuran.x, ukuran.y)
        model.scale.setScalar(skala)

        model.traverse((anak) => {
          if (!anak.isMesh) return
          /* Material dipakai apa adanya dari file .glb.

             Dulu materialnya dipaksa jadi MeshBasicMaterial supaya aset lama
             (vertex color, tanpa texture) bisa dibaca. Aset sekarang sudah
             PBR: warna dasar per material (hitam, putih, merah), ada
             normal, dan TIDAK punya vertex color.

             Memaksanya jadi basic justru bikin logo mati: atribut `color`
             yang tidak ada di geometry diisi (0,0,0) oleh WebGL, jadi
             seluruh logo tergambar hitam pekat.

             Yang digeser di sini cuma warna dasarnya: angka sRGB dari file
             dikonversi ke linear, supaya di layar persis #0c0c0c, #f8fafc,
             dan #d70000. */
          if (anak.material) sewarnaMerek(anak.material)
          siapkanWarna(anak.geometry)
        })

        grup.add(model)
        grup.rotation.set(PUTAR_AWAL.x, PUTAR_AWAL.y, 0)

        // Frustum ortho ukuran tetap: cari half-extent terbesar dari bbox
        // untuk semua sudut rotasi. Nilai ini jadi ukuran jendela; posisinya
        // digeser tiap frame oleh pusatkanFrustum() supaya objek di tengah.
        grup.updateMatrixWorld(true)
        model.updateMatrixWorld(true)
        const kotakModel = new THREE.Box3().setFromObject(grup)
        sudutKotak.length = 0
        for (const x of [kotakModel.min.x, kotakModel.max.x]) {
          for (const y of [kotakModel.min.y, kotakModel.max.y]) {
            for (const z of [kotakModel.min.z, kotakModel.max.z]) {
              sudutKotak.push(new THREE.Vector3(x, y, z))
            }
          }
        }
        const kameraUji = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
        const uji = new THREE.Vector3()
        let perlu = 0
        for (let pol = POLAR_MIN; pol <= POLAR_MAX + 0.001; pol += 0.05) {
          for (let az = 0; az < Math.PI * 2; az += Math.PI / 24) {
            kameraUji.position.set(
              10 * Math.sin(pol) * Math.sin(az),
              10 * Math.cos(pol),
              10 * Math.sin(pol) * Math.cos(az),
            )
            kameraUji.lookAt(0, 0, 0)
            kameraUji.updateMatrixWorld()
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
            for (const sudut of sudutKotak) {
              uji.copy(sudut).applyMatrix4(kameraUji.matrixWorldInverse)
              if (uji.x < minX) minX = uji.x
              if (uji.x > maxX) maxX = uji.x
              if (uji.y < minY) minY = uji.y
              if (uji.y > maxY) maxY = uji.y
            }
            perlu = Math.max(perlu, (maxX - minX) / 2, (maxY - minY) / 2)
            // Lebar TERLEBAR logo dari semua sudut. Dipakai sebagai pembanding
            // buat tahu seberapa "muka" logonya sekarang, biar bayangan
            // bisa pudar kalau logonya belok jadi pipih.
            lebarMaks = Math.max(lebarMaks, maxX - minX)
          }
        }
        setengahFit = perlu * 1.03
        pusatkanFrustum()
        perbaruiBayangan()
        renderer.domElement.style.opacity = '1'
        gambar()
      },
      undefined,
      () => setGagal(true),
    )

    const ukurUlang = () => {
      const sisi = wadah.clientWidth
      if (!sisi) return
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(sisi, sisi, false)
    }
    const pengawasUkuran = new ResizeObserver(ukurUlang)
    pengawasUkuran.observe(wadah)
    ukurUlang()

    const pengawasTerlihat = new IntersectionObserver(([entri]) => {
      terlihat = entri.isIntersecting
      if (terlihat && !frame && hidup) gambar()
    })
    pengawasTerlihat.observe(wadah)

    return () => {
      hidup = false
      cancelAnimationFrame(frame)
      berhentiAmati()
      pengawasUkuran.disconnect()
      pengawasTerlihat.disconnect()
      kontrol.removeEventListener('start', saatMulai)
      kontrol.removeEventListener('end', saatSelesai)
      kontrol.dispose()
      renderer.dispose()
      scene.traverse((obj) => {
        obj.geometry?.dispose()
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
        else obj.material?.dispose()
      })
      if (renderer.domElement.parentNode === wadah) wadah.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={akarRef}
      className={`relative aspect-square w-full ${className}`}
      role="img"
      aria-label="Logo RaLabs tiga dimensi"
    >
      <div ref={wadahRef} className="h-full w-full" />
      {/* Bayangan logo: bikin logonya keliakan melayang. Elemennya di luar
          canvas (absolute), jadi layout hero nggak bergeser. Lebar, tingkat
          gelap, dan jaraknya ditulis dari loop render 3D lewat CSS var,
          jadi ngikutin rotasi logo. Lihat .logo-bayang di global.css. */}
      <div className="logo-bayang" aria-hidden="true" />
      {gagal && (
        <img
          src={CADANGAN}
          alt="Logo RaLabs"
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
    </div>
  )
}
