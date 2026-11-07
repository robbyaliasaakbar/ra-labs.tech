/** @type {import('tailwindcss').Config} */
export default {
  content: ['./entries/**/*.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Empat warna palet RaLabs. Tidak ada warna kelima.
        kertas: '#F8FAFC',
        tinta: '#0C0C0C',
        merah: '#D70000',
        kuning: '#FFE578',
        // Bidang dan teks ikut tema lewat CSS variable di global.css.
        bidang: 'var(--bidang)',
        teks: 'var(--teks)',
        garis: 'var(--garis)',
        lawan: 'var(--lawan-bidang)',
        lawanTeks: 'var(--lawan-teks)',
      },
      fontFamily: {
        /* Manrope khusus judul tebal (headline / heading); sisanya tetap Comfortaa + JetBrains Mono. */
        heading: ['Manrope', 'Comfortaa', 'ui-rounded', 'system-ui', 'sans-serif'],
        /* Copy paragraf About: Montserrat 400. Tombol tetap Comfortaa (font-sans). */
        copy: ['Montserrat', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['Comfortaa', 'ui-rounded', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
