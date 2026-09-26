# Pantau perubahan repo, tunggu sampai edit tenang, lalu build, commit, dan push.
param(
    [int]$QuietSeconds = 90,
    [int]$PollSeconds = 5,
    [int]$PushRetrySeconds = 60
)

$RepoRoot = Split-Path -Parent $PSScriptRoot
$LogPath = Join-Path $PSScriptRoot 'auto-sync.log'
Set-Location $RepoRoot

if ($QuietSeconds -lt 15 -or $PollSeconds -lt 1 -or $PushRetrySeconds -lt 15) {
    throw 'QuietSeconds minimal 15, PollSeconds minimal 1, dan PushRetrySeconds minimal 15.'
}

$script:LastPushFailureAt = [datetime]::MinValue

function Write-SyncLog([string]$Message, [ConsoleColor]$Color = [ConsoleColor]::Gray) {
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    Write-Host $line -ForegroundColor $Color

    try {
        if ((Test-Path -LiteralPath $LogPath) -and (Get-Item -LiteralPath $LogPath).Length -gt 1MB) {
            Set-Content -LiteralPath $LogPath -Value "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Log dirotasi setelah melewati 1 MB."
        }
        Add-Content -LiteralPath $LogPath -Value $line
    } catch {
        Write-Warning "Gagal menulis log auto-sync: $($_.Exception.Message)"
    }
}

function Get-WorktreeChanges {
    $lines = @(git status --porcelain=v1 --untracked-files=all 2>$null)
    if ($LASTEXITCODE -ne 0) {
        throw 'Git status gagal. Pastikan direktori ini merupakan repository Git yang valid.'
    }
    return $lines
}

