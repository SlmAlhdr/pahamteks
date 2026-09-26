# Panduan Akses Web HTTPS Pribadi — PahamTeks

Halo rekan tim! Dokumen ini menjelaskan cara membuka akses web **PahamTeks** dari laptop kamu ke perangkat lain (HP, tablet, atau laptop teman) melalui internet. Panduan ini ditulis selangkah demi selangkah agar siapa pun—bahkan yang belum pernah mengetik perintah di terminal—bisa mengikutinya tanpa bingung.

---

## 🤔 Kenapa Kita Perlu Ini?

Saat kamu menjalankan PahamTeks di laptop, aplikasinya hanya bisa diakses dari laptop itu sendiri (`http://localhost:3000`). Artinya, HP kamu, teman satu tim, atau siapa pun di luar laptop kamu **tidak bisa membukanya**.

Panduan ini memberi kamu **3 cara** untuk mengatasi hal itu:

| Cara | Butuh Internet? | Siapa yang Bisa Akses? | Cocok Untuk |
| :--- | :---: | :--- | :--- |
| **A. Cloudflare Tunnel** | Ya | Siapa saja di dunia (punya link) | Demo ke dosen, uji coba di HP dari mana saja |
| **B. Satu Jaringan Wi-Fi** | Tidak | HP/laptop yang terhubung Wi-Fi sama | Testing cepat di HP sendiri di rumah/kampus |
| **C. Deployment publik permanen** | — | Tidak tersedia sementara | Aktifkan kembali deployment saat layanan publik siap |

---

## 📋 Prasyarat (Cukup Sekali Saja)

Sebelum memulai, pastikan kamu sudah punya 3 hal ini di laptop:

