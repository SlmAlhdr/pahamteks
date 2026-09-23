# Catatan Produk & Kebutuhan Fitur (PRD) — PahamTeks

**Penulis/Inisiator**: Salim  
**Status**: Aktif berjalan & dasar diskusi tim  
**Target Produk**: Web App responsif (desktop & smartphone)  
**Alamat Web**: [pahamteks.vercel.app](https://pahamteks.vercel.app)

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

1. **Aplikasi Tidak Boleh Gampang Down**:
   - Database utama kita MySQL. Tapi kalau MySQL server mati atau down, sistem backend otomatis beralih ke SQLite cadangan (*auto-failover*). Pengguna tidak akan mendapati web blank atau error 500.
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
