# Matriks Domain Materi & Kemampuan Sistem (SKILL.md)

Dokumen ini memetakan cakupan materi yang diajarkan di PahamTeks, cara kita menyusun kurikulum belajarnya, serta keandalan teknis yang ditangani oleh sistem.

---

## 1. Domain Koding & Bahasa Pemrograman

PahamTeks dirancang untuk mengupas logika pemrograman dari nol sampai pemahaman arsitektur:

| Bidang | Materi yang Diajarkan | Yang Dipelajari Pemelajar |
| :--- | :--- | :--- |
| **Logika & Algoritma** | Dasar Komputasi, Pseudocode, Python | Logika percabangan (*if-else*), perulangan (*loops*), fungsi, struktur data list & dictionary, efisiensi algoritma sederhana. |
| **Web Frontend** | HTML5, CSS3, JavaScript modern | Struktur halaman, flexbox/grid, interaksi DOM, asynchronous (*Promise* & *async/await*), konsep komponen React. |
| **Backend & API** | Node.js, Express, GraphQL, REST | Cara server bekerja, endpoint API, skema GraphQL, autentikasi sesi, dan pemahaman status HTTP. |
| **Database** | SQL (MySQL & SQLite) | Perancangan tabel, primary & foreign key, query SELECT/INSERT/UPDATE, pencegahan SQL Injection. |
| **Sistem & Konsep OOP** | Java, C++, Go, Rust | Pemrograman berorientasi objek (kelas, objek, enkapsulasi, pewarisan), manajemen memori, dan tipe data statis vs dinamis. |

---

## 2. Domain Bahasa Manusia (Linguistik Dunia)

PahamTeks mencakup lebih dari 50 bahasa dunia, dengan fokus utama pada pemakaian nyata:
- **Bahasa Pilihan Populer**: Bahasa Inggris, Jepang, Korea, Mandarin, Arab, Jerman, Prancis, Spanyol, dan Rusia.
- **Fokus Pembelajaran**:
  1. **Struktur Kalimat**: Pola kalimat (subjek-predikat-objek), partikel bahasa Jepang/Korea, tenses bahasa Inggris, kata kerja berubah (*conjugation*).
  2. **Kosakata Tematik**: Kata-kata yang sering dipakai di kantor, pergaulan, perjalanan, dan percakapan teknologi.
  3. **Idiom & Konteks Budaya**: Ungkapan kiasan yang tidak bisa diterjemahkan kata per kata.
  4. **Pelafalan & Suara**: Pemelajar bisa mendengar pengucapan kata dan berlatih berbicara lewat input mikrofon.

---

## 3. Pendekatan Pedagogi AI (Cara AI Mengajar)

Kita tidak ingin AI di PahamTeks bersikap seperti mesin pemeriksa kuis yang kaku:
1. **Belajar Bertahap 5 Bab (Scaffolding)**:
   Materi dipecah dari hal paling mudah (Bab 1: Fondasi) hingga tantangan yang butuh pemikiran analitis (Bab 5: Kasus Kompleks).
2. **Soal Anti-Membosankan**:
   Prompt AI Gemini dibuat dengan variasi acak dinamis agar soal kuis tidak monoton walau diulang beberapa kali.
3. **Umpan Balik Empatik ("Kenapa Salah?")**:
   Saat pemelajar salah, AI tidak langsung menghakimi. AI menjelaskan jebakan logika di balik opsi yang salah dan memberikan jembatan keledai (*mnemonic*) agar mudah diingat.
4. **Respon JSON Valid**:
   AI diprogram menghasilkan struktur JSON murni agar frontend bisa menampilkannya dengan mulus tanpa error parsing.

---

## 4. Keandalan Rekayasa Sistem (DevSecOps)

Sistem PahamTeks dipersenjatai kemampuan teknis tingkat produksi:
- **Penyimpanan sesuai lingkungan**: TiDB Cloud menyimpan data persisten produksi; SQLite fallback digunakan hanya pada development lokal bila MySQL lokal tidak tersedia. Ini bukan failover Vercel.
- **Proteksi Brute-Force**: Memblokir serangan tebak kata sandi secara otomatis setelah 5 kali percobaan gagal.
- **Proteksi Email & Server**: Membatasi laju request (*Rate Limiter*) dan menahan upaya spam OTP email.
- **Pemantauan Uptime**: Endpoint publik `/healthz` untuk probe UptimeRobot; `/health` adalah telemetri sensitif yang dibatasi untuk admin.

## 5. Rencana Kompetensi: Belajar dari Materi Pengguna

Fitur unggah materi dari folder masih dirancang. Tujuannya memberi konteks belajar personal/kelas kepada AI, bukan melatih ulang model Gemini.

### Kompetensi yang perlu dirancang

- **Literasi sumber**: AI membedakan isi eksplisit materi dari pengetahuan umum, menampilkan nama dokumen dan halaman/bagian jika metadata tersedia, serta mengakui bila materi tidak menjawab pertanyaan.
- **Penyusunan latihan**: Guru/dosen atau pemelajar dapat meminta kosakata, ringkasan, pertanyaan pemahaman, dialog, atau latihan bahasa yang tingkat kesulitannya dapat ditentukan.
- **Kurasi dan validasi**: Pengajar/kurator meninjau contoh jawaban, tingkat bahasa, kecocokan dengan tujuan belajar, dan kualitas rujukan sebelum materi dipakai luas.
- **Privasi dan hak akses**: Materi dapat bersifat personal atau milik kelas. Retrieval wajib dibatasi ke anggota yang berhak; pengguna harus dapat menghapus materi dan hasil ekstraknya sesuai kebijakan.
- **Keamanan konten**: File dianggap input tak tepercaya. Instruksi berbahaya yang ditemukan di dalam dokumen tidak boleh mengganti instruksi AI, mengungkap materi lain, atau memicu eksekusi kode.

Format dan fitur belum diputuskan. MVP dapat mengevaluasi PDF berbasis teks, DOCX, dan TXT; PDF scan/OCR, audio/video, serta berbagi kelas lanjutan memerlukan tahap terpisah. Lihat `PRD.md` dan `ROADMAP.md`.
