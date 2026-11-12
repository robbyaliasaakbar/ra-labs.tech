# RaLabs

Portal di `https://ra-labs.tech/`. Satu halaman berisi aplikasi, situs, dan alat yang saya bangun, plus alamat lain untuk portofolio yang sama. Semua karya berikutnya hidup di subdomain `*.ra-labs.tech`.

Repo ini disambung ke hPanel Hostinger. Yang tayang adalah isi `public_html/`, bukan server Node.

## Tech stack

Versi diambil dari `package.json` saat README ini ditulis.

### Frontend

| Bagian | Paket | Versi | Dipakai untuk |
| --- | --- | --- | --- |
| Library UI | `react` + `react-dom` | 18.3.1 | Seluruh antarmuka portal |
| Build tool | `vite` | 6.4.4 | Dev server + build statis ke `dist/` |
| Plugin React | `@vitejs/plugin-react` | 4.3.4 | Babel + fast refresh saat dev |
| Routing | `react-router-dom` | 7.18.4 | `BrowserRouter`, satu rute `/`, sisanya dialihkan ke `/` |
| CSS | `tailwindcss` | 3.4.19 | Utility class, di-bundle lewat PostCSS (bukan CDN) |
| Post-processor | `postcss` + `autoprefixer` | 8.4.49 / 10.4.20 | Pipeline Tailwind + prefix vendor |
| Animasi | `framer-motion` | 14.3.0 | Fade in section, transisi kartu |
| Tilt | `react-parallax-tilt` | 1.7.347 | TiltBox di kartu proyek dan tombol |
| 3D | `three` | 0.180.0 | Kubus gerbang hero + logo 3D (`GLTFLoader`, `OrbitControls`) |
| Ikon | `@hugeicons/react` + `@hugeicons/core-free-icons` | 1.1.10 / 4.3.5 | Ikon navbar, kontak, kartu |

Tailwind di-wire lewat `postcss.config.js`, konfigurasi tema ada di `tailwind.config.js` (CommonJS-free, pakai `export default`).

### Struktur build

- **Multi-page bukan SPA murni di hosting.** Sumber HTML ada di `entries/index.html`, root `index.html` adalah hasil build. `vite.config.js` punya satu entry (`main`) dan middleware kecil yang mengarahkan `/` ke `entries/index.html` saat dev, supaya HMR kena ke sumber asli.
- **Output build:** `dist/entries/index.html`, `dist/assets/main-*.js`, `dist/assets/main-*.css`, plus salinan `dist/images/`.
- **Deploy:** hasil `dist/` disalin ke root repo (`index.html`, `assets/`, `images/`), lalu di-push ke `main` dan ditarik hPanel Hostinger.

### Bahasa, font, warna

- Bahasa halaman: `lang="id"`.
- Font (Google Fonts, dimuat dari CDN dengan `preconnect`): **Montserrat Black** untuk headline hero, **Manrope** untuk judul tebal dan cadangan headline, **Comfortaa** untuk body, **JetBrains Mono** untuk data/kode.
- Palet cuma empat warna, didefinisikan di `tailwind.config.js` dan `src/styles/global.css`:
  - `kertas` `#F8FAFC`
  - `tinta` `#0C0C0C`
  - `merah` `#D70000`
  - `kuning` `#FFE578`
- Tema terang/gelap pakai CSS variable (`--bidang`, `--teks`, `--garis`, `--lawan-*`) dan atribut `html[data-theme]`. Deteksi awal di script inline `entries/index.html` supaya tidak kedip, pilihan disimpan di `localStorage` key `ralabs-tema`.

### Gambar dan aset

- Format: WebP, disimpan di `public/images/` (otomatis tercopy ke `dist/images/`).
- Satu aset 3D: `logo-ralabs-3d.glb`, dimuat runtime lewat `GLTFLoader`.
- Logo, `og-banner.webp`, favicon: semua ada di `public/images/`, tidak ada referensi ke folder `../assets/` di luar repo.

### SEO dan metadata

- Meta title, description, canonical `https://ra-labs.tech/`, OG + Twitter card (`summary_large_image`) memakai `og-banner.webp` 1200x630, `og:image:type` `image/webp`.
- `meta theme-color` `#0C0C0C`, disesuaikan script tema (terang `#F8FAFC`, gelap `#0C0C0C`) supaya status bar mobile nyambung.
- JSON-LD `@graph`: `WebSite`, `Organization`, `Person`.
- File statis wajib di `public/`: `robots.txt`, `sitemap.xml`, `humans.txt`, `404.html`.
- `.htaccess` berisi redirect 301 `www` ke apex (`www.ra-labs.tech` ke `https://ra-labs.tech`) plus `ErrorDocument 404 /404.html` supaya 404 tampil dengan halaman sendiri.

### Analytics

- Google Analytics 4, ID `G-QCTML33T41`, snippet `gtag.js` inline di `entries/index.html`.

### Hosting dan backend

- Target: shared hosting Hostinger (Apache), PHP 8.3 native, MySQL InnoDB lewat phpMyAdmin.
- **Tidak ada backend saat ini.** Kontak lewat `mailto:` dan tautan WhatsApp.
- Kalau nanti butuh server: PHP 8.3 native + PDO + MySQL, tanpa Composer, tanpa Node long-running, tanpa Docker/Postgres/Supabase Auth.
- `.htaccess` dipakai untuk rewrite/error document, jadi backend PHP nanti ditaruh di folder `api/` dan tidak dicampur ke bundle Vite.

## Menjalankan

```bash
cd public_html
npm install
npm run dev
```

Dev server ada di `http://localhost:5015/` (`strictPort`, jadi tidak loncat port).

## Build

```bash
npm run build
rm -f assets/*.js assets/*.css
cp dist/entries/index.html index.html
cp dist/assets/* assets/
cp -rf dist/images/. images/
cp dist/404.html dist/robots.txt dist/sitemap.xml dist/humans.txt .
```

Hasil build (`index.html`, `assets/`, `images/`) disalin ke root repo ini. File-file itu hasil mesin, jangan diedit langsung. Sumbernya ada di `entries/` dan `src/`.

## Perubahan

Semua perubahan masuk lewat pull request ke `main`. Merge ke `main` langsung live, karena Hostinger menarik `main` otomatis. Aturan lengkapnya ada di `contributing.md`.

## Isi singkat

- Tema terang dan gelap, ikut `prefers-color-scheme`, pilihan disimpan di `localStorage`. Navbar tetap berwarna kertas di kedua tema.
- Gerbang di layar pertama: kubus geometry Three.js dan satu tombol `Masuk`.
- Sembilan proyek di bagian Collection: tumpukan kartu, di layar lebar maupun sempit.
- Tanpa backend. Kontak lewat `mailto:` dan WhatsApp.
- Analytics: Google Analytics 4 dengan ID `G-QCTML33T41`.

Kalau nanti perlu backend, di shared hosting ini hanya PHP 8.3 native dan MySQL. Tanpa Composer, tanpa Docker.

## Aset

Berkas logo dan `og-banner.webp` ada di `public/images/`. Folder `../assets/` di luar repo hanya referensi; code tidak menunjuk ke sana.

## Lisensi

MIT. Lihat `LICENSE`.
