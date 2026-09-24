# Panduan Pengembangan Frontend PahamTeks

Halo rekan tim frontend! Dokumen ini dibuat agar siapa pun yang baru bergabung ke tim antarmuka **PahamTeks** bisa langsung memahami bagaimana susunan komponen React kita bekerja, bagaimana mengatur gaya tampilan di CSS, dan bagaimana data mengalir dari layar pengguna ke server.

---

## 🎨 Gambaran Umum: Apa Tugas Frontend Kita?

Frontend adalah "wajah" dari PahamTeks. Semua hal yang bisa dilihat, diklik, didengar suaranya, dan disentuh oleh pemelajar di layar laptop atau ponsel diatur di sini:
* Menampilkan tata letak kartu kuis, animasi tombol, dan maskot Teksie yang ramah.
* Mengatur pergantian tab navigasi (Belajar Bahasa, Tantangan Koding, Kamus Pintar, Penerjemah).
* Mengirim permintaan data ke backend melalui Apollo Client GraphQL dan menyajikan balasannya tanpa perlu reload halaman.

Teknologi utama yang kita pakai:
1. **React 18**: Pustaka antarmuka berbasis komponen.
2. **Vite 6**: Alat build lokal yang sangat kencang dan instan.
3. **Apollo Client**: Pustaka resmi untuk berinteraksi dengan API GraphQL.
4. **Pure CSS (`client/src/styles/index.css`)**: Seluruh gaya desain dipusatkan di satu file CSS tanpa framework yang rumit.
5. **Web Speech API**: Pengucapan audio alami untuk kosakata bahasa asing.

---

## 📂 Peta Struktur Folder `client/`

Berikut denah berkas yang ada di dalam folder frontend:

```text
client/
├── src/
│   ├── main.jsx                     <- Pintu masuk aplikasi React & pembungkus ApolloProvider
│   ├── App.jsx                      <- Komponen induk pengatur navigasi tab & autentikasi
│   ├── components/                  <- Kumpulan komponen antarmuka mandiri
│   │   ├── QuizView.jsx             <- Layar kuis utama (Bab 1–5, timer, dan evaluasi skor)
│   │   ├── DictionaryView.jsx       <- Layar Kamus Pintar AI & Glosarium A–Z
│   │   ├── KamusFloating.jsx        <- Tombol mengambang (floating button) untuk akses kamus cepat
│   │   ├── CombinedDictTranslator.jsx <- Wadah gabungan kamus dan penerjemah
│   │   └── HumanFormattedText.jsx   <- Perender teks markdown ramah pembaca untuk jawaban AI
│   ├── graphql/
│   │   ├── queries.js               <- Kumpulan kueri data GraphQL (GET_QUIZ, GET_DICTIONARY, dll)
│   │   └── mutations.js             <- Kumpulan aksi mutasi data (LOGIN, REGISTER, EXPLAIN_ANSWER)
│   ├── styles/
│   │   └── index.css                <- Sumber utama seluruh gaya tampilan dan variabel tema
│   └── utils/
│       ├── quizUtils.js             <- Utilitas pemeriksa kunci jawaban kuis (LETTERS, isOptionCorrect)
│       └── speechUtils.js           <- Fungsi bersama untuk memutar suara pengucapan (speakText)
├── index.html                       <- Template HTML dasar & pemanggil font Nunito
├── vite.config.js                   <- Pengaturan port 3000, host jaringan, dan proxy backend
└── package.json
```

---

## 🎨 Filosofi Desain: Mengapa Pure CSS di `index.css`?

Di PahamTeks, kita sengaja tidak menggunakan Tailwind CSS atau Bootstrap. Alasannya sederhana:
1. **Ringan & Bebas Pembengkakan (*Zero Bloat*)**: Ukuran bundle aplikasi kita tetap sangat kecil (file CSS hanya sekitar ~59 KB).
2. **Mudah Dirawat & Ditemukan**: Nama class kita sangat semantik dan mudah ditebak, contohnya `.quiz-card`, `.btn-huge`, `.timer-bar`, dan `.unit-card`.
3. **Variabel Warna Terpusat**: Seluruh palet warna (hijau mint, biru toska, abu lembut) tersimpan di blok `:root` pada baris-baris awal `client/src/styles/index.css`. Jika ingin mengubah nuansa warna aplikasi, kamu cukup mengganti nilai variabel di sana!

---

## 🔄 Bagaimana Data Mengalir di Komponen Kita?

Berikut contoh nyata saat pemelajar mencari kata di Kamus Pintar ([`DictionaryView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/DictionaryView.jsx)):

```
[ Input Pengguna ] -> ketik "syntax" lalu klik tombol "Cari"
         │
         ▼
[ Handler React ] -> panggil fetchDictionary({ variables: { keyword: 'syntax', lang: 'id' } })
         │
         ▼
[ Apollo Client ] -> mengirim POST request ke endpoint /graphql
         │
         ▼
[ State React ] -> update setResult(res.data.dictionary.result)
         │
         ▼
[ Tampilan UI ] -> HumanFormattedText merender penjelasan berformat rapi di layar
```

Semua kueri GraphQL sudah disiapkan di folder `client/src/graphql/`. Kamu tinggal mengimpor kueri yang dibutuhkan dan menjalankannya menggunakan hook `useQuery` atau `useLazyQuery`.

---

## 🗣️ Cara Menambahkan Suara Pengucapan (Speech Synthesis)

Jika kamu membuat komponen baru yang membutuhkan tombol pemutar suara (misal melafalkan kosakata baru), **selalu gunakan utilitas bersama** di `client/src/utils/speechUtils.js`:

```javascript
import { speakText } from '../utils/speechUtils';

// Cara pakai saat tombol speaker diklik:
const handleDengarkan = () => {
  speakText("Bonjour, comment ça va?", "fr"); // Parameter: (teks, kode_bahasa)
};
```
Fungsi ini otomatis menangani pilihan aksen suara terbaik di browser pemelajar dan membersihkan simbol markdown sebelum suara dibunyikan.

---

## 🛑 Aturan Penting Koding Frontend (Zero AI Slop)

1. **Dilarang Keras Menggunakan `alert()` Browser Bawaan**:
   Dialog `alert()` bawaan browser terasa kaku dan merusak estetika aplikasi. Selalu gunakan status teks ramah di kartu komponen atau modal notifikasi yang serasi dengan tema web.
2. **Gunakan Kembali Utilitas Bersama**:
   Jangan menulis ulang logika pengecekan opsi kuis atau pemutar suara di sembarang tempat. Gunakan `quizUtils.js` dan `speechUtils.js`.
3. **Wajib Verifikasi Build Sebelum Selesai**:
   Sebelum mengakhiri pekerjaan atau menyerahkan tugas ke rekan lain, wajib jalankan perintah verifikasi build di terminal:
   ```powershell
   npm --prefix client run build
   ```
   Pastikan hasilnya berstatus sukses (`✓ built in X.XXs`) tanpa ada error kompilasi.

---

## 🛠️ Tutorial: Cara Menjalankan Frontend di Komputer Kamu

Buka terminal di root project, lalu ketik:
```powershell
npm --prefix client run dev
```
Buka browser di alamat: `http://localhost:3000`.  
Setiap kali kamu menyimpan perubahan file di `client/src/`, tampilan di browser akan otomatis terbarui secara instan (*Hot Module Replacement*)!
