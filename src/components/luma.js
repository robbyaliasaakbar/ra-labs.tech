/* Otak LUMA FADE, dipakai dua tempat yang HARUS sinkron:
   - LogoGerbang.jsx -> melarutkan logo di dalam shader WebGL
   - Gerbang.jsx     -> memudarkan latar dan tombol Buka Website
   Ditarik ke satu file supaya timing dan kemiringannya tidak bisa beda. */

/* Durasi buka layar (ms). Dari plan-prd/gerbang-masuk/design.md. */
export const DURASI_BUKA = 800

/* Kelembutan luma: lebar pita transisinya 1/K satuan luminance.
   K = 1.5 -> pita 0.67, jadi setiap bagian logo memudar perlahan, bukan
   melewati ambang tajam. Kecil = lembut, besar = tajam.

   Nilai ini diturunkan dari pengukuran, bukan selera. Logo RaLabs cuma
   punya tiga nada warna (putih, merah, hitam) yang jauh satu sama lain,
   sehingga di antaranya TIDAK ADA piksel sama sekali. Kalau pitanya
   sempit (K = 3), tiap nada melewati ambang nyaris serentak lalu diam —
   terasa patah. Dengan pita lebar, nada-nada itu saling menyambung dan
   larutnya jadi satu gerakan utuh. Ukurannya: puncak laju pelarutan
   turun dari 11.3 ke 8.9, dan variasi lajunya dari 0.78 ke 0.51. */
export const KELEMBUTAN_LUMA = 1.5

/* Amplitudo butiran (dither), satuan luminance.
   Inilah obat "kasar" di logo yang warnanya rata per muka. Tanpa butiran,
   satu muka berwarna seragam melewati ambang BERSAMAAN dan hilang serentak
   seperti blok yang kepotong. Dengan butiran, tiap piksel dapat ambang
   sedikit beda, jadi muka itu melebar jadi butiran yang tumbuh — halus.
   Harus >= 1/K supaya pita luma selalu terisi butirannya. */
export const AMPLITUDE_DITHER = 0.4

/* Progres buka 0..1, ease in-out: pelan di awal, kencang di tengah,
   pelan di akhir. Sama seperti pose kurus supaya gerbangnya tidak
   langsung ngebut dari frame pertama. */
export function progresBuka(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

/* Pasangan slope/intercept untuk alpha luma fade, pada suatu progres p.

   alpha = clamp(intercept + slope * luminance), slope selalu negatif, jadi
   luminance tinggi mencapai alpha 0 lebih dulu = terang -> gelap.

   T menyusur dari (1 + A/2) sampai (-1/K - A/2), di mana A = amplitudo
   butiran. Dua ujung itu sengaja melebar A/2 ke luar dari hitungan polos:
   - Ujung atas supaya piksel PALING terang pun (luma 1) masih alpha 1 di
     frame pertama, bahkan kalau kebetulan dapat butiran terang. Tanpa ini
     logo langsung kedip setengah cair di frame pertama.
   - Ujung bawah supaya piksel PALING gelap pun (luma 0) sudah alpha 0 di
     frame terakhir. Tanpa ini sisanya tidak pernah habis dan menyisakan
     kotak hitam.

   Di T = 1 + A/2 semua luminance masih alpha 1 (belum ada yang larut). */
export function nilaiLuma(p) {
  const T = (1 + AMPLITUDE_DITHER / 2) - p * (1 + 1 / KELEMBUTAN_LUMA + AMPLITUDE_DITHER)
  return {
    slope: -KELEMBUTAN_LUMA,
    intercept: 1 + KELEMBUTAN_LUMA * T,
  }
}
