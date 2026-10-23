import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { buatLoaderGLTF } from './loaderGLTF.js'
import { buatKilat } from './Kilat3D.js'
import { DURASI_BUKA, AMPLITUDE_DITHER, progresBuka, nilaiLuma } from './luma.js'
import { SUMBER_LOGO, siapkanWarna, sewarnaMerek, pasangLampu } from './aset3d.js'

const CADANGAN = '/images/logo-preload.webp'
const PUTAR_AWAL = { x: 0.05, y: -0.32 }
const JEDA_SPIN = 2500

/* Pose kurus = tampilan saat halaman pertama kali dibuka.

   OrbitControls memutar KAMERA mengelilingi logo (autoRotate dan drag),
   bukan memutar logonya. Grup logo cuma di-set sekali saat model load
   (PUTAR_AWAL) dan tidak pernah berubah lagi. Artinya untuk "kembali ke
   pose kurus" yang harus dibalikkan adalah posisi kamera, yaitu titik
   tempat kamera berdiri saat load. */
const KAMERA_AWAL = new THREE.Vector3(0, 0, 10)
const DURASI_POSE_KURUS = 800 // ms, dari plan-prd/gerbang-masuk/design.md

/* Seragam untuk luma fade.

   Satu set uniform dipakai semua mesh logo: butiran dan ambang larutnya
   memang harus seragam di seluruh logo, bukan per bagian. Tiga mesh logo
   (hitam, putih, merah) punya warna dasar berbeda, tapi ambang larutnya
   satu, jadi nilai-nilai ini ditulis ke objek uniform yang sama. */
export function buatSeragam() {
  return {
    slope: { value: 0 },
    intercept: { value: 1 },
    amplitudo: { value: AMPLITUDE_DITHER },
    // 2 piksel device per butir. Di layar devicePixelRatio 2 itu 1 CSS px —
    // cukup halus untuk tidak terlihat sebagai "noise", tapi tetap memecah
    // muka yang warnanya rata jadi butiran.
    ukuranButir: { value: 2 },
  }
}

/* Pasang luma fade ke material logo.

   Logo gerbang larut dengan luma fade (referensi: Chung Dha, Luma Matte
   Transition): permukaan larut mengikuti terang-gelapnya sendiri, jadi
   yang paling terang duluan dan yang paling gelap paling akhir.

   Dulu ini ditulis sebagai ShaderMaterial tersendiri yang membaca warna
   dari vertex color. Aset logo sekarang menyimpan warna per MATERIAL
   (RALABS_Black, RALABS_White, RALABS_Red), bukan per vertex, jadi shader
   lama tidak punya warna untuk dibaca — hasilnya luma selalu nol dan
   larutnya jadi rata, bukan bertahap.

   Sekarang material PBR milik aset tetap dipakai apa adanya (bentuk,
   warna, dan pantulannya tetap benar), lalu shader-nya ditambah satu
   bagian kecil: alpha dikalikan ambang luma. Warna yang dibaca adalah
   `diffuse`, yaitu warna dasar material itu sendiri — linear, jadi
   putih 0.95 larut duluan, merah 0.14 menyusul, hitam 0.003 paling akhir.

   Dither tetap ada: tanpa itu, muka yang warnanya rata melewati ambang
   bersamaan dan hilang seperti blok yang kepotong.

   `diffuse` itu uniform milik material, jadi tiap mesh (masing-masing
   punya material sendiri) otomatis punya ambang luma sendiri tanpa perlu
   varying tambahan. */
