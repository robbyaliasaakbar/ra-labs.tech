import Tilt from 'react-parallax-tilt'
import { useReducedMotion } from 'framer-motion'
import './TiltTombol.css'

/* TiltTombol: bungkus tombol/tag <a> supaya miring ngikutin arah mouse.
   - Efeknya cuma saat kursor di atas elemen (bukan seluruh layar).
   - Sudut 22°: pill cuma ~44px tinggi. Di elemen sekecil ini sudut 8°
     pergeserannya cuma beberapa pixel dan tidak kelihatan.
   - perspective 800 (library 1000, sebelumnya 400). 400 terlalu dekat,
     jadi pill melengkung kasar. 800 masih ada kedalaman, bentuknya tetap rapi.
   - transitionSpeed 0: timing tidak diambil dari library. CSS yang pegang
     (lihat TiltTombol.css): ikut kursor 140ms, balik rata 480ms.
   - reset: balik rata saat mouse keluar.
   - OS pakai reduce-motion -> Tilt dimatikan, anak langsung dirender polos. */
export default function TiltTombol({ className = '', children }) {
  const kurangGerak = useReducedMotion()

  if (kurangGerak) {
    return <div className={className}>{children}</div>
  }

  return (
    <Tilt
      className={`tilt-tombol ${className}`.trim()}
      tiltMaxAngleX={22}
      tiltMaxAngleY={22}
      perspective={800}
      scale={1.05}
      transitionSpeed={0}
      gyroscope={false}
      reset
    >
      {children}
    </Tilt>
  )
}
