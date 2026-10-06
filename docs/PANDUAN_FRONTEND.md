# Panduan Lengkap Pengembangan Frontend PahamTeks

Selamat datang rekan tim frontend! Dokumen ini disusun secara lengkap dan mendalam agar siapa pun yang baru bergabung ke tim pengembang antarmuka **PahamTeks** bisa langsung memahami: **apa itu frontend, bagian-bagian penyusunnya, cara kerja komponen, dan alur koding praktis dari nol**.

---

## 💡 Apa Itu Frontend Sebenarnya? (Analogi Sederhana)

Bayangkan PahamTeks seperti sebuah **restoran modern**:
* **Frontend** adalah seluruh **ruang makan restoran**: desain interior meja dan kursi yang nyaman, buku menu yang rapi, senyuman pelayan, hingga piring dan sendok yang digunakan tamu.
* Semua hal yang bisa **dilihat matanya, diklik jarinya, didengar suaranya, dan dirasakan animasinya** oleh pemelajar di layar laptop atau HP adalah wilayah kerja **Frontend**.
* Frontend tidak menyimpan database rahasia pengguna; tugas frontend adalah menyajikan data dari dapur (backend) secara menarik, cepat, dan ramah pengguna.

---

## 🧱 Frontend PahamTeks Itu Terdiri dari Apa Saja?

Di dalam folder `client/`, aplikasi frontend kita tersusun dari **7 pilar utama**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PAHAMTEKS                              │
├────────────────────────────────────────────────────────────────────────┤
│ 1. KOMPONEN UI        : 19 Komponen React mandiri (Layar kuis, kamus) │
│ 2. STATE MANAGEMENT   : React Hooks (useState, useEffect, useContext)  │
│ 3. LAPISAN DATA       : Apollo Client v3 (Kueri GraphQL & Mutasi)      │
│ 4. DESAIN & STYLING   : Pure CSS Semantik di index.css (Zero Bloat)    │
│ 5. MULTIMEDIA AUDIO   : Web Speech API (Pelafalan suara bahasa asing)  │
│ 6. MASKOT REAKTIF     : Sahabat belajar virtual "Teksie"               │
│ 7. MODAL NOTIFIKASI   : Dialog elegan tengah layar (Pengganti alert()) │
└────────────────────────────────────────────────────────────────────────┘
```

Mari kita bedah satu per satu setiap pilar di atas:

### 1. Komponen Antarmuka (React 18 Components)
Aplikasi dibangun menggunakan prinsip lego: layar besar disusun dari pecahan-pecahan komponen kecil yang dapat digunakan kembali (*reusable*). Setiap komponen berada di `client/src/components/`.

### 2. State Management (Penyimpanan Status Sementara)
Frontend perlu mengingat hal-hal yang sedang terjadi di layar pengguna, contohnya:
* Soal kuis nomor berapa yang sedang dikerjakan? (`currentQuestionIndex`)
* Apakah pengguna sudah memilih jawaban A, B, C, atau D? (`selectedAnswer`)
* Apakah modal login sedang terbuka atau tertutup? (`isAuthOpen`)
* Siapa pengguna yang sedang login saat ini? (`currentUser`)

Semua ini dikelola menggunakan **React Hooks bawaan** (`useState`, `useEffect`, `useCallback`) tanpa memerlukan pustaka rumit seperti Redux yang memperberat ukuran aplikasi.

### 3. Lapisan Komunikasi Data (Apollo Client GraphQL)
Frontend tidak menggunakan `axios` atau `fetch` manual yang berserakan. Semua permintaan data ke server dibungkus oleh **Apollo Client**:
* **Query** (`useQuery` / `useLazyQuery`): Untuk *mengambil* data dari server (misal: mengambil soal kuis, mencari kosakata di kamus).
* **Mutation** (`useMutation`): Untuk *mengubah atau menyimpan* data ke server (misal: mendaftar akun baru, login, menyimpan skor kuis).

### 4. Desain & Estetika (Pure CSS di `index.css`)
Seluruh tampilan grafis diatur di satu berkas terpusat: `client/src/styles/index.css`:
* **Kenapa tidak pakai Tailwind atau Bootstrap?** Karena CSS murni membuat bundle aplikasi sangat kecil (~59 KB) dan loading secepat kilat (*zero runtime bloat*).
* Memakai variabel warna global di blok `:root` sehingga tema aplikasi sangat mudah diganti secara seragam.

### 5. Sintesis Audio Alami (Web Speech API)
Untuk fitur belajar bahasa asing (Inggris, Prancis, Jepang, Jerman), pemelajar perlu mendengar cara pengucapan kata yang tepat. Frontend memanfaatkan mesin suara native browser melalui utilitas bersama `client/src/utils/speechUtils.js`.

### 6. Sahabat Maskot Interaktif (Teksie)
PahamTeks memiliki maskot pintar bernama **Teksie** (`TeksieMascotCompanion.jsx`). Teksie bukan gambar mati; dia memiliki mesin *state* internal:
* Jika pengguna diam selama beberapa puluh detik: Teksie masuk mode tidur (*idle state*).
* Jika pengguna menjawab kuis dengan benar: Teksie melompat gembira.
* Jika pengguna salah menjawab: Teksie memberikan ekspresi ramah yang menyemangati.

### 7. Modal & Notifikasi Terpadu
Untuk menjaga pengalaman pengguna tetap profesional, PahamTeks **mengharamkan popup `alert()` bawaan browser** yang kaku. Seluruh pesan sukses, konfirmasi, atau error disajikan via `CenterNotificationModal.jsx`.

---

## 🌳 Pohon Komponen Aplikasi (Component Tree)

Berikut gambaran bagaimana satu komponen memanggil komponen lainnya di dalam React:

```text
main.jsx (Pembungkus ApolloProvider)
└── App.jsx (Navigasi Tab Utama, State Autentikasi, & Notifikasi)
    ├── Navbar.jsx (Header atas, profil pengguna, tombol ganti tab)
    ├── BackgroundDrift.jsx (Efek latar belakang melayang halus)
    ├── TeksieMascotCompanion.jsx (Maskot mengambang interaktif)
    ├── KamusFloating.jsx (Tombol akses cepat kamus pintar di sudut layar)
    ├── AuthModal.jsx (Popup login, register, OTP email, reset password)
    ├── CenterNotificationModal.jsx (Popup notifikasi informasi/error)
    │
    └── [ LAYAR AKTIF BERDASARKAN TAB ]
        ├── WelcomePortal.jsx / HomeHero.jsx  -> Tab "Beranda"
        ├── QuizView.jsx                      -> Tab "Belajar Kuis" (Unit 1–5)
        ├── CombinedDictTranslator.jsx        -> Tab "Kamus & Terjemahan"
        │   ├── DictionaryView.jsx (Kamus Pintar & Glosarium A-Z)
        │   └── Translator.jsx (Penerjemah kalimat AI)
        ├── ChallengeView.jsx                 -> Tab "Tantangan Harian"
        ├── DashboardView.jsx                 -> Tab "Statistik & Progres"
        └── LanguageInsights.jsx              -> Tab "Wawasan Bahasa"
