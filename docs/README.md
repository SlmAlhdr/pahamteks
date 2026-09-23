# Catatan & Dokumentasi Tim PahamTeks

Halo tim, ini adalah pusat dokumentasi untuk proyek **PahamTeks**. Dokumen-dokumen di sini saya siapkan agar teman-teman di tim bisa langsung paham apa yang sudah kita bangun, bagaimana sistemnya bekerja di balik layar, dan apa saja ide-ide yang ingin kita diskusikan bareng di sprint berikutnya.

Silakan baca dokumen sesuai topik yang sedang kamu kerjakan:

---

## 🧭 Panduan Membaca Dokumen

| Berkas | Isinya Tentang Apa? | Kapan Harus Dibaca? |
| :--- | :--- | :--- |
| 📄 [`PRD.md`](./PRD.md) | Visi produk, kenapa kita buat fitur kuis/kamus begini, profil pemelajar, dan ide yang masih perlu kita obrolkan. | Saat butuh gambaran arah produk atau sebelum mulai bikin fitur baru. |
| 🏗️ [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Blueprint teknis: alur data React, GraphQL Apollo, integrasi Gemini, dan kenapa kita pakai dua database (MySQL & SQLite). | Saat modifikasi backend, nambah skema GraphQL, atau utak-atik database. |
| 🤖 [`AGENT.md`](./AGENT.md) | Persona karakter maskot Teksie, cara prompt AI merespon pemelajar, dan aturan otomatisasi development. | Saat ngurus AI prompt, copy percakapan, atau nambah respon maskot. |
| 📋 [`TODO.md`](./TODO.md) | Catatan pekerjaan: yang udah selesai, prioritas sprint minggu ini, dan tumpukan ide liar tim. | Saat meeting sprint planning, evaluasi progress, atau cari tugas berikutnya. |
| 🧠 [`SKILL.md`](./SKILL.md) | Pemetaan materi yang diajarkan (bahasa pemrograman & bahasa asing) plus standar keamanan yang kita terapkan. | Saat kurasi materi kuis, kamus, atau validasi standar security sistem. |
| ⚙️ [`WORKFLOW.md`](./WORKFLOW.md) | Alur kerja harian: setup lokal, aturan branching Git, backup data, dan langkah darurat saat server error. | Wajib dibaca pas onboarding pertama kali dan sebelum push ke repo. |
| 🛡️ [`AI_SLOP.md`](./AI_SLOP.md) | Standar kebersihan kode agar tidak ada kode sampah AI, cara cek lokal, dan aturan CI GitHub Actions. | Wajib dicek saat nulis kode pakai AI assistant (Cursor, Antigravity, dll). |

---

## 💻 Panduan Menjalankan di Laptop Developer

### 1. Kebutuhan Dasar
* Node.js v18 atau yang lebih baru (disarankan v20 LTS).
* Git.
* (Opsional) MySQL lokal seperti XAMPP / MariaDB. Kalau malas install MySQL, tenang saja: backend kita otomatis pakai SQLite cadangan tanpa setup apa pun!

### 2. Langkah Setup Cepat
```bash
# 1. Clone repo
git clone https://github.com/slmalhadar-lab/pahamteks.git
cd pahamteks

# 2. Salin env example
cp .env.example server/.env

# 3. Masukkan Gemini API Key kamu di server/.env:
# GEMINI_API_KEY=AIzaSy...

# 4. Install semua dependencies
npm --prefix server install
npm --prefix client install

# 5. Jalankan backend (Terminal 1)
npm --prefix server run dev
# Aktif di: http://localhost:4000/graphql dan http://localhost:4000/health

# 6. Jalankan frontend (Terminal 2)
npm --prefix client run dev
# Aktif di: http://localhost:5173
```

---

## 💡 Ringkasan: Yang Sudah Jadi vs Ide Diskusi

### Sudah Siap & Aktif di Produksi:
* **Frontend**: Antarmuka React 18 responsif, navigasi tab terpusat, balon Kamus Pintar mengambang, modal notifikasi tengah layar, dan maskot interaktif Teksie yang reaktif (tidur saat idle, respon saat disentuh).
* **Backend & AI**: Apollo Server GraphQL, rotasi multi-kunci Gemini API (*Round-Robin*) agar kuota tidak jebol, kuis adaptif Unit 1–5, kamus instan, dan transkripsi audio.
* **Keamanan & Kehandalan**: Proteksi *Brute Force*, *Rate Limiting*, proteksi *Email Bombing*, dan failover ganda otomatis (MySQL ke SQLite).

### Ide Diskusi Lanjutan (Cek detailnya di [`TODO.md`](./TODO.md)):
1. **Audio Pengucapan Asli** untuk kosakata bahasa asing dan penjelasan kuis.
2. **Gamifikasi Streak Belajar & EXP**: Menjaga motivasi belajar setiap hari.
3. **PWA (Progressive Web App)**: Supaya PahamTeks bisa di-install langsung di layar HP pengguna tanpa repot masuk app store.
4. **Ekstensi Browser Chrome**: Memungkinkan pemelajar klik kanan teks di situs mana pun untuk dijelaskan maknanya oleh PahamTeks.

---

## 🤝 Aturan Sederhana Sebelum Push
1. **Tes build frontend dulu**: `npm --prefix client run build`. Jangan push kalau build masih error.
2. **Zero Leak**: Jangan pernah push file `.env` atau kredensial apa pun.
3. **Commit jelas**: Tulis pesan commit yang menjelaskan apa yang kamu ubah dalam bahasa Indonesia atau Inggris yang wajar.
