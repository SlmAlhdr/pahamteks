# Pasang atau lepaskan auto-sync saat user Windows login.
param([switch]$Remove)

$ErrorActionPreference = 'Stop'
$TaskName = 'PahamTeks Auto-Sync'
$RepoRoot = Split-Path -Parent $PSScriptRoot
$WatcherPath = Join-Path $PSScriptRoot 'auto-sync.ps1'

if ($env:OS -ne 'Windows_NT') {
    throw 'Auto-start ini hanya tersedia pada Windows.'
}

if ($Remove) {
    $existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($existingTask) {
        if ($existingTask.State -eq 'Running') {
            Stop-ScheduledTask -TaskName $TaskName
        }
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "Task '$TaskName' dihapus."
    } else {
        Write-Host "Task '$TaskName' belum terpasang."
    }
    exit 0
}

if (-not (Test-Path -LiteralPath $WatcherPath -PathType Leaf)) {
    throw "Watcher tidak ditemukan: $WatcherPath"
}

$PowerShellPath = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
$CurrentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$Arguments = "-NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$WatcherPath`""
$Action = New-ScheduledTaskAction -Execute $PowerShellPath -Argument $Arguments -WorkingDirectory $RepoRoot
$Trigger = New-ScheduledTaskTrigger -AtLogOn -User $CurrentUser
$Principal = New-ScheduledTaskPrincipal -UserId $CurrentUser -LogonType Interactive -RunLevel Limited
$Settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit (New-TimeSpan -Seconds 0) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1)

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Principal $Principal `
    -Settings $Settings `
    -Description 'Pantau perubahan PahamTeks lalu build, commit, dan push ke origin/main.' `
    -Force | Out-Null

Start-ScheduledTask -TaskName $TaskName
Write-Host "Auto-sync terpasang dan dimulai untuk $CurrentUser."
Write-Host "Log lokal: $PSScriptRoot\auto-sync.log"
Write-Host "Untuk menghapus: npm.cmd run auto-sync:uninstall"
