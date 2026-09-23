# Product Requirement Document (PRD) — PahamTeks

**Versi Dokumen**: 1.0  
**Status**: Aktif & Siap Didiskusikan Bersama Tim  
**Terakhir Diperbarui**: September 2026  
**Platform**: Web Application (Desktop & Mobile Responsive)  
**URL Produksi**: `https://pahamteks.vercel.app`

---

## 1. Latar Belakang & Visi Produk

### 1.1 Latar Belakang
Di era globalisasi dan transformasi digital, pemelajar di Indonesia sering kali harus mempelajari dua rumpun bahasa sekaligus: **bahasa manusia (bahasa asing/dunia)** untuk komunikasi global, dan **bahasa komputer (bahasa pemrograman)** untuk pengembangan karier teknologi. 

Saat ini, platform pembelajaran terpecah-pecah:
* Aplikasi belajar bahasa asing (Duolingo, dsb.) hanya fokus pada percakapan sehari-hari.
* Platform coding (LeetCode, HackerRank, w3schools) fokus pada sintaksis teknis tanpa pendekatan pedagogis yang ramah.
* Tidak ada platform yang menjembatani analogi antara tata bahasa manusia (*grammar*, kosakata, konteks) dengan tata bahasa komputer (*syntax*, algoritma, logika alur).

### 1.2 Visi Produk
**PahamTeks** hadir sebagai platform edukasi terpadu pertama yang menggabungkan pembelajaran bahasa asing dan bahasa pemrograman di bawah satu ekosistem interaktif berbasis AI. Pengguna dapat belajar tanpa friksi (tanpa wajib login di awal), menguji pemahaman lewat kuis bertingkat, mencari padanan istilah di Kamus Pintar, dan memantau kemajuan belajarnya secara realtime.

---

## 2. Profil Pengguna (Target Audience)

1. **Siswa & Mahasiswa**:
   * Belajar bahasa asing untuk persiapan studi/ujian (TOEFL, JLPT, dsb.).
   * Belajar dasar-dasar pemrograman (Python, Web, Algoritma) untuk tugas kuliah atau proyek mandiri.
2. **Pemelajar Mandiri & Switch-Career**:
   * Profesional muda yang beralih karier ke bidang teknologi dan membutuhkan fondasi logika pemrograman serta istilah teknis bahasa Inggris.
3. **Pendidik & Mentor**:
   * Memerlukan media latihan kuis yang variatif dan tidak membosankan untuk murid/mentee.

---

## 3. Fitur Utama (Core Features)

### 3.1 Pembelajaran Kuis Interaktif AI (Adaptive Quiz Engine)
* **Dual Kategori**: Kuis Bahasa Asing (50+ bahasa) dan Bahasa Pemrograman (Algoritma, Web, Sistem, OOP, Database).
* **Kurikulum Bertingkat (Unit 1 s/d 5)**:
  * *Unit 1*: Fondasi dasar, kosakata esensial, sintaksis awal.
  * *Unit 2*: Struktur kalimat, tata bahasa inti, perulangan & alur logika.
  * *Unit 3*: Percakapan sehari-hari, situasi nyata, fungsi & pengolahan data.
  * *Unit 4*: Idiom, bahasa gaul, nuansa kontekstual, debugging & studi kasus.
  * *Unit 5*: Penguasaan mahir, pemahaman kompleks, pola desain & optimasi.
* **Anti-Repetisi & Evaluasi Cerdas**: Soal di-generate dinamis oleh AI Gemini dengan *seed* variasi acak. Jika jawaban salah, AI memberikan penjelasan ramah (seperti kakak membimbing adiknya) mengenai letak kekeliruan dan cara mengingatnya.

### 3.2 Kamus Pintar A-Z & Glosarium Terpadu
* Pencarian padanan istilah instan dengan filter abjad A-Z.
* Penjelasan kata terstruktur mencakup:
  1. Definisi & Konsep Utama.
  2. Contoh Penggunaan Nyata (kalimat bahasa atau potongan kode).
  3. Tips Singkat / *Best Practice*.
