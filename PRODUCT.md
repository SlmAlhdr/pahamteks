# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Siswa, mahasiswa, dan pemelajar mandiri di Indonesia yang ingin mempelajari bahasa asing sekaligus logika/sintaksis bahasa pemrograman dalam satu platform terpadu.
- Pemelajar yang membutuhkan referensi kosakata multibahasa, komparasi fitur/paradigma bahasa, dan kuis interaktif dengan umpan balik langsung.

## Product Purpose

PahamTeks hadir untuk menghilangkan friksi dalam belajar bahasa—baik bahasa manusia maupun bahasa komputer. Produk ini memungkinkan pemelajar menguji pemahaman lewat kuis interaktif berpenjelasan AI, mencari padanan istilah di kamus A-Z multibahasa, membandingkan karakteristik bahasa secara berdampingan, dan melacak perkembangan belajar secara fleksibel melalui akun tamu maupun akun resmi.

## Positioning

Penyatuan pembelajaran bahasa dunia (human languages) dan bahasa pemrograman dalam satu ekosistem terintegrasi. Berbeda dari platform belajar bahasa atau coding konvensional yang terpisah, PahamTeks menyediakan kuis adaptif dengan penjelasan AI, kamus istilah A-Z komprehensif, wawasan perbandingan fitur bahasa, serta penerjemah instan dalam satu atap yang intuitif.

## Operating Context

- Web application yang diakses lewat peramban mobile (smartphone) dan desktop.
- Model penggunaan mandiri (self-paced learning) tanpa kewajiban login awal (tersedia mode tamu berbasis sesi lokal) dengan opsi upgrade ke akun resmi terverifikasi OTP email.
- Deployment publik sementara nonaktif; aplikasi dijalankan secara lokal selama pengembangan.

## Capabilities and Constraints

- **Pembelajaran Bahasa & Kuis**: Kuis interaktif untuk Bahasa Dunia (50+ bahasa asing) dan Bahasa Pemrograman (Algoritma, Web, Sistem, Database, OOP) dengan skor langsung dan penjelasan AI saat jawaban salah.
- **Kamus & Wawasan Bahasa**: Kamus istilah terstruktur A-Z dengan filter abjad dan pencarian instan, fitur Wawasan Komparasi Bahasa (matriks komparasi fitur/paradigma), dan Penerjemah teks terintegrasi.
- **Akun & Pelacakan Progres**: Pelacakan riwayat kuis dan skor, alur akun tamu (guest) serta akun resmi via kode verifikasi OTP email (Nodemailer/SMTP).
- **Arsitektur Teknis**: Frontend React 18 SPA (Vite, Apollo Client, Lucide icons) dan Backend Node.js GraphQL API dengan MySQL.
- **Batasan UI & Responsivitas**: Navigasi header harus terpusat, bilah status akun melebar penuh dari tepi ke tepi di strip atas, dan tata letak harus adaptif sempurna untuk tampilan layar sentuh ponsel pintar.

## Brand Commitments

- **Nama**: PahamTeks
- **Tone of Voice**: Edukatif, modern, ramah, lugas, dan memberdayakan pemelajar Indonesia.
- **Identitas Visual**: Logo di pojok kiri atas, menu navigasi di posisi tengah, bilah aksi akun di pojok kanan atas, serta animasi teks berjalan di latar belakang beranda.

## Evidence on Hand

- Repositori kode aktif pada `client/src/` (komponen antarmuka `Navbar.jsx`, `Quiz.jsx`, `TranslatorDictionary.jsx`, `LanguageInsights.jsx`, `Tracking.jsx`, `AccountModal.jsx`).
- GraphQL schema & backend logic di `server/src/` dan `api/index.js`.
- Tidak ada klaim testimonial fiktif atau data benchmark buatan yang dicatat.

## Product Principles

1. **Unified Multi-Discipline Learning**: Menyatukan konsep bahasa manusia dan bahasa pemrograman dalam satu pengalaman belajar yang kohesif.
2. **Zero-Friction Discovery**: Membuka akses penuh untuk mencoba kuis dan referensi kamus langsung sebagai tamu tanpa hambatan registrasi di awal.
3. **Contextual & Immediate Feedback**: Memberikan penjelasan langsung pada setiap kesalahan kuis dan komparasi visual yang jelas untuk mempercepat pemahaman.
4. **Mobile-First Ergonomics**: Menjamin kenyamanan navigasi, keterbacaan tipografi, dan kemudahan interaksi di layar perangkat bergerak.

## Accessibility & Inclusion

- Dukungan penuh antarmuka bahasa Indonesia yang mudah dipahami oleh semua kalangan pemelajar.
- Kontras warna teks dan elemen UI yang memenuhi standar keterbacaan di berbagai kondisi pencahayaan.
- Elemen interaktif dan tombol dengan ukuran target sentuh (touch target) yang ergonomis untuk pengguna mobile.
