# Catatan Kerja & Rencana Fitur (TODO.md)

Dokumen ini adalah papan catatan bersama untuk memantau apa yang sudah beres, apa yang sedang kita kejar sekarang, dan tumpukan ide-ide seru yang siap kita diskusikan bersama tim.

---

## 1. ✅ Sudah Beres & Aktif di Produksi

### Antarmuka & Frontend
- [x] Migrasi ke React 18 & Vite bundler (ringan dan build cepat).
- [x] Tampilan beranda terpadu (*WelcomePortal* & *HomeHero*).
- [x] Modul Pembelajaran Terpadu (*LearningHub*): Kuis Bahasa Dunia & Kuis Logika Koding.
- [x] Balon Kamus Pintar Mengambang (*Floating Bubble*) semi-transparan yang ramah di pojok kanan bawah.
- [x] Modal notifikasi tengah layar (*CenterNotificationModal*) yang anggun tanpa pop-up alert browser yang kaku.
- [x] Maskot 2D interaktif: **Teksie** yang reaktif (bisa di-drag, tertidur saat diam, bangun saat disentuh).
- [x] Pelafalan audio instan (*Web Speech API*) untuk kamus, kuis, dan terjemahan.
- [x] Sentralisasi modul utilitas bersama ([`speechUtils.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/utils/speechUtils.js) & [`quizUtils.js`](file:///c:/Salim/Kerjaan/pahamteks/client/src/utils/quizUtils.js)) dan pembersihan kode AI Slop.

### Backend, AI & Database
- [x] Apollo Server GraphQL v4 di atas Express.js.
- [x] Rotasi multi-kunci Gemini API (*Round-Robin*) agar kuota gratis tidak gampang limit.
- [x] Kuis adaptif 5 Bab (Unit 1–5) dengan fitur penjelas "Kenapa Salah?".
- [x] Transkripsi audio mikrofon (*voice-to-text*) dengan AI Gemini.
- [x] Sistem database ganda (*Dual Database Failover*): MySQL utama dengan SQLite otomatis sebagai cadangan jika MySQL offline.
- [x] Skrip ekspor snapshot database manual (`npm --prefix server run backup-db`).

### Keamanan Sistem
- [x] Proteksi header HTTP dengan Helmet.
- [x] Pembatas laju request global (*Rate Limiter* 200 req / 15 menit).
- [x] Blokir brute-force login otomatis jika 5x berturut-turut gagal.
- [x] Pembatas OTP email (*Anti-Email Bombing* maksimal 3x per 10 menit).
- [x] Token sesi JWT 7 hari.
- [x] CORS whitelist ketat.
- [x] Zero Leak Policy: file `.env` dan sqlite lokal tidak pernah tersentuh Git.
- [x] AI Code Quality Gate otomatis via GitHub Actions ([`docs/AI_SLOP.md`](file:///c:/Salim/Kerjaan/pahamteks/docs/AI_SLOP.md)).

---

## 2. ⏳ Prioritas Sprint Saat Ini (Perlu Kita Bahas Bareng)

1. **Daftarkan Endpoint `/health` ke Pemantau Eksternal (UptimeRobot / BetterStack)**:
   - Endpoint `/health` backend kita sudah lengkap dengan data RAM, status database, dan pool key.
   - Kita tinggal mendaftarkan URL produksi ke UptimeRobot (gratis) agar jika server Vercel/Render mati, kita langsung dapat notifikasi Telegram atau email.
2. **Sistem Gamifikasi: Streak Belajar & EXP**:
   - Menghitung hari belajar berturut-turut dengan ikon api (🔥) agar pemelajar terpacu buka web setiap hari.
   - Reward EXP setiap kali menyelesaikan 1 kuis unit.
3. **Penyempurnaan Dasbor Riwayat**:
   - Menampilkan grafik akurasi belajar mingguan pemelajar.
   - Rekomendasi materi belajar berikutnya berdasarkan topik kuis yang paling sering dijawab keliru.

---

## 3. 💡 Tumpukan Ide Liar (Backlog Tim)

Ini ide-ide jangka panjang yang menurut saya sangat menarik jika PahamTeks sudah makin ramai:

- [ ] **Mode PWA (Bisa di-install di HP)**:
  Biar pengguna ponsel bisa "Add to Home Screen" dan aplikasi berjalan seperti aplikasi native tanpa harus ribet unduh di app store.
- [ ] **Ekstensi Chrome PahamTeks**:
  Pemelajar bisa blok teks asing di mana saja (misal saat baca dokumentasi React atau berita bahasa Inggris), klik kanan, dan PahamTeks langsung membedah maknanya.
- [ ] **Arena Duel Kuis Antar-Pemelajar (Multiplayer 1 vs 1)**:
  Dua teman bisa tanding kuis logika atau kuis bahasa secara langsung (*realtime*) lewat WebSocket.
- [ ] **Kustomisasi Maskot Teksie**:
  Poin belajar pemelajar bisa dipakai untuk mendandani Teksie (beri topi koding, kacamata pintar, atau warna bulu baru).
- [ ] **Sertifikat Kelulusan Digital**:
  Pemelajar yang menyelesaikan seluruh Unit 1–5 di satu topik bisa mengunduh sertifikat digital kelulusan PDF untuk portofolio mereka.
