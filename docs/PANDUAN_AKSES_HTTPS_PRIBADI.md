# Panduan Akses Web HTTPS Pribadi — PahamTeks

Halo rekan tim! Dokumen ini menjelaskan cara membuka akses web **PahamTeks** agar bisa dibuka dari HP, tablet, maupun laptop lain melalui internet secara aman (HTTPS). Panduan ini ditulis selangkah demi selangkah agar siapa pun—bahkan yang belum pernah mengetik perintah di terminal—bisa mengikutinya dengan mudah.

---

## 🤔 Kenapa Kita Perlu Ini?

Saat kamu menjalankan PahamTeks di laptop secara lokal, aplikasinya hanya bisa diakses dari laptop itu sendiri (`http://localhost:3000`). Artinya, HP kamu, teman satu tim, atau penguji di luar laptop kamu tidak bisa membukanya.

Panduan ini menyediakan **3 cara** praktis sesuai kebutuhan kamu:

| Cara | Butuh Internet? | Perlu Laptop Nyala? | Cocok Untuk |
| :--- | :---: | :---: | :--- |
| **A. Deploy ke Vercel (Rekomendasi Utama)** | Ya | **Tidak** | Akses kapan saja dari HP/laptop tanpa menyalakan terminal/laptop. Link HTTPS permanen resmi. |
| **B. Cloudflare Tunnel** | Ya | Ya (3 Terminal) | Uji coba langsung kode lokal di laptop ke HP sebelum di-deploy. |
| **C. Satu Jaringan Wi-Fi** | Tidak | Ya (2 Terminal) | Testing cepat di HP sendiri dalam satu jaringan Wi-Fi lokal rumah/kampus. |

---

## 🌐 Cara A: Deploy ke Vercel (Akses Pribadi & Permanen Tanpa Perlu Laptop Menyala)

Ini adalah **cara paling praktis dan direkomendasikan**. Web PahamTeks akan di-hosting secara cloud di Vercel, sehingga kamu bisa membuka website dan login ke Dasbor Admin langsung dari HP kapan pun dan di mana pun, bahkan saat laptop kamu mati!

