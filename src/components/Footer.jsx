import { useEffect, useState } from 'react'
import './Footer.css'

/* Navigasi footer: empat item, nama dan urutannya sama persis dengan
   empat kartu di navbar CardNav (src/components/Navbar.jsx, KARTU).
   Targetnya anchor section yang sama juga, jadi navbar dan footer
   nggak pernah nunjuk tempat yang beda.

   Yang beda sama porto: porto memakai routing per halaman, jadi
   "aktif" di sana berarti "halaman ini yang lagi dibuka". Di sini
   semuanya satu halaman dengan anchor, jadi aktif berarti "section
   ini yang lagi di layar". Logikanya ada di bawah. */
const NAVIGASI = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'collection', label: 'Collection' },
  { id: 'contact', label: 'Contact' },
]

/* Kanal koneksi. Daftar ini masih placeholder, sengaja dipisah dari
   komponen supaya tinggal ganti isi array-nya tanpa menyentuh struktur.
   Email dan nomor WhatsApp di sini mengikuti section Contact yang sudah
   live, supaya satu halaman tidak punya dua alamat berbeda.

   Catatan: footer porto memakai ibborarts@gmail.com dan +6282249072873.
   Dua-duanya beda dari yang dipakai di portal ini. */
const KANAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/robby-aliasa-akbar-001a2a267/' },
  { label: 'Reddit', href: 'https://www.reddit.com/user/Full_Director87/' },
  { label: 'Instagram', href: 'https://www.instagram.com/ybboraa/' },
  { label: 'Email', href: 'mailto:dev@ra-labs.tech' },
  { label: 'WhatsApp', href: 'https://wa.me/6287754778218' },
]

export default function Footer() {
  const [aktif, setAktif] = useState(NAVIGASI[0].id)

  /* Scroll-spy: section yang posisinya paling dekat di bawah garis 40%
     tinggi viewport yang dianggap aktif.

     Kenapa garis 40 persen, bukan titik tengah: titik tengah membuat
     section yang baru mulai dimasukin sebagai aktif, padahal mata orang
     masih membaca section sebelumnya. Garis 40 persen artinya "section ini
     sudah masuk bagian atas layar", dan itu yang bikin link di footer ikut
     nunjuk isi yang sedang dibaca.

     Posisi section dihitung dari boundingClientRect plus scrollY, bukan
     dari offsetTop. offsetTop bergantung offsetParent, dan di portal ini
     section punya beberapa pembungkus, jadi nilainya bisa beda antara
     satu browser dan browser lain. */

  /* Section terakhir (Contact) pendek dan menempel di dasar halaman.
     Kalau cuma pakai garis 40 persen, section itu tidak pernah masuk
     garis, jadi link-nya tidak pernah menyala. Karena itu, kalau halaman
     sudah mentok bawah, section terakhir dipaksa aktif. */
  useEffect(() => {
    const hitung = () => {
      const garis = window.scrollY + window.innerHeight * 0.4
      let sekarang = NAVIGASI[0].id

      for (const item of NAVIGASI) {
        const el = document.getElementById(item.id)
        if (!el) continue
        const atas = el.getBoundingClientRect().top + window.scrollY
        if (atas <= garis) sekarang = item.id
      }

      const doc = document.documentElement
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
        sekarang = NAVIGASI[NAVIGASI.length - 1].id
      }

      // Set state dengan nilai yang sama tidak memicu render ulang di React,
      // jadi aman dipanggil tiap frame scroll.
      setAktif((sebelumnya) => (sebelumnya === sekarang ? sebelumnya : sekarang))
    }

    hitung()
    window.addEventListener('scroll', hitung, { passive: true })
    window.addEventListener('resize', hitung)
    return () => {
      window.removeEventListener('scroll', hitung)
      window.removeEventListener('resize', hitung)
    }
  }, [])

  const tahun = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* Strip Perforasi Tiket Studio (Tear-off edge) */}
      <div className="footer-perforasi-strip" aria-hidden="true">
        <div className="footer-perforasi-lubang" />
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-3 font-mono text-[9px] uppercase tracking-widest opacity-45">
          <div className="flex items-center gap-2">
            <span className="font-bold text-merah">✂ [TEAR_OFF // LINE]</span>
            <span className="hidden sm:inline">RA-LABS STUDIO TICKET</span>
          </div>
          <span className="hidden md:inline">SERIES: #2026-RL-BKSI</span>
          <span>END_OF_PAGE // ARCHIVE</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-8 pt-10 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3 md:divide-x md:divide-current/10">
          {/* Kolom kiri: identitas. Nama pakai Manrope, label merah, lalu
              tagline milik RaLabs sendiri. */}
          <div className="md:pr-8">
            <p className="footer-nama">RaLabs</p>
            <p className="footer-peran">Rumah Dari Semua Project</p>
            <p className="footer-tagline">
            Semua project yang sudah live, dimaintain secara berkala, dan project yang sedang dalam pengembangan.
            </p>
          </div>

          {/* Kolom tengah: navigasi. Section yang sedang di layar menyala
              seperti diporto, tapi di sini dipantau scroll-spy di atas. */}
          <div className="md:px-8">
            <p className="footer-judul-kolom">Navigate</p>
            <ul className="footer-daftar">
              {NAVIGASI.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`footer-tautan${aktif === item.id ? ' footer-tautan-aktif' : ''}`}
                    aria-current={aktif === item.id ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom kanan: kanal. */}
          <div className="md:pl-8">
            <p className="footer-judul-kolom">Connect</p>
            <ul className="footer-daftar">
              {KANAL.map((kanal) => (
                <li key={kanal.label}>
                  <a
                    href={kanal.href}
                    {...(kanal.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="footer-tautan"
                  >
                    {kanal.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colophon Studio Line */}
        <div className="mt-12 border-t border-current/10 pt-6">
          <p className="font-sans text-[11px] md:text-xs tracking-wider opacity-60 text-center md:text-left">
            TYPESET IN COMFORTAA &amp; JETBRAINS MONO // REACT + VITE // CRAFTED BY ROBBY ALIASA AKBAR
          </p>
        </div>

        {/* Bar bawah: hak cipta di kiri, domain di kanan. */}
        <div className="footer-bawah !mt-4 !pt-4">
          <p>
            &copy; {tahun} RaLabs Copyright.
          </p>
          <a
            href="https://ra-labs.tech"
            className="footer-domain hover:text-merah transition-colors duration-200"
          >
            https://ra-labs.tech
          </a>
        </div>
      </div>
    </footer>
  )
}
