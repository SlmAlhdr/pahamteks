# Definisi Kemampuan & Pengetahuan Domain (SKILL.md)

Dokumen ini memetakan seluruh **domain kemampuan (*skills*)** yang tertanam dan dikuasai oleh sistem **PahamTeks**, baik dari sisi materi edukasi, kapabilitas AI, maupun keandalan rekayasa perangkat lunak.

---

## 1. Domain Bahasa Pemrograman & Rekayasa Perangkat Lunak

PahamTeks mampu menguji, menjelaskan, dan menganalisis konsep-konsep teknis berikut:

| Kategori | Bahasa / Teknologi | Ruang Lingkup Materi |
| :--- | :--- | :--- |
| **Fondasi & Algoritma** | Logika Komputasi, Pseudocode, Python | Logika percabangan (*if-else*), perulangan (*loops*), fungsi, struktur data array/list/hashmap, kompleksitas Big-O. |
| **Pengembangan Web** | HTML5, CSS3, JavaScript modern (ESM) | Semantik web, layouting flexbox & grid, DOM manipulation, asynchronous (*Promise*, *async/await*), API integration. |
| **Ekosistem Modern** | React 18, Node.js, Express.js | Komponen berbasis fungsi, React hooks (*useState*, *useEffect*, *useRef*), Virtual DOM, middleware Express. |
| **Arsitektur API** | GraphQL (Apollo) & REST | Skema typeDefs, resolvers, queries, mutations, context authorization, endpoint health check. |
| **Basis Data Relasional** | MySQL & SQLite | Desain tabel, relasi kunci asing (*Foreign Keys*), query parameterized anti-SQL injection, indeksasi, dan transaksi failover. |
| **Bahasa Sistem & OOP** | Java, C++, Go, Rust | Pemrograman berorientasi objek (Enkapsulasi, Pewarisan, Polimorfisme), pengelolaan memori, tipe data statis vs dinamis. |

---

## 2. Domain Linguistik & Bahasa Dunia (Human Languages)

PahamTeks menguasai 50+ bahasa dunia dengan fokus pembelajaran praktis:
* **Bahasa Utama**: Bahasa Inggris, Jepang, Korea, Mandarin (Sederhana & Tradisional), Jerman, Prancis, Spanyol, Arab, Rusia, Belanda, dll.
* **Tingkat Kesulitan**: Pemula (*Beginner*), Menengah (*Intermediate*), dan Mahir (*Advanced*).
* **Fokus Kompetensi**:
  1. *Grammar & Sentence Syntax*: Pola kalimat (SVO, SOV), tenses, konjugasi kata kerja, partikel.
  2. *Core Vocabulary*: Kosakata tematik sehari-hari, istilah akademik, dan istilah percakapan kerja.
  3. *Contextual Nuances & Idioms*: Idiom populer, bahasa percakapan santai, dan ungkapan sopan formal.
  4. *Speech & Audio Processing*: Pemrosesan audio suara menjadi teks (*voice-to-text*) menggunakan AI multimodal.

---

## 3. Domain Pedagogi & Prompt Engineering AI

Sistem memiliki keahlian khusus dalam merancang prompt AI edukasi yang efektif:
* **Scaffolding Learning**: Memecah materi kompleks menjadi 5 unit pembelajaran yang bertahap (Fondasi -> Struktur -> Percakapan -> Idiom -> Penguasaan Mahir).
* **Anti-Repetition Prompting**: Menggunakan pengacakan *seed* variasi dinamis agar soal latihan kuis selalu segar dan tidak monoton.
* **Human-Like Feedback Formulation**:
  * Menghindari kalimat kaku mesin (*"Sebagai AI..."*).
  * Memberikan analisis kesalahan yang empatik dan suportif (menjelaskan letak jebakan soal dan cara mudah mengingat aturan benarnya).
* **Strict JSON Schema Enforcement**: Menjamin keluaran AI selalu sesuai kontrak struktur data tanpa merusak proses parsing aplikasi.

---

## 4. Domain Keamanan & Keandalan Sistem (DevSecOps)

Sistem dirancang dengan keahlian rekayasa sistem modern:
* **Failover Otomatis**: Kemampuan mengalihkan eksekusi query dari MySQL ke SQLite tanpa *downtime* saat database utama tidak terjangkau.
* **Mitigasi Serangan**:
  * *Brute Force Mitigation*: Pemblokiran otomatis akun/IP setelah 5x kegagalan berturut-turut.
  * *Denial of Service (DoS) Prevention*: Pembatasan frekuensi request 200 req / 15 menit.
  * *Email Bombing Protection*: Pembatasan permintaan OTP 3x per 10 menit.
* **Integrasi Pemantauan (*Uptime & Telemetry*)**: Menyediakan endpoint `/health` terstandarisasi untuk integrasi monitoring pihak ketiga (UptimeRobot/BetterStack).
