import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

/* Folder decoder Draco di server.
   File-nya diletakkan di public/assets/ (bukan public/draco/) supaya ikut
   terbawa ritual deploy yang sudah ada:
     cp dist/assets/* assets/
   File di dalam public/ langsung disalin Vite ke dist/ dengan path sama.
   Kalau diletakkan di folder (misal public/draco/), ritual itu tidak
   menyalinnya: cp tanpa -r melewati folder. Decoder-nya hilang di
   produksi: mark InDeep tidak muncul, tanpa error yang kelihatan di layar.

   Wajib lokal, bukan CDN: shared hosting harus jalan tanpa bergantung
   pihak ketiga, dan tidak boleh lambat saat CDN lagi lambat. */
const JALUR_DRACO = '/assets/'

/* Satu decoder Draco untuk seluruh halaman, bukan satu per komponen.
   Decoder bikin worker browser + unduh file .wasm, jadi bikin banyak
   berarti unduh berulang. Contohnya ada dua mark di hero yang dua-duanya
   lewat Mark3D: tanpa begini, file yang sama terunduh dua kali.

   Contohnya lifecycle begini:
   1. Komponen memanggil buatLoaderGLTF().
   2. Loader dibuat, decoder menempel.
   3. Aset dimuat. Kalau mesh-nya dikompresi Draco, decoder dipakai.
   4. Kalau tidak, decoder tidak pernah dipakai, file .wasm tidak diunduh.

   Worker dan file .wasm baru dibuat saat decode pertama benar-benar jalan,
   bukan saat loader dibuat. Jadi aset yang tidak dikompresi tidak menarik
   file apa pun. */
let draco = null

function ambilDraco() {
  if (!draco) {
    draco = new DRACOLoader()
    draco.setDecoderPath(JALUR_DRACO)
  }
  return draco
}

/* Loader GLTF yang siap decode mesh Draco.
   Dipakai di Logo3D.jsx, LogoGerbang.jsx, dan Mark3D.jsx supaya semua
   aset .glb punya jalur buka yang sama. */
export function buatLoaderGLTF() {
  const loader = new GLTFLoader()
  loader.setDRACOLoader(ambilDraco())
  return loader
}
