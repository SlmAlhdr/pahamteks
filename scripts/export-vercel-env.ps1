$envFile = Join-Path $PSScriptRoot "..\server\.env"

if (-not (Test-Path $envFile)) {
    Write-Host "[ERROR] Berkas server/.env tidak ditemukan di $envFile" -ForegroundColor Red
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Salin baris-baris di bawah ini ke Vercel Dashboard:" -ForegroundColor Green
Write-Host " (Settings > Environment Variables)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$relevantKeys = @(
    "EMAIL_USER",
    "EMAIL_PASS",
    "JWT_SECRET",
    "ADMIN_EMAILS",
    "ADMIN_PASSWORD",
    "GEMINI_API_KEY_1",
    "NODE_ENV"
)

$hasNodeEnv = $false
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$') {
        $k = $matches[1]
        $v = $matches[2]
        if ($relevantKeys -contains $k) {
            if ($k -eq "NODE_ENV") { $hasNodeEnv = $true }
            Write-Output "$k=$v"
        }
    }
}

if (-not $hasNodeEnv) {
    Write-Output "NODE_ENV=production"
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Setelah disimpan di Vercel Dashboard, lakukan Redeploy!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
