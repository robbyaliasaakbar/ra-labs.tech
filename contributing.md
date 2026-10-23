# Kontribusi

Repo ini auto-deploy ke shared hosting Hostinger. Merge ke `main` **langsung tayang** di `https://ra-labs.tech/`. Karena itu semua perubahan wajib lewat pull request.

Repo: `https://github.com/robbyaliasaakbar/ra-labs.tech`

---

## Aturan inti

- **Dilarang push langsung ke `main`.**
- Satu PR = satu batch kerja. Jangan menumpuk banyak perubahan tak berhubungan dalam satu PR.
- Setiap PR wajib mengisi `engineering.md` dengan satu entri. PR tanpa entri belum boleh di-merge.
- Review dan merge **manual** oleh Bang Rob di GitHub. Jangan squash/merge sendiri.
- Setelah merge, cek hPanel Hostinger menarik `main` dan site ikut ter-update.

---

## Bentuk repo yang harus dipahami dulu

Ini sumber kebingungan paling sering. Root `public_html/` memuat **dua jenis file sekaligus**:

| Lokasi | Isi | Boleh diedit tangan? |
|---|---|---|
| `src/`, `entries/` | Source React + HTML entry | **Ya**, di sini tempat kerja |
| `public/` | File statis (images, robots, sitemap, 404) | **Ya** |
| `assets/` (root) | Bundle hasil build | **Tidak.** Hasil copy dari `dist/` |
| `index.html` (root) | HTML hasil build | **Tidak.** Hasil copy dari `dist/` |
| `dist/` | Hasil build sementara | Tidak, dan di-gitignore |

`plan-prd/` juga **di-gitignore** (berisi catatan perencanaan, bukan kode). Jadi wajar kalau file plan tidak muncul di `git status` dan tidak ikut PR. Yang wajib ikut PR hanyalah kode, aset, dan hasil build.

hPanel auto-deploy menarik **isi folder root repo** ke server. Hostinger **tidak menjalankan build**. Jadi kalau source berubah tapi hasil build tidak ikut di-commit, PR yang di-merge tetap menayangkan **versi lama**. Ini penyebab paling umum "sudah merge kok nggak berubah".

---

## Alur kerja lengkap

### 1. Mulai dari `main` yang segar

```bash
cd "/home/obi/Projects/LABORATORY/ra-labs.tech"
git checkout main
git pull origin main
git checkout -b feat/nama-batch
```

Prefix branch yang dipakai di repo ini: `feat/`, `fix/`, `docs/`.

### 2. Install dependency (sekali saja, atau kalau `package.json` berubah)

```bash
npm install
```

### 3. Kerjakan di source, cek lewat dev server

```bash
npm run dev
```

- Dev server jalan di **port 5015**, `strictPort: true` (tidak akan lompat ke port lain).
- Buka `http://127.0.0.1:5015/`. Route `/` dilayani dari `entries/index.html` lewat middleware di `vite.config.js`, jadi HMR tetap hidup.
- **Jangan** buka `http://127.0.0.1:5015/index.html`. Itu file build lama di root, bukan source.
- Kalau ada error, baca console browser. Jangan menebak.
- `npm run dev` biarkan jalan selama ngoding. Jangan start instance kedua — `strictPort` bikin yang kedua gagal.

### 4. Build

Hanya setelah perubahan source dianggap beres dan sudah dicek di dev server:

```bash
npm run build
```

Output masuk ke `dist/`. Cek tidak ada error. Kalau build gagal, **berhenti** — jangan lanjut ke langkah copy.

### 5. Pindahkan hasil build ke root

Ini langkah yang paling gampang salah. Urutannya penting: **hapus bundle lama dulu**, baru copy yang baru. Kalau tidak, file lama menumpuk dan halaman bisa memuat bundle yang sudah mati.

```bash
# 1. Bersihkan bundle lama di root. Wajib, jangan dilewati.
rm -f assets/*.js assets/*.css

# 2. Copy hasil build
cp dist/entries/index.html index.html
cp dist/assets/* assets/
cp -rf dist/images/. images/
cp dist/404.html dist/robots.txt dist/sitemap.xml dist/humans.txt .
```

Catatan tiap baris:

