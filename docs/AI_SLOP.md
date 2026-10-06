# Standar Kebersihan Kode & AI Slop Quality Gate (AI_SLOP.md)

Dokumen ini adalah panduan kebersihan kode di PahamTeks. Karena kita sering mengembangkan fitur bersama AI (*AI pair-programming / vibe coding* menggunakan Cursor, Antigravity, Claude Code, Copilot, dll.), kita memasang "satpam otomatis" bernama [`aislop`](https://github.com/marketplace/actions/aislop-ai-code-quality-gate) untuk memastikan kode tetap rapi, modular, dan berstandar insinyur manusia.

---

## 1. Apa Itu "AI Slop" & Kenapa Kita Peduli?

Asisten AI sangat pintar menulis kode dengan cepat, tetapi sering kali menyisakan kebiasaan buruk yang disebut **AI Slop**:
1. **Error Ditelan Diam-diam (*Swallowed Exceptions*)**:
   Blok `catch (e) {}` yang dibiarkan kosong melompong. Ini sangat berbahaya di PahamTeks karena kalau database atau Gemini API error, errornya hilang ditelan bumi dan kita bingung mencari letak bug-nya.
2. **Fungsi Duplikat (*Duplicate Helpers*)**:
   AI sering membuat ulang fungsi yang sama di 4-5 komponen berbeda (misal fungsi pemutar suara atau fungsi pembersih teks) alih-alih meletakkannya di folder `utils/`.
3. **Dependensi Hantu (*Ghost Dependencies*)**:
   Menyarankan install paket yang sebenarnya tidak pernah di-import (contohnya kemarin sempat ada `jquery` di `client/package.json`).
4. **Komentar Naratif Bertele-tele**:
   Komentar bergaya tutorial yang menjelaskan hal sepele yang sudah jelas terlihat dari kodenya.

---

## 2. Memahami Sistem Skor (0 s/d 100)

Banyak yang bertanya: *apakah angka 100 artinya sangat AI atau sangat Manusia?*

* **100 / 100 = HUMAN-ENGINEER GRADE (Sangat Bersih & Sehat)** 🌟:
  Artinya kode **bebas dari residu AI (*Zero AI Slop*)**. Kodenya rapi, modular, transparan dalam menangani error, selayaknya ditulis oleh Software Engineer berpengalaman.
* **0 / 100 = FULL AI SLOP (Sangat Rusak / Penuh Kode Sampah)** ⚠️:
  Artinya kode dipenuhi blok catch kosong, fungsi duplikat copas, dan rentan crash di produksi.
* **Ambang Batas Kita (Fail Below: 80)**:
  Di file [`.aislop/config.yml`](file:///c:/Salim/Kerjaan/pahamteks/.aislop/config.yml), kita pasang batas minimal **80**. Kalau skor di bawah 80, GitHub Actions langsung menolak merge (tanda merah).
* **Target Kita**: **≥ 95 / 100** (Grade A+).

---

## 3. Cara Cek Mandiri di Laptop (Sebelum Push)

Sebelum kamu push ke GitHub, kamu bisa scan apakah kodemu ada jejak AI Slop:

```bash
# 1. Scan seluruh kode di proyek
npx aislop@latest scan

# 2. Scan HANYA file-file yang baru saja kamu ubah (paling cepat!)
npx aislop@latest scan --changes --base origin/main

# 3. Cek apakah lulus standar CI (skor >= 80)
npx aislop@latest ci

# 4. Bersihkan komentar berlebih secara otomatis
npx aislop@latest fix
```

---

## 4. Konfigurasi Khusus PahamTeks (`.aislop/config.yml`)

Agar `aislop` tidak memeriksa folder hasil build atau database lokal, kita atur pengecualian di `.aislop/config.yml`:

```yaml
version: 1

ci:
  failBelow: 80         # Minimal skor kelulusan pipeline CI
  maxWarnings: 15       # Batas maksimal toleransi warning

exclude:
  - '**/node_modules/**'
  - '**/client/dist/**'
  - '**/client/build/**'
  - '**/server/data/**'           # Direktori SQLite lokal
  - '**/server/backups/**'        # Snapshot database
  - '**/*.min.js'
  - '**/.git/**'

rules:
  swallowed-exceptions: error     # Dilarang keras menelan error tanpa logging
  hallucinated-imports: error     # Dilarang pakai import fiktif
  hidden-fallbacks: error         # Dilarang menyembunyikan kegagalan tanpa warning
  duplicate-helpers: warning      # Peringatan jika membuat fungsi copas berulang kali
  narrative-comments: warning     # Peringatan untuk komentar bergaya obrolan AI
  todo-stubs: warning             # Peringatan untuk TODO yang ditinggalkan
```

---

## 5. Otomatisasi GitHub Actions (`.github/workflows/aislop.yml`)

Setiap kali ada commit atau Pull Request ke branch `main`, GitHub Actions otomatis menjalankan pengecekan ini:

```yaml
name: AI Code Quality Gate (aislop)

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  ai-quality-gate:
    name: Scan AI Slop & Code Health
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: scanaislop/aislop@v1
        with:
          fail-below: 80
```

---

## 6. Apa yang Harus Dilakukan Jika CI Menolak (Merah)?

1. Buka tab **Actions** di GitHub untuk melihat baris mana yang kena tegur.
2. Jalankan `npx aislop@latest scan --changes --base origin/main` di laptopmu.
3. Perbaiki masalahnya:
   - Kalau ada `catch` kosong: beri `console.warn('[NamaModul] Galat:', err.message)`.
   - Kalau ada fungsi yang di-copas: pindahkan ke `client/src/utils/`.
   - Kalau ada komentar tutorial yang bertele-tele: hapus atau persingkat.
4. Commit dan push ulang!

## 7. Ketepatan Dokumentasi dan Materi Pengguna

- Bedakan fitur yang sudah ada dengan rencana. Upload folder, ekstraksi dokumen, dan retrieval materi belum menjadi fitur aplikasi hanya karena tercantum di roadmap.
- Dokumentasi deployment harus mencerminkan Vercel + TiDB Cloud; SQLite fallback hanya berlaku untuk development lokal. UptimeRobot memeriksa `/healthz`, sedangkan `/health` khusus admin.
- Jangan menulis hostname, password, API key, token, data akun, atau contoh rahasia nyata ke dokumen dan log.
- Bila fitur materi dokumen dibangun, perlakukan file dan isinya sebagai input tak tepercaya; jangan membuat AI mengikuti prompt injection atau memberi jawaban tanpa rujukan yang dapat diverifikasi.