```

---

## 📂 Peta Lengkap File & Folder Frontend (`client/`)

```text
client/
├── package.json                         <- Daftar pustaka & perintah skrip ("dev", "build")
├── vite.config.js                       <- Konfigurasi Vite: port 3000, network host, dan proxy
├── index.html                           <- Template HTML tunggal tempat React ditempelkan (root)
└── src/
    ├── main.jsx                         <- Titik masuk aplikasi: konfigurasi Apollo Client & Provider
    ├── App.jsx                          <- Pusat kendali tab, sesi login pengguna, dan modal global
    │
    ├── components/                      <- Seluruh komponen antarmuka pengguna (19 file)
    │   ├── Art2DIcons.jsx               <- Kumpulan ikon SVG 2D kustom
    │   ├── AuthModal.jsx                <- Form modal login, registrasi, OTP, & reset password
    │   ├── BackgroundDrift.jsx          <- Partikel latar belakang animasi ringan
    │   ├── CenterNotificationModal.jsx  <- Modal tengah layar pengganti alert()
    │   ├── ChallengeView.jsx            <- Layar tantangan koding & kuis harian
    │   ├── CombinedDictTranslator.jsx   <- Wadah penyatu kamus dan translator
    │   ├── DashboardView.jsx            <- Layar progres skor dan statistik belajar
    │   ├── DictionaryView.jsx           <- Layar kamus AI dan glosarium A–Z
    │   ├── HomeHero.jsx                 <- Banner penyambut di beranda
    │   ├── HumanFormattedText.jsx       <- Perender jawaban AI menjadi markdown ramah baca
    │   ├── KamusFloating.jsx            <- Tombol melayang cepat untuk membuka kamus
    │   ├── LanguageInsights.jsx         <- Layar eksplorasi wawasan dan tips bahasa
    │   ├── LearningHub.jsx              <- Pusat materi teori pembelajaran
    │   ├── MiniCharacters.jsx           <- Ilustrasi grafis 2D pendukung materi
    │   ├── Navbar.jsx                   <- Navigasi atas dan status akun pengguna
    │   ├── QuizView.jsx                 <- Layar kuis adaptif utama (Unit 1–5)
    │   ├── TeksieMascotCompanion.jsx    <- Maskot pintar interaktif Teksie
    │   ├── Translator.jsx               <- Layar penerjemah teks multi-bahasa
    │   └── WelcomePortal.jsx            <- Portal pemilihan jalur belajar (Bahasa vs Koding)
    │
    ├── graphql/                         <- Kontrak kueri data ke backend
    │   ├── queries.js                   <- Kueri: GET_QUIZ, GET_DICTIONARY, GET_PROFILE, dll
    │   └── mutations.js                 <- Mutasi: LOGIN, REGISTER, SAVE_QUIZ_SCORE, dll
    │
    ├── styles/
    │   └── index.css                    <- Sumber tunggal seluruh desain CSS (Design Tokens)
    │
    └── utils/                           <- Utilitas bersama (Wajib digunakan ulang)
        ├── quizUtils.js                 <- Validasi jawaban kuis (LETTERS, isOptionCorrect)
        └── speechUtils.js               <- Pemutar audio sintesis ucapan multi-bahasa