* **Floating Kamus Widget**: Tombol bubble mengambang di pojok kanan bawah yang memudahkan pencarian arti kata dari halaman mana saja tanpa berpindah menu.

### 3.3 Penerjemah Bahasa & Transkrip Suara
* Menerjemahkan teks antar lebih dari 50 bahasa dunia secara instan.
* Fitur *Voice Transcription* menggunakan AI Gemini untuk mengenali ucapan audio suara dan mengubahnya menjadi teks.

### 3.4 Wawasan Komparasi Bahasa (Language Insights)
* Matriks visual perbandingan karakteristik bahasa:
  * Komparasi bahasa dunia (keluarga bahasa, alfabet, tingkat kesulitan).
  * Komparasi bahasa pemrograman (paradigma, eksekusi, pengetikan statis/dinamis, use-case utama).

### 3.5 Sistem Autentikasi Fleksibel (Guest & Permanent Account)
* **Mode Tamu (Guest)**: Pengguna bisa langsung mencoba semua fitur tanpa harus registrasi. Data sesi disimpan di `sessionStorage`.
* **Akun Permanen Terverifikasi**: Pendaftaran menggunakan email asli dengan verifikasi kode OTP 6 digit asli (via SMTP/Nodemailer).
* **Reset Kata Sandi**: Mekanisme lupa kata sandi dengan OTP verifikasi email.

### 3.6 Tracking Progres & Dasbor Belajar
* Riwayat skor kuis, statistik akurasi, dan aktivitas belajar tersimpan rapi.
* Otomatis membedakan penyimpanan riwayat akun permanen (MySQL/SQLite) dan akun tamu.

### 3.7 Pendamping Maskot Interaktif (Teksie)
* Maskot 2D PahamTeks bernama **Teksie** yang menemani pemelajar di layar, memberikan kata-kata motivasi, tips belajar, dan reaksi ceria.

---

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

1. **Keamanan (Security)**:
   * Proteksi HTTP Headers via `helmet`.
   * Proteksi *Brute Force* login (otomatis blokir 15 menit jika 5x gagal).
   * Pembatas frekuensi request (*Rate Limiting*) via `express-rate-limit`.
   * Pembatas permintaan OTP (*Anti-Email Bombing* maksimal 3x per 10 menit).
   * Token sesi kriptografis bertanda tangan resmi (*JWT Signed Tokens*).
2. **Ketahanan Data (High Availability & Failover)**:
   * Basis data utama MySQL dengan *connection pooling*.
   * **Database Cadangan SQL (SQLite)** dengan *auto-failover* otomatis: jika MySQL down, sistem tetap hidup dan tidak kehilangan data.
3. **Kinerja & Responsivitas (Performance)**:
   * Waktu muat halaman frontend < 2 detik (Vite SPA bundler).
   * Desain mobile-first responsif adaptif untuk semua resolusi layar ponsel pintar hingga monitor desktop.
4. **Privasi Data**:
   * Kredensial rahasia (API key, password database) tidak pernah dipublikasikan ke klien atau repositori publik.

---

## 5. Rencana & Ide Diskusi Lanjutan (Next Discussion Points)

Berikut poin-poin yang dirancang untuk dibahas bersama tim:
* [ ] **Pemberian Gamifikasi Lanjutan**: Penambahan sistem *Daily Streak* (api harian) dan *Achievement Badges* (lencana pencapaian).
* [ ] **Fitur Pelafalan Suara (Text-to-Speech)**: Memutar audio cara pengucapan kata asing yang dicari di kamus.
* [ ] **Toko / Kustomisasi Maskot Teksie**: Pemelajar bisa mengganti kostum atau ekspresi Teksie menggunakan poin belajar.
* [ ] **Ekstensi Browser (PahamTeks Chrome Extension)**: Sorot kata di halaman web mana saja dan dapatkan terjemahan/penjelasan instan dari PahamTeks.
* [ ] **Mode PWA (Progressive Web App)**: Pengguna dapat menginstall PahamTeks ke layar utama HP seperti aplikasi native.

