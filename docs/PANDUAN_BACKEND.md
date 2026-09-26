# Panduan Lengkap Pengembangan Backend PahamTeks

Selamat datang rekan tim backend! Dokumen ini disusun secara lengkap dan mendalam agar siapa pun yang baru bergabung ke tim server **PahamTeks** bisa langsung memahami: **apa itu backend, bagian-bagian penyusunnya, cara kerja GraphQL, sistem database failover ganda, hingga rotasi multi-kunci AI Gemini**.

---

## 💡 Apa Itu Backend Sebenarnya? (Analogi Sederhana)

Jika diumpamakan sebagai **restoran**:
* **Backend** adalah **dapur utama, brankas penyimpanan resep rahasia, dan gudang bahan makanan**.
* Pengunjung di ruang makan (frontend) tidak pernah melihat wajan, kompor, atau gudang beras secara langsung. Mereka hanya memesan menu lewat pelayan, lalu dapur menyiapkan masakan dan mengirimkannya kembali ke meja.
* Tanpa backend, aplikasi kita hanya berupa gambar mati: tidak bisa menyimpan skor kuis, tidak bisa login, tidak bisa mengirim email verifikasi, dan tidak bisa menghasilkan soal kuis cerdas berbasis AI.

---

## ⚙️ Backend PahamTeks Itu Terdiri dari Apa Saja?

Di dalam folder `server/`, ekosistem backend kita ditopang oleh **8 pilar utama**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND PAHAMTEKS                               │
├────────────────────────────────────────────────────────────────────────┤
│ 1. HTTP WEB SERVER    : Express.js (Menjalankan listener di port 4000) │
│ 2. PERISAI KEAMANAN   : Helmet, CORS Whitelist, Rate Limiter, Brute-G  │
│ 3. RUNTIME GRAPHQL    : Apollo Server v4 (Skema typeDefs & resolvers)  │
│ 4. DUAL DATABASE      : MySQL Utama + SQLite Cadangan Otomatis         │
│ 5. MESIN AI GEMINI    : Google GenAI SDK + Rotasi Multi-Kunci 1–9     │
│ 6. MULTI-TIER CACHE   : RAM Memory Cache (0.04 ms) + Database Cache    │
│ 7. AUTENTIKASI        : Enkripsi Bcrypt + Token JWT Sesi 7-Hari        │
│ 8. LAYANAN EMAIL OTP  : Nodemailer SMTP untuk kode verifikasi 6-digit   │
└────────────────────────────────────────────────────────────────────────┘
```

Mari kita bedah masing-masing komponen di atas:

### 1. HTTP Web Server (Express.js)
Pintu gerbang yang menerima koneksi lokal di `http://127.0.0.1:4000`. Express menyediakan probe minimal `GET /healthz` dan detail health khusus admin di `GET /health`.

### 2. Perisai Keamanan (Security Middleware)
Sebelum request diizinkan masuk ke logika aplikasi, Express menyaringnya melalui 4 lapis pertahanan:
* **Helmet**: Mengamankan header HTTP terhadap serangan XSS dan sniffing.
* **CORS Whitelist**: Mengatur origin browser yang boleh mengakses API; frontend lokal berjalan di `http://127.0.0.1:3000`.
* **Rate Limiter**: Membatasi maksimal 200 request per 15 menit per alamat IP agar server tidak tumbang diserang spam/DDoS.
* **Brute-Force Guard (`securityLogger.js`)**: Memblokir sementara IP yang berkali-kali salah memasukkan password atau salah menebak kode OTP.

### 3. Runtime GraphQL (Apollo Server v4)
PahamTeks menggunakan Apollo Server v4 untuk memproses permintaan data. Berbeda dengan REST API konvensional yang memiliki puluhan URL terpisah (`/api/login`, `/api/quiz`, `/api/dictionary`), di GraphQL hanya ada **satu pintu tunggal** yaitu `/graphql`.

### 4. Dual Database Failover (MySQL + SQLite)
Sistem penyimpanan data kita memiliki kecerdasan otomatis (*failover engine*):
* **MySQL**: Digunakan sebagai basis data relasional utama untuk lingkungan produksi berskala besar.
* **SQLite Cadangan (`fallbackDb.js`)**: Jika MySQL di komputer developer mati atau belum diinstall, backend otomatis mengaktifkan database SQLite lokal (`server/data/pahamteks_backup.sqlite`). **Server tidak akan crash** dan developer bisa langsung mulai koding!

