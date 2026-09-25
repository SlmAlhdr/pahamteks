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
* **Frontend** berjalan di browser pengguna melalui web server Vite di port `http://localhost:3000`.
* **Backend** berjalan di mesin Node.js Express di port `http://localhost:4000`.
* Kedua dunia ini berkomunikasi lewat protokol HTTP POST ke URL `/graphql` dan GET ke `/health`.
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
Seluruh kunci rahasia disimpan di file `server/.env` dan dilindungi secara ketat oleh *Zero Leak Policy* agar tidak pernah bocor ke internet.

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
[3. Apollo Dispatch]  Apollo Client mengirim HTTP POST ke http://localhost:4000/graphql membawa
        │             mutasi SAVE_QUIZ_SCORE dan header Authorization: Bearer <token_jwt>.
        │
        ▼
[4. Security Shield]  Express menyaring request melalui Helmet, CORS Whitelist, dan Rate Limiter.
        │
        ▼
[5. JWT Verification] Middleware server memeriksa keaslian token JWT dan mengekstrak user_id pemelajar.
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

Tabel berikut memetakan setiap fitur di antarmuka pengguna ke file backend dan tabel database yang bertanggung jawab:

| Fitur Aplikasi | Komponen Antarmuka (`client/`) | Resolver Backend (`server/`) | Tabel Database / Layanan |
| :--- | :--- | :--- | :--- |
| **Kuis Adaptif (Unit 1–5)** | `src/components/QuizView.jsx` | `src/resolvers/geminiResolvers.js` | Gemini AI + In-Memory Cache |
| **Kamus Pintar & Glosarium** | `src/components/DictionaryView.jsx` | `src/resolvers/geminiResolvers.js` | `dictionary_cache` + Gemini AI |
| **Login & Registrasi Akun** | `src/components/AuthModal.jsx` | `src/resolvers/authResolvers.js` | `users` (Bcrypt hash) |
| **Kode OTP Verifikasi Email** | `src/components/AuthModal.jsx` | `src/utils/emailService.js` | `otp_verifications` + Nodemailer |
| **Riwayat Skor & Statistik** | `src/components/DashboardView.jsx` | `src/resolvers/historyResolvers.js` | `quiz_history` (MySQL/SQLite) |
| **Log Aktivitas Pengguna** | `src/App.jsx` | `src/resolvers/historyResolvers.js` | `user_activity_logs` |
| **Maskot Pintar Teksie** | `src/components/TeksieMascotCompanion.jsx` | Logika state lokal React | Suara Web Speech API |

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
| `CORS_ORIGIN` | Ya | Alamat frontend yang diizinkan (`http://localhost:3000`) |
| `JWT_SECRET` | Ya | Kunci acak untuk enkripsi tanda tangan token sesi login |
| `GEMINI_API_KEY_1` | Ya | Kunci API utama Google Gemini AI (`AIzaSy...`) |
| `GEMINI_API_KEY_2` | Opsional | Kunci API cadangan ke-2 untuk rotasi kuota otomatis |
| `GEMINI_API_KEY_3` | Opsional | Kunci API cadangan ke-3 untuk rotasi kuota otomatis |
| `MYSQL_HOST` | Ya | Host server MySQL (Default: `localhost`) |
| `MYSQL_PORT` | Ya | Port database MySQL (Default: `3306`) |
| `MYSQL_USER` | Ya | Akun pengguna MySQL (Default: `root`) |
| `MYSQL_PASSWORD` | Ya | Password MySQL (Bisa dikosongkan `""` jika XAMPP lokal) |
| `MYSQL_DATABASE` | Ya | Nama skema database (Default: `pahamteks`) |
| `SMTP_HOST` | Ya | Server pengirim email verifikasi OTP (`smtp.gmail.com`) |
| `SMTP_USER` | Ya | Alamat email pengirim (`noreply.pahamteks@gmail.com`) |
| `SMTP_PASS` | Ya | 16-karakter App Password Google Mail |

> [!CAUTION]
> **Zero Leak Policy**: Berkas `server/.env` dan database `server/data/*.sqlite` **TIDAK BOLEH PERNAH DI-PUSH** ke GitHub!

---

## 🔍 Kamus Masalah Umum & Cara Mengatasinya (Troubleshooting)

### 1. `Network error: Failed to fetch` di Console Browser
* **Penyebab**: Server backend di port 4000 belum menyala atau mati mendadak.
* **Solusi**: Buka terminal backend dan jalankan `npm --prefix server run dev`. Pastikan muncul tulisan `🚀 Apollo Server siap di http://localhost:4000/graphql`.

### 2. `CORS policy: No 'Access-Control-Allow-Origin' header is present`
* **Penyebab**: Alamat URL frontend yang kamu buka di browser tidak cocok dengan nilai `CORS_ORIGIN` di berkas `server/.env`.
* **Solusi**: Pastikan frontend berjalan di port 3000 atau samakan nilai `CORS_ORIGIN=http://localhost:3000`.

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
* **Aplikasi Web**: `http://localhost:3000`
* **GraphQL Interactive Playground**: `http://localhost:4000/graphql`
* **Health Check API**: `http://localhost:4000/health`

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
