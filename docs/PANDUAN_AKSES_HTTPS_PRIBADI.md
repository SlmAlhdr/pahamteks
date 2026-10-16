# Hosting, Database, dan Pemantauan PahamTeks

Panduan operasional ini memakai **Vercel** untuk hosting aplikasi, **TiDB Cloud** untuk database persisten, dan **UptimeRobot** untuk memantau endpoint kesehatan publik. Cloudflare Tunnel hanya pilihan demo lokal sementara.

> Jangan menaruh nilai rahasia di dokumen, source code, atau Git. Isi kredensial langsung di Vercel Environment Variables atau `server/.env` lokal.

## 1. Deploy aplikasi ke Vercel

1. Push branch deployment ke GitHub dan impor repositori PahamTeks ke Vercel.
2. Pastikan Root Directory memakai root repo. Konfigurasi repo menjalankan `npm install --include=dev`, `npm --prefix client run build`, menghasilkan `client/dist`, dan me-rewrite `/graphql`, `/health`, serta `/healthz` ke fungsi `api/graphql.js`.
3. Sebelum deploy pertama, hubungkan TiDB Cloud (bagian 2) dan isi environment variables backend (bagian 3).
4. Pilih Production untuk domain produksi. Atur Preview terpisah bila diperlukan; jangan arahkan Preview ke database produksi tanpa persetujuan tim.
5. Deploy, lalu periksa halaman utama, `/healthz`, registrasi/login, dan penyimpanan progres. Push ke branch yang terhubung akan memicu deployment sesuai pengaturan proyek Vercel.

## 2. Hubungkan TiDB Cloud

Integrasi Vercel Marketplace adalah cara yang disarankan untuk TiDB Cloud Starter/Essential:

