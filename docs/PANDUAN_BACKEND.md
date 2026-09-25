# Panduan Pengembangan Backend PahamTeks

Halo rekan tim backend! Dokumen ini ditulis dengan bahasa yang santai dan mudah dipahami agar siapa pun—bahkan yang baru pertama kali menyentuh Node.js atau GraphQL—bisa langsung mengerti alur kerja server **PahamTeks** dan percaya diri untuk ikut menulis kode.

---

## 🧭 Gambaran Umum: Apa Tugas Backend Kita?

Secara sederhana, backend kita bertugas sebagai "dapur". Frontend (antarmuka web yang dilihat pengguna) akan mengirim pesanan data, lalu backend mengolahnya:
* Memeriksa dan menyimpan data pengguna / progres kuis ke database.
* Berkomunikasi dengan Google Gemini AI untuk meracik soal kuis, menjelaskan kata di kamus, atau mentranskripsi suara.
* Mengirimkan kembali data yang sudah matang ke frontend dalam format JSON yang rapi.

Teknologi utama yang kita pakai:
1. **Node.js (ESM - ECMAScript Modules)**: Kita memakai sintaks modern `import / export` (bukan `require`).
2. **Express.js**: Kerangka server web ringan.
3. **Apollo Server v4 (GraphQL)**: Pintu gerbang API utama di alamat `/graphql`.
4. **Dual Database (MySQL + SQLite)**: Sistem penyimpanan data yang anti-gagal.
5. **Google Gen AI SDK**: Penghubung resmi ke model AI Gemini.

---

## 📂 Peta Lengkap File Backend (`server/`)

Berikut **seluruh file** yang ada di folder backend beserta penjelasan fungsi masing-masing:

```text
server/
├── package.json                        <- Daftar pustaka (dependencies) backend
├── .env                                <- Kunci rahasia API & konfigurasi database (JANGAN DIPUSH)
├── .env.example                        <- Template .env untuk panduan tim baru
├── data/
│   └── pahamteks_backup.sqlite         <- Database cadangan SQLite (otomatis dibuat)
├── backups/
│   └── *.sql                           <- Hasil backup database (otomatis, jangan di-push)
└── src/
    ├── index.js                        <- Pintu masuk utama: menjalankan server di port 4000
    ├── app.js                          <- Pengaturan Express, CORS, Helmet, Rate Limiter, Apollo
    │
    ├── config/
    │   ├── db.js                       <- Koneksi MySQL + auto-failover ke SQLite + auto-migrasi
    │   └── gemini.js                   <- Rotasi API Key Gemini (round-robin 1-9) & pemilihan model
    │
    ├── db/
    │   ├── fallbackDb.js               <- Mesin SQLite lokal: skema tabel & query executor
    │   ├── initDb.js                   <- Skrip inisialisasi database (membuat tabel awal)
    │   └── exportSqlBackup.js          <- Skrip ekspor backup database ke file .sql
    │
    ├── resolvers/
    │   ├── index.js                    <- Penggabung semua resolver menjadi satu objek
    │   ├── authResolvers.js            <- Login, register, OTP email, reset password, JWT token
    │   ├── geminiResolvers.js          <- Kuis AI, kamus pintar, penerjemah, cache memori
    │   └── historyResolvers.js         <- Riwayat kuis, log aktivitas, skor pemelajar
    │
    ├── schema/
    │   └── typeDefs.js                 <- "Kontrak data" GraphQL: semua Query & Mutation
    │
    └── utils/
        ├── emailService.js             <- Pengirim email OTP & reset password via Nodemailer
        └── securityLogger.js           <- Proteksi brute-force, rate limiting OTP, log keamanan
```

### Tabel Ringkasan: File Mana untuk Apa?

| Jika kamu ingin... | Buka file ini |
| :--- | :--- |
| Menambah query atau mutation baru | `src/schema/typeDefs.js` lalu resolver terkait |
| Mengubah logika login / register / OTP | `src/resolvers/authResolvers.js` |
| Mengubah logika kuis / kamus / cache AI | `src/resolvers/geminiResolvers.js` |
| Mengubah logika riwayat / skor | `src/resolvers/historyResolvers.js` |
| Menambah/mengubah tabel di database | `src/db/fallbackDb.js` (SQLite) dan `src/config/db.js` (MySQL) |
| Mengubah konfigurasi CORS / keamanan | `src/app.js` |
| Menambah model AI atau rotasi key | `src/config/gemini.js` |
| Mengubah pengaturan email OTP | `src/utils/emailService.js` |
| Mengekspor backup database | `src/db/exportSqlBackup.js` |

---

## 🍽️ Mengapa Kita Menggunakan GraphQL (Bukan REST Biasa)?

Bayangkan kamu sedang makan di restoran prasmanan:
* **Pada REST API Biasa**: Pelayan menyajikan satu paket makanan lengkap berisi nasi, ayam, sayur, dan sambal, meskipun kamu sebenarnya hanya minta sambal saja (*over-fetching*).
* **Pada GraphQL**: Kamu bebas mengambil piring dan hanya memilih menu yang kamu mau. Frontend bisa meminta: *"Tolong kirimkan nama pengguna dan skornya saja, email dan passwordnya tidak perlu."*

