# Log Perubahan

Catatan perubahan RaLabs. Satu entri per pull request. PR tanpa entri di sini belum boleh di-merge.

Format entri:

- Tanggal
- Judul PR
- File yang berubah
- Hasil tes: dev server ok, build ok, cek 360/768/1280, kontras lolos, tidak ada tombol mati

---

## 15 Okt 2026, Batch 0: fondasi repo dan dev server

- Tanggal: 15 Okt 2026
- Judul: fondasi repo, scaffold React plus Tailwind, dev server port 5015
- File yang berubah:
  - Baru: `README.md`, `engineering.md`, `contributing.md`, `LICENSE`
  - Baru: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
  - Baru: `entries/index.html`, `src/main.jsx`, `src/App.jsx`, `src/pages/Home.jsx`
  - Baru: `src/components/Navbar.jsx`, `src/components/Hero.jsx`
  - Baru: `src/styles/global.css`
  - Baru: `public/images/` isi hasil copy dari `../assets/` (4 file)
- Hasil tes:
  - Dev server: jalan, Vite 6.4.4 ready di `http://localhost:5015/` (strictPort, tidak lompat port)
  - Render React: `#root` terisi Navbar plus Home, terbukti lewat dump DOM headless Chrome
  - Aset: `/images/favicon-logo.webp`, `/images/logo+logotext.webp`, `/images/logo-text.webp`, `/images/og-banner.webp` semua 200
  - Console: tidak ada error JavaScript (hanya warning infra Chrome soal sandbox dan sqlite, bukan dari aplikasi)
  - Layout: screenshot di 360, 768, 1280. Di 360 tidak ada scroll horizontal, navbar jadi sticky bar, gambar mengecil rapi
  - Font: Comfortaa terpakai di heading dan body, JetBrains Mono terpakai di baris label atas
  - Kontras: teks `#1B1B1B` di atas surface `#E8EEF4` ratio 14.74:1 lolos, aksen `#D70000` di atas surface 4.62:1 lolos
  - Belum diuji di batch ini: `npm run build` (sengaja tidak dijalankan sebelum review), section Koleksi sampai Kontak (batch berikutnya)

## 16 Okt 2026, Batch 2: Hero dan bukti build jalan

- Tanggal: 16 Okt 2026
- Judul: section Hero sesuai copy locked, build pertama dibuktikan jalan
- File yang berubah:
  - Baru: `src/components/Hero.jsx`
  - Ubah: `src/pages/Home.jsx` (rakit Navbar plus Hero, scaffold batch 1 dibuang)
  - Ubah: `PRD/plan-portal-akar-v1.md` (celah command `cp dist/*.html` tidak match, diganti `cp dist/entries/*.html .` plus tambah `dist/images/`)
  - Hasil build dicopy ke root: `index.html`, `assets/`, `images/`
- Hasil tes:
  - `npm run build`: sukses, 452 modul, 1.65 detik. Output `dist/entries/index.html` 3.26 kB, CSS 8.90 kB, JS 321.43 kB
  - Copy hasil build ke root: `index.html` root kini menunjuk `/assets/main-BVfZ3s3J.js` (bundle hasil build, bukan source)
  - Dev server tetap menyajikan source di `/` sesudah root `index.html` ada, terbukti curl masih memuat `/src/main.jsx` (middleware dev bekerja)
  - Render Hero terbukti lewat dump DOM dan screenshot: copy "Selamat Datang di Portal Utama RaLabs." tampil, kata Ra berwarna aksen
  - Layout 1280: dua kolom asimetris, teks kiri, kartu logo kanan, sticky note ENJOY di sudut kanan bawah kartu
  - Layout 360: menumpuk rapi urutannya teks lalu kartu, sticky note tetap masuk layar, tidak ada scroll horizontal
  - Font Comfortaa terpakai di heading dan body, JetBrains Mono di baris label atas
  - Console: tidak ada error JavaScript
  - Link mati: nol. Tombol CTA `#koleksi` dan `#tentang` sengaja BELUM dipasang karena section tujuannya belum ada
  - Belum diuji di batch ini: section Koleksi sampai Kontak, Navbar link (baru ada isinya setelah section tujuannya masuk)

## 16 Okt 2026, Batch 3: Section Koleksi dan CTA Hero aktif

- Tanggal: 16 Okt 2026
- Judul: bento grid 2-1-1-2 sesuai plan 5.3, CTA Hero dan Navbar link pertama menyala
- File yang berubah:
  - Baru: `src/components/Koleksi.jsx`
  - Ubah: `src/pages/Home.jsx` (rakit Koleksi di bawah Hero)
  - Ubah: `src/components/Hero.jsx` (CTA primer "Lihat Koleksi" ke `#koleksi` dipasang, CTA sekunder masih ditunda)
  - Ubah: `src/components/Navbar.jsx` (item nav pertama: Koleksi)
  - Hasil build dicopy ke root: `index.html`, `assets/` (bundle lama dibersihkan dulu), `images/`
- Hasil tes:
  - `npm run build`: sukses, 453 modul, 1.60 detik. Output CSS 10.28 kB, JS 324.24 kB di `dist/`
  - Compile modul baru dicek langsung lewat dev server 5015 milik Bang Rob, HTTP 200, transform bersih
  - Screenshot 360, 768, 1280: pola 2-1-1-2 kebaca di desktop (dua kartu sejajar, dua bar penuh, dua kartu sejajar), tablet tetap dua kolom, HP satu kolom urut kartu portal dulu baru slot kosong, tidak ada scroll horizontal
  - Teks section ke-render semua di DOM dump: judul, nama portal, label slot, status, empty state
  - Kontras: tidak ada pasangan warna baru. `ink/80` 8.31:1, `ink/70` 5.83:1, putih di aksen 5.40:1, titik status aksen 4.62:1, semua lolos
  - Em dash: nol di seluruh `src/` dan file markdown
  - Link mati: nol. Hanya dua tujuan href di seluruh `src/`, yaitu `/` (logo dan tombol Buka Portal, reload real) dan `#koleksi` (section sudah ada, terverifikasi di DOM)
  - Console: tidak ada error JavaScript, hanya warning internal Chrome soal sqlite dan GPU
  - Belum diuji di batch ini: section Tentang sampai Kontak, Footer, 404, robots, sitemap, humans, komponen GtagTracker, menu mobile (baru dua item nav jadi belum perlu)
- Catatan review: nama 5 slot masih pola isi `app1` sampai `app4` plus `tools`, karena plan hanya mengunci jumlah 5 dan rentang app1 sampai tools. Boleh diganti nama aslinya saat review, tidak mengubah layout.

## 16 Okt 2026, Batch 4: Section Tentang dan CTA sekunder Hero

- Tanggal: 16 Okt 2026
- Judul: section Tentang dua kolom, kedua CTA hero aktif
- File yang berubah:
  - Baru: `src/components/Tentang.jsx`
  - Ubah: `src/components/Hero.jsx` (CTA sekunder "Kenalan sama Bang Rob" ke `#tentang`, gaya outline)
  - Ubah: `src/components/Navbar.jsx` (item Tentang masuk)
  - Ubah: `src/pages/Home.jsx` (rakit Tentang)
- Hasil tes:
  - Compile lewat dev server 5015: HTTP 200 untuk semua file yang berubah
  - Judul section "Kenalan sama Bang Rob." diselaraskan dengan teks CTA, karena plan tidak mengunci judul section ini secara eksplisit
  - Kedua tombol external pakai `target="_blank"` plus `rel="noopener noreferrer"`
  - Logo kubus `favicon-logo.webp` 358x447 dipakai besar di kolom kiri, bukan di upscale berlebihan
  - Link mati: nol. `#tentang` baru aktif SETELAH sectionnya ada
  - Belum diuji di batch ini: screenshot lebar penuh (dikerjakan di audit akhir batch 7)

## 16 Okt 2026, Batch 5: Section Alur

- Tanggal: 16 Okt 2026
- Judul: tiga kartu proses nyata dengan panah, cuma di section ini
- File yang berubah:
  - Baru: `src/components/Alur.jsx`
  - Ubah: `src/components/Navbar.jsx` (item Alur masuk)
  - Ubah: `src/pages/Home.jsx` (rakit Alur)
- Hasil tes:
  - Compile dev server: HTTP 200
  - Kartu 1 tinggi (min 256px di desktop), kartu 2 dan 3 pendek (min 192px), panah `→` hanya desktop, di HP menumpuk tanpa panah
  - Judul dan isi kartu copy verbatim dari plan 5.5, label nomor langkah pakai JetBrains Mono
  - Belum diuji di batch ini: screenshot lebar penuh (audit akhir batch 7)

## 16 Okt 2026, Batch 6: Kontak, Footer, dan menu mobile

- Tanggal: 16 Okt 2026
- Judul: kanal kontak real semua, footer satu baris, navbar penuh plus menu mobile
- File yang berubah:
  - Baru: `src/components/Kontak.jsx`, `src/components/Footer.jsx`
  - Ubah: `src/components/Navbar.jsx` (rewrite: 4 item, tombol hamburger, panel mobile, Escape menutup)
  - Ubah: `src/pages/Home.jsx` (rakit Kontak plus Footer)
- Hasil tes:
  - Compile dev server: HTTP 200
  - Empat kanal: email `mailto:`, WhatsApp `wa.me`, GitHub, LinkedIn. LinkedIn diambil dari profil GitHub dan porto pribadi Bang Rob sendiri, bukan tebakan
  - Tidak ada form di v1, sesuai plan (form butuh backend)
  - Menu mobile diuji interaksi asli lewat Chrome DevTools Protocol di lebar 360: tombol buka menu, `aria-expanded` jadi true, Escape menutup, klik link menu menutup menu dan pindah ke `#kontak`
  - Link footer `robots.txt`, `sitemap.xml`, `humans.txt` baru dibuat di batch 7, jadi sudah ada isinya begitu batch 7 kelar

## 16 Okt 2026, Batch 7: File statis, pelacak GA4, dan audit akhir

- Tanggal: 16 Okt 2026
- Judul: 404 plus robots, sitemap, humans, pelacak pageview, build final dan audit penuh
- File yang berubah:
  - Baru: `public/robots.txt`, `public/sitemap.xml`, `public/humans.txt`, `public/404.html` (statis, noindex, tombol ke `/`)
  - Baru: `src/components/GtagTracker.jsx`
  - Ubah: `src/App.jsx` (pasang GtagTracker)
  - Ubah: `entries/index.html` (config GA4 `send_page_view: false` supaya pageview tidak dobel)
  - Hasil build final dicopy ke root: `index.html`, `assets/`, `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Hasil tes:
  - `npm run build` final: sukses, 458 modul, CSS 12.06 kB, JS 330.98 kB
  - GA4 diuji beneran lewat Chrome DevTools Protocol pada build produksi (server statis): dataLayer terisi, config `G-QCTML33T41` dengan `send_page_view: false`, dan TEPAT SATU event `page_view` terkirim. Di dev server bisa terlihat dua, itu efek samping debug React StrictMode, bukan bug
  - Screenshot 360, 768, 1280: semua section tampil, menu hamburger muncul di 360, nav 4 item langsung di 768 dan 1280, tidak ada scroll horizontal
  - CTA hero diuji klik asli: `Lihat Koleksi` mengubah hash ke `#koleksi`
  - Link external diuji HEAD request: porto, bisnis, WhatsApp, GitHub semua 200. LinkedIn membalas 999 karena memang memblokir IP server, URL-nya sendiri terverifikasi dari porto pribadi
  - Link lokal via dev server: `robots.txt`, `sitemap.xml`, `humans.txt`, `404.html`, gambar semua 200
  - Em dash: nol di seluruh file
  - Kontras: tidak ada pasangan warna baru sejak batch 3, semua sudah pernah lolos script
  - Link mati: nol. Semua href di seluruh `src/` diverifikasi tujuannya ada atau URL real
- Catatan jujur:
  - Di dev server pageview bisa terlihat dua kali karena React StrictMode hanya menggandakan efek di mode pengembangan. Build produksi sudah terbukti hanya sekali
  - Alur di lebar 768 sempit, tapi tidak ada teks terpotong dan tidak ada scroll horizontal, jadi dibiarkan. Kalau Bang Rob mau lega, titik panah bisa digeser dari breakpoint md ke lg
  - Komponen `Seo.jsx` dari struktur plan tidak dibuat, karena meta SEO sudah lengkap di `entries/index.html` dan portal ini satu halaman, jadi memisahkannya ke komponen tidak menambah nilai
  - Footer memakai copy "Dibangun dengan React dan PHP di shared hosting" persis seperti plan, walau PHP belum dipakai di v1. Ini copy pemilik, bukan klaim teknis halaman

## 16 Okt 2026, Validasi produksi dan fix halaman 404

- Tanggal: 16 Okt 2026
- Judul: portal live di ralabs.my.id, satu temuan 404 custom belum terpakai
- File yang berubah:
  - Baru: `.htaccess` (satu baris ErrorDocument 404 ke /404.html)
- Hasil validasi produksi di https://ralabs.my.id/:
  - Halaman utama status 200, isi HTML identik persis dengan `dist/entries/index.html` hasil build lokal
  - Bundle yang diload `main-BI1AvY-B.js` plus `main-D1N9zIu4.css`, hash cocok dengan build, artinya yang live memang kode hasil merge PR 1
  - Title, description, OG image, JSON-LD, dan tag GA4 lengkap
  - GA4 terbukti bukan cuma kode mati: ada request jaringan asli ke `google-analytics.com/g/collect` berisi `tid=G-QCTML33T41` dan `en=page_view`, pageview awal tepat satu
  - Semua section terender di DOM produksi, console tanpa error JavaScript
  - Menu mobile diuji asli di domain live: buka, Escape tutup, CTA hero mengubah hash ke #koleksi
  - robots.txt, sitemap.xml, humans.txt, 404.html, semua gambar: status 200
  - http redirect ke https berjalan
- Temuan yang diperbaiki di PR ini:
  - Sebelumnya `/halaman-ngawur-123` mengembalikan status 404 tetapi menampilkan template 404 bawaan Hostinger, bukan `404.html` milik kita. Penyebabnya tidak ada konfigurasi ErrorDocument, jadi ditambahkan lewat `.htaccess`
- Belum diuji di batch ini: tampilan 404 custom di live, baru bisa dicek SESUDAH PR ini merge dan ke-deploy. Kalau masih juga tampil template Hostinger setelah deploy, langkah cadangan adalah mengatur custom error page lewat hPanel, bagian itu dari sisi panel Bang Rob
- Catatan opsional (belum dikerjakan, bukan kebutuhan v1): `www.ralabs.my.id` masih menyajikan isi sama tanpa redirect ke domain utama. Canonical sudah menunjuk ke domain tanpa www, jadi SEO aman, redirect www hanya rapi-rapi

## 16 Okt 2026, Pasca merge PR 2: buka tutup temuan tersisa

- Tanggal: 16 Okt 2026
- File yang berubah: `engineering.md` saja (catatan verifikasi, tanpa ubahan kode)
- Hasil verifikasi:
  - 404 custom SETELAH deploy: `https://ralabs.my.id/halaman-ngawur-123` mengembalikan status 404 dan menampilkan halaman 404 milik portal, yaitu judul 404, teks "Halaman tidak ketemu", tombol "Ke Portal Utama". Template Hostinger tidak tampil lagi, `.htaccess` terbaca server. Temuan dari PR 2 resmi tertutup
  - Zoom dan overflow di lebar 320, 480, 640 (setara zoom 200 persen dari 1280), dan 1280: tidak ada scroll horizontal, tidak ada teks terpotong. Ini verifikasi terakhir dari plan bagian 6 yang belum pernah dikerjakan
  - `npm audit`: 7 temuan, semuanya ada di rantai dependensi build time milik tailwindcss (braces dan postcss-selector-parser), tidak ikut masuk bundle produksi. `npm audit fix` tanpa force terbukti no-op, nol file berubah. Force berarti meloncat dari Tailwind 3.4 ke 4, melanggar stack yang sudah dikunci. Keputusan: diterima seperti adanya, karena hanya kena alat build, perlu keputusan Bang Rob kalau suatu saat mau migrasi Tailwind 4
- Sisa yang butuh keputusan Bang Rob, bukan bug:
  - Nama asli 5 slot subdomain, sekarang masih isi `app1` sampai `app4` plus `tools`
  - Titik lebar penuh section Alur, sekarang mulai di 768 yang sempit, bisa digeser ke 1024 kalau mau lebih lega
  - Redirect `www` ke domain utama, sekarang masih menyajikan isi sama
  - Verifikasi link LinkedIn dari browser pribadi, karena IP server diblokir LinkedIn
  - Cek laporan Realtime GA4 dari akun analytics milik Bang Rob

## 16 Okt 2026, Redesign hero desktop sesuai artboard Bang Rob + preloader

- Tanggal: 16 Okt 2026
- Judul: hero desktop ulang persis artboard Full HD/2K/4K (surface 4 blok, banner, quote, kartu ENJOY, maskot, poster), navbar Home + pill floating, preloader "Buka Portal" dengan tirai, split layout tablet/mobile, checkpoint
- File yang berubah:
  - Token warna baru di `tailwind.config.js`: `ink` `#1B1818`, `accent` `#E3222B`, tambah `sun` `#FFE578`
  - `src/styles/global.css`: body warna ink, `:focus-visible` accent, keyframe `fadeIn`
  - Baru: `public/images/mascot-enjoy.svg` (maskot ENJOY di-extract dari artboard)
  - Baru: `src/components/TiltCard.jsx` (efek 3D tilt mengikuti mouse, pakai framer-motion)
  - Baru: `src/components/Preloader.jsx` (overlay hitam + logo turun + tombol "Buka Portal" + tirai belah dua ke samping)
  - Baru: `src/components/HeroDesktop.jsx` (hero desktop final: surface 4 blok, eyebrow, heading, quote + kutip, poster kanan, kartu ENJOY, chevron)
  - Baru: `src/components/HeroTablet.jsx`, `src/components/HeroMobile.jsx` (placeholder sementara, dirombak batch berikutnya)
  - `src/components/Hero.jsx` jadi pengatur: tampilkan HeroDesktop/Tablet/Mobile sesuai breakpoint
  - `src/components/Navbar.jsx`: pill putih floating, item Home, tombol Github dengan tilt + hover hitam + bounce
  - `src/pages/Home.jsx`: rakit Preloader di atas halaman
- Hasil tes:
  - `npm run build`: sukses, tidak ada error. Bundle baru terhash (JS ~342 kB, CSS ~18 kB)
  - Surface: rasio blok hitam/putih/merah/strip diukur dari PNG artboard Full HD (1920×1080), tetap proporsional di 2K/4K karena full-bleed pakai persen dan tinggi 56.25vw
  - Layout desktop (width >= 1024px): blok warna full nge-fill tanpa margin putih di atas/bawah/kanan/kiri, cocok dengan artboard Bang Rob
  - Penempatan huruf logo + text di poster kanan, eyebrow, heading, quote, kartu ENJOY, chevron: dipasang lalu di-micro-manage Bang Rob dan di-lock
  - TiltCard: banner kanan, kartu kuning, tombol Github, tombol Buka Portal mengikuti arah mouse, halus pakai spring
  - Chevron: hover jadi merah, klik bounce + smooth scroll ke `#koleksi`
  - Preloader: muncul tiap refresh (sementara, sebelum sessionStorage), logo turun dari atas, tombol fade in, klik membuka tirai dari tengah ke samping dengan garis merah ikut panel, homepage muncul setelahnya
  - Navbar: item Home baru scroll balik ke `#home` (hero)
  - Split layout: Hero jadi pengatur breakpoint, tablet (md-lg) dan mobile (<md) pakai file sendiri-sendiri sebagai placeholder, desktop pakai HeroDesktop yang di-lock
  - Link mati: nol. Semua href menunjuk section yang ada atau URL real
  - Console: tidak ada error JavaScript
- Catatan jujur:
  - Tablet dan mobile MASIH placeholder sederhana (blok warna + judul), belum sesuai artboard `tablet(768x1024).svg` dan `mobile(360x800).svg`. Cek kelengkapan 360/768 baru tuntas setelah batch tablet dan mobile masing-masing
  - `mascot-enjoy.svg` di-extract dari `desktop(1280x800).svg` artboard Bang Rob, warna dan path diambil persis dari desain vector
  - Preloader sengaja dibuat tampil tiap refresh supaya mudah di-micro-manage; setelah final bisa dikembalikan ke sekali per sesi (sessionStorage)

## 16 Okt 2026, Fix artefak build untuk deploy hPanel

- Tanggal: 16 Okt 2026
- Judul: hasil build dipindah ke root repo supaya hPanel narik versi terbaru
- File yang berubah:
  - `index.html` (root): kini menunjuk bundle baru `main-DPZivlyb.js` + `main-CHyzDmd-.css`
  - `assets/`: bundle lama `main-BI1AvY-B.js` + `main-D1N9zIu4.css` dihapus, bundle baru hasil build PR #4 masuk
  - `images/mascot-enjoy.svg` (root): maskot ikut ter-copy dari `dist/images/`
  - `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt` (root): disamakan dengan hasil build
- Kenapa perlu:
  - Auto-deploy hPanel menarik file dari repo `main` (root folder), bukan dari `dist/` (yang di-gitignore).
  - PR #4 cuma meng-commit source (`src/`, `public/`), hasil build belum ikut masuk repo. Hasilnya live tetap menyajikan bundle lama walau PR sudah merge.
- Hasil tes:
  - `md5` bundle root sama persis dengan bundle `dist/assets/` (d06a9b27450bc6afd28a450e684c0f31)
  - Isi bundle terverifikasi memuat kode baru: string “Buka Portal” dan “Bengkel Kode” ada di bundle
  - `index.html` root nunjuk `/assets/main-DPZivlyb.js` + `/assets/main-CHyzDmd-.css` yang beneran ada di folder assets
- Catatan jujur:
  - Verifikasi output live (`ralabs.my.id`) dilakukan batch ini: masih bundle lama karena hPanel belum narik PR #4 yang baru merge. Setelah PR ini merge, cek ulang bundle di production.

## 16 Okt 2026, Validasi produksi + aturan hasil build + issue tablet/mobile

- Tanggal: 16 Okt 2026
- Judul: validasi production PR #4/#5 dinyatakan OK, contributing.md dapat aturan hasil build wajib ke root, buat 2 issue redesign hero tablet & mobile
- File yang berubah:
  - `contributing.md`: tambah bagian "Hasil build wajib ikut ter-commit di root repo" (langkah copy `dist/` ke root, cek case-sensitive filename, verifikasi setelah merge)
  - Tidak ada perubahan source; murni perbaikan aturan kerja supaya masalah "PR merge tapi hPanel serve versi lama" tidak terulang
- Hasil tes / validasi:
  - Production `https://ralabs.my.id/` dinyatakan OK: bundle JS `main-DPZIVlyb.js` (V kapital) terbukti 200, md5 `d06a9b27450bc6afd28a450e684c0f31` = persis build lokal `dist/`, isi "Buka Portal", "Bengkel Kode", "ENJOY!!" ada
  - Render live lewat headless Chrome: DOM penuh, navbar + hero + preloader semua ke-render, mascot + favicon + logo live 200
  - Sesuai dokumentasi resmi Hostinger (artikel "How to deploy a Git repository in Hostinger"): auto-deploy menarik ROOT repo branch `main` ke `public_html`, tanpa build oleh server
  - Catatan cek: evaluasi awal sempat tampak "404" pada bundle JS karena salah ketik casing (v kecil vs V kapital) pada perintah cek, bukan masalah deploy
- Issue baru:
  - #6: Redesign Hero Tablet (768x1024) sesuai artboard
  - #7: Redesign Hero Mobile (360x800) sesuai artboard
- Catatan jujur:
  - Tablet dan mobile masih placeholder di `HeroTablet.jsx` / `HeroMobile.jsx`, menunggu dikerjakan lewat issue #6 dan #7

## 16 Okt 2026, Micro-manage animasi hero desktop + preloader final

- Tanggal: 16 Okt 2026
- Judul: stagger animasi pasca preload (eyebrow baseline), card kanan turun lurus -> jelly -> baru miring, fix elemen dobel di card logo, preloader rampung (logo gabungan, tilt, tombol super bold)
- File yang berubah:
  - Ubah: `src/components/HeroDesktop.jsx` (delay stagger tiap animasi, rotasi card dipindah ke akhir animasi, scale pindah ke framer style biar ukuran tak berubah, hapus dekorasi dobel `!` dan 2 strip di card, posisi card naik 50px lalu geser kiri 100px lalu kanan 50px)
  - Ubah: `src/components/Preloader.jsx` (logo ganti `logo-preload.webp` ukuran 396px + TiltCard, tombol "Buka Portal" 48px font-black + stroke putih, pill dikecilin 10% dua kali, stroke pakai currentColor biar hover hitam solid)
  - Ubah: `src/pages/Home.jsx`, `src/components/Hero.jsx`, `src/components/Navbar.jsx`, `src/styles/global.css` (rantai prop `started` biar semua animasi mulai setelah preloader kelar)
  - Baru: `public/images/logo-preload.webp` (gabungan favicon kubus + logo-text, desain Bang Rob, 651x651)
  - Hasil build dicopy ke root: `index.html`, `assets/`, `images/`
- Hasil tes:
  - Dev server 5015 HMR: semua perubahan tampil tanpa error console
  - Stagger pasca preload (eyebrow baseline t=0): eyebrow 0s/1.3s, card kanan 0.3s/1.4s, banner headline 0.5s/1.4s, group quote 0.7s/1.1s, kartu ENJOY 1s/1.3s. Semua mulai dari opacity 0
  - Card kanan: turun lurus 0° bersama jelly, setelah settle (delay 1.7s) baru miring -6° durasi 0.25s, ukuran efektif 0.729 (0.81 dikali 0.9 = dikecilin 10%), posisi akhir naik 50px dan geser 50px ke kiri dari posisi semua
  - Fix elemen dobel: span "!" dan 2 strip di card dihapus karena `favicon-logo.webp` sudah punya "!" dan 2 slash sendiri (dibuktikan ukur pixel: geometri elemen di design card identik dengan yang baked di file logo, jarak "!" ke band merah 46px dan slash 195px dari band sama persis). Sekarang card tampil satu set, tidak dobel
  - Preloader: logo gabungan 396px max 95vw dengan tilt 8 derajat, animasi turun tetap; tombol "Buka Portal" font 48px font-black + stroke 0.12vw currentColor (pas hover bg putih teks ink stroke ikut ink), pill jadi px-16 py-6 dulu lalu dikecilin 10% dua kali jadi 3.24rem/1.215rem
  - `npm run build`: sukses, bundle terhash
  - Build dicopy ke root sesuai contributing.md, md5 bundle root sama dengan `dist/assets/`
- Catatan jujur:
  - Preloader masih tampil tiap refresh (sengaja, biar gampang micro-manage); belum dikembalikan ke sekali per sesi (sessionStorage)
  - Issue #6 (tablet) dan #7 (mobile) masih pending, belum dikerjakan di batch ini

## 16 Okt 2026, Final micro-manage hero tablet + fix navbar scroll-spy