1. Buka [TiDB Cloud di Vercel Marketplace](https://vercel.com/marketplace/tidb-cloud) dan pilih **Add Integration**.
2. Pilih scope dan project Vercel PahamTeks, lalu lanjutkan ke TiDB Cloud.
3. Pilih organisasi/project TiDB, tipe koneksi **Cluster**, lalu pilih atau buat cluster dan database.
4. Pilih framework **General** agar integrasi menyediakan variabel `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD`, dan `TIDB_DATABASE`.
5. Kembali ke Vercel → project → **Settings → Environment Variables**. Pastikan kelima variabel tersebut tersedia untuk environment yang akan dideploy.
6. Redeploy setelah variabel tersedia. Backend saat ini menerima `TIDB_*` langsung dan mengaktifkan TLS ketika menggunakan `TIDB_HOST` (kecuali `DB_SSL=false`).

Nilai hostname, username, password, port, dan nama database dibuat oleh TiDB Cloud. Jangan menebak atau memakai nilai placeholder. Jika koneksi diatur manual, ambil detail di TiDB Cloud → resource/cluster → **Connect**. Backend mendukung `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`; `DB_SSL=true` dapat dipakai jika provider memerlukannya.

### Environment variables produksi

| Key | Sumber / aturan |
| --- | --- |
| `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD`, `TIDB_DATABASE` | Dibuat oleh integrasi TiDB untuk framework General; rahasiakan kredensial. Alternatif manual memakai nama `DB_*`. |
| `JWT_SECRET` | Secret acak privat minimal 32 karakter. Mengubahnya membatalkan sesi yang sudah terbit. |
| `GEMINI_API_KEY_1` | Kunci API Gemini untuk fitur AI; `_2`–`_9` opsional untuk rotasi. |
| `EMAIL_USER`, `EMAIL_PASS` | Kredensial SMTP/App Password untuk OTP, bila fitur akun email dipakai. |
| `ADMIN_EMAILS`, `ADMIN_PASSWORD` | Opsional, untuk admin; jangan pernah menaruh `ADMIN_PASSWORD` di frontend. |
| `ALLOWED_ORIGINS` | Opsional untuk origin tambahan; isi hanya origin frontend yang diperlukan. |

`server/.env` lokal tetap untuk development. Gunakan `DB_HOST=localhost` hanya bila memang MySQL lokal tersedia. File tersebut tidak disalin ke Vercel dan tidak boleh dipush.

## 3. Pasang UptimeRobot

`GET /healthz` adalah probe publik ringan dan saat ini mengembalikan HTTP 200 dengan `{ "status": "OK" }`. Endpoint ini memeriksa bahwa rute fungsi merespons; ia **tidak** membuktikan bahwa TiDB, Gemini, email, atau seluruh alur aplikasi berfungsi.

1. Buat HTTP(S) monitor di [UptimeRobot](https://uptimerobot.com/).
2. Isi URL dengan `https://<domain-produksi>/healthz` (contoh format: `https://pahamteks.vercel.app/healthz`; gunakan domain aktual project Anda).
3. Atur nama monitor, interval sesuai paket/kebutuhan, lokasi pemeriksaan, dan kontak notifikasi (email atau saluran tim yang sudah dikonfigurasi).
4. Simpan monitor lalu uji penerimaan notifikasi menggunakan fitur test UptimeRobot jika tersedia.
5. Tulis pemilik monitor dan langkah eskalasi di catatan operasional tim.

Jangan gunakan `/health` sebagai monitor publik: endpoint itu memerlukan Bearer token admin dan menampilkan telemetri internal. Untuk memeriksa fungsi penuh, lakukan smoke test berkala: masuk/daftar akun uji, simpan progres, dan periksa status database lewat dashboard admin atau log Vercel. Jangan menaruh token admin ke konfigurasi monitor bersama.

## 4. Pemeriksaan setelah deploy atau perubahan environment

- Pastikan deployment Production terbaru berstatus Ready di Vercel.
- Buka domain dan `/healthz`; pastikan respons HTTP sukses.
- Coba registrasi/login dengan akun uji, verifikasi email bila SMTP aktif, dan periksa bahwa data bertahan setelah membuka sesi baru.
- Periksa log fungsi Vercel untuk kegagalan koneksi. Pastikan variabel TiDB ada di environment yang benar dan lakukan redeploy jika nilainya baru diubah.
- Pastikan UptimeRobot mengirim notifikasi melalui uji terkontrol yang disetujui tim.
- Jangan menganggap status `/healthz` sebagai bukti database sehat; gunakan pemeriksaan alur aplikasi dan telemetri admin.

## 5. Demo lokal melalui HTTPS (opsional)

Untuk melihat kode lokal dari perangkat lain tanpa deploy, jalankan backend dan frontend di dua terminal, lalu buka tunnel ke Vite:

```powershell
npm --prefix server run dev
npm --prefix client run dev
```

Pada terminal ketiga, jalankan Cloudflare Tunnel jika `cloudflared.exe` tersedia:

```powershell
.\cloudflared.exe tunnel --url http://localhost:3000
```

Gunakan URL `trycloudflare.com` yang ditampilkan hanya selama sesi demo. Laptop dan server lokal harus tetap menyala; jangan gunakan tunnel sebagai hosting produksi atau membagikan data/akun nyata saat demo.

## 6. Troubleshooting ringkas

| Gejala | Periksa |
| --- | --- |
| `/healthz` 404 | Rewrite pada `vercel.json`, fungsi `api/graphql.js`, dan deployment aktif. |
| Database tidak tersambung | Environment `TIDB_*` atau `DB_*`, database/cluster aktif, kredensial, TLS, dan log fungsi Vercel. Jangan gunakan localhost di Vercel. |
| Akun tidak tersimpan | Pastikan koneksi TiDB berhasil; produksi tidak memakai SQLite sementara sebagai penyimpanan. |
| UptimeRobot menyatakan DOWN padahal browser normal | Periksa URL canonical HTTPS, status code, metode HEAD/GET, redirect, dan apakah WAF/rate limit memblokir monitor. |
| Halaman `/admin` 404 | Periksa SPA rewrite di `vercel.json`, lalu redeploy. |
| OTP tidak masuk | Periksa `EMAIL_USER`, `EMAIL_PASS`, log Vercel, dan folder spam. Jangan tempel kredensial SMTP ke tiket/chat. |

Referensi teknis: [Integrasi TiDB Cloud–Vercel](https://docs.pingcap.com/tidbcloud/integrate-tidbcloud-with-vercel/), [UptimeRobot Help Center](https://help.uptimerobot.com/en/articles/11358364-how-to-create-your-first-monitor-on-uptimerobot-quick-setup-guide), dan [`WORKFLOW.md`](./WORKFLOW.md).
