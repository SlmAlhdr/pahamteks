# Catatan Produk & Kebutuhan Fitur (PRD) — PahamTeks

**Penulis/Inisiator**: Salim  
**Status**: Aktif berjalan & dasar diskusi tim  
**Target Produk**: Web App responsif (desktop & smartphone)  
**Hosting**: Vercel untuk deployment web dan fungsi API. TiDB Cloud menjadi database persisten. UptimeRobot digunakan untuk pemantauan ketersediaan.

---

## 1. Kenapa Saya Memulai PahamTeks?

Saya sering melihat teman-teman di Indonesia yang ingin maju punya dua rintangan besar: **bahasa asing** (terutama bahasa Inggris) dan **literasi koding / logika komputer**. Masalahnya, platform yang ada sekarang selalu memisahkan keduanya:
- Mau belajar bahasa Inggris atau Jepang? Pergi ke Duolingo atau aplikasi kartu memori.
- Mau belajar koding? Masuk ke web tutorial bahasa Inggris yang kaku atau situs problem-solving yang mengintimidasi pemula.

Padahal, secara esensial, belajar bahasa pemrograman dan bahasa manusia itu mirip: sama-sama punya **tata bahasa (*grammar vs syntax*)**, **kosakata (*vocabulary vs keywords*)**, dan **alur logika konteks**.

**Visi PahamTeks**: Membuat satu wadah belajar yang asyik, tidak mengintimidasi, dan terpadu. Orang bisa belajar percakapan bahasa dunia sekaligus mengasah logika algoritma, dibantu AI yang sabar menjelaskan layaknya kakak mentor sendiri.

---

## 2. Siapa yang Kita Bantu? (Target Pengguna)

1. **Mahasiswa & Pelajar**:
   - Butuh latihan cepat kosa kata bahasa Inggris/Jepang/Arab untuk persiapan kuliah atau kerja.
   - Butuh pemahaman konsep dasar koding (Python, JavaScript, SQL, Web) tanpa pusing dengan istilah teknis yang rumit.
2. **Pemelajar Mandiri & Pindah Karier (Career Shifter)**:
   - Orang yang ingin masuk ke industri digital tapi minder karena latar belakang non-IT.
3. **Pendidik atau Guru**:
   - Butuh bahan kuis interaktif yang tidak monoton dan langsung memberi tahu murid kenapa jawabannya salah.

---

## 3. Fitur Utama yang Sudah Berjalan

### A. Kuis Adaptif 5 Bab (Unit 1–5)
Kita membagi kurikulum jadi 5 bab bertingkat agar pemelajar punya peta perjalanan yang jelas:
- **Bab 1**: Fondasi dasar dan kosakata penting.
- **Bab 2**: Tata bahasa inti dan logika percabangan/perulangan.
- **Bab 3**: Situasi nyata dan fungsi pengolahan data.
- **Bab 4**: Ungkapan kontekstual, idiom, dan studi kasus debugging.
- **Bab 5**: Penguasaan mahir dan pemecahan masalah kompleks.
- **Fitur "Kenapa Salah?"**: Ini fitur favorit saya. Kalau pemelajar keliru memilih opsi, AI tidak cuma memberi tahu kunci jawaban yang benar, tapi menjelaskan *mengapa* opsi yang dipilih salah dengan bahasa yang bersahabat.

### B. Kamus Pintar & Tombol Mengambang (Floating Bubble)
- Glosarium istilah teknologi dan bahasa dari A sampai Z.
- Ada tombol bubble mengambang di pojok kanan bawah. Tujuannya: saat pemelajar sedang baca materi atau mengerjakan kuis dan menemukan kata asing, mereka bisa langsung klik tombol itu untuk mencari arti tanpa harus meninggalkan halaman.
- Dilengkapi tombol pelafalan suara (Audio Speech) agar tahu cara membacanya.

### C. Penerjemah Teks & Input Suara (Voice-to-Text)
- Menerjemahkan puluhan bahasa dunia.
- Bisa rekam suara lewat mikrofon: AI Gemini mentranskripsikan suara menjadi teks lalu menerjemahkannya.

### D. Wawasan Komparasi (Language Insights)
- Halaman tabel perbandingan yang membedah karakter bahasa manusia (misal: tingkat formalitas, sistem penulisan) dan bahasa pemrograman (misal: pengetikan statis vs dinamis, kecepatan eksekusi).

### E. Akun Fleksibel: Tamu vs Akun Resmi
- **Tidak ada tembok login paksa**: Pemelajar bisa langsung masuk sebagai Tamu (*Guest*) dengan 1 klik. Data tersimpan di sesi browser.
- **Akun Resmi**: Jika ingin progres tersimpan permanen di cloud, pengguna bisa daftar pakai email asli dengan verifikasi OTP 6 digit dan username unik.

### F. Maskot Pendamping: Teksie
- Karakter musang 2D lucu yang selalu ada di layar.
- Bisa digeser (*drag-and-drop*), bisa tertidur kalau pemelajar diam selama beberapa detik, dan bisa diklik untuk memunculkan tips belajar santai.

---