function Get-StatusPaths([string[]]$StatusLines) {
    foreach ($line in $StatusLines) {
        if ($line.Length -gt 3) {
            $path = $line.Substring(3).Trim().Trim('"')
            if ($path -match ' -> ') { $path = ($path -split ' -> ')[-1].Trim().Trim('"') }
            $path.Replace('\', '/')
        }
    }
}

# Sertakan ukuran dan waktu simpan agar edit berulang pada file yang sama mengulang jeda.
function Get-ChangeSnapshot([string[]]$StatusLines) {
    $fileStates = foreach ($relativePath in (Get-StatusPaths $StatusLines)) {
        $fullPath = Join-Path $RepoRoot ($relativePath.Replace('/', '\'))
        $item = Get-Item -LiteralPath $fullPath -Force -ErrorAction SilentlyContinue
        if ($item -and -not $item.PSIsContainer) {
            "$relativePath|$($item.Length)|$($item.LastWriteTimeUtc.Ticks)"
        } else {
            "$relativePath|deleted-or-unavailable"
        }
    }

    return (@($StatusLines) + @($fileStates)) -join "`n"
}

function Test-ForbiddenPath([string]$Path) {
    if ($Path -match '(^|/)(\.env(\..*)?|[^/]*\.env(\..*)?)$' -and $Path -notmatch '(^|/)\.env\.example$') { return $true }
    if ($Path -match '\.(sqlite|sqlite3|db)(-(journal|wal|shm))?$') { return $true }
    if ($Path -match '(^|/)server/backups/.*\.(sql|dump|bak)$') { return $true }
    if ($Path -match '(^|/)(credentials|service-account|id_rsa|id_ed25519)[^/]*\.(json|pem|key)?$') { return $true }
    return $false
}

function Test-MainBranch {
    $branch = (git branch --show-current).Trim()
    if ($LASTEXITCODE -ne 0 -or $branch -ne 'main') {
        Write-SyncLog "BLOCKED: branch aktif '$branch'; auto-push hanya diizinkan pada main." Red
        return $false
    }

    foreach ($gitState in @('MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply')) {
        if (Test-Path -LiteralPath (Join-Path $RepoRoot ".git/$gitState")) {
            Write-SyncLog "BLOCKED: operasi Git '$gitState' sedang berlangsung." Red
            return $false
        }
    }
    return $true
}

function Invoke-FrontendBuild {
    Write-SyncLog 'CHECK: menjalankan build frontend.' Yellow
    npm.cmd --prefix client run build
    if ($LASTEXITCODE -ne 0) {
        Write-SyncLog 'BLOCKED: build gagal. Perubahan tetap lokal dan belum di-commit.' Red
        return $false
    }
    return $true
}

function Invoke-PendingPush {
    if (-not (Test-MainBranch)) { return }
    if (((Get-Date) - $script:LastPushFailureAt).TotalSeconds -lt $PushRetrySeconds) { return }

    $ahead = git rev-list --count origin/main..HEAD 2>$null
    if ($LASTEXITCODE -ne 0 -or [int]$ahead -le 0) { return }

    git fetch --quiet origin main
    if ($LASTEXITCODE -ne 0) {
        $script:LastPushFailureAt = Get-Date
        Write-SyncLog 'BLOCKED: gagal mengambil status GitHub; commit lokal akan dicoba lagi nanti.' Red
        return
    }

    git merge-base --is-ancestor origin/main HEAD
    if ($LASTEXITCODE -ne 0) {
        $script:LastPushFailureAt = Get-Date
        Write-SyncLog 'BLOCKED: origin/main memiliki perubahan yang belum ada di lokal. Selesaikan sinkronisasi manual; auto-sync tidak melakukan pull/rebase.' Red
        return
    }

    $ahead = git rev-list --count origin/main..HEAD
    if ($LASTEXITCODE -ne 0 -or [int]$ahead -le 0) { return }

    $pendingPaths = @(git diff --name-only origin/main..HEAD)
    $blocked = @($pendingPaths | ForEach-Object { $_.Replace('\', '/') } | Where-Object { Test-ForbiddenPath $_ })
    if ($blocked.Count -gt 0) {
        Write-SyncLog 'BLOCKED: commit lokal berisi file rahasia/database; tidak di-push:' Red
        $blocked | ForEach-Object { Write-SyncLog "  $_" Red }
        return
    }

    if (-not (Invoke-FrontendBuild)) { return }

    git push origin main
    if ($LASTEXITCODE -ne 0) {
        $script:LastPushFailureAt = Get-Date
        Write-SyncLog 'BLOCKED: push gagal; auto-sync akan mencoba ulang setelah jeda.' Red
        return
    }

    $script:LastPushFailureAt = [datetime]::MinValue
    Write-SyncLog 'OK: commit tertunda berhasil di-push ke origin/main.' Green
}

function Invoke-SafePush {
    if (-not (Test-MainBranch)) { return }

    $changes = Get-WorktreeChanges
    $blocked = @(Get-StatusPaths $changes | Where-Object { Test-ForbiddenPath $_ })
    if ($blocked.Count -gt 0) {
        Write-SyncLog 'BLOCKED: file rahasia/database terdeteksi; tidak ada file yang di-stage:' Red
        $blocked | ForEach-Object { Write-SyncLog "  $_" Red }
        return
    }
    if ($changes.Count -eq 0) { return }

    if (-not (Invoke-FrontendBuild)) { return }

    git add -A
    if ($LASTEXITCODE -ne 0) {
        Write-SyncLog 'BLOCKED: gagal men-stage perubahan.' Red
        return
    }

    $stagedPaths = @(git diff --cached --name-only)
    $stagedBlocked = @($stagedPaths | ForEach-Object { $_.Replace('\', '/') } | Where-Object { Test-ForbiddenPath $_ })
    if ($stagedBlocked.Count -gt 0) {
        git restore --staged -- $stagedBlocked
        Write-SyncLog 'BLOCKED: pemeriksaan staging menemukan file terlarang; file tersebut dikeluarkan dari staging.' Red
        $stagedBlocked | ForEach-Object { Write-SyncLog "  $_" Red }
        return
    }

    git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) { return }

    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git commit -m "chore: auto-sync local updates $timestamp"
    if ($LASTEXITCODE -ne 0) {
        Write-SyncLog 'BLOCKED: commit gagal. Periksa status Git.' Red
        return
    }

    git push origin main
    if ($LASTEXITCODE -ne 0) {
        $script:LastPushFailureAt = Get-Date
        Write-SyncLog 'BLOCKED: commit tersimpan lokal, tetapi push gagal; akan dicoba ulang setelah jeda.' Red
        return
    }

    $script:LastPushFailureAt = [datetime]::MinValue
    Write-SyncLog 'OK: perubahan berhasil di-commit dan di-push ke origin/main.' Green
}

Write-SyncLog "WATCH: auto-sync aktif; jeda edit $QuietSeconds detik, polling $PollSeconds detik." Cyan
Write-SyncLog 'INFO: tidak melakukan auto-pull. Tekan Ctrl+C untuk berhenti.' DarkGray

while ($true) {
    $changes = Get-WorktreeChanges
    if ($changes.Count -eq 0) {
        Invoke-PendingPush
        Start-Sleep -Seconds $PollSeconds
        continue
    }

    $snapshot = Get-ChangeSnapshot $changes
    $lastChangeAt = Get-Date
    Write-SyncLog "WATCH: perubahan terdeteksi; menunggu $QuietSeconds detik tanpa edit." Yellow

    while (((Get-Date) - $lastChangeAt).TotalSeconds -lt $QuietSeconds) {
        Start-Sleep -Seconds $PollSeconds
        $current = Get-WorktreeChanges
        if ($current.Count -eq 0) { break }

        $currentSnapshot = Get-ChangeSnapshot $current
        if ($currentSnapshot -ne $snapshot) {
            $snapshot = $currentSnapshot
            $lastChangeAt = Get-Date
            Write-SyncLog 'WATCH: perubahan baru terdeteksi; jeda dihitung ulang.' DarkYellow
        }
    }

    $stable = Get-WorktreeChanges
    if ($stable.Count -gt 0 -and (Get-ChangeSnapshot $stable) -eq $snapshot) {
        Invoke-SafePush
    }
}
