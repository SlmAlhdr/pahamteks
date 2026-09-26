# Panduan Lengkap Pengembangan Fullstack PahamTeks

Selamat datang rekan tim fullstack! Dokumen ini disusun secara lengkap dan menyeluruh agar siapa pun yang baru bergabung ke tim **PahamTeks** bisa langsung memahami: **apa itu fullstack, bagaimana frontend dan backend terhubung, siklus hidup request dari hulu ke hilir, hingga tutorial praktis membuat fitur fullstack dari nol**.

---

## 💡 Apa Itu Fullstack Sebenarnya? (Analogi Sederhana)

Jika kita kembali ke analogi **restoran**:
* **Frontend** adalah ruang makan tempat tamu duduk, membaca buku menu, dan menikmati makanan.
* **Backend** adalah dapur tempat koki meracik resep, kompor menyala, dan gudang bahan makanan.
* **Fullstack** adalah **arsitek dan manajer sistem restoran**: orang yang merancang bagaimana pelayan membawa pesanan dari meja makan ke dapur, memastikan koki menerima tiket pesanan yang benar, mengawasi kasir saat mencatat tagihan, hingga memastikan piring makanan disajikan kembali ke hadapan tamu tanpa tumpah dan tepat waktu.

Sebagai developer fullstack di PahamTeks, kamu memegang gambaran utuh (*big picture*): dari saat tombol diklik di browser pemelajar, terbang melintasi jaringan internet, disaring perisai keamanan Express, diproses oleh kecerdasan buatan Gemini AI atau database MySQL/SQLite, hingga kembali merender tampilan baru di layar pengguna.

---

## 🌐 Fullstack PahamTeks Itu Terdiri dari Apa Saja?

Arsitektur fullstack kita disatukan oleh **6 jembatan penghubung utama**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        EKOSISTEM FULLSTACK                             │
├────────────────────────────────────────────────────────────────────────┤
│ 1. PROTOKOL JARINGAN  : Port 3000 (UI) <─HTTP/CORS─> Port 4000 (API)   │
│ 2. KONTRAK DATA       : Skema GraphQL (typeDefs.js) sebagai Bahasa Satu│
│ 3. SIKLUS REQUEST     : 8 Tahap interaksi data dari klik sampai render │
│ 4. SINKRONISASI CACHE : Apollo Cache di Client vs Memory Cache Server  │
│ 5. PENGATURAN LINGKUNGAN: Variabel .env terpusat & Zero Leak Policy    │
│ 6. OTOMASI GIT PUSH   : Verifikasi build & push otomatis ke GitHub     │
└────────────────────────────────────────────────────────────────────────┘
```

Mari kita telaah masing-masing jembatan di atas:

### 1. Jembatan Protokol Jaringan (Network & Ports)
* **Frontend** berjalan di browser pengguna melalui Vite pada `http://127.0.0.1:3000`.
* **Backend** berjalan di Node.js Express pada `http://127.0.0.1:4000`.
* Keduanya terikat ke loopback secara default sehingga hanya dapat diakses dari komputer yang menjalankannya.
* Kedua dunia ini berkomunikasi lewat HTTP POST ke `/graphql`; probe publik minimal tersedia di `/healthz` dan detail `/health` memerlukan token admin.
* Express memiliki middleware `cors()` yang memastikan browser tidak memblokir komunikasi antar port yang berbeda ini.

### 2. Kontrak Data Bersama (GraphQL Schema)
Tidak ada tebak-tebakan tipe data antara tim frontend dan tim backend. Berkas `server/src/schema/typeDefs.js` bertindak sebagai **"surat perjanjian resmi"**:
* Frontend membaca skema ini untuk mengetahui kueri apa saja yang tersedia beserta parameternya.
* Backend wajib mengembalikan data yang bentuk dan tipe datanya persis sama dengan apa yang tertulis di skema.