### 1. Node.js (Versi 20 ke atas)
Cek apakah sudah terpasang dengan mengetik ini di terminal (PowerShell atau CMD):
```powershell
node --version
```
Jika muncul angka seperti `v26.10.0`, berarti sudah terpasang. Jika muncul pesan error, unduh Node.js dari [nodejs.org](https://nodejs.org/) lalu install seperti biasa.

### 2. Dependensi Proyek (npm install)
Jika kamu baru pertama kali clone proyek ini, jalankan setup otomatis:
```powershell
setup.bat
```
Atau secara manual:
```powershell
npm install
```

### 3. File Konfigurasi `server/.env`
Pastikan file `server/.env` sudah ada dan berisi minimal satu kunci API Gemini:
```
GEMINI_API_KEY=kunci_api_gemini_kamu_di_sini
```
Jika belum ada, salin dari template:
```powershell
copy server\.env.example server\.env
```
Lalu buka `server/.env` dengan Notepad dan isi `GEMINI_API_KEY` dengan kunci dari [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 🚀 Cara A: Cloudflare Tunnel (Akses dari Mana Saja via Internet)

Ini adalah cara paling fleksibel. Kamu akan mendapatkan link HTTPS yang bisa dibuka dari HP, laptop teman, atau perangkat apa pun yang punya internet. Gratis, aman, dan tanpa perlu mendaftar akun Cloudflare.

### Langkah 1 — Unduh Cloudflare Tunnel (Sekali Saja)

Jika file `cloudflared.exe` belum ada di folder proyek, unduh dengan perintah ini:
```powershell
curl.exe -L -o cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
```
Tunggu beberapa detik sampai unduhan selesai. File `cloudflared.exe` akan muncul di folder `pahamteks`.

> **Catatan**: File `.exe` ini tidak akan ikut ter-push ke GitHub (sudah diatur di `.gitignore`), jadi aman.

### Langkah 2 — Nyalakan 3 Terminal

Kamu perlu membuka **3 jendela terminal** secara bersamaan. Di Windows, caranya:
1. Buka File Explorer, navigasi ke folder `pahamteks`.
2. Klik kanan di area kosong > pilih **"Open in Terminal"** (atau ketik `powershell` di address bar lalu tekan Enter).
3. Ulangi langkah 2 sebanyak 2 kali lagi sehingga kamu punya **3 jendela terminal** yang terbuka.

Atau jika kamu menggunakan VS Code: klik menu **Terminal > New Terminal** sebanyak 3 kali (gunakan tombol `+` di panel terminal).

### Langkah 3 — Jalankan Perintah di Masing-Masing Terminal

#### Terminal 1 — Backend Server
Perhatikan posisi folder prompt di terminal kamu sebelum mengetik:
* **Jika posisi prompt di folder utama (`PS C:\...\pahamteks>`):**
  ```powershell
  npm --prefix server run dev
  ```
* **Jika posisi prompt sudah di dalam folder server (`PS C:\...\pahamteks\server>`):**
  ```powershell
  npm run dev
  ```
  *(Jangan gunakan `--prefix server` jika sudah di dalam folder `server`, agar tidak mencari folder ganda `server\server`)*.

Tunggu sampai muncul pesan seperti:
```
🚀 PahamTeks Server ready at http://localhost:4000
```
Artinya server backend sudah menyala dan siap melayani data.

#### Terminal 2 — Frontend Web
Perhatikan posisi folder prompt di terminal kamu:
* **Jika posisi prompt di folder utama (`PS C:\...\pahamteks>`):**
  ```powershell
  npm --prefix client run dev
  ```
* **Jika posisi prompt sudah di dalam folder client (`PS C:\...\pahamteks\client>`):**
  ```powershell
  npm run dev
  ```

Tunggu sampai muncul pesan seperti:
```
  VITE v6.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```
Pada titik ini, kamu sudah bisa membuka `http://localhost:3000` di browser laptop dan melihat tampilan PahamTeks. Tapi ini baru bisa diakses dari laptop kamu sendiri.

#### Terminal 3 — Terowongan HTTPS Cloudflare
Pastikan terminal berada di folder utama `pahamteks>` (tempat file `cloudflared.exe` berada), lalu jalankan:
```powershell
.\cloudflared.exe tunnel --url http://localhost:3000
```
Tunggu sekitar 5-10 detik. Di antara teks yang muncul, cari baris yang mengandung link seperti:
```
https://random-kata-kata.trycloudflare.com
```
**Itulah link publik HTTPS kamu.** Salin link tersebut dan kirimkan ke HP kamu (lewat WhatsApp, Telegram, atau cara apa pun).

### Langkah 4 — Buka di HP atau Perangkat Lain
1. Buka browser di HP kamu (Chrome, Safari, atau apa saja).
2. Tempel (*paste*) link `https://random-kata-kata.trycloudflare.com` di kolom alamat (*address bar*).
3. Tekan Enter. Tampilan PahamTeks akan muncul persis seperti di laptop kamu dengan koneksi HTTPS yang aman dan gembok hijau!

### Langkah 5 — Mengakses Dasbor Admin Visual via HTTPS (Opsional)
Jika kamu ingin memantau kesehatan server, rotasi API Gemini, atau log aktivitas pengguna dari HP / tablet melalui internet:
1. Klik tab **👑 Admin** di Navbar atas (atau tambahkan `/admin` di belakang link HTTPS kamu: `https://<link-kamu>.trycloudflare.com/admin`).
2. Masukkan email admin yang terdaftar di `ADMIN_EMAILS`, password akun, dan password admin bersama yang ada di `server/.env`.
3. Kamu bisa melihat 4 kartu metrik server, status slot 1–9 kunci Gemini, dan tabel log aktivitas pengguna secara realtime langsung dari HP!

### Langkah 6 — Mematikan Layanan
Setelah selesai uji coba, matikan layanan dengan urutan terbalik:
1. **Terminal 3** (Cloudflare): Tekan `Ctrl + C`.
2. **Terminal 2** (Frontend): Tekan `Ctrl + C`.
3. **Terminal 1** (Backend): Tekan `Ctrl + C`.

> **Penting**: Setiap kali kamu menjalankan ulang `cloudflared.exe`, link HTTPS-nya akan berubah (acak). Ini normal karena kita memakai mode gratis tanpa akun.

---

## 📱 Cara B: Satu Jaringan Wi-Fi (Tanpa Internet)

Cara ini lebih sederhana dan tidak membutuhkan Cloudflare. Syaratnya: **HP dan laptop kamu harus terhubung ke jaringan Wi-Fi yang sama** (misalnya Wi-Fi rumah atau hotspot kampus).

### Langkah 1 — Nyalakan Backend & Frontend
Buka **2 terminal** dan jalankan:
```powershell
# Terminal 1
npm --prefix server run dev

# Terminal 2
npm --prefix client run dev
```

### Langkah 2 — Cari Alamat IP Laptop Kamu
Buka terminal baru (atau terminal ketiga) dan ketik:
```powershell
ipconfig
```
Cari bagian yang bertuliskan **"Wireless LAN adapter Wi-Fi"** (atau "Ethernet adapter" jika pakai kabel). Perhatikan baris **IPv4 Address**, contohnya:
```
IPv4 Address. . . . . . . . . . . : 192.168.1.15
```
Catat angka tersebut (dalam contoh ini: `192.168.1.15`).

### Langkah 3 — Buka di Browser HP
Buka browser HP, lalu ketik di kolom alamat:
```
http://192.168.1.15:3000
```
Ganti `192.168.1.15` dengan angka IP laptop kamu yang didapat dari langkah 2.

> **Catatan**: Cara ini hanya berlaku selama HP dan laptop berada di jaringan Wi-Fi yang sama. Jika keluar dari jangkauan Wi-Fi, akses akan terputus.

---

## 🌐 Deployment Permanen Sementara Nonaktif

PahamTeks saat ini tidak memakai endpoint Vercel. Gunakan server lokal untuk pengembangan. Untuk demo sementara dari internet, nyalakan Cloudflare Tunnel sesuai Cara A; URL tunnel hanya aktif selama prosesnya berjalan.

---

## 🔧 Panduan Mengatasi Masalah Umum

### Masalah 1: `cloudflared.exe` tidak ditemukan
**Pesan error**: `The term '.\cloudflared.exe' is not recognized...`

**Solusi**: Unduh ulang file-nya:
```powershell
curl.exe -L -o cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
```

### Masalah 2: Port 3000 atau 4000 sudah dipakai proses lain
**Pesan error**: `EADDRINUSE: address already in use :::3000`

**Solusi**: Matikan semua proses Node.js yang tersisa dari sesi sebelumnya:
```powershell
taskkill /F /IM node.exe
```
Lalu jalankan ulang Terminal 1 dan Terminal 2.

### Masalah 3: HP tidak bisa membuka link Cloudflare
**Kemungkinan penyebab**:
* Laptop kamu mematikan terminal Cloudflare (Terminal 3) sebelum HP selesai mengakses.
* Koneksi internet laptop kamu terputus.
* VPN di laptop sedang aktif (coba matikan VPN sementara).

**Solusi**: Pastikan ketiga terminal (1, 2, 3) masih menyala selama kamu ingin HP bisa mengakses link tersebut.

### Masalah 4: Halaman muncul tapi data kuis/kamus kosong
**Penyebab**: Terminal 1 (Backend Server) belum dinyalakan, atau file `server/.env` belum diisi kunci `GEMINI_API_KEY`.

**Solusi**: Pastikan Terminal 1 sudah menyala dan menampilkan pesan `Server ready at http://localhost:4000`. Periksa juga isi file `server/.env`.

### Masalah 5: HP di Wi-Fi yang sama tapi tidak bisa akses `http://<IP>:3000`
**Kemungkinan penyebab**: Windows Firewall memblokir koneksi masuk di port 3000.

**Solusi cepat**: Saat Windows menampilkan dialog "Windows Security Alert" atau "Allow access", klik **"Allow access"**. Jika dialog tersebut tidak muncul lagi, buka Windows Defender Firewall secara manual:
1. Buka **Start Menu** > ketik **"Windows Defender Firewall"** > Enter.
2. Klik **"Allow an app or feature through Windows Defender Firewall"**.
3. Klik **"Change settings"** > **"Allow another app..."**.
4. Cari dan tambahkan `node.exe` dari folder instalasi Node.js kamu.

### Masalah 6: Error `ENOENT: no such file or directory, open '...\server\server\package.json'`
**Penyebab**: Perintah `npm --prefix server run dev` dijalankan ketika terminal kamu **sudah berada di dalam folder `server`** (`PS C:\...\pahamteks\server>`). Akibatnya npm mencari folder `server` di dalam `server`.

**Solusi**:
* Jika terminal kamu bertuliskan `...\pahamteks\server>`: cukup ketik `npm run dev` (tanpa `--prefix server`).
* Jika ingin memakai `--prefix server`: ketik `cd ..` terlebih dahulu untuk kembali ke folder utama `pahamteks>`.

### Masalah 7: Layar Browser Menampilkan `Blocked request. This host ("...trycloudflare.com") is not allowed.`
**Penyebab**: Vite versi 6 memiliki fitur keamanan validasi domain (*host checking*). Secara default Vite memblokir akses jika nama domain yang diminta di browser berbeda dari `localhost` / `127.0.0.1`.

**Solusi**:
* Konfigurasi ini **sudah otomatis diatasi** di berkas [`client/vite.config.js`](file:///c:/Salim/Kerjaan/pahamteks/client/vite.config.js) dengan menambahkan `allowedHosts: true`.
* Jika jendela browser kamu masih menampilkan pesan tersebut, cukup **tekan tombol Refresh (F5)** di browser HP / laptop kamu. Vite otomatis memuat konfigurasi baru tanpa perlu me-restart tunnel.

### Masalah 8: Layar Browser Menampilkan `Error 1033: Cloudflare Tunnel error`
**Penyebab**:
1. Tautan yang kamu buka adalah tautan dari sesi Cloudflare sebelumnya yang sudah mati/hangus saat terminal `cloudflared` sempat dimatikan atau di-restart.
2. Fitur VPN bawaan browser (seperti tombol biru `[ VPN ]` di Opera GX) sedang aktif sehingga mengganggu resolusi rute Cloudflare Tunnel.
3. Terowongan baru saja dinyalakan dan membutuhkan waktu perambatan DNS (*DNS propagation*) sekitar 15–30 detik.

**Solusi**:
1. **Buka jendela terminal tempat `cloudflared` berjalan**, lalu salin tautan `https://....trycloudflare.com` yang **paling baru** yang tercantum di dalam kotak.
2. **Matikan VPN di browser kamu** (jika pakai Opera GX, klik tombol biru `[ VPN ]` di sebelah kiri address bar dan geser ke posisi OFF).
3. Tunggu sekitar 15 detik lalu tekan tombol **Refresh (F5)**.

---

## ⚡ Pintasan Cepat: Pakai `start-dev.bat`

Agar tidak perlu membuka 3 terminal satu per satu secara manual, kamu bisa langsung klik dua kali file **`start-dev.bat`** yang ada di folder proyek. File ini otomatis menyalakan Backend dan Frontend sekaligus dalam jendela terpisah dari folder utama.

Setelah itu, kamu tinggal membuka 1 terminal tambahan untuk Cloudflare:
```powershell
.\cloudflared.exe tunnel --url http://localhost:3000
```

---

## 📝 Ringkasan Perintah

| Keperluan | Jika di Folder Utama (`pahamteks>`) | Jika Sudah Masuk ke Folder Bersangkutan |
| :--- | :--- | :--- |
| **Nyalakan Backend (Port 4000)** | `npm --prefix server run dev` | `npm run dev` (di folder `server>`) |
| **Nyalakan Frontend (Port 3000)** | `npm --prefix client run dev` | `npm run dev` (di folder `client>`) |
| **Buka Tunnel HTTPS Publik** | `.\cloudflared.exe tunnel --url http://localhost:3000` | *(Jalankan dari folder utama)* |
| **Unduh Cloudflare Tunnel** | `curl.exe -L -o cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe` | *(Sekali saja di folder utama)* |
| **Akses Dasbor Admin via HTTPS** | Buka tab **👑 Admin** di web atau akses `https://<link>.trycloudflare.com/admin` | — |
| **Cek IP laptop (Wi-Fi lokal)** | `ipconfig` | `ipconfig` |
| **Matikan semua proses Node.js** | `Get-Process node \| Stop-Process -Force` *(atau `taskkill /F /IM node.exe`)* | — |
| **Matikan layanan** | Tekan `Ctrl + C` di jendela masing-masing | — |
