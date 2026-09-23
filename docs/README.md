# Pusat Dokumentasi & Panduan Tim — PahamTeks

Selamat datang di repositori dokumentasi resmi **PahamTeks**. Dokumen ini disiapkan khusus agar seluruh anggota tim dapat dengan cepat memahami sistem yang sudah berjalan, arsitektur teknisnya, serta roadmap ide-ide yang siap didiskusikan dan dikembangkan bersama.

---

## 🧭 Peta & Indeks Berkas Dokumentasi

Untuk membaca aspek tertentu dari proyek PahamTeks, silakan buka dokumen terkait di dalam folder `docs/`:

| Nama Berkas | Fokus Utama Dokumen | Cocok Dibaca Oleh |
| :--- | :--- | :--- |
| 📄 [`PRD.md`](./PRD.md) | **Product Requirement Document**: Visi produk, profil pengguna, rincian fitur utama, dan rencana diskusi masa depan. | Product Manager, UI/UX Designer, Stakeholder |
| 🏗️ [`ARCHITECTURE.md`](./ARCHITECTURE.md) | **Arsitektur Sistem**: Diagram aliran data, lapisan React, Apollo GraphQL, integrasi Gemini AI, dan sistem failover database ganda. | Software Architect, Backend & Frontend Dev |
| 🤖 [`AGENT.md`](./AGENT.md) | **Pedoman AI Agent**: Persona maskot Teksie, aturan prompt AI mentor, serta aturan operasional otomatisasi git bagi AI dev assistant. | AI Engineer, Prompt Designer, Dev Assistant |
| 📋 [`TODO.md`](./TODO.md) | **Roadmap & Daftar Rencana**: Rincian pencapaian yang sudah selesai, prioritas sprint berikutnya, dan backlog ide tim. | Seluruh Tim (Sprint Planning & Brainstorming) |
| 🧠 [`SKILL.md`](./SKILL.md) | **Matriks Kemampuan Domain**: Pemetaan materi bahasa pemrograman, linguistik 50+ bahasa dunia, dan standar keamanan sistem. | Content Curator, Educator, Developer |
| ⚙️ [`WORKFLOW.md`](./WORKFLOW.md) | **Alur Kerja & SOP**: Panduan setup lokal, aturan otomatisasi Git & Vercel, pencadangan database, dan penanganan insiden. | Developer, QA / Tester, DevOps / SRE |

---

## 🚀 Panduan Memulai Cepat (Quick Start for Developers)

### 1. Prasyarat Sistem
* Node.js v18.0.0 atau lebih baru (Disarankan Node.js v20 / v24).
* Git terpasang di komputer.
* (Opsional) Server MySQL lokal seperti XAMPP / MariaDB / Docker. Jika tidak ada MySQL, sistem otomatis menggunakan SQLite cadangan tanpa konfigurasi tambahan!

### 2. Pemasangan & Menjalankan Proyek
```bash
# 1. Clone repositori
git clone https://github.com/slmalhadar-lab/pahamteks.git
cd pahamteks

# 2. Salin berkas konfigurasi environment
cp .env.example server/.env

# 3. Buka server/.env lalu masukkan Gemini API Key Anda:
# GEMINI_API_KEY=AIzaSy...

# 4. Pasang seluruh pustaka dependensi
npm --prefix server install
npm --prefix client install

# 5. Jalankan server backend (Terminal 1)
npm --prefix server run dev
# Server aktif di http://localhost:4000/graphql dan http://localhost:4000/health

# 6. Jalankan client frontend (Terminal 2)
npm --prefix client run dev
# Frontend aktif di http://localhost:5173
```

---

## 💡 Status Saat Ini vs Ide yang Akan Didiskusikan

### Yang Sudah Aktif di Produksi:
* **Frontend**: Antarmuka React 18 responsif, navigasi terpusat, teks latar belakang dinamis, tombol Kamus Pintar mengambang semi-transparan, modal notifikasi tengah layar, dan maskot interaktif Teksie.
* **Backend & AI**: Apollo Server GraphQL, rotasi multi-kunci Gemini API (*Round-Robin*), kuis adaptif anti-repetisi Unit 1–5, kamus instan, dan transkripsi suara.
* **Keamanan & Ketahanan**: Proteksi *Brute Force*, *Rate Limiting*, proteksi *Email Bombing*, token sesi JWT, serta **Dual Database Failover** (MySQL otomatis beralih ke SQLite jika down).

### Ide Menarik yang Siap Dibahas Bersama Tim (Lihat [`TODO.md`](./TODO.md)):
1. **Audio Pelafalan (Text-to-Speech)** untuk kamus dan kuis bahasa asing.
2. **Gamifikasi Daily Streak** dan lencana pencapaian belajar.
3. **Ekstensi Browser Chrome** PahamTeks untuk terjemahan instan di web apa saja.
4. **Mode PWA** agar web bisa diinstall di home screen smartphone pengguna.
5. **Duel Kuis Antar-Pemelajar** secara realtime (*multiplayer battle*).

---

## 🤝 Aturan Kontribusi Tim
* Selalu pastikan build frontend berhasil sebelum melakukan commit:
  ```bash
  npm --prefix client run build
  ```
* **Dilarang keras menyertakan berkas `.env` atau database SQLite lokal ke Git**.
* Gunakan pesan commit yang deskriptif dan jelas.
