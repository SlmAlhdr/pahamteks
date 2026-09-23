# Panduan Konfigurasi & Standar AI Slop Quality Gate — PahamTeks

Dokumen ini menjelaskan strategi penerapan **AI Code Quality Gate** di repositori PahamTeks menggunakan [`aislop-ai-code-quality-gate`](https://github.com/marketplace/actions/aislop-ai-code-quality-gate) dari `scanaislop/aislop`.

---

## 📌 1. Apa Itu "AI Slop" & Mengapa Kita Membutuhkannya?

Dalam era pengembangan perangkat lunak berbasis AI (*AI pair-programming / vibe coding* menggunakan Antigravity, Cursor, Claude Code, Copilot, atau ChatGPT), asisten AI sering kali menghasilkan kode fungsional dengan cepat. Namun, tanpa pengawasan ketat, kode hasil AI rentan menyisakan pola-pola degradasi kualitas yang dikenal sebagai **AI Slop**.

### Dampak AI Slop Terhadap Proyek PahamTeks:
1. **Degradasi Keterbacaan**: Komentar bertele-tele dan naratif yang mengotori alur baca logika.
2. **Kerapuhan Sistem (*Fragility*)**: Blok `try-catch` kosong (*swallowed exceptions*) yang menelan galat penting sehingga bug tersembunyi sulit dideteksi di produksi.
3. **Kode Duplikat & Kembung (*Code Bloat*)**: Fungsi pembantu (*helper/utility*) yang dibuat berulang kali di berbagai berkas alih-alih memakai modul bersama.
4. **Keamanan & Konsistensi Tipe**: Tipe data yang dilewati secara serampangan atau impor pustaka fiktif (*hallucinated imports*).

> **Tujuan AI Quality Gate**: Menjadi "satpam otomatis" pada CI/CD GitHub Actions dan lingkungan lokal developer, memastikan setiap baris kode yang ditulis oleh manusia maupun agen AI tetap memenuhi standar kebersihan, keamanan, dan arsitektur PahamTeks.

---

## 🔍 2. Pola-Pola AI Slop yang Dideteksi

`aislop` menggunakan mesin analisis statis deterministik berkecepatan tinggi yang memberikan skor **0 hingga 100** tanpa memerlukan panggilan LLM berbayar. Pola yang diawasi meliputi:

| Kategori Deteksi | Pola yang Dilarang / Diperingatkan | Mengapa Berbahaya di PahamTeks? |
| :--- | :--- | :--- |
| **Narrative Comments** | Komentar bergaya percakapan/tutorial (contoh: `// Here we extract the word from query...`) | Mengaburkan dokumentasi teknis esensial dan memperpanjang baris berkas tanpa nilai tambah. |
| **Swallowed Exceptions** | Blok `catch (e) {}` yang kosong tanpa logging atau fallback terukur | Backend PahamTeks memakai failover ganda (MySQL & SQLite); jika error ditelan diam-diam, sistem pemantau (*health check*) tidak akan mendeteksi crash. |
| **Hidden / Fragile Fallbacks** | Penggunaan `try { ... } catch { return null; }` yang tidak semestinya | Menyembunyikan kesalahan query GraphQL atau kegagalan API Gemini sehingga pengguna melihat data kosong tanpa penjelasan. |
| **Hallucinated / Ghost Imports** | Mengimpor pustaka atau fungsi yang tidak ada di `package.json` | Menyebabkan build frontend/backend pecah saat dijalankan di server staging atau Vercel. |
| **Duplicated Helpers** | Menulis ulang fungsi sanitasi, pembersih string, atau formatting di beberapa komponen React | Melanggar prinsip DRY (*Don't Repeat Yourself*) dan menyulitkan pemeliharaan kode kamus/kuis. |
| **Unsafe Type Assertions** | Penggunaan `as any` atau komentar bypass linter tanpa alasan jelas | Menurunkan keandalan kode TypeScript/JavaScript modern. |
| **TODO & Stubs Dibiarkan** | Placeholder `// TODO: implement later` atau stub kosong yang tertinggal | Fitur terlihat siap namun sebenarnya belum berfungsi saat diuji pengguna. |
| **Monster / Complex Functions** | Fungsi monolitik dengan tingkat kompleksitas siklomatik sangat tinggi | Sulit diuji (*unit test*) dan rawan regresi saat dilakukan refactoring. |

---

## 💻 3. Menjalankan Pemeriksaan di Komputer Lokal

Tim PahamTeks dapat menjalankan pemindaian `aislop` secara lokal sebelum melakukan push ke GitHub:

### A. Scan Cepat Tanpa Instalasi (Rekomendasi)
```bash
# Menjalankan pemindaian penuh di seluruh proyek
npx aislop@latest scan

# Menjalankan pemindaian HANYA pada berkas yang diubah (git diff)
npx aislop@latest scan --changes --base origin/main
```

### B. Simulasi Penilaian CI (Kelulusan Skor)
```bash
# Gagal (exit code 1) jika skor di bawah ambang batas (contoh: < 80)
npx aislop@latest ci
```

### C. Perbaikan Otomatis (*Auto-Fix*)
```bash
# Membersihkan komentar naratif berlebih dan pemformatan otomatis
npx aislop@latest fix
```

### D. Mode Panduan AI Agent
```bash
# Menghasilkan instruksi perbaikan terstruktur untuk diberikan kembali ke AI Agent
npx aislop@latest agent
```

---

## ⚙️ 4. Berkas Konfigurasi PahamTeks (`.aislop/config.yml`)

Untuk memastikan `aislop` tidak memeriksa berkas build hasil kompilasi, cadangan database, atau data SQLite lokal, buat berkas `.aislop/config.yml` pada direktori *root* proyek:

```yaml
# .aislop/config.yml
# Konfigurasi AI Code Quality Gate untuk PahamTeks

version: 1

ci:
  failBelow: 80         # Minimal skor kelulusan pipeline CI (0-100)
  maxWarnings: 15       # Batas maksimal toleransi peringatan (warning)

# Folder dan berkas yang dikecualikan dari pemindaian
exclude:
  - '**/node_modules/**'
  - '**/client/dist/**'
  - '**/client/build/**'
  - '**/server/data/**'           # Direktori SQLite lokal
  - '**/server/backups/**'        # Backup snapshot DB
  - '**/*.min.js'
  - '**/*.bundle.js'
  - '**/coverage/**'
  - '**/.git/**'

# Tingkat ketegasan aturan (error | warning | off)
rules:
  swallowed-exceptions: error     # Sangat dilarang menyembunyikan error tanpa penanganan
  hallucinated-imports: error     # Dilarang menggunakan impor fiktif
  hidden-fallbacks: error         # Dilarang menyembunyikan kegagalan krusial
  narrative-comments: warning     # Peringatan untuk komentar bergaya obrolan AI
  duplicate-helpers: warning      # Peringatan jika membuat utility serupa berulang kali
  todo-stubs: warning             # Peringatan untuk stub TODO yang belum selesai
  as-any: warning                 # Peringatan untuk penipuan tipe data
  monster-functions: warning      # Peringatan untuk fungsi terlalu panjang (>80 baris)
```

---

## 🚀 5. Integrasi GitHub Actions Workflow (`.github/workflows/aislop.yml`)

Otomatisasi ini akan aktif setiap kali ada **Pull Request** atau **Push** ke branch `main` atau `dev`. Jika skor kode di bawah ambang batas (80), pipeline GitHub Actions akan otomatis memberi tanda merah (gagal) dan mencegah merge kode kotor.

Berkas diletakkan di: `.github/workflows/aislop.yml`

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
      - name: 📥 Checkout Repositori
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Diperlukan untuk membandingkan git diff perubahan

      - name: ⚙️ Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: 🛡️ Jalankan AI Slop Quality Gate
        uses: scanaislop/aislop@v1
        with:
          fail-below: 80 # Batas minimal skor kualitas
        continue-on-error: false

      - name: 📊 Unggah Laporan Analisis (Opsional)
        if: always()
        run: |
          echo "AI Code Quality Gate selesai dievaluasi."
```

---

## 📋 6. Panduan Tindakan Tim Jika Quality Gate Gagal (Merah di GitHub)

Jika build PR atau commit Anda ditolak oleh `aislop`:

1. **Buka Log GitHub Actions**: Lihat daftar pelanggaran (*violations*) yang tertera pada langkah `Run aislop AI Code Quality Gate`.
2. **Jalankan Secara Lokal**:
   ```bash
   npx aislop@latest scan --changes --base origin/main
   ```
3. **Lakukan Remediasi Mandiri atau Instruksikan ke AI**:
   * *Jika ada Swallowed Exception*: Tambahkan `console.error(err)` atau lempar `throw new Error(...)` yang terstruktur.
   * *Jika ada Duplicate Helper*: Pindahkan fungsi tersebut ke `client/src/utils/` atau modul utilitas backend.
   * *Jika ada Narrative Comments*: Hapus komentar penjelasan bergaya cerita yang tidak perlu.
   * *Gunakan Auto-fix*: Jalankan `npx aislop@latest fix`.
4. **Komit & Push Ulang**: Setelah skor kembali di atas 80, pipeline akan menjadi hijau secara otomatis!

---

*Panduan ini dikurasi untuk memastikan PahamTeks tetap gesit dikembangkan bersama AI tanpa mengorbankan kualitas rekayasa perangkat lunak jangka panjang.*
