import TiltTombol from './TiltTombol.jsx'

/* Dua kanal komunikasi utama */
const KANAL = [
  {
    id: '01',
    nama: 'WhatsApp',
    labelBadge: 'DIRECT CHAT // FAST RESPONSE',
    nilai: '+62 877 5477 8218',
    cta: 'Chat di WhatsApp',
    href: 'https://wa.me/6287754778218',
    targetBlank: true
  },
  {
    id: '02',
    nama: 'Email',
    labelBadge: 'OFFICIAL INQUIRY // PROJECT BRIEF',
    nilai: 'dev@ra-labs.tech',
    cta: 'Kirim Email',
    href: 'mailto:dev@ra-labs.tech',
    targetBlank: false
  }
]

export default function Contact() {
  return (
    /* Section Contact: Asymmetric Studio Dispatch Layout */
    <section id="contact" className="latar-bengkel-contact relative overflow-hidden text-teks">
      {/* Background Editorial Typography Watermark */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <span className="contact-watermark font-heading font-black tracking-tighter uppercase">
          TRANSMIT
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">
        {/* Editorial Index Header */}
        <div className="mb-10 flex items-center justify-between border-b border-garis/20 pb-4 font-mono text-[10px] uppercase tracking-widest opacity-40">
          <div className="flex items-center gap-2">
            <span>+</span>
            <span>// 03. CONTACT &amp; DIRECT ACCESS</span>
          </div>
          <span className="hidden sm:inline">RA-LABS TERMINAL +</span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
          {/* Kolom Kiri: Statement, Copy Opsi A & Status */}
          <div className="lg:col-span-7">
            {/* Status Badge dengan font Comfortaa semibold, styling dinamis per tema & dot kedip merah-hijau */}
            <div className="contact-status-badge inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 font-sans text-xs font-semibold tracking-wider">
              <span className="dot-kedip-merah-hijau inline-block h-2 w-2 rounded-full" />
              OPEN FOR PROJECTS &amp; COLLAB
            </div>

            {/* Headline Opsi A dengan font Comfortaa Bold */}
            <h2 className="mt-5 font-sans text-[clamp(1.85rem,3.4vw,2.85rem)] font-bold leading-[1.25] tracking-tight">
              Punya ide project yang pengen diwujudin, atau mau ngobrol santai dulu?
            </h2>

            {/* Sub-copy Opsi A dengan font Comfortaa Medium */}
            <p className="mt-5 max-w-xl font-sans text-base md:text-lg font-medium leading-relaxed opacity-80">
              Entah itu bangun web app, automasi sistem AI, atau kolaborasi ide baru dari nol. Drop pesan lo, mari kita bedah dan eksekusi bareng.
            </p>

            {/* Micro-ledger metadata */}
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-wider opacity-40">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1 w-1 rounded-full bg-current" />
                BEKASI, INDONESIA
              </span>
              <span>//</span>
              <span>TIMEZONE: UTC+7</span>
              <span>//</span>
              <span>RESPONSE: &lt;24H</span>
            </div>
          </div>

          {/* Kolom Kanan: 2 Kartu Kanal Studio Dispatch */}
          <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-5">
            {KANAL.map((kanal) => (
              <div
                key={kanal.nama}
                className="kartu-kanal-contact group relative flex flex-col justify-between rounded-2xl p-5 md:p-6 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-wider opacity-60">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-merah" />
                      {kanal.labelBadge}
                    </span>
                    <span className="font-bold">[{kanal.id}]</span>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-heading text-lg font-bold tracking-tight">{kanal.nama}</h3>
                    <p className="mt-0.5 font-mono text-sm tracking-tight opacity-75">{kanal.nilai}</p>
                  </div>
                </div>

                <div className="kartu-kanal-divider mt-5 flex items-center justify-between pt-4">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider opacity-75">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    STATUS: READY
                  </span>
                  <TiltTombol>
                    <a
                      href={kanal.href}
                      {...(kanal.targetBlank
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="tombol-merah-pill min-h-[44px] px-6 py-2.5 font-sans text-sm font-bold tracking-normal"
                    >
                      <span>{kanal.cta}</span>
                      <span className="ml-1.5 text-base transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        ↗
                      </span>
                    </a>
                  </TiltTombol>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
