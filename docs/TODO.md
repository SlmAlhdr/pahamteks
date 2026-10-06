# Catatan Kerja & Rencana Fitur (TODO.md)

Dokumen ini adalah papan catatan bersama untuk memantau apa yang sudah beres, apa yang sedang kita kejar sekarang, dan tumpukan ide-ide seru yang siap kita diskusikan bersama tim.

---

## 1. ✅ Kapabilitas Aplikasi yang Sudah Tersedia

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
- [x] SQLite fallback lokal untuk development; produksi memakai database cloud persisten kompatibel MySQL (TiDB Cloud). SQLite bukan failover produksi.
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

## 2. 🗣️ Usulan Bahan Diskusi Sprint Berikutnya

Daftar di bawah adalah usulan untuk diprioritaskan bersama, belum menjadi komitmen sprint sampai tim menyepakati pemilik dan ruang lingkupnya. Selaraskan pilihan akhir dengan bagian “Bahan Diskusi Tim” di [`ROADMAP.md`](./ROADMAP.md).

1. **Fondasi QA dan regresi alur utama**:
   - Buat checklist untuk mode tamu, login/OTP, kuis dan penyimpanan skor, kamus, penerjemah, serta tampilan mobile.
   - Catat langkah reproduksi, dampak, pemilik perbaikan, dan status setiap bug.
   - Tambahkan tes otomatis bertahap untuk logika kuis, API penting, dan alur pengguna yang paling sering dipakai.
2. **Pemantauan dan kesiapan pemulihan**:
   - Pastikan monitor UptimeRobot memakai `https://<domain-produksi>/healthz` (endpoint publik HTTP 200), bukan `/health` yang dilindungi admin.
   - Tetapkan penerima alert dan uji notifikasi.
   - Dokumentasikan backup serta uji pemulihan data secara berkala.
   - Catat langkah rollback dan respons ketika layanan atau penyedia AI bermasalah.
3. **Validasi mutu materi**:
   - Tetapkan capaian belajar dan tingkat kesulitan untuk unit yang aktif.
   - Buat sampel soal dan jawaban acuan untuk meninjau akurasi soal serta penjelasan AI.
   - Tunjuk peninjau materi dan sepakati proses koreksi sebelum konten dirilis.
4. **Masukan pengguna dan indikator sederhana**:
   - Kumpulkan umpan balik pemelajar tentang bagian yang membingungkan atau gagal.
   - Tentukan indikator awal, seperti penyelesaian kuis, error request, dan keberhasilan penyimpanan skor.
5. **Pilih fitur belajar setelah fondasi disepakati**:
   - Bahas EXP/streak dan penyempurnaan dashboard riwayat.
   - Pilih satu fokus terlebih dahulu berdasarkan kebutuhan pengguna dan kesiapan data.
6. **Rancang MVP materi dari folder dokumen**:
   - Sepakati format/batas upload, object storage, retensi dan penghapusan, serta materi personal vs kelas.
   - Siapkan dokumen uji dan rubrik untuk menilai rujukan, ketepatan, jawaban saat sumber kurang, dan isolasi antar pengguna.
   - Fitur belum diimplementasikan; jangan tandai selesai sebelum kode, pengujian, dan kebijakan privasi tersedia.

### Keputusan yang Dicari dalam Rapat

- Maksimal dua prioritas sprint, masing-masing dengan satu pemilik dan kriteria selesai.
- Kesediaan Repan mencoba QA atau peninjauan materi selama satu sprint.
- Pemilik bergilir untuk pemantauan, backup, dan prosedur rilis.
- Kesepakatan alur Git tim, terutama penggunaan auto-sync yang dapat commit/push langsung ke `main` setelah jeda tanpa edit.

## 3. ⏳ Prioritas Sprint (Perlu Dikonfirmasi Bersama)

Daftar ini adalah prioritas yang sudah tercatat sebelumnya. Urutan dan statusnya perlu dikonfirmasi bersama usulan QA, pemulihan, dan validasi materi di bagian atas; jangan anggap semua item otomatis masuk sprint berikutnya.

1. **Verifikasi integrasi Vercel + TiDB Cloud**:
   - Pastikan variabel `TIDB_*` tersedia untuk Production dan aplikasi berhasil menyimpan akun serta progres ke database persisten.
   - Uji kembali alur registrasi/login setelah redeploy.
2. **UptimeRobot**:
   - Pastikan monitor `/healthz`, kontak notifikasi, interval pemeriksaan, dan uji alert sudah disiapkan tim.
3. **Sistem Gamifikasi: Streak Belajar & EXP**:
   - Menghitung hari belajar berturut-turut dengan ikon api (🔥) agar pemelajar terpacu buka web setiap hari.
   - Reward EXP setiap kali menyelesaikan 1 kuis unit.
4. **Penyempurnaan Dasbor Riwayat**:
   - Menampilkan grafik akurasi belajar mingguan pemelajar.
   - Rekomendasi materi belajar berikutnya berdasarkan topik kuis yang paling sering dijawab keliru.

---

## 4. 💡 Tumpukan Ide Liar (Backlog Tim)

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
- [ ] **Ruang Materi dari Folder Dokumen**:
  Pengguna memilih dokumen yang berhak mereka gunakan; PahamTeks mengekstrak dan mengindeks isi, lalu AI membantu belajar dengan rujukan sumber. Status: rancangan/backlog, belum menjadi fitur aplikasi.