### 5. Mesin AI Gemini dengan Rotasi Multi-Kunci
Kuis dinamis dan penjelasan istilah diproduksi oleh Google Gemini AI. Agar aplikasi tidak terhenti saat kuota gratis Google habis, backend memiliki sistem **Round-Robin** yang menggilir hingga 9 kunci API berbeda (`GEMINI_API_KEY_1` s.d. `GEMINI_API_KEY_9`).

### 6. Multi-Tier Cache (Memori Super Cepat)
* **RAM Cache**: Pertanyaan kamus yang sudah pernah dicari disimpan di memori RAM server. Kueri berikutnya dijawab dalam waktu **`0.04 milidetik`** tanpa perlu memanggil Gemini API lagi.
* **Database Cache**: Istilah juga disimpan ke tabel `dictionary_cache` agar tidak hilang saat server di-restart.

### 7. Autentikasi Pengguna (Bcrypt & JWT)
* **Bcrypt**: Password pengguna di-acak dengan salt rounds terenkripsi. Teks password asli tidak pernah tersimpan di database.
* **JWT (JSON Web Token)**: Saat login berhasil, server menerbitkan token berformat string terenkripsi yang berlaku 7 hari sebagai tiket izin akses kuis dan profil.

### 8. Layanan Pengiriman Email OTP (Nodemailer)
Mengirim email otomatis berisi 6-digit angka rahasia ke kotak masuk pengguna saat registrasi atau permintaan reset password.

---

## 🍽️ Mengapa Kita Menggunakan GraphQL (Bukan REST Biasa)?

Berikut perbandingan mudahnya:

| Aspek | REST API Biasa | GraphQL Apollo di PahamTeks |
| :--- | :--- | :--- |
| **Endpoint URL** | Banyak URL (`/api/users`, `/api/scores`, `/api/quiz`) | Hanya 1 Endpoint tunggal: `/graphql` |
| **Over-fetching** | Mengambil seluruh data meski hanya butuh nama (boros kuota) | Frontend meminta persis data yang dibutuhkan saja |
| **Under-fetching** | Harus memanggil 3 API berbeda untuk menampilkan 1 halaman | Cukup 1 kueri GraphQL untuk mengambil data kuis + profil user sekaligus |
| **Dokumentasi** | Perlu membuat Swagger/Postman manual | Otomatis memiliki dokumentasi skema interaktif di GraphQL Sandbox |

---

## 📂 Peta Lengkap Berkas Backend (`server/`)

```text
server/
├── package.json                        <- Daftar pustaka & skrip server ("dev", "start")
├── .env                                <- Kunci rahasia API & database (JANGAN DIPUSH KE GIT)
├── .env.example                        <- Template contoh .env untuk tim baru
├── data/
│   └── pahamteks_backup.sqlite         <- Berkas database SQLite lokal (dibuat otomatis)
├── backups/
│   └── *.sql                           <- File backup dump database
└── src/
    ├── index.js                        <- Entry point: menyalakan listener di port 4000
    ├── app.js                          <- Inisialisasi Express, CORS, Helmet, Rate Limit, & Apollo
    │
    ├── config/
    │   ├── db.js                       <- Koneksi MySQL pool, auto-failover, dan auto-migrasi tabel
    │   └── gemini.js                   <- Rotasi kunci API Gemini 1-9 & pemilihan model AI
    │
    ├── db/
    │   ├── fallbackDb.js               <- Mesin SQLite: inisialisasi 6 tabel & fungsi query
    │   ├── initDb.js                   <- Skrip inisialisasi awal database
    │   └── exportSqlBackup.js          <- Skrip backup mengekspor data ke file SQL
    │
    ├── resolvers/                      <- Seluruh logika eksekusi data GraphQL
    │   ├── index.js                    <- Penggabung semua resolver
    │   ├── authResolvers.js            <- Login, register, verifikasi OTP, & reset password
    │   ├── geminiResolvers.js          <- Kuis adaptif, kamus pintar AI, penerjemah, memory cache
    │   └── historyResolvers.js         <- Riwayat kuis, aktivitas, dan skor belajar pemelajar
    │
    ├── schema/
    │   └── typeDefs.js                 <- "Kontrak data": seluruh definisi Type, Query, & Mutation
    │
    └── utils/
        ├── emailService.js             <- Pengirim email OTP verifikasi menggunakan Nodemailer
        └── securityLogger.js           <- Pencatat log keamanan, rate limit OTP, & brute-force guard
```

