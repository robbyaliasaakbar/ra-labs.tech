import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Warna dari palet. Tinta untuk garis tepi, kertas untuk bidang, merah untuk aksen.
const KERTAS = 0xf8fafc
const TINTA = 0x0c0c0c
const MERAH = 0xd70000

const SISI = 1
const TEBAL_GARIS = 0.024
// Tanda di logo-preload.webp sedikit lebih tinggi dari kubus isometrik murni.
// Proporsi dihitung dari berkas: rusuk vertikal 0.494 dari tinggi siluet, rasio 1.279.
const REGANG_VERTIKAL = 1.1721

/**
 * Kubus RaLabs dari geometry, mengikuti tanda di logo-preload.webp:
 * heksagon isometrik, bidang kertas flat, tepi tinta, tiga aksen merah.
 */
function buatKubus() {
  const grup = new THREE.Group()

  const bahanKertas = new THREE.MeshBasicMaterial({ color: KERTAS })
  const bahanTinta = new THREE.MeshBasicMaterial({ color: TINTA })
  const bahanMerah = new THREE.MeshBasicMaterial({ color: MERAH })

  // Bidang kubus. Tanpa lighting, jadi rata seperti tanda.
  grup.add(new THREE.Mesh(new THREE.BoxGeometry(SISI, SISI, SISI), bahanKertas))

  // Dua belas rusuk digambar sebagai batang tipis, supaya tebal garis terkontrol.
  const setengah = SISI / 2
  const rusuk = [
    { pos: [0, -setengah, -setengah], ukur: [SISI, TEBAL_GARIS, TEBAL_GARIS] },
    { pos: [0, setengah, -setengah], ukur: [SISI, TEBAL_GARIS, TEBAL_GARIS] },
    { pos: [0, -setengah, setengah], ukur: [SISI, TEBAL_GARIS, TEBAL_GARIS] },
    { pos: [0, setengah, setengah], ukur: [SISI, TEBAL_GARIS, TEBAL_GARIS] },
    { pos: [-setengah, 0, -setengah], ukur: [TEBAL_GARIS, SISI, TEBAL_GARIS] },
    { pos: [setengah, 0, -setengah], ukur: [TEBAL_GARIS, SISI, TEBAL_GARIS] },
    { pos: [-setengah, 0, setengah], ukur: [TEBAL_GARIS, SISI, TEBAL_GARIS] },
    { pos: [setengah, 0, setengah], ukur: [TEBAL_GARIS, SISI, TEBAL_GARIS] },
    { pos: [-setengah, -setengah, 0], ukur: [TEBAL_GARIS, TEBAL_GARIS, SISI] },
    { pos: [setengah, -setengah, 0], ukur: [TEBAL_GARIS, TEBAL_GARIS, SISI] },
    { pos: [-setengah, setengah, 0], ukur: [TEBAL_GARIS, TEBAL_GARIS, SISI] },
    { pos: [setengah, setengah, 0], ukur: [TEBAL_GARIS, TEBAL_GARIS, SISI] },
  ]
  for (const { pos, ukur } of rusuk) {
    const batang = new THREE.Mesh(new THREE.BoxGeometry(...ukur), bahanTinta)
    batang.position.set(...pos)
    grup.add(batang)
  }

  // Aksen 1: rhombus merah di bidang atas, condong ke belakang-kiri.
  // Posisi dari berkas: pusat merah di u 0.364, sedikit di atas garis W-E.
  const atas = new THREE.Mesh(new THREE.PlaneGeometry(0.481, 0.481), bahanMerah)
  atas.rotation.x = -Math.PI / 2
  atas.position.set(-0.2, setengah + 0.001, 0.076)
  grup.add(atas)

  // Aksen 2: bidang merah di pojok bawah bidang kanan (+x).
  const kanan = new THREE.Mesh(new THREE.PlaneGeometry(0.376, 0.301), bahanMerah)
  kanan.rotation.y = Math.PI / 2
  kanan.position.set(setengah + 0.001, -0.32, -0.224)
  grup.add(kanan)

  // Aksen 3: bar vertikal merah di luar tepi kiri, sepanjang bagian tengah.
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.037, 0.363, 0.037), bahanMerah)
  bar.position.set(-0.518, 0, 0.53)
  grup.add(bar)

  grup.scale.set(1, REGANG_VERTIKAL, 1)
  return grup
}

export default function Kubus({ ukuran = 232 }) {
  const wadahRef = useRef(null)

  useEffect(() => {
    const wadah = wadahRef.current
    if (!wadah) return undefined

    const kurangiGerak = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(ukuran, ukuran)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    wadah.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    // Orthographic: garis sejajar tetap sejajar, seperti tanda.
    // Tinggi kamera 1.02 dipilih supaya rusuk vertikal jadi 0.494 dari tinggi siluet.
    const kamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    kamera.position.set(1, 1.2006, 1)
    kamera.lookAt(0, 0, 0)
    kamera.zoom = 1
    kamera.updateProjectionMatrix()

    const kubus = buatKubus()
    scene.add(kubus)

    let frame = 0
    const jam = new THREE.Clock()

    const gambar = () => {
      if (!kurangiGerak) kubus.rotation.y = jam.getElapsedTime() * 0.28
      renderer.render(scene, kamera)
      frame = requestAnimationFrame(gambar)
    }
    gambar()

    return () => {
      cancelAnimationFrame(frame)
      renderer.dispose()
      kubus.traverse(obj => {
        obj.geometry?.dispose()
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
        else obj.material?.dispose()
      })
      if (renderer.domElement.parentNode === wadah) wadah.removeChild(renderer.domElement)
    }
  }, [ukuran])

  return <div ref={wadahRef} className="block" style={{ width: ukuran, height: ukuran }} aria-hidden="true" />
}
