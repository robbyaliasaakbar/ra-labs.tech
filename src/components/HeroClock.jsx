import { useEffect, useState } from 'react'

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

/* Jam lokal browser, bukan WIB. Nama hari dan bulan dikunci bahasa Indonesia
   supaya tidak ikut bahasa OS. */
function bacaJam(sekarang = new Date()) {
  const jam = String(sekarang.getHours()).padStart(2, '0')
  const menit = String(sekarang.getMinutes()).padStart(2, '0')
  const detik = String(sekarang.getSeconds()).padStart(2, '0')
  const tanggal = `${HARI[sekarang.getDay()]}, ${sekarang.getDate()} ${BULAN[sekarang.getMonth()]} ${sekarang.getFullYear()}`
  const iso = [
    sekarang.getFullYear(),
    String(sekarang.getMonth() + 1).padStart(2, '0'),
    String(sekarang.getDate()).padStart(2, '0'),
  ].join('-') + `T${jam}:${menit}:${detik}`

  return { tanggal, jam, menit, detik, iso }
}

export default function HeroClock() {
  const [waktu, setWaktu] = useState(bacaJam)

  useEffect(() => {
    let timer
    const tick = () => {
      setWaktu(bacaJam())
      timer = setTimeout(tick, 1000 - (Date.now() % 1000))
    }
    tick()
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="hero-jam">
      <p className="hero-jam-tanggal">{waktu.tanggal}</p>
      <p className="hero-jam-angka">
        <time dateTime={waktu.iso}>
          {waktu.jam}
          <span className="hero-jam-titik">:</span>
          {waktu.menit}
          <span className="hero-jam-titik">:</span>
          {waktu.detik}
        </time>
      </p>
    </div>
  )
}
