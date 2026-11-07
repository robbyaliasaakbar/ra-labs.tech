import { useEffect, useState, lazy, Suspense } from 'react'
import FadeIn from './FadeIn.jsx'
import RotatingText from './RotatingText.jsx'
import TiltTombol from './TiltTombol.jsx'
import HeroClock from './HeroClock.jsx'
import AcidSquares from './AcidSquares.jsx'
import { amatiTema } from './aset3d.js'
import { bacaTema } from '../theme.js'
import { bacaSetelanGrafis } from '../lib/perangkat.js'

// Lazy-mount 3D hero untuk code-splitting (Issue #4).
// Chunk 3D hanya diunduh setelah pengunjung mulai masuk gerbang.
const Logo3D = lazy(() => import('./Logo3D.jsx'))
const Mark3D = lazy(() => import('./Mark3D.jsx'))

/* Hero portal RaLabs. Rombakan mengikuti plan-prd/hero-rombak/design.md:
   headline SATU baris di atas, brand mark magnet+tilt di tengah-bawah,
   bar jenis: statement kiri + CTA kanan. Warna ikut tema terang/gelap.

   mulaiBackground: kalau true, animasi pembuka latar diulang dari nol.
   Dipakai pas gerbang mulai larut, supaya kvadrat latar muncul di mata
   pengunjung, bukan sudah jadi waktu gerbang kebuka.

   siap3D: kalau true, komponen 3D (Logo3D & Mark3D) di-mount.
   Sebelum gerbang membuka, 3D tidak di-mount demi menghemat WebGL context
   dan menunda fetch GLB 2.8MB. */
