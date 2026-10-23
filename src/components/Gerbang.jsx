import { useEffect, useRef } from 'react'
import HeroClock from './HeroClock.jsx'
import LogoGerbang from './LogoGerbang.jsx'
import RotatingText from './RotatingText.jsx'
import SideRays from './SideRays.jsx'
import TiltTombol from './TiltTombol.jsx'
import { DURASI_BUKA, progresBuka } from './luma.js'

/**
 * Gerbang: layar pertama, bukan halaman kedua.
 * Dialog, fokus masuk ke tombol Buka Website. Escape tidak menutup,
 * karena tidak ada halaman di belakangnya sebelum dibuka.
 * Logo pakai GLB yang sama kayak hero (logo-ralabs-3d.glb):
 * satu file BISA dipakai dua section, browser cache otomatis,
 * jadi tidak perlu clone/duplikat 1.5MB.
 *
 * Logo di sini LogoGerbang, bukan Logo3D. Gerbang butuh perilaku sendiri:
 * begitu Buka Website diklik, spin dan drag mati lalu logo balik ke pose kurus,
 * disusul tiga kilat menyusuri tepinya. Logo3D tidak punya saklar itu dan
 * tidak boleh diubah (milik hero), jadi gerbang memakai file sendiri
 * sesuai spec.md. Semua urutan itu jalan di dalam LogoGerbang sendiri.
 *
 * Setelah kilat habis, gerbang dibuka dengan LUMA FADE (referensi:
 * Chung Dha, Luma Matte Transition). Bukan lubang yang membesar dan bukan
 * opacity fade: permukaan gerbang larut mengikuti terang-gelap pikselnya
 * sendiri — yang paling terang duluan, hitam latar paling akhir. Homepage
 * yang sudah menunggu di belakang nembus pertama lewat muka logo yang
 * terang, lalu menyebar.
 *
 * PEMBAGIAN KERJANYA — dua bagian, bukan satu filter lagi:
 *
 *   1. LOGO  -> shader WebGL di LogoGerbang.jsx. Di situlah letak segala
 *      yang warnanya rata (muka putih, muka merah, muka hitam), dan di
 *      situlah letak butiran/dither yang bikin larutnya halus. Mengerjakan
 *      ini di shader juga berarti tidak ada rasterisasi ulang elemen
 *      berlayar-penuh tiap frame.
 *
 *   2. LATAR + TOMBOL -> opacity biasa lewat CSS. Latarnya nyaris hitam
 *      pekat sehingga tidak punya masalah "muka rata yang kepotong"; yang
 *      pekat itu justru mau diredupkan merata. Memudar lewat opacity
 *      memakai kompositor GPU dan praktis gratis.
 *
 * Keduanya dijalankan dua loop terpisah tapi memakai progresBuka() dan
 * DURASI_BUKA dari luma.js yang sama, jadi waktunya identik.
 */