Di PahamTeks, semua komunikasi data melewati satu pintu gerbang tunggal:
`http://localhost:4000/graphql`

---

## 🛡️ Rahasia Dual Database Failover (Anti-Error Saat Setup Lokal)

Salah satu masalah paling umum saat developer baru bergabung adalah repotnya menginstall dan menyalakan MySQL lokal. Di PahamTeks, kita menyelesaikan masalah ini secara tuntas:

1. Saat server dinyalakan, berkas `server/src/config/db.js` akan mencoba menyapa database MySQL.
2. **Jika MySQL aktif**: Sistem akan menggunakan MySQL sebagai database utama.
3. **Jika MySQL mati / tidak ada**: Server tidak akan crash! Sistem otomatis menyalakan mesin **SQLite lokal** (`server/data/pahamteks_backup.sqlite`).
4. Semua data kuis, akun pengguna, dan progres tetap tersimpan rapi di berkas SQLite tersebut. Kamu bisa langsung koding tanpa perlu membuka XAMPP sama sekali!

---

## ⚡ Sistem Caching & Optimasi AI Gemini

Memanggil model AI ke server Google membutuhkan waktu dan kuota. Agar aplikasi kita cepat dan hemat, kita menerapkan 3 strategi:

1. **Prioritas Model Cepat (`gemini-3.5-flash-lite`)**:
   Model ini diatur di urutan pertama pada `server/src/config/gemini.js` karena memiliki waktu respon cepat (sekitar belasan detik) dan sangat stabil dari lonjakan beban (*high demand*).
2. **Rotasi API Key (Round-Robin)**:
   Di file `server/.env`, kita bisa memasang hingga 9 kunci API (`GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`, dst). Jika salah satu kunci terkena batas kuota, backend otomatis meminjam kunci berikutnya tanpa membuat pengguna menunggu.
3. **In-Memory Cache (`dictionaryCache` & `quizCache`)**:
   Di `server/src/resolvers/geminiResolvers.js`, kata yang sudah pernah dicari di kamus (seperti `syntax`, `algorithm`, dll) langsung disimpan di memori RAM server. Saat kata tersebut dicari lagi, backend membalasnya dalam waktu **`0.04 milidetik` (super instan)**!

---

## 🔐 Sistem Autentikasi & Keamanan

Berikut rangkuman fitur keamanan yang sudah berjalan di backend:

| Fitur | File | Penjelasan |
| :--- | :--- | :--- |
| JWT Token (7 hari) | `authResolvers.js` | Setiap login berhasil, server mengeluarkan token terenkripsi yang berlaku 7 hari |
| Hashing Password (bcrypt) | `authResolvers.js` | Password pengguna tidak pernah disimpan dalam bentuk teks asli |
| OTP Email | `emailService.js` | Kode verifikasi 6-digit dikirim ke email saat mendaftar atau reset password |
| Proteksi Brute-Force | `securityLogger.js` | Jika ada percobaan login gagal berulang kali, akses di-blokir sementara |
| Rate Limiter Global | `app.js` | Maksimal 200 request per 15 menit per IP |
| Helmet HTTP Headers | `app.js` | Perlindungan header HTTP standar industri |
| CORS Whitelist | `app.js` | Hanya domain yang diizinkan yang bisa mengirim request |

---

## 🛠️ Tutorial: Cara Menambah Fitur Baru di Backend

Misalnya kamu ingin membuat fitur baru: mengambil kata mutiara edukasi acak (*quote*). Ada 3 langkah mudah:

### Langkah 1: Daftarkan Kontrak Data di `typeDefs.js`
Buka `server/src/schema/typeDefs.js`, lalu tambahkan Query baru:
```graphql
type Query {
    # Fitur lama...
    dailyQuote: String!
}
```

### Langkah 2: Tulis Logika Fungsinya di Resolver
Buka file resolver yang sesuai (misalnya `server/src/resolvers/geminiResolvers.js`):
```javascript
export const geminiResolvers = {
    Query: {
        // Query lainnya...
        dailyQuote: async () => {
            return "Pendidikan adalah senjata paling ampuh untuk mengubah dunia. - Nelson Mandela";
        }
    }
};
```

### Langkah 3: Uji Coba di Apollo Sandbox
Nyalakan server:
```powershell
npm --prefix server run dev
```
Buka browser dan kunjungi: `http://localhost:4000/graphql`.
Ketik kueri berikut di panel pengujian:
```graphql
query {
    dailyQuote
}
```
Klik tombol **Run**. Jika teks kata mutiara muncul di sebelah kanan, fitur baru kamu sudah berhasil!

---

## 🛑 Aturan Penting Koding Backend (Zero AI Slop)

1. **Dilarang Menelan Error (`No Swallowed Catches`)**:
   Jangan pernah menulis blok `catch (err) {}` kosong melompong. Selalu berikan log yang bermakna minimal dengan `console.warn('[NamaModul] Error:', err.message);`.
2. **Jaga Kerahasiaan Kunci**:
   File `server/.env` dan database binary `*.sqlite` tidak boleh di-stage atau di-push ke GitHub.
3. **Script Dev yang Aman**:
   Gunakan selalu `npm --prefix server run dev`. Script ini sudah dilengkapi flag `--watch-path=src` agar server tidak looping restart saat folder dependensi disentuh.
