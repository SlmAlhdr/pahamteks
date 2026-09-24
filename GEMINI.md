# Aturan & Standar Otomatisasi Proyek PahamTeks

## Pedoman Adaptasi AI Agent
Asisten AI yang bekerja di repositori PahamTeks wajib mengadopsi standar arsitektur dan kebersihan kode berikut:
- **Konteks & Arsitektur Lengkap**: Baca [`docs/AGENT_ADAPTATION.md`](./docs/AGENT_ADAPTATION.md) dan [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
- **Standar Koding Human-Grade**: Dilarang keras membuat catch kosong (*swallowed exceptions*), selalu gunakan utilitas bersama di `client/src/utils/` (`speechUtils.js` dan `quizUtils.js`).
- **Verifikasi Build**: Setiap selesai mengubah kode, wajib memverifikasi build frontend (`npm --prefix client run build`).
- **Zero Leak Policy**: Dilarang keras men-stage atau membocorkan berkas `.env`, kredensial, atau database binary lokal (`*.sqlite`).
- **Penyimpanan Lokal**: Folder `docs/` dan `.aislop/` disimpan secara lokal di mesin pengembang dan tidak dipush ke repositori publik GitHub.