export default function Gerbang({
  masuk = false,
  membuka = false,
  onMasuk,
  onPoseKurus,
  onKilatSelesai,
  onTerbuka,
}) {
  const permukaanRef = useRef(null)
  const tombolRef = useRef(null)

  // Callback lewat ref supaya identitasnya tidak berubah tiap render.
  // Kalau tidak, efek buka layar ikut restart tiap Portal render ulang.
  const terbukaRef = useRef(onTerbuka)
  useEffect(() => {
    terbukaRef.current = onTerbuka
  }, [onTerbuka])

  // Scroll halaman dikunci selama gerbang ada.
  useEffect(() => {
    const sebelumnya = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = sebelumnya
    }
  }, [])

  // Fokus masuk ke tombol Buka Website, tanpa cincin merah.
  // focus() polos menyalakan :focus-visible, jadi outline 3px langsung
  // kelihatan. "Lihat Bisnis Saya" tidak di-fokus otomatis, jadi
  // cincinnya tidak ada. focusVisible: false menyamakan tampilan itu.
  // Tab berikutnya tetap menyalakan cincin.
  useEffect(() => {
    tombolRef.current?.focus({ preventScroll: true, focusVisible: false })
  }, [])

  /* Buka layar: redupkan latar dan tombol Buka Website selama DURASI_BUKA.

     Nilai ditulis langsung ke DOM tiap frame, bukan lewat state React:
     kalau lewat state, tiap frame memicu render ulang seluruh gerbang dan
     gerakannya patah-patah.

     Logo TIDAK diurus di sini — dia larut sendiri lewat shader WebGL di
     LogoGerbang.jsx. Yang di sini cuma bagian yang memudar merata. */
  useEffect(() => {
    if (!membuka) return undefined

    const permukaan = permukaanRef.current
    if (!permukaan) {
      terbukaRef.current?.()
      return undefined
    }

    const mulai = performance.now()
    let frame = 0
    const langkah = () => {
      const t = Math.min(1, (performance.now() - mulai) / DURASI_BUKA)
      const e = progresBuka(t)

      // Latar ada di pseudo-element ::before supaya warna dasar dan
      // gradient-nya bisa diredupkan sebagai satu kesatuan, tanpa perlu
      // lapisan div tambahan di dalam layout flex.
      permukaan.style.setProperty('--gerbang-latar', String(1 - e))
      // Tombol ikut larut BERSAMAAN, bukan hilang duluan.
      if (tombolRef.current) tombolRef.current.style.opacity = String(1 - e)

      if (t < 1) {
        frame = requestAnimationFrame(langkah)
        return
      }
      terbukaRef.current?.()
    }
    frame = requestAnimationFrame(langkah)

    return () => cancelAnimationFrame(frame)
  }, [membuka])

  // Klik kedua diabaikan. aria-disabled (bukan atribut disabled) supaya
  // fokus keyboard tidak jatuh ke <body> di tengah urutan gerbang.
  const klikMasuk = () => {
    if (masuk) return
    onMasuk?.()
  }

  return (
    <div
      ref={permukaanRef}
      role="dialog"
      aria-modal="true"
      aria-label="Gerbang RaLabs"
      className="gerbang-surface fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 text-kertas"
      style={{ height: '100dvh' }}
    >
      {/* Surface gerbang: SideRays di atas tinta pekat #0c0c0c.
          Menggantikan .gerbang-surface::before lama (grain + 3 radial gradient).

          Pembungkus .gerbang-latar yang memegang opasitas DOM, bukan SideRays:
          prop opacity milik SideRays masuk ke shader, bukan ke elemen. Jadi
          --gerbang-latar (ditulis tiap frame oleh efek membuka di bawah) bisa
          tetap menurunkan seluruh lapisan sinar sebagai satu kesatuan.

          Settingan props dikunci Bang Rob. JANGAN diubah tanpa izin. */}
      <div className="gerbang-latar" aria-hidden="true">
        <SideRays
          rayColor1="#f8fafc"
          rayColor2="#ffe578"
          blend={0.16}
          origin="top-right"
          speed={1.8}
          intensity={3.45}
          spread={2.2}
          density={6}
          sharpness={0.2}
          tilt={9}
          falloff={1}
          glow={0}
          saturation={1.25}
          dust={0}
          mouseInfluence={0.43}
          opacity={1}
          followMouse={false}
          intro={true}
          lightMode={false}
        />
      </div>

      <div className="w-[min(420px,80vw)]">
        <LogoGerbang
          masuk={masuk}
          membuka={membuka}
          onPoseKurus={onPoseKurus}
          onKilatSelesai={onKilatSelesai}
        />
      </div>
      {/* Tombol Buka Website memakai gaya CTA hero (pill merah + tilt), ref tetap
          di <button> supaya auto-focus tidak pindah ke pembungkus.
          Setelah diklik tombolnya dimatikan secara visual. Waktu buka
          nanti tombol ini ikut larut bersama latar — bukan hilang duluan —
          karena opasitasnya ditulis dari loop yang sama. */}
      <TiltTombol>
        <button
          ref={tombolRef}
          type="button"
          onClick={klikMasuk}
          aria-disabled={masuk}
          className={`tombol-merah-pill ${masuk ? 'pointer-events-none opacity-60' : ''}`}
        >
          Buka Website
        </button>
      </TiltTombol>

      {/* Rotating text di pojok kiri bawah. Posisi absolute keluar dari
          aliran flex center, jadi tidak menggeser logo atau tombol.
          Warnanya tinta (dikunci di CSS), bukan var(--teks): surface
          gerbang selalu terang. Highlight merah sama seperti hero. */}
      <div className="pointer-events-none absolute bottom-12 left-6 z-10 md:bottom-16 md:left-10">
        <p className="gerbang-baris-teks">
          <span className="gerbang-kata-diam">Building</span>
          <RotatingText
            texts={['Apps', 'Websites', 'Tools']}
            effect="drop"
            splitBy="characters"
            staggerFrom="random"
            staggerDuration={0.065}
            blur={11}
            highlight={true}
            highlightColor="#D70000"
            rotationInterval={2000}
            splitLevelClassName="overflow-hidden pb-0.5"
          />
        </p>
      </div>

      {/* Jam di pojok kanan bawah, sejajar tinggi dengan rotating text.
          Komponen HeroClock dipakai ulang; warna dan ukuran di-override
          lewat .gerbang-jam di global.css. */}
      <div className="pointer-events-none absolute bottom-12 right-6 z-10 md:bottom-16 md:right-10">
        <div className="gerbang-jam">
          <HeroClock />
        </div>
      </div>
    </div>
  )
}