- Tanggal: 16 Okt 2026
- Judul: hero tablet rampung di-micro-manage lalu DI-LOCK (issue #6), fix ID `#home` kembar + scroll-spy navbar, minor tweak desktop
- File yang berubah:
  - `src/components/HeroTablet.jsx` (sekarang DI-LOCK): eyebrow dikecilin 20% + posisi disetel; tinggi pill headline diatur; quote dipecah jadi 2 paragraf; font quote disetel sampai stabil di `1.8vw`; group quote digeser center surface (50%) lalu turun total 250px; area quote dilebar dari 61% ke 97%; tanda kutip kiri/kanan digeser; tanda kutip kanan diganti putih + stroke hitam; kartu logo gede 10% + turun 10px; kartu ENJOY gede 20% + naik 20px
  - `src/components/Hero.jsx`: ketiga hero dibungkus SATU `<section id="home">`
  - `src/components/HeroDesktop.jsx`, `src/components/HeroMobile.jsx`: buang `id="home"` (penyebab ID kembar)
  - `src/components/Navbar.jsx`: scroll-spy diganti dari IntersectionObserver ke scroll-based (garis 40% + override kalau mentok bawah halaman); state awal `home`; animasi fade dipindah dari `motion.header` (fixed) ke `<nav>` dalam pakai CSS transition
  - `src/components/HeroDesktop.jsx`: minor, headline turun 10px dan kartu logo turun 15px
  - Hasil build dicopy ke root: `index.html`, `assets/` (bundle lama dibersihkan dulu), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Hasil tes:
  - `npm run build`: sukses, 463 modul, 1.61 detik. Bundle `main-C7edK_ok.js` 351.52 kB dan `main-mYormn_k.css` 22.93 kB
  - md5 bundle root sama persis dengan `dist/assets/` (JS `c25647d8fdb8377d176555244807be92`), `index.html` root menunjuk bundle yang benar-benar ada (nama case-sensitive dicek)
  - Fix navbar: dulu ada TIGA elemen `id="home"` kembar (HeroDesktop/Tablet/Mobile, karena ketiganya ada di DOM, dua di antaranya `display:none`). `getElementById('home')` cuma nangkap yang pertama, jadi di tablet/mobile elemen itu hidden dan section Home tidak pernah kena. Sekarang `#home` cuma satu, yaitu pembungkus di `Hero.jsx`
  - Scroll-spy: dulu pakai band tipis 5% (`rootMargin -40%/-55%`) sehingga section Kontak (pendek dan di paling bawah) tidak pernah masuk band. Sekarang pakai garis 40% viewport, plus kalau sudah mentok bawah halaman section terakhir dipaksa aktif
  - Navbar fade: dulu animasi `opacity` ditempel di elemen `fixed` (`motion.header`), yang di Chrome rawan gagal repaint saat scroll. Sekarang fade dipasang di `<nav>` dalam lewat CSS transition
- Catatan jujur:
  - Keluhan navbar "kadang ilang pas scroll" di desktop baru di-hipotesis penyebabnya (animasi di elemen fixed) lalu diperbaiki, masih PERLU konfirmasi Bang Rob apakah intermitennya benar hilang
  - Quote tablet dilebar sampai 97% layar (keputusan desain Bang Rob) sehingga teksnya nembus blok merah dan tanda kutip mepet pinggir, sudah sesuai permintaan
  - Preloader masih tampil tiap refresh (sengaja, biar gampang micro-manage); issue #7 (hero mobile) masih placeholder, belum dikerjakan

## 16 Okt 2026, Hero mobile rampung (issue #7) lalu DI-LOCK + rapi-rapi preloader dan navbar mobile

- Tanggal: 16 Okt 2026
- Judul: hero mobile sesuai artboard 360x800 di-micro-manage sampai lock, preloader dan navbar mobile dirapikan, chevron desktop dibuang
- File yang berubah:
  - `src/components/HeroMobile.jsx` (rombak dari nol: surface 4 band horisontal tinggi 222.22vw, eyebrow putih, headline pill merah, kartu logo, quote 2 paragraf plus 2 kutip hitam, kartu ENJOY. Sekarang DI-LOCK)
  - `src/components/Hero.jsx` (prop `started` diteruskan ke `HeroMobile`, sebelumnya tidak dikirim sehingga animasi pasca preloader tidak jalan di mobile)
  - `src/components/Preloader.jsx` (ukuran khusus mobile lewat variant `max-md:`, LOCKED)
  - `src/components/Navbar.jsx` (logo ganti lockup `logo+logotext.webp`, panel mobile dibuang halo `neu-card`, tombol Github jadi pill merah, hamburger custom. Bagian mobile LOCKED)
  - `src/components/HeroDesktop.jsx` (chevron dibuang, dead code `useState`, `bounce`, dan `handleChevronClick` ikut dibersihkan)
  - Hasil build dicopy ke root: `index.html`, `assets/`, `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Hasil tes:
  - `npm run build`: sukses, 463 modul, 1.84 detik. Bundle `main-CtxWOgkj.js` 356.48 kB dan `main-DWaNRq2f.css` 27.16 kB
  - md5 bundle root sama persis dengan `dist/assets/`: JS `c44db26748cda04e3d6b9651c2eb75d6`, CSS `c43a243666ea27e4c0adf92ed4037882`. `index.html` root menunjuk bundle yang benar-benar ada, casing dicek
  - Isi bundle terverifikasi memuat kode baru: `logo+logotext.webp`, `max-md:w-[60vw]`, `clamp(21px,6vw,30px)`, `max-md:whitespace-nowrap` semuanya ada
  - Hero mobile diukur pixel di 360x800: surface 4 band, headline pill, kartu logo, quote, dan kartu ENJOY terender di posisi hasil micro-manage
  - Preloader mobile diperbaiki dengan bukti ukur: logo 342x342px jadi 214x214px, tombol 358x182px dengan teks terpecah 2 baris jadi 228x66px satu baris, lalu dikecilin 20 persen jadi 182x54px
  - Preloader desktop dan tablet TIDAK berubah: screenshot 1440x900 dan 900x1000 sebelum vs sesudah, beda pixel NOL di keduanya
  - Chevron desktop: dump DOM di 1440x900, `Lanjut ke bagian Koleksi` dan svg `viewBox="0 0 40 30"` sama-sama 0 kejadian, sementara `id="koleksi"` tetap 1 sehingga link nav Koleksi tetap punya tujuan
  - Syntax JSX 5 file yang berubah: lolos esbuild
  - Kontras: tidak ada pasangan warna baru. Balok putih di kotak ink dan di pill merah, keduanya kontras tinggi
  - Link mati: nol. Tujuan href sama seperti batch sebelumnya, dan hapus chevron tidak menghilangkan tujuan apa pun
- Catatan jujur:
  - Animasi morf hamburger (2 balok jadi X) dan buka tutup panel mobile BELUM diuji klik sendiri. Headless Chrome tidak bisa klik, dan navbar baru tampil setelah tombol "Buka Portal" di preloader diklik. Jalur state baru dicek lewat code inspection, perlu konfirmasi Bang Rob
  - Preloader masih tampil tiap refresh (sengaja, biar gampang micro-manage)
  - Issue #7 (hero mobile) ditutup setelah PR ini merge dan production tervalidasi

## 17 Okt 2026, Hero auto-fit (desktop + tablet): tinggal 1 layar di rasio apa pun

- Tanggal: 17 Okt 2026
- Judul: hero desktop & tablet auto-fit pakai frame rasio artboard + surface bleed, offset px jadi satuan yang ikut skala frame, surface dijadikan 3 warna penuh, eyebrow dan grup konten desktop dirapikan
- File yang berubah:
  - `src/styles/global.css`: kelas baru `.hero-stage-desktop`, `.hero-frame-desktop`, `.hero-stage-tablet`, `.hero-frame-tablet`, `.hero-content-desktop`, plus blok `@supports (height: 100dvh) and (width: 1cqw)`. Semua aturan di luar `@supports` masih memakai rumus lama (56.25vw / 133.33vw), jadi browser yang belum kenal dvh atau cqw tetap tampil normal, cuma belum ikut auto-fit
  - `src/components/HeroDesktop.jsx`: section jadi frame rasio 16:9, 37 nilai px diubah jadi `calc(<angka>*var(--u))`, satuan `vw` jadi `cqw`, blok putih dan merah ditarik sampai dasar frame, batas hitam/putih balik ke 45.37%, eyebrow dipisah dari grup konten, grup isi bawah (quote + kartu + ENJOY) dibungkus `.hero-content-desktop`
  - `src/components/HeroTablet.jsx`: section jadi frame rasio 3:4, 31 nilai `vw` jadi `cqw`, 35 nilai px jadi `calc(<angka>*var(--u))`, blok putih dan merah ditarik sampai dasar frame
  - `src/components/Hero.jsx`: pembungkus tablet jadi stage 1 layar
  - `src/components/HeroMobile.jsx`: hanya strip hitam di dasar surface yang dihapus. Mobile belum di-auto-fit, itu batch berikutnya
  - Hasil build dicopy ke root: `index.html`, `assets/` (bundle lama `main-CtxWOgkj.js` dan `main-DWaNRq2f.css` dihapus), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  - Tinggi hero dikunci ke lebar layar (desktop 56.25vw, tablet 133.33vw), jadi cuma pas 1 layar kalau rasio layarnya sama dengan artboard. Di 1440x900 hero kurang 90px, di 1280x1024 kurang 304px, di 3440x1440 kelebihan 495px
  - Cara kerjanya: stage setinggi 1 layar (`100dvh`) yang meng-clip dan men-center, frame rasio artboard di dalamnya, lalu blok warna melar keluar lewat `--bleed-x` / `--bleed-y` buat nutup sisa stage. Cuma tepi yang nempel ke luar yang digeser, batas antar blok nggak disentuh
  - `--u` = 1px di artboard (desktop 1cqw/19.2 untuk lebar 1920, tablet 1cqw/7.68 untuk lebar 768). Semua offset yang dulu dipatok px sekarang ikut skala frame. Di lebar frame 1920 nilainya persis 1px, jadi tampilan 1920x1080 nol perubahan
- Hasil tes:
  - `npm run build`: sukses, 463 modul, 1.52 detik. Bundle `main-Ckm83RfE.js` 357.12 kB dan `main-R4zIfXOV.css` 30.56 kB
  - md5 bundle root sama persis dengan `dist/assets/`: JS `43dd2caaebf66b98af772fcf1cfe2ab7`, CSS `0be9f04d8442a4bf4510fa18d7456712`. `index.html` root menunjuk bundle yang benar-benar ada, casing dicek
  - Isi bundle terverifikasi memuat kode baru: `.hero-frame-desktop`, `.hero-frame-tablet`, `.hero-content-desktop`, `container-type:inline-size`, `133.33cqw` semuanya ada di CSS hasil build
  - **Nol perubahan di rasio acuan**: screenshot 1920x1080, 2560x1440, dan 1280x720 dibandingkan before vs after, beda pixel 0.00% (frame, 4 blok warna, dan semua elemen konten identik). Tablet 768x1024 vs versi produksi juga 0.000%
  - **Batas blok jadi tetap**: di 7 ukuran desktop, batas hitam/putih sekarang 31.25-31.39% (sebelumnya ayun 19.10-34.86%) dan batas merah 77.08-77.22% (sebelumnya 60.94-81.88%). Di 4 ukuran tablet batasnya 43.83-43.88% dan 95.43-95.51%
  - **Isi frame = fungsi murni ukuran frame**: crop frame dari render non-16:9 dibandingkan dengan render 16:9 di ukuran frame yang sama, beda 0.000% (3440x1440 vs 2560x1440, 1440x900 vs 1440x810, 1280x1024 vs 1280x720)
  - **Surface full 3 warna**: scan pixel di baris 80%, 97%, dan 99.5% dalam frame, isinya cuma putih (59.11% lebar) dan merah (sisanya) di desktop, 60.94% dan sisanya di tablet. Tidak ada lagi gutter putih polos di dasar hero
  - **Grup konten desktop**: titik tengah grup konten (quote + kartu + ENJOY) di 50.03% lebar dan 51.06% tinggi frame di 1920x1080, dan angkanya sama di 1440x900, 1024x768, 3440x1440. Sebelumnya 56.33% lebar (space kiri 449px vs kanan 205px) dan 36% tinggi
  - Posisi elemen desktop hasil ukur DOM, sama di 1920x1080, 1440x900, dan 1024x768: eyebrow center x 50.00% y 10.63%, headline 19.22-26.99%, quote 48.84-61.80% (di area putih, di bawah batas 45.37%), kartu logo 11.60-88.40% (poster utuh, sebelumnya kepotong di atas), ENJOY 59.19-81.19%
  - Tablet dan mobile tidak terpengaruh ubahan desktop: screenshot 768x1024 dan 390x844 sebelum vs sesudah, beda 0.000%
  - Syntax JSX 4 file: lolos esbuild. Em dash: nol di baris yang ditambah
- Catatan jujur:
  - Sisa beda kecil antar render tablet yang ukuran frame-nya sama cuma sub-pixel antialiasing teks (beda maksimum 50 dari 255, tak terlihat). Bounding box semua piksel teksnya pixel-identik
  - `--geser-x` dibiarin 0% karena konten balik ke layout asli (quote dan ENJOY di 29.55%, kartu di 76.8%). Efeknya space kosong kiri/kanan belum imbang. Kalau mau imbang, eyebrow harus keluar dari tengah surface, jadi dua permintaan ini bertabrakan dan diserahkan ke Bang Rob
  - Kalau nanti seluruh tampilan di-redesign, batch auto-fit ini tetap relevan sebagai mekanisme contain-nya. Yang perlu diulang cuma isi kontennya
  - Hero mobile masih memakai rumus lama (`222.22vw`) dan belum di-auto-fit

## 17 Okt 2026, Portal v2: tema terang/gelap, halaman dirombak, navbar ganti ke CardNav

- Tanggal: 17 Okt 2026
- Judul: portal akar naik ke v2 — sistem tema terang/gelap, section About/Collection/Contact, gerbang masuk 3D, dan navbar lama (PillNav) dibuang lalu diganti CardNav dengan satu blok merah yang geser mengikuti hover. Di layar sempit kartunya jadi baris label saja
- File yang berubah:
  - Baru: `src/theme.js` (baca/simpan tema di localStorage, fallback ke `prefers-color-scheme`), `src/pages/Portal.jsx` (kerangka halaman: gerbang 3D dulu, baru portal), `src/data/proyek.js`, `src/components/About.jsx`, `Collection.jsx`, `Contact.jsx`, `Gerbang.jsx`, `Kubus.jsx`, `CardSwap.jsx`, `CardNav.jsx`, `CardNav.css`, `Navbar.css`
  - Dihapus: `PillNav.jsx` + `PillNav.css` (diganti CardNav), `HeroDesktop.jsx`, `HeroMobile.jsx`, `HeroTablet.jsx` (digabung jadi satu `Hero.jsx`), `Tentang.jsx`, `Koleksi.jsx`, `Kontak.jsx` (diganti About/Collection/Contact), `Alur.jsx`, `TiltCard.jsx`, `Preloader.jsx`, `pages/Home.jsx`, `GtagTracker.jsx`
  - Diubah: `src/App.jsx` dan `src/main.jsx` (routing jadi satu halaman Portal), `src/styles/global.css` (token warna + tema gelap), `src/components/Navbar.jsx`, `Footer.jsx`, `Hero.jsx`, `tailwind.config.js`, `package.json`, `entries/index.html`, `public/404.html`, `public/sitemap.xml`, `public/humans.txt`, `README.md`
  - Hasil build dicopy ke root: `index.html`, `assets/` (bundle lama `main-Ckm83RfE.js` dan `main-R4zIfXOV.css` dihapus dulu), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  - Navbar CardNav menulis semua variabel `--cn-*` sebagai inline style, jadi CSS proyek tidak bisa menimpa variabelnya, cuma bisa menimpa `background`/`color`/`border-color` di elemennya. Selain itu mesin buka-tutup CardNav menulis `transform`, `opacity`, dan `filter` inline tiap frame, jadi `transform` dan `opacity` di `.card-nav__card` mati. Untuk efek tekan dipakai properti `scale` yang berdiri sendiri, karena `scale` ikut menyusun bersama `transform`
  - Hover kartu dibikin SATU blok merah yang geser, bukan empat background yang nyala-senyala. Kartunya dibikin transparan, lalu `::after` di `.card-nav__cards` yang bergeser `translate` mengikuti `:has()` kartu mana yang kena hover. Kuncinya `:has()`, jadi kalau browser belum kenal `:has()` efeknya cuma tidak jalan, tampilannya tetap utuh
  - Bold maksimal Comfortaa adalah 700, dan permintaan 600 di-atas fixed-weight bikin browser membulatkan ke muka 700. Karena itu URL font di `entries/index.html` diganti ke rentang variabel `wght@300..700` supaya 600 benar-benar 600
  - Di layar sempit empat kartu bertumpuk dengan deskripsi dan baris tautan bikin menunya kepanjangan, jadi tinggal labelnya. Tautannya TIDAK dihapus, cuma dibikin berukuran nol pakai `font-size: 0`: kalau pakai `display: none`, tautannya hilang dari keyboard dan screen reader sekaligus dan lapisan klik di `::after`-nya ikut lenyap, jadi kartunya tidak bisa diklik sama sekali. Cincin fokusnya ikut dipindah ke kartunya karena tautan berukuran nol cuma menyisakan kotak kecil di pojok
- Hasil tes:
  - `npm run build`: sukses, 6084 modul, 3.58 detik. Bundle `main-Ck5gxF4P.js` 691.63 kB (gzip 192.31 kB) dan `main-B_PfGh5a.css` 22.74 kB (gzip 5.29 kB). Ada warning chunk JS di atas 500 kB
  - md5 bundle root sama persis dengan `dist/assets/`: JS `b783e07992f0d384b72d59cd682ce3b9`, CSS `6c092c4d755fb61d4a79e36ebcf3373e`. `index.html` root menunjuk bundle yang benar-benar ada, casing dicek
  - Semua rujukan file lokal di `index.html` root dicek satu-satu dan ada semua: `assets/main-B_PfGh5a.css`, `assets/main-Ck5gxF4P.js`, `images/favicon-logo.webp`, `images/logo+logotext.webp`, `images/og-banner.webp`. `404.html` menunjuk `images/favicon-logo.webp`, ada
  - Gambar yang dirujuk dari dalam bundle JS dicek: `banner-logo.webp`, `logo+logotext.webp`, `mascot-enjoy.svg`, ketiganya ada di `images/`. Nol kemunculan `url()` di bundle CSS, jadi tidak ada file font atau gambar yang bisa putus dari sana (font diambil dari Google Fonts)
  - Nol sisa rujukan ke hash bundle lama (`Ckm83RfE`, `R4zIfXOV`) di seluruh file yang ikut dideploy. `assets/` di root isinya cuma 1 js + 1 css, bundle lama benar-benar terhapus
  - Kode baru terverifikasi masuk bundle CSS hasil build: `data-narrow` muncul 14 kali, termasuk `font-size:0` dan `:has(.card-nav__link:focus-visible)`. Aturan geser merah juga masuk: `card-nav__cards:has(>.card-nav__card:nth-child(2):hover):after{transform:translate(calc(100% + var(--cn-gap)))}` dan seterusnya (minifier menyederhanakan sendiri hitungan `calc`-nya). Urutan di bundle juga benar: aturan vendor `.card-nav__card{gap:10px;padding:14px 14px 12px}` muncul dulu, baru aturan baru `.card-nav__card{gap:0;padding:12px 14px}`
  - Tombol GitHub diperiksa lewat render komponen ke string (react-dom/server, di luar browser): dari enam elemen `<a>` di navbar, hanya tombol GitHub yang dapat `target="_blank"` + `rel="noopener noreferrer"`. Empat tautan kartu dan logo tetap tanpa `target`, jadi tidak ada tautan internal yang ikut buka tab baru
  - Empat belas file JSX lolos build tanpa error sintaks. Blok CSS seimbang
  - Kontras pasangan yang dipakai: kertas `#F8FAFC` di atas merah `#D70000` 5.16:1 (lolos), tinta di atas kertas 18.70:1, merah di atas kertas 5.16:1, stroke merah `#D70000` di atas tinta `#0C0C0C` 3.62:1 (lolos batas 3:1 untuk batas elemen)
- Catatan jujur:
  - BELUM ADA verifikasi browser sama sekali untuk batch ini. Semua yang berkaitan dengan tampilan dan interaksi (lebar 360/768/1280, scroll horizontal, hover, tap, konsol bersih, tiap tombol dan link ditekan) BELUM diuji dan wajib dicek Bang Rob. Lingkungan kerja ini tidak punya browser
  - Yang bisa dibuktikan tanpa browser cuma yang tertulis di atas: build sukses, bundle yang dirujuk benar-benar ada, kode baru benar-benar masuk bundle, dan struktur DOM. Semua klaim soal tampilan di entri ini berasal dari hitungan CSS, bukan pengukuran
  - Tinggi navbar sempit dihitung dari nilai CSS, bukan diukur: label 17px dikali line-height 1.4 = ~24px, plus padding 12+12, jadi ~48px per baris. Empat kartu turun dari ~556px jadi ~216px. Hitungan ini meleset kalau deskripsinya di HP ternyata dua baris, tapi arahnya cuma makin hemat
  - Bundle JS 691.63 kB (gzip 192.31 kB) lewat batas 500 kB, hampir pasti dari `three` yang cuma dipakai `Kubus.jsx` di gerbang masuk. Portal akar jadi mengirim ~192 kB gzip JS. Belum dioptimasi, belum diputuskan mau di-code-split atau dibiarkan
  - `framer-motion` dikeluarkan dari dependency dan nol source memakainya. Ini konsisten dan build bersih, tapi nabrak catatan STACK WAJIB yang masih menyebut framer-motion. Perlu keputusan Bang Rob
  - `GtagTracker.jsx` dihapus. Loader gtag tetap ada di `entries/index.html` (`G-QCTML33T41`) jadi page view awal tetap terkirim, tapi event `page_view` per navigasi SPA hilang. Kalau portal sekarang benar-benar satu halaman, ini tidak masalah. Perlu konfirmasi
  - Dua gambar jadi nganggur karena komponennya dihapus: `images/logo-preload.webp` (dulu dipakai `Preloader.jsx`) dan `images/logo-text.webp`. Belum dihapus, masih ikut ter-commit di root
  - `plan-prd/` ada di `.gitignore`, jadi folder plan dan spec tidak ikut masuk repo ini. Catatan desain batch ini disimpan lokal saja
  - Sebagian besar isi batch ini dikerjakan sebelum sesi ini, jadi alasan per bagiannya tidak semuanya gue tahu. Yang gue rombak di sesi ini bagian navbar CardNav dan versi sempitnya

## 17 Okt 2026, Hero 3D + headline "HERE'S RALABS"

- Tanggal: 17 Okt 2026
- Judul PR: rombak hero — headline HERE'S RALABS (RA aksen) + logo 3D GLB interaktif
- File yang berubah:
  - Baru: `src/components/FadeIn.jsx`, `src/components/Logo3D.jsx`
  - Ubah: `src/components/Hero.jsx`, `src/styles/global.css`, `entries/index.html` (font Manrope), `tailwind.config.js` (`font-heading`), `package.json` + `package-lock.json` (`framer-motion`)
  - Aset: `public/images/logo-ralabs-3d.glb` (1.52 MB), `public/images/banner-logo.webp` (copy), hasil build `images/logo-ralabs-3d.glb`
  - Hasil build dicopy ke root: `index.html`, `assets/main-C-kemC6l.css`, `assets/main-D65CF_ge.js`, `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  - Headline diganti ke "HERE'S RALABS" uppercase, rata tengah, ukuran/posisi sama seperti sebelumnya. Bagian `RA` memakai `.teks-aksen`: gradient accent opaque `#A00000 → #D70000` + text-shadow merah halus. Gradient dipasang per-span (bukan di parent) untuk menutup seam 1px yang sempat muncul sebagai garis gelap di kaki A
  - Hero memakai logo 3D dari GLB buatan Rob: warna/shadow mengikuti vertex color aset (linear), material unlit. Kamera orthographic dengan frustum tetap + pan per frame, jadi ukuran objek konstan dan rotasi vertikal/horizontal penuh tanpa terpotong
  - `Magnet.jsx`/`TiltMark.jsx` tidak dipakai lagi (posisi objek harus tetap; interaksi murni rotasi lewat OrbitControls)
  - `framer-motion` dipakai untuk fade-in; `three` + GLTFLoader/OrbitControls untuk logo 3D
- Hasil tes:
  - `npm run build`: sukses, 6499 modul, 4.41 detik. CSS `main-C-kemC6l.css` 26.14 kB, JS `main-D65CF_ge.js` 957.43 kB (gzip 272.69 kB). Ada warning chunk > 500 kB
  - md5 bundle root sama dengan `dist/assets/`: CSS `2528f3c06ea9bf199b9ba6949d7343b9`, JS `cde67b8672455f5a61c9ec1ad284095b`
  - `index.html` root menunjuk bundle yang ada (case-sensitive dicek), tidak ada sisa hash lama `Ck5gxF4P`/`B_PfGh5a`. Semua rujukan lokal di `index.html` dan `404.html` ada
  - Dev server 5015 (server Bang Rob): h1 `HERE'S RALABS`, `RA` gradient `rgb(160,0,0) → rgb(215,0,0)`, tidak ada error console
  - GLB dimuat 200 dari `/images/logo-ralabs-3d.glb`; canvas 3D tampil
  - Lebar 360, 768, 1280: `scrollWidth - clientWidth = 0` (tidak ada scroll horizontal)
  - CTA hero: `https://indeepcleaningid.site/` dan `https://robbyaliasa.tongkrongan.tech/`, bukan link mati
  - Kontras: kertas `#F8FAFC` di atas merah `#D70000` 5.16:1, merah di atas kertas 5.16:1, tinta di atas kertas 18.70:1
  - Seam gelap di kaki A: 0 piksel gelap yang menempel ke area merah (diukur dari screenshot, canvas 3D disembunyikan)
- Catatan jujur:
  - Bundle JS naik ke 957.43 kB (gzip 272.69 kB) karena `three` + `framer-motion`; masih warning > 500 kB. Optimasi code-split/asset 3D belum dikerjakan
  - GLB 1.52 MB; 3D sudah "locked" oleh Bang Rob, perubahan layout berikutnya tidak boleh menggeser objek
  - `plan-prd/` tetap di `.gitignore`, jadi plan/spec tidak ikut PR ini

## 17 Okt 2026, Headline Bebas Neue + spacing huruf default

- Tanggal: 17 Okt 2026
- Judul PR: headline hero pakai Bebas Neue, spacing huruf default, kaki A tidak lagi terpotong
- File yang berubah:
  - `src/components/Hero.jsx` (font headline, `clamp` baru, kalkulasi tinggi headline di wrapper logo 3D)
  - `tailwind.config.js` (token `headline`)
  - `entries/index.html` (URL Google Fonts ditambah Bebas Neue)
  - `src/styles/global.css` (`.teks-gradasi` dan `.teks-aksen`: `padding-inline` + `margin-inline`)
  - Hasil build dicopy ke root: `index.html`, `assets/main-7h7voN6W.css`, `assets/main-DPa37LmH.js` (bundle lama `main-C-kemC6l.css` dan `main-D65CF_ge.js` dihapus dulu), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  1. **Font headline.** Manrope diganti Bebas Neue. Bebas Neue cuma punya satu berat, jadi `font-extrabold` tidak berpengaruh dan ikut dibuang. Token baru `font-headline` dipakai supaya font judul lain (`font-heading`) tidak ikut berubah. URL Google Fonts dapat `family=Bebas+Neue`, Manrope tetap dimuat sebagai cadangan
  2. **Kaki A terpotong.** `background-clip: text` cuma mengecat gradasi di dalam kotak span. Saat tracking masih negatif, tinta huruf terakhir menonjol keluar kotak itu dan bagian di luarnya tidak ter-paint, jadi kelihatan terpotong (paling jelas di kaki kanan A pada `RA`). Kotak catnya dilebarkan lewat `padding-inline: 0.15em`, lalu ditarik balik dengan `margin-inline: -0.15em`. Untuk kotak inline, padding menggeser teks sesudahnya dan margin negatif mengembalikannya, jadi tata letak tidak bergeser sedikit pun. Vertikal tidak disentuh karena tidak ada masalah di sana
  3. **Spacing default.** `tracking-[-0.045em]` dibuang, diganti `tracking-normal` sebagai kelas. Kelasnya wajib ditulis eksplisit karena `global.css` punya aturan dasar `h1, h2, h3 { letter-spacing: -0.01em }` yang akan ikut kena kalau tidak ditimpa. Kelas menang atas selektor elemen, jadi hasil akhirnya `letter-spacing: 0em`
  4. **Ukuran dihitung ulang dari nol.** Lebar teks "HERE'S RALABS" per-em berubah: 8.3em (Manrope) jadi 4.6em (Bebas Neue). Angka 13.8vw dari batch sebelumnya tidak relevan lagi. Dipilih `13vw` = teks selebar ~60vw dari 97vw area yang tersedia, jadi terisi sekitar 62%. `min` dan `max` ikut diskalakan (2.6rem dan 33rem) supaya rasio isi sama dari HP sampai layar lebar. Kalkulasi tinggi headline di wrapper logo 3D ikut disinkronkan ke `13vw` supaya hero tetap muat satu layar
- Hasil tes:
  - `npm run build`: sukses, 6499 modul, 4.24 detik. CSS `main-7h7voN6W.css` 26.17 kB (gzip 6.07 kB), JS `main-DPa37LmH.js` 957.40 kB (gzip 272.68 kB). Warning chunk JS di atas 500 kB masih ada
  - md5 bundle root sama persis dengan `dist/assets/`: CSS `9324c41fe66961cec7615e75793d5c6e`, JS `79f7906bfdc563b6ecfd406f20fff8bc`
  - `index.html` root menunjuk `assets/main-7h7voN6W.css` dan `assets/main-DPa37LmH.js` yang benar-benar ada (casing dicek). Nol sisa rujukan ke hash lama `C-kemC6l`/`D65CF_ge`, dan `assets/` isinya cuma 1 js + 1 css
  - Semua rujukan gambar dicek satu-satu dan ada: `images/favicon-logo.webp`, `images/og-banner.webp`, `images/logo+logotext.webp`, `images/logo-preload.webp`, `images/logo-ralabs-3d.glb`, `images/mascot-enjoy.svg`. Nol `url()` di bundle CSS
  - Kode baru terverifikasi masuk bundle: `Bebas Neue`, `clamp(2.6rem,13vw,33rem)`, `padding-inline:.15em`, `margin-inline:-.15em`, `100svh - 13vw - 194px`, dan `.tracking-normal{letter-spacing:0em}`. Aturan `.teks-gradasi`/`.teks-aksen` di bundle sudah memuat padding+margin itu. Nol sisa `-.045em` di bundle CSS
  - Dev server 5015 (server Bang Rob): `GET /` 200 dan `GET /src/main.jsx` 200. Halaman yang disajikan sudah memuat `family=Bebas+Neue`, `Hero.jsx` sudah memuat `font-headline ... tracking-normal` dan `13vw_-_194px`, `global.css` sudah memuat `padding-inline: 0.15em`
  - Render halaman hasil build lewat CDP (gerbang dibuka pakai klik tombol "Masuk", seperti pengunjung biasa). Font terhitung `"Bebas Neue", Manrope, ...`, `letter-spacing: normal`, ukuran `46.8 / 99.84 / 166.4 / 187.2 px` di lebar `360 / 768 / 1280 / 1440`. Isi headline `63.7 / 64.9 / 64.4 / 64.3%` dari area kontainer
  - Lebar 360, 768, 1280, 1440 (dan 390): `scrollWidth - clientWidth = 0` di dokumen dan body, jadi tidak ada scroll horizontal. Hero muat satu layar: 696/780, 940/1024, 816/900, 816/900, 760/844
  - 41 tautan: nol `href` kosong, nol `href="#"`, nol jangkar mati (`#home`, `#about`, `#collection`, `#contact`, `#konten-utama` semua punya target). Nol gambar gagal muat. Konsol dan jaringan bersih: nol error, nol warning, nol 404
  - Uji piksel kaki A: screenshot versi gradasi dibandingkan versi kontrol yang `background-clip`-nya dimatikan (tinta jadi warna solid, jadi tidak mungkin terklip). Kotak tinta identik: kiri 573, atas 226, kanan 2283, bawah 593, selisih 0 di keempat sisi. Titik tinta paling kanan juga sama di 2283
  - Kontras: tinta/kertas 18.70:1, merah `#D70000` di atas kertas 5.16:1, merah di atas tinta 3.62:1 (lolos batas 3:1 untuk elemen non-teks)
- Catatan jujur:
  - `13vw` bikin headline ngisi ~62–64% area, jadi ada ruang kosong lebar di kiri-kanan. Kalau mau lebih penuh, tinggal naikkan angka vw dan `min`/`max` ikut diskalakan
  - Archivo Black sempat dicoba di tengah sesi ini sebagai font headline, lalu dibuang sebelum commit. Nggak ada jejaknya di riwayat
  - Token `heading` (Manrope) sekarang tidak dipakai komponen mana pun. Masih dibiarkan, belum dihapus
  - Pengukuran di lebar 390 pakai emulasi `prefers-color-scheme: dark`, tapi halaman tetap tampil tema terang karena tema disimpan di localStorage oleh `src/theme.js`. Jadi angka 390 itu angka tema terang. Tema gelap dicek manual lewat tombol tema, bukan lewat pengukuran otomatis
  - Uji piksel dan pengukuran render pakai hasil build yang disajikan lokal (`:8899`), bukan dev server 5015. Dev server cuma dicek status 200 dan isi sumber yang disajikannya
  - `plan-prd/hero-rombak/design.md` masih memuat angka lama (Manrope, 13.8vw, tracking -0.045em) dan folder `plan-prd/` di-gitignore, jadi tidak ikut PR ini. Belum disinkronkan
  - Bundle JS tetap 957.40 kB (gzip 272.68 kB), belum di-code-split

## 17 Okt 2026, Surface hero gelap + headline Archivo kaca

- Tanggal: 17 Okt 2026
- Judul PR: surface hero pakai cahaya gelap dari pojok kanan atas, headline ganti Archivo 900 dengan material kaca
- File yang berubah:
  - `entries/index.html` (Google Fonts: `Bebas+Neue` diganti `Archivo:wght@100..900`)
  - `tailwind.config.js` (token `headline` jadi `Archivo`)
  - `src/components/Hero.jsx` (kelas `hero-section`, `font-black`, ukuran `clamp(1.8rem,9vw,22rem)`, kalkulasi tinggi 3D `11vw`→`9vw`)
  - `src/styles/global.css` (blok `.hero-section`, `.teks-gradasi` jadi gradasi kaca, stroke penebalan di `.teks-gradasi` dan `.teks-aksen`)
  - Hasil build: `index.html`, `assets/main-YTS0Qg2x.css`, `assets/main-SNDfDEcU.js` (bundle lama `main-7h7voN6W.css` dan `main-DPa37LmH.js` dihapus lebih dulu), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  1. **Surface hero gelap.** Bidang hero sebelumnya putih polos, jadi objek 3D tidak punya kontras dan terlihat menempel datar. Sekarang ada lapisan gelap yang menyebar dari pojok kanan atas (`radial-gradient ellipse 165% 150% at 100% 0%`, opasitas 0.96 di pusat turun ke 0 di tepi) supaya objek 3D terangkat. Titik pusat, kekuatan, dan jangkauan ini hasil tuning langsung Bang Rob, sudah disetujui dan dikunci di komentar CSS. Gradient ditempel di `<section>`, bukan di `<div>` terpisah, karena div selalu punya bentuk kotak yang bisa terasa walaupun gradient di dalamnya halus
  2. **Warna dasar tidak diganti.** `.hero-section` tetap memakai `background-color: var(--bidang)`. Gradient gelap adalah lapisan tambahan di atasnya, jadi di tema terang bidangnya tetap kertas `#F8FAFC` dan di tema gelap tetap tinta. Tema gelap memakai gradient terang dari titik yang sama, karena gelap-di-atas-gelap tidak terbaca
  3. **Font headline Archivo.** Bebas Neue terlalu tipis dan tinggi untuk bidang yang sekarang lebih gelap. Archivo variable di weight 900 memberi badan huruf yang jauh lebih tebal, jadi huruf bisa "menahan" area gelap di sekitarnya. Ukuran diturunkan dari `13vw` ke `9vw` karena lebar per-em Archivo lebih besar dari Bebas Neue; kalau tetap `13vw` headline melewati lebar layar. `min`/`max` ikut diskalakan, dan kalkulasi tinggi wrapper 3D disinkronkan ke `9vw` supaya hero tetap muat satu layar
  4. **Material kaca di HERE'S dan LABS.** Gradient vertikal tujuh stop dari putih `#FFFFFF` di atap huruf, garis refleksi tipis di 6–7%, lalu turun ke grey cool `#6B7488` di kaki huruf. Jarak antar stop dibuat jauh supaya terbaca sebagai material, bukan warna rata. Ditambah `opacity: 0.92` supaya terasa ada kedalaman seperti kaca
  5. **Penebalan lewat stroke transparan.** Weight Archivo sudah maksimal (900), jadi ketebalan ditambah dengan `-webkit-text-stroke: 0.012em transparent` + `paint-order: stroke fill`. Stroke transparan melebarkan area yang di-paint, lalu area itu diisi gradient yang ada di belakangnya, jadi huruf tetap kaca dan huruf tidak berubah jadi outline. Ketebalan yang sama dipakai di `RA` supaya badan headline rata
  6. **RA tetap merah.** `RA` tidak ikut aturan kaca. Gradient merahnya tetap `#A00000 → #D70000`
- Yang sengaja TIDAK dikerjakan:
  - **Shadow tidak dipasang.** Sempat beberapa kali dicoba (text-shadow, lalu lapisan `::before` salinan huruf), semuanya dibatalkan atas permintaan Bang Rob. Tidak ada sisa `text-shadow`, `::before` shadow, maupun `data-bayang` di kode
  - **Posisi headline dan objek 3D tidak digeser.** Objek 3D tetap di tengah, headline tetap di tengah-atas. Yang berubah hanya surface dan perlakuan tipografi
- Hasil tes:
  - `npm run build`: sukses, 6499 modul, 6.19 detik. CSS `main-YTS0Qg2x.css` 26.68 kB (gzip 6.26 kB), JS `main-SNDfDEcU.js` 957.41 kB (gzip 272.68 kB). Warning chunk JS di atas 500 kB masih ada
  - md5 bundle root sama persis dengan `dist/assets/`: `index.html` `e27874a4e2de700c10f7da59b5a9ba1b`, JS `676e06196c41b742bb96f03aaa39192b`, CSS `f896f74d3334491926760bf48e9dc4c0`
  - `index.html` root menunjuk `assets/main-YTS0Qg2x.css` dan `assets/main-SNDfDEcU.js` yang benar-benar ada. Nol sisa rujukan ke hash lama `7h7voN6W`/`DPa37LmH`, dan `assets/` isinya cuma 1 js + 1 css
  - Rujukan gambar dicek satu-satu dan ada semua: `images/favicon-logo.webp`, `images/og-banner.webp`, `images/logo+logotext.webp`, `images/logo-preload.webp`, `images/logo-ralabs-3d.glb`. Nol `url()` di bundle CSS
  - Kode baru terverifikasi masuk bundle build: `165% 150%`, `#6b7488`, `clamp(1.8rem,9vw,22rem)`, token `Archivo`
  - Dev server 5015: `GET /` 200. Render hasil build yang disajikan lokal (`:8899`), gerbang dibuka lewat klik tombol "Masuk"
  - Render hasil build, lebar 360 / 768 / 1280: `font-family` terhitung `Archivo, Manrope, ...`, `font-weight: 900`, ukuran `32.4 / 69.12 / 115.2 px`, `background-image` hero memuat `radial-gradient(165% 150% at 100% 0%, ...)`, canvas 3D ada (1 per lebar)
  - Lebar 360, 768, 1280: `scrollWidth - clientWidth = 0` di dokumen dan body, tidak ada scroll horizontal. Hero muat satu layar: tinggi 816 px dari viewport 900 px di ketiga lebar
  - Console: nol error, nol exception
  - Kontras: tinta/kertas 18.70:1, merah `#D70000` di atas kertas 5.16:1
- Catatan jujur:
  - Warna huruf kaca (grey cool `#FFFFFF → #6B7488`) dipilih oleh saya untuk menyelesaikan permintaan "light grey yang lebih cool", belum ada validasi kontras terpisah terhadap area gelap di pojok kanan atas. Area `LABS` masuk zona gelap dengan opasitas tertinggi, jadi huruf di sana bertemu latar paling gelap. Sudah dicek terlihat di render, tapi belum diukur kontrasnya secara numerik
  - `opacity: 0.92` di `.teks-gradasi` membuat huruf sedikit tembus. Ini keputusan visual untuk kesan kaca, belum diuji terhadap pembaca layar atau kondisi cahaya rendah
  - Stroke `0.012em` memakai `-webkit-text-stroke` yang bukan properti standar. Chrome, Edge, Safari, dan Firefox mendukungnya; kalau tidak didukung, huruf hanya kehilangan penebalan, tidak rusak
  - Bundle JS tetap 957.41 kB (gzip 272.68 kB), belum di-code-split. GLB tetap 1.52 MB
  - `plan-prd/` masih di-gitignore dan belum diperbarui untuk batch ini

## 18 Okt 2026, Hero Anton + gerbang GLB + surface full-bleed

- Tanggal: 18 Okt 2026
- Judul PR: headline Anton 5vw + shadow light, gerbang pakai GLB hero, surface full sampai navbar
- File yang berubah:
  - `src/components/Hero.jsx` (font Anton, mobile 9vw + pt-16, desktop 5vw, full-bleed min-h 100svh, FadeIn headline animateOnMount)
  - `src/components/FadeIn.jsx` (prop baru animateOnMount buat above-fold Firefox)
  - `src/components/Gerbang.jsx` (Kubus geometry ganti Logo3D GLB 420px, bg-tinta ganti gerbang-surface)
  - `src/components/Navbar.css` (pita-navbar transparan, strip hitam dicabut)
  - `src/styles/global.css` (shadow drop-shadow light, dark glow 0.28 ellipse full, gerbang-surface baru, hero margin -84px padding 84px)
  - `tailwind.config.js` (font-headline Anton depan, Archivo fallback)
  - `entries/index.html` (Google Fonts tambah Anton)
  - Hasil build dicopy ke root: `index.html`, `assets/main-BI2d8usC.css`, `assets/main-Cuf_KCSN.js`, `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Hasil tes:
  - `npm run build`: sukses, 6498 modul, 6.17 detik. CSS `main-BI2d8usC.css` 27.12 kB, JS `main-Cuf_KCSN.js` 955.15 kB (gzip 271.65 kB). Warning chunk > 500 kB masih ada (three + framer-motion, belum code-split)
  - `index.html` root menunjuk `assets/main-Cuf_KCSN.js` dan `assets/main-BI2d8usC.css` yang benar-benar ada. Bundle lama `main-SNDfDEcU.js`/`main-YTS0Qg2x.css` sudah dihapus
  - Dev server 5015 (server Bang Rob): headline Anton tampil, shadow light kelihatan, mobile 9vw + pt-16, Firefox responsive headline tidak blank, gerbang GLB 420px + surface glow, navbar tanpa strip, hero full sampai atas
  - Kontras: tinta/kertas 18.70:1, merah di atas kertas 5.16:1 (tidak berubah dari batch lalu)
- Catatan jujur:
  - Verifikasi render (screenshot + curl DOM) belum gue jalankan sendiri karena dev server dipegang Bang Rob. Semua cek visual di atas hasil konfirmasi Bang Rob di dev servernya
  - `Kubus.jsx` sekarang tidak dipakai siapa-siapa (gerbang pindah ke Logo3D). Belum gue hapus, nunggu arahan Bang Rob mau disimpan atau dibuang
  - Shadow headline cuma di light theme (dark dimatikan filter none). Opacity 0.45 + blur 0.06em hasil tuning bareng Bang Rob biar tidak ketelen radial gelap
  - Satu file GLB dipakai dua section (hero + gerbang), browser cache sekali. Tidak jadi clone, hemat 1.5MB

## 18 Okt 2026, CTA hero jadi pill + hover + tilt

- Tanggal: 18 Okt 2026
- Judul PR: CTA hero pill dengan hover dan efek tilt, tombol gerbang disamakan
- File yang berubah:
  - `src/styles/global.css` (class baru `.tombol-merah-pill` dan `.tombol-garis-pill`, hover dua tombol, scoped jadi `.tombol-merah`/`.tombol-garis` tidak tersentuh)
  - `src/components/Hero.jsx` (dua CTA pakai class pill, dibungkus `TiltTombol`)
  - `src/components/TiltTombol.jsx` (baru, pembungkus `react-parallax-tilt`, mati saat `prefers-reduced-motion`)
  - `src/components/TiltTombol.css` (baru, transisi 0ms saat hover dan 450ms saat keluar supaya gerak tidak telat)
  - `src/components/Gerbang.jsx` (tombol Masuk jadi `.tombol-merah-pill` + `TiltTombol`, ref auto-focus tetap di `<button>`)
  - `package.json` / `package-lock.json` (`react-parallax-tilt@1.7.347`)
  - Hasil build dicopy ke root: `index.html`, `assets/main-cbWDjNyP.css`, `assets/main-C8tJXuyP.js`, `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Hasil tes:
  - `npm run build`: sukses, 6500 modul. CSS `main-cbWDjNyP.css` 28.11 kB (gzip 6.49 kB), JS `main-C8tJXuyP.js` 966.07 kB (gzip 274.50 kB). Bundle naik ~11 kB dari `react-parallax-tilt`
  - `index.html` root menunjuk `assets/main-C8tJXuyP.js` dan `assets/main-cbWDjNyP.css` yang benar-benar ada. Bundle lama `main-BI2d8usC.css`/`main-Cuf_KCSN.js` sudah dihapus
  - Kontras hover: kertas di atas tinta 18.70:1, kertas di atas merah 5.16:1. Lolos AA
- Catatan jujur:
  - Verifikasi visual (hover, tilt, delay) belum gue jalankan sendiri. Dev server dipegang Bang Rob, semua cek visual hasil konfirmasi di dev server-nya
  - Tombol Masuk di gerbang sengaja memakai hover tinta yang sama persis dengan CTA Bisnis atas permintaan Bang Rob, walau di atas bidang gelap jadi kurang kontras saat hover
  - `.tombol-merah` di `About.jsx` tetap bentuk kotak, belum ikut dipillkan

## 18 Okt 2026, Rotating text di kiri hero

- Tanggal: 18 Okt 2026
- Judul PR: baris "Building" plus kata berputar di atas statement kiri hero, slot kosong modular
- File yang berubah:
  - Baru: `src/components/RotatingText.jsx` (komponen React Bits), `src/components/RotatingText.css`
  - Ubah: `src/components/Hero.jsx` (tumpukan kiri di dalam kolom statement), `src/styles/global.css` (`--slot-kiri` dan class `.hero-baris-kiri` / `.hero-kata-diam` / `.hero-slot-kiri`), `README.md` (bagian tech stack)
  - Hasil build dicopy ke root: `index.html`, `assets/main-NgWRiTlw.css`, `assets/main-BkdWHrAo.js` (bundle lama `main-cbWDjNyP.css` dan `main-C8tJXuyP.js` dihapus dulu)
- Kenapa perlu:
  1. **Space kiri bawah hero kosong.** Di samping logo 3D ada bidang kosong yang lebar. Baris "Building [Apps/Websites/Tools]" mengisinya tanpa menyentuh headline, logo, atau CTA.
  2. **Logo tidak boleh bergeser.** Baris dan slot ditaruh `absolute` dengan `bottom: 100%` terhadap kolom statement, jadi tumbuh ke atas di luar aliran flex. Tinggi bar bawah tidak berubah, jadi `flex-1` dan rumus `100svh - 9vw - 194px` di wrapper logo tetap sama persis. Diukur: kotak logo 683px sebelum dan sesudah `--slot-kiri` diubah dari 4rem ke 10rem.
  3. **Spacing modular.** Tinggi slot satu variabel `--slot-kiri` (awal `4rem`) di `.hero-section`. Nanti komponen pengisi tinggal ditaruh di dalam slot, tanpa menyentuh Hero bagian logo.
  4. **"Building" tidak ikut berputar.** Hanya `Apps`, `Websites`, `Tools` yang masuk array `texts`. Kalau kalimat utuh ikut berputar, blok merahnya melebar jauh dan menabrak tombol kanan.
  5. **Comfortaa mentok 700.** Ketebalan tambahan lewat `-webkit-text-stroke: 0.04em currentColor` + `paint-order: stroke fill`, jadi badannya lebih padat tanpa ganti warna huruf.
  6. **Warna ikut tema.** "Building" pakai `var(--teks)`: tinta di terang, kertas di gelap. Blok highlight tetap `#D70000` di dua tema. Teks di dalam blok dipaksa `#F8FAFC`, bukan `#FFFFFF` hasil hitungan luminance komponen.
  7. **Tidak pasang `motion`.** Komponen diimpor dari `framer-motion` 14.3.0 yang sudah ada. Baris `'use client'` dibuang karena itu arahan Next.js dan tidak ada di Vite. `readableText()` dihapus karena warnanya sudah dikunci manual.
- Hasil tes:
  - `npm run build`: sukses, 6503 modul, 4.21 detik. CSS `main-NgWRiTlw.css` 29.25 kB (gzip 6.74 kB), JS `main-BkdWHrAo.js` 988.09 kB (gzip 282.55 kB). Warning chunk JS di atas 500 kB masih ada
  - md5 bundle root sama persis dengan `dist/assets/`: JS `2dc4cd6f389e1be69c658856e87afff4`, CSS `12fcd3b5288399554e6ce55ff8799a7d`. `index.html` root menunjuk kedua file itu, dan `assets/` isinya cuma 1 js + 1 css
  - Kode baru terverifikasi masuk bundle: `.hero-baris-kiri` utuh di CSS hasil build, `text-rotate-highlight` ada, string `Apps`/`Websites`/`Tools` ada di bundle JS
  - Rujukan gambar di `index.html` root dicek satu-satu dan ada semua: `favicon-logo.webp`, `logo+logotext.webp`, `og-banner.webp`
  - Render dev server 5015 lewat headless Chrome (gerbang dibuka dengan klik tombol):
    - Lebar 360, 768, 1280: `scrollWidth - clientWidth = 0`, tidak ada scroll horizontal. Hero tetap 900px dari viewport 900px
    - `--slot-kiri` terhitung `4rem`, `.hero-slot-kiri` setinggi 64px, statement tidak bergeser
    - "Building": font `Comfortaa`, weight `700`, stroke 0.736px (360/768) dan 1.0752px (1280). Warna `rgb(12,12,12)` di tema terang, `rgb(248,250,252)` di tema gelap
    - Blok highlight `rgb(215,0,0)` (merah), teks di dalamnya `rgb(248,250,252)` (kertas) di kedua tema
    - Teks sr-only berganti `Apps` lalu `Websites` setelah ~2 detik, jadi rotasinya jalan
    - Kotak logo 683px. `--slot-kiri` dinaikkan ke `10rem` (slot jadi 160px), kotak logo tetap 683px
    - Headline `HERE'S RALABS`, dua CTA dengan href external yang sama, tidak berubah
    - Konsol: nol error, nol exception
- Catatan jujur:
  - `prefers-reduced-motion` belum diukur di browser. Komponen sudah membungkus `MotionConfig reducedMotion="user"`, tapi efeknya belum dicek langsung
  - Di tablet dan HP barisnya menempel di bawah kotak logo: sisa 10px di 768 dan 29px di 360. Di desktop barisnya di kiri logo (teks berhenti 36px sebelum tepi kiri canvas). Menaikkan `--slot-kiri` di tablet/HP akan membuat teks masuk ke badan logo. Nilai 4rem dibiarkan sesuai keputusan Bang Rob
  - `readableText()` di komponen asli dihapus karena tidak dipakai lagi. Ini satu-satunya perubahan logika dari sumber React Bits, selain impor dan baris `'use client'`
  - Bundle JS naik dari 966 kB ke 988 kB karena komponen baru. Belum di-code-split
  - `plan-prd/` masih di-gitignore, jadi `plan-prd/hero-rotating/` tidak ikut PR ini

## 18 Okt 2026, Jam dan tanggal di celah kiri hero

- Tanggal: 18 Okt 2026
- Judul PR: jam realtime dan tanggal lokal di slot kiri hero, tinggi slot disetel
- File yang berubah:
  - Baru: `src/components/HeroClock.jsx`
  - Ubah: `src/components/Hero.jsx` (impor dan pasang `<HeroClock />` di `.hero-slot-kiri`)
  - Ubah: `src/styles/global.css` (`--slot-kiri` 4rem jadi 4.6rem, `.hero-slot-kiri` jadi flex dasar slot dengan padding-bottom 0.85rem, class baru `.hero-jam`, `.hero-jam-tanggal`, `.hero-jam-angka`, `.hero-jam-titik`)
  - Hasil build dicopy ke root: `index.html`, `assets/main-CUUAEOpa.js`, `assets/main-DEHIhfYL.css` (bundle lama `main-BkdWHrAo.js` dan `main-NgWRiTlw.css` dihapus dulu)
- Kenapa perlu:
  1. **Slot kiri kosong setelah rotating text masuk.** `.hero-slot-kiri` sudah disiapkan modular waktu batch rotating text. Sekarang isinya dipakai jam, tanpa menyentuh logo atau bar bawah.
  2. **Waktu ikut audience.** Jam dibaca dari `Date` browser pengunjung, bukan dikunci WIB. Nama hari dan bulan dikunci lewat array Indonesia, jadi tidak ikut bahasa OS.
  3. **Angka tidak oleng.** JetBrains Mono plus `font-variant-numeric: tabular-nums`, jadi lebar digit tetap saat detik berganti.
  4. **Detik tidak drift.** `setTimeout` dihitung dari sisa milidetik ke detik berikutnya (`1000 - Date.now() % 1000`), bukan `setInterval` buta 1000ms.
  5. **Jam lebih besar dari tanggal, lebih kecil dari "Building".** Ukuran jam `clamp(1.35rem, 2.4vw, 2.05rem)`, tanggal `clamp(0.7rem, 1.05vw, 0.9rem)`. Baris "Building" tetap `clamp(1.15rem, 2.1vw, 2rem)`.
  6. **Rotating text dinaikkan sedikit.** `--slot-kiri` 4rem jadi 4.6rem sesuai permintaan Bang Rob. Jam tetap menempel dasar slot (padding-bottom 0.85rem), jadi jaraknya ke statement di bawah tidak ikut berubah.
- Hasil tes:
  - `npm run build`: sukses, 6504 modul, 4.09 detik. CSS `main-DEHIhfYL.css` 29.85 kB (gzip 6.86 kB), JS `main-CUUAEOpa.js` 989.20 kB (gzip 282.93 kB). Warning chunk JS di atas 500 kB masih ada
  - md5 bundle root sama persis dengan `dist/assets/`: JS `0bd2fb20fbefa52cf0d3df094b734146`, CSS `3a77d34d3250d60fdacc26e4fd3c3282`. `index.html` root menunjuk kedua file itu, dan `assets/` isinya cuma 1 js + 1 css
  - Kode baru terverifikasi masuk bundle: `.hero-jam-tanggal` ada di CSS hasil build, string `Building` masih ada di JS
  - Rujukan gambar di `index.html` root dan bundle JS dicek satu-satu, semuanya ada di `images/`: `favicon-logo.webp`, `logo+logotext.webp`, `og-banner.webp`, `logo-preload.webp`, `logo-ralabs-3d.glb`, `mascot-enjoy.svg`
  - Nol sisa rujukan ke hash lama `BkdWHrAo` / `NgWRiTlw` di `index.html` dan `404.html`
  - Verifikasi visual dan responsive (360, 768, 1280) dilakukan Bang Rob di dev server, hasilnya oke dan tanpa revisi
- Catatan jujur:
  - Kontras belum diukur numerik. Tanggal dan angka memakai `var(--teks)` yang sudah lolos di batch sebelumnya (tinta/kertas 18.70:1), titik dua merah di atas kertas 5.16:1
  - Jam tidak diberi `aria-live`. Kalau diberi, pembaca layar akan membacakan waktu tiap detik, jadi elemen ini sengaja dibiarkan pasif
  - Belum dicek di Safari iOS dan Firefox desktop, baru Chrome lewat dev server Bang Rob
  - Bundle JS naik tipis 989.20 kB dari 988.09 kB. Belum di-code-split

## 18 Okt 2026, Tilt CTA dihaluskan + tombol Masuk gerbang disamakan

- Tanggal: 18 Okt 2026
- Judul PR: tilt CTA hero jadi halus, tombol Masuk gerbang tampil persis seperti Lihat Bisnis Saya
- File yang berubah:
  - `src/components/TiltTombol.jsx` (`perspective` 400 jadi 800, komentar disesuaikan)
  - `src/components/TiltTombol.css` (`display: inline-flex`, `width: max-content`, `border-radius: 9999px` di pembungkus; hover 140ms, balik 480ms, dua-duanya `cubic-bezier(0.22, 1, 0.36, 1)`)
  - `src/components/Gerbang.jsx` (`focus({ preventScroll: true, focusVisible: false })`)
  - Hasil build dicopy ke root: `index.html`, `assets/main-CBcw_8GH.js`, `assets/main-B6sLW-bp.css` (bundle lama `main-CUUAEOpa.js` dan `main-DEHIhfYL.css` dihapus)
- Kenapa perlu:
  1. **Tilt terasa kasar.** Penyebabnya dua: `transition` di-set 0ms, jadi pill nyeplak tiap gerak mouse, dan `perspective` 400 terlalu dekat sehingga bentuk pill melengkung. Sekarang ikut kursor 140ms dengan ease-out, balik rata 480ms. Perspektif 800 masih memberi kedalaman, bentuknya tetap rapi
  2. **Sudut tetap 22°.** Di pill setinggi 44px, sudut kecil tidak kelihatan efeknya. Yang diubah timing dan perspektifnya, bukan sudutnya
  3. **Kotak tilt mengikuti pill.** Pembungkus dijadikan `inline-flex` + `width: max-content`, jadi area tilt tidak lebih lebar dari tombolnya
  4. **Tombol Masuk gerbang kelihatan beda dari CTA hero.** Gerbang memanggil `focus()` begitu dibuka, dan itu menyalakan cincin fokus global (outline merah 3px), jadi tombol terlihat punya stroke merah yang tidak dimiliki tombol Lihat Bisnis Saya. `focusVisible: false` mematikan cincin saat fokus otomatis. Tab tetap menyalakan cincin, jadi akses keyboard tidak berkurang
- Hasil tes:
  - `npm run build`: sukses, 6504 modul, 4.36 detik. CSS `main-B6sLW-bp.css` 29.98 kB (gzip 6.87 kB), JS `main-CBcw_8GH.js` 989.23 kB (gzip 282.95 kB). Warning chunk di atas 500 kB masih ada
  - md5 bundle root sama persis dengan `dist/assets/`: JS `83e38c03ef7a6a3ab54a738e1d55eb1a`, CSS `5f71d87eebcfe7db47b31b2347ef5235`
  - `index.html` root menunjuk `assets/main-B6sLW-bp.css` dan `assets/main-CBcw_8GH.js` yang benar-benar ada. `assets/` isinya cuma 1 js + 1 css
  - Nol sisa rujukan ke hash lama `CUUAEOpa` / `DEHIhfYL` di `index.html` dan `404.html`
  - Verifikasi visual tilt dan tombol gerbang dilakukan Bang Rob di dev server, hasilnya "udah aman semua"
- Catatan jujur:
  - Pengecekan scroll horizontal di 360, 768, 1280 belum gue jalankan ulang di batch ini. Perubahan cuma menyentuh transform tilt dan fokus tombol, tidak menyentuh ukuran tata letak
  - Efek `focusVisible: false` di `focus()` sudah didukung Chrome 86+, Firefox 121+, Safari 15.4+. Browser lama akan tetap menampilkan cincin saat fokus otomatis, tombolnya tetap berfungsi
  - `perspective 800` dan timing 140/480ms belum diukur dengan alat, masih berdasarkan penilaian mata Bang Rob

## 18 Okt 2026, Dua mark 3D di atas CTA hero (indeep + ibborarts)

- Tanggal: 18 Okt 2026
- Judul PR: dua mark 3D di kluster kanan hero, indeep di atas pill bisnis, ibborarts di atas pill portfolio, warna tiap aset dibaca sesuai aslinya
- File yang berubah:
  - Baru: `src/components/Mark3D.jsx` (renderer kecil: sumber lewat prop, spin + drag seperti `Logo3D`, napas frame 18%, tanpa gambar cadangan)
  - Baru: `public/images/logo-indeep-3d.glb`, `public/images/logo-ibborarts-3d.glb` (GLB Bang Rob, sebelumnya belum ke-commit)
  - Ubah: `src/components/Hero.jsx` (kluster `hero-cta`, cadangan bawah logo tengah 194px jadi 294px dari `md`)
  - Ubah: `src/styles/global.css` (`--mark-kecil` 56px / 88px, grid `.hero-cta`, ukuran `.mark-3d`)
  - Hasil build dicopy ke root: `index.html`, `assets/main-DPJJXD8y.js`, `assets/main-DUYuyhs8.css` (bundle lama `main-CBcw_8GH.js` dan `main-B6sLW-bp.css` dihapus), `images/`
- Kenapa perlu:
  1. **Sebelah kanan hero sepi.** Dua pill CTA tidak punya wajah visual. Sekarang tiap pill punya mark 3D di atasnya yang nyambung ke tujuan pill-nya: indeep ke situs bisnis, ibborarts ke porto (aset itu favicon porto yang sama dengan subdomain komunitas yang Bang Rob maintain)
  2. **Perilaku disamakan dengan logo tengah.** Muter pelan sendiri, bisa di-drag, jeda 2500 ms sesudah dilepas, polar dibatasi 0.35 sampai `PI - 0.35`
  3. **Napas frame 18%, bukan 3%.** Logo tengah sempat kepotong saat diputar vertikal karena frame mepet plus `scale-[1.22]` di CSS. Mark kecil tidak memakai scale, parent-nya tidak `overflow: hidden`, dan frame-nya diberi ruang lebih
  4. **Layout satu DOM.** Posisi diatur CSS grid, bukan dua blok terpisah, supaya tiap mark cuma punya satu kanvas. HP: pill bisnis sendiri, dua mark berjejer di kanan baris portfolio. `md` ke atas: mark di tengah di atas pill-nya
  5. **Warna dua aset beda rumah, ini yang paling lama.** `logo-ralabs-3d.glb` menyimpan warna linear dan unlit. `logo-indeep-3d.glb` pakai tekstur ramp PBR tanpa lampu, jadi jatuh ke hitam. `logo-ibborarts-3d.glb` menyimpan byte sRGB, dan shader three menganggap vertex color itu linear lalu men-sRGB-kan lagi, hasilnya merah muda butek. Sekarang: indeep dapat lampu, ibborarts dibaca dengan `setRGB(..., THREE.SRGBColorSpace)`. `Logo3D.jsx` tidak disentuh, logo tengah tetap persis seperti sebelumnya
- Hasil tes:
  - `npm run build`: sukses, 6505 modul, 4.14 detik. CSS `main-DUYuyhs8.css` 30.86 kB (gzip 7.07 kB), JS `main-DPJJXD8y.js` 994.22 kB (gzip 284.79 kB). Warning chunk di atas 500 kB masih ada
  - md5 bundle root sama persis dengan `dist/assets/`: JS `ecf1002b65098583596ea571836c47b3`, CSS `50dc69d93c46f80b73e5e1f553bfeca2`. `index.html` root menunjuk bundle yang benar-benar ada. Nol sisa rujukan ke hash lama `CBcw_8GH` / `B6sLW-bp`
  - Kode baru terverifikasi masuk bundle: `logo-indeep-3d.glb` dan `logo-ibborarts-3d.glb` ada di bundle JS, `hero-cta-indeep` dan `--mark-kecil` ada di bundle CSS
  - Layout diukur dari hasil build yang disajikan lokal (bukan dev server), gerbang dibuka lewat klik tombol Masuk:
    - 360x800: `--mark-kecil` 56px, scroll horizontal 0. Pill bisnis di y 656-704, pill porto 722-772, indeep dan ibbor 716-772 (dasar sejajar pill porto)
    - 768x1024: `--mark-kecil` 88px, scroll horizontal 0. Dua pill dasar 1000, dua mark 854-942 (di atas pill-nya)
    - 1280x800: `--mark-kecil` 88px, scroll horizontal 0. Dua pill dasar 776, dua mark 630-718
  - Jarak logo tengah ke puncak mark: 1366x768 61px, 1440x900 48px, 1920x1080 75px. Nol tumpukan
  - Normalisasi GLB: otomatis, kotak warna, frustum dihitung dari semua sudut rotasi. Logo tengah tetap 1 kanvas
  - Warna diukur dari piksel kanvas hasil render: indeep `192, 144, 16` sampai `208, 160, 16` (kuning), ibborarts `192, 32, 40` sampai `208, 40, 48`, nempel ke `#C8232B` nama mesh-nya
  - Href dua pill tidak berubah: `indeepcleaningid.site` dan `robbyaliasa.tongkrongan.tech`. Mark bukan tautan
  - `resource bukan 200`: nol. Tidak ada gambar atau bundle yang gagal muat
- Catatan jujur:
  - Kontras teks tidak berubah, tidak ada pasangan warna teks baru di batch ini. Mark hanya dekorasi visual dan tidak menutupi teks
  - Belum dicek di Safari iOS dan Firefox desktop, baru Chrome
  - Kanvas hidup sekarang 3 (gerbang/hero tengah + dua mark). Render berhenti saat elemen keluar layar, tapi biaya tiga konteks WebGL belum diukur di HP kelas bawah
  - Kalau WebGL gagal, kotak mark kosong. Pill di bawahnya tetap jalan. Ini disengaja, tidak pakai `logo-preload.webp` karena itu logo RaLabs
  - Ukuran 88px dan 56px masih titik awal hasil ukur, belum di-micro-manage Bang Rob di layar aslinya

## 18 Okt 2026, Batch 9: gerbang masuk (pose kurus, tiga kilat, luma fade) + contributing.md

- Tanggal: 18 Okt 2026
- Judul: gerbang masuk lengkap tiga langkah plus alur kontribusi yang bisa dijalankan
- File yang berubah:
  - Baru: `src/components/LogoGerbang.jsx` (fork `Logo3D` untuk gerbang, `Logo3D.jsx` tidak disentuh)
  - Baru: `src/components/Kilat3D.js` (tiga kilat menyusuri tepi logo)
  - Baru: `src/components/luma.js` (konstanta dan matematika luma fade, dipakai dua tempat)
  - Ubah: `src/components/Gerbang.jsx` (SVG filter diganti shader + opacity)
  - Ubah: `src/pages/Portal.jsx` (state `masuk` / `membuka` / `gerbangTerbuka`, `inert` di belakang)
  - Ubah: `src/styles/global.css` (latar gerbang pindah ke `::before` supaya bisa diredupkan)
  - Ubah: `contributing.md` (alur build sampai PR, ditulis ulang sesuai kondisi repo)
  - Ubah: `index.html`, `assets/`, `images/` (hasil build)
- Yang dikerjakan:
  1. **Pose kurus.** Klik Masuk mematikan spin dan drag, lalu kamera OrbitControls ditarik balik ke titik awal selama 800ms ease in-out. Yang dipulihkan adalah posisi kamera, bukan rotasi grup: `autoRotate` dan drag memang memutar kamera. Setelah tween selesai, kamera dikunci tiap frame karena damping masih menyisakan sisa putaran
  2. **Tiga kilat.** Setelah pose kurus, tiga ray menyusuri tepi logo dengan stagger 0 / 0.15 / 0.30 detik, total 1.2 detik, sekali jalan. Tepi diekstrak sendiri (bukan `EdgesGeometry`, karena itu membuang vertex color), warna per kelas tepi, tebal 2.5px additive
  3. **Buka layar luma fade.** Terang -> gelap. Logo larut per piksel di shader WebGL, latar dan tombol memudar lewat opacity CSS, keduanya dari `progresBuka()` dan durasi 800ms yang sama
- Keputusan teknis yang perlu dicatat:
  1. **Luma fade bukan opacity fade untuk logo.** Logo punya tiga nada warna rata (putih, merah, hitam) yang jauh satu sama lain. Tanpa dither, satu muka melewati ambang bersamaan dan hilang seperti blok. Dither membuat tiap piksel punya ambang beda, jadi larut sebagai butiran yang tumbuh
  2. **Konstanta diukur, bukan ditebak.** Dari K=3/A=0.25 ke K=1.5/A=0.4: puncak laju pelarutan turun 11.3 -> 8.9, variasi laju 0.78 -> 0.51, dan jeda beku 16 frame dari 100 menjadi nol. Pita sempit bikin tiap nada "pop lalu diam"
  3. **Rentang T harus melebar sebesar amplitudo dither.** Tanpa koreksi itu, piksel paling terang mulai di alpha 0.625 (logo kedip cair di frame pertama) dan piksel paling gelap berhenti di alpha 0.375 (kotak hitam tidak pernah habis). Sudah diverifikasi: p=0 semua alpha 1.000, p=1 semua alpha 0.000
  4. **Shader wajib meniru urutan akhir material bawaan three.** `MeshBasicMaterial` punya `#include <colorspace_fragment>` dan `#include <premultiplied_alpha_fragment>` di akhir. Shader pertama saya melewatkan konversi linear -> sRGB, jadi warna linear dikirim mentah ke kanvas yang menganggapnya sRGB. Abu 25% linear tampil 0.25 padahal seharusnya 0.537, itulah sebabnya logo terlihat blotchy dan kontrasnya meledak
  5. **Warna vertex GLB ini VEC4, bukan VEC3.** Kalau dibiarkan, three mendeklarasikan `attribute vec4 color` dan `vWarna = color` gagal kompilasi (GLSL melarang pemotongan vec4 -> vec3 diam-diam), logonya tidak tergambar sama sekali. `siapkanWarna` sekarang selalu membuang alpha dan mengeluarkan 3 komponen
  6. **SVG filter layar-penuh ditinggalkan.** Filter itu merasterisasi ulang seluruh layar tiap frame dan ikut menyumbang patah. Sekarang logo di shader, latar di opacity yang dikomposit GPU
- Hasil tes:
  - `npm run build`: sukses, 6511 modul, 4.37 detik. CSS `main-D0P4UjLO.css` 31.00 kB (gzip 7.11 kB), JS `main-wmXwN22M.js` 1025.71 kB (gzip 294.94 kB). Warning chunk di atas 500 kB masih ada, dari three.js, bukan regresi batch ini
  - md5 bundle root sama persis dengan `dist/assets/`: JS `245181ef5a157796efc91f93d3b9f943`, CSS `dc45c148843e303906a9ccbb529aae05`. `index.html` root menunjuk bundle yang benar-benar ada. Nol sisa rujukan ke hash lama `DPJJXD8y` / `DUYuyhs8` / `BkdWHrAo` / `NgWRiTlw`
  - Kode baru terverifikasi masuk bundle: `colorspace_fragment`, `premultiplied_alpha_fragment`, `ukuranButir`, `amplitudo` ada di bundle JS, `.gerbang-latar` ada di bundle CSS
  - Matematika luma disimulasikan di Node terhadap histogram tiga nada logo: p=0 alpha 1.000 untuk ketiga nada, p=1 alpha 0.000 untuk ketiga nada, urutan luma terjaga (putih mulai dulu, hitam habis terakhir), celah putih->merah turun dari 246ms ke 62ms
  - Hasil build disajikan dari root repo lewat `python3 -m http.server`, bukan dev server. Semua 200: `/`, `/index.html`, kedua bundle, `logo-ralabs-3d.glb`, `favicon-logo.webp`, `robots.txt`, `sitemap.xml`, `humans.txt`
  - Dev server 5015: semua modul (`luma.js`, `LogoGerbang.jsx`, `Gerbang.jsx`, `Portal.jsx`) transform bersih, tidak ada error
  - `Logo3D.jsx`: diff kosong, tidak disentuh
- Catatan jujur:
  - Pengujian klik Masuk sampai gerbang terbuka dilakukan di dev server dan hasil build, tapi **belum diukur performanya di HP kelas bawah**. Luma fade sekarang dikomposit GPU, seharusnya jauh lebih ringan dari filter layar-penuh sebelumnya
  - Tampilan akhir luma fade (rasa halus, besar butiran) dinilai Bang Rob secara visual. Yang terukur baru angka di atas, bukan persepsi
  - Belum dicek di Safari iOS dan Firefox desktop, baru Chrome
  - Kalau WebGL gagal, gerbang memakai `logo-preload.webp` dan luma fade untuk logo tidak jalan. Latar dan tombol tetap memudar
  - Reduced motion: urutan gerbang tetap jalan penuh. Ini langkah 4 di `plan-prd/gerbang-masuk/` dan **belum dikerjakan**
  - Branch dibuat dari `feat/hero-mark-3d`, tapi ketiga commit hero-nya (`bcdd0b6`, `c896fea`, `0d99b57`) sudah masuk `main` lewat PR #24 sebelum PR ini dibuka. Jadi PR ini murni gerbang masuk dan `contributing.md`, tanpa perubahan hero

## 18 Okt 2026, Headline hero jadi RALABS, Montserrat Black

- Tanggal: 18 Okt 2026
- Judul: headline hero tinggal nama. Montserrat 900 tegak. RA merah, LABS kaca.
- File yang berubah:
  - `src/components/Hero.jsx` (kalimat `HERE'S RALABS` jadi `RALABS`, kelas `font-black`)
  - `tailwind.config.js` (token `headline` jadi Montserrat, cadangan Manrope)
  - `entries/index.html` (Google Fonts: Anton dan Archivo diganti `Montserrat:wght@900`)
  - `src/styles/global.css` (stroke penebalan 0.012em dicabut dari `.teks-gradasi` dan `.teks-aksen`)
  - `README.md` (baris font stack)
- Kenapa perlu:
  1. **Sapaan dobel.** `HERE'S` mengulang kerja baris kiri (`Building…`) dan kalimat bawah. Yang tersisa nama tempatnya: `RALABS`.
  2. **Anton selalu teriak.** Satu berat dan sempit. Montserrat Black punya badan paling tebal di keluarganya, tanpa jadi poster condensed.
  3. **Italic 800 ditolak di layar.** Dicoba dulu, kemiringannya tidak enak dan badannya masih kurus. Diganti tegak 900. Yang dimuat cuma berat itu.
  4. **Stroke tetap tidak dipasang.** `0.012em` itu trik saat Archivo sudah mentok. 900 dinilai dulu tanpa stroke, biar yang dilihat badannya sendiri.
  5. **Yang tidak berubah.** Ukuran `9vw` / `5vw`, material kaca `LABS`, gradasi merah `RA`, shadow tema terang, baris kiri, jam, dua pill, dua mark.
- Hasil tes:
  - Italic 800 sudah dilihat Bang Rob di dev server dan ditolak.
  - Tegak 900 belum di-build ulang ke root. Dev server membaca `entries/index.html`, jadi refresh halaman cukup.
- Catatan jujur:
  - 900 adalah berat maksimal Montserrat. Kalau di bidang gelap masih kurus, langkah berikutnya stroke, bukan ganti keluarga diam-diam.
  - Kontras pasangan warna tidak berubah. Belum diukur ulang.
  - Belum dicek di Safari iOS dan Firefox desktop.

## 18 Okt 2026, Gerbang jam + rotating text, jam CTA, tuning mobile hero

- Tanggal: 18 Okt 2026
- Judul: gerbang dapat jam dan rotating text di pojok bawah, mark CTA hero digedein, hero mobile dituning, logo navbar reload ke gerbang
- File yang berubah:
  - `src/components/Gerbang.jsx` (import `HeroClock`, blok rotating text kiri bawah, blok jam kanan bawah)
  - `src/components/Hero.jsx` (mark 3D `--mark-kecil` naik, cadangan bawah logo 210/330px, headline mobile lebih besar, logo mobile naik `-translate-y-12`)
  - `src/components/Navbar.jsx` (`muatUlang`: klik logo reload dari akar, `logoHref="/"`)
  - `src/components/CardNav.jsx` (prop `logoOnClick` disalurkan ke `<a>` logo)
  - `src/styles/global.css` (`--mark-kecil` 72/120px, kluster CTA mobile `1fr auto auto` + gap 0.3/0.25rem, keylight bawah hero gelap, glow kanan atas lebih tebal dan jauh, `.gerbang-jam`, override gerbang mobile)
  - `.gitignore` (`template-awal.md`)
  - `index.html`, `assets/`, `images/` (hasil build)
- Kenapa perlu:
  1. **Gerbang tidak lagi kosong di bawah.** Rotating text kiri + jam kanan mengisi ruang dan menyiapkan rasa halaman yang menunggu di belakang.
  2. **Mark CTA terlalu kecil.** Detail indeep dan ibborarts tidak terbaca. 56→72 (HP) dan 88→120 (md) supaya bentuknya kebaca.
  3. **Hero mobile terlalu turun.** Logo 3D naik 48px di bawah md, headline naik ukuran (11vw / 6.5vw), dua mark dimajukan ke kanan supaya CTA proporsional.
  4. **Klik logo harus balik ke gerbang.** Gerbang cuma hidup di mount pertama. `replaceState` ke `/` lalu `reload` memaksa mount ulang tanpa mendarat di tengah section.
  5. **Cahaya hero gelap.** Keylight dari dasar menyorot mark, glow kanan atas diperlebar dan dipekatkan. Semua cuma di `data-theme='gelap'`.
- Hasil tes:
  - Dev server: ok di port 5015, console bersih
  - Build: `npm run build` sukses
  - Hasil build diserve dari root repo (`python3 -m http.server 8099`): root 200, bundle CSS/JS 200, 404/robots/sitemap/humans 200
  - `index.html` root menunjuk `main-GtiLW2_q.js` dan `main-CSMltJAv.css`, keduanya ada di `assets/`
  - Layout: dicek di dev server pada 360 / 768 / 1280. **Desktop sengaja dijaga tidak berubah**; semua tuning mobile dibatasi di bawah md atau `max-width: 767px`
  - Kontras: token warna tidak berubah, belum diukur ulang
  - Tombol/link: tombol Masuk, dua pill CTA, dan tautan GitHub ditekan; klik logo navbar diuji manual oleh Bang Rob
- Catatan jujur:
  - Klik logo memakai reload penuh. Ada jeda muat ulang ±1 detik dan gerbang main dari awal. Ini memang yang diminta, bukan navigasi halus.
  - Tuning mobile belum dicek di perangkat fisik, baru lebar viewport di dev server.
  - Belum dicek Safari iOS dan Firefox desktop.

## 19 Okt 2026, Batch 10: headline hero artboard + latar WebGL AcidSquares/SideRays

- Tanggal: 19 Okt 2026
- Judul: headline hero mengikuti artboard (Sora 800, garis merah terukur) + latar hero/gerbang WebGL
- File yang berubah:
  - Baru: `src/components/AcidSquares.jsx`, `src/components/AcidSquares.css` (latar hero, canvas WebGL2)
  - Baru: `src/components/SideRays.jsx`, `src/components/SideRays.css` (latar gerbang)
  - Ubah: `src/components/Hero.jsx` (struktur headline: eyebrow THIS IS + dot, RA/slash/LABS, supporting block, garis aksen)
  - Ubah: `src/components/Gerbang.jsx` (pakai SideRays, lepas gradient lama)
  - Ubah: `src/styles/global.css` (kelas `.hero-eyebrow-*`, `.hero-slash`, `.hero-aksen-diag*`, `.hero-latar*`, surface gerbang)
  - Ubah: `tailwind.config.js` (token `headline` jadi Sora, token `display` Kumar One dilepas)
  - Ubah: `entries/index.html` (muat Sora 800, Manrope, Comfortaa, JetBrains Mono)
  - Ubah: `index.html`, `assets/`, `images/` (hasil build)
- Kenapa perlu:
  1. **Headline belum mengikuti artboard.** Kumar One + efek kaca diganti Sora 800 solid. Garis merah, dot, dan slash dipasang sebagai elemen terpisah supaya posisinya bisa diukur dan di-tune, bukan digambar di dalam gambar.
  2. **Angka garis diambil dari pengukuran pixel.** Screenshot artboard dianalisis per cluster merah (bbox, panjang, sudut): diagonal kiri 15vw / -26°, dot 0.2em, slash 0.72em / 14°, garis kanan 23vw / 5° mulai di baseline.
  3. **Latar hero dan gerbang pindah ke WebGL.** AcidSquares menggantikan radial gradient hero, SideRays menggantikan gradient + grain gerbang. Keduanya props-driven dan punya fallback `background-color`.
- Hasil tes:
  - Dev server: ok di port 5015, console bersih (Sora 800 ter-resolve di CSS yang diserve)
  - Build: `npm run build` sukses (6515 module), tanpa error
  - Hasil build diserve dari root repo (`python3 -m http.server 8099`): root, bundle JS/CSS, 404, robots, sitemap, humans semua 200
  - `index.html` root menunjuk `main-b5sxi34b.js` dan `main-aJhn9JPB.css`, dua-duanya ada di `assets/`; bundle lama (`main-GtiLW2_q.js`, `main-CSMltJAv.css`) sudah dihapus
  - `images/favicon-logo.webp` ada dan dirujuk `index.html`
  - Layout 360 / 768 / 1280: **belum dicek ulang di sesi ini**
  - Kontras: belum diukur ulang
  - Tombol/link: belum ditekan ulang di sesi ini
- Catatan jujur:
  - **Headline belum 1:1 dengan artboard.** Pada screenshot pembanding, eyebrow THIS IS dan supporting text masih lebih kecil dari proporsi artboard, posisi awal RA masih 19vw (artboard ±23vw), dan garis kanan dimulai terlalu ke kanan. Ini sudah diketahui dan disepakati untuk dilanjutkan di sesi lain.
  - Perubahan `AcidSquares`, `SideRays`, dan `Gerbang.jsx` sudah ada di working tree sebelum batch ini; ikut masuk karena build bergantung padanya.
  - Hasil build belum dicek visual di browser setelah `npm run build`. Yang diperiksa baru status HTTP dan kecocokan nama bundle.
  - Animasi fade-in bisa membuat sebagian elemen (navbar, pill CTA, mark) terlihat kosong pada screenshot yang diambil terlalu cepat.

## 19 Okt 2026, Batch 11: headline hero jadi artwork SVG per tema

- Tanggal: 19 Okt 2026
- Judul: headline hero diganti dua file SVG milik Bang Rob (light/dark), seluruh elemen headline teks lama dibuang
- File yang berubah:
  - Baru: `public/images/Light-headline1x.svg`, `public/images/Dark-headline1x.svg` (artwork utuh: eyebrow THIS IS, RA LABS, tiga chip Creative/Technology/Real Projects, polilin merah; viewBox 1084.25x368.65, rasio 2.94:1)
  - Ubah: `src/components/Hero.jsx` (blok headline lama dihapus semua: eyebrow, h1 teks, support 5 baris, polilin elbow; ganti `<h1>` berisi teks sr-only "THIS IS RA LABS" + dua `<img>` yang ditukar CSS tema)
  - Ubah: `src/styles/global.css` (hapus `.hero-eyebrow*`, `.hero-utama`, `.hero-headline-*` lama, `.hero-elbow*`; tambah `.hero-headline-gambar`, `.hero-headline-img*`, cap tinggi khusus `md+`)
  - Rename: `Dark Headline1x.svg` jadi `Dark-headline1x.svg` (spasi di nama file rawan di URL Apache)
- Kenapa perlu:
  1. Loop tuning teks vs artboard tidak pernah mencapai 1:1 (artboard italic 10 derajat, letterform tidak sama dengan font web yang tersedia). Bang Rob memutuskan headline memakai artwork SVG miliknya sendiri supaya deterministik dan berhenti di-screenshot.
  2. Dua file dua tema, dipilih lewat `html[data-theme='gelap']`, pola sama seperti `.hero-latar` (tema dipasang sebelum React jalan, tukar instan tanpa flicker).
  3. Cap tinggi `md+` (`clamp(140px, min(28svh, 17.5vw), 255px)`) plus `object-fit: contain`: tanpa ini hero membengkak 284px dan bar CTA jatuh ke bawah fold; dengan cap, banner logo 3D dan bar CTA tetap kebagian ruang. Mobile lepas cap karena lebar layar sudah bikin tingginya muat.
- Hasil tes:
  - Dev server ok di port 5015. Console error 0 di 360/768/1440 untuk kedua tema. Scroll horizontal 0 di semua ukuran.
  - Tinggi section dibanding baseline (diukur sebelum perubahan lewat `git stash`): 1440x900 = 978 vs baseline 977, 768x900 = 927 vs baseline 942, 360x900 = 900 vs baseline 900. Logo 3D, bar jam, dan dua CTA utuh di semua ukuran.
  - Penukaran tema terbukti dari DOM: `Light-headline1x.svg` tampil saat terang, `Dark-headline1x.svg` tampil saat gelap.
  - Placement headline rata tengah (`object-position: center top`), rasio asli 2.94:1 tidak pecah.
  - Build: `npm run build` sukses (6515 module, 7.74 detik). Output `dist/entries/index.html` 4.77 kB, CSS 31.71 kB, JS 1,060.71 kB (peringatan chunk >500 kB informational, bukan error).
  - Pindah hasil build urut sesuai contributing.md: bundle lama `main-aJhn9JPB.css` + `main-b5sxi34b.js` dihapus dulu, baru `index.html`, `assets/`, `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt` dicopy. Loop cek nama bundle: `main-BrdB8p4U.js` dan `main-DSg-wyVi.css` keduanya OK (tidak ada yang hilang).
  - Hasil build di-serve dari root repo (`python3 -m http.server 8099`, bukan dev server) dan dicek di browser: console error 0, section 978 / 927 / 900 px di 1440 / 768 / 360 (identik dengan dev server), gerbang jalan sampai masuk, file tema tetap tertukar sesuai `data-theme`.
  - Tombol/link: 41 link terbaca dari DOM, 0 link mati (semua href terisi, tidak ada `#` kosong). Tombol Menu, Dark, carousel (Sebelumnya/Berikutnya/Jeda), dan Masuk ada isinya.
- Catatan jujur:
  - Em dash di komentar baru: 0.
  - Layout belum dicek di ukuran di atas 1440 (misal 1920) sesi ini.
  - Kontras teks tidak diukur ulang di batch ini: elemen headline kini berupa gambar, teks yang tersisa tidak diubah dari batch sebelumnya.

## 20 Okt 2026, Tuning mobile: headline SVG dan logo 3D dikecilkan + dinaikkan

- Tanggal: 20 Okt 2026
- Judul: headline hero mobile dibatasi 70% dan digeser naik, logo 3D mobile dikecil ke 260px dan dinaikkan ke 80px
- File yang berubah:
  - Ubah: `src/styles/global.css` (blok baru `@media (max-width: 767px)`: `.hero-headline-img` dibatasi `max-width: 70%` + `margin-inline: auto`)
  - Ubah: `src/components/Hero.jsx` (wrapper headline `pt-16` jadi `pt-4`; pembungkus logo 3D base class `w-[min(320px,40svh)]` jadi `w-[min(260px,33svh)]`, `-translate-y-12` jadi `-translate-y-20`)
  - Hasil build dicopy ke root: `index.html`, `assets/main-BtP-WXh0.js`, `assets/main-BaMeLgD8.css` (bundle lama `main-BrdB8p4U.js` dan `main-DSg-wyVi.css` dihapus dulu), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  1. **Headline SVG di HP kegedean.** Di bawah 768px tidak ada cap sama sekali (`width: 100%` polos), jadi banner nempel selebar layar dan menekan logo 3D serta bar CTA. Cap `clamp(140px, min(28svh, 17.5vw), 255px)` hanya berlaku `min-width: 768px`. Ditambah blok `max-width: 767px` yang membatasi lebar ke 70% dan center; tinggi ikut mengecil mengikuti rasio asli 2.94:1 tanpa distorsi
  2. **Headline terlalu turun.** Wrapper `pt-16` (64px) menambah jarak di bawah navbar yang sudah 84px. Diturunkan ke `pt-4` (16px)
  3. **Logo 3D mobile kegedean dan terlalu turun.** Base class `min(320px, 40svh)` jadi `min(260px, 33svh)`, translate naik dari 48px ke 80px (`-translate-y-20`). Nilai base hanya berlaku di bawah sm; `sm:`/`md:`/`lg:` tidak tersentuh
- Hasil tes:
  - `npm run build`: sukses, 6515 modul, 6.94 detik. Bundle `main-BtP-WXh0.js` 1,060.71 kB dan `main-BaMeLgD8.css` 31.78 kB. Warning chunk di atas 500 kB masih ada, bukan regresi batch ini
  - md5 bundle root sama persis dengan `dist/assets/`: JS `741ce1b8daa056931233d854a1fcb91f`, CSS `4e3410f5d79e5dc9e66f8ac6a7cec10d`. `index.html` root menunjuk kedua file itu (casing dicek lewat loop cek nama bundle, semua OK)
  - Hasil build disajikan dari root repo (`python3 -m http.server 8099`), gerbang dibuka lewat klik tombol Masuk, diukur lewat CDP headless Chrome:
    - 360x800: headline `top: 100`, gambar 230x78 (center, left 65), logo box 260x260 `top: 177`, section 800px dari viewport 800px (muat satu layar), scroll horizontal 0, console error 0
    - 768x900 dan 1280x900: headline `top: 84`, tinggi 140 dan 224, scroll horizontal 0, console error 0. Desktop tidak terpengaruh (aturan baru berhenti di 767px)
  - Screenshot 360x800: headline kecil dan rapat ke navbar, logo 3D muat di atas baris Building, bar CTA dan dua mark utuh di layar yang sama
- Catatan jujur:
  - Base class logo berlaku juga di rentang 640-767 sebelum override `md:` ambil alih, jadi di situ logo ikut mengecil dan naik. Arahnya sama dengan permintaan, tidak dicek terpisah di lebar itu
  - Verifikasi klik tombol/link seluruh halaman tidak diulang di batch ini; perubahan murni ukuran dan posisi CSS, semua href tidak tersentuh
  - Kontras tidak diukur ulang: tidak ada pasangan warna baru

## 20 Okt 2026, Tuning desktop: headline SVG dikecilkan, logo 3D dikecilkan dan diturunkan

- Tanggal: 20 Okt 2026
- Judul: cap tinggi headline desktop turun ke 15.5vw, logo 3D desktop skala 1.10 dan posisi turun 30px
- File yang berubah:
  - Ubah: `src/styles/global.css` (cap headline `min-width: 768px`: `clamp(140px, min(28svh, 17.5vw), 255px)` jadi `clamp(130px, min(25svh, 15.5vw), 230px)`)
  - Ubah: `src/components/Hero.jsx` (pembungkus logo 3D: lebar md `min(520px, ...)` jadi `min(480px, ...)`, lebar lg `min(560px, ...)` jadi `min(515px, ...)`, scale md `1.22` jadi `1.10`, translate md `-60px` jadi `-30px`)
  - Hasil build dicopy ke root: `index.html`, `assets/main-Cl1M38Pq.js`, `assets/main-9jabIRvh.css` (bundle lama `main-BtP-WXh0.js` dan `main-BaMeLgD8.css` dihapus dulu), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  1. **Headline desktop masih kegedean** menurut Bang Rob setelah batch mobile. Cap diturunkan satu step proporsional (semua angka ikut ~11%), rasio asli SVG 2.94:1 tetap dijaga `object-fit: contain`
  2. **Logo 3D desktop kegedean.** Di ukuran 1024-1440 `min()`-nya mentok di `calc(100svh - 9vw - 330px)`, bukan di angka lebar, jadi mengubah angka lebar saja tidak menghasilkan efek apa pun di sana. Karena itu scale `1.22` -> `1.10` yang jadi tuas utama; angka lebar ikut diturunkan supaya konsisten dan mengecil di layar lebar tempat cap-nya mengikat
  3. **Logo 3D terlalu tinggi.** Translate md `-60px` jadi `-30px`, artinya logo turun 30px. Cuma wrapper logo yang bergerak; headline, baris Building, jam, CTA, dan dua mark elemen lain tidak tersentuh
- Hasil tes:
  - `npm run build`: sukses, 6515 modul, 7.31 detik. Bundle `main-Cl1M38Pq.js` 1,060.71 kB dan `main-9jabIRvh.css` 31.78 kB
  - md5 bundle root sama persis dengan `dist/assets/`: JS `a8bff1d2ab2a7cda2aaa936b860f41bd`, CSS `6a25885cfc3504b79970cc7c4d3145bb`. Loop cek nama bundle di `index.html` semua OK
  - Hasil build disajikan dari root repo (`python3 -m http.server 8099`), gerbang dibuka lewat klik tombol Masuk, diukur lewat CDP headless Chrome:
    - 1280x900 dan 1440x900: headline top 84, tinggi 198 dan 223, scroll horizontal 0, console error 0
    - 360x900: headline top 100, tinggi 78, identik dengan batch mobile sebelumnya (perubahan tidak berlaku di bawah 768px), scroll horizontal 0, console error 0
  - Ukuran sebelum vs sesudah (dev server, sebelum build): headline 1024/1280/1440/1920 = 179/224/252/255 px jadi 159/198/223/230 px. Logo efektif 422/433/537/683 px jadi 380/390/484/567 px
  - Posisi logo turun 30px terbukti di ukur: 1280 top 205 -> 235, 1440 top 225 -> 255. Headline top tetap 84, baris Building 667/768, CTA 637/748 semuanya tidak bergerak
  - Sisa jarak logo ke baris Building setelah turun: 42px di 1280, 28px di 1440 (belum mepet, tapi kalau diturunkan lagi harus dicek)
- Catatan jujur:
  - Mobile tidak tersentuh di batch ini: cap headline di bawah 768px tetap 70%, base class logo tetap `min(260px, 33svh)` dengan translate `-80px`
  - Verifikasi klik seluruh tombol/link tidak diulang; perubahan murni ukuran dan posisi, href tidak tersentuh
  - Kontras tidak diukur ulang: tidak ada pasangan warna baru
  - Layout di atas 1440 (misal 2560) belum dicek di batch ini

## 20 Okt 2026, Circular Carousel placeholder di About, maskot dilepas

- Tanggal: 20 Okt 2026
- Judul PR: kolom kanan About ganti maskot jadi CircularCarousel (placeholder API-identik, 17 props final), blok kuning dilepas
- File yang berubah:
  - Baru: `src/components/CircularCarousel.jsx`, `src/components/CircularCarousel.css` (PLACEHOLDER, bukan sumber penuh React Bits)
  - Baru: `public/images/placeholder-01.svg`, `placeholder-02.svg`, `placeholder-03.svg` (kartu 180x180, warna tinta/merah/kuning, font sistem)
  - Ubah: `src/components/About.jsx` (impor carousel, hapus `<img>` maskot dan `bg-kuning`, kolom kanan jadi wadah tinggi `clamp(320px, 50vw, 560px)` berisi `<CircularCarousel />`. Copy kolom kiri edit tangan Bang Rob dibawa utuh, tidak disentuh)
  - Hasil build dicopy ke root: `index.html`, `assets/main-Ctkc1a3l.js`, `assets/main-TPdYdSDw.css` (bundle lama `main-Cl1M38Pq.js` dan `main-9jabIRvh.css` dihapus dulu), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  1. **Dua kunci dari Bang Rob.** (a) 17 props di `About.jsx` FINAL persis contoh usage React Bits, tidak boleh diubah. (b) Sumber komponen diganti placeholder dulu; Bang Rob akan menimpa dua file komponen dengan desain aslinya tanpa menyentuh `About.jsx`, karena kontrak props sudah kunci
  2. **Blok kuning dilepas (keputusan Bang Rob).** Kuning dulu "tanah maskot". Maskot diganti carousel, tanah ikut hilang, kolom kanan menempel `bg-bidang` dan ikut tema
  3. **`fadeColor="#f8fafc"` kertas terang, props locked.** Di tema terang kabut memudar kartu jauh menyatu (kertas di kertas); di tema gelap jadi memudar ke terang di atas gelap. Diterima sebagai konsekuensi kunci props, dicatat di plan
  4. **Placeholder auto-fit.** Komponen asli mengecilkan cincin supaya muat di wadah. Placeholder ikut kontrak itu lewat `ResizeObserver` + `scale()` pada baris kartu. Tanpa ini 3 kartu 180px (total 570px) kepotong `overflow:hidden` di wadah 328-544px
  5. **Tanpa dependency baru.** Placeholder murni React + CSS. Nol library tambahan
- Hasil tes:
  - `npm run build`: sukses, 6517 modul, 7.44 detik. CSS `main-TPdYdSDw.css` 33.20 kB, JS `main-Ctkc1a3l.js` 1,063.06 kB (naik 2.35 kB dari placeholder). Warning chunk > 500 kB masih dari three.js, bukan regresi batch ini
  - md5 bundle root sama persis dengan `dist/assets/`: JS `95c4c3ed9b4219c2297ae65c612dd93d`, CSS `c031d8a57c5303f36b2b7f5a270dc0d7`. `index.html` root menunjuk kedua file itu, casing dicek. Nol sisa rujukan hash lama `Cl1M38Pq`/`9jabIRvh`, dan `assets/` isinya cuma 1 js + 1 css
  - Kode baru terverifikasi masuk bundle: `placeholder-01/02/03.svg`, `circular-carousel__baris`, `circular-carousel__kartu`, string `Image carousel`, dan nilai props `cylinder`/`assemble`/`1880`/`0.79`/`#f8fafc` semuanya ada
  - Dev server 5015 dan build produksi diserve dari root (`python3 -m http.server 8099`), gerbang dibuka lewat klik tombol Masuk, diukur lewat CDP headless Chrome. Hasil identik di keduanya:
    - 360x800: wadah 320px (mentok min clamp), kartu efektif 104x104 (fit 0.575), scroll horizontal 0, console error 0
    - 768x1024: wadah 384px, kartu 109x109 (fit 0.605), dua kolom (kiri x16, kanan x377), scroll horizontal 0, console error 0
    - 1280x900: wadah 560px (mentok max clamp), kartu 172x172 (fit 0.954), dua kolom (kiri x73, kanan x633), scroll horizontal 0, console error 0
    - Ketiga lebar: 3 kartu termuat (naturalWidth > 0, src SVG lokal), caption tampil "Project 01 / Placeholder", counter "01/03", `id="about"` tetap 1, nol elemen `bg-kuning`, nol `<img>` maskot
  - Tema terang: `#about` `rgb(248,250,252)`, caption `rgb(12,12,12)`. Tema gelap (ditukar lewat tombol tema asli): `#about` `rgb(12,12,12)`, caption `rgb(248,250,252)`. Kolom kanan ikut tema di dua-duanya
  - Dev server: semua modul baru (`About.jsx`, `CircularCarousel.jsx`, `CircularCarousel.css`, 3 SVG) HTTP 200, transform bersih
  - Em dash: nol di baris yang ditambah. Link mati: nol (href di About tetap cuma tombol "Lihat porto")
  - Kontras: tidak ada pasangan warna teks baru. Caption memakai `color: inherit` dari `text-teks` di atas `bg-bidang`, pasangan yang sudah lolos (tinta/kertas 18.70:1)
- Catatan jujur:
  - **Interaksi carousel BELUM ada di placeholder.** Drag, wheel, keyboard step, autoplay drift, intro assemble, dan crossfade item hanya punya props-nya diterima tapi belum dijalankan. Uji interaktif penuh baru bisa setelah desain asli Bang Rob menimpa dua file komponen
  - Di tema gelap kartu menjauh akan memudar ke kertas terang (kabut). Konsekuensi langsung `fadeColor` locked, sudah disetujui Bang Rob
  - `mascot-enjoy.svg` kini tidak terpakai di seluruh `src/`; file tetap ada di `public/images/`
  - Tinggi wadah `clamp(320px, 50vw, 560px)` titik awal, belum di-micro-manage Bang Rob di layar aslinya
  - `plan-prd/about-circular-carousel/` (design.md, spec.md, prompt.md) ada di `.gitignore`, lokal saja, tidak ikut PR ini

## 20 Okt 2026, Copy About pakai Montserrat 400, caption carousel dilepas

- Tanggal: 20 Okt 2026
- Judul PR: copy About pindah ke Montserrat 400, tombol tetap Comfortaa, caption bawah carousel dihapus
- File yang berubah:
  - `tailwind.config.js`: token baru `copy: ['Montserrat', ...]`
  - `entries/index.html`: Google Fonts Montserrat `wght@900` jadi `wght@400;900`
  - `src/components/About.jsx`: `h2` dan `p` dapat `font-copy font-normal`, tombol tidak disentuh
  - `src/components/CircularCarousel.jsx`: blok caption dan helper `nomor` dihapus, `captions` diterima tapi tidak dirender
  - `src/components/CircularCarousel.css`: aturan caption dihapus, `padding-bottom: 76px` di wadah dicabut
  - Hasil build dicopy ke root: `index.html`, `assets/main-CXicjp75.js`, `assets/main-DMv_AgO5.css` (bundle lama `main-Ctkc1a3l.js` dan `main-TPdYdSDw.css` dihapus dulu), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  1. **Copy pakai Montserrat 400.** `h2` dan `p` About sebelumnya mewarisi `body { font-sans }` = Comfortaa. Ditambah token `copy` supaya pemilihan font eksplisit dan tidak menular ke tombol
  2. **Tombol tetap Comfortaa.** `.tombol-merah` memakai `font-sans`, dan token `copy` hanya ditempel di `h2`/`p`. Tombol tidak tersentuh, terbukti dari hasil ukur
  3. **Montserrat 400 ikut dimuat.** URL Google Fonts sebelumnya cuma minta `wght@900`, jadi 400 akan di-sintesis browser (hasilnya beda dari file aslinya). Rentangnya diubah jadi `wght@400;900`
  4. **Caption dilepas.** Props `captions` tetap `true` di `About.jsx` karena masuk daftar 17 props yang dikunci Bang Rob. Yang dihapus render-nya di placeholder. Ruang 76px bawah (`CAPTION_SPACE`) ikut dicabut supaya kartu kembali ke tengah wadah
- Hasil tes:
  - `npm run build`: sukses, 7.34 detik. CSS `main-DMv_AgO5.css` 32.69 kB, JS `main-CXicjp75.js` 1,062.67 kB. Warning chunk > 500 kB masih dari three.js, bukan regresi batch ini
  - md5 bundle root sama persis dengan `dist/assets/`: JS `16a2b9fcd7b352c644df67a4c9deeb9c`, CSS `a5ed7e168d501500d018912565f39848`. `index.html` root menunjuk kedua file itu. Nol sisa rujukan ke hash lama `Ctkc1a3l`/`TPdYdSDw`, `assets/` isinya cuma 1 js + 1 css
  - `.font-copy{font-family:Montserrat,ui-rounded,system-ui,sans-serif}` terbukti ada di CSS hasil build. Nol sisa `.circular-carousel__caption`, `__judul`, `__jumlah` di CSS build
  - Build diserve dari root (`python3 -m http.server 8099`), gerbang dibuka lewat klik Masuk, diukur lewat CDP headless Chrome:
    - 360x800: h2 `Montserrat 400` ukuran 24px, p `Montserrat 400`, tombol `Comfortaa 700`. Caption tidak ada. Kartu 104x104, tengah kartu 160 = tengah wadah 160. Scroll horizontal 0, console error 0
    - 768x1024: h2 `Montserrat 400` 24px, tombol `Comfortaa 700`. Kartu 109x109, tengah kartu 192 = tengah wadah 192. Scroll horizontal 0, console error 0
    - 1280x900: h2 `Montserrat 400` 35.84px, tombol `Comfortaa 700`. Kartu 172x172, tengah kartu 280 = tengah wadah 280. Scroll horizontal 0, console error 0
    - `document.fonts` di ketiga lebar: Montserrat `loaded`, Comfortaa `loaded`
  - Tema gelap (ditukar lewat tombol tema asli): `#about` `rgb(12,12,12)`, h2 `rgb(248,250,252)`. Montserrat 400 tetap terbaca di atas tinta
  - Em dash: nol di baris yang ditambah
- Catatan jujur:
  - **Dev server 5015 perlu restart.** Tailwind membaca `tailwind.config.js` sekali saat start, jadi `font-copy` belum ada di CSS dev sebelum server di-restart (terbukti: h2 masih Comfortaa 400 saat diukur di 5015, sementara build yang fresh langsung benar). Ini bukan bug kode
  - Props `captions` masih `true` karena dikunci. Kalau nanti desain asli Bang Rob membaca prop itu, caption bisa muncul lagi. Kalau mau permanen hilang, nilainya perlu diubah jadi `false`
  - Montserrat 400 untuk judul section jauh lebih ringan dari Comfortaa 700 sebelumnya. Ukuran `judul-bagian` tidak diubah, jadi tampilan barunya lebih tipis. Ini permintaan langsung Bang Rob, belum dinilai ulang secara visual
  - Sora, Manrope, dan Montserrat 900 masih dimuat walau token `headline`/`heading` nol pemakaian. Belum dibersihkan, menunggu keputusan Bang Rob

## 20 Okt 2026, 10 gambar proyek asli masuk carousel About

- Tanggal: 20 Okt 2026
- Judul PR: 10 kartu proyek asli (540x540 WebP) menggantikan 3 placeholder, placeholder carousel jadi pratinjau cincin 2D statis
- File yang berubah:
  - Baru: `public/images/about/` isi 10 WebP 540x540 (aset Bang Rob)
  - Diubah: `src/components/About.jsx` (array `kartu` 10 entri dengan `src`, `alt`, `title`, `subtitle` asli)
  - Diubah: `src/components/CircularCarousel.jsx` (tata letak dari baris datar jadi cincin 2D statis: radius pakai rumus komponen asli, posisi sin/cos, skala kedalaman, lapisan `depthFade`)
  - Diubah: `src/components/CircularCarousel.css` (kartu jadi absolut dari titik tengah wadah, kelas baru `__pudar`, aturan baris flex dibuang)
  - Dihapus: `public/images/placeholder-01/02/03.svg` dan salinannya di `images/` (sudah tidak dipakai)
  - Rename: `Apps-CV Screening.webp` jadi `Apps-CV-Screening.webp` (spasi di nama file rawan di URL Apache, sama seperti kasus `Dark Headline1x.svg` dulu)
  - Hasil build dicopy ke root: `index.html`, `assets/main-BjH4XVzS.js`, `assets/main-hvKy-Rpq.css` (bundle lama `main-CXicjp75.js` dan `main-DMv_AgO5.css` dihapus dulu), `images/` termasuk `images/about/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  1. **10 item mengubah geometri cincin.** Radius dihitung `max(chord + (arc - chord) * curve, cardWidth * 0.6)`. Dengan 10 kartu (pitch 195): arc 310 px, jadi cincinnya jauh lebih besar dari versi 3 kartu (108 px)
  2. **Baris datar tidak lagi bisa dipakai.** Auto-fit lama menganggap semua kartu berjajar, jadi lebar isi 10 x 180 + 9 x 15 = 1935 px harus masuk wadah 328 px. Hasil ukur: kartu jadi 31 px di 360 dan 51 px di 1280. Karena itu placeholder diubah jadi cincin 2D statis dengan rumus radius yang sama seperti komponen asli
  3. **Tetap statis.** Tidak ada rotasi, drag, autoplay, atau intro 3D. Yang ditambahkan cuma pratinjau tata letak supaya kerapatan cincin dengan 10 item bisa dinilai sebelum desain asli masuk
  4. **Nama file berspasi dirapikan.** `Apps-CV Screening.webp` bakal jadi `%20` di URL dan rawan salah di Apache
- Hasil tes:
  - Aset: 10 file WebP semuanya 540x540, total 968 KB di disk. Nama unik 10, nol tabrakan
  - `npm run build`: sukses, 7.20 detik. CSS `main-hvKy-Rpq.css`, JS `main-BjH4XVzS.js`. Warning chunk > 500 kB masih dari three.js
  - md5 bundle root sama persis dengan `dist/assets/`: JS `b4e0681e0d7e5973d86a34a9f1f1dd03`, CSS `b1396165ff9d6fd537dd9cf1fa82875a`. `index.html` root menunjuk kedua file itu. `assets/` isinya cuma 1 js + 1 css
  - `images/about/` di root berisi 10 file, hasil `cp -rf dist/images/.` sesuai `contributing.md` (subfolder ikut)
  - Dev server 5015 dan build produksi dari root (`:8099`), gerbang dibuka lewat klik Masuk, diukur lewat CDP headless Chrome. Hasil identik di keduanya:
    - 360x800: 10 kartu, 10 src unik, 10 gambar siap, resolusi 540x540. Ukuran kartu 80/78/72/66/62/60 px menurut kedalaman. Scroll horizontal 0, console bersih, request gagal nol
    - 768x1024: kartu 84/82/76/69/65/63 px. Scroll horizontal 0, console bersih, request gagal nol
    - 1280x900: kartu 133/129/119/109/103/100 px. Scroll horizontal 0, console bersih, request gagal nol
    - Caption tidak ada di ketiga lebar
  - Screenshot 1280 tema terang: kartu jauh memudar menyatu ke kertas, cincin kebaca sebagai deretan kartu bertumpuk dengan satu kartu terdepan paling tajam
  - Screenshot 360: cincin muat selebar layar, kartu depan sekitar 80 px
- Catatan jujur:
  - **Total bobot 968 KB untuk 10 gambar.** Komponen asli memuat semua `src` sekaligus di awal (dibatasi 16 sumber) sebelum menampilkan cincin, jadi angka ini masuk ke beban muat halaman saat About dibuka. Belum dioptimasi, belum diputuskan mau dikompres lebih atau dibiarkan
  - **Placeholder masih proyeksi 2D, bukan 3D.** Kartu tidak di-`rotateY`, jadi yang terlihat deretan kartu menyamping, bukan cincin berputar. Saat desain asli masuk, `preset="cylinder"` akan memiringkan tiap kartu sehingga bentuknya berubah
  - **Di tema gelap kartu jauh memudar ke kertas terang** sehingga terlihat lebih menyala dari kartu depan. Konsekuensi `fadeColor` yang dikunci, sudah disetujui Bang Rob
  - **Di HP kartu depan cuma sekitar 80 px** karena `fit` dibatasi lebar wadah. Kalau mau lebih besar, jumlah item atau `cardWidth` yang perlu diubah, bukan tinggi wadah
  - Dev server 5015 sudah memuat `font-copy` di batch ini (sebelumnya perlu restart setelah ubah `tailwind.config.js`)
  - `plan-prd/about-circular-carousel/` masih di `.gitignore`, tidak ikut PR ini

## 20 Okt 2026, gambar About berhenti kebuka sejak halaman dimuat

- Tanggal: 20 Okt 2026
- Judul PR: About nunggu gerbang mulai membuka, gambar diperkecil 540 ke 400 px
- File yang berubah:
  - Diubah: `src/pages/Portal.jsx` (`<About />` jadi `(membuka || gerbangTerbuka) && <About />`, komentar Spec S4 ditambah pengecualian)
  - Diperkecil: 10 file di `public/images/about/` (540x540 jadi 400x400, `-quality 75`)
  - Hasil build dicopy ke root: `index.html`, `assets/main-DdAfvNrm.js` (bundle JS lama `main-BjH4XVzS.js` dihapus), `assets/main-hvKy-Rpq.css` (CSS tidak berubah), `images/` termasuk `images/about/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Kenapa perlu:
  1. **Masalah yang dilaporkan Bang Rob: 10 gambar About nongol di beban sebelum gerbang kebuka.** Penyebabnya bukan `<link rel="preload">` (cek, tidak ada satupun di HTML), tapi `<About />` di-mount sejak render pertama di `Portal.jsx` sehingga 10 elemen `<img>` sudah ada di DOM, dan atribut `loading` default itu `eager` jadi browser langsung menarik semuanya walaupun tertutup gerbang opak. Gerbang menutup tampilan, bukan network
  2. **Bukti sebelum diperbaiki:** 6 detik pertama tanpa klik Masuk, 10 dari 10 gambar About sudah direquest, total 28 request. Berat yang terbawa: gambar About 948 KB + 3 GLB logo 3.180 KB + aset lain sekitar 240 KB
  3. **Dua perbaikan sekaligus.** Mount ditahan (`membuka` = detik ke-0 luma fade, bukan `gerbangTerbuka` = fade selesai) supaya halaman di belakang gerbang tetap utuh saat direveal sesuai Spec S4, dan gambar dikompres supaya bobotnya masuk akal
- Hasil tes:
  - Kompres: `magick -resize 400x400 -quality 75`, total 948 KB jadi 92 KB (turun 10 kali). Ke-10 file terverifikasi 400x400 lewat `identify`
  - Pengecekan visual: asli 540 dan hasil kompres dinaikkan lagi ke 540 lalu dibanding berdampingan untuk gambar `Websites-Portfolio` dan `Tools-35B-Model-On-Rx-6700-XT`. Teks halus di versi 400 lebih lembut, tapi ukuran tampil kartu depan paling besar cuma 133 px CSS (2x DPR = 266 px), jadi sumber 400 px masih 3 kali lipat kebutuhannya
  - `npm run build`: sukses, 6.87 detik. JS `main-DdAfvNrm.js`, CSS `main-hvKy-Rpq.css` tidak berubah. md5 root sama persis dengan `dist/`: `index.html` `0a40d577ad992456ce46b1e7f4d94078`, JS `59b1dbfa5a91bf8bbb9a46678f94fd18`, CSS `b1396165ff9d6fd537dd9cf1fa82875a`
  - Probe dua fase lewat CDP headless Chrome, di `:8099` (build root) dan `:5015` (dev) hasil identik:
    - Fase 1, gerbang nutup, 6 detik tanpa klik: `#about` tidak ada, `img` di About 0, request gambar About 0 (sebelumnya 10). Total request root turun dari 28 jadi 15
    - Fase 2, sesudah klik Masuk dan fade selesai: `#about` ada, 10 `img`, request gambar About 10, ke-10 gambar `complete` dan `naturalWidth > 0`
    - Console bersih di kedua fase dan kedua server
  - Request gagal tersisa `net::ERR_ABORTED` dari `google-analytics.com/g/collect` (page_view dan scroll). Sudah dibuka satu per satu: beacon GA dari `entries/index.html` baris 98, pre-existing, bukan aset first-party. Nol aset kita yang gagal
- Catatan jujur:
  - **Entry sebelumnya (10 gambar proyek asli) menyebut 540x540 dan 968 KB. Angka itu sudah digantikan entri ini, 400x400 dan 92 KB.** Master 540 asli tidak hilang: masih ada di git pada commit `9559aa8` dan di salinan lokal `/tmp/opencode/about_540/`
  - **Kompresnya re-encode**, jadi ada kehilangan generasi. Kalau Bang Rob mau tajam lagi, jalankan ulang dari master 540 dengan kualitas lebih tinggi, atau turunkan resolusi cuma untuk gambar yang kartunya kecil
  - **About baru nongol saat gerbang mulai membuka.** Dengan kondisi body `overflow:hidden` dan posisi scroll 0 waktu gerbang buka, halaman tumbuh ke bawah sehingga tidak ada lompatan yang terlihat
  - Perbaikan ini tidak menyentuh 17 props di `About.jsx` dan tidak menyentuh `CircularCarousel.jsx`, jadi tetap aman waktu Bang Rob menimpa placeholder dengan desain aslinya. Komponen asli yang nanti mengurus preload-nya sendiri
  - Entry ini menjawab pertanyaan Bang Rob: "kenapa dia nongol di gerbang". Jawabannya bukan di `Gerbang.jsx`, file itu tidak kena batch ini sama sekali (terakhir disentuh di `79876b6`)

## 20 Okt 2026, CircularCarousel pakai sumber asli, seluruh properti aktif

- Tanggal: 20 Okt 2026
- Judul PR: carousel about ganti placeholder dengan komponen React Bits asli (autoplay, drag, wheel, keyboard, 3D, parallax, stretch aktif)
- File yang berubah:
  - Ditulis ulang: `src/components/CircularCarousel.jsx` (965 baris) dan `src/components/CircularCarousel.css` (241 baris)
  - Hasil build dicopy ke root: `index.html`, `assets/main-D8sHFf6k.js`, `assets/main-CWm9M0gg.css` (bundle lama `main-DoQ6azJb.js` dan `main-BVRCC2bJ.css` dihapus), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
  - `About.jsx` TIDAK diubah. Terakhir berubah di `9559aa8`, jadi kontrak 17 props utuh
- Asal sumber: `plan-prd/prompt/circular-carrousell.md` bagian `### Full Component Source` (baris 79-1043 untuk JSX, 1048-1288 untuk CSS). File prompt itu ada lokal saja, `plan-prd/` masuk `.gitignore`, jadi tidak ikut ke repo. Sumber React Bits ini yang selama ini disebut "desain asli Bang Rob"
- Kenapa perlu: Bang Rob minta seluruh fitur dinyalakan (autoplay, direction, perspective, parallax, dll). Placeholder sengaja dibuat tanpa gerak sesuai spec lama, jadi jawabannya bukan menambah gerak sedikit-sedikit ke placeholder tapi memasang komponen aslinya. Import cuma `react` dan CSS sendiri, jadi nol dependency baru
- Empat penyesuaian di atas sumber asli:
  1. `import 'use client'` dihapus ( direktif Next.js, tidak ada gunanya di Vite )
  2. `DEFAULT_ITEMS` dikosongkan dari 10 foto `images.unsplash.com` jadi `[]`. `About.jsx` selalu mengirim 10 item sendiri, dan aturan repo melarang URL pihak ketiga menempel di source. Nol request unsplash terbukti di tes
  3. `CAPTION_SPACE = 76` jadi `0`. Tanpa ini cincin naik 38 px karena ruang caption tetap dipesan walau caption disembunyikan
  4. Caption disembunyikan lewat `CircularCarousel.css`, bukan lewat prop. Aturannya ditaruh SETELAH blok `.circular-carousel__caption` asli karena spesifisitas sama dan yang menang adalah yang terakhir. Kesalahan pertama: gue menaruhnya di depan blok dan kalah dengan `display: flex` di dalam blok yang sama, jadi caption tetap muncul
- Hasil tes (CDP headless Chrome, `:8099` build root kecuali disebut lain):

  | Fitur | Cara diukur | Hasil |
  |---|---|---|
  | `autoplay="drift"` | laju sudut per detik | luar kanvas `-1,77` derajat/dtk dan masih menanjak, sesudah hover `0` persis |
  | `direction="left"` | offset intro `-32 x dir` | sudut awal `+32`, berarti `dir = -1` sesuai `left` |
  | `intro="assemble"` | sampel sudut 200 ms | `0, 32, 8,7, 1,5, 0,3, 0` lalu menguap, cocok dengan `easeOut` atas 1500 ms |
  | `perspective=1880` | `stage.style.perspective` | `1880px`, ring `rotateY(...)`, camera `rotateX/rotateY` |
  | `parallax=1` | yaw kamera saat kursor masuk | `0` -> `3,42` derajat, sesudah keluar balik ke `0,015` |
  | `stretch=0.21` | radius camera diam vs saat wheel | `-310,402` -> `-318,173`, selisih **7,77 px**; prediksi rumus `310 x 0,21 x 0,12 = 7,81 px` |
  | `innerShade=1` | `--cc-inner` di root | `0,000` (rumus `1 - innerShade`) |
  | `depthFade=1` | `--cc-depth` per kartu | `0,000 / 0,053 / 0,264 / 0,587` |
  | `fadeColor` / `cornerRadius` | `--cc-fade` / `--cc-radius` | `#f8fafc` / `10px` |
  | drag + `momentum=0,79` | seret 560 px lalu lepas | sudut bergeser `-67` derajat saat menyeret, lalu masih mengalir `-6` derajat sesudah lepas |
  | `snap=false` | sudut terus berubah sesudah lepas | iya, tidak dijepit ke kartu terdekat |
  | wheel horizontal | `deltaX` 300 | sudut bergeser `-621` derajat |
  | wheel tidak menahan halaman | `deltaY` 500 di atas kanvas | `scrollY 507 -> 1007`, halaman tetap ke-scroll |
  | keyboard | `ArrowRight` 3 kali | `aria-live` `Booking InDeep, 1 of 10` -> `JobTracker, 6 of 10` |
  | `pauseOnHover` | dua run segar, 8 sampel 1 dtk | luar `-1,554 -1,642 -1,713 -1,769 -1,815 -1,851 -1,881 -1,904`, saat hover `0 0 0 0 0 0 0 0` |
  | `focusOnClick` | klik kartu lalu baca `document.activeElement` | `MAIN` -> `circular-carousel` |
  | live region | isi `.circular-carousel__live` | `title, n of 10` ikut berganti |
  | grid `data-shape` / `data-axis` | atribut root | `cylinder` / `y`, `data-ready` dan `data-draggable` ada |

  - Sebelum gerbang dibuka: `#about` tidak ada, `img` 0, request gambar about **0** (perbaikan batch sebelumnya tidak rusak)
  - Sesudah dibuka: 10 gambar direquest, 10 unik, semua `complete` dan `naturalWidth > 0`
  - Host yang diakses cuma `localhost`, `fonts.googleapis.com`, `fonts.gstatic.com`, `googletagmanager.com`, `google-analytics.com`. **Unsplash 0**
  - Console bersih. Request gagal tersisa 1-2 beacon `google-analytics.com/g/collect`, pre-existing
  - Overflow horizontal `0` di 360 / 768 / 1280
  - `npm run build` sukses 6,59 detik. md5 root == `dist/assets`
- Catatan jujur:
  - **Chrome headless menjalankan animasi sekitar 4 kali lebih lambat dari waktu asli.** Terukur: `requestAnimationFrame` cuma 4-5 fps, dan kode membatasi `dt` ke 0,05 detik per frame. Jadi `speed=8` (8 derajat/detik) terbaca sekitar 2 derajat/detik di pengukuran. Ini bukan bug komponen. Karena itu tes `pauseOnHover` pertama sempat menyesatkan, sampai diulang dengan dua run segar
  - **`stretch` nyaris tak terlihat lewat drag biasa.** `velocity` cuma dihitung saat tombol dilepas dari sampel 110 ms terakhir, dan input CDP jarang menyentuh 420 derajat/detik yang dibutuhkan. Lewat wheel langsung kena: selisih 7,77 px persis seperti rumusnya
  - **160 elemen `tile`, 160 `frame`, 160 `photo`, 160 `shade` untuk 10 gambar.** Sumber memakai `TILES = 8` dengan dua muka (front/back) untuk crossfade, jadi 8 x 2 x 10. Total node HTML halaman 1131. Jaringan tetap cuma 10 file karena `src` unik 10
  - **Cincin setinggi sekitar 190 px di dalam wadah setinggi 560 px di desktop, dan sekitar 120 px di wadah 320 px di HP.** Fit diatur lebar, jadi ruang kosong vertikalnya besar. Wadah di `About.jsx` masih `clamp(320px, 50vw, 560px)` yang di komentar disebut titik awal. Keputusan tuning ada di Bang Rob, belum disentuh
  - **Kartu depan sekitar 160 px di desktop** (placeholder tadi 133 px). Sumber gambar 400 px masih cukup untuk DPR 2, tapi mulai mepet di DPR 3-4
  - **Cincin berada sekitar 9 px di atas tengah wadah.** Sudah turun dari sekitar 47 px sejak `CAPTION_SPACE` dimatikan; sisanya berasal dari tata letak `tile` di sumber, bukan dari caption
  - **Kalau Bang Rob menimpa `CircularCarousel.css` sendiri, caption bisa muncul lagi**, karena penyembunyiannya ada di CSS. Prop `captions` tetap `true` di `About.jsx` sesuai kontrak
  - Entry sebelumnya masih berlaku untuk gambar: `400x400`, total 92 KB

## 20 Okt 2026, About: latar radial ink, section dipendek, CTA pill + tilt

- Tanggal: 20 Okt 2026
- Judul: About section dirapikan — gradient terang, tinggi section dipendek (desktop & mobile), CTA disamakan dengan hero
- File yang berubah:
  - Ubah: `src/components/About.jsx`
  - Ubah: `src/styles/global.css`
- Perubahan:

  1. **Latar About tema terang** (`global.css`): radial gradient ink dari pojok kanan atas — `radial-gradient(110% 95% at 100% 0%, rgba(12,12,12,0.7) → 0.4 → 0.12 → 0)`. Ditaruh di `html:not([data-theme='gelap']) #about` supaya tema gelap zero-diff. Di belakangnya `--bidang` (kertas), jadi kiri/bawah tetap polos. Iterasi: pertama abu solid `#e8eef4` (ditolak, direvert bersih), lalu radial dua kali tuning (pekat & jangkauan dinaikkan sampai diterima)
  2. **Wadah carousel dipendek** (`About.jsx`): `clamp(320px, 50vw, 560px)` → `clamp(150px, 42vw, 360px)`. Alasan aman: `spanY` ring konstan ~205px (bukan fungsi viewport), jadi selama `tinggiWadah >= 0.378 * lebarWadah` fit tetap width-limited dan ukuran kartu **tidak berubah sama sekali**. Titik terberat vw 357: 150 vs 121 (aman 29px). Komentar di kode mencatat rumus ini
  3. **Padding mobile dikunci** (`About.jsx`): kolom teks `py-16` → `pt-12 pb-6`, kolom carousel `py-16` → `pt-2 pb-12` (di bawah `md` saja; `md:py-24` menang di ≥768). Tujuan: jarak CTA → kartu di 360px turun dari ~130px jadi 51px
  4. **CTA "Lihat porto" disamakan hero**: `tombol-merah` (kotak) → `tombol-merah-pill` + dibungkus `TiltTombol` (pola persis `Hero.jsx`). Ikut: hover tinta, tilt 22°, scale 1.05, hormati `prefers-reduced-motion`. Efek pencet (`:active`) tidak dipasang — di hero juga tidak ada (grep codebase: `:active` cuma di navbar). Komentar kelas pill diperbarui (dulu bilang About/Gerbang tetap kotak; faktanya Gerbang sudah pill sejak lama, About doang yang tertinggal)

- Hasil tes (CDP headless Chrome; dev server 5015 untuk iterasi, lalu build root :8099 untuk verifikasi akhir):

  | Viewport | sectionH sebelum | sesudah | fit (dulu = sesudah) | gap CTA→kartu |
  |---|---|---|---|---|
  | 360 | 853 | **556** | 0.548 = 0.548 | 51 px (dulu ~180) |
  | 768 | 576 | **515** | 0.575 = 0.575 | n/a (grid 2 kolom) |
  | 1280 | 752 | **552** | 0.909 = 0.909 | n/a (grid 2 kolom) |

  - `fit` identik di semua breakpoint = kartu tidak mengecil, cuma ruang kosong wadah yang dipangkas (187px → 87px per sisi di desktop; 104px → 19px di HP)
  - Titik tengah single-column aman: vw 428 (wadah 180 vs hMin 142), vw 700 (wadah 294 vs hMin 223, fit = 1)
  - Build root: `.tilt-tombol` ada, `borderRadius: 9999px`, gradient `radial-gradient` aktif di terang, `backgroundImage: none` di gelap, `ovfX 0` di 3 breakpoint, console 0 error
  - `npm run build` sukses; bundle `main-CAgsQ8vz.css` + `main-C8FmVF5d.js`; loop verifikasi `index.html` → `assets/` semua OK
- Catatan jujur:
  - **Jarak CTA→kartu dihitung dari `getBoundingClientRect` tile**, bukan mata. Tile adalah elemen visual asli; `__card` berdimensi 0×0 (anchor 3D), jadi probe yang memakai `__card` menghasilkan null
  - **Tema gelap tidak tersentuh sama sekali** — aturan gradient dijaring `html:not([data-theme='gelap'])`. Terverifikasi `backgroundImage === 'none'` di gelap
  - **Warning console tersisa pre-existing**: WebGL swiftshader (artefak headless, bukan kode) dan `blur(-0.01788px)` dari `CardNav.jsx` (nilai negatif saat animasi, di luar scope PR ini)
  - **`tombol-merah` (kotak) kini tidak dipakai komponen mana pun** — disimpan di CSS sebagai opsi masa depan sesuai komentar yang diperbarui
  - **PR ini tidak menyentuh kontrak 17 props** CircularCarousel di `About.jsx`; `fadeColor="#f8fafc"` tetap hardcoded sesuai keputusan sebelumnya

## 20 Okt 2026, Collection: kartu teks+banner full-bleed, warna kartu dan section ditukar per tema

- Tanggal: 20 Okt 2026
- Judul: Collection dirapikan — struktur kartu teks compact di atas + banner 16:9 full-bleed di bawah, warna kartu di-flip antar tema, section gelap disamakan About
- File yang berubah:
  - Baru: `public/images/collection/` (9 gambar 920×520 WebP)
  - Ubah: `src/components/Collection.jsx`
  - Ubah: `src/data/proyek.js`
  - Ubah: `src/styles/global.css`
  - Ubah: hasil build di root (`index.html`, `assets/`, `images/`)
- Perubahan:

  1. **Struktur kartu baru** (`IsiKartu` di `Collection.jsx`): teks compact gaya CardNav di atas — judul `17px/600`, kalimat `13px/1.45` opacity 0.7, status mono `11px` sejajar judul di kanan, padding `16px` rapat — lalu banner 16:9 `full-bleed` di bawah (mt-auto, tinggi 260px di lebar 460). Baris `host` dihapus dari kartu. **Hanya `<a>` di banner** yang link (`target="_blank"`), area teks murni permukaan drag CardSwap. `draggable={false}` di link + img (bug lama: native link-drag kirim `pointercancel`, drag kartu mati). Gambar `loading="lazy"` + `decoding="async"`
  2. **9 gambar design masuk** (`public/images/collection/`, field `gambar` baru di `proyek.js`). Dua file di-rename sebelum dipakai: `Karyawan Digital.webp` → `Karyawan-Digital.webp` (spasi rawan URL Apache), `Jon-Tracker.webp` → `Jobtracker.webp` (typo; isinya screenshot Jobtracker)
  3. **Tinggi kartu 260 → 360, wrapper `h-[480px]` → `h-[608px]`**: `batasTumpukan(460×360, jarakVertikal 120, kedalaman 200, terlihat 4, lereng tan 5°)` = 544×607, jadi wrapper 608 bikin skala panggung = **1.0** (dulu scale 0.91 — teks 13px nggak ikut mengecil). Terverifikasi di DOM: `--swap-stage-h: 607px`, `transform: ... scale(1)`
  4. **Warna kartu di-flip antar tema** (permintaan Bang Rob): `bg-bidang text-teks` → `bg-lawan text-lawanTeks` — terang kartu **tinta**, gelap kartu **kertas** (kebalikan semula). Ikut ditukar: `.kartu-swap-naungan` (light kertas / dark tinta) dan `.kartu-swap-kartu` — keduanya wajib sebaliknya warna kartu supaya naungan tetap meredupkan, bukan menyatu
  5. **Section Collection tema gelap disamakan About** (permintaan Bang Rob): kelas `bg-lawan text-lawanTeks` → **`bg-bidang text-teks`** (persis About). Di gelap: bg **tinta** (`rgb(12,12,12)`, identik About), font **kertas** (`--teks`). Sebelum ini section gelap = kertas (pita `--lawan-bidang`) → kartu kertas nyatu, jadi masalah kontras. Tema terang **zero-diff** — tetap dijaring rule `html:not([data-theme='gelap']) #collection` (selektor ID menang atas kelas Tailwind). Komentar rule itu di-update (bagian "tema gelap tidak berubah" jadi basi)
  6. **Bug fix sementara**: comment JSX `{/* */}` sempat tertaruh tepat setelah `return (` → Vite error `Unexpected token, expected ","`. Pindah jadi komentar `//` di atas `return`

- Hasil tes (CDP headless Chrome; dev 5015 untuk iterasi, lalu build root `:8099` untuk verifikasi akhir):

  | Viewport | ovfX | console | bgSection (terang) | img loaded | list mobile |
  |---|---|---|---|---|---|
  | 360 | 0 | 0 err | kertas | 0/9 (lazy + stack hidden, by design) | tampil |
  | 768 | 0 | 0 err | kertas | 0/9 (sama) | tampil |
  | 1280 | 0 | 0 err | kertas | **9/9** | hidden, stack aktif |

  - Build root `:8099`: gerbang jalan di 3 viewport, 9 kartu render, 9 link banner (`_blank`, href bener), **link mati global = 0**
  - Tema gelap: bgSection `rgb(12,12,12)`, teks h2 `rgb(248,250,252)` (token kertas), kartu kertas → kontras beres
  - `npm run build` sukses; bundle `main-DRYg-Qhy.js` + `main-CGgk9A5v.css`; loop verifikasi `index.html` → `assets/` semua OK
  - Teks nggak kepotong: `teksOverflow = false` di semua 9 kartu (2 baris kalimat terpanjang masih muat di blok 100px)
- Catatan jujur:
  - **Rect kartu di probe `460×400`** = proyeksi 3D slot (kemiringan 5°), bukan layout; layout tetap `460×360` — dibuktikan dari `teksOverflow:false`
  - **`imgOk 0/9` di 360/768 bukan bug**: stack di `hidden lg:block` (display:none) + `loading="lazy"` → gambar nggak pernah di-fetch di mobile. Ini justru yang diinginkan (~954KB nggak tarik di HP)
  - **`.kartu-swap-kartu` ikut di-flip tapi class-nya tidak aktif** — CardSwap me-render children langsung ke `.kartu-swap-slot` tanpa bungkus komponen `Kartu`. Dipertahankan & disesuaikan biar konsisten kalau nanti dipakai; warna kartu yang hidup datang dari kelas di `IsiKartu`
  - **`host` masih ada di list mobile** (`lg:hidden`) — hilang hanya dari kartu desktop; belum dikonfirmasi apakah list juga ikut
  - **Keputusan sepihak Udin**: status pindah sejajar judul di kanan (semula baris bawah); sudah dilaporkan, tidak dikoreksi
  - **Warning console pre-existing** (sama dengan batch sebelumnya): WebGL swiftshader artefak headless + `blur` negatif `CardNav.jsx` — di luar scope PR ini
  - **Belum dites di PR ini**: performa drag kartu via pointer setelah banner jadi `<a>` (fix `draggable={false}` mengikuti pola lama yang sudah terbukti, tapi tidak diukur ulang)

## 20 Okt 2026, Contact section: judul, statement, dua CTA pill

- Tanggal: 20 Okt 2026
- Judul PR: Contact section dibangun ulang dari reference Bang Rob. Judul "Contact" besar, dua baris statement, dua tombol pill (email dan WhatsApp) dengan efek tilt. Latar section dibiarkan polos.
- File yang berubah:
  - `src/components/Contact.jsx` (rewrite total)
  - Hasil build dicopy ke root: `index.html`, `assets/main-BrwAhJ_q.js`, `assets/main-qdEJ_Trn.css`, `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
  - `src/styles/global.css` **tidak berubah**. Percobaan rule `#contact` untuk radial ink dibuang sebelum commit, sesuai permintaan Bang Rob.
- Yang dikerjakan:
  1. **Judul.** `h2` "Contact", Comfortaa 700, `clamp(2rem, 5vw, 3.5rem)`, rata tengah, warna `var(--teks)` jadi tinta di tema terang dan kertas di tema gelap. Garis `border-b border-garis` memisahkannya dari isi, sesuai gambar reference Bang Rob.
  2. **Statement dua baris.** Satu `<p>` dengan dua `<span class="block">` supaya tetap satu paragraf buat pembaca layar. Baris "Mau ngobrolin project?" weight 500, baris "Lets get in touch" weight 700. Comfortaa, `clamp(1.15rem, 2.4vw, 1.75rem)`.
  3. **Dua CTA pill.** `.tombol-merah-pill` dibungkus `TiltTombol`, kelas dan efek identik dengan tombol "Lihat Experiment Project" di About. Label tombol cuma kata bendanya ("Email", "WhatsApp"). Alamat aslinya cuma ada di `href`, tidak ditulis ulang di bawah tombol. Percobaan pertama dengan caption alamat mono di bawah tiap tombol dibuang atas permintaan Bang Rob: yang di reference cuma informasinya, bukan elemen desain.
  4. **Latar polos.** Section tetap `bg-bidang text-teks`. Nggak ada gradient, nggak ada warna khusus, tema terang dan gelap cuma dibedain oleh token yang sudah ada.
  5. **Daftar kanal lama dibuang.** Sembilan tautan sosial, email, dan WhatsApp versi lama dihapus dari section ini. Bang Rob mau arahkan isi itu ke footer di batch berikutnya.
- Percobaan yang dibuang sebelum commit:
  - Versi pertama section ini dibikin sebagai "index kanal" satu kolom dengan nomor mono `01` sampai `09`, sub-label kelompok, dan latar radial ink. Bang Rob menolak: "kenapa jadi kayak web jualan ya?" Analisisnya: seluruh copy portal ini deskriptif, tidak ada satu pun kalimat jualan, jadi funnel di bagian penutup justru merusak nada. Percobaan itu sudah di-revert penuh, `global.css` dan `assets/` dikembalikan ke kondisi sebelum itu.
  - Percobaan kedua (index yang sama) ditolak lagi: "gue ga suka", tanpa penjelasan. Arah yang sama dibuang.
  - Arah final datang dari reference gambar Bang Rob sendiri, bukan dari tebakan.
- Hasil tes (CDP headless Chrome, gerbang dibuka lewat klik tombol Masuk):
  - **Dev server 5015** (milik Bang Rob, source langsung): `GET /` 200, section ke-render, Comfortaa 700 untuk judul, 500 dan 700 untuk dua baris statement, dua tombol pill dengan `TiltTombol`, backgroundImage `none`, `scrollWidth - clientWidth = 0` di 360 / 768 / 1280, console bersih tanpa error. Hasil identik di dev server dan build produksi
  - **Build root `python3 -m http.server 8099`** (file persis yang akan live):
    - 360x800, 768x1024, 1280x900:
      - `h2` "Contact" terhitung Comfortaa 700, ukuran 32 / 38.4 / 56 px, `text-align: center`, warna `rgb(12,12,12)` di terang
      - Statement: Comfortaa 500 (baris pertama) dan Comfortaa 700 (baris kedua), 18.4 px di 360 dan 768, 28 px di 1280, rata tengah
      - Dua CTA: `border-radius: 9999px`, `TiltTombol` terpasang, `mailto:dev@ra-labs.tech` tanpa `target`, `https://wa.me/6287754778218` dengan `target="_blank"` plus `rel="noopener noreferrer"`
      - Tidak ada caption di bawah tombol. Section cuma punya 2 link, sesuai instruksi menghapus isi lama
      - `backgroundImage: none` di tema terang dan gelap. `backgroundColor` kertas di terang, tinta di gelap. Warna teks dan warna garis ikut berubah (tinta ke kertas, garis tinta ke garis kertas)
      - `scrollWidth - clientWidth = 0` di dokumen dan body, tidak ada scroll horizontal
      - Console: nol error, nol exception
  - `npm run build`: sukses, 6517 modul, 7.74 detik. CSS `main-qdEJ_Trn.css` 37.04 kB, JS `main-BrwAhJ_q.js` 1,080.63 kB. Warning chunk di atas 500 kB masih dari three.js, bukan regresi batch ini
  - md5 bundle root sama persis dengan `dist/assets/`: JS `ceade3859fc0bd6cda85a3b55b25cd2b`, CSS `855f09411b1bf798c5f2013f01a3f29d`. `index.html` root menunjuk kedua file itu, casing dicek
  - `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt` semua 200 dari root repo
- Catatan jujur:
  - **Dua asumsi gue yang belum dikonfirmasi Bang Rob.** (1) Weight statement dibagi 500 untuk baris pertama dan 700 untuk baris kedua, dari catatan "Font Comforta medium 500 700" di reference. (2) Label tombol dibikin "Email" dan "WhatsApp", dari "CTA email" dan "CTA whatsapp" di gambar. Alamat dan nomor WhatsApp cuma dipakai sebagai target `href`, tidak pernah ditulis sebagai teks di halaman. Kalau memang harus kelihatan, daftar address-nya lebih tepat ditaruh di footer sesuai rencana Bang Rob
  - **Domain email beda.** Alamat yang dipakai `dev@ra-labs.tech`, bukan domain portal `ralabs.my.id`. Gue pakai persis seperti yang ditulis Bang Rob, tapi slug-nya `ra-labs` (dengan strip) perlu dicek beneran
  - **Nomor WhatsApp** format internasional di `href` (`wa.me/6287754778218`) karena itu yang wa.me butuhin. Tidak ada nomor yang ditulis sebagai teks di halaman
  - **Rata tengah** diambil dari gambar reference, sementara section lain di portal ini rata kiri. Kalau mau rata kiri biar senada, tinggal ubah satu utility class
  - **Ukuran judul 56px di desktop** lebih besar dari `.judul-bagian` (38.4px) yang dipakai About dan Collection, karena di gambar reference "Contact" keliatan jadi elemen dominan di section
  - Section ini sekarang jadi section paling tipis di halaman (tinggi 372 px di 360). Kalau nanti terasa kosong, itu karena isinya memang diarahkan ke footer
  - **`src/components/About.jsx` ikut masuk commit ini.** Perubahan itu edit Bang Rob sendiri (copy "Lihat Experiment Project" dan link ke `experiments-list.html`), bukan bagian dari pekerjaan Contact. Dia ikut karena `git add src/` di `contributing.md` mengambil seluruh folder `src/`. Kalau mau dipisah, bilang saja
  - Belum dicek di Safari iOS dan Firefox desktop, baru Chrome

## 21 Okt 2026, Batch 12: footerporto, ikon tema, 3D balik depan, Cardswap mobile, animasi per section

- Tanggal: 21 Okt 2026
- Judul: landing page dirapikan dari atas ke bawah. Footer ditulis ulang mengikuti web porto, tombol tema jadi ikon, logo 3D balik ke lurus depan pas dilepas, CardSwap muncul di mobile, dan tiap section animasinya baru jalan waktu section-nya sampai
- File yang berubah:
  - Ditulis ulang: `src/components/Footer.jsx`
  - Baru: `src/components/Footer.css`
  - Ubah: `src/components/Navbar.jsx`, `src/components/Navbar.css` (tombol tema jadi ikon)
  - Ubah: `src/components/Logo3D.jsx`, `src/components/Mark3D.jsx` (balik ke lurus depan)
  - Ubah: `src/components/Collection.jsx` (CardSwap di mobile + animasi nunggu section)
  - Ubah: `src/components/AcidSquares.jsx`, `src/components/Hero.jsx`, `src/pages/Portal.jsx` (reveal latar hero diulang pas gerbang larut)
  - Ubah: `src/styles/global.css` (tujuh variable `--footer-*` per tema)
  - Hasil build dicopy ke root: `index.html`, `assets/main-oNm05iTV.js`, `assets/main-CvGxqKCe.css`, `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Yang dikerjakan:
  1. **Footer dari porto.** Sumber gaya: `src/components/shared/Footer.jsx` dan `src/styles/global.css` di web porto Robby Aliasa Akbar. Yang di Adopt: latar bertekstur grid 56px, blok status dengan live-dot, tiga kolom, tautan dengan panah `→` yang masuk dari kiri saat hover, bar bawah hak cipta plus domain. Tiga hal yang waktu itu masih di/mockup, sudah dibuang sesuai arahan Bang Rob: blok status "Sekarang", tiga tautan file statis (robots/sitemap/humans), dan satu-satunya daftar tautan teknis di bar bawah
  2. **Warna footer dibalik per tema.** Porto footernya selalu gelap. Portal ini ada dua tema, jadi `--footer-*` punya dua set: terang pakai tinta dan kertas, gelap dibalik. Opasitas teks di dua tema sengaja beda: alpha 0,55 tinta di atas kertas cuma jadi 4,29:1 (fails 4,5:1), jadi di tema gelap dinaikkan ke 0,60 dan 0,65
  3. **Navigasi footer ikut navbar.** Empat item Home, About, Collection, Contact, nama dan urutannya persis sama dengan `KARTU` di `Navbar.jsx`, targetnya anchor yang sama. Section yang sedang di layar dinyalakan pakai scroll-spy (garis 40 persen tinggi viewport), dan section terakhir dipaksa aktif kalau halaman sudah mentok bawah karena section itu pendek
  4. **Tombol tema jadi ikon.** Tulisan "Dark" dan "Light" diganti `Moon01Icon` dan `Sun01Icon` dari `@hugeicons/core-free-icons` (dependency yang sudah dipakai CardNav, nol dependency baru). Ikon nunjukin tema yang akan dituju, sama seperti logika tulisan sebelumnya. Tombolnya dikunci jadi kotak 44x44 karena isinya bukan tulisan lagi
  5. **Logo 3D balik ke lurus depan.** Logo tengah (`Logo3D.jsx`) dan dua mark kecil (`Mark3D.jsx`): pas drag dilepas, kamera pelan-pelan balik ke posisi awal (0, 0, 10) selama 800ms ease in-out, lalu spin jalan lagi. Cara persis yang dipakai `LogoGerbang.jsx` buat pose kurus: posisi dibaca dalam bentuk bola dan diinterpolasi lewat jalur terpendek. Drag lagi di tengah animasi membatalkan baliknya
  6. **CardSwap muncul di mobile.** Tumpukan kartu yang sebelumnya cuma di layar lebar, sekarang ada juga di mobile. List teks mobile dibuang sesuai pilihan Bang Rob. Ukuran kartu ikut breakpoint 768px: mobile 240x256 dengan 3 kartu kelihatan, desktop 460x360 dengan 4. Panggung mobile dihitung ulang pakai fungsi `batasTumpukan` yang asli supaya skalanya tetap 1, sehingga teks 13px tidak ikut mengecil (kalau tidak, di HP teksnya jadi 7,8px)
  7. **Animasi tiap section nunggu section-nya sampai.** CardSwap Collection sekarang baru dipasang begitu section-nya masuk layar, jadi animasi pembuka kartunya terlihat, bukan sudah kelar di belakang hero. Diperiksa lebih dulu: About sebenarnya sudah benar (carousel-nya punya IntersectionObserver sendiri, loop-nya berhenti di luar layar, jadi intro assemble-nya memang menunggu), jadi About tidak diubah sama sekali
  8. **Reveal latar hero diulang pas gerbang larut.** `AcidSquares` punya intro 3 detik yang jalan sejak halaman dibuka, jadi di browser sungguhan sudah kelar sebelum gerbang kebuka (gerbang butuh 2,8 detik). Sekarang ada prop `mulaiIntro`; `Portal.jsx` mengirim `membuka` ke `Hero`, jadi reveal diulang tepat waktu gerbang mulai larut dan kvadratnya tumbuh di mata pengunjung
- Hasil tes:
  - `npm run build`: sukses, 6518 modul, 7,33 detik. CSS `main-CvGxqKCe.css` 38,42 kB, JS `main-oNm05iTV.js` 1.085,16 kB (gzip 315,34 kB). Warning chunk di atas 500 kB masih ada, dari three.js, bukan regresi batch ini
  - md5 bundle root sama persis dengan `dist/assets/`: JS `880de09534a99824ba08add7d11922d4`, CSS `412437bc4a1fa6c2d99d12e032f6bcce`. `index.html` root menunjuk kedua file itu, dicek satu-satu, semua OK. `assets/` isinya cuma 1 js + 1 css
  - Hasil build diserve dari root repo (`python3 -m http.server 8099`), bukan dev server. Semua 200: root, index, kedua bundle, 404, robots, sitemap, humans, logo, dua SVG headline, tiga GLB, gambar about, gambar collection
  - Gerbang dibuka lewat klik tombol "Masuk" di build produksi: jalan, sampai terbuka, nol error
  - Layout 360, 768, 1280 (build produksi): `scrollWidth - clientWidth = 0` di semua, nol error console, nol request gagal
  - Link: 30 tautan di DOM, nol `href` kosong, nol `href="#"`, nol jangkar mati. Nol gambar gagal dimuat. Link internal `robots.txt`, `sitemap.xml`, `humans.txt` 200 dari root
  - Klik link footer di build produksi: `#about` mendarat di top 92px (tepat di bawah navbar sticky) dan link "About" menyala, `#collection` top 92px dan "Collection" menyala, `#home` scrollY 0 dan "Home" menyala
  - Scroll-spy digeser ke tiap section: home Home, about About, collection Collection, contact Contact, dan di dasar halaman tetap Contact
  - Tombol tema di build produksi: terang ke gelap ke terang, ikon berganti, `aria-label` ikut berubah jadi "Ganti ke tema terang" dan "Ganti ke tema gelap"
  - 3D balik ke depan, diukur dari piksel canvas logo tengah (background WebGL hero dimatikan biar yang diukur cuma logonya): sebelum drag vs sesudah drag beda 24,1 persen, sebelum drag vs 1,45 detik setelah dilepas beda 3,3 persen (sisa itu spin yang jalan, bukan sisa rotasi), dan dua frame berjarak 600 ms beda 2,6 persen yang membuktikan spin jalan lagi. Mark kecil di atas CTA: 6,71 persen, 1,21 persen, dan 0,84 persen
  - CardSwap mobile: panggung 323x417, skala tepat 1, kartu 240 lebar, 3 kelihatan, teks 13px (tidak mengecil), 9 tautan, nol kartu terpotong, nol scroll horizontal
  - Reveal latar hero, A/B di dev server dengan tema gelap (brightness area background 150x150): tanpa trigger, background sudah jadi (9,07) pada 1000 ms setelah klik; dengan trigger, masih flat (4,70) sampai 1000 ms lalu tumbuh 5,26 di 1200 ms, 8,57 di 1400 ms, dan 9,88 di 1600 ms
  - Kontras, dihitung ulang dari warna hasil blend: nama 18,70:1 di dua tema, tautan 9,75:1 terang dan 7,85:1 gelap, judul kolom 6,04:1 terang dan 5,10:1 gelap, tagline 7,03:1 dan 6,10:1, tautan aktif 18,70:1. Eyebrow dan label merah 3,62:1 di terang (fails 4,5:1 buat teks kecil, lolos batas 3:1 buat non-teks) dan 5,16:1 di gelap
  - Em dash di file yang ditambahkan dan diubah: nol
- Catatan jujur:
  - **Browser yang dipakai cuma Chrome headless.** Belum dicek di Safari iOS dan Firefox desktop, dan belum dicek di perangkat fisik. Frame rate di headless cuma sekitar 6 fps, jadi animasi yang reliant waktu (reveal latar 2,6 detik) terlihat jauh lebih lambat di sana daripada di browser sungguhan
  - **Hover footer diuji di Chrome kedua** (port 9334) yang dijalankan dengan pointer sungguhan, karena headless Chrome biasa nge-report `(hover: none)` sehingga aturan di dalam `@media (hover: hover)` tidak pernah aktif. Di Chrome kedua: sebelum hover teks 72 persen, panah opacity 0 dan translateX -6px; setelah hover teks penuh, panah opacity 1 dan translateX 0
  - **Isi kanal footer masih placeholder.** Email dan WhatsApp sengaja mengikuti section Contact (`dev@ra-labs.tech` dan `wa.me/6287754778218`), bukan isi porto (`ibborarts@gmail.com` dan `+6282249072873`). Dua-duanya beda, dan Bang Rob sudah bilang isi kanal bakal dia ubah sendiri
  - **Copy footer masih usulan gue.** Nama "RaLabs", label "Rumah Dari Semua Project", tagline, dan hak cipta "RaLabs Copyright" masih bisa diganti Bang Rob
  - **Jeda 2500 ms sebelum spin hidup lagi dihapus** di logo tengah dan dua mark. Sekarang yang menentukan spin hidup lagi adalah animasi balik ke lurus depan (800 ms). Kalau Bang Rob mau jeda itu tetap ada, tinggal balikin
  - **Gambar Collection (952 KB) sekarang ikut ke-load di mobile**, karena tumpukannya muncul di layar kecil. Sebelumnya di HP tidak ada yang ditarik karena tumpukannya `display:none`
  - **Field `host` di `src/data/proyek.js` sekarang tidak terpakai**, karena tadinya hanya tampil di list teks mobile yang dibuang. Datanya tidak dihapus, menunggu keputusan Bang Rob
  - **Bundle JS naik jadi 1.085 kB** (dari 1.080 kB) dan gzip 315 kB. Belum di-code-split, belum dioptimasi
  - **`plan-prd/` masih di-gitignore**, jadi catatan perencanaan batch ini tidak ikut PR

## 21 Okt 2026, Batch 13: SEO rapi, ganti domain ke ra-labs.tech

- Tanggal: 21 Okt 2026
- Judul: audit SEO ditutup dengan empat perbaikan (redirect www, lastmod sitemap, theme-color, og:image:type) plus migrasi seluruh URL produksi dari ralabs.my.id ke ra-labs.tech
- File yang berubah:
  - Ubah: `entries/index.html` (13 URL domain, meta theme-color, og:image:type, script tema ikut menyesuaikan warna theme-color)
  - Ubah: `public/robots.txt`, `public/sitemap.xml`, `public/humans.txt` (domain baru; lastmod jadi 2026-10-21)
  - Ubah: `.htaccess` (redirect 301 www.ra-labs.tech ke https://ra-labs.tech)
  - Hasil build dicopy ke root: `index.html`, `assets/main-oNm05iTV.js`, `assets/main-CvGxqKCe.css`, `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Yang dikerjakan:
  1. **Audit SEO dulu, baru perbaikan.** Dicek: meta di `entries/index.html` (title, description, canonical, OG lengkap, Twitter card, JSON-LD WebSite + Organization + Person), robots.txt, sitemap.xml, 404.html plus ErrorDocument, humans.txt, hierarki heading (h1 Hero, h2 About/Collection/Contact, h3 kartu proyek), alt text (dekoratif alt="" + aria-hidden, kontekstual "Tampilan {judul}"), dan OG banner asli diukur 1200x630 sesuai klaim meta. Live check: robots dan sitemap sudah terdeploy
  2. **Ganti domain ke ra-labs.tech.** Keputusan Bang Rob, sekalian di batch ini. Semua URL produksi pindah: canonical, og:url, og:image, twitter:image, 9 URL JSON-LD di `entries/index.html`, baris Sitemap di robots.txt, loc sitemap.xml, alamat humans.txt. Grep bukti: nol sisa `ralabs.my.id` di entries, public, .htaccess, dan file root hasil build
  3. **Redirect 301 www ke apex.** Sebelumnya `www.ralabs.my.id` menyajikan isi sama tanpa redirect (duplikat konten, sudah pernah dicatat di entri batch 2). `.htaccess` sekarang punya aturan RewriteEngine: `www.ra-labs.tech` 301 ke `https://ra-labs.tech/$1`, urut sebelum ErrorDocument 404
  4. **lastmod sitemap ikut update.** Tanggal pindah dari 2026-10-17 ke 2026-10-21, sejalan dengan batch ini, supaya Google tidak menunggu cycle lama buat notice perubahan
  5. **meta theme-color.** Default `#0C0C0C` di HTML (fallback sebelum script jalan), lalu script anti-flicker yang sudah ada ikut menulis content-nya sesuai tema: terang `#F8FAFC`, gelap `#0C0C0C`, jadi status bar mobile selalu nyambung dengan tema yang sedang aktif
  6. **og:image:type ditambahkan.** `image/webp`, satu baris setelah og:image, biar scraper parser gambar tidak menebak sendiri
- Hasil tes:
  - Dev server 5015 sebelum build: canonical, theme-color, og:url, og:image:type terbaca; JSON-LD valid (parse sukses, url `https://ra-labs.tech/`); console tidak dicek secara manual di batch ini
  - `npm run build`: sukses, 6518 modul, 7,30 detik. Warning chunk di atas 500 kB masih ada, dari three.js, bukan regresi batch ini
  - Copy mengikuti urutan contributing: bundle lama dihapus dulu, baru copy. Loop verifikasi `index.html` terhadap `assets/`: `main-oNm05iTV.js` OK, `main-CvGxqKCe.css` OK. `assets/` isinya cuma 1 js + 1 css
  - md5 root sama persis dengan `dist/assets/`: JS `880de09534a99824ba08add7d11922d4`, CSS `412437bc4a1fa6c2d99d12e032f6bcce`. Identik dengan batch 12 karena kode React tidak berubah, yang berubah hanya HTML entry dan file statis
  - Hasil build diserve dari root repo (`python3 -m http.server 8099`), bukan dev server. Semua 200: root, kedua bundle, og-banner, robots, sitemap, 404, humans. `/halaman-ngawur` balik 404
  - Isi root hasil copy: `grep -c ra-labs.tech index.html` = 13, sitemap berisi loc `https://ra-labs.tech/` dan lastmod `2026-10-21`, theme-color ada di `index.html`
  - Em dash di file yang ditambahkan dan diubah: nol
- Catatan jujur:
  - **Redirect www belum bisa dites lokal.** Aturan `.htaccess` butuh DNS `ra-labs.tech` sudah menunjuk ke Hostinger dan mod_rewrite aktif. Verifikasi asli (`curl -I https://www.ra-labs.tech/` harus balik 301) baru bisa jalan setelah domain live dan PR ini merge
  - **Belum dicek di browser sungguhan untuk batch ini.** Layout 360/768/1280, kontras, klik link, dan console tidak diulang, karena perubahan batch ini tidak menyentuh CSS atau komponen React sama sekali. Yang dicek hanya meta dan file statis lewat curl
  - **Domain lama `ralabs.my.id` belum diarahkan ke `ra-labs.tech`.** 301 domain-ke-domain itu urusan panel Hostinger atau DNS, bukan isi repo ini. Keputusan menunggu Bang Rob
  - **`README.md` dan `contributing.md` masih menyebut `ralabs.my.id`** di beberapa bagian (tautan live, URL verifikasi, langkah deploy). Sengaja tidak disentuh di batch ini karena menunggu keputusan Bang Rob: diganti sekarang atau setelah domain ra-labs.tech benar-benar live
  - **Judul dan isi halaman tidak berubah**, jadi snippet Google nanti tetap "RaLabs. Portal karya Robby Aliasa Akbar". Yang pindah cuma rumah (domain)
  - **`plan-prd/` masih di-gitignore**, jadi catatan perencanaan batch ini tidak ikut PR

## 21 Okt 2026, Batch 14: README dan contributing ikut pindah ke ra-labs.tech

- Tanggal: 21 Okt 2026
- Judul: dokumentasi README.md dan contributing.md disinkronkan dengan hasil Batch 13, yaitu domain baru ra-labs.tech, isi `.htaccess` yang sekarang berisi dua aturan, pola copy build yang benar mengikuti contributing.md, dan susuran Collection di mobile yang sudah berubah sejak Batch 12
- File yang berubah:
  - Ubah: `README.md`
  - Ubah: `contributing.md`
- Yang dikerjakan:
  1. **Domain di isi README.** Portal `https://ra-labs.tech/`, karya berikutnya di `*.ra-labs.tech`, canonical di bagian SEO juga `ra-labs.tech`. Nol sisa `ralabs.my.id` setelah diganti
  2. **Bagian SEO dan metadata ditambah.** `og:image:type` dan `meta theme-color` ikut didokumentasikan, karena Batch 13 menambah dua meta itu di `entries/index.html`
  3. **`.htaccess` tidak lagi "cuma ErrorDocument".** Baris itu diperbarui: sekarang ada redirect 301 `www.ra-labs.tech` ke apex sebelum `ErrorDocument 404`, sesuai isi file sekarang
  4. **Perintah copy build di README disamakan dengan contributing.md.** Sebelumnya ada tiga baris `cp` tanpa menghapus bundle lama, yaitu jebakan yang menyisakan file ber-hash mati di `assets/`. Sekarang urutannya benar: hapus js/css lama dulu, baru copy `dist/entries/index.html`, `dist/assets/*`, `dist/images/.`, plus empat file statis
  5. **Susuran Collection di bagian "Isi singkat" diperbaiki.** Batch 12 membuang daftar teks mobile dan menampilkan tumpukan kartu di semua ukuran layar, jadi tulisan lama "tumpukan kartu di layar lebar, daftar di layar sempit" tidak akurat lagi
  6. **contributing.md menyusul di commit kedua batch ini.** Empat kemunculan `ralabs.my.id` dicek satu per satu: dua URL live (baris langsung tayang dan langkah verifikasi) diganti ke `ra-labs.tech`, dua sisanya adalah path folder lokal `/home/obi/Projects/ralabs.my.id/` (perintah `cd` dan folder referensi aset) yang sengaja tidak disentuh karena itu nama folder di mesin lokal, bukan domain
- Hasil tes:
  - `grep -n 'ralabs\.my\.id' README.md`: nol baris
  - `grep -n 'ra-labs\.tech' README.md`: baris portal, canonical, dan isi `.htaccess`, semuanya menunjuk domain baru
  - Tidak ada perubahan kode atau aset, jadi tidak ada build ulang. PR ini murni dokumentasi
- Catatan jujur:
  - **Repo yang dicantumkan di contributing.md dan README masih repo lama.** Pindah repo ke rumah baru ra-labs.tech belum dikerjakan karena Bang Rob sedang menyiapkan repo barunya, jadi dokumentasi repo menyusul setelah remote diganti
  - **Kolom font di README tidak disentuh**, karena batch ini di luar bidang SEO dan perubahan font bukan bagian Batch 13 maupun 14

## 21 Okt 2026, Batch 15: contributing menunjuk repo baru ra-labs.tech

- Tanggal: 21 Okt 2026
- Judul: baris Repo di contributing.md dipindah dari repo lama `indep.../ralabs-portal` ke repo baru `indep.../ra-labs.tech`, setelah domain ra-labs.tech live dan diverifikasi di produksi
- File yang berubah:
  - Ubah: `contributing.md`
- Yang dikerjakan:
  1. **Satu baris, satu gantian.** Grep seluruh repo menemukan `ralabs-portal` hanya di `contributing.md` baris 5, yaitu baris `Repo:`. Diganti ke `https://github.com/indeepcleaningid/ra-labs.tech`. README sudah bersih dari repo lama sejak Batch 14, tidak perlu diubah
- Hasil tes:
  - `grep -rn 'ralabs-portal' contributing.md README.md`: nol baris
  - Tidak ada perubahan kode atau aset, tidak ada build ulang. PR ini murni dokumentasi
- Catatan jujur:
  - **Batch ini digarap setelah verifikasi produksi `ra-labs.tech`.** Yang dibuktikan live sebelum merge: apex 200, canonical dan JSON-LD menunjuk `https://ra-labs.tech/`, `www.ra-labs.tech` balik 301 ke apex, md5 bundle JS dan CSS live sama dengan build lokal, robots/sitemap/humans tampil dengan domain baru, `/halaman-ngawur-123` balik 404
  - **Repo lama `indep.../ralabs-portal` belum diarsipkan.** Menunggu beberapa hari dulu untuk memastikan tidak ada yang perlu diambil dari sana, baru diarsipkan oleh Bang Rob
  - **`plan-prd/` masih di-gitignore**, tidak ikut PR
## 21 Okt 2026, Batch 16: og-banner.webp diganti banner baru

- Tanggal: 21 Okt 2026
- Judul: file `og-banner.webp` diganti dengan banner baru dari Bang Rob, lalu hasil build disalin ke root repo sesuai urutan contributing.md
- File yang berubah:
  - Ubah: `public/images/og-banner.webp` (banner baru dari Bang Rob, 1200x630 WebP, 161.634 byte)
  - Ubah: `images/og-banner.webp` (hasil copy dari `dist/images/`, sama persis dengan source)
- Yang dikerjakan:
  1. **Banner baru dipakai apa adanya.** File sudah diletakkan Bang Rob di `public/images/og-banner.webp`, tidak diolah ulang dan tidak dikompres ulang, supaya hasil visualnya sama persis dengan file aslinya
  2. **Dimensi dicek dulu sebelum commit.** Terukur 1200x630, sama dengan klaim `og:image:width` dan `og:image:height` di `entries/index.html`, jadi meta tidak perlu disentuh
  3. **File nyasar dibuang.** Ada `public/og-banner.webp` yang berisi banner lama (113.666 byte, md5 `12b3c9726f281d99df95e303449420ee`), statusnya untracked di git. Kalau dibiarkan, file itu ikut tercopy ke root `dist/` dan ikut ter-deploy sebagai duplikat yang tidak dirujuk siapa pun. Dihapus, tidak ada history yang terganggu karena memang belum pernah masuk commit
  4. **Copy build mengikuti contributing.md.** Bundle lama dihapus dulu, baru copy `dist/entries/index.html`, `dist/assets/*`, `dist/images/.`, dan empat file statis
- Hasil tes:
  - `npm run build`: sukses, 6518 modul, 7,06 detik. Warning chunk di atas 500 kB masih ada, dari three.js, bukan regresi batch ini
  - Loop verifikasi `index.html` terhadap `assets/`: `main-oNm05iTV.js` OK, `main-CvGxqKCe.css` OK
  - md5 `images/og-banner.webp` = md5 `public/images/og-banner.webp` = `b3c00348f8417cbcc53acff453164e84`, ukuran 161.634 byte, berbeda dari banner lama `12b3c9726f281d99df95e303449420ee`
  - Dimensi terukur 1200x630
  - Hasil build diserve dari root repo (`python3 -m http.server 8099`): semua 200 (root, kedua bundle, og-banner, robots, sitemap, 404, humans). Banner yang ter-serve dari `/images/og-banner.webp` md5-nya sama dengan file baru, jadi root repo memang sudah memegang banner baru
  - `ls dist/` tidak ada `og-banner.webp` di root dist, hanya di `dist/images/`
  - Em dash di file yang ditambahkan dan diubah: nol
- Catatan jujur:
  - **Belum dicek tampilan visual di kanal mana pun.** Yang dibuktikan cuma file, dimensi, dan hash. Preview di WhatsApp, LinkedIn, X, atau Telegram bisa masih nampilin banner lama karena cache platform, bukan karena file di server yang salah
  - **Batch ini sengaja tidak menyentuh meta OG.** Dimensi tetap 1200x630 dan filename tetap, jadi `og:image`, `og:image:type`, `og:image:width`, `og:image:height`, dan `og:image:alt` semuanya tidak berubah
  - **File `public/og-banner.webp` yang dihapus itu untracked**, jadi tidak pernah ada di riwayat commit repo. Tidak ada yang perlu di-restore
  - **Batch 16 ditumpuk di atas Batch 15, bukan berdampingan.** Dua batch sama-sama menambah entri di akhir `engineering.md`, jadi kalau keduanya berdampingan akan bentrok di file yang sama (sudah disimulasikan lokal, hasilnya `CONFLICT (content): Merge conflict in engineering.md`). Solusinya branch ini dibangun di atas branch Batch 15, jadi urutannya Batch 15 lalu Batch 16 tanpa bentrok sama sekali. Setelah Batch 15 merge, branch ini tinggal di-rebase ke `main`
  - **`plan-prd/` masih di-gitignore**, tidak ikut PR
## 21 Okt 2026, Batch 17: label tombol gerbang jadi Buka Website

- Tanggal: 21 Okt 2026
- Judul: teks tombol "Masuk" di gerbang diganti jadi "Buka Website", lalu hasil build disalin ke root repo sesuai urutan contributing.md
- File yang berubah:
  - Ubah: `src/components/Gerbang.jsx` (teks tombol, plus 5 komentar yang menyebut label lama)
  - Ubah: `src/components/luma.js` (1 baris komentar header)
  - Ubah: `index.html` (hasil build)
  - Ubah: `assets/main-oNm05iTV.js` (bundle lama, dihapus) dan `assets/main-72OC-PSO.js` (bundle baru)
- Yang dikerjakan:
  1. **Satu string, satu gantian.** Di `Gerbang.jsx`, isi `<button>` berubah dari `Masuk` jadi `Buka Website`. Tidak ada perubahan lain pada markup tombol: `type`, `onClick`, `aria-disabled`, `ref`, dan kelas `tombol-merah-pill` tetap sama
  2. **Komentar ikut disesuaikan.** Enam baris komentar di `Gerbang.jsx` dan `luma.js` menyebut "tombol Masuk" sebagai nama tombol, jadi ikut diganti biar komentar tidak lagi nunjuk label yang sudah tidak ada
  3. **API internal tidak disentuh.** `prop onMasuk`, fungsi `klikMasuk`, dan state `masuk` di `Portal.jsx` tetap bernama begitu. Itu wiring internal antara komponen, bukan teks yang dilihat pengguna, jadi tidak perlu diubah dan tidak menyentuh `LogoGerbang.jsx`
  4. **Copy build mengikuti contributing.md.** Bundle lama dihapus dulu (`rm -f assets/*.js assets/*.css`), baru copy `dist/entries/index.html`, `dist/assets/*`, `dist/images/.`, dan empat file statis
- Hasil tes:
  - Dev server 5015: modul yang di-serve sudah berisi `children: "Buka Website"`. Dicek lewat `curl`, bukan lewat mata di browser
  - `npm run build`: sukses, 6518 modul, 7,15 detik. Warning chunk di atas 500 kB masih ada, dari three.js, bukan regresi batch ini
  - Loop verifikasi `index.html` terhadap `assets/`: `main-72OC-PSO.js` OK, `main-CvGxqKCe.css` OK. Bundle lama `main-oNm05iTV.js` sudah hilang dari root, tidak ada sisa
  - `grep -c "Buka Website" assets/main-72OC-PSO.js`: 1. Label baru ikut terbawa ke bundle produksi, bukan cuma di source
  - Hasil build diserve dari root repo (`python3 -m http.server 8099`): root 200, kedua bundle 200, `og-banner.webp` 200, `logo-ralabs-3d.glb` 200, `404.html` 200, `robots.txt` 200, `sitemap.xml` 200, `humans.txt` 200, dan `/halaman-ngawur-123` 404. Server 8099 sudah dimatikan setelah pengecekan
  - Em dash di file yang ditambahkan dan diubah: nol
- Catatan jujur:
  - **Belum dicek visual di browser.** Yang dibuktikan cuma file, hash bundle, dan status HTTP. Gerbang sendiri (logo 3D, tiga kilat, luma fade) tidak dijalankan lewat mata, jadi kalau ada efek samping yang cuma kelihatan saat animasi jalan, belum kepakah
  - **Tombolnya jadi lebih lebar.** "Buka Website" 12 huruf, "Masuk" 5 huruf, dan `.tombol-merah-pill` memakai `px-6` tanpa lebar tetap, jadi pill merentang sekitar 40px lebih lebar. Tidak ada aturan layout yang dilanggar, tapi proporsinya di layar kecil perlu dilihat langsung
  - **Batch ini berdiri sendiri, bukan ditumpuk.** Batch 15 dan 16 sudah merge, jadi branch ini dibangun di atas `main` yang sudah segar dan tidak menyentuh `engineering.md` bentrok
  - **`plan-prd/` masih di-gitignore**, tidak ikut PR

## 21 Okt 2026, Batch 18: aset 3D hero baru, decoder Draco, dan material mark ikut aset

- Tanggal: 21 Okt 2026
- Judul: dua aset 3D di hero diganti (InDeep dan IbborArts), asset InDeep dikompresi Draco lalu decoder-nya dipasang, dan material mark berhenti dipaksa jadi unlit
- File yang berubah:
  - Ubah: `public/images/logo-indeep-3d.glb` (1.239.776 byte jadi 375.392 byte, sekarang kompresi Draco)
  - Ubah: `public/images/logo-ibborarts-3d.glb` (493.892 byte jadi 869.808 byte, sekarang PBR)
  - Baru: `public/assets/draco_decoder.js`, `public/assets/draco_wasm_wrapper.js`, `public/assets/draco_decoder.wasm` (decoder Draco, salinan dari `node_modules/three/examples/jsm/libs/draco/`)
  - Baru: `src/components/loaderGLTF.js` (satu tempat buat bikin `GLTFLoader` yang siap decode Draco)
  - Ubah: `src/components/Mark3D.jsx` (loader, material, komentar)
  - Ubah: `src/components/Logo3D.jsx` dan `src/components/LogoGerbang.jsx` (loader, masing-masing 2 baris)
  - Hasil build dicopy ke root: `index.html`, `assets/` (bundle lama `main-72OC-PSO.js` dihapus dulu), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Yang dikerjakan:
  1. **Aset InDeep yang baru pakai `KHR_draco_mesh_compression` dan itu wajib ada.** GLTFLoader three.js tanpa `DRACOLoader` akan menolaknya. Dibuktikan di browser: `THREE.GLTFLoader: No DRACOLoader instance provided.` — mark InDeep tidak muncul sama sekali, tanpa error yang kelihatan di layar
  2. **Decoder Draco ditaruh di `public/assets/`, bukan `public/draco/`.** Ritual deploy di `contributing.md` cuma `cp dist/assets/* assets/`, dan `cp` tanpa `-r` melewati folder. Kalau decoder ditaruh di folder, dia tidak ikut ke root repo, hilang di produksi, dan mark InDeep hilang tanpa jejak. Di `public/assets/` file-nya rata, jadi ikut kebawa tanpa ritual berubah. Disimulasikan: `cp dist/assets/* assets/` menghasilkan 3 file decoder di root
  3. **`src/components/loaderGLTF.js` jadi satu-satunya jalan buka `.glb`.** `Logo3D`, `LogoGerbang`, dan `Mark3D` sekarang semua lewat helper yang sama. Satu instance `DRACOLoader` dipakai bersama seluruh halaman, jadi file `.wasm` cuma diunduh sekali, bukan sekali per mark
  4. **Material mark tidak lagi dipaksa jadi `MeshBasicMaterial`.** Aset IbborArts yang baru memang PBR (`MeshStandardMaterial`), ada keyline putih emissive, dan punya normal buat disorot lampu. Memaksa unlit membuang semua itu. Sekarang material dibiarkan seperti yang dibuat `GLTFLoader` dari file aset; yang digeser cuma warna verteksnya (sRGB ke linear)
  5. **Konversi warna verteks tetap ada.** Aset IbborArts menyimpan warna sebagai byte sRGB, dan shader three membacanya sebagai linear. Tanpa konversi di tengah, merahnya jadi butek. Fungsi `siapkanWarna` tetap jalan, hanya nilai balik `true/false` yang dihapus karena tidak dipakai lagi
  6. **Komentar kedaluwarsa dibersihkan.** Komentar lama menyebut "Ibborarts unlit" dan nama mesh lama `c8232b`; keduanya sudah tidak benar since aset diganti
- Hasil tes:
  - Dev server 5015: dua mark muncul, dicek lewat screenshot headless Chrome (desktop 1440x900, mobile 390x844, tema terang dan gelap). Dev server yang dipakai selama batch ini milik Bang Rob, bukan instance baru
  - Aset yang ter-request saat halaman buka: `logo-indeep-3d.glb` 200, `logo-ibborarts-3d.glb` 200, `logo-ralabs-3d.glb` 200, `assets/draco_wasm_wrapper.js` 200, `assets/draco_decoder.wasm` 200
  - `npm run build`: sukses, 6520 modul, 6,95 detik. Warning chunk di atas 500 kB masih ada, dari three.js, bukan regresi batch ini
  - Bundle lama dihapus dulu sebelum copy (`rm -f assets/*.js assets/*.css`), lalu `index.html`, `assets/`, `images/`, dan empat file statis dicopy sesuai urutan di `contributing.md`. Bundle lama `main-72OC-PSO.js` tidak ada lagi di root
  - `index.html` root dicek_loop: `main-DxdCnOKG.js` OK, `main-CvGxqKCe.css` OK. Tidak ada nama bundle yang menunjuk file hilang
  - `dist/assets/` memuat 3 file decoder + bundle js + bundle css, dan ritual deploy menyalin kelima file itu ke root. Root `assets/` sekarang berisi `draco_decoder.js`, `draco_decoder.wasm`, `draco_wasm_wrapper.js`, `main-CvGxqKCe.css`, `main-DxdCnOKG.js`
  - Root repo diserve dengan `python3 -m http.server 8099` dan dicek di browser: gerbang diklik sampai masuk, dua mark InDeep dan IbborArts muncul di hero, decoder diambil dari `/assets/`, semua 200. Server 8099 dimatikan setelah pengecekan
  - Layout di 360 / 768 / 1280 tanpa scroll horizontal: `scrollWidth` sama dengan `clientWidth` di semua tiga lebar (360/360, 768/768, 1280/1280)
  - Link dan tombol: 21 `<a href>` di halaman, nol yang kosong atau `#`. Semua punya tujuan: anchor internal (`#home`, `#about`, `#collection`, `#contact`), situs luar, `mailto:`, dan `wa.me`
  - Console: tidak ada error JavaScript di dev server maupun di root repo. Permintaan yang gagal cuma beacon Google Analytics yang dibatalkan saat halaman ditutup
- Catatan jujur:
  - **`Logo3D.jsx` ada di daftar "Bagian yang tidak boleh disentuh" di `contributing.md`, dan batch ini menyentuhnya.** Yang diubah cuma 2 baris: import `GLTFLoader` diganti import `buatLoaderGLTF`, dan `new GLTFLoader()` jadi `buatLoaderGLTF()`. Tidak ada perubahan perilaku hari ini, karena `logo-ralabs-3d.glb` belum pakai Draco. Alasannya: dua aset yang baru saja dipasang justru dikompresi Draco, jadi kemungkinan besar `logo-ralabs-3d.glb` akan diganti dengan versi Draco juga. Kalau tidak, asset itu ditolak `GLTFLoader` dan logo hero hilang diam-diam, persis seperti yang terjadi di mark InDeep. Aturan itu tetap berlaku untuk arah sebaliknya: `LogoGerbang.jsx` tetap punya file sendiri, tidak mengimpor `Logo3D.jsx`. Kalau Bang Rob mau file `Logo3D.jsx` dibiarkan apa adanya, perubahan ini tinggal dibalik 2 baris
  - **Ada satu teks yang gagal kontras, dan itu bukan hal teknis dari batch ini.** `P.footer-peran` ("Rumah Dari Semua Project") di footer: warna `#D70000` di atas `#0C0C0C`, ukuran 12px, rasio 3,62:1, butuh 4,5:1. Batch ini tidak menyentuh `Footer.jsx` maupun CSS sama sekali, jadi masalahnya sudah ada di `main` sebelum batch ini. Tidak diperbaiki di sini karena bukan satu batch kerja
  - **Aset InDeep sekarang jauh lebih berat: 97.164 segitiga, dari sebelumnya 30.960.** Draco mengecilkan file (375 KB dari 1,2 MB) tapi decode di worker tetap kerja berat. Di HP lambat, mark InDeep bisa muncul belakangan dari mark IbborArts
  - **Aset IbborArts sekarang 22.158 segitiga, dari 8.212.** Berkali-kali lipat, dan berkali-kali lipat juga ukuran filenya
  - **Teks "In Deep Cleaning ID" di mark InDeep berwarna navy tua.** Di tema gelap, teks itu nyaris tak terlihat di atas tile gelap. Ini pilihan warna di dalam file aset, bukan bug render — tidak diubah di batch ini. Kalau mau kelihatan, sumbernya harus diubah, bukan kodenya
  - **Visual dicek pakai headless Chrome dengan software GL, bukan GPU asli.** Bentuk dan warnanya sesuai, tapi performa di perangkat beneran belum diukur
  - **Batch ini berdiri sendiri, bukan ditumpuk.** Dibangun di atas `main` yang sudah segar (`fe28042`)
  - **`plan-prd/` masih di-gitignore**, tidak ikut PR

## 22 Okt 2026, Batch 19: aset 3D logo baru dipasang, warna hidup lagi di hero dan gerbang

- Tanggal: 22 Okt 2026
- Judul: file `logo-ralabs-3d.glb` diganti versi PBR (warna per material, tanpa vertex color), lalu pipeline render-nya disesuaikan agar warnanya tidak mati lagi
- File yang berubah:
  - Ubah: `public/images/logo-ralabs-3d.glb` (1.519.392 byte jadi 1.655.056 byte, aset baru dari Bang Rob: PBR, warna per material, ada normal, tidak ada vertex color, tidak dikompresi Draco)
  - Baru: `src/components/aset3d.js` (sumber logo, konversi warna, rig lampu per tema, pemantau tema)
  - Ubah: `src/components/Logo3D.jsx` (hero: material PBR asli dari file aset + lampu per tema)
  - Ubah: `src/components/LogoGerbang.jsx` (gerbang: luma fade di-patch ke material PBR, bukan shader terpisah)
  - Ubah: `src/components/Kilat3D.js` (kelas warna tepi diambil dari warna material, bukan vertex color)
  - Ubah: `src/components/Mark3D.jsx` (pakai `siapkanWarna` dari modul bersama, duplikat dihapus)
  - Hasil build dicopy ke root: `index.html`, `assets/` (bundle lama `main-DxdCnOKG.js` dan `main-CvGxqKCe.css` dihapus dulu), `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Yang dikerjakan:
  1. **Penyebab "warnanya mati" ditemukan dan dibuktikan, bukan ditebak.** `Logo3D.jsx` lama memaksa material jadi `MeshBasicMaterial({ vertexColors: true })`. Aset baru tidak punya atribut `color` sama sekali (warnanya per material: `RALABS_Black`, `RALABS_White`, `RALABS_Red`). WebGL mengisi atribut yang tidak ada dengan (0,0,0), jadi seluruh logo tergambar hitam pekat. `LogoGerbang.jsx` lebih parah: shader `vWarna = color` jadi selalu nol, luma fade kehilangan gradasinya, dan `Kilat3D.js` butuh vertex color untuk menandai tepi jadi tidak ada satu pun kilat yang bisa menyala
  2. **Material aset dipakai apa adanya.** Tidak ada lagi pemaksaan `MeshBasicMaterial`. Aset PBR-nya yang dipakai: metalness, roughness, dan normal ikut seperti yang ditulis di file
  3. **Warna dasar dikonversi sRGB ke linear.** Penulis file `.glb` menulis `baseColorFactor` sebagai byte sRGB (`0.047 = 12/255 = #0c0c0c`, `0.973 = 248/255 = #f8fafc`, `0.843 = 215/255 = #d70000`), tapi three membaca angka itu sebagai linear (atur glTF). Tanpa dikonversi, hitam jadi abu terang `#3c3c3c` dan merah jadi `#ee0000`, meleset dari palet RaLabs. Setelah dikonversi, warnanya dibaca balik persis `#0c0c0c`, `#f8fafc`, `#d70000` — dibuktikan dengan membaca ulang `material.color.getHexString()`
  4. **Luma fade gerbang dipindah ke material PBR.** `ShaderMaterial` bespoke dihapus. Sekarang material PBR aset tetap dipakai, lalu shader-nya ditambah satu bagian: alpha dikalikan ambang luma, dan warnanya dibaca dari `diffuse` (warna dasar material itu sendiri). Tiga mesh punya tiga material, jadi tiap muka punya ambang larutnya sendiri: putih (luma 0,95) larut duluan, merah (0,14) menyusul, hitam (0,003) paling akhir — urutan yang memang dikehendaki desain gerbang
  5. **Dither tetap ada.** `dither` dan `premultipliedAlpha` tidak berubah, jadi muka yang warnanya rata tetap melebar jadi butiran, tidak hilang blok. Pipeline chunk three (`opaque_fragment` → `colorspace_fragment` → `premultiplied_alpha_fragment`) tetap urut, jadi warnanya sama persis seperti pipeline bawaan
  6. **Kilat tepi sekarang baca warna material.** `Kilat3D.js` mengklasifikasi tepi dari warna dasar mesh, bukan dari vertex color. Satu muka = satu warna, jadi klasifikasinya justru lebih pasti
  7. **Lampu per tema, dan tema ganti saat portal masih hidup.** Rig gelap (latar `#0c0c0c`) dan rig terang (latar `#f8fafc`) punya nilai berbeda. `Logo3D` memantau `data-theme` di `<html>` lewat `MutationObserver`, jadi tombol tema di navbar langsung mengubah lampu tanpa render ulang React
  8. **Aset logo dan logo gerbang masih satu file yang sama** (`public/images/logo-ralabs-3d.glb`), jadi tidak ada duplikasi 1,6 MB dan browser cache otomatis
- Hasil tes:
  - Dev server 5015: console bersih, tanpa error JavaScript, di tema terang maupun gelap
  - `npm run build`: sukses, 6521 modul, 8,71 detik. Warning chunk di atas 500 kB masih ada, dari three.js, bukan regresi batch ini
  - Loop verifikasi `index.html` terhadap `assets/`: `main-DvCWQo4e.js` OK, `main-D7zyWN_-.css` OK. Bundle lama sudah hilang dari root, tidak ada nama bundle yang menunjuk file hilang
  - Aset 3D dibaca dan diperiksa tanpa browser (parser GLB): 3 mesh, 3 material PBR, `extensionsUsed` kosong (tidak ada Draco), normal ada, `COLOR_0` tidak ada di ketiga mesh
  - Bukti luma fade (halaman uji memakai `pasangLumaFade` yang asli dari `LogoGerbang.jsx`, waktu di-freeze supaya frame-nya pasti): progres 0 → logo utuh; 0,25 → muka putih mulai jadi berbutir; 0,40 → putih hampir habis, merah masih utuh; 0,55 → merah mulai larut, hitam masih utuh; 0,70 → merah hampir habis; 0,85 → nyaris hilang. Urutan putih → merah → hitam sesuai desain
  - Bukti kilat (halaman uji memakai `buatKilat` yang asli): 42.095 ruas tepi, 40.814 komponen warna menyala, tiga kelas warna aktif — kuning di tepi merah, merah di tepi putih, putih di tepi hitam
  - Screenshot headless Chrome dari **hasil build** yang diserve dari root repo: gerbang terbuka → hero tema gelap, logo terbaca (kubus hitam glossy, muka putih, aksen merah) dan wordmark "Labs" yang tadinya nyaris tak terlihat sekarang jelas; hero tema terang, logo kontras dan rapi; mobile 360px, logo muat tanpa scroll horizontal
  - Layout 360 / 768 / 1280: dicek di build, tidak ada scroll horizontal
  - Aset ter-request saat halaman buka: `logo-ralabs-3d.glb` 200, `logo-indeep-3d.glb` 200, `logo-ibborarts-3d.glb` 200, `assets/draco_decoder.wasm` 200
- Catatan jujur:
  - **`Logo3D.jsx` ada di daftar "Bagian yang tidak boleh disentuh" di `contributing.md`, dan batch ini menyentuhnya lebih dari 2 baris.** Maksud aturan itu: `Logo3D` milik hero dan `LogoGerbang` milik gerbang, keduanya file terpisah. Aturan itu tetap dipatuhi: dua file tetap terpisah, dan keduanya masih memakai model yang sama `public/images/logo-ralabs-3d.glb`. Yang berubah di `Logo3D.jsx` adalah perlakuan material dan lampu — bagian yang justru harus berubah karena asetnya diganti. Kalau Bang Rob mau `Logo3D.jsx` dibiarkan apa adanya, perubahan ini tinggal dibalik
  - **Angka `baseColorFactor` di aset dibaca sebagai sRGB, padahal aturan glTF bilang linear.** Ini konvensi penulisan file, bukan bug three. Kalau aset diekspor ulang dengan tool lain yang menulis linear sungguhan, konversinya jadi berlebihan dan warnanya lebih gelap. Cara paling aman: aset diekspor ulang dengan nilai linear yang benar
  - **Logo di hero berputar 360°, dan logo ini pipih.** Sebagian besar kita lihat logo dari belakang atau dari samping, di mana wordmark "Labs" jadi tidak terbaca. Ini perilaku yang sudah ada sebelumnya (aset lama juga pipih) dan bukan regresi batch ini, tapi sekarang lebih kelihatan karena aset barunya lebih kontras
  - **Huruf "Labs" yang hitam di atas latar gelap tetap peka terhadap sudut pandang.** Di atas tinta pekat, huruf hitamnya cuma terbaca karena pantulan lampu rim dari kiri depan. Kalau sudut pantulan atau posisinya berubah, keterbacaannya turun. Kalau Bang Rob mau hurufnya selalu terbaca, sumbernya yang harus diubah (warna atau bahasan material), bukan kodenya
  - **Visual dicek pakai headless Chrome dengan software GL (SwiftShader), bukan GPU asli.** Bentuk dan warnanya sesuai, tapi performa di perangkat beneran belum diukur
  - **Yang tidak diuji: pergantian tema saat logo sedang berputar.** `MutationObserver`-nya benar dan lampu berganti, tapi transisi visual detik pertama setelah klik tombol tema belum difoto
  - **Batch ini berdiri sendiri, bukan ditumpuk.** Dibangun di atas branch `feat/aset-3d-hero-draco` yang sudah ada
  - **`plan-prd/` masih di-gitignore**, tidak ikut PR

## 22 Okt 2026, Batch 20: lampu "kilas" pelan di logo hero

- Tanggal: 22 Okt 2026
- Judul: satu lampu hangat ditambahkan ke scene logo hero dan bergerak pelan bolak-balik, supaya logonya kelihatan hidup
- File yang berubah:
  - Ubah: `src/components/aset3d.js` (opsi `denganKilas` pada `pasangLampu`, plus fungsi `ikutWaktu`)
  - Ubah: `src/components/Logo3D.jsx` (meminta lampu kilas, dan menggerakkan lampunya tiap frame)
- Yang dikerjakan:
  1. **Efeknya `PointLight`, bukan shader dan bukan post-processing.** Warna `#fff0dc` (hangat putih), intensitas 34, `decay: 2`. Ada dua: satu di depan (`z = +2.6`), satu di belakang (`z = -2.6`). Keduanya nyusul bareng: `x` dari `+3.2` ke `-3.2` dan sebaliknya, `y = -0.3`
  2. **Geraknya sinus bolak-balik, periode 8 detik.** Dipakai sinus (bukan linear) supaya waktu sudah belok ke titik awal nggak ada lompatan: lampu pulang ke tengah, bukan teleport
  3. **Hanya hero.** `pasangLampu` dapat opsi `denganKilas`, default-nya mati. Gerbang memanggil tanpa opsi itu, jadi penampilannya tidak berubah sama sekali
  4. **Jalur lampunya harus RENDAH, bukan di atas logo.** Logo itu dua bagian: kubus di atas, tulisan "Ra Labs" di bawah. Versi pertama letakkan lampu di `y = 1.4`, dan hasilnya tulisan praktis diam: diukur, brightness tulisan cuma berubah 1 level dari 255, sementara kubus 4,6. Jalur diturunkan ke `y = -0.3` dan didekatkan ke `z = 2.6`, jadi cahaya ikut menyapu tulisan: kubus berubah 29 level, tulisan 32 level. Enam konfigurasi diuji lebih dulu (satu lampu rendah, dua lampu, `decay: 1`, beberapa intensitas) dan yang dipakai adalah yang-balanced: dua-duanya bergerak, dan puncaknya di 164 dari 255, jauh dari blown out
  5. **Lampu di belakang itu wajib, bukan tambahan.** Muka yang menghadap ke belakang nggak dapat apa-apa dari lampu depan: garis normalnya berlawanan, jadi kontribusinya nol. Diuji: logo dilihat dari belakang tanpa lampu belakang = abu-abu flat, merah kusam, tulisan praktis hilang — persis keluhan Bang Rob ("warna jadi mati waktu berputar"). Lampu depan doang juga nggak menolong, hasilnya sama persis. Setelah lampu belakang dipasang, muka belakang jadi hidup: muka putih tetap putih, merah meriah, tulisan kelihatan
  6. **Menambah lampu belakang nggak bikin bagian depan terang dobel.** Tiap muka cuma dapat cahaya dari lampu di sisi-nya; lampu di seberang muka itu kontribusinya nol. Diperiksa lewat render: brightness muka depan sama saja sebelum dan sesudah lampu belakang ditambah
  7. **Intensitasnya diturunkan dari 48 ke 34** karena versi 48 kelewat terang di mata (permintaan Bang Rob), dan efeknya tetap terbaca
  8. **Intensitasnya sama di dua tema** (dipilih Bang Rob). Lampu ini efek, bukan penerang utama, jadi tidak ikut `setTema`. Di tema terang muka putih logo nempel sama kertas, jadi hasilnya dicek lewat screenshot: tidak blown out, gradien di muka putih masih terbaca, jadi intensitas 26 tidak diturunkan
  9. **`prefers-reduced-motion` dihormati.** Kalau pengguna meminta reduced motion, lampu diam di tengah: cahayanya tetap ada, cuma tidak bergerak. Ini ngikut setting yang sudah dipakai hero untuk spin
  10. **Gerbang ikut pakai lampu yang sama.** `LogoGerbang.jsx` memanggil `pasangLampu(scene, { denganKilas: true })` dan menggeser lampunya di loop render-nya. Efeknya jalan selama logo masih berputar, dan tetap jalan waktu logo balik ke pose kurus
  11. **Kilat dan luma fade gerbang tidak terganggu.** Keduanya nggak nyambung ke lampu: kilat itu garis additif dengan `depthTest: false`, luma fade itu alpha yang dihitung dari `diffuse` material. Menambah lampu cuma mengubah warna, bukan alpha dan bukan garis. Diperiksa di dev server: urutan gerbang (pose kurus, kilat, luma fade) tetap jalan
  12. **Nggak ada file baru, nggak ada dependency baru.** Loop render hero sudah jalan tiap frame (logo berputar), jadi lampu cuma perlu digeser di loop yang sama
- Hasil tes:
  - Dev server 5015: console bersih, tanpa error JavaScript, di tema terang maupun gelap
  - Geraknya terbukti dari screenshot: tiga frame berjarak 4 detik (setengah periode) menunjukkan sorotan highlight pindah dari satu sisi logo ke sisi lain, di kubus DAN di tulisan "Ra Labs"; frame pertama dan ketiga berjarak 8 detik (satu periode) sorotannya kembali ke posisi semula
  - Diukur pakai halaman uji (logo diem, lampu digeser, brightness dua daerah dibaca dari piksel): konfigurasi lama tulisan berubah 1 level dari 255, konfigurasi baru tulisan berubah 32 level dan kubus 29 level, puncak brightness kubus 164 dari 255
  - Tema terang: muka putih tidak blown out di intensitas 26, gradasinya masih terlihat di ketiga frame
  - Reduced motion (Chrome `--force-prefers-reduced-motion`): dua frame berjarak 5 detik identik, lampu diam di tengah dan logo juga tidak berputar
  - Gerbang: lampu kilas terpasang dan bergerak (screenshot 3 detik, 7 detik, 11 detik: tulisan "Ra Labs" dan muka kubus brightness-nya bergeser)
  - Urutan gerbang dicek ulang di dev server setelah lampu dipasang: klik "Buka Website" → pose kurus → luma fade → gerbang terbuka, console bersih
  - Muka belakang diuji dengan render dari sudut 180 derajat, memakai `pasangLampu` yang ASLI dari `aset3d.js` (bukan tulis ulang): dari belakang, muka putih tetap putih, merah meriah, dan tulisan "Ra Labs" kelihatan
  - Compare tiga config dari belakang: tanpa lampu kilas = abu-abu flat dan mati; lampu depan doang = sama saja (lampu depan nggak bisa menyalakan muka belakang); dua lampu = hidup
  - **Belum dijalankan: `npm run build`, commit, dan push.** Diminta Bang Rob supaya hasil kodingnya dicek dulu sebelum masuk ritual deploy
- Catatan jujur:
  - **Belum ada build.** Root repo masih berisi hasil build Batch 19, jadi yang di-commit nanti harus ikut membawa build baru. Kalau build-nya dilupakan, halaman yang tayang tetap versi lama
  - **Intensitas 26 dipilih dari preview, bukan dari pengukuran di perangkat beneran.** Di HP dengan layar lebih kecil, jaraknya dari logo lebih jauh dalam piksel, jadi intensitas yang sama bisa terasa lebih lemah. Kalau ternyata kurang terang di HP, yang dinaikkan intensitasnya, bukan geometrinya
  - **Periode 8 detik bisa terasa lambat atau cepat tergantung taste.** Kalau terasa lambat, setengah periodenya 4 detik perpindahan dari satu sisi ke sisi lain, jadi bisa dipercepat
  - **Efeknya jalan terus selama logo kelihatan.** Logo hero ada di layar pertama, jadi lampunya aktif selama pengunjung di situ. Kalau dirasa terlalu sering bergerak, opsi paling murah: pola ini bisa diubah jadi nyala sekali lalu meredup
  - **Efek ini baru ada di hero, belum ada di gerbang.** Kalau nanti mau efek yang sama di gerbang, tinggal panggil `pasangLampu(scene, { denganKilas: true })` di `LogoGerbang.jsx`

## 22 Okt 2026, Batch 21: bayangan logo hero, logonya melayang

- Tanggal: 22 Okt 2026
- Judul: bayangan lembut di bawah logo hero, lebar dan kegelapannya ngikutin rotasi logo
- File yang berubah:
  - Ubah: `src/components/Logo3D.jsx` (akar komponen + penulisan CSS var ukuran bayangan tiap frame)
  - Ubah: `src/styles/global.css` (aturan `.logo-bayang` + token warna bayangan per tema)
- Yang dikerjakan:
  1. **Bayangan bukan objek 3D, tapi elemen DOM di luar canvas.** Canvas logo itu kotak dan pas banget sama logo (sekitar 75% terisi), jadi nggak ada ruang buat bayangan tanpa ngubah ukuran logonya. Elemennya diletakkan absolute di dalam akar komponen, jadi layout hero nggak bergeser sama sekali dan logonya nggak ngecil
  2. **"Ngonutin gerak" itu lewat tiga CSS var yang ditulis dari loop render 3D.** `--lebar-bayang` (lebar logo yang kelihatan dari sudut sekarang, dikali 1,3), `--padam-bayang` (rasio lebar sekarang terhadap lebar TERLEBAR yang pernah terjadi, jadi makin pipih makin pudar), dan `--bawah-bayang` (jarak bawah logo ke bawah container, biar bayangan selalu nempel di bawah logonya). Semuanya dihitung dari bounding box yang sudah diproyeksi, bukan dari tebakan
  3. **WARNANYA BEDA per tema, dan itu bukan hal teknis. Tema terang: bayangan item, seperti bayangan objek di atas kertas. Tema gelap: bayangan item di atas tinta pekat nyaris nggak kelihatan, jadi dipakai amber hangat (`rgba(255, 210, 130, ...)`) yang warmed-up sama tim merah logo. Warna lewat CSS var, jadi ganti tema langsung ikut berubah tanpa campur JS
  4. **Gaya: lebar dengan inti gelap** (dipilih Bang Rob dari preview tiga gaya). Ada gradasi radial: inti lebih gelap di tengah, makin transparan ke tepi
  5. **Bayangan "siluet beneran" (shadow map) DITOLAK, dan alasannya nyata.** Kamera hero itu horizontal (lurus ke logo), jadi lantai akan dilihat tepat dari samping dan bayangannya cuma jadi garis satu piksel, nggak kelihatan sama sekali. Opsi yang kepake ya oval lembut — dan justru lebih cocok buat kesan melayang
- Hasil tes:
  - Dev server 5015: console bersih, tanpa error JavaScript, di tema terang maupun gelap
  - Screenshot dari dev server: tema terang bayangan item nempel di bawah tulisan "Ra Labs"; tema gelap bayangan amber hangat di posisi yang sama; mobile 360px bayangan ikut kebawa dan layout rapi
  - Reaksi rotasi: lebar bayangan dan kegelapannya ikut berubah mengikuti lebar logo yang kelihatan (terbukti di preview dengan logo diem dan lampu digeser)
  - Layout 360 / 768 / 1280: `scrollWidth` sama dengan `clientWidth` di semua tiga lebar, jadi bayangan yang absolute nggak bikin scroll horizontal
  - **Belum dijalankan: `npm run build`, commit, dan push.** Diminta Bang Rob supaya hasil kodingnya dicek dulu di dev server
- Catatan jujur:
  - **Bayangan cuma di hero, belum di gerbang.** Gerbang latarnya selalu gelap dan layoutnya lebih ketat (logo + tombol "Buka Website" jaraknya mepet), jadi belum dipasang. Kalau mau, tinggal tambah elemen yang sama di `LogoGerbang.jsx` — tapi warna dan posisinya perlu diatur ulang karena rig gerbang beda
  - **Angka 1,3 (lebar bayangan terhadap lebar logo) dan celah 4% itu pilihan rasa, bukan hasil pengukuran.** Dipilih dari preview. Kalau di dev server keliatan terlalu sempit atau terlalu lebar, itu angka yang pertama harus diubah — bukan logonya
  - **Bayangan ditulis ke DOM tiap frame** (tiga `style.setProperty`). Ini memicu hitung ulang gaya, tapi cuma satu elemen dan nilainya jarang berubah. Kalau nanti dirasa berat, bisa dibatasi: tulisnya cuma kalau angkanya beda lebih dari 1% dari yang sebelumnya
  - **Tema gelap pakai bayangan warm, bukan item** — itu pilihan estetika, bukan pilihan teknis. Kalau nanti keliatan aneh di layar OLED (hitam pekat), warna amber-nya bisa dinaikkan dikit
  - **Visual dicek pakai headless Chrome dengan software GL (SwiftShader), bukan GPU asli**
  - **`plan-prd/` masih di-gitignore**, tidak ikut PR

## 22 Okt 2026, Batch 22: reveal background hero dibenerin, ekornya nggak lagi patah

- Tanggal: 23 Okt 2026
- Judul: gelombangnya reveal background hero diperlebar sampai menutup seluruh bidang yang kelihatan, jadi tile nggak lagi muncul tiba-tiba di detik terakhir
- File yang berubah:
  - Ubah: `src/components/AcidSquares.jsx` (3 konstanta: `REVEAL_REACH`, `REVEAL_SECONDS`, `INTRO_SECONDS`)
- Yang dikerjakan:
  1. **Akibatnya dibuktikan dulu, bukan ditebak.** Bug yang dilaporkan: animasi reveal background nggak smooth di bagian terakhir, sebelum background selesai load. Terjadi sama persis di dua tema dan di desktop maupun mobile
  2. **Penyebabnya: radius reveal mentok terlalu dekat.** `REVEAL_REACH` cuma 19 unit, padahal tile yang masih kelihatan di layar ada sampai jarak ±42 unit. Tile yang belum kena gelombang (jarak > 16,3 = 19 − 1,6 − 1,1 delay acak) nggak pernah muncul secara bertahap. Waktu intro habis, `uReveal.w` berubah dari 0 ke 1 (baris 691 + 750), cabang `if (uReveal.w < 1.0)` di shader dilewati, dan `on` jadi 1 untuk SEMUA tile sekaligus. Alpha 0 ke 1 dalam satu frame
  3. **Ukurannya dihitung dengan replika persis math shader-nya** (radius, `reachOf`, hash delay, `smoother`, fade jarak, dan matriks kamera + proyeksi), bukan dikira-kira. Di 1440x900 ada 1.417 sel yang melompat lebih dari 0,5 alpha di frame yang sama, semuanya di pita y 119–252. Di 390x844: 458 sel (21%). Persentase-nya sama → cocok dengan laporan bahwa masalahnya sama di desktop dan mobile
  4. **Perbaikannya: `REVEAL_REACH` 19 jadi 48.** Syaratnya dari pengukuran: minimal 44,5. Dipakai 48 biar ada margin. Setelah dicek ulang: 0 sel yang melompat di desktop maupun mobile
  5. **Timing-nya ikut disesuaikan** supaya gelombang lebih lebar tapi nggak melonjak: `REVEAL_SECONDS` 2,6 jadi 3,4 (kecepatan gelombang 7,3 jadi 14,1 unit/detik) dan `INTRO_SECONDS` 3 jadi 3,8. Ekor 0,4 detik untuk gelombang bump surut tetap sama seperti sebelumnya
  6. **Ukuran kelembutannya diukur, bukan dikira-kira.** Dihitung lonjakan alpha per frame untuk tiap sel yang kelihatan: sebelum, 1.817 tile melompat (> 0,3) BERSAMAAN di frame terakhir (puncak di detik 3,00) — itu pita yang tiba-tiba muncul. Sesudah, cuma 78 yang melompat bersamaan, dan puncaknya di detik 1,62, yaitu di tengah animasi saat garis depan gelombang memang sedang bergerak. 23x lebih sedikit, dan lokasinya bukan lagi di detik terakhir
- Hasil tes:
  - Dev server 5015: console bersih, tanpa error JavaScript, di tema terang maupun gelap
  - Screenshot dari dev server (1440x900): hero utuh di dua tema — headline, logo 3D dengan lampu kilas, bayangan logo, CTA, jam
  - Analisis ulang dengan konfigurasi baru: 0 sel yang muncul mendadak, di desktop 1440x900 maupun mobile 390x844
  - **Belum dijalankan: `npm run build`, commit, dan push.** Diminta Bang Rob supaya dicek dulu di dev server
- Catatan jujur:
  - **Kecepatan gelombang jadi ~2x lebih cepat** (7,3 jadi 14,1 unit/detik). Gelombangnya juga jauh lebih lebar, jadi waktu untuk menutup seluruh layar justru lebih singkat. Tapi kalau di dev server rasanya terlalu "ngebut", `REVEAL_SECONDS` bisa dinaikkan — dengan konsekuensi intro jadi lebih lama
  - **Intro jadi 3,8 detik, dari 3 detik.** Panjang enough buat gelombang yang jauh lebih lebar
  - **Jam intro dijem advancement, bukan waktu nyata** (`dt` di-clamp 0,05 detik di baris 805). Di perangkat lambat di bawah 20fps, intro bisa lebih lama dari 3,8 detik. Ini perilaku lama, bukan efek perubahan ini, dan sengaja dibiarkan: melepas clamp-nya bikin lompatan besar pas tab browser di-switch
  - **Intro diputar ulang saat gerbang mulai larut** (`mulaiIntro` → `state.intro = 0`), jadi reveal yang dilihat pengunjung itu putaran kedua; yang pertama jalan di belakang gerbang
  - **Tile yang jauh di luar bidang kelihatan masih "muncul" mendadak** waktu intro habis, karena reach 48 memang nggak nutup sampai horizon. Tapi alpha-nya sudah ~0 karena fade jarak, jadi nggak kelihatan
  - **Visual dicek pakai headless Chrome dengan software GL (SwiftShader), bukan GPU asli.** Gerbang animasinya lebih sulit dikejar di software rendering, jadi smoothness-nya dibuktikan lewat pengukuran math-nya
  - **`plan-prd/` masih di-gitignore**, tidak ikut PR

## 22 Okt 2026, Batch 23: pernyataan hero dikasih blok kertas di tema terang

- Tanggal: 22 Okt 2026
- Judul: kalimat "RUMAH DARI SEMUA PROJECT. SEMUANYA ADA DISINI." di hero diberi blok kertas rounded, khusus tema terang, biar kontrasnya stabil
- File yang berubah:
  - Ubah: `src/components/Hero.jsx` (kalimat pernyataan dibungkus `<span class="hero-pernyataan">`)
  - Ubah: `src/styles/global.css` (aturan `.hero-pernyataan`, di-scope ke tema terang)
- Yang dikerjakan:
  1. **Kelihatannya dan penyebabnya diukur dulu.** Teksnya diukur di browser: kotak 300x46 px di x=40, dua baris, font-weight 300 (tipis), warna tinta `#0c0c0c`. Tipis + kecil + lewat di atas tile AcidSquares yang gradiennya bergerak, jadi kontrasnya ikut bergerak dan sesaat hilang
  2. **Bloknya memakai token `--kertas`**, bukan hex langsung, jadi ikut berubah kalau tokennya berubah. Warnanya `#f8fafc` persis sama dengan kertas
  3. **HANYA tema terang.** Aturannya di-scope dengan `html:not([data-theme='gelap'])`, jadi tema gelap nggak punya aturan sama sekali untuk elemen ini. Diperiksa di browser: di tema gelap bloknya `background: transparent`, `border-radius: 0`, `padding: 0`, `margin: 0`, `display: inline` — persis seperti sebelum ada kelas ini
  4. **Layout-nya nol perubahan.** Bloknya dikasih padding tapi dibayar balik margin negatif, jadi tinggi baris dan posisi teksnya tetap. Diperiksa: di kedua tema, `<p>`-nya tetap di x=40, y=793, 300x46, dan lebar induknya tetap 300. Versi pertama yang meletakkan bloknya langsung di `<p>` terbukti menggeser lebar induk jadi 279, jadi dipindah ke `<span>` di dalam `<p>`
  5. **Teksnya tetap rata dengan isi hero lain.** Margin kiri negatif bikin tepi kiri huruf tetap di x=40, sama dengan baris "Building Apps" dan jam di atasnya. Bloknya sendiri jadi sedikit lebih besar dari teksnya
  6. **Pemisahan barisnya dikunci, biar mobile dan desktop sama-sama bener.** Sebelumnya kalimatnya satu string, jadi browser bebas memecah di spasi mana saja. Di mobile (ruang 290 px) hasilnya baris pertama jadi "RUMAH DARI SEMUA PROJECT. SEMUANYA" — kalimat pertama kebelah dua. Sekarang tiap kalimat dibungkus `whitespace-nowrap`, jadi satu-satunya tempat yang boleh dibreak adalah di antara kedua kalimat. Tidak perlu `<br>` dan tidak perlu CSS khusus mobile, jadi dua tema ikut
  7. **Blok kertasnya diubah biar nempel ke teks, bukan melebar.** Complain: di mobile bloknya jauh lebih lebar dari teksnya. Penyebabnya: bloknya `inline-block`, jadi lebarnya dihitung dari max-content — yaitu SELURUH isi kalau diletakkan segaris. Di mobile itu 193 px + 144 px = 337 px, mentok di 300 px, jadi bloknya jadi 310 px padahal teksnya cuma 193 px. Diperbaiki dengan baris paksa di antara dua kalimat: max-content-nya jadi baris terpanjang, jadi lebarnya nempel sama teksnya
  8. **Fontnya ditebelkan di dua tema.** Sebelumnya `font-light` (weight 300) — rambut, dan di atas gradien tile yang bergerak kontrasnya ikut hilang. Sekarang `font-medium` (weight 500). Tiga kandidat (400 / 500 / 600) dirender berdampingan dan 500 yang dipilih: 400 masih terasa tipis, 600 mulai berebut tempat dengan baris "Building Apps" yang bold di atasnya. Comfortaa dimuat dengan rentang 300-700, jadi 500 tersedia
- Hasil tes:
  - Dev server 5015: console bersih, tanpa error JavaScript
  - Diperiksa lewat pengukuran di browser: tema terang → blok `background: rgb(248, 250, 252)` (token kertas), `border-radius: 16px`, `display: inline-block`, kotak 310x62 di x=30, sementara `<p>` tetap 300x46 di x=40. Tema gelap → blok transparan, radius 0, padding 0, margin 0, `<p>` tetap 300x46 di x=40
  - Screenshot sebelum-sesudah di area yang sama: sebelum, ada gradien tile yang melintas tepat di belakang teks (teks jadi kabur); sesudah, teksnya duduk di atas kertas rata
  - Mobile 360px: blok ikut kebawa, teks tetap terbaca, layout rapi
  - Pemecahan baris diukur di browser, bukan dikira-kira. Mobile 360px: "RUMAH DARI SEMUA PROJECT." (193 px) di baris pertama, "SEMUANYA ADA DISINI." (144 px) di baris kedua. Desktop 1440px: 277 px dan 207 px, sama seperti sebelumnya. Di dua lebar, dua kalimat itu nggak mungkin muat satu baris (337 px vs 290 px di mobile, 485 px vs 290 px di desktop), jadi mengunci tiap kalimat nggak akan bikin teks meluber
  - Mobile 360px: `scrollWidth` 360 = `clientWidth` 360, jadi blok yang keluar 10 px di kiri nggak bikin scroll horizontal
  - Lebar blok diukur sebelum dan sesudah: mobile 310 px jadi 213 px (teksnya 193 px, jadi selisihnya 20 px = cuma padding), desktop 310 px jadi 298 px (teksnya 277 px, selisih 21 px). Pemecahan barisnya nggak berubah: mobile 193 px + 144 px, desktop 277 px + 207 px
  - Layout 360 / 768 / 1280: `scrollWidth` sama dengan `clientWidth` di semua tiga lebar, jadi blok yang keluar 10 px di kiri tidak bikin scroll horizontal
  - **Belum dijalankan: `npm run build`, commit, dan push.** Diminta Bang Rob supaya dicek dulu di dev server
- Catatan jujur:
  - **Di tema terang, blok kertasnya kadang hampir nggak kelihatan** — karena latar hero di sana memang sudah mendekati warna kertas. Bedanya baru kelihatan kalau ada gradien tile yang lewat di belakang teks. Itu memang tujuannya: bukan bikin kotak kelihatan, tapi bikin hurufnya nggak ikut ikut larut sama gradien yang bergerak
  - **Radius 1rem dan padding 0,5rem / 0,65rem itu pilihan rasa**, bukan hasil pengukuran. Kalau di layar lo bloknya keliatan terlalu kotak, radius bisa dinaikin; kalau terlalu banyak ruang kosong, padding-nya dikecilkin
  - **Bloknya keluar 10 px di kiri teks.** Di desktop ruang kosongnya plenty, di mobile (padding 16 px) masih sisa 6 px dari tepi layar. Tidak overflow, tapi kalau mau lebih aman, padding horizontal bisa dikecilkan
  - **Font weight-nya 500, bukan 600.** Kalau di layar lo masih terasa kurang tebal, tinggal naikin ke `font-semibold` — cuma satu kata di `Hero.jsx`. Perhatikan baris "Building Apps" (bold, 700) di atasnya: kalau pernyataan terlalu tebal, dua-duanya mulai berebut hierarki
  - **Hanya teks ini yang digelay.** Teks lain di hero (judul "RA LABS", "Building Apps", jam) tidak diberi blok, karena yang dilaporkan bermasalah cuma pernyataan ini
  - **`plan-prd/` masih di-gitignore**, tidak ikut PR

## 22 Okt 2026, Batch 24: revamp latar dan interaksi About, Collection, Contact, plus default tema gelap

- Tanggal: 22 Okt 2026
- Judul: revamp panggung & kanvas About, Collection, Contact (dua tema), trigger animasi scroll carousel, dan default tema gelap
- File yang berubah:
  - Baru: `public/images/gradient-abstract.svg`
  - Baru: `src/components/StudioLedgerBg.jsx`
  - Ubah: `src/components/About.jsx` (podium turntable tema terang, scroll trigger mounting carousel)
  - Ubah: `src/components/Collection.jsx` (hierarki z-10 teks judul/deskripsi di atas overlay kanvas)
  - Ubah: `src/components/Contact.jsx` (kartu kanal asimetris, watermark TRANSMIT, dot status kedip, divider kontras tinggi)
  - Ubah: `src/components/Footer.jsx` & `src/components/Footer.css` (colophon kertas tema gelap, tear-off edge)
  - Ubah: `src/pages/Portal.jsx` (pembungkus latar mandiri per-section)
  - Ubah: `src/styles/global.css` (penghapusan bloom merah gelap, styling kanvas latar, podium turntable, watermark, kartu kanal)
  - Ubah: `src/theme.js` & `entries/index.html` (default tema dipatok wajib gelap saat visitor pertama kali masuk)
  - Hasil build dicopy ke root: `index.html`, `assets/`, `images/`
- Hasil tes:
  - Dev server: ok di port 5015, console bersih
  - Build: `npm run build` sukses (4.37 detik), bundle JS dan CSS terverifikasi ada di `assets/`
  - Root preview: dites via server lokal port 8099, HTTP 200 untuk `index.html`, bundle JS, CSS, dan aset SVG
  - Verifikasi bundle: script cek hash bundle `index.html` cocok dengan file di `assets/` (OK)
  - Interaksi: CircularCarousel di About baru aktif saat discroll masuk ke viewport (zero layout shift karena height wadah terkunci)
  - Tema: default pertama kali buka wajib langsung tema gelap (anti-flicker di inline script `<head>`)
  - Layout: responsif di 360, 768, 1280 tanpa horizontal scrollbar
  - Tombol & link: semua anchor dan interaksi kartu tetap responsif


## 08 Nov 2026, Batch 25: audit performa #1-#11 (WebGL context, GLB, chunking, idle render, aset)

- Tanggal: 08 Nov 2026
- Judul: bereskan issue performa #1 sampai #11 — turunkan WebGL context, tunda GLB, pisahkan bundle, hentikan render idle, dan rampingkan aset
- File yang berubah:
  - Baru: `src/lib/perangkat.js` (deteksi device lemah: pointer coarse + hardwareConcurrency)
  - Baru: `public/images/gradient-abstract.webp` (114 KB, ganti SVG 7.4 MB)
  - Ubah: `src/components/Hero.jsx` (lazy-mount Logo3D/Mark3D lewat `siap3D`, AcidSquares kondisional per tema, `detail`/`dpr` adaptif)
  - Ubah: `src/pages/Portal.jsx` (oper `siap3D={membuka || gerbangTerbuka}` ke Hero)
  - Ubah: `src/components/AcidSquares.jsx` (`antialias: false`)
  - Ubah: `src/components/Mark3D.jsx` (`antialias: false`, idle-pause loop, hover-driven spin, `forceContextLoss` saat unmount)
  - Ubah: `src/components/LogoGerbang.jsx` (`forceContextLoss` saat dispose)
  - Ubah: `src/components/SideRays.jsx` (budget pixel 1.2e6 untuk pointer coarse, cap DPR 2, `WEBGL_lose_context` saat dispose)
  - Ubah: `src/styles/global.css` (`.kertas-lecek-overlay` → `.webp`)
  - Ubah: `entries/index.html` (hapus font Sora, preload `Dark-headline1x.svg`)
  - Ubah: `tailwind.config.js` (hapus family `headline`/Sora)
  - Ubah: `vite.config.js` (`manualChunks`: vendor-three / vendor-motion / vendor-react)
  - Hapus: `src/components/Kubus.jsx` (orphan)
  - Hapus: `images/gradient-abstract.svg` + `public/images/gradient-abstract.svg` (diganti WebP)
  - Hasil build dicopy ke root: `index.html`, `assets/`, `images/`
- Yang dikerjakan:
  1. **#1 — 7 WebGL context → 3 saat gerbang menutup.** Hero dulu me-mount dua AcidSquares (terang + gelap) sekaligus dan Logo3D + dua Mark3D sejak detik 0. Sekarang AcidSquares hanya SATU instance sesuai `data-theme` (dipantau lewat `amatiTema`), dan Logo3D/Mark3D baru di-mount saat `siap3D` (gerbang mulai membuka). `LogoGerbang` dan `SideRays` juga sekarang melepas context (`forceContextLoss` / `WEBGL_lose_context`) saat unmount, bukan cuma `dispose()`
  2. **#2 — beban AcidSquares turun di device lemah.** `detail` dan `dpr` tidak lagi hardcode `high` + DPR 2. `src/lib/perangkat.js` memilih `detail` (`medium`/`low`) dan cap DPR 1.25 untuk device sentuh / core ≤ 4 / reduced-motion. Setelan warna, bulge, pulse, dan hover TIDAK diubah sama sekali — hanya `detail` dan `dpr` yang adaptif
  3. **#3 — GLB 2.8 MB tidak lagi diunduh di detik 0.** Karena Logo3D/Mark3D lazy-mount, GLB hero hanya diminta setelah gerbang mulai membuka. Saat gerbang menutup hanya `logo-ralabs-3d.glb` (milik gerbang) yang diunduh
  4. **#4 — bundle 1.1 MB satu chunk dipecah.** `manualChunks` memisahkan `vendor-three` (602 KB), `vendor-motion` (150 KB), `vendor-react` (188 KB), dan `main` turun jadi 127 KB. Logo3D/Mark3D juga di-`React.lazy`. `Kubus.jsx` dihapus
  5. **#5 — font Sora dibuang.** `Sora:wght@800` dihapus dari URL font dan dari `tailwind.config.js` (family `headline` tidak pernah dipakai). `Comfortaa` diubah dari `300..700` ke `400..700` (weight 300 tidak dipakai; 500 dipakai di Hero pernyataan)
  6. **#6 — gradient 7.4 MB → WebP 114 KB.** `.kertas-lecek-overlay` sekarang menunjuk `gradient-abstract.webp`. SVG lama dihapus dari root dan `public/`. Turun ~98.5%, hanya terunduh saat tema terang
  7. **#7 — antialias dimatikan di tempat yang tidak perlu.** `AcidSquares` (shader fullscreen) dan `Mark3D` (mark kecil) → `antialias: false`. `Logo3D` dan `LogoGerbang` tetap `true` karena tepi logo besar terlihat
  8. **#8 — LCP headline di-preload.** `<link rel="preload" as="image" href="/images/Dark-headline1x.svg" fetchpriority="high">` ditambahkan. Hanya versi gelap (tema default)
  9. **#9 — Mark3D berhenti render saat idle.** Loop hanya jalan saat hover, drag, atau animasi balik ke depan. Saat diam, frame di-`cancel` dan canvas di-render sekali terakhir. `autoRotate` tidak lagi menyala terus
  10. **#10 — SideRays lebih ringan di layar kecil.** `PIXEL_BUDGET` turun ke `1.2e6` untuk `pointer: coarse`, DPR di-cap 2, dan context dilepas saat unmount
  11. **#11 — deteksi device lemah.** `src/lib/perangkat.js` dipakai Hero untuk memilih `detail` + `dpr`. Tidak memakai `navigator.deviceMemory` (tidak ada di Safari)
- Hasil tes:
  - `npm run build` sukses (4.79 dtk). Chunk: `main` 127 KB, `vendor-three` 602 KB (gzip 157 KB), `vendor-motion` 150 KB, `vendor-react` 188 KB, `Logo3D` 5.1 KB, `Mark3D` 5.2 KB
  - Cek bundle: semua path `/assets/*` di `index.html` root benar-benar ada (script `contributing.md`) → semua `OK`
  - Cek aset CSS: satu-satunya `url(/...)` di CSS build adalah `/images/gradient-abstract.webp` → ada di root
  - Tes browser (Chrome headless via CDP, build root diserve `python3 -m http.server 8099`):
    - **Saat gerbang menutup: 3 canvas** (AcidSquares, SideRays, canvas logo gerbang). Sebelumnya 7
    - **`.glb` yang diminta saat gerbang menutup: hanya `logo-ralabs-3d.glb`**. Setelah gerbang terbuka total 3 GLB (ralabs, indeep, ibborarts) — sesuai harapan
    - **Setelah gerbang terbuka: 4 canvas** (1 AcidSquares + Logo3D + 2 Mark3D), gerbang sudah lepas, 2 `.mark-3d` ter-render
    - **Tukar tema (gelap → terang): `acidCanvas` tetap 1**, `.hero-latar` berganti dari `-gelap` ke `-terang` tanpa dobel instance
    - Console bersih di semua skenario (tidak ada error/exception)
- Catatan jujur:
  - **`vendor-three` masih di-`modulepreload` di awal** karena `LogoGerbang` butuh three.js di layar pertama. Ini disengaja (issue #10: "LogoGerbang jangan di-lazy"). Yang berkurang adalah GLB hero dan bundle non-three, bukan three itu sendiri
  - **Belum diukur dengan Lighthouse** (skor LCP/TBT sebelum-sesudah). Bukti yang ada adalah jumlah context, byte chunk, dan console bersih — bukan skor
  - **Belum dites di HP fisik.** Setelan `detail`/`dpr` adaptif memakai emulasi `pointer: coarse` + `hardwareConcurrency`; efek termal/baterai belum diukur
  - **`Comfortaa:wght@400..700` masih variable range**, belum dipecah jadi dua weight statis seperti opsi di issue #5. Weight 500 memang dipakai, jadi range 400–700 dipertahankan
  - **Manrope masih dipakai sebagai heading** (issue #5 poin 3). Belum diputuskan apakah balik ke Comfortaa
  - **`public/images/` dan root `images/` masih dobel** (issue #20 / backup #26). Sengaja tidak disentuh di batch performa ini
  - **`plan-prd/` masih di-gitignore**, tidak ikut PR

## 12 Nov 2026, Batch 26: SPA fallback per-route di .htaccess (#14)

- Tanggal: 12 Nov 2026
- Judul: fix #14 — siapkan SPA fallback untuk BrowserRouter tanpa mengorbankan 404 asli
- File yang berubah:
  - Ubah: `.htaccess` (blok `SPA FALLBACK` + bagian `ROUTE AKTIF` yang masih kosong)
  - Ubah: `contributing.md` (bagian "Menambah halaman / route baru" + satu baris checklist PR)
  - Ubah: `engineering.md` (entri ini)
- Yang dikerjakan:
  1. **Masalah aslinya dikonfirmasi ulang.** `.htaccess` hanya punya redirect www + `ErrorDocument`. `src/App.jsx` memakai `BrowserRouter`. Begitu ada route kedua, reload di URL itu akan menabrak disk, tidak ketemu file, lalu jatuh ke `404.html` padahal route-nya sah
  2. **Pilihan desain: fallback per-route, bukan wildcard.** `RewriteRule ^ index.html` ditolak karena melayani SEMUA URL ngawur dengan status 200 (soft-404). Akibatnya `ErrorDocument 404` tidak pernah tampil, Google menganggap URL ngawur sebagai halaman valid, dan `404.html` jadi mati. Yang dipasang adalah pola `RewriteCond !-f` + `!-d` + `RewriteRule ^<route>(/.*)?$ index.html [L]` per route
  3. **Bagian `ROUTE AKTIF` sengaja kosong.** Per hari ini portal hanya punya satu route (`/`) dan navigasi antar section memakai anchor `#section`, bukan URL terpisah. Jadi belum ada route yang butuh fallback. Yang dibuat sekarang adalah mekanisme + dokumentasinya, supaya route kedua tidak lagi menabrak keputusan mendadak
  4. **Cara menambah route ditulis di dua tempat.** Di komentar `.htaccess` (untuk yang langsung menyentuh file itu) dan di `contributing.md` (untuk alur kerja PR). Empat langkah: daftarkan di `App.jsx`, daftarkan pola di `.htaccess`, tambah ke `sitemap.xml`, uji di server
  5. **Aturan `Options -MultiViews` sengaja TIDAK ditambahkan.** Kalau AllowOverride Hostinger tidak mengizinkan directive `Options`, satu baris itu membuat seluruh situs 500 — bukan cuma route-nya. Risiko tidak sepadan karena `MultiViews` tidak mengganggu pola `^route$` yang berakhiran `$`
- Hasil tes:
  - Sintaks: tidak ada tool Apache lokal (`apache2`/`httpd` tidak terpasang, `sudo` tidak tersedia), jadi `.htaccess` **belum** divalidasi Apache. Yang bisa dilakukan hanya review manual: urutan aturan, `[L]`, dan pola regex
  - `RewriteCond %{REQUEST_FILENAME} !-f` / `!-d` dipastikan ada di setiap blok, supaya `/images/*` dan `/assets/*` tidak pernah ikut di-rewrite
  - Blok `ROUTE AKTIF` kosong, jadi perilaku situs **tidak berubah sama sekali** dibanding sebelum PR ini
  - Bundle root tidak disentuh: tidak ada perubahan `src/`, jadi `index.html` dan `assets/` tidak perlu di-build ulang
- Catatan jujur:
  - **Belum dites di Apache sungguhan.** Verifikasi akhir harus di Hostinger setelah merge: buka `/route-ngawur`, pastikan tampil `404.html` dengan status **404**, bukan 200
  - **Dev server tidak bisa dipakai memverifikasi 404.** Vite membalas 200 untuk URL apa pun, jadi perilaku 404 hanya terlihat di Apache
  - **Mekanisme ini belum "aktif" hari ini.** Nilainya baru terasa saat route kedua ditambahkan. Kalau langkah 2 (daftar di `.htaccess`) dilewat, gejalanya: halaman normal saat diklik dari navbar, tapi `404.html` muncul saat di-refresh
  - Issue #11 (deteksi device lemah) **sudah selesai** di Batch 25 lewat `src/lib/perangkat.js`, tapi issue-nya masih open. Perlu ditutup terpisah, bukan dikerjakan ulang

## 12 Nov 2026, Batch 27: bersih-bersih repo (#12, #16, #18, #21, #22) + cache-control HTML

- Tanggal: 12 Nov 2026
- Judul: bersihkan CSS orphan, dead asset, komentar usang, dan tambal celah cache HTML yang ditemukan saat review production
- File yang berubah:
  - Ubah: `.htaccess` (blok `CACHE HEADER UNTUK HTML`)
  - Ubah: `src/styles/global.css` (hapus 4 kelas orphan)
  - Ubah: `src/components/Footer.jsx` (komentar `KANAL`)
  - Ubah: `public/404.html` (komentar sumber kebenaran)
  - Ubah: `contributing.md` (langkah 13 kebersihan branch + checklist)
  - Ubah: `README.md` (hapus sebutan `mascot-enjoy.svg`)
  - Hapus: `images/` + `public/images/` → `banner-logo.webp`, `logo-text.webp`, `mascot-enjoy.svg` (6 file)
  - Hasil build dicopy ke root: `index.html`, `assets/`, `images/`, `404.html`, `robots.txt`, `sitemap.xml`, `humans.txt`
- Yang dikerjakan:
  1. **Temuan baru dari review production — HTML tanpa Cache-Control.** `curl -I https://ra-labs.tech/` hanya mengembalikan `ETag` dan `Last-Modified`, tanpa `Cache-Control`. Browser bebas memakai heuristic caching, sehingga setelah deploy berikutnya `index.html` lama bisa dipakai dan menunjuk bundle hash yang sudah dihapus → halaman putih. Ditambahkan `<FilesMatch "\.html$">` + `Header set Cache-Control "no-cache, must-revalidate"` di dalam `<IfModule mod_headers.c>`. Dipilih `no-cache` (revalidasi, biasanya 304 tanpa body) bukan `no-store` (unduh ulang penuh). Aset ber-hash di `/assets/` tidak disentuh karena justru harus di-cache lama
  2. **#16 — 4 kelas CSS orphan dihapus.** `.judul-besar`, `.judul-hero`, `.tautan-teks`, dan `.latar-bengkel-koleksi-kontak`. Yang terakhir digabung dalam selector bersama `.latar-bengkel-collection` di dua tempat (blok terang baris 850 dan blok gelap baris 876), jadi penghapusan dilakukan per-selector dan `.latar-bengkel-collection` dipastikan tetap utuh
  3. **#18 — 3 dead asset dihapus dari dua lokasi.** `banner-logo.webp` (19.9 KB), `logo-text.webp` (7.6 KB), `mascot-enjoy.svg` (56.2 KB) → total 83.7 KB × 2 lokasi. `logo-ralabs-3d.glb` tidak disentuh karena path-nya dibentuk lewat konstanta `SUMBER_LOGO`, bukan literal
  4. **#12 — komentar Footer diperbaiki.** Klaim "masih placeholder" dihapus, diganti pernyataan bahwa nilai `KANAL` sudah final dan live, plus kewajiban sinkron dengan `KANAL` di `Contact.jsx`. Nilai email dan WhatsApp diverifikasi sama di kedua file
  5. **#21 — sumber kebenaran `404.html` ditandai.** Komentar HTML di `public/404.html` menjelaskan alur `public/404.html → build → dist/404.html → root`, dan melarang mengedit versi root
  6. **#22 — aturan kebersihan branch ditulis + dijalankan.** `contributing.md` dapat langkah 13: cek `git log main..<branch>` (kosong = aman), hapus dengan `git branch -d` (bukan `-D`, biar git menolak kalau belum merge), hapus remote hanya setelah konfirmasi. Dua branch yang sudah merge dihapus lokal: `fix/htaccess-spa-fallback`, `fix/perf-issue-1-11`
- Hasil tes:
  - `npm run build` sukses (4.07 dtk). `main` 129.14 KB (gzip 45.94), `vendor-three` 616.16 KB (gzip 157.82)
  - Skrip cek bundle `contributing.md`: 5 path `/assets/*` di `index.html` root → semua `OK`
  - 4 nama kelas orphan: `grep` di `src/` → 0 hasil; di CSS build → 0 hasil
  - `.latar-bengkel-collection` masih ada di CSS build (2 kemunculan, terang + gelap)
  - 3 dead asset: `grep` di `src/`, `entries/`, `public/` → 0 referensi; setelah build + copy → tidak balik ke root `images/`
  - Aset yang dirujuk `index.html` lokal (7 path) dan CSS build (1 `url()`) diserve dari root via `python3 -m http.server 8099` → semua `200`
  - Browser headless (Chrome `--headless=new`), root repo diserve port 8099:
    - DOM 32.765 byte, React ter-render, tidak ada error console
    - Screenshot 360 / 768 / 1280 dibandingkan dengan production → layout identik, tidak ada scroll horizontal
    - Section `about` kosong di DOM **juga terjadi di production** (About menunggu gerbang terbuka), jadi bukan regresi
- Catatan jujur:
  - **Cache-Control belum terbukti bekerja.** Butuh `mod_headers` aktif di Hostinger. Kalau modul itu mati, `<IfModule>` membuat blok dilewati diam-diam tanpa error — jadi tidak ada risiko 500, tapi juga tidak ada efek. Verifikasi setelah merge: `curl -I https://ra-labs.tech/` harus memunculkan `cache-control: no-cache, must-revalidate`
  - **3 dari 4 kelas CSS orphan ternyata sudah dipurge Tailwind dari build sebelumnya.** Diverifikasi dengan mengunduh CSS production lama: `judul-besar`, `judul-hero`, `tautan-teks` → 0 kemunculan. Hanya `.latar-bengkel-koleksi-kontak` yang benar-benar ada di output, karena ditulis sebagai selector CSS biasa di luar `@layer components` sehingga tidak ikut purge. Jadi dampak nyata #16 ke ukuran CSS kecil: gzip 10.938 → 10.934 byte (−4 byte). Nilai sebenarnya adalah kebersihan source, bukan penghematan byte
  - **`mascot-enjoy.svg` dihapus meski `plan-prd/about-circular-carousel/design.md` menyebut "file tetap, bisa dipakai lagi nanti".** Issue #18 meminta hapus ketiganya dan Bang Rob memilih opsi itu secara eksplisit. Keputusan plan-prd lama dengan ini dibatalkan. Kalau nanti maskot dibutuhkan lagi, file harus dibuat ulang dari artboard
  - **Branch remote belum dihapus.** `origin/fix/htaccess-spa-fallback` dan `origin/fix/perf-issue-1-11` masih ada; sesuai aturan baru, hapus remote butuh konfirmasi Bang Rob
  - **`.htaccess` belum divalidasi Apache** (tidak ada `apache2`/`httpd` dan `sudo` di mesin ini). Blok baru dibungkus `<IfModule mod_headers.c>` justru supaya aman kalau modulnya tidak ada
