# Debounced local change watcher with guarded auto-commit/push.
param(
    [int]$QuietSeconds = 90,
    [int]$PollSeconds = 5
)

$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

if ($QuietSeconds -lt 15 -or $PollSeconds -lt 1) {
    throw 'QuietSeconds minimal 15 dan PollSeconds minimal 1.'
}

function Get-WorktreeChanges {
    return @(git status --porcelain --untracked-files=all)
}

function Get-StatusPaths([string[]]$StatusLines) {
    foreach ($line in $StatusLines) {
        if ($line.Length -gt 3) {
            $path = $line.Substring(3).Trim('"')
            if ($path -match ' -> ') { $path = ($path -split ' -> ')[-1].Trim('"') }
            $path.Replace('\', '/')
        }
    }
}

function Test-ForbiddenPath([string]$Path) {
    if ($Path -match '(^|/)(\.env(\..*)?|[^/]*\.env(\..*)?)$' -and $Path -notmatch '(^|/)\.env\.example$') { return $true }
    if ($Path -match '\.(sqlite|sqlite3|db)(-journal)?$') { return $true }
    if ($Path -match '(^|/)server/backups/.*\.sql$') { return $true }
    if ($Path -match '(^|/)(credentials|service-account)[^/]*\.json$') { return $true }
    return $false
}

function Invoke-SafePush {
    # Validasi branch, file sensitif, dan build sebelum membuat commit.
    $branch = (git branch --show-current).Trim()
    if ($branch -ne 'main') {
        Write-Host "[BLOCKED] Branch aktif '$branch'; target otomatis adalah main. Tidak ada commit/push." -ForegroundColor Red
        return
    }

    $changes = Get-WorktreeChanges
    $blocked = @(Get-StatusPaths $changes | Where-Object { Test-ForbiddenPath $_ })
    if ($blocked.Count -gt 0) {
        Write-Host '[BLOCKED] Rahasia atau database lokal terdeteksi; tidak ada file yang di-stage:' -ForegroundColor Red
        $blocked | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
        return
    }
    if ($changes.Count -eq 0) { return }

    Write-Host '[CHECK] Menjalankan build frontend...' -ForegroundColor Yellow
    npm.cmd --prefix client run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host '[BLOCKED] Build gagal. Perubahan tetap lokal dan belum di-commit.' -ForegroundColor Red
        return
    }

    git add -A
    if ($LASTEXITCODE -ne 0) {
        Write-Host '[BLOCKED] Gagal men-stage perubahan.' -ForegroundColor Red
        return
    }

    $stagedPaths = @(git diff --cached --name-only)
    $stagedBlocked = @($stagedPaths | Where-Object { Test-ForbiddenPath $_ })
    if ($stagedBlocked.Count -gt 0) {
        Write-Host '[BLOCKED] Pemeriksaan staging menemukan file terlarang; commit dibatalkan dan staging dibiarkan apa adanya.' -ForegroundColor Red
        $stagedBlocked | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
        return
    }

    git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) { return }

    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git commit -m "chore: auto-sync local updates $timestamp"
    if ($LASTEXITCODE -ne 0) {
        Write-Host '[BLOCKED] Commit gagal. Periksa status Git.' -ForegroundColor Red
        return
    }

    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host '[BLOCKED] Commit tersimpan lokal, tetapi push gagal. Periksa koneksi atau perubahan remote.' -ForegroundColor Red
        return
    }
    Write-Host '[OK] Perubahan berhasil di-commit dan di-push ke origin/main.' -ForegroundColor Green
}

Write-Host 'PahamTeks Auto-Sync aktif.' -ForegroundColor Cyan
Write-Host "Commit/push setelah $QuietSeconds detik tanpa edit; polling tiap $PollSeconds detik." -ForegroundColor Yellow
Write-Host 'Tidak melakukan auto-pull. Tekan Ctrl+C untuk berhenti.' -ForegroundColor DarkGray

while ($true) {
    # Pantau perubahan dan mulai sinkronisasi setelah jeda edit berakhir.
    $changes = Get-WorktreeChanges
    if ($changes.Count -eq 0) {
        Start-Sleep -Seconds $PollSeconds
        continue
    }

    $snapshot = $changes -join "`n"
    $lastChangeAt = Get-Date
    Write-Host "[WATCH] Perubahan terdeteksi; menunggu $QuietSeconds detik tanpa edit..." -ForegroundColor Yellow

    while (((Get-Date) - $lastChangeAt).TotalSeconds -lt $QuietSeconds) {
        Start-Sleep -Seconds $PollSeconds
        $current = Get-WorktreeChanges
        if ($current.Count -eq 0) { break }
        $currentSnapshot = $current -join "`n"
        if ($currentSnapshot -ne $snapshot) {
            $snapshot = $currentSnapshot
            $lastChangeAt = Get-Date
            Write-Host '[WATCH] Edit baru; jeda dihitung ulang.' -ForegroundColor DarkYellow
        }
    }

    $stable = Get-WorktreeChanges
    if ($stable.Count -gt 0 -and (($stable -join "`n") -eq $snapshot)) {
        Invoke-SafePush
    }
}
