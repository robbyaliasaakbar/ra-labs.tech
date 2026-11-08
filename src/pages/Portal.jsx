import { useEffect, useRef, useState } from 'react'
import About from '../components/About.jsx'
import Collection from '../components/Collection.jsx'
import Contact from '../components/Contact.jsx'
import Footer from '../components/Footer.jsx'
import Gerbang from '../components/Gerbang.jsx'
import Hero from '../components/Hero.jsx'
import Navbar from '../components/Navbar.jsx'
import StudioLedgerBg from '../components/StudioLedgerBg.jsx'

export default function Portal() {
  // Urutan gerbang (plan-prd/gerbang-masuk):
  // 1. masuk = true  -> logo berhenti spin/drag, balik ke pose kurus.
  // 2. tiga kilat    -> jalan sendiri di dalam LogoGerbang, 1.2 dtk.
  // 3. membuka       -> permukaan gerbang dilarutkan dengan luma fade,
  //                     0.8 dtk, terang -> gelap.
  // 4. gerbangTerbuka-> gerbang dilepas, homepage tinggal sendiri.
  const [masuk, setMasuk] = useState(false)
  const [membuka, setMembuka] = useState(false)
  const [gerbangTerbuka, setGerbangTerbuka] = useState(false)
  const isiRef = useRef(null)

  // Setelah gerbang terbuka, fokus pindah ke isi utama supaya alur keyboard lanjut.
  useEffect(() => {
    if (gerbangTerbuka) isiRef.current?.focus()
  }, [gerbangTerbuka])

  return (
    <>
      {/* Homepage dirender sejak detik pertama, di BELAKANG gerbang.
          Spec S4: lubang yang nanti membuka harus sudah menemukan halaman
          yang siap di belakangnya, bukan halaman yang baru mulai menggambar.

          PENGECUALIAN: About. Section-nya muat 10 gambar proyek yang kalau
          ikut dirender dari detik pertama langsung kebaca browser walau
          tertutup gerbang, karena <img> itu eager. Jadi dia menunggu
          pembukaan dimulai (state membuka) supaya 10 gambar itu cuma ditarik
          saat gerbang sudah mau larut, bukan saat halaman masih dimuat.
          Rumusnya membuka || gerbangTerbuka: selesai luma fade sekalipun,
          kalau state membuka sempat dilewat, About tetap ikut tampil.

          inert + aria-hidden: selama gerbang menutup, isi di belakangnya
          tidak boleh bisa dicapai keyboard ataupun pembaca layar. React 18
          belum mengenal prop inert, jadi disebarkan sebagai atribut mentah. */}
      <div
        aria-hidden={gerbangTerbuka ? undefined : 'true'}
        {...(gerbangTerbuka ? {} : { inert: '' })}
      >
        <a
          href="#konten-utama"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-merah focus:px-4 focus:py-3 focus:font-bold focus:text-kertas"
        >
          Lewati ke isi utama
        </a>
        <Navbar />
        <main id="konten-utama" ref={isiRef} tabIndex={-1}>
          {/* Latar hero animasi pembukanya diulang pas gerbang mulai larut
              (state membuka). Kalau tidak, reveal-nya sudah kelar di
              belakang gerbang dan pengunjung cuma lihat latar yang sudah
              jadi waktu gerbang kebuka. Model 3D hero (Logo3D & Mark3D)
              di-lazy mount sampai gerbang mulai membuka (siap3D) agar
              tidak membebani WebGL context dan mengunduh GLB di detik 0. */}
          <Hero mulaiBackground={membuka} siap3D={membuka || gerbangTerbuka} />
          {(membuka || gerbangTerbuka) && <About />}
          {/* Collection mandiri dengan panggung showcase & studio ledger canvas */}
          <div className="latar-bengkel-collection relative">
            <StudioLedgerBg />
            <Collection />
          </div>
          {/* Contact mandiri */}
          <Contact />
        </main>
        <Footer />
      </div>

      {!gerbangTerbuka && (
        <Gerbang
          masuk={masuk}
          membuka={membuka}
          onMasuk={() => setMasuk(true)}
          onPoseKurus={() => {
            // Pose kurus sudah dapat; kilat menyusul otomatis dari LogoGerbang.
          }}
          onKilatSelesai={() => setMembuka(true)}
          onTerbuka={() => setGerbangTerbuka(true)}
        />
      )}
    </>
  )
}