export function pasangLumaFade(material, seragam) {
  material.transparent = true
  material.premultipliedAlpha = true
  material.onBeforeCompile = (shader) => {
    shader.uniforms.slope = seragam.slope
    shader.uniforms.intercept = seragam.intercept
    shader.uniforms.amplitudo = seragam.amplitudo
    shader.uniforms.ukuranButir = seragam.ukuranButir

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float slope;
        uniform float intercept;
        uniform float amplitudo;
        uniform float ukuranButir;

        /* Acak 0..1 dari koordinat layar. Hash sinus klasik — cukup untuk
           menentukan URUTAN piksel larut, bukan untuk keamanan apa pun. */
        float acakButir(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }`,
      )
      .replace(
        '#include <opaque_fragment>',
        `#include <opaque_fragment>
        /* Rec.709 — koefisien luminance standar, sama dengan luma matte video. */
        float lumaLogo = dot(diffuse, vec3(0.2126, 0.7152, 0.0722));
        float butirLogo = (acakButir(floor(gl_FragCoord.xy / ukuranButir)) - 0.5) * amplitudo;
        gl_FragColor.a *= clamp(intercept + slope * (lumaLogo + butirLogo), 0.0, 1.0);`,
      )
  }
}

/* LogoGerbang: logo untuk layar gerbang, bukan untuk hero.

   Bedanya dengan Logo3D: komponen ini bisa DIJADA dari luar lewat prop
   `masuk`, dan dia yang menjalankan urutan gerbang di atas scene-nya sendiri.

   Urutannya (plan-prd/gerbang-masuk):
   1. `masuk` berubah true -> spin dan drag mati, kamera dipendingarkan balik
      ke pose kurus selama DURASI_POSE_KURUS (800ms).
   2. Pose kurus tercapai -> tiga kilat jalan di scene yang sama (Kilat3D),
      1.2 detik, sekali jalan.
   3. Kilat habis -> `onKilatSelesai` dipanggil sekali. Di situlah titik
      Gerbang mulai melarutkan permukaannya dengan luma fade (langkah 3).
   `onPoseKurus` tetap dipanggil di antara langkah 1 dan 2, kalau ada yang
   perlu tahu momennya.

   Kilatnya sengaja ditaruh di sini, bukan di komponen React terpisah:
   ray-nya harus menyusuri TEPI logo yang asli, jadi harus berbagi scene,
   geometri, dan loop render yang sama.

   Modelnya tetap file yang sama: /images/logo-ralabs-3d.glb.
   Logo3D.jsx sengaja tidak disentuh karena dia milik hero. */
export default function LogoGerbang({
  masuk = false,
  membuka = false,
  onPoseKurus,
  onKilatSelesai,
  className = '',
}) {
  const wadahRef = useRef(null)
  const [gagal, setGagal] = useState(false)

  // Jembatan dari closure three.js (di dalam useEffect) ke prop terbaru.
  // Tanpa ini, callback yang tertangkap closure bisa basi.
  const selesaiRef = useRef(onPoseKurus)
  useEffect(() => {
    selesaiRef.current = onPoseKurus
  }, [onPoseKurus])

  const kilatSelesaiRef = useRef(onKilatSelesai)
  useEffect(() => {
    kilatSelesaiRef.current = onKilatSelesai
  }, [onKilatSelesai])

  // Isinya object biasa, bukan nilai React: motorRef boleh diubah diam-diam
  // oleh kode three.js tanpa memicu render ulang.
  const motorRef = useRef(null)
  const kilatRef = useRef(null)
  // Seragam uniform luma fade, supaya efek larut bisa menulis nilainya dari
  // luar closure model. Dibuat sekali per komponen, lalu dipakai bersama
  // oleh semua mesh logo.
  const seragamRef = useRef(null)
  if (!seragamRef.current) seragamRef.current = buatSeragam()

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

    /* Lampu. Gerbang selalu berdiri di atas tinta pekat #0c0c0c, jadi rig
       gelap yang dipakai: muka putih dan merah yang membawa logo.

       `denganKilas` menyalakan lampu kembar yang pelan-pelan menyusul di
       depan dan belakang logo, sama seperti di hero. Efeknya jalan juga
       waktu logo masih berputar, dan tetap jalan waktu logo balik ke pose
       kurus. */
    const lampu = pasangLampu(scene, { denganKilas: true })
    lampu.setTema('gelap')

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
    kontrol.target.set(0, 0, 0)
    kontrol.autoRotate = !kurangiGerak
    kontrol.autoRotateSpeed = 0.9
    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.style.cursor = 'grab'

    let jedaSpin = 0

    // Dipakai bersama oleh mulaiPoseKurus() dan majuPoseKurus().
    const offset = new THREE.Vector3()
    const sph = new THREE.Spherical()

    /* --- Urutan masuk (langkah 1) ------------------------------------
       Dipanggil sekali dari prop `masuk`. Setelah ini logo tidak akan
       berputar lagi dan tidak bisa di-drag. Urusan kilat ada di
       majuPoseKurus(), begitu pose kurusnya sampai. */
    const mulaiPoseKurus = () => {
      const m = motorRef.current
      if (!m || m.aktif) return
      m.aktif = true
      m.mulai = performance.now()

      kontrol.autoRotate = false
      kontrol.enableRotate = false // drag mati selama urutan gerbang
      window.clearTimeout(jedaSpin) // timer "nyalain spin lagi" dibatalkan
      renderer.domElement.style.cursor = 'default'

      // Posisi mulai bisa di mana saja (hasil spin / drag), jadi ditangkap
      // sekali di sini, bukan dihitung ulang tiap frame (kalau dihitung
      // ulang, easing-nya jadi kejar-kejaran, bukan animasi).
      offset.copy(kamera.position).sub(kontrol.target)
      m.dari.setFromVector3(offset)
      offset.copy(KAMERA_AWAL).sub(kontrol.target)
      m.ke.setFromVector3(offset)

      // theta (putaran horizontal) dibawa lewat jalur terpendek, supaya
      // logo tidak muter arah panjang cuma untuk balik ke sudut awal.
      const selisih = m.ke.theta - m.dari.theta
      m.deltaTheta = Math.atan2(Math.sin(selisih), Math.cos(selisih))
      m.deltaPhi = m.ke.phi - m.dari.phi
    }

    // Di-render tiap frame SETELAH kontrol.update(), supaya nilainya yang
    // menang terakhir dan gerakannya persis seperti yang dihitung di sini.
    const majuPoseKurus = () => {
      const m = motorRef.current
      if (!m || !m.aktif) return

      const t = Math.min(1, (performance.now() - m.mulai) / DURASI_POSE_KURUS)
      // ease in-out: pelan di awal, kencang di tengah, pelan di akhir.
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

      if (t < 1) {
        sph.radius = m.dari.radius + (m.ke.radius - m.dari.radius) * e
        sph.phi = m.dari.phi + m.deltaPhi * e
        sph.theta = m.dari.theta + m.deltaTheta * e
        kamera.position.setFromSpherical(sph).add(kontrol.target)
        return
      }

      // Selesai: kunci kamera di pose kurus. Damping OrbitControls masih
      // menyisakan sisa putaran kecil tiap frame; tanpa pengunci ini logo
      // perlahan menjauh lagi dari pose kurus setelah animasi berakhir.
      kamera.position.copy(KAMERA_AWAL)
      if (!m.selesai) {
        m.selesai = true
        // Pose kurus sudah dapat: tiga kilat langsung jalan (langkah 2),
        // tanpa jeda.
        kilatRef.current?.mulai(() => {
          // Kilat habis -> buka layar (langkah 3). Gerbang larut sendiri
          // lewat luma fade di Gerbang.jsx; di sini cukup memberi tahu.
          kilatSelesaiRef.current?.()
        })
        selesaiRef.current?.()
      }
    }

    // Motor disimpan sebelum model selesai load, supaya klik Masuk yang
    // datang saat model masih mengunduh tetap terhitung.
    motorRef.current = {
      aktif: false,
      selesai: false,
      mulai: 0,
      dari: new THREE.Spherical(),
      ke: new THREE.Spherical(),
      deltaTheta: 0,
      deltaPhi: 0,
      mulaiPoseKurus,
    }

    const saatMulai = () => {
      kontrol.autoRotate = false
      renderer.domElement.style.cursor = 'grabbing'
      window.clearTimeout(jedaSpin)
    }
    const saatSelesai = () => {
      // Urutan gerbang sudah jalan: spin tidak boleh hidup lagi.
      if (motorRef.current?.aktif) {
        renderer.domElement.style.cursor = 'default'
        return
      }
      renderer.domElement.style.cursor = 'grab'
      if (kurangiGerak) return
      window.clearTimeout(jedaSpin)
      jedaSpin = window.setTimeout(() => {
        if (motorRef.current?.aktif) return
        kontrol.autoRotate = true
      }, JEDA_SPIN)
    }
    kontrol.addEventListener('start', saatMulai)
    kontrol.addEventListener('end', saatSelesai)

    const titikUji = new THREE.Vector3()

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
      // Lampu kilas jalan terus, sama seperti di hero. Kalau pengguna minta
      // reduced motion, lampunya diem di tengah (cahaya tetap ada).
      lampu.ikutWaktu(performance.now(), !kurangiGerak)
      kontrol.update()
      majuPoseKurus()
      kilatRef.current?.maju() // warna ray diperbarui sesuai progres kilat
      pusatkanFrustum()
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
          /* Material dari file .glb dipakai apa adanya: PBR, warna dasar
             per bagian (hitam, putih, merah), ada normal.

             Dulu semua mesh dipaksa satu ShaderMaterial yang baca warna
             dari vertex color. Aset sekarang tidak punya vertex color, jadi
             shader lama tidak punya apa-apa untuk dibaca: luma selalu nol
             dan larutnya jadi rata. Sekarang luma diambil dari warna dasar
             material (lihat pasangLumaFade), jadi tiap muka punya ambang
             larutnya sendiri: putih dulu, merah menyusul, hitam terakhir.

             Seragam uniform-nya satu untuk semua mesh (butiran dan ambang
             larutnya memang harus seragam di seluruh logo), tapi tiap
             material tetap terpisah supaya warnanya tidak ketuker. */
          const mat = anak.material
          if (!mat) return
          sewarnaMerek(mat)
          pasangLumaFade(mat, seragamRef.current)
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
          }
        }
        setengahFit = perlu * 1.03
        pusatkanFrustum()

        // Tepi logo sudah siap dipakai: kumpulkan sekarang, nyalakan nanti
        // begitu pose kurus tercapai. Posisinya sudah dunia dan logo sudah
        // beku, jadi cukup dihitung sekali di sini.
        kilatRef.current = buatKilat({
          scene,
          grup,
          ukurLayar: () => ({
            x: wadah.clientWidth || 1,
            y: wadah.clientHeight || 1,
          }),
        })

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
      // Lebar garis kilat dihitung dari ukuran layar, jadi ikut disesuaikan.
      kilatRef.current?.ubahUkur(sisi, sisi)
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
      pengawasUkuran.disconnect()
      pengawasTerlihat.disconnect()
      window.clearTimeout(jedaSpin)
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
      kilatRef.current?.mati()
      kilatRef.current = null
      motorRef.current = null
    }
  }, [])

  // Klik Masuk di Gerbang mengubah prop ini → urutan pose kurus mulai.
  useEffect(() => {
    if (masuk) motorRef.current?.mulaiPoseKurus()
  }, [masuk])

  /* Larutkan logo (langkah 3, bagian logo).

     Gerbang.jsx juga punya loop sendiri untuk memudarkan latar dan tombol.
     Keduanya memakai progresBuka() yang sama dan durasi yang sama, jadi
     sinkron tanpa perlu satu motor bersama.

     Nilai uniform ditulis langsung, bukan lewat state React: kalau lewat
     state, tiap frame memicu render ulang seluruh komponen tiga dimensi dan
     gerakannya patah-patah. */
  useEffect(() => {
    const seragam = seragamRef.current
    if (!seragam) return undefined

    if (!membuka) {
      // Belum buka: alpha 1 di mana-mana, tampilan identik seperti sebelumnya.
      seragam.slope.value = 0
      seragam.intercept.value = 1
      return undefined
    }

    const mulai = performance.now()
    let frame = 0
    const langkah = () => {
      const t = Math.min(1, (performance.now() - mulai) / DURASI_BUKA)
      const { slope, intercept } = nilaiLuma(progresBuka(t))
      seragam.slope.value = slope
      seragam.intercept.value = intercept

      if (t < 1) frame = requestAnimationFrame(langkah)
    }
    frame = requestAnimationFrame(langkah)

    return () => cancelAnimationFrame(frame)
  }, [membuka])

  return (
    <div
      className={`relative aspect-square w-full ${className}`}
      role="img"
      aria-label="Logo RaLabs tiga dimensi"
    >
      <div ref={wadahRef} className="h-full w-full" />
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
