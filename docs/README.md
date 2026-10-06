# Catatan & Dokumentasi Tim PahamTeks

Halo tim, ini adalah pusat dokumentasi untuk proyek **PahamTeks**. Dokumen-dokumen di sini saya siapkan agar teman-teman di tim bisa langsung paham apa yang sudah kita bangun, bagaimana sistemnya bekerja di balik layar, dan apa saja ide-ide yang ingin kita diskusikan bareng di sprint berikutnya.

Silakan baca dokumen sesuai topik yang sedang kamu kerjakan:

---

## 🧭 Panduan Membaca Dokumen

| Berkas | Isinya Tentang Apa? | Kapan Harus Dibaca? |
| :--- | :--- | :--- |
| 📄 [`PRD.md`](./PRD.md) | Visi produk, kenapa kita buat fitur kuis/kamus begini, profil pemelajar, dan ide yang masih perlu kita obrolkan. | Saat butuh gambaran arah produk atau sebelum mulai bikin fitur baru. |
| 🏗️ [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Blueprint teknis: React, GraphQL, Gemini, Vercel, TiDB Cloud, dan SQLite lokal untuk development. | Saat modifikasi backend, skema GraphQL, atau database. |
| 🤖 [`AGENT.md`](./AGENT.md) | Persona karakter maskot Teksie, cara prompt AI merespon pemelajar, dan aturan otomatisasi development. | Saat ngurus AI prompt, copy percakapan, atau nambah respon maskot. |
| 📋 [`TODO.md`](./TODO.md) | Catatan pekerjaan: yang udah selesai, prioritas sprint minggu ini, dan tumpukan ide liar tim. | Saat meeting sprint planning, evaluasi progress, atau cari tugas berikutnya. |
| 🧠 [`SKILL.md`](./SKILL.md) | Pemetaan materi yang diajarkan (bahasa pemrograman & bahasa asing) plus standar keamanan yang kita terapkan. | Saat kurasi materi kuis, kamus, atau validasi standar security sistem. |
| ⚙️ [`WORKFLOW.md`](./WORKFLOW.md) | Alur kerja harian: setup lokal, aturan branching Git, backup data, dan langkah darurat saat server error. | Wajib dibaca pas onboarding pertama kali dan sebelum push ke repo. |
| 🛡️ [`AI_SLOP.md`](./AI_SLOP.md) | Standar kebersihan kode agar tidak ada kode sampah AI, cara cek lokal, dan aturan CI GitHub Actions. | Wajib dicek saat nulis kode pakai AI assistant (Cursor, Antigravity, dll). |
| 🤖 [`AGENT_ADAPTATION.md`](./AGENT_ADAPTATION.md) | Panduan adaptasi otomatis untuk AI Agent rekan tim/teman saat membuka folder PahamTeks. | Wajib dibaca oleh asisten AI baru agar langsung paham arsitektur sistem. |
| 🌐 [`PANDUAN_AKSES_HTTPS_PRIBADI.md`](./PANDUAN_AKSES_HTTPS_PRIBADI.md) | Deployment utama Vercel, koneksi TiDB Cloud, UptimeRobot, serta tunnel lokal opsional. | Saat menyiapkan hosting, database, pemantauan, atau demo. |
| 💻 [`PANDUAN_FRONTEND.md`](./PANDUAN_FRONTEND.md) | Panduan lengkap frontend: analogi ruang makan, 7 pilar penyusun, pohon komponen, 19 file UI, sistem audio, token auth, dan styling pure CSS. | Saat membuat/memodifikasi komponen antarmuka pengguna di React atau mengatur tampilan. |
| ⚙️ [`PANDUAN_BACKEND.md`](./PANDUAN_BACKEND.md) | Panduan backend: GraphQL, TiDB Cloud untuk produksi, SQLite lokal, Gemini, autentikasi, dan keamanan. | Saat membuat resolver, skema database, integrasi AI, atau konfigurasi server. |
| 🔄 [`PANDUAN_FULLSTACK.md`](./PANDUAN_FULLSTACK.md) | Panduan lengkap fullstack: analogi manajer restoran, 6 jembatan penghubung, siklus hidup request 8 tahap, tutorial end-to-end, & kamus troubleshooting. | Saat menghubungkan fitur baru dari UI hingga ke database/AI atau mengatasi error integrasi. |
| 📚 Materi dari folder dokumen | Rancangan fitur agar siswa, mahasiswa, guru, atau dosen dapat mengunggah kumpulan dokumen sebagai sumber belajar AI. | Saat merancang kurasi materi, alur upload, keamanan berkas, retrieval, dan evaluasi jawaban. Statusnya masih rencana, belum tersedia di aplikasi. |


---

## 💻 Panduan Menjalankan di Laptop Developer

### 1. Kebutuhan Dasar
* Node.js v18 atau yang lebih baru (disarankan v20 LTS).
* Git.
* Untuk deployment Vercel: akun TiDB Cloud dan database persisten. Saat development lokal, backend dapat memakai SQLite sebagai fallback.

### 2. Langkah Setup Cepat
```bash
# 1. Clone repo
git clone https://github.com/slmalhadar-lab/pahamteks.git
cd pahamteks

# 2. Salin template environment backend
cp server/.env.example server/.env

# 3. Masukkan Gemini API Key kamu di server/.env:
# GEMINI_API_KEY=AIzaSy...

# 4. Install semua dependencies
npm --prefix server install
npm --prefix client install

# 5. Jalankan backend (Terminal 1)
npm --prefix server run dev
# GraphQL: http://127.0.0.1:4000/graphql | health publik: /healthz

# 6. Jalankan frontend (Terminal 2)
npm --prefix client run dev
# Aktif di: http://127.0.0.1:3000
```

---

## 💡 Ringkasan: Yang Sudah Jadi vs Ide Diskusi

### Fitur aplikasi yang sudah tersedia:
* **Frontend**: Antarmuka React 18 responsif, navigasi tab terpusat, balon Kamus Pintar mengambang, modal notifikasi tengah layar, dan maskot interaktif Teksie yang reaktif (tidur saat idle, respon saat disentuh).
* **Backend & AI**: Apollo Server GraphQL, rotasi multi-kunci Gemini API (*Round-Robin*) agar kuota tidak jebol, kuis adaptif Unit 1–5, kamus instan, dan transkripsi audio.
* **Keamanan & Kehandalan**: Proteksi *Brute Force*, *Rate Limiting*, proteksi *Email Bombing*, MySQL/TiDB persisten di hosting, dan SQLite fallback lokal untuk development.

### Hosting dan operasional

Vercel menjadi platform hosting aplikasi. TiDB Cloud menjadi database MySQL-compatible persisten; integrasi Vercel menyediakan variabel `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD`, dan `TIDB_DATABASE`, yang didukung langsung backend. UptimeRobot dipakai untuk memantau `https://<domain-produksi>/healthz`; endpoint `/health` berisi telemetri sensitif dan hanya untuk admin. Status deployment dan monitor perlu diperiksa di dashboard masing-masing, bukan diasumsikan dari dokumen.

### Rencana fitur materi dari folder dokumen

Fitur ini masih tahap perencanaan. Pengajar atau pemelajar nantinya dapat mengunggah dokumen yang mereka miliki, lalu AI memakai isi dokumen tersebut sebagai sumber untuk membuat penjelasan atau latihan bahasa. Sistem harus membatasi jenis/ukuran file, memisahkan materi antar akun, memberi rujukan halaman/bagian, dan tidak menganggap instruksi yang tertulis dalam dokumen sebagai instruksi sistem AI. Lihat PRD, ROADMAP, dan panduan backend/fullstack untuk rancangan.

### Ide Pengembangan Lanjutan (Cek detailnya di [`TODO.md`](./TODO.md)):
1. **Audio Pengucapan Asli** untuk kosakata bahasa asing dan penjelasan kuis.
2. **Gamifikasi Streak Belajar & EXP**: Menjaga motivasi belajar setiap hari.
3. **PWA (Progressive Web App)**: Supaya PahamTeks bisa di-install langsung di layar HP pengguna tanpa repot masuk app store.
4. **Ekstensi Browser Chrome**: Memungkinkan pemelajar klik kanan teks di situs mana pun untuk dijelaskan maknanya oleh PahamTeks.

---

## 🤝 Aturan Sederhana Sebelum Push
1. **Tes build frontend dulu**: `npm --prefix client run build`. Jangan push kalau build masih error.
2. **Zero Leak**: Jangan pernah push file `.env` atau kredensial apa pun.
3. **Commit jelas**: Tulis pesan commit yang menjelaskan apa yang kamu ubah dalam bahasa Indonesia atau Inggris yang wajar.
