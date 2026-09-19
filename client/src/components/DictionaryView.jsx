import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_DICTIONARY } from '../graphql/queries';
import HumanFormattedText from './HumanFormattedText';

// Istilah Populer
const QUICK_WORDS = [
  'Algorithm', 'Asynchronous', 'Polymorphism', 'Encapsulation', 'Database',
  'Middleware', 'Microservices', 'GraphQL', 'Bandwidth', 'Encryption',
  'Syntax Error', 'Deprecation', 'Paradigm', 'Serendipity', 'Resilience'
];

// Glosarium Kosakata Multibahasa A - Z
const AZ_DICTIONARY_DATA = [
  // A
  { term: 'Algorithm', lang: 'CODE', desc: 'Urutan langkah logis untuk menyelesaikan masalah komputasi' },
  { term: 'Arigatou', lang: 'JA', desc: 'Terima kasih (Bahasa Jepang informal/akrab)' },
  { term: 'Aloha', lang: 'HA', desc: 'Salam cinta, halo, dan selamat tinggal khas Hawaii' },
  { term: 'Amour', lang: 'FR', desc: 'Cinta atau kasih sayang mendalam (Bahasa Prancis)' },
  { term: 'Asynchronous', lang: 'CODE', desc: 'Eksekusi tugas tanpa memblokir thread proses utama' },
  { term: 'Ahlan wa Sahlan', lang: 'AR', desc: 'Selamat datang dengan penuh keramahtamahan (Bahasa Arab)' },
  { term: 'Apfel', lang: 'DE', desc: 'Buah apel (Bahasa Jerman)' },
  { term: 'Algorithm', lang: 'CODE', desc: 'Urutan langkah logis untuk menyelesaikan masalah komputasi', desc_en: 'Logical sequence of steps to solve a computational problem' },
  { term: 'Arigatou', lang: 'JA', desc: 'Terima kasih (Bahasa Jepang informal/akrab)', desc_en: 'Thank you (Informal / casual Japanese)' },
  { term: 'Aloha', lang: 'HA', desc: 'Salam cinta, halo, dan selamat tinggal khas Hawaii', desc_en: 'Hawaiian greeting meaning love, peace, hello, and goodbye' },
  { term: 'Amour', lang: 'FR', desc: 'Cinta atau kasih sayang mendalam (Bahasa Prancis)', desc_en: 'Deep love or affection (French)' },
  { term: 'Asynchronous', lang: 'CODE', desc: 'Eksekusi tugas tanpa memblokir thread proses utama', desc_en: 'Task execution without blocking the main process thread' },
  { term: 'Ahlan wa Sahlan', lang: 'AR', desc: 'Selamat datang dengan penuh keramahtamahan (Bahasa Arab)', desc_en: 'A warm and hospitable welcome (Arabic)' },
  { term: 'Apfel', lang: 'DE', desc: 'Buah apel (Bahasa Jerman)', desc_en: 'Apple fruit (German)' },

  // B
  { term: 'Bandwidth', lang: 'CODE', desc: 'Kapasitas maksimal transmisi data per detik' },
  { term: 'Bonjour', lang: 'FR', desc: 'Selamat pagi / Halo (Bahasa Prancis standar)' },
  { term: 'Boolean', lang: 'CODE', desc: 'Tipe data logika biner yang bernilai True atau False' },
  { term: 'Bitte', lang: 'DE', desc: 'Sama-sama / Tolong / Silakan (Bahasa Jerman)' },
  { term: 'Buenas Noches', lang: 'ES', desc: 'Selamat malam (Bahasa Spanyol)' },
  { term: 'Bismillah', lang: 'AR', desc: 'Dengan menyebut nama Allah (Bahasa Arab)' },
  { term: 'Bandwidth', lang: 'CODE', desc: 'Kapasitas maksimal transmisi data per detik', desc_en: 'Maximum data transmission capacity per second' },
  { term: 'Bonjour', lang: 'FR', desc: 'Selamat pagi / Halo (Bahasa Prancis standar)', desc_en: 'Good morning / Hello (Standard French)' },
  { term: 'Boolean', lang: 'CODE', desc: 'Tipe data logika biner yang bernilai True atau False', desc_en: 'Binary logical data type representing True or False' },
  { term: 'Bitte', lang: 'DE', desc: 'Sama-sama / Tolong / Silakan (Bahasa Jerman)', desc_en: 'You are welcome / Please / Pardon (German)' },
  { term: 'Buenas Noches', lang: 'ES', desc: 'Selamat malam (Bahasa Spanyol)', desc_en: 'Good evening / Good night (Spanish)' },
  { term: 'Bismillah', lang: 'AR', desc: 'Dengan menyebut nama Allah (Bahasa Arab)', desc_en: 'In the name of God (Arabic)' },

  // C
  { term: 'Closure', lang: 'CODE', desc: 'Fungsi yang mengingat variabel di lingkup leksikal induknya' },
  { term: 'Ciao', lang: 'IT', desc: 'Halo / Sampai jumpa kasual (Bahasa Italia)' },
  { term: 'Concurrency', lang: 'CODE', desc: 'Kemampuan sistem menjalankan beberapa komputasi sekaligus' },
  { term: 'Chérie', lang: 'FR', desc: 'Sayang / Kekasih hati (Bahasa Prancis)' },
  { term: 'Coroutine', lang: 'CODE', desc: 'Subrutin non-preemptif untuk multitasking kooperatif' },
  { term: 'Closure', lang: 'CODE', desc: 'Fungsi yang mengingat variabel di lingkup leksikal induknya', desc_en: 'Function that retains access to variables from its outer lexical scope' },
  { term: 'Ciao', lang: 'IT', desc: 'Halo / Sampai jumpa kasual (Bahasa Italia)', desc_en: 'Casual hello / goodbye (Italian)' },
  { term: 'Concurrency', lang: 'CODE', desc: 'Kemampuan sistem menjalankan beberapa komputasi sekaligus', desc_en: 'Ability of a system to execute multiple computations simultaneously' },
  { term: 'Chérie', lang: 'FR', desc: 'Sayang / Kekasih hati (Bahasa Prancis)', desc_en: 'Darling / Beloved sweetheart (French)' },
  { term: 'Coroutine', lang: 'CODE', desc: 'Subrutin non-preemptif untuk multitasking kooperatif', desc_en: 'Non-preemptive subroutine for cooperative multitasking' },

  // D
  { term: 'Database', lang: 'CODE', desc: 'Penyimpanan kumpulan data terstruktur secara persisten' },
  { term: 'Danke', lang: 'DE', desc: 'Terima kasih (Bahasa Jerman)' },
  { term: 'Deprecation', lang: 'CODE', desc: 'Fitur/fungsi yang ditandai usang dan akan dihapus di versi baru' },
  { term: 'Déjà vu', lang: 'FR', desc: 'Perasaan pernah mengalami kejadian yang sedang terjadi' },
  { term: 'Dua', lang: 'AR', desc: 'Permohonan atau doa kepada Tuhan (Bahasa Arab)' },
  { term: 'Database', lang: 'CODE', desc: 'Penyimpanan kumpulan data terstruktur secara persisten', desc_en: 'Persistent structured collection of electronic data' },
  { term: 'Danke', lang: 'DE', desc: 'Terima kasih (Bahasa Jerman)', desc_en: 'Thank you (German)' },
  { term: 'Deprecation', lang: 'CODE', desc: 'Fitur/fungsi yang ditandai usang dan akan dihapus di versi baru', desc_en: 'Feature marked as obsolete and scheduled for removal in future versions' },
  { term: 'Déjà vu', lang: 'FR', desc: 'Perasaan pernah mengalami kejadian yang sedang terjadi', desc_en: 'The feeling that one has already experienced a current situation' },
  { term: 'Dua', lang: 'AR', desc: 'Permohonan atau doa kepada Tuhan (Bahasa Arab)', desc_en: 'Supplication or prayer invoking God (Arabic)' },

  // E
  { term: 'Encapsulation', lang: 'CODE', desc: 'Prinsip OOP membungkus data dan metode dalam satu unit privat' },
  { term: 'Encryption', lang: 'CODE', desc: 'Penyandian data agar hanya bisa dibaca oleh pihak berwenang' },
  { term: 'Entschuldigung', lang: 'DE', desc: 'Permisi / Mohon maaf (Bahasa Jerman)' },
  { term: 'Esperanza', lang: 'ES', desc: 'Harapan (Bahasa Spanyol)' },
  { term: 'Étoile', lang: 'FR', desc: 'Bintang di langit (Bahasa Prancis)' },
  { term: 'Encapsulation', lang: 'CODE', desc: 'Prinsip OOP membungkus data dan metode dalam satu unit privat', desc_en: 'OOP principle bundling data and methods inside a single unit' },
  { term: 'Encryption', lang: 'CODE', desc: 'Penyandian data agar hanya bisa dibaca oleh pihak berwenang', desc_en: 'Process of encoding information to prevent unauthorized access' },
  { term: 'Entschuldigung', lang: 'DE', desc: 'Permisi / Mohon maaf (Bahasa Jerman)', desc_en: 'Excuse me / Sorry (German)' },
  { term: 'Esperanza', lang: 'ES', desc: 'Harapan (Bahasa Spanyol)', desc_en: 'Hope (Spanish)' },
  { term: 'Étoile', lang: 'FR', desc: 'Bintang di langit (Bahasa Prancis)', desc_en: 'Star in the night sky (French)' },

  // F
  { term: 'Framework', lang: 'CODE', desc: 'Kerangka kerja perangkat lunak yang menyediakan arsitektur dasar' },
  { term: 'Fatahillah', lang: 'AR', desc: 'Kemenangan dari Allah (Bahasa Arab)' },
  { term: 'Funktion', lang: 'DE', desc: 'Fungsi atau kegunaan (Bahasa Jerman)' },
  { term: 'Feedback', lang: 'EN', desc: 'Umpan balik atau respon atas hasil kerja' },
  { term: 'Framework', lang: 'CODE', desc: 'Kerangka kerja perangkat lunak yang menyediakan arsitektur dasar', desc_en: 'Foundational software structure providing generic functionality' },
  { term: 'Fatahillah', lang: 'AR', desc: 'Kemenangan dari Allah (Bahasa Arab)', desc_en: 'Victory from God (Arabic)' },
  { term: 'Funktion', lang: 'DE', desc: 'Fungsi atau kegunaan (Bahasa Jerman)', desc_en: 'Function or purpose (German)' },
  { term: 'Feedback', lang: 'EN', desc: 'Umpan balik atau respon atas hasil kerja', desc_en: 'Constructive response or critique regarding performance or product' },

  // G
  { term: 'GraphQL', lang: 'CODE', desc: 'Bahasa kueri fleksibel untuk API buatan Facebook' },
  { term: 'Ganbatte', lang: 'JA', desc: 'Semangat / Lakukan yang terbaik! (Bahasa Jepang)' },
  { term: 'Gracias', lang: 'ES', desc: 'Terima kasih (Bahasa Spanyol)' },
  { term: 'Guten Tag', lang: 'DE', desc: 'Selamat siang / Halo (Bahasa Jerman)' },
  { term: 'GraphQL', lang: 'CODE', desc: 'Bahasa kueri fleksibel untuk API buatan Facebook', desc_en: 'Flexible API query language and server runtime developed by Facebook' },
  { term: 'Ganbatte', lang: 'JA', desc: 'Semangat / Lakukan yang terbaik! (Bahasa Jepang)', desc_en: 'Do your best! / Keep pushing forward! (Japanese)' },
  { term: 'Gracias', lang: 'ES', desc: 'Terima kasih (Bahasa Spanyol)', desc_en: 'Thank you (Spanish)' },
  { term: 'Guten Tag', lang: 'DE', desc: 'Selamat siang / Halo (Bahasa Jerman)', desc_en: 'Good day / Hello (German)' },

  // H
  { term: 'Hashmap', lang: 'CODE', desc: 'Struktur data asosiatif pasangan kunci-nilai dengan akses O(1)' },
  { term: 'Habibi', lang: 'AR', desc: 'Kekasihku / Sahabatku tercinta (Bahasa Arab)' },
  { term: 'Hikari', lang: 'JA', desc: 'Cahaya (Bahasa Jepang)' },
  { term: 'Hermano', lang: 'ES', desc: 'Saudara laki-laki / Saudara kandung (Bahasa Spanyol)' },
  { term: 'Hashmap', lang: 'CODE', desc: 'Struktur data asosiatif pasangan kunci-nilai dengan akses O(1)', desc_en: 'Key-value associative data structure providing O(1) average lookup' },
  { term: 'Habibi', lang: 'AR', desc: 'Kekasihku / Sahabatku tercinta (Bahasa Arab)', desc_en: 'My beloved / My dear friend (Arabic)' },
  { term: 'Hikari', lang: 'JA', desc: 'Cahaya (Bahasa Jepang)', desc_en: 'Light or radiance (Japanese)' },
  { term: 'Hermano', lang: 'ES', desc: 'Saudara laki-laki / Saudara kandung (Bahasa Spanyol)', desc_en: 'Brother / Sibling (Spanish)' },

  // I
  { term: 'Inheritance', lang: 'CODE', desc: 'Pewarisan sifat dari kelas induk ke kelas anak dalam OOP' },
  { term: 'Inshallah', lang: 'AR', desc: 'Jika Allah menghendaki (Bahasa Arab)' },
  { term: 'Ichigo', lang: 'JA', desc: 'Buah stroberi (Bahasa Jepang)' },
  { term: 'Immutable', lang: 'CODE', desc: 'Objek yang nilainya tidak dapat diubah setelah dibuat' },
  { term: 'Inheritance', lang: 'CODE', desc: 'Pewarisan sifat dari kelas induk ke kelas anak dalam OOP', desc_en: 'Mechanism where a child class inherits properties and methods from a parent class' },
  { term: 'Inshallah', lang: 'AR', desc: 'Jika Allah menghendaki (Bahasa Arab)', desc_en: 'If God wills it (Arabic)' },
  { term: 'Ichigo', lang: 'JA', desc: 'Buah stroberi (Bahasa Jepang)', desc_en: 'Strawberry fruit (Japanese)' },
  { term: 'Immutable', lang: 'CODE', desc: 'Objek yang nilainya tidak dapat diubah setelah dibuat', desc_en: 'Object whose state cannot be modified after creation' },

  // J
  { term: 'JSON', lang: 'CODE', desc: 'JavaScript Object Notation, format pertukaran data ringan' },
  { term: 'Jendela', lang: 'ID', desc: 'Lubang ventilasi bertutup pada dinding (Bahasa Indonesia)' },
  { term: 'Jamilah', lang: 'AR', desc: 'Cantik / Indah (Bahasa Arab)' },
  { term: 'JSON', lang: 'CODE', desc: 'JavaScript Object Notation, format pertukaran data ringan', desc_en: 'JavaScript Object Notation, lightweight text data-interchange format' },
  { term: 'Jendela', lang: 'ID', desc: 'Lubang ventilasi bertutup pada dinding (Bahasa Indonesia)', desc_en: 'Window ventilation opening on a wall (Indonesian)' },
  { term: 'Jamilah', lang: 'AR', desc: 'Cantik / Indah (Bahasa Arab)', desc_en: 'Beautiful / Lovely (Arabic)' },

  // K
  { term: 'Konnichiwa', lang: 'JA', desc: 'Selamat siang / Halo (Bahasa Jepang standar)' },
  { term: 'Kizuna', lang: 'JA', desc: 'Ikatan batin / Persahabatan erat yang tak terpisahkan' },
  { term: 'Kubernetes', lang: 'CODE', desc: 'Platform orkestrasi container open-source skala besar' },
  { term: 'Kaizen', lang: 'JA', desc: 'Filosofi perbaikan terus-menerus secara konsisten' },
  { term: 'Konnichiwa', lang: 'JA', desc: 'Selamat siang / Halo (Bahasa Jepang standar)', desc_en: 'Good afternoon / Hello (Standard Japanese)' },
  { term: 'Kizuna', lang: 'JA', desc: 'Ikatan batin / Persahabatan erat yang tak terpisahkan', desc_en: 'Deep emotional bond or unbreakable connection between people' },
  { term: 'Kubernetes', lang: 'CODE', desc: 'Platform orkestrasi container open-source skala besar', desc_en: 'Open-source enterprise container orchestration system' },
  { term: 'Kaizen', lang: 'JA', desc: 'Filosofi perbaikan terus-menerus secara konsisten', desc_en: 'Philosophy of continuous incremental improvement' },

  // L
  { term: 'Lambda', lang: 'CODE', desc: 'Fungsi anonim kecil yang dapat dilewatkan sebagai argumen' },
  { term: 'Lumière', lang: 'FR', desc: 'Cahaya / Penerangan (Bahasa Prancis)' },
  { term: 'Liebe', lang: 'DE', desc: 'Cinta (Bahasa Jerman)' },
  { term: 'Lambda', lang: 'CODE', desc: 'Fungsi anonim kecil yang dapat dilewatkan sebagai argumen', desc_en: 'Anonymous function that can be passed around as a first-class value' },
  { term: 'Lumière', lang: 'FR', desc: 'Cahaya / Penerangan (Bahasa Prancis)', desc_en: 'Light or illumination (French)' },
  { term: 'Liebe', lang: 'DE', desc: 'Cinta (Bahasa Jerman)', desc_en: 'Love (German)' },

  // M
  { term: 'Microservices', lang: 'CODE', desc: 'Arsitektur perangkat lunak berbasis layanan independen kecil' },
  { term: 'Middleware', lang: 'CODE', desc: 'Perangkat lunak penengah antara request dan handler respon' },
  { term: 'Marhaban', lang: 'AR', desc: 'Selamat datang (Bahasa Arab)' },
  { term: 'Merci', lang: 'FR', desc: 'Terima kasih (Bahasa Prancis)' },
  { term: 'Microservices', lang: 'CODE', desc: 'Arsitektur perangkat lunak berbasis layanan independen kecil', desc_en: 'Architectural pattern arranging applications as loosely-coupled services' },
  { term: 'Middleware', lang: 'CODE', desc: 'Perangkat lunak penengah antara request dan handler respon', desc_en: 'Software layer sitting between incoming requests and final route handlers' },
  { term: 'Marhaban', lang: 'AR', desc: 'Selamat datang (Bahasa Arab)', desc_en: 'Welcome (Arabic)' },
  { term: 'Merci', lang: 'FR', desc: 'Terima kasih (Bahasa Prancis)', desc_en: 'Thank you (French)' },

  // N
  { term: 'Namespace', lang: 'CODE', desc: 'Ruang lingkup abstrak untuk mengelompokkan pengenal unik' },
  { term: 'Namaste', lang: 'HI', desc: 'Salam hormat dengan menangkupkan kedua tangan (Bahasa Hindi)' },
  { term: 'Nihon', lang: 'JA', desc: 'Negara Jepang / Asal matahari terbit' },
  { term: 'Namespace', lang: 'CODE', desc: 'Ruang lingkup abstrak untuk mengelompokkan pengenal unik', desc_en: 'Abstract declarative container providing scope to unique identifiers' },
  { term: 'Namaste', lang: 'HI', desc: 'Salam hormat dengan menangkupkan kedua tangan (Bahasa Hindi)', desc_en: 'Respectful greeting with folded palms (Hindi)' },
  { term: 'Nihon', lang: 'JA', desc: 'Negara Jepang / Asal matahari terbit', desc_en: 'Japan / Land of the rising sun' },

  // O
  { term: 'OOP', lang: 'CODE', desc: 'Object-Oriented Programming, paradigma berbasis objek' },
  { term: 'Ohayou Gozaimasu', lang: 'JA', desc: 'Selamat pagi (Bahasa Jepang sopan)' },
  { term: 'Oishii', lang: 'JA', desc: 'Lezat / Enak rasanya (Bahasa Jepang)' },
  { term: 'Obrigado', lang: 'PT', desc: 'Terima kasih (Bahasa Portugis)' },
  { term: 'OOP', lang: 'CODE', desc: 'Object-Oriented Programming, paradigma berbasis objek', desc_en: 'Object-Oriented Programming, paradigm organized around objects and data' },
  { term: 'Ohayou Gozaimasu', lang: 'JA', desc: 'Selamat pagi (Bahasa Jepang sopan)', desc_en: 'Good morning (Polite Japanese)' },
  { term: 'Oishii', lang: 'JA', desc: 'Lezat / Enak rasanya (Bahasa Jepang)', desc_en: 'Delicious / Tasty (Japanese)' },
  { term: 'Obrigado', lang: 'PT', desc: 'Terima kasih (Bahasa Portugis)', desc_en: 'Thank you (Portuguese)' },

  // P
  { term: 'Polymorphism', lang: 'CODE', desc: 'Kemampuan suatu objek memiliki banyak bentuk implementasi' },
  { term: 'Paradigm', lang: 'CODE', desc: 'Pola pikir atau pendekatan fundamental dalam komputasi' },
  { term: 'Pardon', lang: 'FR', desc: 'Maaf / Permisi (Bahasa Prancis)' },
  { term: 'Por favor', lang: 'ES', desc: 'Tolong / Silakan (Bahasa Spanyol)' },
  { term: 'Polymorphism', lang: 'CODE', desc: 'Kemampuan suatu objek memiliki banyak bentuk implementasi', desc_en: 'Ability of entities to take on multiple forms or implementations' },
  { term: 'Paradigm', lang: 'CODE', desc: 'Pola pikir atau pendekatan fundamental dalam komputasi', desc_en: 'Fundamental approach or mental model of programming' },
  { term: 'Pardon', lang: 'FR', desc: 'Maaf / Permisi (Bahasa Prancis)', desc_en: 'Excuse me / I beg your pardon (French)' },
  { term: 'Por favor', lang: 'ES', desc: 'Tolong / Silakan (Bahasa Spanyol)', desc_en: 'Please (Spanish)' },

  // Q
  { term: 'Query', lang: 'CODE', desc: 'Permintaan data terformat ke sistem basis data' },
  { term: 'Qalb', lang: 'AR', desc: 'Hati nurani / Jantung kalbu (Bahasa Arab)' },
  { term: 'Queue', lang: 'CODE', desc: 'Struktur data antrean berprinsip FIFO (First-In, First-Out)' },
  { term: 'Query', lang: 'CODE', desc: 'Permintaan data terformat ke sistem basis data', desc_en: 'Precise request for information retrieval from a database' },
  { term: 'Qalb', lang: 'AR', desc: 'Hati nurani / Jantung kalbu (Bahasa Arab)', desc_en: 'Heart, conscience, or inner spiritual core (Arabic)' },
  { term: 'Queue', lang: 'CODE', desc: 'Struktur data antrean berprinsip FIFO (First-In, First-Out)', desc_en: 'FIFO (First-In, First-Out) sequential data structure' },

  // R
  { term: 'Recursion', lang: 'CODE', desc: 'Metode di mana suatu fungsi memanggil dirinya sendiri' },
  { term: 'Resilience', lang: 'EN', desc: 'Ketahanan dan kemampuan bangkit dari kesulitan' },
  { term: 'Ruhe', lang: 'DE', desc: 'Ketenangan / Kedamaian hening (Bahasa Jerman)' },
  { term: 'Recursion', lang: 'CODE', desc: 'Metode di mana suatu fungsi memanggil dirinya sendiri', desc_en: 'Technique where a function calls itself to solve subproblems' },
  { term: 'Resilience', lang: 'EN', desc: 'Ketahanan dan kemampuan bangkit dari kesulitan', desc_en: 'Ability to recover quickly from difficulties or adapt to change' },
  { term: 'Ruhe', lang: 'DE', desc: 'Ketenangan / Kedamaian hening (Bahasa Jerman)', desc_en: 'Calmness, peace, and quiet serenity (German)' },

  // S
  { term: 'Serendipity', lang: 'EN', desc: 'Keberuntungan menemukan sesuatu yang indah tanpa disengaja' },
  { term: 'Syntax Error', lang: 'CODE', desc: 'Kesalahan tata penulisan kode yang melanggar aturan tata bahasa pemrograman' },
  { term: 'Shukran', lang: 'AR', desc: 'Terima kasih (Bahasa Arab)' },
  { term: 'Sayonara', lang: 'JA', desc: 'Selamat tinggal untuk waktu lama (Bahasa Jepang)' },
  { term: 'Serendipity', lang: 'EN', desc: 'Keberuntungan menemukan sesuatu yang indah tanpa disengaja', desc_en: 'Unplanned fortunate discovery of valuable things' },
  { term: 'Syntax Error', lang: 'CODE', desc: 'Kesalahan tata penulisan kode yang melanggar aturan tata bahasa pemrograman', desc_en: 'Violation of programming language grammar rules preventing execution' },
  { term: 'Shukran', lang: 'AR', desc: 'Terima kasih (Bahasa Arab)', desc_en: 'Thank you (Arabic)' },
  { term: 'Sayonara', lang: 'JA', desc: 'Selamat tinggal untuk waktu lama (Bahasa Jepang)', desc_en: 'Farewell / Goodbye for an extended time (Japanese)' },

  // T
  { term: 'TypeScript', lang: 'CODE', desc: 'Bahasa pemrograman JavaScript dengan sistem tipe statis' },
  { term: 'Terima Kasih', lang: 'ID', desc: 'Ungkapan rasa bersyukur atas kebaikan orang lain' },
  { term: 'Tranquille', lang: 'FR', desc: 'Tenang, santai, dan tanpa beban (Bahasa Prancis)' },
  { term: 'TypeScript', lang: 'CODE', desc: 'Bahasa pemrograman JavaScript dengan sistem tipe statis', desc_en: 'Strongly typed programming language that builds on JavaScript' },
  { term: 'Terima Kasih', lang: 'ID', desc: 'Ungkapan rasa bersyukur atas kebaikan orang lain', desc_en: 'Expression of gratitude and appreciation (Indonesian)' },
  { term: 'Tranquille', lang: 'FR', desc: 'Tenang, santai, dan tanpa beban (Bahasa Prancis)', desc_en: 'Calm, peaceful, and unbothered (French)' },

  // U
  { term: 'Unicode', lang: 'CODE', desc: 'Standar pengkodean karakter universal seluruh bahasa dunia' },
  { term: 'Ummi', lang: 'AR', desc: 'Ibu tercinta (Bahasa Arab)' },
  { term: 'Utopia', lang: 'EN', desc: 'Gambaran tempat atau sistem masyarakat yang sempurna' },
  { term: 'Unicode', lang: 'CODE', desc: 'Standar pengkodean karakter universal seluruh bahasa dunia', desc_en: 'Universal character encoding standard for global human writing systems' },
  { term: 'Ummi', lang: 'AR', desc: 'Ibu tercinta (Bahasa Arab)', desc_en: 'My beloved mother (Arabic)' },
  { term: 'Utopia', lang: 'EN', desc: 'Gambaran tempat atau sistem masyarakat yang sempurna', desc_en: 'Idealized vision of a perfect society and world' },

  // V
  { term: 'Variable', lang: 'CODE', desc: 'Penampung memori untuk menyimpan nilai yang dapat berubah' },
  { term: 'Vérité', lang: 'FR', desc: 'Kebenaran sejati (Bahasa Prancis)' },
  { term: 'Vámonos', lang: 'ES', desc: 'Ayo kita berangkat! (Bahasa Spanyol)' },
  { term: 'Variable', lang: 'CODE', desc: 'Penampung memori untuk menyimpan nilai yang dapat berubah', desc_en: 'Named storage location for data values that can change' },
  { term: 'Vérité', lang: 'FR', desc: 'Kebenaran sejati (Bahasa Prancis)', desc_en: 'Truth / Absolute reality (French)' },
  { term: 'Vámonos', lang: 'ES', desc: 'Ayo kita berangkat! (Bahasa Spanyol)', desc_en: "Let's go! (Spanish)" },

  // W
  { term: 'WebAssembly', lang: 'CODE', desc: 'Format instruksi biner berkecepatan tinggi di browser' },
  { term: 'Wahid', lang: 'AR', desc: 'Satu / Tunggal (Bahasa Arab)' },
  { term: 'Wasser', lang: 'DE', desc: 'Air (Bahasa Jerman)' },
  { term: 'WebAssembly', lang: 'CODE', desc: 'Format instruksi biner berkecepatan tinggi di browser', desc_en: 'High-performance binary instruction format for modern browsers' },
  { term: 'Wahid', lang: 'AR', desc: 'Satu / Tunggal (Bahasa Arab)', desc_en: 'One / Single / Sole (Arabic)' },
  { term: 'Wasser', lang: 'DE', desc: 'Air (Bahasa Jerman)', desc_en: 'Water (German)' },

  // X
  { term: 'XML', lang: 'CODE', desc: 'Extensible Markup Language untuk penyimpanan data terstruktur' },
  { term: 'Xenon', lang: 'EN', desc: 'Unsur gas mulia langka berkarakteristik unik' },
  { term: 'XML', lang: 'CODE', desc: 'Extensible Markup Language untuk penyimpanan data terstruktur', desc_en: 'Extensible Markup Language for storing and exchanging structured data' },
  { term: 'Xenon', lang: 'EN', desc: 'Unsur gas mulia langka berkarakteristik unik', desc_en: 'Noble chemical element known for inert and illuminating properties' },

  // Y
  { term: 'Yume', lang: 'JA', desc: 'Mimpi atau cita-cita harapan (Bahasa Jepang)' },
  { term: 'Yalla', lang: 'AR', desc: 'Ayo / Cepatlah! (Bahasa Arab sehari-hari)' },
  { term: 'Yield', lang: 'CODE', desc: 'Kata kunci generator untuk mengembalikan nilai sementara' },
  { term: 'Yume', lang: 'JA', desc: 'Mimpi atau cita-cita harapan (Bahasa Jepang)', desc_en: 'Dream or aspirational vision (Japanese)' },
  { term: 'Yalla', lang: 'AR', desc: 'Ayo / Cepatlah! (Bahasa Arab sehari-hari)', desc_en: "Come on! / Hurry up! (Casual Arabic)" },
  { term: 'Yield', lang: 'CODE', desc: 'Kata kunci generator untuk mengembalikan nilai sementara', desc_en: 'Generator keyword returning an intermediate value without terminating the function' },

  // Z
  { term: 'Zen', lang: 'JA', desc: 'Meditasi dan kedamaian batin (Bahasa Jepang)' },
  { term: 'Zeitgeist', lang: 'DE', desc: 'Semangat atau iklim pemikiran yang mewakili suatu era zaman' },
  { term: 'Zero-Cost', lang: 'CODE', desc: 'Abstraksi kode yang tidak menambah beban runtime pada program' }
  { term: 'Zen', lang: 'JA', desc: 'Meditasi dan kedamaian batin (Bahasa Jepang)', desc_en: 'State of mindful meditation, peace, and simplicity (Japanese)' },
  { term: 'Zeitgeist', lang: 'DE', desc: 'Semangat atau iklim pemikiran yang mewakili suatu era zaman', desc_en: 'The defining spirit or intellectual mood of a particular era' },
  { term: 'Zero-Cost', lang: 'CODE', desc: 'Abstraksi kode yang tidak menambah beban runtime pada program', desc_en: 'Language abstractions that incur no additional runtime performance penalty' }
];