### 3. Siklus Hidup Request (Request Lifecycle)
Setiap kali pemelajar melakukan aksi (misal: mencari kata di kamus, menjawab kuis, atau login), ada 8 tahapan terstruktur yang dilalui data secara sekuensial.

### 4. Sinkronisasi Cache
Aplikasi kita sangat cepat karena menerapkan strategi caching di dua sisi:
* **Sisi Client (Apollo In-Memory Cache)**: Mencegah browser mengirim kueri berulang jika data baru saja diambil.
* **Sisi Server (RAM Cache & Database Cache)**: Hasil komputasi AI Gemini disimpan di memori server agar respon dapat dikembalikan dalam waktu **`0.04 ms`**.

### 5. Pengaturan Lingkungan Terpusat (`.env`)
Nilai rahasia disimpan di `server/.env`, yang tidak boleh di-commit. Repositori privat membatasi akses sesuai izin GitHub, tetapi bukan brankas rahasia: tetap jangan simpan kredensial di Git, dokumentasi, atau kode frontend.

### 6. Standar Kualitas & Otomatisasi Git
Setiap perubahan kode wajib lolos verifikasi build frontend (`npm --prefix client run build`) dan dipush ke GitHub secara otomatis.

---

## 🔄 Siklus Hidup Request End-to-End (Diagram 8 Tahap)

Berikut alur lengkap yang terjadi di balik layar saat seorang pemelajar menyelesaikan kuis dan menyimpan skor:

```text
[1. User Action]      Pemelajar menjawab soal nomor 10 dan klik tombol "Selesai" di QuizView.jsx.
        │
        ▼
[2. Frontend Calc]    React menghitung total jawaban benar menggunakan quizUtils.js (isOptionCorrect).
        │
        ▼
[3. Apollo Dispatch]  Apollo Client mengirim HTTP POST ke http://127.0.0.1:4000/graphql membawa
        │             mutasi SAVE_QUIZ_SCORE dan header Authorization: Bearer <token_jwt>.
        │
        ▼
[4. Security Shield]  Express menyaring request melalui Helmet, CORS Whitelist, dan Rate Limiter.
        │
        ▼
[5. JWT Verification] Server memverifikasi tanda tangan, issuer, audience, dan masa berlaku token sebelum mengambil identitas akun.
        │
        ▼
[6. Database Logic]   historyResolvers.js mencoba menyimpan baris skor ke tabel MySQL quiz_history.
        │             Jika koneksi MySQL mati, sistem otomatis mengalihkan penyimpanan ke SQLite!
        │
        ▼
[7. JSON Response]    Apollo Server mengirim balasan: { data: { saveQuizScore: { success: true } } }.
        │
        ▼
[8. Reactive Render]  Apollo Client memperbarui state React, dan UI menampilkan modal selamat & animasi skor.
```

---

## 📂 Peta Hubungan: Komponen Frontend vs Backend vs Database

Tabel berikut memetakan setiap fitur di antarmuka pengguna ke berkas backend dan tabel database yang bertanggung jawab dengan lokasi path persis:

