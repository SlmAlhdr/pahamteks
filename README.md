# PahamTeks

> Platform belajar interaktif yang menggabungkan bahasa manusia dan logika pemrograman dalam satu tempat, ditenagai AI. 

---

## Kenapa PahamTeks Dibuat?

Kebanyakan orang belajar bahasa asing di satu aplikasi (seperti Duolingo) dan belajar koding di platform terpisah yang kaku (seperti tutorial teks biasa). Saya membangun **PahamTeks** dengan satu ide sederhana: **bahasa manusia dan bahasa pemrograman sama-sama punya tata bahasa, logika, dan struktur**.

Di PahamTeks, pemelajar di Indonesia bisa mengasah keduanya sekaligus:
1. **Bahasa Dunia**: Mulai dari kosakata sehari-hari, grammar, sampai percakapan di puluhan bahasa dunia.
2. **Bahasa Pemrograman**: Memahami konsep algoritma, JavaScript, Python, Web, SQL, dan struktur data tanpa intimidasi teknis.
3. **Karakter Teksie**: Maskot musang 2D oranye yang tampil pada panel pembelajaran koding dan ilustrasi beranda.

---

## Fitur yang Sudah Aktif di Sistem

- **Kuis Bertingkat (Unit 1–5)**: Soal adaptif dengan evaluasi AI Gemini. Saat salah menjawab, ada tombol penjelas "Kenapa Salah?" yang menguraikan letak kekeliruan konsep secara manusiawi.
- **Kamus Pintar & Glosarium A–Z**: Penjelasan istilah teknologi dan bahasa yang diformat ramah pemula, lengkap dengan pelafalan suara (Audio Web Speech).
- **Penerjemah Teks & Suara**: Terjemahan multibahasa instan dengan input audio mikrofon langsung dari browser.
- **Wawasan Komparasi**: Matriks perbandingan logika bahasa (misal: membandingkan cara kerja loop di Python vs JavaScript, atau struktur kalimat bahasa Indonesia vs Jepang).
- **Dual-Database Resilien**: Backend otomatis memakai MySQL jika server database aktif, dan otomatis beralih ke SQLite lokal saat MySQL offline sehingga aplikasi tidak pernah crash.
- **Sistem Akun & Tamu**: Mendukung sesi tamu instan (*one-click guest*) maupun akun resmi permanen dengan verifikasi OTP email asli dan perlindungan brute-force.

---

## Panduan Tim & Dokumentasi Lengkap (`docs/`)

Semua catatan perencanaan, arsitektur, panduan teknis, dan roadmap tersimpan lengkap di folder [`docs/`](./docs/):

- 🧭 **[Roadmap Pengembangan Tim](./docs/ROADMAP.md)**: Rencana tahapan proyek (Fase 1 s/d 4) dan prioritas fitur saat ini.
- ⚙️ **[Panduan Tim Backend](./docs/PANDUAN_BACKEND.md)**: Alur kerja Node.js, Express, GraphQL Resolvers, rotasi Gemini AI, dan penanganan database.
- 🎨 **[Panduan Tim Frontend](./docs/PANDUAN_FRONTEND.md)**: Struktur komponen React 18, styling CSS murni, audio speech, dan standar antarmuka bebas alert.
- 🌐 **[Panduan Akses HTTPS Pribadi](./docs/PANDUAN_AKSES_HTTPS_PRIBADI.md)**: Tutorial membuka akses publik via Cloudflare Tunnel untuk uji coba di HP atau bersama tim.
- 📄 **[PRD (Product Requirement)](./docs/PRD.md)**: Visi produk, persona pengguna, dan ide fitur yang siap didiskusikan bersama tim.
- 🏗️ **[Arsitektur Sistem](./docs/ARCHITECTURE.md)**: Diagram React, Apollo GraphQL, Gemini, Vercel, dan TiDB Cloud.
- 🤖 **[Pedoman Karakter & AI](./docs/AGENT.md)**: Perilaku fitur AI yang berjalan, karakter Teksie, dan batas fitur materi dokumen.
- 📋 **[Backlog & TODO Tim](./docs/TODO.md)**: Catatan backlog teknis dan ide-ide masa depan.
- 🧠 **[Matriks Domain Materi](./docs/SKILL.md)**: Silabus bahasa pemrograman dan linguistik yang diajarkan di PahamTeks.
- 🛡️ **[AI Quality Gate](./docs/AI_SLOP.md)**: Konfigurasi scanner `aislop`, perintah lokal, dan pipeline GitHub Actions.

---

## 🚀 Menjalankan di Komputer Lokal

### Opsi A: Super Cepat (Khusus Windows)
Bagi anggota tim di Windows, proyek ini sudah dilengkapi tombol pintasan siap pakai:

1. **Setup Pertama Kali**: Klik dua kali berkas **`setup.bat`** (otomatis membuat `server/.env` dan menginstall seluruh dependensi).
2. **Isi API Key**: Buka berkas `server/.env`, masukkan kunci gratis Gemini API Anda di baris `GEMINI_API_KEY=...`.
3. **Jalankan Aplikasi**: Klik dua kali berkas **`start-dev.bat`** (otomatis membuka jendela Backend & Frontend sekaligus).
4. **Sinkronisasi Kode**: Klik dua kali **`sync.bat`** saat ingin menarik (*pull*) update tim dan mendorong (*push*) hasil kerja Anda.

---

### Opsi B: Manual via Terminal (Cross-Platform)

```bash
# 1. Clone repositori
git clone https://github.com/slmalhadar-lab/pahamteks.git
cd pahamteks

# 2. Setup konfigurasi environment
cp server/.env.example server/.env
# Isi minimal GEMINI_API_KEY di dalam server/.env

# 3. Pasang pustaka dependensi
npm install

# 4. Jalankan aplikasi (buka dua terminal terpisah)
npm --prefix server run dev    # Backend berjalan di http://localhost:4000
npm --prefix client run dev    # Frontend berjalan di http://localhost:3000
```

---

Dibuat dengan dedikasi untuk memajukan literasi teknologi dan bahasa bagi siapa saja di Indonesia. © 2026 PahamTeks.
