# Aturan & Standar Otomatisasi Proyek PahamTeks

## Otomatisasi Git Push (Wajib)
Setiap kali asisten AI menyelesaikan pekerjaan:
1. Penambahan fitur baru
2. Perbaikan bug antarmuka / backend
3. Pembaruan dokumentasi, konfigurasi, atau styling
4. Setiap file yang sudah di-update di proyek

**LANGKAH WAJIB SETIAP SELESAI TUGAS**:
- **Verifikasi Build**: Jalankan `npm --prefix client run build` dan pastikan sukses.
- **Zero Leak Check**: Pastikan berkas rahasia (`.env`, `.env.*`, `server/data/*.sqlite`) TIDAK pernah di-stage.
- **Git Add & Commit**: Stage file yang diperbarui dan buat commit dengan pesan deskriptif.
- **Git Push**: Langsung push ke GitHub (`git push origin main`) tanpa menunggu konfirmasi manual.

## Pedoman Adaptasi AI Agent
Asisten AI yang bekerja di repositori PahamTeks wajib mengadopsi standar arsitektur dan kebersihan kode berikut:
- **Konteks & Arsitektur Lengkap**: Baca [`docs/AGENT_ADAPTATION.md`](./docs/AGENT_ADAPTATION.md) dan [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
- **Standar Koding Human-Grade**: Dilarang keras membuat catch kosong (*swallowed exceptions*), selalu gunakan utilitas bersama di `client/src/utils/` (`speechUtils.js` dan `quizUtils.js`).
- **Verifikasi Build**: Setiap selesai mengubah kode, wajib memverifikasi build frontend (`npm --prefix client run build`).
- **Zero Leak Policy**: Dilarang keras men-stage atau membocorkan berkas `.env`, kredensial, atau database binary lokal (`*.sqlite`).
- **Dokumentasi Tim**: Folder `docs/` dipush ke repositori agar seluruh rekan tim dapat membaca panduan, arsitektur, dan roadmap. Folder `.aislop/` tetap disimpan secara lokal.