- `dist/entries/index.html` — bukan `dist/index.html`. Vite menaruh output multi-page di `dist/entries/`.
- `cp -rf dist/images/. images/` — pakai `/.` di akhir, bukan `dist/images/*`, supaya file hidden (kalau ada) ikut dan tidak membuat folder bersarang.
- `404.html` harus tetap ada di root karena `.htaccess` menunjuk ke `/404.html`. Tanpa itu Hostinger menampilkan 404 template bawaan.

### 6. Samakan nama bundle di `index.html`

Pastikan `index.html` di root menunjuk file yang **benar-benar ada**. Jangan cuma dibandingkan pakai mata — jalankan ini:

```bash
for a in $(grep -o '/assets/[^"]*' index.html | sed 's|/assets/||'); do
  [ -f "assets/$a" ] && echo "OK     $a" || echo "HILANG $a  <-- halaman putih"
done
```

Semua baris harus `OK`. Nama file ber-hash dan **case-sensitive**; beda satu huruf saja hasilnya halaman putih.

### 7. Cek hasil build di browser (bukan cuma dev server)

Dev server sudah oke bukan berarti build oke. Masalah paling sering justru muncul **cuma** di build: nama bundle salah, CSS hilang, module gagal resolve.

**Jangan pakai `npm run preview`.** Output build ada di `dist/entries/index.html`, jadi `dist/` tidak punya `index.html` di akarnya — `vite preview` di `/` akan 404 dan bikin bingung. Yang mau dites juga bukan `dist/`, tapi **root repo**, karena itulah yang ditarik Hostinger.

Serve root repo dengan Python (sudah ada, zero install):

```bash
python3 -m http.server 8099
```

Buka `http://127.0.0.1:8099/`. Yang disajikan adalah `index.html` + `assets/` + `images/` di root — **persis file yang akan live**. Ulangi cek: tidak ada error console, layout tidak pecah, logo 3D kebuka, gerbang jalan sampai masuk.

Matikan dengan Ctrl+C setelah selesai.

### 8. Isi `engineering.md`

Tambahkan **satu entri** di akhir file, mengikuti format yang sudah ada di sana:

```markdown
## 18 Okt 2026, Batch N: judul singkat

- Tanggal: 18 Okt 2026
- Judul: <judul PR>
- File yang berubah:
  - Baru: `src/components/Contoh.jsx`
  - Ubah: `src/pages/Portal.jsx`
- Hasil tes:
  - Dev server: ok di port 5015, console bersih
  - Build: `npm run build` sukses
  - Layout: cek 360, 768, 1280, tidak ada scroll horizontal
  - Kontras: lolos
  - Tombol/link: semua ditekan beneran, tidak ada yang mati
```

### 9. Commit

Cek dulu apa yang mau masuk. **Jangan** `git add .` buta.

```bash
git status
git diff --stat
```

Pastikan yang ter-stage hanya file yang relevan, dan hasil build di root **ikut masuk** (`index.html`, `assets/`, `images/`).

```bash
git add src/ entries/ public/ index.html assets/ images/ engineering.md
git commit -m "feat: deskripsi singkat perubahan"
```

Konvensi pesan commit di repo ini: lowercase, prefix `feat:` / `fix:` / `docs:`, satu baris ringkas.

### 10. Push branch

```bash
git push -u origin feat/nama-batch
```

### 11. Buka PR

```bash
gh pr create --base main --head feat/nama-batch \
  --title "feat: deskripsi singkat" \
  --body "$(cat <<'EOF'
## Apa yang berubah
- ...

## File utama
- `src/...`

## Bukti tes
- [ ] Dev server 5015, console bersih
- [ ] `npm run build` sukses
- [ ] Hasil build di-serve dari root repo (bukan dev server) dan dicek di browser
- [ ] `index.html` root menunjuk bundle yang ada di `assets/`
- [ ] Layout 360 / 768 / 1280 tanpa scroll horizontal
- [ ] Kontras teks lolos
- [ ] Semua tombol dan link ditekan, tidak ada yang mati
- [ ] `engineering.md` sudah diisi
EOF
)"
```

`gh` sudah login sebagai `robbyaliasaakbar`. PR akan dibuat ke `main` dan URL-nya dicetak. Kirim URL itu ke Bang Rob.