```

### 🧭 Panduan Arah & Lokasi Cepat Berkas Frontend

Gunakan tabel kompas ini jika kamu mencari letak berkas spesifik di frontend:

| Jika Kamu Ingin Mencari / Mengubah... | Lokasi Berkas Persis (Path Lengkap) |
| :--- | :--- |
| **Navigasi tab utama, sesi login pengguna, & layout induk** | [`client/src/App.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/App.jsx) |
| **Inisialisasi React, Apollo Provider, & injeksi header JWT** | [`client/src/main.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/main.jsx) |
| **Port frontend (3000), host jaringan, & proxy GraphQL** | [`client/vite.config.js`](file:///c:/Salim/Kerjaan/pahamteks/client/vite.config.js) |
| **Font Nunito, title bar, favicon, & HTML container** | [`client/index.html`](file:///c:/Salim/Kerjaan/pahamteks/client/index.html) |
| **Layar kuis adaptif (Unit 1-5, timer bar, tombol opsi A-D)** | [`client/src/components/QuizView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/QuizView.jsx) |
| **Layar kamus pintar AI & glosarium istilah A-Z** | [`client/src/components/DictionaryView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/DictionaryView.jsx) |
| **Wadah gabungan tab kamus dan tab penerjemah** | [`client/src/components/CombinedDictTranslator.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/CombinedDictTranslator.jsx) |
| **Fitur penerjemah teks multi-bahasa AI** | [`client/src/components/Translator.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/Translator.jsx) |
| **Tombol balon mengambang di pojok kanan bawah** | [`client/src/components/KamusFloating.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/KamusFloating.jsx) |
| **Maskot pintar Teksie (animasi tidur, reaktif, balon dialog)** | [`client/src/components/TeksieMascotCompanion.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/TeksieMascotCompanion.jsx) |
| **Modal login, registrasi, OTP email, & reset password** | [`client/src/components/AuthModal.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/AuthModal.jsx) |
| **Modal notifikasi tengah layar pengganti `alert()`** | [`client/src/components/CenterNotificationModal.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/CenterNotificationModal.jsx) |
| **Navbar atas (logo, tombol ganti tab, tombol logout)** | [`client/src/components/Navbar.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/Navbar.jsx) |
| **Layar beranda (Home Hero banner penyambut)** | [`client/src/components/HomeHero.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/HomeHero.jsx) |
| **Portal pemilihan jalur awal belajar (Bahasa vs Koding)** | [`client/src/components/WelcomePortal.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/WelcomePortal.jsx) |
| **Dasbor akun pemelajar (riwayat kuis pribadi & statistik)** | [`client/src/components/DashboardView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/DashboardView.jsx) |
| **Dashboard visual dan log audit khusus admin** | [`client/src/components/AdminDashboardView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/AdminDashboardView.jsx) |
| **Layar tantangan harian koding & kuis cepat** | [`client/src/components/ChallengeView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/ChallengeView.jsx) |
| **Layar wawasan linguistik dan perbandingan bahasa** | [`client/src/components/LanguageInsights.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/LanguageInsights.jsx) |
| **Pusat materi belajar terpadu** | [`client/src/components/LearningHub.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/LearningHub.jsx) |
| **Perender teks markdown jawaban AI agar rapi** | [`client/src/components/HumanFormattedText.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/HumanFormattedText.jsx) |
| **Efek partikel latar belakang mengambang halus** | [`client/src/components/BackgroundDrift.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/BackgroundDrift.jsx) |
| **Koleksi ikon SVG 2D kustom** | [`client/src/components/Art2DIcons.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/Art2DIcons.jsx) |
| **Ilustrasi karakter mini 2D pendukung** | [`client/src/components/MiniCharacters.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/MiniCharacters.jsx) |
| **Definisi kueri GraphQL Apollo Client (GET_QUIZ, dll)** | [`client/src/graphql/queries.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/graphql/queries.js) |
| **Definisi mutasi GraphQL Apollo Client (LOGIN, dll)** | [`client/src/graphql/mutations.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/graphql/mutations.js) |
| **Pusat seluruh styling CSS, variabel warna :root, & animasi** | [`client/src/styles/index.css`](file:///c:/Salim/Kerjaan/pahamteks/client/src/styles/index.css) |
| **Logika validasi jawaban kuis & opsi huruf A-D** | [`client/src/utils/quizUtils.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/utils/quizUtils.js) |
| **Logika pemutar suara pelafalan kata Web Speech API** | [`client/src/utils/speechUtils.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/utils/speechUtils.js) |
| **Daftar pustaka dependencies client** | [`client/package.json`](file:///c:/Salim/Kerjaan/pahamteks/client/package.json) |

### Dashboard administrator

Buka langsung `http://127.0.0.1:3000/admin`. Jika belum masuk, rute ini menampilkan form login admin. Masukkan email yang terdaftar pada `ADMIN_EMAILS`, password akun pribadi, dan password admin tambahan. Mutasi `adminLogin` meminta backend memverifikasi ketiganya sebelum mengeluarkan token dengan sesi admin. Komponen dashboard menjalankan kueri status server dan log; backend tetap menolak request jika token bukan sesi admin yang valid. Jangan menyimpan `ADMIN_PASSWORD` di kode atau environment variable frontend.

---

## 🎨 Panduan Desain & Variabel Warna (`index.css`)

Semua gaya visual diatur menggunakan variabel CSS (*Design Tokens*) pada baris awal `client/src/styles/index.css`:

```css
:root {
  /* Palet Warna Utama */
  --bg-main: #f8fafc;           /* Latar belakang halaman (putih abu sejuk) */
  --text-main: #1e293b;         /* Warna teks utama (hitam arang gelap) */
  --text-muted: #64748b;        /* Warna teks sekunder / penjelasan */
  --primary-green: #10b981;     /* Hijau emerald: tombol aksi & status benar */
  --primary-hover: #059669;     /* Warna tombol hijau saat disorot kursor */
  --accent-blue: #0ea5e9;       /* Biru langit: kartu kamus & info penting */
  --danger-red: #ef4444;        /* Merah: pesan error & status jawaban salah */
  
  /* Bentuk & Bayangan */
  --card-bg: #ffffff;           /* Warna dasar kartu komponen */
  --card-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); /* Bayangan lembut */
  --radius-lg: 16px;            /* Sudut membulat modern pada kartu */
  --radius-full: 9999px;        /* Tombol bulat penuh (kapsul) */
}
```

### Aturan Menulis Kelas CSS:
* Gunakan nama kelas yang deskriptif dan mencerminkan fungsinya: `.quiz-card`, `.btn-action`, `.option-button`, `.timer-track`.
* Hindari menulis inline-style `style={{ marginTop: '20px' }}` di berkas JSX kecuali untuk nilai dinamis murni (seperti lebar persentase progress bar timer).

---

## 🔐 Manajemen Autentikasi Pengguna di Frontend

Bagaimana cara frontend mengetahui apakah pengguna sedang login atau tamu?

```text
[ Pengguna Isi Email & Password ]
               │
               ▼
[ AuthModal.jsx panggil mutasi LOGIN ]
               │
               ▼
[ Server kembalikan token JWT ]
               │
               ├─► 1. Simpan token: localStorage.setItem('pahamteks_auth_token', token)
               │
               ├─► 2. Simpan user: setCurrentUser(data.login.user)
               │
               └─► 3. main.jsx otomatis membaca token & menyematkannya ke header:
                      Authorization: Bearer <token_jwt>
```

Saat pengguna menekan tombol **Logout**, frontend cukup menjalankan:
```javascript
localStorage.removeItem('pahamteks_auth_token');
setCurrentUser(null);
```

---

## 🗣️ Cara Pakai Audio Pelafalan Bahasa (`speechUtils.js`)

Jika kamu membuat fitur baru yang menampilkan kata bahasa asing, selalu sediakan tombol dengarkan suara:

```jsx
import React from 'react';
import { speakText } from '../utils/speechUtils';

export function TombolSuara({ kata, kodeBahasa }) {
  return (
    <button 
      className="btn-speaker" 
      onClick={() => speakText(kata, kodeBahasa)}
      title="Dengarkan Pengucapan"
    >
      🔊 Dengarkan
    </button>
  );
}
```
* `kodeBahasa` yang didukung: `'en'` (Inggris), `'fr'` (Prancis), `'ja'` (Jepang), `'de'` (Jerman), `'es'` (Spanyol), `'id'` (Indonesia).

---

## 🛠️ Studi Kasus: Cara Menambah Komponen / Tampilan Baru

Misalnya kamu diminta membuat tampilan baru bernama **FlashcardView**:

1. **Buat Berkas Komponen**: Buat `client/src/components/FlashcardView.jsx`.
2. **Gunakan Utilitas Bersama**: Jika butuh validasi atau suara, impor dari `client/src/utils/`.
3. **Tambahkan Styling di `index.css`**: Buat blok kelas CSS baru, misalnya `.flashcard-container` dan `.flashcard-card`.
4. **Daftarkan di `App.jsx`**:
   - Tambahkan tab baru di daftar menu `activeTab`.
   - Render `<FlashcardView />` saat tab tersebut dipilih pengguna.
5. **Verifikasi Build**:
   ```powershell
   npm --prefix client run build
   ```
   Pastikan tidak ada sintaks JSX atau impor yang rusak sebelum commit.

---

## 🛑 Standar Kualitas Koding (Zero AI Slop)

1. **Dilarang Browser Alert**: Jangan pernah menulis `alert("Berhasil!")` atau `confirm("Yakin?")`. Gunakan `CenterNotificationModal`.
2. **Tangani Semua Error**: Jangan biarkan `catch (e) {}` kosong. Minimal beri `console.warn('[FlashcardView] Error:', e)`.
3. **Responsif di Ponsel**: Pastikan tata letak flex/grid memiliki `flex-wrap: wrap` atau media query `@media (max-width: 768px)` agar tidak patah saat dibuka lewat layar HP.
4. **Verifikasi Build Wajib**: Selalu jalankan `npm --prefix client run build` sebelum push.

---

## 🚀 Perintah Menjalankan Frontend

```powershell
# Menjalankan server pengembangan lokal (port 3000)
npm --prefix client run dev

# Memeriksa dan memvalidasi hasil build produksi
npm --prefix client run build
```
Buka browser di alamat: `http://127.0.0.1:3000`. Server dev terikat ke loopback dan tidak menerima koneksi dari perangkat lain di jaringan.

---

## 📚 Rencana UI: Materi Belajar dari Folder Dokumen

Pemilihan dan upload dokumen belum tersedia di UI. Rancangan berikut menjadi acuan ketika fitur disetujui untuk dibangun:

- Pengguna memilih file/folder secara eksplisit lewat file picker browser; browser tidak boleh diasumsikan dapat membaca seluruh folder tanpa izin.
- Tampilkan nama ruang materi, pemilik atau kelas, daftar berkas, ukuran, format, status unggah/ekstraksi, dan alasan file ditolak.
- Sediakan progres, batal/retry, hapus file, dan konfirmasi sebelum menghapus seluruh materi.
- Saat AI menjawab, tampilkan sumber yang digunakan (nama dokumen dan halaman/bagian jika ada) serta penanda ketika sumber tidak cukup. Bedakan konten dokumen dari penjelasan tambahan AI.
- Jangan tampilkan materi kelas kepada pengguna yang tidak berwenang. UI bukan batas keamanan: backend tetap harus memverifikasi izin untuk semua operasi.
- Hindari menampilkan data pribadi atau isi dokumen penuh di log/notifikasi. Jangan menaruh dokumen atau URL object storage privat di `localStorage`.

Format MVP, batas file, akses kelas, dan kebijakan retensi harus disepakati bersama backend, QA, kurator, dan pengajar. Detail produk ada di `PRD.md`; alur teknis ada di `PANDUAN_FULLSTACK.md`.
