/* Deteksi profil perangkat untuk setelan grafis adaptif (Issue #2 & #11).
   - Mobile / sentuh: pointer coarse.
   - Perangkat hemat daya / core rendah: hardwareConcurrency <= 4.
   Catatan: Hindari navigator.deviceMemory karena tidak didukung di Safari iOS. */

export function bacaSetelanGrafis() {
  if (typeof window === 'undefined') {
    return {
      mobile: false,
      hematDaya: false,
      detail: 'high',
      dpr: undefined,
    }
  }

  const isCoarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false
  const isLayarKecil = window.innerWidth <= 768
  const coreRendah = (navigator.hardwareConcurrency ?? 8) <= 4
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

  const mobile = isCoarse || isLayarKecil
  const hematDaya = mobile || coreRendah || reduceMotion

  return {
    mobile,
    hematDaya,
    detail: hematDaya ? (coreRendah && isLayarKecil ? 'low' : 'medium') : 'high',
    dpr: hematDaya ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 2),
  }
}