### 12. Setelah merge

```bash
git checkout main
git pull origin main
```

Lalu buka `https://ra-labs.tech/` dan **verifikasi yang live**, bukan yang lokal:

- View source, cek nama bundle yang diload **sama** dengan hash build lokal di `assets/`.
- Kalau masih bundle lama, berarti hPanel belum menarik `main` atau hasil build tidak ikut ter-commit.
- Hard refresh (Ctrl+Shift+R) dulu sebelum menyimpulkan cache.

---

## Isi deskripsi PR

Wajib ada, dan harus jujur:

- Bagian mana yang selesai, file apa saja yang berubah.
- Bukti tes: apa yang benar-benar dicoba dan hasilnya apa.
- Kalau ada yang **belum** dites, tulis belum. Jangan diklaim lolos.
- Kalau ada perubahan perilaku yang bisa kagetkan user, sebutkan.

---

## Aturan coding

- Tulis code sederhana yang mudah dipahami pemula. Repo ini pakai pola reverse engineering, jadi **jangan over-abstract**.
- Ikuti struktur yang sudah ada dulu. Kalau mau menambah pola baru, jelaskan alasannya di PR.
- Komentar hanya untuk hal yang tidak terbaca dari codenya sendiri. Komentar yang cuma mengulang baris di bawahnya dihapus.
- Wajib responsive: mobile, tablet, desktop.
- Wajib semantic HTML, alt text, dan hierarki heading yang benar.
- Tiap halaman wajib punya title, meta description, Open Graph, canonical, dan JSON-LD.
- Tidak ada tombol atau link tanpa tujuan. Kalau belum jadi, tulis "Coming Soon", jangan dikasih link mati.
- **Jangan** `npm run build` lalu commit tanpa pernah cek hasil build-nya di browser.

### Bagian yang tidak boleh disentuh

- `src/components/Logo3D.jsx` — milik hero. Gerbang pakai file sendiri (`LogoGerbang.jsx`).
- Model 3D tetap `public/images/logo-ralabs-3d.glb`.
- `banner-logo.webp` tidak dipakai sebagai logo.

---

## Batasan stack

Repo ini jalan di **shared hosting Hostinger (Apache)**.

Yang boleh:

- File statis hasil build React + Vite
- PHP 8.3 native (zero-dependency, tanpa Composer)
- MySQL lewat phpMyAdmin (InnoDB)

Yang **tidak boleh** masuk ke portal akar:

- Node.js sebagai server yang jalan terus
- PostgreSQL, Docker, Supabase, n8n, Tailscale Funnel
- Composer atau framework PHP berat
- Proses background / long-running

Kalau ide butuh salah satu di atas, taruh di subdomain sendiri yang hostingnya memang mendukung. Jangan dicampur ke sini.

---

## Aset

- `/home/obi/Projects/LABORATORY/ra-labs.tech/assets/` adalah **folder referensi**, tidak ikut ter-deploy.
- File yang dipakai wajib **dicopy dulu** ke `public/images/` (untuk dev) dan ikut ke `images/` saat build.
- Code **tidak boleh** menunjuk langsung ke `../assets/`.
- Gambar disimpan sebagai WebP. Logo wajib pakai aset asli, jangan bikin logo baru tanpa izin.

---

## Checklist sebelum bilang "PR siap"

- [ ] Sudah mulai dari `main` terbaru
- [ ] Dev server 5015, console bersih
- [ ] `npm run build` sukses
- [ ] Hasil build sudah dipindah ke root (`index.html`, `assets/`, `images/`)
- [ ] Bundle lama sudah dihapus sebelum copy
- [ ] `index.html` root menunjuk bundle yang benar-benar ada
- [ ] Hasil build di-serve dari root repo (`python3 -m http.server 8099`) dan dicek di browser
- [ ] Layout 360 / 768 / 1280 tanpa scroll horizontal
- [ ] Kontras teks lolos
- [ ] Semua tombol dan link ditekan, tidak ada yang mati
- [ ] `engineering.md` sudah diisi
- [ ] Yang masuk commit hanya file relevan (cek `git status`)
- [ ] Branch sudah di-push, PR sudah dibuka, URL dikirim ke Bang Rob
