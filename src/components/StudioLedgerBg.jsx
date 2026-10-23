export default function StudioLedgerBg() {
  return (
    <>
      {/* Layer Fisik Kertas Lecek 1 Lembar Utuh (Full-Bleed) di latar belakang Collection */}
      <div className="kertas-lecek-overlay pointer-events-none absolute inset-0 select-none overflow-hidden z-0" aria-hidden="true" />

      <div
        className="studio-ledger pointer-events-none absolute inset-0 select-none overflow-hidden font-mono text-[10px] uppercase tracking-wider text-teks/30 z-0"
        aria-hidden="true"
      >
      {/* ---- TOP BAR METADATA (Di atas Collection) ---- */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-6 opacity-60">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-merah animate-pulse" />
          <span className="font-semibold text-teks/50">PROD // APPLIED_AI</span>
          <span className="hidden sm:inline text-teks/25">|</span>
          <span className="hidden sm:inline text-teks/35">REEL: 02_COLLECTION</span>
        </div>
        <div className="hidden md:block text-teks/35">
          LATENT_DIM: 4096 // WEIGHTS: DETERMINISTIC
        </div>
        <div className="text-teks/50">
          TC 00:24:19:26 <span className="text-teks/25">// 60FPS</span>
        </div>
      </div>

      {/* ---- CORNER CROP MARKS (Batas Framing Stage) ---- */}
      {/* Pojok Kiri Atas */}
      <div className="absolute left-4 top-16 md:left-8 md:top-20">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="stroke-current text-teks/35">
          <path d="M0 8V0H8" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Pojok Kanan Atas */}
      <div className="absolute right-4 top-16 md:right-8 md:top-20">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="stroke-current text-teks/35">
          <path d="M20 8V0H12" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Crosshair Tengah Panggung Kiri & Kanan */}
      <div className="absolute left-3 top-[38%] hidden lg:block text-teks/25">
        <span className="text-xs font-bold">+</span>
        <span className="ml-1 text-[9px] block">X:000</span>
      </div>
      <div className="absolute right-3 top-[38%] hidden lg:block text-right text-teks/25">
        <span className="text-xs font-bold">+</span>
        <span className="mr-1 text-[9px] block">X:1920</span>
      </div>

      {/* ---- COLOR CALIBRATION STRIP (Sisi Kiri Meja Kerja) ---- */}
      <div className="absolute left-4 top-[50%] hidden -translate-y-1/2 flex-col items-center gap-1.5 lg:flex">
        <span className="text-[8px] text-teks/25 [writing-mode:vertical-lr]">CALIB_V1</span>
        <div className="h-2.5 w-2.5 border border-teks/40 bg-tinta" title="Tinta #0C0C0C" />
        <div className="h-2.5 w-2.5 border border-teks/40 bg-kertas" title="Kertas #F8FAFC" />
        <div className="h-2.5 w-2.5 bg-merah" title="Merah #D70000" />
        <div className="h-2.5 w-2.5 bg-kuning" title="Kuning #FFE578" />
        {/* Ruler ticks */}
        <div className="mt-2 flex flex-col gap-1 opacity-40">
          <div className="h-[1px] w-2 bg-teks/40" />
          <div className="h-[1px] w-3 bg-teks/40" />
          <div className="h-[1px] w-2 bg-teks/40" />
          <div className="h-[1px] w-4 bg-teks/40" />
          <div className="h-[1px] w-2 bg-teks/40" />
        </div>
      </div>

      {/* Pojok Kiri Bawah (Batas Bawah Collection) */}
      <div className="absolute bottom-6 left-4 md:left-8">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="stroke-current text-teks/35">
          <path d="M0 12V20H8" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Pojok Kanan Bawah */}
      <div className="absolute bottom-6 right-4 md:right-8">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="stroke-current text-teks/35">
          <path d="M20 12V20H12" strokeWidth="1.5" />
        </svg>
      </div>

      {/* ---- BOTTOM LEDGER INFO ---- */}
      <div className="absolute bottom-2 left-0 right-0 hidden sm:block">
        <div className="mx-auto flex max-w-6xl justify-between px-8 text-[9px] text-teks/25">
          <span>RA-LABS // SYS_BUILDER</span>
          <span>LOCATION: BEKASI_ID // 24H_ONLINE</span>
        </div>
      </div>
    </div>
    </>
  )
}
