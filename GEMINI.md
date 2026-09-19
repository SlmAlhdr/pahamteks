# Aturan & Standar Otomatisasi Proyek PahamTeks

## Otomatisasi Git Push
Setiap kali asisten AI menyelesaikan:
1. Penambahan fitur baru
2. Perbaikan bug antarmuka / backend
3. Modifikasi styling atau kode

**WAJIB SECARA OTOMATIS**:
- Memverifikasi build frontend (`npm --prefix client run build`).
- Melakukan staging berkas terkait (`git add`).
- Membuat commit dengan pesan deskriptif bahasa Indonesia atau Inggris yang jelas (`git commit -m "..."`).
- Langsung melakukan push ke GitHub (`git push origin main`) tanpa perlu menunggu konfirmasi atau instruksi terpisah dari pengguna.
