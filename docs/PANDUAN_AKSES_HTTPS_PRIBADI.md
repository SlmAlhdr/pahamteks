# Panduan Cepat: Akses Web HTTPS Pribadi

Gunakan panduan ini untuk membuka akses web **PahamTeks** ke HP / internet saat Vercel sedang nonaktif.

---

## ⚡ 3 Langkah Menjalankan Web

Buka 3 jendela terminal di folder root (`pahamteks`), lalu ketik perintah berikut di masing-masing terminal:

### 1. Terminal 1 — Backend Server (Port 4000)
```powershell
npm --prefix server run dev
```
> Menjalankan GraphQL API, Gemini AI round-robin, dan database failover SQLite.

### 2. Terminal 2 — Frontend React (Port 3000)
```powershell
npm --prefix client run dev
```
> Menjalankan antarmuka web. Langsung bisa diakses dari laptop di: `http://localhost:3000`

### 3. Terminal 3 — Terowongan HTTPS Publik (Cloudflare)
```powershell
.\cloudflared.exe tunnel --url http://localhost:3000
```
> Tunggu 5 detik sampai muncul link HTTPS (contoh: `https://xxxx.trycloudflare.com`).  
> **Salin link tersebut ke HP atau kirim ke teman.** Gratis, aman (SSL resmi), dan tanpa perlu login.

---

## 📱 Akses Alternatif: Satu Wi-Fi (Tanpa Internet)

Jika HP dan laptop terhubung ke Wi-Fi yang sama (tidak perlu jalankan Terminal 3):
1. Pastikan Terminal 1 & 2 menyala.
2. Cek IP laptop kamu:
   ```powershell
   ipconfig
   ```
3. Buka di browser HP: `http://<IP_LAPTOP>:3000` (contoh: `http://10.50.124.137:3000`).

---

## 🛑 Cara Mematikan Layanan

Tekan **`Ctrl + C`** pada masing-masing jendela terminal (Terminal 3, 2, dan 1).

---

## 🛠️ Tips Singkat

* **Jika file `cloudflared.exe` belum ada:**
  ```powershell
  curl.exe -L -o cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
  ```
* **Jika port masih tertahan/bentrok:**
  ```powershell
  taskkill /F /IM node.exe
  ```
