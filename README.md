# PahamTeks

> Platform belajar interaktif yang menggabungkan bahasa manusia dan logika pemrograman dalam satu tempat, ditenagai AI.  
> Aplikasi langsung: [pahamteks.vercel.app](https://pahamteks.vercel.app)

---

## Kenapa PahamTeks Dibuat?

Kebanyakan orang belajar bahasa asing di satu aplikasi (seperti Duolingo) dan belajar koding di platform terpisah yang kaku (seperti tutorial teks biasa). Saya membangun **PahamTeks** dengan satu ide sederhana: **bahasa manusia dan bahasa pemrograman sama-sama punya tata bahasa, logika, dan struktur**.

Di PahamTeks, pemelajar di Indonesia bisa mengasah keduanya sekaligus:
1. **Bahasa Dunia**: Mulai dari kosakata sehari-hari, grammar, sampai percakapan di puluhan bahasa dunia.
2. **Bahasa Pemrograman**: Memahami konsep algoritma, JavaScript, Python, Web, SQL, dan struktur data tanpa intimidasi teknis.
3. **Didampingi Teman Belajar (Teksie)**: Maskot musang 2D interaktif yang menemani, memberi semangat, dan reaktif saat kita sedang idle atau salah menjawab.

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

Semua catatan perencanaan, arsitektur, dan SOP teknis tersimpan di folder [`docs/`](./docs/):

- 📄 **[PRD (Product Requirement)](./docs/PRD.md)**: Visi produk, persona pengguna, dan ide fitur yang siap didiskusikan bersama tim.
- 🏗️ **[Arsitektur Sistem](./docs/ARCHITECTURE.md)**: Diagram aliran data React 18, Apollo GraphQL, Gemini AI, dan mekanisme failover database.
- 🤖 **[Pedoman Karakter & AI Agent](./docs/AGENT.md)**: Persona maskot Teksie, gaya bahasa mentor, dan aturan otomatisasi development.
- 📋 **[Roadmap & Backlog Tim](./docs/TODO.md)**: Apa yang sudah selesai, prioritas sprint saat ini, dan ide-ide masa depan.
- 🧠 **[Matriks Domain Materi](./docs/SKILL.md)**: Silabus bahasa pemrograman dan linguistik yang diajarkan di PahamTeks.
- ⚙️ **[Alur Kerja & SOP](./docs/WORKFLOW.md)**: Standar setup lokal, backup database berkala, dan penanganan insiden.
- 🛡️ **[AI Quality Gate](./docs/AI_SLOP.md)**: Standar kebersihan kode, aturan anti-AI-slop, dan pipeline CI GitHub Actions.
- 📖 **[Panduan Memulai Tim](./docs/README.md)**: Titik awal orientasi untuk rekan developer atau kontributor baru.

---

## Menjalankan di Komputer Lokal

```bash
# 1. Clone repositori
git clone https://github.com/slmalhadar-lab/pahamteks.git
cd pahamteks

# 2. Setup konfigurasi environment
cp .env.example server/.env
# Isi minimal GEMINI_API_KEY di dalam server/.env

# 3. Pasang pustaka dependensi
npm --prefix server install
npm --prefix client install

# 4. Jalankan aplikasi (buka dua terminal terpisah)
npm --prefix server run dev    # Backend berjalan di http://localhost:4000
npm --prefix client run dev    # Frontend berjalan di http://localhost:5173
```

---

Dibuat dengan dedikasi untuk memajukan literasi teknologi dan bahasa bagi siapa saja di Indonesia. © 2026 PahamTeks.