export default function Hero({ mulaiBackground = false, siap3D = false }) {
  const [tema, setTema] = useState(bacaTema)
  const [grafis] = useState(bacaSetelanGrafis)

  useEffect(() => {
    return amatiTema((t) => setTema(t || 'gelap'))
  }, [])
  return (
    <section
      id="home"
      className="hero-section relative flex min-h-[100svh] flex-col overflow-x-clip text-teks"
    >
      {/* Latar hero: canvas WebGL2 AcidSquares, menggantikan radial gradient lama.
          absolute inset-0 z-0, pointer-events-none supaya drag logo 3D,
          klik CTA, dan hover tile tetap jalan normal di atasnya.

          Hanya SATU instance yang di-mount berdasarkan tema aktif
          (memantau atribut data-theme via amatiTema). Hal ini mencegah
          dua WebGL context hidup bersamaan di background. */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {tema === 'terang' ? (
          /* Latar hero light theme: canvas WebGL2 AcidSquares.
             Settingan ini preferensi Bang Rob, JANGAN diubah tanpa izin.
             Semua warna kertas (#f8fafc), gloss 0, grain 0, fade 0 —
             tile lembut tanpa kilau, cuma bentuk dan kedalaman yang main. */
          <div className="hero-latar hero-latar-terang">
            <AcidSquares
              color="#f8fafc"
              accentColor="#f8fafc"
              secondaryColor="#f8fafc"
              tileSize={0.55}
              gap={0.05}
              roundness={0.25}
              softness={0.83}
              bulge={0.42}
              rotation={-22}
              gloss={0}
              waves={0.2}
              waveScale={0.65}
              speed={0.6}
              shape="round"
              pulse={0.5}
              pulseSpeed={0.45}
              pulseSpacing={1.9}
              pulseWidth={1}
              pulseOrigin="random"
              lighting="overhead"
              brightness={0.5}
              tilt={0.81}
              zoom={0.65}
              depth={18.5}
              grain={0}
              fade={0}
              opacity={1}
              hoverEffect="lift"
              mouseStrength={0.75}
              mouseRadius={0.21}
              detail={grafis.detail}
              dpr={grafis.dpr}
              mouseInteraction={true}
              pulseOnClick={true}
              intro={true}
              mulaiIntro={mulaiBackground}
            />
          </div>
        ) : (
          /* Latar hero dark theme. Settingan preferensi Bang Rob, JANGAN diubah.
             Warna turun jadi abu gelap (#7d7d7d / #4b4b4b / #0c0c0c), backlit,
             bulge 0.83 dan brightness 0.8 supaya tile-nya kebaca di atas tinta.
             Hover di-balik jadi "press" (tile masuk, bukan terangkat). */
          <div className="hero-latar hero-latar-gelap">
            <AcidSquares
              color="#7d7d7d"
              accentColor="#4b4b4b"
              secondaryColor="#0c0c0c"
              tileSize={0.55}
              gap={0.07}
              roundness={0.25}
              softness={0.83}
              bulge={0.83}
              rotation={-22}
              gloss={0.04}
              waves={0.25}
              waveScale={0.65}
              speed={0.6}
              shape="round"
              pulse={0.5}
              pulseSpeed={0.8}
              pulseSpacing={1.9}
              pulseWidth={1}
              pulseOrigin="random"
              lighting="backlit"
              brightness={0.8}
              tilt={0.81}
              zoom={0.65}
              depth={18.5}
              grain={0}
              fade={0}
              opacity={1}
              hoverEffect="press"
              mouseStrength={0.75}
              mouseRadius={0.21}
              detail={grafis.detail}
              dpr={grafis.dpr}
              mouseInteraction={true}
              pulseOnClick={true}
              intro={true}
              mulaiIntro={mulaiBackground}
            />
          </div>
        )}
      </div>

      {/* Headline: SATU artwork SVG dari Bang Rob (viewBox 1084.25x368.65,
          rasio 2.94:1). Eyebrow THIS IS, RA LABS, tiga chip, dan polilin
          merah SEMUA sudah ada di dalam gambar, jangan ditulis ulang di sini.
          Dua <img>, pilih lewat html[data-theme='gelap'], pola sama seperti
          .hero-latar (tema dipasang sebelum React jalan, anti-flicker).
          Teks asli tetap disediakan sr-only di dalam h1 supaya SEO dan
          screen reader nggak kehilangan judul; img aria-hidden. */}
      <div className="relative z-20 px-4 pt-4 sm:pt-6 md:px-10 md:pt-0">
        <FadeIn delay={0.1} y={16} animateOnMount>
          <h1 className="hero-headline-gambar">
            <span className="sr-only">THIS IS RA LABS</span>
            <img
              className="hero-headline-img hero-headline-img-terang"
              src="/images/Light-headline1x.svg"
              alt=""
              aria-hidden="true"
              width="1084"
              height="369"
            />
            <img
              className="hero-headline-img hero-headline-img-gelap"
              src="/images/Dark-headline1x.svg"
              alt=""
              aria-hidden="true"
              width="1084"
              height="369"
            />
          </h1>
          <p className="sr-only">Creative. Technology. Real Projects.</p>
        </FadeIn>
      </div>

      {/* Logo 3D: mengisi sisa ruang vertikal di antara headline dan bar.
          Ukuran mengikuti tinggi layar & tinggi headline (9vw) supaya
          hero selalu utuh. Posisi tetap; yang bisa dimainkan cuma rotasinya.
          Cadangan bawah 330px dari md, karena dua mark 120px duduk
          di atas pill. Di bawah md mark-nya di samping, cadangan 210px.
          Translate -80px hanya berlaku di bawah sm; dari sm naik 48px,
          dari md naik 30px. */}
      <div className="flex min-h-0 flex-1 items-center justify-center px-[2.5vw]">
        <div className="-translate-y-20 w-[min(260px,33svh)] sm:w-[min(480px,calc(100svh_-_9vw_-_210px))] md:w-[min(480px,calc(100svh_-_9vw_-_330px))] md:-translate-y-[30px] md:scale-[1.10] lg:w-[min(515px,calc(100svh_-_9vw_-_330px))]">
          <FadeIn delay={0.45} y={30}>
            {siap3D ? (
              <Suspense fallback={<div className="aspect-square w-full" aria-hidden="true" />}>
                <Logo3D />
              </Suspense>
            ) : (
              <div className="aspect-square w-full" aria-hidden="true" />
            )}
          </FadeIn>
        </div>
      </div>

      {/* Bar bawah: statement kiri, CTA kanan. mt-auto diganti flex-1 di atas
          supaya bar selalu menempel dasar tanpa menabrak brand mark. */}
      <div className="flex flex-col gap-5 px-4 pb-7 sm:px-8 sm:pb-8 md:flex-row md:items-end md:justify-between md:px-10 md:pb-6">
        <FadeIn delay={0.55} y={20} className="relative">
          {/* Di luar aliran: tumbuh ke atas dari atap statement.
              Tinggi slot tidak ikut menyusutkan logo. */}
          <div className="pointer-events-none absolute bottom-full left-0 flex w-max flex-col">
            <p className="hero-baris-kiri">
              <span className="hero-kata-diam">Building</span>
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
            <div className="hero-slot-kiri">
              <HeroClock />
            </div>
          </div>
          <p className="max-w-[300px] font-medium uppercase tracking-wide leading-snug text-[clamp(0.72rem,1.15vw,1.05rem)]">
            {/* Dua kalimat dipisah baris paksa, dan masing-masing dikunci
                (whitespace-nowrap) supaya barisnya nggak pernah pecah di
                tengah kalimat.

                Kenapa baris paksa, bukan cuma nowrap: blok kertasnya
                inline-block, jadi lebarnya dihitung dari max-content — yaitu
                SELURUH isi kalau diletakkan segaris. Di mobile itu
                193 px + 144 px = 337 px, mentok di 300 px, dan bloknya jadi
                jauh lebih lebar dari teksnya. Dengan baris paksa,
                max-content-nya jadi baris terpanjang (193 px), jadi bloknya
                nempel sama teksnya.

                Di desktop hasilnya sama seperti sebelumnya: "RUMAH DARI SEMUA
                PROJECT." / "SEMUANYA ADA DISINI." — dua kalimat memang
                nggak pernah muat satu baris di lebar 300 px. */}
            <span className="hero-pernyataan">
              <span className="whitespace-nowrap">RUMAH DARI SEMUA PROJECT.</span>{' '}
              <br />
              <span className="whitespace-nowrap">SEMUANYA ADA DISINI.</span>
            </span>
          </p>
        </FadeIn>
        <FadeIn delay={0.7} y={20} className="shrink-0">
          {/* Target blank + noopener: nutup celah reverse tabnabbing.
              TiltTombol cuma pembungkus gerak; klik tetap ditangkap <a>.
              Mark bukan tautan. Posisinya diatur .hero-cta, bukan urutan DOM. */}
          <div className="hero-cta">
            <div className="hero-cta-bisnis">
              <TiltTombol>
                <a href="https://indeepcleaningid.site/" target="_blank" rel="noopener noreferrer" className="tombol-merah-pill">
                  Lihat Bisnis Saya
                </a>
              </TiltTombol>
            </div>
            <div className="hero-cta-porto">
              <TiltTombol>
                <a href="https://robbyaliasa.tongkrongan.tech/" target="_blank" rel="noopener noreferrer" className="tombol-garis-pill">
                  Lihat Portfolio
                </a>
              </TiltTombol>
            </div>
            <div className="hero-cta-indeep">
              {siap3D && (
                <Suspense fallback={null}>
                  <Mark3D sumber="/images/logo-indeep-3d.glb" label="Logo InDeep tiga dimensi" />
                </Suspense>
              )}
            </div>
            <div className="hero-cta-ibbor">
              {siap3D && (
                <Suspense fallback={null}>
                  <Mark3D sumber="/images/logo-ibborarts-3d.glb" label="Logo Ibborarts tiga dimensi" />
                </Suspense>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}