## 4. Standar Kualitas & Keamanan (Non-Negotiable)

1. **Penyimpanan Produksi Harus Persisten**:
   - Akun dan progres produksi disimpan di TiDB Cloud melalui protokol MySQL. SQLite hanya untuk development lokal; Vercel tidak memakai SQLite sementara sebagai penyimpanan cadangan produksi. Jika TiDB tidak tersedia, operasi penyimpanan harus gagal dengan pesan yang dapat dipahami, bukan mengaku berhasil.
2. **Keamanan Login & Email**:
   - Brute-force diblokir otomatis jika salah password 5 kali.
   - Permintaan OTP email dibatasi maksimal 3 kali per 10 menit agar tidak disalahgunakan spammers.
3. **Kecepatan Tampilan**:
   - Single Page App (SPA) berbasis Vite + React 18 yang ringan dibuka dari koneksi internet seluler di Indonesia.

---

## 5. Ide Fitur Baru yang Perlu Kita Diskusikan Bareng

Berikut beberapa ide yang sering muncul di kepala saya dan ingin saya minta pendapat tim:
1. **Streak Belajar Harian & Poin EXP**: Seperti Duolingo, agar pemelajar terpacu kembali setiap hari.
2. **Audio Native Speaker**: Menggunakan audio rekaman asli manusia untuk bahasa-bahasa utama selain sintesis browser.
3. **Ekstensi Chrome PahamTeks**: Pemelajar bisa block teks asing di portal berita atau GitHub, lalu klik kanan untuk dijelaskan oleh PahamTeks.
4. **PWA (Bisa diinstall di HP)**: Agar bisa dibuka seperti aplikasi native tanpa perlu upload ke Play Store terlebih dahulu.
5. **Mode Duel Kuis Realtime**: Dua pengguna bisa tanding kuis logika atau kuis bahasa secara langsung.

## 6. Rencana Fitur: Materi Belajar dari Folder Dokumen

### Tujuan

Siswa, mahasiswa, pemelajar mandiri, guru, dan dosen dapat memilih atau mengunggah satu atau beberapa dokumen sebagai sumber belajar. AI PahamTeks kemudian menjawab pertanyaan, menyusun rangkuman, kosakata, penjelasan, atau latihan bahasa dengan mengacu pada isi dokumen tersebut. Isi dokumen membatasi konteks jawaban; fitur ini bukan pelatihan ulang model Gemini.

### Pengguna dan alur utama yang direncanakan

1. Pengguna membuat ruang materi dan memberi nama/keterangan, misalnya kelas, mata kuliah, atau topik.
2. Pengguna memilih dokumen dari folder perangkat (web browser tidak dapat membaca folder secara diam-diam; pengguna harus memilih file/folder melalui dialog izin).
3. Sistem memeriksa tipe, ukuran, jumlah file, dan hasil pemindaian keamanan sebelum mengekstrak teks.
4. Pengguna meninjau daftar file dan status pemrosesan, lalu dapat menghapus atau mengganti dokumen.
5. AI mengambil potongan relevan dari dokumen untuk menjawab, membuat latihan, atau menjelaskan kosakata. Jawaban menyertakan nama dokumen dan halaman/bagian jika tersedia.

### Batasan produk dan mutu

- Fitur masih rancangan; belum ada alur upload, ekstraksi, penyimpanan berkas, indexing, atau tanya-jawab berbasis dokumen di aplikasi.
- Format awal yang dapat dipertimbangkan: PDF berbasis teks, DOCX, dan TXT. PDF hasil scan perlu OCR sebagai pekerjaan terpisah; jangan mengklaim semua dokumen terbaca sebelum diuji.
- Jawaban harus membedakan informasi yang ditemukan dalam sumber dan penjelasan tambahan. Jika sumber tidak memuat jawabannya, AI harus menyatakan hal itu dan tidak mengarang rujukan.
- Sistem harus memisahkan materi berdasarkan pemilik/kelas dan memeriksa otorisasi setiap kali file atau potongan materi diakses.
- Dokumen pengguna adalah data privat dan input tak tepercaya. Jangan menjalankan macro/script atau mengikuti prompt yang tertanam di dalamnya. Berikan kebijakan retensi dan penghapusan yang jelas.
- Rancangan penyimpanan: file di object storage persisten yang sesuai, metadata/status di TiDB, teks hasil ekstraksi disimpan atau diindeks dengan kontrol akses. Jangan menyimpan file di filesystem fungsi Vercel.

### Kriteria penerimaan awal untuk MVP

- File yang ditolak mendapat alasan yang jelas; file yang diproses menampilkan status.
- Jawaban AI menunjukkan sumber yang dipakai dan mengakui saat sumber tidak cukup.
- Pengguna hanya dapat melihat/menghapus materi yang memang berhak diakses.
- Penghapusan materi menghapus atau menjadwalkan penghapusan file, teks ekstrak, dan indeks terkait sesuai kebijakan retensi.
- Tim menguji dokumen kosong, rusak, sangat panjang, duplikat, dan berisi instruksi manipulatif sebelum membuka fitur ke pengguna.
