# scripts/auto-sync.ps1 - Background Auto Pull & Auto Push Daemon
param(
    [int]$IntervalSeconds = 30
)

$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  PahamTeks Auto-Sync Daemon (Pull & Push Otomatis)" -ForegroundColor Cyan
Write-Host "  Interval loop : Setiap $IntervalSeconds detik" -ForegroundColor Yellow
Write-Host "  Tekan Ctrl + C untuk keluar dari mode otomatis" -ForegroundColor DarkGray
Write-Host "======================================================" -ForegroundColor Cyan

while ($true) {
    # 1. Fetch senyap untuk memeriksa pembaruan remote
    git fetch origin main --quiet 2>$null
    
    $localCommit = git rev-parse HEAD 2>$null
    $remoteCommit = git rev-parse origin/main 2>$null
    
    # Jika remote ada commit baru, lakukan pull
    if ($localCommit -and $remoteCommit -and ($localCommit -ne $remoteCommit)) {
        $isBehind = git rev-list --count HEAD..origin/main 2>$null
        if ($isBehind -and ([int]$isBehind -gt 0)) {
            $now = Get-Date -Format "HH:mm:ss"
            Write-Host "[$now] [PULL] Ditemukan $isBehind commit baru di GitHub. Menarik..." -ForegroundColor Yellow
            git pull origin main --quiet
            Write-Host "[$now] [OK] Selesai pull dari GitHub." -ForegroundColor Green
        }
    }

    # 2. Cek apakah ada file lokal yang dimodifikasi
    $changes = git status --porcelain
    if ($changes) {
        # Pastikan tidak ada berkas .env rahasia (Zero Leak Policy)
        $hasEnv = $changes | Where-Object { $_ -match '\.env' -and $_ -notmatch '\.env\.example' }
        if ($hasEnv) {
            $now = Get-Date -Format "HH:mm:ss"
            Write-Host "[$now] [WARN] Peringatan: Ada file .env terdeteksi. Push dilewati demi keamanan." -ForegroundColor Red
        } else {
            $now = Get-Date -Format "HH:mm:ss"
            Write-Host "[$now] [PUSH] Perubahan lokal terdeteksi. Menyimpan & push ke GitHub..." -ForegroundColor Yellow
            git add .
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            git commit -m "auto-sync: perbarui otomatis $timestamp" --quiet
            git push origin main --quiet
            Write-Host "[$now] [OK] Selesai push ke origin/main!" -ForegroundColor Green
        }
    }

    Start-Sleep -Seconds $IntervalSeconds
}
