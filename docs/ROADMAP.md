# Roadmap Pengembangan Tim PahamTeks

Halo tim! Dokumen ini adalah peta jalan (*roadmap*) resmi proyek **PahamTeks**. Peta jalan ini dibuat agar setiap orang di tim—baik yang memegang frontend, backend, desain antarmuka, maupun kurasi materi edukasi—memiliki panduan yang jelas mengenai apa yang sudah selesai dibangun, apa prioritas sprint kita saat ini, dan fitur apa saja yang akan kita kerjakan di fase berikutnya.

---

## 🎯 Visi Besar PahamTeks
Menjadi platform pembelajaran dwidomain (Bahasa Dunia & Logika Pemrograman) yang interaktif, tidak membosankan, hemat kuota/biaya, dan dapat diakses dengan mudah oleh siapa saja tanpa hambatan teknis.

---

## 🧭 Tahapan Roadmap Pengembangan

```
┌────────────────────────────────────────────────────────┐
│ Fase 1: Fondasi Inti & Arsitektur Sistem (Selesai)     │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ Fase 2: Optimasi Kecepatan & Pengalaman Belajar (Aktif) │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ Fase 3: Interaktivitas Suara & Gamifikasi (Berikutnya) │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│ Fase 4: Skalabilitas Komunitas & Multi-Platform (Masa Depan) │
└────────────────────────────────────────────────────────┘
```

---

### ✅ Fase 1: Fondasi Inti & Ketahanan Sistem (Status: Selesai)
Fase ini berfokus pada fondasi teknis aplikasi untuk development lokal dan hosting Vercel.

* **Arsitektur Full-Stack Modern**: Frontend React 18 dengan Vite 6, Backend Node.js ESM dengan Express dan Apollo Server v4 (GraphQL).
* **Database sesuai lingkungan**: TiDB Cloud yang kompatibel MySQL untuk penyimpanan persisten produksi; SQLite fallback hanya untuk development lokal. SQLite bukan cadangan produksi Vercel.
* **Integrasi Multi-Key AI Gemini**: Sistem rotasi kunci (Round-Robin 1 s/d 9) agar kuota API gratis tidak cepat habis saat pengujian intensif.
* **Fitur Edukasi Utama**:
  - Kuis Berjenjang (Bab 1 sampai Bab 5) untuk bahasa dunia dan logika coding.
  - Glosarium Multibahasa A–Z dengan ratusan kosakata terkurasi.
  - Kamus Pintar Generatif berbasis AI.
  - Maskot Teksie dengan sintesis suara (Web Speech API).
* **Akses Publik Mandiri**: Dukungan Cloudflare Tunnel lokal (`cloudflared.exe`) agar web bisa didemokan langsung dari laptop ke handphone tanpa perlu hosting berbayar.

* **Hosting dan pemantauan**: Vercel menjadi platform hosting; UptimeRobot digunakan untuk memantau endpoint publik `/healthz`. Status pemasangan monitor dan penerima alert tetap perlu diverifikasi di dashboard layanan.

---

### 🚀 Fase 2: Optimasi Performa & UX Belajar (Status: Sedang Berjalan / Sprint Ini)
Fase ini berfokus pada kecepatan respon aplikasi, penghapusan hambatan (*friction*), dan pembersihan kode dari pola-pola kaku (*AI slop*).

* **In-Memory Caching Cerdas**:
  - Cache memori untuk pencarian Kamus Pintar (`dictionaryCache`). Kata yang pernah dicari langsung tampil dalam waktu **< 1 ms** tanpa menunggu server AI.
  - Pre-warming definisi istilah populer (seperti `syntax`, `algorithm`, dll.) saat server pertama kali menyala.
  - Cache soal kuis per level dan kategori (`quizCache`) agar sesi belajar tidak boros kuota AI.
* **Prioritas Model AI Ringan & Cepat**:
  - Menggunakan `gemini-3.8-flash` sebagai prioritas pertama, dengan `gemini-3.7-flash` dan `gemini-flash-latest` sebagai model cadangan. Model utama dapat diubah melalui `GEMINI_MODEL`.
* **Penghapusan Native Alert & Peningkatan Aksesibilitas**:
  - Mengganti semua `alert()` bawaan browser dengan pesan status dan modal yang menyatu dengan tema antarmuka.
  - Standarisasi penanganan error tanpa *swallowed catches*.
* **Dokumentasi untuk Tim**:
  - Panduan khusus Frontend (`PANDUAN_FRONTEND.md`).
  - Panduan khusus Backend (`PANDUAN_BACKEND.md`).
  - Panduan akses demo pribadi (`PANDUAN_AKSES_HTTPS_PRIBADI.md`).

---

### 🌟 Fase 3: Interaktivitas Suara & Gamifikasi (Status: Rencana Sprint Berikutnya)
Fase ini berfokus pada membuat pengalaman pemelajar lebih hidup, adiktif (dalam arti positif), dan membantu melatih kemampuan berbicara aktif.

* **Pengenalan Suara & Pengecekan Pelafalan (Voice AI Pronunciation)**:
  - Pemelajar dapat menekan tombol mikrofon dan mengucapkan kata/kalimat asing.
  - Gemini Multimodal akan mentranskripsi dan memberikan umpan balik akurasi pelafalan serta saran perbaikan bibir/lidah secara ramah.