| Fitur Aplikasi | Berkas Frontend (`client/`) | Berkas Resolver Backend (`server/`) | Tabel Database / Layanan |
| :--- | :--- | :--- | :--- |
| **Kuis Adaptif (Unit 1–5)** | [`client/src/components/QuizView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/QuizView.jsx) | [`server/src/resolvers/geminiResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/geminiResolvers.js) | Gemini AI + In-Memory Cache |
| **Kamus Pintar & Glosarium** | [`client/src/components/DictionaryView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/DictionaryView.jsx) | [`server/src/resolvers/geminiResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/geminiResolvers.js) | `dictionary_cache` + Gemini AI |
| **Login & Registrasi Akun** | [`client/src/components/AuthModal.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/AuthModal.jsx) | [`server/src/resolvers/authResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/authResolvers.js) | `users` (Bcrypt hash) |
| **Kode OTP Verifikasi Email** | [`client/src/components/AuthModal.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/AuthModal.jsx) | [`server/src/utils/emailService.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/utils/emailService.js) | `otp_verifications` + Nodemailer |
| **Riwayat Skor & Statistik** | [`client/src/components/DashboardView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/DashboardView.jsx) | [`server/src/resolvers/historyResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/historyResolvers.js) | `quiz_history` (MySQL/SQLite) |
| **Log Aktivitas Pengguna** | [`client/src/App.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/App.jsx) | [`server/src/resolvers/historyResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/historyResolvers.js) | `user_activity_logs` |
| **Maskot Pintar Teksie** | [`client/src/components/TeksieMascotCompanion.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/TeksieMascotCompanion.jsx) | Logika state lokal React | Suara Web Speech API |
| **Monitoring & Status Server** | [`client/src/graphql/queries.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/graphql/queries.js) | [`server/src/app.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/app.js) (`/health`) | Endpoint Health JSON |
| **Panel Administrator Visual** | [`client/src/components/AdminDashboardView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/AdminDashboardView.jsx) | `server/src/resolvers/index.js` & `historyResolvers.js` | `user_activity_logs` + Pool Gemini |

---

## 🗺️ Kompas Arah Berkas: Peta Lengkap Navigasi Seluruh Proyek PahamTeks

Gunakan tabel direktori ini sebagai panduan cepat menemukan berkas apa pun di seluruh proyek:

