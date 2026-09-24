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
- **Failover Database Otomatis**: Backend tidak pernah tumbang hanya karena MySQL lokal mati; sistem otomatis memakai SQLite lokal sebagai penyelamat.
- **Proteksi Brute-Force**: Memblokir serangan tebak kata sandi secara otomatis setelah 5 kali percobaan gagal.
- **Proteksi Email & Server**: Membatasi laju request (*Rate Limiter*) dan menahan upaya spam OTP email.
- **Pemantauan Uptime**: Menyediakan endpoint `/health` siap pakai untuk telemetri dan integrasi pemantau eksternal.