* **Fitur "Tanya Kenapa Salah" yang Lebih Kontekstual**:
  - Ketika pemelajar salah memilih jawaban kuis, Teksie memberikan analogi sederhana mengapa opsi tersebut keliru dan bagaimana cara mengingat konsep yang benar.
* **Sistem Gamifikasi & Progresif Belajar**:
  - **XP (Experience Points) & Level**: Pemelajar mendapatkan XP setiap kali menyelesaikan bab atau tantangan harian.
  - **Streak Harian**: Penanda konsistensi belajar harian (seperti fitur api Duolingo).
  - **Badges Pencapaian**: Lencana digital untuk pencapaian khusus (misal: "Sintaksis Master", "Polyglot Pemula", "10 Hari Beruntun").
* **Ekspansi Materi Pembelajaran Baru**:
  - Bahasa Asing: Menambah kosakata percakapan praktis untuk Bahasa Jerman, Arab, dan Mandarin.
  - Pemrograman: Menambah materi modern seperti TypeScript lanjut, Docker dasar, dan Git collaboration.

* **Materi belajar dari folder dokumen (rencana)**:
  - Siswa, mahasiswa, pemelajar, guru, atau dosen memilih kumpulan dokumen sebagai sumber belajar.
  - MVP mempertimbangkan PDF berbasis teks, DOCX, dan TXT dengan validasi file, batas ukuran, status pemrosesan, dan penghapusan.
  - AI mengambil potongan dokumen yang relevan untuk membuat rangkuman, kosakata, penjelasan, atau latihan; jawaban menyebut dokumen dan halaman/bagian jika tersedia, serta mengakui bila sumber tidak cukup.
  - File disimpan di object storage persisten, bukan filesystem fungsi Vercel. Metadata, pemilik, dan status dapat disimpan di TiDB. Pilihan object storage dan indeks retrieval belum diputuskan.
  - Wajib ada pemisahan akses per pengguna/kelas, pemeriksaan keamanan, kebijakan retensi/penghapusan, dan pertahanan terhadap instruksi berbahaya di dalam dokumen.

---

### 🌐 Fase 4: Kolaborasi & Skalabilitas Komunitas (Status: Rencana Jangka Panjang)
Fase ini dirancang untuk membawa PahamTeks ke ranah publik yang lebih luas dan mendukung interaksi antarpemelajar.

* **Mode Duel Kuis Real-Time (WebSockets / GraphQL Subscriptions)**:
  - Dua pemelajar bisa saling bertanding menjawab soal kuis cepat dalam waktu 60 detik.
* **Leaderboard Global & Kelas**:
  - Papan peringkat mingguan berdasarkan perolehan XP.
  - Fitur "Grup Belajar" untuk komunitas sekolah atau perkantoran.
* **Progressive Web App (PWA) & Mode Offline Penuh**:
  - Aplikasi bisa diinstall langsung ke layar utama Android/iOS tanpa lewat Play Store.
  - Soal kuis yang sudah tersimpan di cache SQLite/IndexedDB bisa dikerjakan meski ponsel dalam mode pesawat.
* **Kontribusi Materi Komunitas (Crowdsourced Flashcards)**:
  - Guru atau pengembang senior dapat mengajukan paket soal atau glosarium baru dengan sistem moderasi internal.

---

## 👥 Pembagian Tugas & Fokus Anggota Tim

| Peran | Area Fokus Utama | Tanggung Jawab Harian |
| :--- | :--- | :--- |
| **Frontend Engineer** | `client/src/` | Menata komponen React, memperhalus animasi CSS di `index.css`, merawat responsivitas di HP/tablet, dan menghubungkan hooks Apollo Client. |
| **Backend Engineer** | `server/src/` | Mengelola skema GraphQL, mengoptimalkan query database (MySQL & SQLite), mengatur rotasi API Key AI, dan memastikan latensi server tetap rendah. |
| **UI/UX & Desain Karakter** | Aset visual & maskot | Merancang ekspresi Teksie, memastikan kontras warna ramah mata, dan merancang micro-interaction yang menyenangkan. |
| **Kurator Materi Edukasi** | `AZ_DICTIONARY_DATA` & Soal | Menyaring istilah yang relevan di dunia industri saat ini, memastikan akurasi tata bahasa, dan membuat contoh kalimat yang hidup. |

Untuk fitur materi dokumen, tetapkan pemilik backend (upload, ekstraksi, retrieval, akses), frontend (pemilihan file, status, rujukan), kurator/pengajar (validasi materi), dan QA (format, privasi, batas, serta isolasi akses). Jangan masukkan ke sprint sebelum pemilik, kriteria selesai, dan keputusan storage/retensi disepakati.

---

## 📌 Catatan Penutup untuk Tim
Roadmap ini bersifat fleksibel (*living document*). Setiap kali kita menyelesaikan satu target sprint atau memiliki ide inovatif baru dari hasil uji coba pengguna, kita akan mendiskusikannya bersama dan memperbarui dokumen ini.
