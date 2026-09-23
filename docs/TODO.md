# Daftar Rencana & Roadmap Proyek (TODO.md)

Dokumen ini melacak status pengerjaan fitur yang telah selesai, sedang berjalan, serta daftar ide-ide inovatif untuk didiskusikan bersama tim.

---

## 1. ✅ Telah Selesai (Completed Milestones)

### Frontend & Antarmuka Pengguna
- [x] Migrasi antarmuka ke **React 18.3** dengan bundler Vite modern.
- [x] Sistem navigasi utama terpusat (*Centered Navigation Bar*).
- [x] Integrasi teks berjalan dinamis pada latar belakang beranda (*Background Drift*).
- [x] Tampilan Beranda Interaktif (*WelcomePortal* & *HomeHero*).
- [x] Modul Pembelajaran Terpadu (*LearningHub*): Kuis Bahasa Dunia & Kuis Bahasa Pemrograman.
- [x] Kamus & Penerjemah Multibahasa (*CombinedDictTranslator*).
- [x] Tombol mengambang Kamus Pintar (*Floating Kamus Bubble*) dengan efek semi-transparan elegan tanpa garis neon.
- [x] Modal notifikasi tengah layar ([`CenterNotificationModal.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/CenterNotificationModal.jsx)) menggantikan pop-up bawaan browser.
- [x] Maskot 2D PahamTeks interaktif ([`TeksieMascotCompanion.jsx`](file:///c:/Salim/Kerjaan/pahamteks/client/src/components/TeksieMascotCompanion.jsx)).
- [x] Integrasi pustaka pendukung `jquery` (^4.0.0) di client.

### Backend, API, & AI
- [x] Server GraphQL modern menggunakan **Apollo Server v4** dan **Express.js**.
- [x] Integrasi Google Gemini API dengan sistem rotasi multi-kunci (*Round-Robin Key Pool*).
- [x] Generator kuis bertingkat anti-repetisi (Unit 1 s/d 5) dengan *random seed*.
- [x] Penjelas jawaban kuis yang humanis (*Human-like mentor prompt*).
- [x] Transkripsi audio suara menggunakan AI Gemini.

### Basis Data & Ketahanan (Database & Resilience)
- [x] Koneksi basis data relasional **MySQL** via driver `mysql2/promise` dengan *connection pool*.
- [x] Skrip inisialisasi skema tabel otomatis ([`server/src/db/initDb.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/db/initDb.js)).
- [x] **Database Cadangan SQL (SQLite)** via `node:sqlite` dengan replikasi otomatis dan *auto-failover* jika MySQL offline.
- [x] Skrip pencadangan snapshot data mandiri ([`server/src/db/exportSqlBackup.js`](file:///c:/Salim/Kerjaan/pahamteks/server/src/db/exportSqlBackup.js) / `npm --prefix server run backup-db`).

### Keamanan (Security)
- [x] Pengamanan header peramban dengan **Helmet**.
- [x] Pembatas laju request (*Rate Limiting*) via `express-rate-limit`.
- [x] Proteksi serangan *Brute Force* login (kunci akun 15 menit jika 5x gagal).
- [x] Pembatas frekuensi OTP (*Anti-Email Bombing* maksimal 3x per 10 menit).
- [x] Token sesi terenkripsi bertanda tangan resmi (**JWT** 7 hari).
- [x] Pengetatan domain asal dengan *CORS Whitelist*.
- [x] Perlindungan ketat file `.env` pada `.gitignore` (Zero Leak Policy).

---

## 2. ⏳ Prioritas Berikutnya (Next Sprint Discussion)

Fitur-fitur prioritas tinggi yang disiapkan untuk didiskusikan dan diimplementasikan berikutnya:

- [ ] **Mendaftarkan Endpoint `/health` ke External Uptime Monitor**:
  * Menghubungkan URL produksi ke layanan gratis **UptimeRobot** atau **BetterStack** agar tim mendapat notifikasi otomatis via Telegram/Email saat server mengalami kendala.
- [ ] **Audio Text-to-Speech (Pelafalan Suara)**:
  * Menambahkan tombol dengarkan pelafalan (*audio pronunciation*) pada entri Kamus Pintar dan soal kuis bahasa asing menggunakan Web Speech API atau Gemini TTS.
- [ ] **Sistem Gamifikasi & Daily Streak**:
  * Menghitung hari belajar berturut-turut (*Streak*) seperti ikon api.
  * Hadiah XP atau poin setiap kali menyelesaikan 1 unit kuis.
- [ ] **Penyempurnaan Dasbor Pelacakan Progres**:
  * Grafik visual interaktif perkembangan skor mingguan/bulanan.
  * Rekomendasi materi belajar berikutnya berdasarkan topik yang paling sering salah dijawab.

---

## 3. 💡 Ide & Inovasi Jangka Panjang (Backlog / Brainstorming Tim)

Ide-ide potensial untuk ekspansi produk:

- [ ] **Mode PWA (Progressive Web App)**:
  * Menjadikan web PahamTeks dapat di-*install* langsung ke layar utama smartphone Android/iOS dengan dukungan ikon mandiri dan *offline shell*.
- [ ] **Ekstensi Peramban (PahamTeks Chrome Extension)**:
  * Memungkinkan pengguna menyorot teks asing di situs web mana pun untuk memunculkan terjemahan atau penjelasan istilah coding langsung dari PahamTeks.
- [ ] **Arena Duel Kuis Antar-Pemelajar (Multiplayer Quiz Battle)**:
  * Dua pemelajar bisa bertanding menjawab soal kuis secara *realtime* (via WebSocket).
- [ ] **Kustomisasi Kostum & Ruang Maskot Teksie**:
  * Poin belajar yang dikumpulkan pengguna dapat ditukar untuk mendandani Teksie dengan aksesoris lucu (kacamata koding, topi wisuda, dll).
- [ ] **Fitur Ekspor Sertifikat Pembelajaran**:
  * Pemelajar yang menyelesaikan seluruh Unit 1–5 pada kategori tertentu dapat mengunduh sertifikat digital kelulusan materi dalam format PDF.