| Domain | Kebutuhan Pengembangan | Lokasi Berkas Persis |
| :--- | :--- | :--- |
| **Frontend** | Konfigurasi port (3000) & proxy GraphQL | [`client/vite.config.js`](file:///c:/Salim/Kerjaan/pahamteks/client/vite.config.js) |
| **Frontend** | Inisialisasi Apollo Client & header token | [`client/src/main.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/main.jsx) |
| **Frontend** | Navigasi tab utama & state login | [`client/src/App.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/App.jsx) |
| **Frontend** | Dashboard visual khusus administrator | [`client/src/components/AdminDashboardView.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/AdminDashboardView.jsx) |
| **Frontend** | Seluruh styling CSS, warna :root, & animasi | [`client/src/styles/index.css`](file:///c:/Salim/Kerjaan/pahamteks/client/src/styles/index.css) |
| **Frontend** | Kueri GraphQL client (`GET_QUIZ`, dll) | [`client/src/graphql/queries.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/graphql/queries.js) |
| **Frontend** | Mutasi GraphQL client (`LOGIN`, `REGISTER`) | [`client/src/graphql/mutations.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/graphql/mutations.js) |
| **Frontend** | Utilitas audio sintesis suara | [`client/src/utils/speechUtils.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/utils/speechUtils.js) |
| **Frontend** | Utilitas validasi kunci kuis (A-D) | [`client/src/utils/quizUtils.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/utils/quizUtils.js) |
| **Backend** | Pintu masuk listener server port 4000 | [`server/src/index.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/index.js) |
| **Backend** | Pengaturan Express, Helmet, CORS, `/healthz`, dan `/health` admin | [`server/src/app.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/app.js) |
| **Backend** | Verifikasi sesi JWT dan role admin | [`server/src/utils/auth.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/utils/auth.js) |
| **Backend** | "Kontrak Data" GraphQL (Query & Mutation) | [`server/src/schema/typeDefs.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/schema/typeDefs.js) |
| **Backend** | Logika eksekusi autentikasi & JWT | [`server/src/resolvers/authResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/authResolvers.js) |
| **Backend** | Logika kuis AI, kamus, & RAM cache | [`server/src/resolvers/geminiResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/geminiResolvers.js) |
| **Backend** | Logika riwayat skor kuis & audit logs | [`server/src/resolvers/historyResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/historyResolvers.js) |
| **Backend** | Koneksi MySQL & logika failover ke SQLite | [`server/src/config/db.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/config/db.js) |
| **Backend** | Mesin database cadangan SQLite lokal | [`server/src/db/fallbackDb.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/db/fallbackDb.js) |
| **Backend** | Berkas biner database SQLite lokal | `server/data/pahamteks_backup.sqlite` |
| **Backend** | Rotasi API key Gemini 1–9 & prompt AI | [`server/src/config/gemini.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/config/gemini.js) |
| **Backend** | Layanan email OTP via Nodemailer SMTP | [`server/src/utils/emailService.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/utils/emailService.js) |
| **Backend** | Proteksi brute-force & audit keamanan | [`server/src/utils/securityLogger.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/utils/securityLogger.js) |
| **Backend** | Skrip ekspor database ke file `.sql` | [`server/src/db/exportSqlBackup.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/db/exportSqlBackup.js) |
| **Backend** | Variabel rahasia lokal (.env) | `server/.env` (panduan di `server/.env.example`) |
| **Admin** | Detail status server REST | `GET http://127.0.0.1:4000/health` dengan token admin |
| **Monitoring** | Probe server minimal | `GET http://127.0.0.1:4000/healthz` |
| **Admin** | Kueri audit aktivitas pengguna GraphQL | `serverStatus` & `userLogs` di `POST /graphql` |
| **Admin** | Akses data audit/status di GraphQL | Token admin pada query `serverStatus` dan `userLogs` |

---

## 🛠️ Tutorial Langkah Demi Langkah: Menambah Fitur Fullstack Baru Dari Nol

Misalkan tim ingin membuat fitur baru: **"Simpan Kosakata Favorit (Bookmark Kata)"**. Berikut panduan lengkap dari sisi database, server, hingga antarmuka:

### Langkah 1: Buat Tabel di Database (`server/src/db/fallbackDb.js` & `server/src/config/db.js`)
Tambahkan skema tabel baru:
```sql
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    definition TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);
```

### Langkah 2: Definisikan Kontrak GraphQL (`server/src/schema/typeDefs.js`)
```graphql
type Bookmark {
    id: ID!
    word: String!
    definition: String!
    created_at: String
}

type Query {
    # Ambil seluruh bookmark milik user yang sedang login
    myBookmarks: [Bookmark!]!
}

type Mutation {
    # Simpan kata baru ke bookmark
    addBookmark(word: String!, definition: String!): Bookmark!
}
```

### Langkah 3: Tulis Resolver di Backend (`server/src/resolvers/geminiResolvers.js`)
```javascript
export const bookmarkResolvers = {
    Query: {
        myBookmarks: async (_, __, { user }) => {
            if (!user) throw new Error("Silakan login terlebih dahulu");
            return await getBookmarksByUserId(user.id);
        }
    },
    Mutation: {
        addBookmark: async (_, { word, definition }, { user }) => {
            if (!user) throw new Error("Silakan login terlebih dahulu");
            return await insertBookmark(user.id, word, definition);
        }
    }
};
```

### Langkah 4: Tulis Mutasi di Frontend (`client/src/graphql/mutations.js`)
```javascript
import { gql } from '@apollo/client';

export const ADD_BOOKMARK = gql`
  mutation AddBookmark($word: String!, $definition: String!) {
    addBookmark(word: $word, definition: $definition) {
      id
      word
      definition
    }
  }
`;
```

### Langkah 5: Pasang Tombol di Komponen UI (`client/src/components/DictionaryView.jsx`)
```jsx
import React from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOKMARK } from '../graphql/mutations';

export function TombolBookmark({ kata, definisi, onSukses }) {
  const [tambahBookmark, { loading }] = useMutation(ADD_BOOKMARK);

  const handleKlik = async () => {
    try {
      await tambahBookmark({ variables: { word: kata, definition: definisi } });
      onSukses("Berhasil disimpan ke daftar favorit!");
    } catch (err) {
      console.warn("Gagal menyimpan bookmark:", err);
    }
  };

  return (
    <button className="btn-action" onClick={handleKlik} disabled={loading}>
      ⭐ {loading ? "Menyimpan..." : "Simpan Favorit"}
    </button>
  );
}
```

---

## 🔑 Referensi Lengkap Variabel Lingkungan (`server/.env`)

Salin berkas `.env.example` menjadi `server/.env`:

| Nama Variabel | Wajib? | Penjelasan & Contoh Nilai |
| :--- | :--- | :--- |
| `PORT` | Ya | Port server Express & GraphQL (Default: `4000`) |
| `HOST` | Ya | Alamat bind backend (default `127.0.0.1`, hanya komputer lokal) |
| `ALLOWED_ORIGINS` | Opsional | Daftar origin frontend tambahan dipisahkan koma; localhost sudah diizinkan secara default |
| `JWT_SECRET` | Ya | Secret acak minimal 32 karakter; server menolak nilai kosong/pendek dan penggantian secret membatalkan sesi lama |
| `ADMIN_EMAILS` | Tidak | Email akun terverifikasi yang diberi role admin, dipisahkan koma; kosong berarti belum ada admin |
| `ADMIN_PASSWORD` | Saat admin diaktifkan | Password tambahan bersama, minimal 16 karakter acak; tim admin tetap login dengan password akun masing-masing |
| `DB_HOST` | Opsional | Host MySQL (default `localhost`); SQLite lokal dipakai sebagai failover |
| `DB_PORT` | Opsional | Port MySQL (default `3306`) |
| `DB_USER` | Opsional | Pengguna MySQL (default `root`) |
| `DB_PASSWORD` | Opsional | Password pengguna MySQL |
| `DB_NAME` | Opsional | Nama database (default `pahamteks_db`) |
| `GEMINI_API_KEY_1` | Untuk fitur AI | Kunci Gemini pertama; isi `_2` sampai `_9` untuk rotasi atau `GEMINI_API_KEY` untuk satu kunci |
| `EMAIL_USER` | Untuk email OTP | Alamat email pengirim |
| `EMAIL_PASS` | Untuk email OTP | Gmail App Password atau password SMTP khusus aplikasi |
| `APOLLO_KEY` | Opsional | Token Rover untuk publish schema; tidak dipakai backend dan jangan commit |

Buat secret acak melalui terminal dengan `node -e "console.log(require('node:crypto').randomBytes(24).toString('base64url'))"`, lalu salin nilainya langsung ke `JWT_SECRET` atau `ADMIN_PASSWORD` pada `server/.env`. Perintah ini menghasilkan nilai 32 karakter. Jangan menaruh nilai yang dihasilkan di `.env.example`.

> [!CAUTION]
> **Zero Leak Policy**: Berkas `server/.env` dan database `server/data/*.sqlite` **TIDAK BOLEH PERNAH DI-PUSH** ke GitHub!

---

## 🔍 Kamus Masalah Umum & Cara Mengatasinya (Troubleshooting)

### 1. `Network error: Failed to fetch` di Console Browser
* **Penyebab**: Server backend di port 4000 belum menyala atau mati mendadak.
* **Solusi**: Buka terminal backend dan jalankan `npm --prefix server run dev`. Pastikan listener `http://127.0.0.1:4000` aktif.

### 2. `CORS policy: No 'Access-Control-Allow-Origin' header is present`
* **Penyebab**: Origin browser berbeda dari origin lokal yang diizinkan server.
* **Solusi**: Pastikan frontend berjalan di `http://127.0.0.1:3000`. Tambahkan origin ekstra ke `ALLOWED_ORIGINS` hanya jika memang diperlukan.

### 3. Log Muncul: `🛡️ [SQL FALLBACK] Database Cadangan SQL (SQLite) siap`
* **Penyebab**: Backend mencoba menghubungi MySQL di port 3306 tetapi tidak merespon (XAMPP mati atau belum dipasang).
* **Solusi**: Jangan panik, ini adalah fitur keamanan otomatis. Backend tetap berjalan 100% normal menggunakan SQLite lokal.

### 4. Port Sudah Digunakan: `Error: listen EADDRINUSE: address already in use :::4000`
* **Penyebab**: Ada proses node server lama yang masih menggantung di background.
* **Solusi di Windows PowerShell**:
  ```powershell
  Get-Process node | Stop-Process -Force
  ```
  Lalu jalankan ulang `npm --prefix server run dev`.

### 5. Kuota AI Habis: `429 Too Many Requests`
* **Penyebab**: Akun Google Gemini API sedang kehabisan limit kueri per menit.
* **Solusi**: Tambahkan kunci API baru di `server/.env` sebagai `GEMINI_API_KEY_2`. Backend otomatis merotasi kunci tanpa mengganggu pengguna.

---

## 🚀 Alur Kerja Harian Menjalankan Kedua Server

Buka dua jendela terminal terpisah di komputer kamu:

```powershell
# Terminal 1: Nyalakan Backend Server (Port 4000)
npm --prefix server run dev

# Terminal 2: Nyalakan Frontend Client (Port 3000)
npm --prefix client run dev
```

Kunjungi alamat:
* **Aplikasi Web**: `http://127.0.0.1:3000`
* **GraphQL Interactive Playground**: `http://127.0.0.1:4000/graphql`
* **Probe publik minimal**: `http://127.0.0.1:4000/healthz`
* **Health detail admin**: `http://127.0.0.1:4000/health` dengan `Authorization: Bearer <token-admin>`

### Menyiapkan dan membuka dashboard admin

1. Daftarkan akun pengguna dan verifikasi emailnya.
2. Masukkan email akun ke `ADMIN_EMAILS` di `server/.env`; beberapa email dipisahkan koma.
3. Buat `ADMIN_PASSWORD` acak minimal 16 karakter. Ini adalah password tambahan bersama, di samping password akun masing-masing admin.
4. Pastikan `JWT_SECRET` berisi secret acak minimal 32 karakter, lalu restart backend.
5. Buka `http://127.0.0.1:3000`. Pada kartu login layar awal, klik **Masuk khusus administrator** tepat di bawah tombol login pengguna. Masukkan email, password akun, dan password admin.
6. Setelah login sukses, menu **Admin** membuka dashboard status server dan audit log.

Backend memberikan klaim admin hanya setelah password akun, allowlist email, dan `ADMIN_PASSWORD` lolos pemeriksaan. Login biasa tidak mengangkat role. Mengubah `ADMIN_PASSWORD` membatalkan sesi admin lama. Query `serverStatus`, `userLogs`, dan detail `/health` memerlukan token admin yang valid; `logActivity` mengambil identitas pemilik dari token, bukan dari input `userId` klien. Gunakan HTTPS jika aplikasi dibuka melalui jaringan publik.

`server/.env` dan database lokal tidak ikut commit. Repositori privat membatasi akses kepada pemilik dan kolaborator yang diberi izin, tetapi secret tetap jangan dimasukkan ke Git karena bisa tersalin ke clone, log, atau integrasi lain.

---

## 🛡️ Standar Otomatisasi Git Push (Wajib Dipatuhi)

Setiap kali menyelesaikan penambahan fitur, perbaikan bug, atau pembaruan panduan:
1. **Verifikasi Build Frontend**:
   ```powershell
   npm --prefix client run build
   ```
   Pastikan sukses (`✓ built in X.XXs`).
2. **Periksa Zero Leak**: Pastikan `.env` dan `*.sqlite` tidak ikut ter-stage.
3. **Commit & Push ke GitHub**:
   ```powershell
   git add .
   git commit -m "docs: jelaskan filosofi dan arsitektur detail frontend backend fullstack"
   git push origin main
   ```
