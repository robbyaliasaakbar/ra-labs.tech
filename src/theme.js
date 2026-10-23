const KUNCI = 'ralabs-tema'

export function bacaTema() {
  const tersimpan = localStorage.getItem(KUNCI)
  if (tersimpan === 'terang' || tersimpan === 'gelap') return tersimpan
  return 'gelap'
}

export function pasangTema(tema) {
  document.documentElement.setAttribute('data-theme', tema)
  localStorage.setItem(KUNCI, tema)
}
