# scripts/sync.ps1 - Manual one-time safe sync (Pull & Push)
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " [PahamTeks] Sinkronisasi Git (Pull & Push)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Pull perubahan terbaru dari GitHub
Write-Host "`n[1/3] Menarik (Pull) update terbaru dari GitHub..." -ForegroundColor Yellow
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Gagal atau ada masalah saat pull dari origin/main." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "[OK] Berhasil menarik perubahan terbaru dari origin/main." -ForegroundColor Green

# 2. Cek apakah ada perubahan lokal
$changes = git status --porcelain
if (-not $changes) {
    Write-Host "`n[2/3] Tidak ada perubahan lokal baru yang perlu di-commit." -ForegroundColor Cyan
    Write-Host "[OK] Semua berkas sudah up-to-date dan tersinkronisasi!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Cyan
    exit 0
}

Write-Host "`n[2/3] Mendeteksi perubahan lokal berikut:" -ForegroundColor Yellow
$changes | ForEach-Object { Write-Host "   $_" -ForegroundColor DarkGray }

# 3. Validasi Zero Leak Policy (Pastikan tidak ada .env yang lolos)
$hasEnv = $changes | Where-Object { $_ -match '\.env' -and $_ -notmatch '\.env\.example' }
if ($hasEnv) {
    Write-Host "`n[ERROR] PERINGATAN ZERO LEAK: Terdeteksi berkas .env rahasia!" -ForegroundColor Red
    Write-Host "   Sinkronisasi dibatalkan agar file .env tidak bocor ke GitHub." -ForegroundColor Red
    exit 1
}

# 4. Commit & Push
Write-Host "`n[3/3] Melakukan add, commit & push ke GitHub..." -ForegroundColor Yellow
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "sync: pembaruan otomatis $timestamp"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Gagal melakukan commit." -ForegroundColor Red
    exit $LASTEXITCODE
}

git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Gagal melakukan push. Pastikan koneksi internet aktif." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "[OK] Berhasil push perubahan ke GitHub!" -ForegroundColor Green
Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host " Sukses! Seluruh perubahan telah sinkron." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
