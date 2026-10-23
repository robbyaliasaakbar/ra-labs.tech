import { Children, forwardRef, isValidElement, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react'

// Adaptasi dari reference/card-swap-components.md.
// Dibuang: 'use client', Hugeicons, foto Unsplash, tema gelap-terang template.
// Mesin tumpukan (spring, drag, urutan) dipertahankan.

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const PERSPEKTIF = 900
const TAU = Math.PI * 2
const LANGKAH = 1 / 240
const PAD = 32
const SUMBU = ['x', 'y', 'z', 'r', 'p']
const BAWAH = { x: 0, y: 1 }

const jepit = (nilai, min, maks) => Math.min(maks, Math.max(min, nilai))

const batasTumpukan = ({ lebar, tinggi, jarakKartu, jarakVertikal, kedalaman, kemiringan, terlihat, sebarHover }) => {
  const lereng = Math.tan((kemiringan * Math.PI) / 180)
  const sebar = 1 + Math.max(0, sebarHover)
  let minX = Infinity
  let maksX = -Infinity
  let minY = Infinity
  let maksY = -Infinity
  for (let i = 0; i < terlihat; i++) {
    const skala = PERSPEKTIF / (PERSPEKTIF + i * kedalaman)
    for (const u of [-lebar / 2, lebar / 2]) {
      for (const v of [-tinggi / 2, tinggi / 2]) {
        const x = (i * jarakKartu * sebar + u) * skala
        const y = (-i * jarakVertikal * sebar + v + u * lereng) * skala
        minX = Math.min(minX, x)
        maksX = Math.max(maksX, x)
        minY = Math.min(minY, y)
        maksY = Math.max(maksY, y)
      }
    }
  }
  return {
    lebar: Math.ceil(maksX - minX + PAD * 2),
    tinggi: Math.ceil(maksY - minY + PAD * 2),
    asalX: PAD - minX,
    asalY: PAD - minY,
  }
}

export const Kartu = forwardRef(({ className, children, ...rest }, ref) => (
  <div ref={ref} {...rest} className={['kartu-swap-kartu', className].filter(Boolean).join(' ')}>
    {children}
  </div>
))
Kartu.displayName = 'Kartu'

const CardSwap = forwardRef(
  (
    {
      children,
      lebar = 460,
      tinggi = 300,
      jarakKartu = 56,
      jarakVertikal = 64,
      kedalaman = 80,
      kemiringan = 0,
      terlihatKartu = 4,
      jeda = 5000,
      autoplay = true,
      jedaSaatHover = true,
      bisaDrag = true,
      kecepatan = 1,
      pegas = 0.35,
      parallax = 0.35,
      sebarHover = 0.1,
      redup = 0.5,
      radiusKartu = 0,
      perkenalan = true,
      onKartuKlik,
      onGanti,
      className = '',
    },
    ref
  ) => {
    const akarRef = useRef(null)
    const panggungRef = useRef(null)
    const slotRefs = useRef([])
    const naunganRefs = useRef([])
    const apiRef = useRef(null)
    const setelanRef = useRef(null)

    const kartu = useMemo(() => Children.toArray(children).filter(isValidElement), [children])
    const jumlah = kartu.length
    const lebarKartu = Math.max(40, Number(lebar) || 460)
    const tinggiKartu = Math.max(40, Number(tinggi) || 300)
    const terlihat = jepit(Math.round(terlihatKartu), 1, Math.max(1, jumlah))

    const batas = useMemo(
      () =>
        batasTumpukan({
          lebar: lebarKartu,
          tinggi: tinggiKartu,
          jarakKartu,
          jarakVertikal,
          kedalaman: Math.max(0, kedalaman),
          kemiringan,
          terlihat,
          sebarHover,
        }),
      [lebarKartu, tinggiKartu, jarakKartu, jarakVertikal, kedalaman, kemiringan, terlihat, sebarHover]
    )

    setelanRef.current = {
      lebar: lebarKartu,
      tinggi: tinggiKartu,
      dx: jarakKartu,
      dy: jarakVertikal,
      dz: Math.max(0, kedalaman),
      kemiringan,
      terlihat,
      jeda,
      autoplay,
      jedaSaatHover,
      bisaDrag,
      kecepatan: jepit(kecepatan, 0.1, 4),
      pegas: jepit(pegas, 0, 1),
      parallax: jepit(parallax, 0, 1),
      sebarHover: Math.max(0, sebarHover),
      redup: jepit(redup, 0, 1),
      batas,
      onKartuKlik,
      onGanti,
    }

    useImperativeHandle(
      ref,
      () => ({
        berikutnya: () => apiRef.current?.berikutnya(),
        sebelumnya: () => apiRef.current?.sebelumnya(),
        ke: posisi => apiRef.current?.ke(posisi),
      }),
      []
    )

    useIsomorphicLayoutEffect(() => {
      const akar = akarRef.current
      const panggung = panggungRef.current
      if (!akar || !panggung || !jumlah) return undefined
      const kurangi = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
      const sekarang = performance.now()
      const awal = setelanRef.current

      const dek = Array.from({ length: jumlah }, (_, index) => ({
        el: slotRefs.current[index],
        naungan: naunganRefs.current[index],
        index,
        pos: index,
        dari: index,
        tahan: 0,
        dorong: 0,
        fase: 'diam',
        arah: { x: 0, y: 1 },
        miring: 0,
        atas: 0,
        bawah: false,
        x: 0,
        y: 0,
        z: 0,
        r: 0,
        p: 0,
        v: { x: 0, y: 0, z: 0, r: 0, p: 0 },
      }))
      const keadaan = {
        urutan: dek.map(k => k.index),
        raf: 0,
        terakhir: 0,
        timer: 0,
        antre: [],
        lapis: 0,
        skala: 1,
        hover: false,
        diAtasKartu: false,
        terlihatLayar: true,
        fokusDiDalam: false,
        drag: null,
        sebar: 0,
        sebarV: 0,
        px: 0,
        py: 0,
        pvx: 0,
        pvy: 0,
        tx: 0,
        ty: 0,
        diseret: false,
        autoplay: awal.autoplay,
        jeda: awal.jeda,
      }

      const slot = (posisi, s) => {
        const q = Math.min(posisi, s.terlihat)
        const sebar = 1 + keadaan.sebar
        return { x: q * s.dx * sebar, y: -q * s.dy * sebar, z: -q * s.dz, r: 0, p: q }
      }

      const ruang = (s, arah) => Math.abs(arah.x) * s.lebar + Math.abs(arah.y) * s.tinggi + 12

      const target = (k, s, waktu) => {
        if (k.fase === 'keluar') {
          const dasar = slot(0, s)
          const jangkau = ruang(s, k.arah) * 1.3
          return { x: dasar.x + k.arah.x * jangkau, y: dasar.y + k.arah.y * jangkau, z: dasar.z, r: k.miring, p: 0 }
        }
        if (k.fase === 'masuk') {
          const dasar = slot(0, s)
          return { x: dasar.x, y: dasar.y + ruang(s, BAWAH) * 1.3, z: dasar.z, r: 0, p: k.p }
        }
        const posisi = (waktu < k.tahan ? k.dari : k.pos) + k.dorong
        return slot(Math.max(0, posisi), s)
      }

      const lapisDari = k => {
        if (k.atas) return 1000 + k.atas
        if (k.bawah) return 1
        return 10 + (jumlah - k.pos) * 2
      }

      const tulis = (k, s) => {
        const { el, naungan } = k
        if (!el) return
        el.style.transform = `translate3d(${k.x.toFixed(2)}px, ${k.y.toFixed(2)}px, ${k.z.toFixed(2)}px) rotate(${k.r.toFixed(3)}deg) skewY(${s.kemiringan}deg)`
        el.style.zIndex = String(lapisDari(k))
        const pudar = jepit(s.terlihat - k.p, 0, 1)
        el.style.opacity = pudar < 1 ? pudar.toFixed(3) : ''
        el.style.visibility = pudar <= 0.001 ? 'hidden' : ''
        if (naungan) {
          const t = jepit(k.p / Math.max(1, s.terlihat - 1), 0, 1)
          naungan.style.opacity = (s.redup * 0.62 * t).toFixed(3)
        }
        el.style.cursor = k.fase === 'drag' ? 'grabbing' : k.pos > 0 ? 'pointer' : s.bisaDrag ? 'grab' : ''
        if (k.pos === 0) el.setAttribute('data-depan', '')
        else el.removeAttribute('data-depan')
      }

      const tulisPanggung = s => {
        const ox = s.batas.asalX + keadaan.px
        const oy = s.batas.asalY + keadaan.py
        panggung.style.perspectiveOrigin = `${ox.toFixed(2)}px ${oy.toFixed(2)}px`
      }

      const integrasi = (k, tuj, omega, zeta, dt) => {
        const kk = omega * omega
        const d = 2 * zeta * omega
        const langkah = Math.max(1, Math.ceil(dt / LANGKAH))
        const h = dt / langkah
        for (let i = 0; i < langkah; i++) {
          for (const sumbu of SUMBU) {
            const v = k.v[sumbu] + (kk * (tuj[sumbu] - k[sumbu]) - d * k.v[sumbu]) * h
            k.v[sumbu] = v
            k[sumbu] += v * h
          }
        }
      }

      const skalar = (nilai, v, tuj, omega, zeta, dt) => {
        const kk = omega * omega
        const d = 2 * zeta * omega
        const langkah = Math.max(1, Math.ceil(dt / LANGKAH))
        const h = dt / langkah
        let x = nilai
        let vv = v
        for (let i = 0; i < langkah; i++) {
          vv += (kk * (tuj - x) - d * vv) * h
          x += vv * h
        }
        return [x, vv]
      }

      const frame = waktu => {
        keadaan.raf = 0
        const s = setelanRef.current
        const dt = keadaan.terakhir ? Math.min(0.05, (waktu - keadaan.terakhir) / 1000) : 1 / 60
        keadaan.terakhir = waktu
        const kecepatanSekarang = s.kecepatan
        const omegaDiam = TAU * 1.7 * kecepatanSekarang
        const zetaDiam = kurangi ? 1 : 1 - 0.72 * s.pegas
        const omegaKeluar = TAU * 1.9 * kecepatanSekarang
        let sibuk = false

        const sebarTarget = keadaan.hover && !kurangi ? s.sebarHover : 0
        ;[keadaan.sebar, keadaan.sebarV] = skalar(keadaan.sebar, keadaan.sebarV, sebarTarget, TAU * 1.4, 0.9, dt)
        ;[keadaan.px, keadaan.pvx] = skalar(keadaan.px, keadaan.pvx, kurangi ? 0 : keadaan.tx, TAU * 1.1, 1, dt)
        ;[keadaan.py, keadaan.pvy] = skalar(keadaan.py, keadaan.pvy, kurangi ? 0 : keadaan.ty, TAU * 1.1, 1, dt)
        if (
          Math.abs(keadaan.sebar - sebarTarget) > 0.0005 ||
          Math.abs(keadaan.sebarV) > 0.0005 ||
          Math.abs(keadaan.px - keadaan.tx) > 0.05 ||
          Math.abs(keadaan.py - keadaan.ty) > 0.05 ||
          Math.abs(keadaan.pvx) + Math.abs(keadaan.pvy) > 0.05
        ) {
          sibuk = true
        }
        tulisPanggung(s)

        for (const k of dek) {
          if (k.fase === 'drag') {
            sibuk = true
            tulis(k, s)
            continue
          }
          const tuj = target(k, s, waktu)
          const bergerak = k.fase === 'keluar' || k.fase === 'masuk'
          integrasi(k, tuj, bergerak ? omegaKeluar : omegaDiam, bergerak ? 1 : zetaDiam, dt)
          if (k.fase === 'keluar') {
            const dasar = slot(0, s)
            const jalan = (k.x - dasar.x) * k.arah.x + (k.y - dasar.y) * k.arah.y
            if (jalan >= ruang(s, k.arah)) {
              k.fase = 'diam'
              k.atas = 0
              k.tahan = 0
            }
          } else if (k.fase === 'masuk') {
            const dasar = slot(0, s)
            if (k.y - dasar.y >= ruang(s, BAWAH)) {
              k.fase = 'diam'
              k.bawah = false
              k.tahan = 0
            }
          }
          if (k.tahan > waktu || k.fase !== 'diam') sibuk = true
          for (const sumbu of SUMBU) {
            const batasToleransi = sumbu === 'p' ? 0.001 : 0.02
            if (Math.abs(tuj[sumbu] - k[sumbu]) > batasToleransi || Math.abs(k.v[sumbu]) > batasToleransi) sibuk = true
          }
          tulis(k, s)
        }

        if (sibuk) {
          keadaan.raf = requestAnimationFrame(frame)
        } else {
          keadaan.terakhir = 0
          for (const k of dek) if (k.atas && k.fase === 'diam') k.atas = 0
        }
      }

      const bangun = () => {
        if (!keadaan.raf) keadaan.raf = requestAnimationFrame(frame)
      }

      const jedaAktif = () => {
        const s = setelanRef.current
        return (
          !s.autoplay ||
          jumlah < 2 ||
          (s.jedaSaatHover && keadaan.diAtasKartu) ||
          keadaan.fokusDiDalam ||
          keadaan.drag ||
          !keadaan.terlihatLayar ||
          document.visibilityState === 'hidden'
        )
      }

      const jadwalkan = () => {
        clearTimeout(keadaan.timer)
        keadaan.timer = 0
        if (jedaAktif()) return
        keadaan.timer = window.setTimeout(
          () => {
            keadaan.timer = 0
            geser(1)
          },
          Math.max(1200, setelanRef.current.jeda)
        )
      }

      const diamkan = (waktu, jedaAntar) => {
        keadaan.urutan.forEach((index, posisi) => {
          const k = dek[index]
          if (k.pos === posisi) return
          k.dari = k.pos
          k.pos = posisi
          k.tahan = waktu + Math.max(0, posisi) * jedaAntar
        })
      }

      const geser = (arah, opsi = {}) => {
        if (jumlah < 2) return
        const s = setelanRef.current
        const waktu = performance.now()
        const jedaAntar = 0.05 / s.kecepatan
        if (arah > 0) {
          const depan = dek[keadaan.urutan[0]]
          keadaan.urutan = [...keadaan.urutan.slice(1), depan.index]
          diamkan(waktu, jedaAntar * 1000)
          depan.fase = 'keluar'
          depan.arah = opsi.arah ?? BAWAH
          depan.miring = opsi.miring ?? 0
          depan.atas = ++keadaan.lapis
          depan.bawah = false
          depan.dorong = 0
          depan.tahan = 0
          if (opsi.kecepatanAwal) {
            depan.v.x = opsi.kecepatanAwal.x
            depan.v.y = opsi.kecepatanAwal.y
          }
        } else {
          const belakang = dek[keadaan.urutan[jumlah - 1]]
          keadaan.urutan = [belakang.index, ...keadaan.urutan.slice(0, jumlah - 1)]
          diamkan(waktu, jedaAntar * 1000)
          belakang.fase = 'masuk'
          belakang.atas = 0
          belakang.bawah = true
          belakang.dorong = 0
          belakang.tahan = 0
        }
        dek.forEach(k => {
          if (k.fase === 'diam') k.dorong = 0
        })
        s.onGanti?.(keadaan.urutan[0])
        bangun()
        jadwalkan()
      }

      const ke = posisi => {
        keadaan.antre.forEach(clearTimeout)
        keadaan.antre = []
        const jarak = 110 / setelanRef.current.kecepatan
        for (let i = 0; i < posisi; i++) keadaan.antre.push(window.setTimeout(() => geser(1), i * jarak))
      }

      const muat = () => {
        const s = setelanRef.current
        const w = akar.clientWidth
        const h = akar.clientHeight
        const skala = Math.min(1, w / s.batas.lebar, h > 0 ? h / s.batas.tinggi : 1)
        keadaan.skala = skala > 0 ? skala : 1
        panggung.style.transform = `translate(-50%, -50%) scale(${keadaan.skala.toFixed(4)})`
      }

      const lokal = event => {
        const kotak = akar.getBoundingClientRect()
        return { x: event.clientX - kotak.left, y: event.clientY - kotak.top, w: kotak.width, h: kotak.height }
      }

      const onMove = event => {
        const s = setelanRef.current
        if (event.pointerType !== 'touch') {
          const titik = lokal(event)
          const nx = jepit((titik.x / Math.max(1, titik.w)) * 2 - 1, -1, 1)
          const ny = jepit((titik.y / Math.max(1, titik.h)) * 2 - 1, -1, 1)
          keadaan.tx = nx * s.parallax * 0.35 * s.batas.lebar
          keadaan.ty = ny * s.parallax * 0.35 * s.batas.tinggi
          keadaan.hover = true
          const diAtas = Boolean(event.target.closest?.('[data-swap-index]'))
          if (diAtas !== keadaan.diAtasKartu) {
            keadaan.diAtasKartu = diAtas
            jadwalkan()
          }
          bangun()
        }
        const drag = keadaan.drag
        if (!drag || drag.id !== event.pointerId) return
        const dx = (event.clientX - drag.mulaiX) / keadaan.skala
        const dy = (event.clientY - drag.mulaiY) / keadaan.skala
        if (!drag.aktif) {
          if (Math.hypot(dx, dy) < 5) return
          drag.aktif = true
          keadaan.diseret = true
          const k = dek[drag.index]
          k.fase = 'drag'
          k.v = { x: 0, y: 0, z: 0, r: 0, p: 0 }
          akar.setPointerCapture?.(event.pointerId)
          akar.style.cursor = 'grabbing'
        }
        const k = dek[drag.index]
        const dasar = slot(0, s)
        k.x = dasar.x + dx
        k.y = dasar.y + dy
        k.z = dasar.z
        k.r = jepit(dx * 0.035, -9, 9)
        k.p = 0
        const waktu = performance.now()
        drag.contoh.push({ x: k.x, y: k.y, t: waktu })
        while (drag.contoh.length > 2 && waktu - drag.contoh[0].t > 90) drag.contoh.shift()
        const progres = jepit(Math.hypot(dx, dy) / (Math.min(s.lebar, s.tinggi) * 0.3), 0, 1)
        const berikut = dek[keadaan.urutan[1]]
        if (berikut && berikut.fase === 'diam') berikut.dorong = -0.22 * progres
        bangun()
      }

      const onLeave = event => {
        if (event.pointerType === 'touch') return
        if (keadaan.drag?.aktif) return
        keadaan.hover = false
        keadaan.diAtasKartu = false
        keadaan.tx = 0
        keadaan.ty = 0
        jadwalkan()
        bangun()
      }

      const onDown = event => {
        const s = setelanRef.current
        keadaan.diseret = false
        if (!s.bisaDrag || event.button > 0 || jumlah < 2) return
        const tuj = event.target.closest?.('[data-swap-index]')
        if (!tuj || !akar.contains(tuj)) return
        const index = Number(tuj.getAttribute('data-swap-index'))
        if (index !== keadaan.urutan[0] || dek[index].fase !== 'diam') return
        keadaan.drag = { id: event.pointerId, index, mulaiX: event.clientX, mulaiY: event.clientY, aktif: false, contoh: [] }
        jadwalkan()
      }

      const onUp = event => {
        const drag = keadaan.drag
        if (!drag || drag.id !== event.pointerId) return
        keadaan.drag = null
        akar.style.cursor = ''
        if (!drag.aktif) {
          jadwalkan()
          return
        }
        akar.releasePointerCapture?.(event.pointerId)
        const s = setelanRef.current
        const k = dek[drag.index]
        const dasar = slot(0, s)
        const awalContoh = drag.contoh[0]
        const akhirContoh = drag.contoh[drag.contoh.length - 1]
        const rentang = awalContoh && akhirContoh ? Math.max(0.016, (akhirContoh.t - awalContoh.t) / 1000) : 1
        const kecepatanAwal =
          awalContoh && akhirContoh && akhirContoh !== awalContoh
            ? { x: (akhirContoh.x - awalContoh.x) / rentang, y: (akhirContoh.y - awalContoh.y) / rentang }
            : { x: 0, y: 0 }
        const geseran = { x: k.x - dasar.x, y: k.y - dasar.y }
        const jarak = Math.hypot(geseran.x, geseran.y)
        const lempar = Math.hypot(kecepatanAwal.x, kecepatanAwal.y)
        const berikut = dek[keadaan.urutan[1]]
        if (berikut) berikut.dorong = 0
        if (event.type !== 'pointercancel' && (jarak > Math.min(s.lebar, s.tinggi) * 0.3 || lempar > 700)) {
          const bidik = { x: geseran.x + kecepatanAwal.x * 0.12, y: geseran.y + kecepatanAwal.y * 0.12 }
          const panjang = Math.hypot(bidik.x, bidik.y) || 1
          k.fase = 'diam'
          geser(1, { arah: { x: bidik.x / panjang, y: bidik.y / panjang }, miring: k.r, kecepatanAwal })
        } else {
          k.fase = 'diam'
          k.v.x = kecepatanAwal.x
          k.v.y = kecepatanAwal.y
          bangun()
          jadwalkan()
        }
      }

      const onClick = event => {
        if (keadaan.diseret) {
          // Habis menyeret: jangan sampai tautan ikut terbuka.
          keadaan.diseret = false
          event.preventDefault()
          return
        }
        const tuj = event.target.closest?.('[data-swap-index]')
        if (!tuj || !akar.contains(tuj)) return
        const index = Number(tuj.getAttribute('data-swap-index'))
        const posisi = keadaan.urutan.indexOf(index)
        // Kartu belakang: majukan dulu, jangan buka tautannya.
        if (posisi > 0) {
          event.preventDefault()
          ke(posisi)
        }
        setelanRef.current.onKartuKlik?.(index)
      }

      const onFocusIn = () => {
        keadaan.fokusDiDalam = true
        jadwalkan()
      }
      const onFocusOut = event => {
        if (akar.contains(event.relatedTarget)) return
        keadaan.fokusDiDalam = false
        jadwalkan()
      }

      const onVisibility = () => jadwalkan()

      apiRef.current = {
        berikutnya: () => geser(1),
        sebelumnya: () => geser(-1),
        ke,
        refresh: () => {
          const s = setelanRef.current
          dek.forEach(k => {
            const el = slotRefs.current[k.index]
            const naungan = naunganRefs.current[k.index]
            if (el === k.el && naungan === k.naungan) return
            k.el = el
            k.naungan = naungan
            tulis(k, s)
          })
          if (s.autoplay !== keadaan.autoplay || s.jeda !== keadaan.jeda) {
            keadaan.autoplay = s.autoplay
            keadaan.jeda = s.jeda
            jadwalkan()
          }
          muat()
          bangun()
        },
      }

      if (perkenalan && !kurangi) {
        dek.forEach(k => {
          k.dari = 0
          k.tahan = sekarang + (k.pos * 70) / awal.kecepatan
        })
        panggung.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' })
      } else {
        dek.forEach(k => Object.assign(k, slot(k.pos, awal)))
      }
      muat()
      tulisPanggung(awal)
      dek.forEach(k => tulis(k, awal))
      bangun()

      const pengamatUkuran = new ResizeObserver(muat)
      pengamatUkuran.observe(akar)
      const pengamatTampil = new IntersectionObserver(entries => {
        keadaan.terlihatLayar = entries[entries.length - 1]?.isIntersecting ?? true
        jadwalkan()
      })
      pengamatTampil.observe(akar)
      akar.addEventListener('pointermove', onMove)
      akar.addEventListener('pointerleave', onLeave)
      akar.addEventListener('pointerdown', onDown)
      akar.addEventListener('pointerup', onUp)
      akar.addEventListener('pointercancel', onUp)
      akar.addEventListener('click', onClick)
      akar.addEventListener('focusin', onFocusIn)
      akar.addEventListener('focusout', onFocusOut)
      document.addEventListener('visibilitychange', onVisibility)
      jadwalkan()

      return () => {
        cancelAnimationFrame(keadaan.raf)
        clearTimeout(keadaan.timer)
        keadaan.antre.forEach(clearTimeout)
        pengamatUkuran.disconnect()
        pengamatTampil.disconnect()
        akar.removeEventListener('pointermove', onMove)
        akar.removeEventListener('pointerleave', onLeave)
        akar.removeEventListener('pointerdown', onDown)
        akar.removeEventListener('pointerup', onUp)
        akar.removeEventListener('pointercancel', onUp)
        akar.removeEventListener('click', onClick)
        akar.removeEventListener('focusin', onFocusIn)
        akar.removeEventListener('focusout', onFocusOut)
        document.removeEventListener('visibilitychange', onVisibility)
        apiRef.current = null
      }
    }, [jumlah])

    useIsomorphicLayoutEffect(() => {
      apiRef.current?.refresh()
    })

    const onKeyDown = event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        apiRef.current?.berikutnya()
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        apiRef.current?.sebelumnya()
      }
    }

    const gayaAkar = {
      width: '100%',
      height: '100%',
      '--swap-w': `${lebarKartu}px`,
      '--swap-h': `${tinggiKartu}px`,
      '--swap-ox': `${batas.asalX}px`,
      '--swap-oy': `${batas.asalY}px`,
      '--swap-stage-w': `${batas.lebar}px`,
      '--swap-stage-h': `${batas.tinggi}px`,
      '--swap-ratio': `${batas.lebar} / ${batas.tinggi}`,
      '--swap-radius': `${Math.max(0, radiusKartu)}px`,
    }

    return (
      <div
        ref={akarRef}
        className={`kartu-swap ${className}`}
        style={gayaAkar}
        tabIndex={0}
        role="region"
        aria-roledescription="korsel"
        aria-label="Daftar proyek"
        onKeyDown={onKeyDown}
      >
        <div className="kartu-swap-pengukur" aria-hidden="true">
          <span />
        </div>
        <div ref={panggungRef} className="kartu-swap-panggung">
          {kartu.map((isi, index) => (
            <div
              key={index}
              ref={node => {
                slotRefs.current[index] = node
              }}
              className="kartu-swap-slot"
              data-swap-index={index}
            >
              {isi}
              <span
                ref={node => {
                  naunganRefs.current[index] = node
                }}
                className="kartu-swap-naungan"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }
)

CardSwap.displayName = 'CardSwap'
export default CardSwap
