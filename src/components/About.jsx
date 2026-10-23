import { useEffect, useRef, useState } from 'react'
import CircularCarousel from './CircularCarousel.jsx'
import TiltTombol from './TiltTombol.jsx'
import './CircularCarousel.css'

// 10 kartu proyek. Gambar 540x540 WebP (rasio 1:1) di public/images/about/.
// Bentuk objek {src, alt, title, subtitle} mengikuti kontrak props
// CircularCarousel: alt dibacakan screen reader, title/subtitle dipakai
// aria-label kartu (caption visual sudah dilepas).
const kartu = [
  {
    src: '/images/about/Apps-Booking-InDeepCleaningID.webp',
    alt: 'Tangkapan layar aplikasi Booking InDeep Cleaning ID',
    title: 'Booking InDeep',
    subtitle: 'Apps'
  },
  {
    src: '/images/about/Apps-CRM.webp',
    alt: 'Tangkapan layar aplikasi CRM',
    title: 'CRM',
    subtitle: 'Apps'
  },
  {
    src: '/images/about/Apps-CV-Screening.webp',
    alt: 'Tangkapan layar aplikasi CV Screening',
    title: 'CV Screening',
    subtitle: 'Apps'
  },
  {
    src: '/images/about/Apps-Content-OS.webp',
    alt: 'Tangkapan layar aplikasi Content OS',
    title: 'Content OS',
    subtitle: 'Apps'
  },
  {
    src: '/images/about/Apps-Invoice-InDeepCleaningID.webp',
    alt: 'Tangkapan layar aplikasi Invoice InDeep Cleaning ID',
    title: 'Invoice InDeep',
    subtitle: 'Apps'
  },
  {
    src: '/images/about/Apps-JobTracker.webp',
    alt: 'Tangkapan layar aplikasi JobTracker',
    title: 'JobTracker',
    subtitle: 'Apps'
  },
  {
    src: '/images/about/Digital-Employee.webp',
    alt: 'Tangkapan layar sistem Digital Employee',
    title: 'Digital Employee',
    subtitle: 'Sistem'
  },
  {
    src: '/images/about/Tools-35B-Model-On-Rx-6700-XT.webp',
    alt: 'Tangkapan layar eksperimen model 35B di RX 6700 XT',
    title: '35B Model RX 6700 XT',
    subtitle: 'Tools'
  },
  {
    src: '/images/about/Website-inDeepCleaningID.webp',
    alt: 'Tangkapan layar website InDeep Cleaning ID',
    title: 'Website InDeep',
    subtitle: 'Website'
  },
  {
    src: '/images/about/Websites-Portfolio.webp',
    alt: 'Tangkapan layar website portfolio',
    title: 'Portfolio',
    subtitle: 'Website'
  }
]

export default function About() {
  const wadahRef = useRef(null)
  const [tampil, setTampil] = useState(false)

  useEffect(() => {
    const cek = () => {
      const el = wadahRef.current
      if (!el) return
      // Aktifkan animasi saat About section mulai masuk pandangan (75% tinggi viewport)
      if (el.getBoundingClientRect().top < window.innerHeight * 0.75) {
        setTampil(true)
      }
    }
    cek()
    window.addEventListener('scroll', cek, { passive: true })
    window.addEventListener('resize', cek)
    return () => {
      window.removeEventListener('scroll', cek)
      window.removeEventListener('resize', cek)
    }
  }, [])

  return (
    <section id="about" className="latar-bengkel-about text-teks">
      <div className="mx-auto grid max-w-6xl md:grid-cols-2">
        <div className="min-w-0 px-4 pt-12 pb-6 md:py-24">
          <h2 className="judul-bagian font-copy font-normal">
            Ini adalah portal dari semua project yang dibuat, dimaintain, dan didevelop secara pribadi maupun dengan tim.
          </h2>
          <p className="isi mt-6 font-copy font-normal">
            Lihat Experiment Project.
          </p>
          {/* TiltTombol cuma pembungkus gerak (sama seperti CTA hero);
              klik tetap ditangkap <a>. */}
          <TiltTombol className="mt-10">
            <a
              href="https://robbyaliasaakbar.github.io/experiments-list.html"
              target="_blank"
              rel="noopener noreferrer"
              className="tombol-merah-pill"
            >
              Lihat Experiment Project
            </a>
          </TiltTombol>
        </div>

        <div className="flex min-w-0 items-center justify-center px-4 pt-2 pb-12 md:py-24">
          {/* Tinggi eksplisit wajib: CSS CircularCarousel root-nya height 100%,
              tanpa tinggi dari wadah ini kanvasnya nol dan tidak ada yang tampil.
              Nilai clamp titik awal, boleh di-tune Bang Rob.
              Batas aman: spanY ring konstan ~205px, jadi tinggi wadah cukup
              >= 0.378 * lebar wadah supaya fit tetap width-limited (kartu
              tidak mengecil). Titik terberat vw 357: 150 vs 121 (aman 29px).
              Sudah dicek empiris di vw 360-1440. */}
          <div
            ref={wadahRef}
            className="relative w-full"
            style={{ height: 'clamp(150px, 42vw, 360px)' }}
          >
            {/* Gallery Turntable Podium (Meja Putar Galeri Khusus Tema Terang) */}
            <div
              className="podium-turntable pointer-events-none absolute top-[61%] md:top-[63%] left-1/2 -translate-x-1/2 select-none"
              aria-hidden="true"
            >
              {/* Halo cahaya warm gallery di belakang kartu carousel */}
              <div className="podium-halo-warm" />
              <div className="podium-bayangan" />
              {/* Slab silinder fisik untuk ketebalan 3D nyata */}
              <div className="podium-slab-tebal" />
              {/* Piringan atas turntable */}
              <div className="podium-piringan">
                <div className="podium-cincin-strobe" />
                <div className="podium-cincin-dalam" />
              </div>
            </div>

            {tampil && (
              <CircularCarousel
                items={kartu}
                preset="cylinder"
                intro="assemble"
                cardWidth={180}
                aspectRatio={1}
                speed={8}
                captions
                gap={15}
                perspective={1880}
                momentum={0.79}
                snap={false}
                parallax={1}
                stretch={0.21}
                fadeColor="#f8fafc"
                depthFade={1}
                innerShade={1}
                cornerRadius={10}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
