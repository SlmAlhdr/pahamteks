# PahamTeks 🚀

> **Platform Pembelajaran Terpadu Bahasa Dunia & Bahasa Pemrograman Berbasis AI**  
> Web live: [pahamteks.vercel.app](https://pahamteks.vercel.app)

---

## 🌟 Tentang PahamTeks
**PahamTeks** adalah platform edukasi inovatif yang menjembatani pembelajaran bahasa asing (50+ bahasa dunia) dan logika bahasa pemrograman (Python, JavaScript, Web, Algoritma, Database, OOP) dalam satu pengalaman belajar yang menyenangkan, interaktif, dan bebas friksi.

### ✨ Fitur Unggulan
* 🧠 **Kuis Adaptif Bertingkat (Unit 1–5)**: Didukung AI Google Gemini dengan umpan balik ramah saat jawaban salah.
* 📖 **Kamus Pintar & Glosarium Terpadu**: Definisi terstruktur, contoh nyata, dan widget mengambang (*floating bubble*).
* 🌐 **Penerjemah Multibahasa & Transkripsi Suara**: Terjemahan teks dan suara (*voice-to-text*) instan.
* 📊 **Wawasan Komparasi Bahasa**: Matriks perbandingan karakteristik bahasa dunia dan bahasa pemrograman.
* 🛡️ **Dual-Database Auto-Failover**: Menggunakan MySQL sebagai basis data utama dengan cadangan otomatis ke SQLite saat MySQL offline.
* 🔒 **Sistem Keamanan Berlapis**: Proteksi *Brute Force*, *Rate Limiting*, proteksi *Email Bombing*, dan token sesi JWT.
* 🎭 **Maskot Teman Belajar (Teksie)**: Sahabat belajar interaktif 2D di layar.

---

## 📚 Dokumentasi Lengkap Proyek (Folder `docs/`)

Seluruh dokumen teknis dan panduan tim telah disusun secara rapi di dalam folder [`docs/`](./docs/):

* 📄 **[Product Requirement Document (PRD)](./docs/PRD.md)**: Visi, target pengguna, dan rincian kebutuhan fitur.
* 🏗️ **[Arsitektur Sistem (ARCHITECTURE)](./docs/ARCHITECTURE.md)**: Diagram arsitektur, lapisan frontend, backend, keamanan, dan failover basis data.
* 🤖 **[Pedoman AI Agent (AGENT)](./docs/AGENT.md)**: Persona maskot Teksie, prompt kurator materi, dan aturan AI dev assistant.
* 📋 **[Roadmap & Daftar Rencana (TODO)](./docs/TODO.md)**: Milestone yang sudah selesai, sprint berikutnya, dan backlog ide tim.
* 🧠 **[Matriks Kemampuan (SKILL)](./docs/SKILL.md)**: Pengetahuan domain bahasa pemrograman, linguistik, dan keamanan.
* ⚙️ **[Alur Kerja & SOP (WORKFLOW)](./docs/WORKFLOW.md)**: Alur development lokal, CI/CD, backup database, dan penanganan insiden.
* 📖 **[Panduan Memulai Tim (docs/README)](./docs/README.md)**: Onboarding komprehensif bagi anggota tim baru.

---

## 🚀 Memulai Cepat (Quick Start)

```bash
# 1. Clone repositori
git clone https://github.com/slmalhadar-lab/pahamteks.git
cd pahamteks

# 2. Setup environment
cp .env.example server/.env
# Isi kunci GEMINI_API_KEY di server/.env

# 3. Install dependencies
npm --prefix server install
npm --prefix client install

# 4. Jalankan aplikasi
npm --prefix server run dev    # Backend di port 4000
npm --prefix client run dev    # Frontend di port 5173
```

---

## 📜 Lisensi
Dikembangkan dengan penuh dedikasi untuk pemelajar di Indonesia. © 2026 PahamTeks.