### Langkah 1 — Sambungkan Repositori GitHub ke Vercel
1. Buka [vercel.com](https://vercel.com) dan masuk menggunakan akun GitHub kamu.
2. Klik tombol **"Add New..."** > pilih **"Project"**.
3. Cari repositori **`pahamteks`** (atau nama repositori GitHub kamu), lalu klik tombol **"Import"**.

### Langkah 2 — Atur Environment Variables di Vercel Dashboard
Sebelum menekan Deploy, buka menu **"Environment Variables"** pada halaman setup Vercel dan tambahkan variabel-variabel penting berikut:

| Nama Variabel (*Key*) | Contoh Nilai (*Value*) | Keterangan |
| :--- | :--- | :--- |
| `GEMINI_API_KEY_1` | `AIzaSy...` | Kunci API Gemini dari Google AI Studio |
| `ADMIN_EMAILS` | `kamu@email.com,tim1@email.com,tim2@email.com` | **Daftar email admin/tim (pisahkan dengan koma)** yang memiliki hak akses administrator |
| `JWT_SECRET` | `string-acak-panjang-dan-aman-32-karakter` | Kunci rahasia enkripsi sesi login |
| `NODE_ENV` | `production` | Mode produksi |

> **Catatan**: Jika kamu punya database MySQL online (seperti TiDB, PlanetScale, atau Aiven), kamu juga bisa menambahkan `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`. Jika tidak diisi, backend otomatis menggunakan fallback SQLite aman di serverless.

### Langkah 3 — Klik Deploy
1. Klik tombol **"Deploy"**.
2. Tunggu 1–2 menit sementara Vercel menginstal dependensi dan membangun frontend serta serverless API.
3. Setelah selesai, Vercel akan memberikan link resmi kamu, misalnya:
   ```text
   https://pahamteks.vercel.app
   ```
   *(atau nama domain acak yang diberikan Vercel).*

### Langkah 4 — Membuka Web di HP / Perangkat Lain
* **Halaman Pengguna**: Buka `https://pahamteks.vercel.app` di browser HP kamu. Web akan langsung terbuka dengan aman (HTTPS dan gembok hijau).
* **Akses Khusus Admin**: Buka link langsung berakhiran `/admin`:
  ```text
  https://pahamteks.vercel.app/admin
  ```
  Masukkan email admin yang terdaftar di `ADMIN_EMAILS` dan kata sandi akun pribadi kamu. Kamu akan langsung dialihkan ke **Dasbor Administrator** visual!

### 👥 Cara Menambahkan Anggota Tim sebagai Admin (Sistem Opsi B: Email Allowlist)
Kamu tidak perlu membagikan password master server kepada siapa pun! Sistem login admin PahamTeks menggunakan sistem **Allowlist Email**:
1. **Tambahkan Email Tim**: Buka dashboard Vercel proyek kamu > **Settings** > **Environment Variables** > edit `ADMIN_EMAILS` dan tambahkan email anggota tim (pisahkan dengan koma), contoh:
   ```text
   owner@gmail.com,teman1@gmail.com,teman2@perusahaan.com
   ```
2. **Anggota Tim Mendaftar Akun**: Minta anggota tim membuka web PahamTeks dan mendaftarkan akun menggunakan alamat email mereka sendiri serta membuat kata sandi mereka sendiri.
3. **Login Sebagai Admin**: Anggota tim langsung login di halaman `/admin` (atau form login biasa) dengan email dan password pribadi mereka. Sistem secara otomatis mendeteksi email mereka di daftar `ADMIN_EMAILS` dan memberikan peran `ADMIN`.
4. **Mencabut Hak Akses**: Jika anggota tim sudah tidak bertugas, kamu cukup menghapus email mereka dari `ADMIN_EMAILS` di Vercel. Hak akses administrator mereka akan langsung dicabut seketika!

### Langkah 5 — Otomatisasi Pembaruan (Auto-Deploy)
Setiap kali kamu mengupdate kode di laptop lalu menjalankan perintah:
```powershell
git push origin main
```
Vercel akan secara otomatis mendeteksi perubahan tersebut dan memperbarui web kamu dalam hitungan detik tanpa perlu setup ulang!

---

## 🚀 Cara B: Cloudflare Tunnel (Uji Coba Langsung Server Laptop via Internet)

Gunakan cara ini jika kamu ingin menguji fitur baru yang sedang kamu ubah di laptop dan ingin langsung melihat efeknya di HP tanpa perlu melakukan commit / push ke Vercel terlebih dahulu.

### Langkah 1 — Unduh Cloudflare Tunnel (Cukup Sekali)
Jika file `cloudflared.exe` belum ada di folder utama `pahamteks`, unduh dengan perintah ini:
```powershell
curl.exe -L -o cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
```

### Langkah 2 — Nyalakan 3 Jendela Terminal
Buka 3 jendela terminal di folder `pahamteks`:

#### Terminal 1 — Backend Server
* **Jika prompt di folder utama (`PS C:\...\pahamteks>`):**
  ```powershell
  npm --prefix server run dev
  ```
* Tunggu sampai muncul: `🚀 [PahamTeks Backend] Berjalan di http://127.0.0.1:4000`

#### Terminal 2 — Frontend Web
* **Jika prompt di folder utama (`PS C:\...\pahamteks>`):**
  ```powershell
  npm --prefix client run dev
  ```
* Tunggu sampai muncul: `➜ Local: http://localhost:3000/`

#### Terminal 3 — Terowongan HTTPS Cloudflare
* Jalankan di folder utama `pahamteks>`:
  ```powershell
  .\cloudflared.exe tunnel --url http://localhost:3000
  ```
* Tunggu 5-10 detik sampai muncul link seperti:
  ```text
  https://random-kata-kata.trycloudflare.com
  ```

### Langkah 3 — Buka di HP
* Salin link `https://random-kata-kata.trycloudflare.com` ke browser HP kamu.
* Untuk akses admin: Buka `https://random-kata-kata.trycloudflare.com/admin`.

### Langkah 4 — Mematikan Layanan
Setelah selesai uji coba, tekan `Ctrl + C` di masing-masing jendela terminal (Terminal 3, Terminal 2, lalu Terminal 1).

---

## 📱 Cara C: Satu Jaringan Wi-Fi (Tanpa Internet)

Syaratnya: **HP dan laptop harus terhubung ke jaringan Wi-Fi yang sama** (misalnya Wi-Fi rumah atau hotspot).

### Langkah 1 — Nyalakan Backend & Frontend (2 Terminal)
```powershell
npm --prefix server run dev
npm --prefix client run dev
```

### Langkah 2 — Cari Alamat IP Laptop Kamu
Buka terminal baru dan ketik:
```powershell
ipconfig
```
Cari baris **IPv4 Address** pada Wi-Fi adapter kamu, misalnya: `192.168.1.15`.

### Langkah 3 — Buka di Browser HP
Ketik di browser HP:
```text
http://192.168.1.15:3000
```
*(Ganti `192.168.1.15` dengan alamat IP laptop kamu).*

---

## 🔧 Panduan Mengatasi Masalah Umum

### Masalah 1: Vercel Menampilkan Error 404 pada Rute `/admin`
**Penyebab**: Konfigurasi rewrite SPA di `vercel.json` belum menangani routing client.
**Solusi**: Pastikan berkas [`vercel.json`](file:///c:/Salim/Kerjaan/pahamteks/vercel.json) berisi rule `{"source": "/(.*)", "destination": "/index.html"}`. Ini sudah terpasang otomatis di repositori.

### Masalah 2: `cloudflared.exe` tidak ditemukan
**Solusi**: Unduh ulang file binary:
```powershell
curl.exe -L -o cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
```

### Masalah 3: Port 3000 atau 4000 sudah dipakai proses lain
**Solusi**: Matikan proses Node.js yang tertinggal di background:
```powershell
Get-Process node | Stop-Process -Force
```
*(Atau `taskkill /F /IM node.exe`)*.

### Masalah 4: Layar Browser Menampilkan `Blocked request. This host is not allowed.`
**Solusi**: Fitur keamanan Vite 6 sudah disesuaikan di `client/vite.config.js` dengan `allowedHosts: true`. Cukup tekan **Refresh (F5)** pada browser HP kamu.

---

## 📝 Ringkasan Perintah Penting

| Keperluan | Perintah PowerShell |
| :--- | :--- |
| **Deploy Otomatis ke Vercel** | `git push origin main` *(setelah `git add` & `git commit`)* |
| **Nyalakan Backend Lokal (Port 4000)** | `npm --prefix server run dev` |
| **Nyalakan Frontend Lokal (Port 3000)** | `npm --prefix client run dev` |
| **Buka Tunnel HTTPS Cloudflare** | `.\cloudflared.exe tunnel --url http://localhost:3000` |
| **Verifikasi Build Frontend** | `npm --prefix client run build` |
| **Matikan Semua Proses Node.js Lokal** | `Get-Process node \| Stop-Process -Force` |
