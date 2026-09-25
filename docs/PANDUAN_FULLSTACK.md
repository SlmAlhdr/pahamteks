# Panduan Pengembangan Fullstack PahamTeks

Halo rekan tim fullstack! Dokumen ini dirancang sebagai panduan terpadu agar kamu memahami bagaimana ekosistem antarmuka pengguna (**Frontend**) dan mesin logika server (**Backend**) di **PahamTeks** terhubung dan bekerja secara harmonis dari hulu ke hilir.

---

## 🌐 Gambaran Arsitektur Fullstack

PahamTeks adalah platform pembelajaran interaktif dwi-disiplin (Bahasa Asing & Logika Pemrograman) yang mengusung arsitektur modern berbobot ringan (*zero bloat*):

```text
┌────────────────────────────────────────────────────────┐
│                   BROWSER PENGGUNA                     │
│      React 18 + Vite 6 + Pure CSS + Web Speech API      │
│            (Berjalan di http://localhost:3000)          │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ HTTP POST /graphql (Apollo Client)
                            │ REST GET /health
                            ▼
┌────────────────────────────────────────────────────────┐
│                   SERVER BACKEND                       │
│    Express.js + Apollo Server v4 (Port 4000)           │
│    • Rate Limiting, Brute Force Guard, Helmet Security  │
│    • Resolvers: Auth, Gemini AI, History, Activity     │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────────┐ ┌───────────────────────┐
│        DUAL DATABASE         │ │   GOOGLE GEMINI AI    │
│  Primary : MySQL             │ │   Multi-Key Rotation  │
│  Failover: SQLite (Fallback) │ │   Round-Robin 1 - 9   │
│  (Data aman tanpa crash)     │ │   Kuis & Kamus Cerdas │
└──────────────────────────────┘ └───────────────────────┘
```

---

## 📂 Peta Hubungan: Frontend vs Backend

Setiap bagian di frontend memiliki padanan resolver dan skema di backend:

| Fitur di Frontend | File Frontend (`client/`) | File Backend (`server/`) | Database / Layanan |
| :--- | :--- | :--- | :--- |
| **Kuis Interaktif (Unit 1–5)** | `src/components/QuizView.jsx` | `src/resolvers/geminiResolvers.js` | Gemini AI + Memory Cache |
| **Kamus Pintar & Penerjemah** | `src/components/DictionaryView.jsx` | `src/resolvers/geminiResolvers.js` | Gemini AI (Gemini 2.5 Flash) |
| **Autentikasi (Login/Register)** | `src/components/AuthModal.jsx` | `src/resolvers/authResolvers.js` | MySQL / SQLite (`users` table) |
| **Verifikasi OTP Email** | `src/components/AuthModal.jsx` | `src/utils/emailService.js` | Nodemailer SMTP |
| **Riwayat Skor & Belajar** | `src/App.jsx` | `src/resolvers/historyResolvers.js` | MySQL / SQLite (`quiz_history`) |
| **Kontrak Data (Kueri/Mutasi)** | `src/graphql/queries.js`, `mutations.js` | `src/schema/typeDefs.js` | Skema GraphQL Terpadu |

---

## 🔄 Alur Interaksi Data End-to-End (Contoh Nyata)

Berikut contoh alur lengkap saat pemelajar menyelesaikan kuis dan menyimpan skor:

1. **Aksi Pengguna**: Pengguna menjawab soal terakhir pada kuis Unit 1 di antarmuka React (`QuizView.jsx`).
2. **Kalkulasi Frontend**: Skor dihitung dan divalidasi menggunakan utilitas `quizUtils.js` (`isOptionCorrect`).
3. **Pengiriman Mutasi**: Apollo Client mengeksekusi mutasi `SAVE_QUIZ_SCORE` ke endpoint `/graphql`.
4. **Validasi Backend**: `server/src/resolvers/historyResolvers.js` memverifikasi token JWT pengguna dari header authorization.
5. **Penyimpanan Failover**:
   - Server mencoba menyimpan riwayat ke tabel MySQL.
   - Jika koneksi MySQL sedang terputus, sistem otomatis mengalihkan penyimpanan ke SQLite lokal (`server/data/pahamteks_backup.sqlite`).
6. **Respon Balik**: Server mengembalikan data skor terbaru, dan Apollo Client memperbarui UI tanpa memuat ulang (*reload*) halaman.

---

## 🚀 Cara Menjalankan Ekosistem Lokal

Untuk menjalankan frontend dan backend secara bersamaan di komputer lokal:

### 1. Terminal 1 (Backend Server)
```powershell
npm --prefix server run dev
```
* Backend aktif di: `http://localhost:4000/graphql`
* Cek status kesehatan: `http://localhost:4000/health`

### 2. Terminal 2 (Frontend Client)
```powershell
npm --prefix client run dev
```
* Frontend aktif di: `http://localhost:3000`
* Perubahan kode React/CSS langsung ter-update otomatis via Vite HMR.

---

## 🛡️ Standar Koding & Zero Leak Policy

Sebelum melakukan commit dan push perubahan kode:
1. **Verifikasi Build**: Pastikan build frontend sukses tanpa kesalahan:
   ```powershell
   npm --prefix client run build
   ```
2. **Zero Leak Policy**: Dilarang keras menambahkan atau melakukan staging pada file `.env` atau database SQLite lokal (`*.sqlite`).
3. **No Swallowed Exceptions**: Jangan biarkan blok `catch (e) {}` kosong. Selalu tangani atau catat menggunakan `console.warn`.
4. **Gunakan Utilitas Bersama**:
   - Suara pengucapan: `client/src/utils/speechUtils.js`
   - Opsi kuis: `client/src/utils/quizUtils.js`
5. **Otomatisasi Push**: Selalu commit dengan pesan deskriptif dan push hasil pembaruan ke repositori GitHub.
