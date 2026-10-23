import { useEffect, useRef, useState } from 'react'
import CardSwap from './CardSwap.jsx'
import { PROYEK } from '../data/proyek.js'

function IsiKartu({ proyek }) {
  // bg-lawan/text-lawanTeks = kebalikan bg-bidang/text-teks per tema:
  // terang kartu tinta, gelap kartu kertas.
  return (
    <div className="flex h-full flex-col bg-lawan text-lawanTeks">
      {/* Blok teks rapat gaya CardNav (17/13px, gap 4px). Sengaja bukan link:
          area teks + seluruh kartu tetap permukaan drag CardSwap. */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold leading-tight tracking-[-0.015em]">{proyek.judul}</h3>
          <p className="mt-1 text-[13px] leading-[1.45] opacity-70">{proyek.kalimat}</p>
        </div>
        <span className="shrink-0 font-mono text-[11px] opacity-70">{proyek.status}</span>
      </div>
      {/* Hanya banner ini yang mengarah ke link. Tanpa draggable={false},
          browser mulai native link-drag saat diseret, CardSwap menerima
          pointercancel dan drag kartu mati sebelum jalan. */}
      <a
        href={proyek.alamat}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        className="mt-auto block"
      >
        <img
          src={proyek.gambar}
          alt={`Tampilan ${proyek.judul}`}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </a>
    </div>
  )
}

export default function Collection() {
  const [kurangiGerak, setKurangiGerak] = useState(false)
  const [layarLebar, setLayarLebar] = useState(false)

  useEffect(() => {
    const kueri = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!kueri) return undefined
    const ubah = () => setKurangiGerak(kueri.matches)
    ubah()
    kueri.addEventListener('change', ubah)
    return () => kueri.removeEventListener('change', ubah)
  }, [])

  /* Lebar 768px (md) jadi titik potong ukuran kartu.
     Di bawah itu kartu dikecilkan supaya panggungnya muat di container
     sempit tanpa perlu dikecilkan lagi oleh skala panggung. Kalau skalanya
     bukan 1, seluruh kartu ikut mengecil termasuk teks 13px, dan teksnya
     jadi tidak kebaca di layar HP.

     Panggung mobile 323 x 412, desktop 544 x 607. Dua-duanya muat di
     container masing-masing dengan skala tepat 1. */
  useEffect(() => {
    const kueri = window.matchMedia?.('(min-width: 768px)')
    if (!kueri) return undefined
    const ubah = () => setLayarLebar(kueri.matches)
    ubah()
    kueri.addEventListener('change', ubah)
    return () => kueri.removeEventListener('change', ubah)
  }, [])

  // Autoplay selalu On kecuali pengguna meminta animasi minim.
  const autoplay = !kurangiGerak

  /* CardSwap baru dipasang kalau section-nya sudah sampai di layar.
     Tumpukan punya animasi pembuka: kartunya keluar dari tengah lalu
     berjejer. Kalau dipasang sejak halaman dibuka, animasi itu sudah
     selesai ketika pengunjung masih di hero, jadi pas dia scroll ke
     sini tinggal lihat kartu yang sudah diam.

     Dicek lewat posisi di layar, bukan IntersectionObserver. Kalau
     pengguna melompat jauh ke bawah (tarik scrollbar atau tekan End),
     section-nya bisa terlewati tanpa pernah masuk viewport, dan
     IntersectionObserver tidak akan pernah memberi tahu. Posisi di
     atas layar juga dihitung "sudah sampai".

     Tinggi wrapper sudah dipatok duluan, jadi tempatnya sudah ada
     sebelum CardSwap muncul dan halaman tidak meloncat. */
  const wadahRef = useRef(null)
  const [tampil, setTampil] = useState(false)

  useEffect(() => {
    const cek = () => {
      const el = wadahRef.current
      if (!el) return
      // 0,6 dari tinggi layar: section harus sudah masuk 40 persen
      // viewport baru dipasang. Saat halaman baru dibuka, section ini
      // masih di bawah hero (yang setinggi satu layar penuh), jadi
      // belum terpasang dan animasinya tidak jalan di belakang gerbang.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.6) setTampil(true)
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
    <section id="collection" className="relative z-10 bg-transparent text-teks">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="judul-bagian">Total Kumpulan Project</h2>
        <p className="isi mt-4">Semua project yang sudah live, dimaintain secara berkala, dan project yang sedang dalam pengembangan.</p>

        {/* Tumpukan kartu. Di layar sempit pun tetap CardSwap, bukan daftar
            teks: isi kartu sudah memuat judul, kalimat, status, dan
            banner, jadi tidak ada isi yang hilang. */}
        <div className="mt-10">
          {/* Panggung fisik CardSwap: memberikan elevasi panggung studio di tema gelap & terang */}
          <div
            ref={wadahRef}
            className="panggung-cardswap relative h-[417px] md:h-[608px] w-full overflow-hidden rounded-2xl md:rounded-[32px]"
          >
            {/* Stage micro-hud markers (elemen studio panggung) */}
            <div
              className="panggung-cardswap-hud pointer-events-none absolute inset-0 z-0 select-none p-4 md:p-6 font-mono text-[9px] md:text-[10px] uppercase tracking-wider opacity-40"
              aria-hidden="true"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-teks">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-merah animate-pulse" />
                  SHOWCASE STAGE
                </span>
                <span className="text-teks opacity-70">INTERACTIVE // SWAP &amp; DRAG</span>
              </div>
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-teks opacity-50">
                + [STAGE_REF // 01]
              </div>
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 text-teks opacity-50">
                10 ITEMS +
              </div>
            </div>

            {tampil && (
              <CardSwap
                lebar={layarLebar ? 460 : 240}
                tinggi={layarLebar ? 360 : 256}
                jarakKartu={layarLebar ? 60 : 24}
                jarakVertikal={layarLebar ? 120 : 60}
                kedalaman={layarLebar ? 200 : 100}
                kemiringan={5}
                terlihatKartu={layarLebar ? 4 : 3}
                radiusKartu={layarLebar ? 28 : 20}
                jeda={4000}
                kecepatan={0.6}
                pegas={0.6}
                parallax={0.5}
                sebarHover={0.03}
                redup={0.45}
                autoplay={autoplay}
                jedaSaatHover
                bisaDrag
              >
                {PROYEK.map(proyek => (
                  <IsiKartu key={proyek.no} proyek={proyek} />
                ))}
              </CardSwap>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
