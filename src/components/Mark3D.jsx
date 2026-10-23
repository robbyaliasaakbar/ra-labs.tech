import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { buatLoaderGLTF } from './loaderGLTF.js'
import { siapkanWarna } from './aset3d.js'

const PUTAR_AWAL = { x: 0.05, y: -0.32 }
/* Posisi kamera saat mark pertama kali muncul. OrbitControls memutar
   KAMERA mengelilingi logo, bukan memutar logonya, jadi "lurus depan"
   berarti kamera balik ke titik ini. Sama persis dengan Logo3D.jsx. */
const KAMERA_AWAL = new THREE.Vector3(0, 0, 10)
/* Lama animasi balik ke lurus depan, ms. */
const DURASI_KEMBALI = 800
const POLAR_MIN = 0.35
const POLAR_MAX = Math.PI - 0.35
/* Logo tengah cuma 3% (1.03). Mark kecil butuh napas lebih lega supaya
   badan tidak kepotong saat diputar vertikal. */
const NAPAS = 1.18

/* Mark kecil di kluster CTA. Perilaku sama dengan Logo3D (spin + drag),
   tapi sumbernya prop dan tidak ada gambar cadangan. */
export default function Mark3D({ sumber, label }) {
  const wadahRef = useRef(null)

  useEffect(() => {
    const wadah = wadahRef.current
    if (!wadah) return undefined

    const kurangiGerak = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
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
    const kamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    kamera.position.set(0, 0, 10)
    kamera.lookAt(0, 0, 0)

    const grup = new THREE.Group()
    scene.add(grup)
    /* Dua aset ini sama-sama bahan PBR, jadi lampu ini yang bikin bentuknya
       terbaca: Indeep punya ramp kuning, Ibborarts punya body merah.
       Tanpa lampu, ramp kuningnya jatuh ke hitam.

       Keyline putih Ibborarts punya emissive sendiri, jadi dia tetap terang
       walau lampunya pelar. */
    scene.add(new THREE.AmbientLight(0xffffff, 1.15))
    const utama = new THREE.DirectionalLight(0xffffff, 2.1)
    utama.position.set(2.2, 3.4, 4)
    scene.add(utama)
    const isi = new THREE.DirectionalLight(0xffffff, 0.7)
    isi.position.set(-3, -1.5, -2)
    scene.add(isi)

    const sudutKotak = []
    let setengahFit = 0

    const kontrol = new OrbitControls(kamera, renderer.domElement)
    kontrol.enablePan = false
    kontrol.enableZoom = false
    kontrol.enableDamping = true
    kontrol.dampingFactor = 0.08
    kontrol.rotateSpeed = 0.9
    kontrol.minPolarAngle = POLAR_MIN
    kontrol.maxPolarAngle = POLAR_MAX
    kontrol.target.set(0, 0, 0)
    kontrol.autoRotate = !kurangiGerak
    kontrol.autoRotateSpeed = 0.9
    renderer.domElement.style.touchAction = 'none'
    renderer.domElement.style.cursor = 'grab'

    /* ---- Balik ke lurus depan ----
       Lepas drag: kamera pelan-pelan balik ke KAMERA_AWAL, lalu spin
       dinyalakan lagi. Cara persis yang dipakai Logo3D.jsx. */
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
      kontrol.update()
      majuKembali()
      pusatkanFrustum()
      renderer.render(scene, kamera)
      frame = requestAnimationFrame(gambar)
    }

    const loader = buatLoaderGLTF()
    loader.load(
      sumber,
      (gltf) => {
        if (!hidup) return
        const model = gltf.scene
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
          /* Material dibiarkan begitu adanya, seperti yang dibuat GLTFLoader
             dari file aset: PBR, emissive, clearcoat, atau unlit, semua
             ikut apa yang ditulis di .glb. Yang digeser di sini cuma
             warna verteksnya (sRGB -> linear).

             Dulu materialnya dipaksa jadi MeshBasicMaterial supaya hasil
             rata. Sekarang tidak lagi: aset ibborarts yang baru memang
             sengaja PBR, ada keyline putih emissive, dan aset itu punya
             normal buat disorot lampu. */
          siapkanWarna(anak.geometry)
        })

        grup.add(model)
        grup.rotation.set(PUTAR_AWAL.x, PUTAR_AWAL.y, 0)

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
        setengahFit = perlu * NAPAS
        pusatkanFrustum()
        renderer.domElement.style.opacity = '1'
        gambar()
      },
      undefined,
      () => {
        hidup = false
        cancelAnimationFrame(frame)
        if (renderer.domElement.parentNode === wadah) wadah.removeChild(renderer.domElement)
      },
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
  }, [sumber])

  return (
    <div
      className="mark-3d relative aspect-square"
      role="img"
      aria-label={label}
    >
      <div ref={wadahRef} className="h-full w-full" />
    </div>
  )
}