### 🧭 Panduan Arah & Lokasi Cepat Berkas Backend

Gunakan tabel kompas ini jika kamu mencari letak berkas spesifik di backend:

| Jika Kamu Ingin Mencari / Mengubah... | Lokasi Berkas Persis (Path Lengkap) |
| :--- | :--- |
| **Port server, CORS, Rate Limit, Helmet, & endpoint health** | [`server/src/app.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/app.js) |
| **Verifikasi JWT dan role admin berbasis email allowlist** | [`server/src/utils/auth.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/utils/auth.js) |
| **Port listener utama server (Port 4000)** | [`server/src/index.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/index.js) |
| **Koneksi MySQL, deteksi failover ke SQLite, & migrasi** | [`server/src/config/db.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/config/db.js) |
| **Rotasi 1-9 API Key Gemini, pemilihan model AI, & prompt** | [`server/src/config/gemini.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/config/gemini.js) |
| **Skema 6 tabel SQLite lokal & query executor fallback** | [`server/src/db/fallbackDb.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/db/fallbackDb.js) |
| **File database SQLite lokal tempat data tersimpan** | `server/data/pahamteks_backup.sqlite` |
| **Skrip ekspor data ke file backup .sql** | [`server/src/db/exportSqlBackup.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/db/exportSqlBackup.js) |
| **Kontrak skema GraphQL (Query & Mutation type definitions)** | [`server/src/schema/typeDefs.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/schema/typeDefs.js) |
| **Logika login, register, OTP email, reset password, & JWT** | [`server/src/resolvers/authResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/authResolvers.js) |
| **Logika kuis adaptif, kamus pintar AI, & RAM memory cache** | [`server/src/resolvers/geminiResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/geminiResolvers.js) |
| **Logika riwayat kuis pemelajar & kueri audit admin (`userLogs`)** | [`server/src/resolvers/historyResolvers.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/historyResolvers.js) |
| **Penggabung seluruh resolver GraphQL** | [`server/src/resolvers/index.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/resolvers/index.js) |
| **Template email OTP & konfigurasi SMTP Nodemailer** | [`server/src/utils/emailService.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/utils/emailService.js) |
| **Logika brute-force guard, rate limiting OTP, & log insiden** | [`server/src/utils/securityLogger.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/utils/securityLogger.js) |
| **Kunci rahasia API & kredensial database (Lokal)** | `server/.env` (contoh di `server/.env.example`) |
| **Daftar pustaka dependencies backend** | [`server/package.json`](file:///c:/Salim/Kerjaan/pahamteks/server/package.json) |

---

## 🗄️ Skema Lengkap Tabel Database (6 Tabel Inti)

Baik di MySQL maupun di SQLite fallback, kita menggunakan skema 6 tabel yang sama:

```text
  ┌──────────────┐         ┌───────────────────┐
  │    users     │         │   quiz_history    │
  ├──────────────┤         ├───────────────────┤
  │ id (PK)      │◄───┐    │ id (PK)           │
  │ email        │    └───-│ user_id (FK)      │
  │ username     │         │ level             │
  │ password     │         │ score             │
  │ first_name   │         │ total_questions   │
  │ created_at   │         │ answers_json      │
  └──────────────┘         └───────────────────┘
         ▲
         │                 ┌───────────────────────┐
         │                 │  user_activity_logs   │
         │                 ├───────────────────────┤
         └─────────────────│ user_id (FK)          │
                           │ action                │
                           │ details               │
                           └───────────────────────┘

  ┌────────────────────────┐      ┌────────────────────────┐
  │    otp_verifications   │      │    dictionary_cache    │
  ├────────────────────────┤      ├────────────────────────┤
  │ email (PK)             │      │ keyword (PK)           │
  │ otp_code               │      │ lang                   │
  │ expires_at             │      │ result (Markdown AI)   │
  │ created_at             │      │ created_at             │
  └────────────────────────┘      └────────────────────────┘
```

1. **`users`**: Menyimpan kredensial akun pemelajar, status email, dan profil.
2. **`otp_verifications`**: Tempat menyimpan kode OTP 6-digit acak yang memiliki masa kedaluwarsa 10 menit.
3. **`quiz_history`**: Mencatat setiap riwayat penyelesaian kuis (unit, skor yang diraih, jawaban detail dalam format JSON, waktu pengerjaan).
4. **`user_activity_logs`**: Log jejak audit keamanan (kapan user login, ganti password, atau mengerjakan tes).
5. **`dictionary_cache`**: Menyimpan jawaban kamus AI secara permanen agar pencarian kata yang sama tidak membuang kuota Gemini.
6. **`security_events`**: Mencatat IP dan aktivitas mencurigakan yang diblokir oleh sistem keamanan.

---

## 🛡️ Alur Kerja Dual Database Failover

```text
Server Mulai Dijalankan (src/index.js)
              │
              ▼
    [ Panggil db.js ]
              │
              ▼
   Mencoba koneksi ke MySQL?
              │
     ┌────────┴────────┐
     ▼                 ▼
  [SUKSES]          [GAGAL]
     │                 │
  Gunakan           Gunakan SQLite Cadangan:
  MySQL Utama       server/data/pahamteks_backup.sqlite
     │                 │
     └────────┬────────┘
              │
              ▼
   Jalankan Auto-Migrasi (Buat tabel jika belum ada)
              │
              ▼
   Apollo Server Siap di Port 4000!
```

---

## 🔐 Alur Lengkap Autentikasi & Verifikasi OTP Email

Berikut proses pendaftaran pengguna baru dari awal sampai akun aktif:

```text
[1. User Mendaftar]   Pengguna memasukkan email, username, dan password di antarmuka.
        │
        ▼
[2. Hash Password]    Backend meng-hash password menggunakan bcryptjs (10 salt rounds).
        │
        ▼
[3. Generate OTP]     Backend menghasilkan 6-digit angka acak (misal: "847291").
        │
        ▼
[4. Simpan ke DB]     Kode OTP disimpan di tabel otp_verifications dengan batas waktu 10 menit.
        │
        ▼
[5. Kirim Email]      Nodemailer mengirim template email rapi ke kotak masuk pengguna.
        │
        ▼
[6. Verifikasi OTP]   Pengguna memasukkan 6 digit di UI. Backend memvalidasi kecocokan kode.
        │
        ▼
[7. Terbitkan JWT]    Jika valid, akun disimpan di tabel users dan server menerbitkan token JWT 7-hari.
```

---

## 🛠️ Studi Kasus: Cara Menambah Kueri / Fitur Baru di Backend

Misalnya kamu ingin membuat fitur kueri baru: **Mengecek versi aplikasi & status server**:

### 1. Daftarkan di Kontrak Skema (`server/src/schema/typeDefs.js`)
```graphql
type AppStatus {
    version: String!
    environment: String!
    activeDatabase: String!
}

type Query {
    # Fitur lama...
    appStatus: AppStatus!
}
```

### 2. Tulis Logika di Resolver (`server/src/resolvers/geminiResolvers.js` atau file baru)
```javascript
export const statusResolvers = {
    Query: {
        appStatus: async () => {
            return {
                version: "1.0.0",
                environment: process.env.NODE_ENV || "development",
                activeDatabase: isSqliteFallback ? "SQLite (Cadangan)" : "MySQL (Utama)"
            };
        }
    }
};
```

### 3. Uji Coba di Browser
Buka `http://127.0.0.1:4000/graphql` dan jalankan:
```graphql
query {
    appStatus {
        version
        environment
        activeDatabase
    }
}
```

---

## 👑 Akses & Pemantauan Khusus Administrator (Admin & Ops Guide)

Bagi pengembang atau administrator yang ingin mengawasi kesehatan server, melacak log aktivitas pengguna, dan mengelola database, berikut peta berkas dan pintu akses admin yang tersedia di backend:

### 1. Peta Berkas Akses Admin di Server

| Kebutuhan Admin | Berkas yang Bertanggung Jawab | Cara Mengakses |
| :--- | :--- | :--- |
| **Probe server minimal** | `server/src/app.js` | `GET http://127.0.0.1:4000/healthz` (hanya status proses) |
| **Status server terperinci** | `server/src/schema/typeDefs.js` & `server/src/resolvers/index.js` | Query GraphQL `serverStatus`, hanya untuk token admin |
| **Audit trail aktivitas pengguna** | `server/src/resolvers/historyResolvers.js` | Query GraphQL `userLogs(limit: Int)`, hanya untuk token admin |
| **Log Keamanan & Brute-Force Guard** | `server/src/utils/securityLogger.js` | Tabel `security_events` & pencatatan log otomatis |
| **Ekspor Backup Database SQL** | `server/src/db/exportSqlBackup.js` | Jalankan terminal: `node server/src/db/exportSqlBackup.js` |
| **Akses Langsung Basis Data (GUI)** | `server/data/pahamteks_backup.sqlite` | Buka file dengan *DB Browser for SQLite* atau *DBeaver* |

---

### 2. Memeriksa Probe Server Publik via REST `/healthz`

Endpoint publik ini hanya memberi sinyal hidup/mati agar detail database, memori, dan Gemini tidak terbuka:

```powershell
curl http://127.0.0.1:4000/healthz
```

Detail `GET /health` memerlukan header `Authorization: Bearer <token-admin>`.

**Contoh Output Balasan:**
```json
{
  "status": "OK"
}
```

---

### 3. Kueri Khusus Administrator di GraphQL Playground

Buka GraphQL client di `http://127.0.0.1:4000/graphql`, masuk dengan token sesi admin, lalu jalankan kueri berikut:

#### A. Memeriksa Jumlah Kunci AI & Status Database:
```graphql
query AdminCheckServer {
  serverStatus {
    status
    geminiKeysCount
    dbConnected
    timestamp
  }
}
```

#### B. Memeriksa Audit Trail 50 Aktivitas Terakhir Pengguna:
```graphql
query AdminAuditLogs {
  userLogs(limit: 50) {
    id
    userId
    action
    details
    createdAt
  }
}
```

---

### 4. Panel Admin (Role-Based Access)

Email di `ADMIN_EMAILS` hanya menentukan akun yang diizinkan mencoba login admin. Backend memberi role admin setelah password akun dan `ADMIN_PASSWORD` juga benar serta menerbitkan token sesi admin bertanda tangan. Role yang dikirim browser tidak dipercaya. `serverStatus`, `userLogs`, dan detail `GET /health` ditolak tanpa token admin yang sah.

Untuk mengaktifkan admin:

1. Daftarkan akun PahamTeks biasa dan verifikasi emailnya.
2. Isi `ADMIN_EMAILS` dengan email akun tersebut. Beberapa alamat dapat dipisahkan koma.
3. Isi `ADMIN_PASSWORD` dengan password admin tambahan acak minimal 16 karakter. Semua email di allowlist memakai password admin tambahan yang sama; tiap admin tetap memasukkan password akun masing-masing.
4. Isi `JWT_SECRET` dengan secret acak minimal 32 karakter. Server menolak secret kosong/pendek; menggantinya membatalkan semua sesi lama.
5. Restart backend setelah mengubah `.env`.

Login admin memeriksa password akun, email allowlist, dan `ADMIN_PASSWORD` di backend. Login biasa tidak memberikan role admin meski emailnya ada di allowlist. Backend hanya membuat klaim sesi admin setelah ketiga pemeriksaan berhasil, dan menurunkan hak akses jika email tidak lagi ada di allowlist.
Fingerprint secret admin juga diperiksa pada setiap request; mengganti `ADMIN_PASSWORD` langsung membatalkan sesi admin yang lama.

Buka aplikasi di `http://127.0.0.1:3000`, masuk ke login, lalu pilih **Masuk khusus administrator**. Isi email, password akun, serta password admin. Setelah berhasil, menu **Admin** membuka dashboard visual. Dashboard menampilkan status GraphQL, koneksi database, jumlah kunci Gemini, serta maksimal 100 log terbaru. Semua query tetap diperiksa server; menyembunyikan menu di frontend bukan kontrol akses.

Setiap resolver root memiliki kebijakan akses eksplisit di `server/src/resolvers/index.js`. `me` memerlukan sesi, `logActivity` mengambil pemilik log dari identitas token, sedangkan `userLogs`, `serverStatus`, dan detail `/health` memerlukan sesi admin. Operasi belajar serta autentikasi tetap publik untuk mendukung pengguna tamu. Log aktivitas tidak dapat dibaca oleh akun biasa.

Contoh memeriksa health detail setelah memperoleh token admin melalui login:

```powershell
curl.exe -H "Authorization: Bearer <token-admin>" http://127.0.0.1:4000/health
```

Jangan menempelkan token nyata ke dokumentasi, tiket, atau commit.

---

## 🚀 Perintah Menjalankan Backend & Utilitas

```powershell
# Menjalankan server backend dengan auto-reload (port 4000)
npm --prefix server run dev

# Memeriksa probe publik minimal
curl http://127.0.0.1:4000/healthz

# Mengekspor isi database ke file backup SQL
node server/src/db/exportSqlBackup.js
```