const ALPHABETS = ['Semua', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
const ALPHABETS = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export default function DictionaryView({ t, currentLang }) {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('Semua');
  const [selectedLetter, setSelectedLetter] = useState('ALL');

  const [fetchDictionary, { loading }] = useLazyQuery(GET_DICTIONARY);

  const handleSearch = async (kw = keyword) => {
    if (!kw.trim()) return;
    setResult(currentLang === 'id' ? 'Menghubungkan ke server AI...' : 'Connecting to AI server...');
    try {
      const res = await fetchDictionary({ variables: { keyword: kw } });
      const res = await fetchDictionary({ variables: { keyword: kw, lang: currentLang } });
      if (res.data?.dictionary?.result) {
        setResult(res.data.dictionary.result);
      } else if (res.data?.dictionary?.error) {
        setResult(res.data.dictionary.error);
      }
    } catch (err) {
      setResult('⚠️ AI Error: ' + err.message);
    }
  };

  const handleRandom = () => {
    const randomWord = QUICK_WORDS[Math.floor(Math.random() * QUICK_WORDS.length)];
    setKeyword(randomWord);
    handleSearch(randomWord);
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'id' ? 'id-ID' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectWord = (word) => {
    setKeyword(word);
    handleSearch(word);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const filteredWords = selectedLetter === 'Semua'
  const filteredWords = (selectedLetter === 'ALL' || selectedLetter === 'Semua')
    ? AZ_DICTIONARY_DATA
    : AZ_DICTIONARY_DATA.filter((w) => w.term.toUpperCase().startsWith(selectedLetter));

  return (
    <div className="page" style={{ width: '100%', maxWidth: '900px' }}>
      <div className="hero" style={{ marginBottom: '22px' }}>
        <h1>{t('dict_page_title')}</h1>
        <p>{t('dict_page_desc')}</p>
      </div>

      <div className="input-group" style={{ maxWidth: '850px', width: '100%' }}>
        {/* Kolom Pencarian */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            className="auth-input"
            style={{ margin: 0, flex: 1, padding: '16px', fontSize: '1.05rem' }}
            placeholder={t('dict_ph')}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="btn-huge btn-green"
            style={{ minWidth: '100px', padding: '12px 20px', textTransform: 'none', fontWeight: 800 }}
            onClick={handleRandom}
          >
            {t('dict_btn_rand')}
          </button>
        </div>

        <button
          className="btn-huge btn-cyan"
          style={{ width: '100%' }}
          onClick={() => handleSearch()}
          disabled={loading || !keyword.trim()}
        >
          {loading ? 'Mencari...' : t('dict_btn')}
          {loading ? (currentLang === 'en' ? 'Searching...' : 'Mencari...') : t('dict_btn')}
        </button>

        {/* Hasil Definisi Human-Like */}
        {result && (
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--btn-cyan)',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '20px',
            position: 'relative',
            lineHeight: 1.7,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <button
              className="btn-speak"
              style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px' }}
              onClick={() => speakText(result)}
              title="Dengarkan Arti"
              title={currentLang === 'en' ? 'Listen to Definition' : 'Dengarkan Arti'}
            >
              🔊
            </button>
            <div style={{ paddingRight: '45px' }}>
              <HumanFormattedText content={result} />
            </div>
          </div>
        )}

        {/* 1. DAFTAR ISTILAH POPULER (DIPERTAHANKAN) */}
        <div style={{ marginTop: '28px' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '10px', fontSize: '1rem', fontWeight: 800 }}>
            {t('dict_word_list')}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {QUICK_WORDS.map((w, idx) => (
              <button
                key={idx}
                className="btn-outline"
                style={{
                  padding: '6px 14px',
                  borderRadius: '15px',
                  fontSize: '0.85rem',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer'
                }}
                onClick={() => handleSelectWord(w)}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* 2. DAFTAR KOSAKATA PANJANG KE BAWAH MULTI-BAHASA (A - Z) */}
        <div style={{ marginTop: '35px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--btn-cyan)', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px' }}>
              {t('dict_az_title')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              {t('dict_az_subtitle')}
            </p>
          </div>

          {/* Filter Bar Abjad A-Z */}
          <div className="az-filter-bar">
            {ALPHABETS.map((letter) => (
              <button
                key={letter}
                className={`az-letter-btn ${selectedLetter === letter ? 'active' : ''}`}
                onClick={() => setSelectedLetter(letter)}
              >
                {letter}
                {letter === 'ALL' ? t('filter_all') : letter}
              </button>
            ))}
          </div>

          {/* List Kosakata Panjang Ke Bawah */}
          <div className="az-word-list">
            {filteredWords.map((item, idx) => (
              <div
                key={idx}
                className="az-word-card"
                onClick={() => handleSelectWord(item.term)}
                title="Klik untuk membuka arti lengkap dengan AI"
                title={currentLang === 'en' ? 'Click to view complete definition with AI' : 'Klik untuk membuka arti lengkap dengan AI'}
              >
                <div className="az-card-top">
                  <span className="az-word-title">{item.term}</span>
                  <span className={`az-lang-pill lang-${item.lang.toLowerCase()}`}>{item.lang}</span>
                </div>
                <p className="az-word-desc">{item.desc}</p>
                <p className="az-word-desc">{currentLang === 'en' ? (item.desc_en || item.desc) : item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
