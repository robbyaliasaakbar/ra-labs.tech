import { motion, useReducedMotion } from 'framer-motion'

/* FadeIn: pembungkus animasi masuk (masuk saat terlihat, sekali saja).
   Yang mengatur geraknya cuma props delay/y/x, biar Hero tinggal menata ronde
   animate: langsung jalan saat mount (buat above-fold kayak headline hero).
   whileInView: nunggu masuk viewport (buat section bawah).
   Firefox + overflow-hidden ancestor = whileInView kadang nggak nembak,
   headline ketahan opacity 0. Makanya hero WAJIB animate. */
export default function FadeIn({
  delay = 0,
  y = 30,
  x = 0,
  duration = 0.7,
  className = '',
  animateOnMount = false,
  children,
}) {
  /* OS aktifkan "reduce motion" → elemen langsung tampak, no animation. */
  const kurangGerak = useReducedMotion()

  if (kurangGerak) {
    return <div className={className}>{children}</div>
  }

  if (animateOnMount) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, x, y }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px' }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
