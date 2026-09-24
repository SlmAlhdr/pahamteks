@echo off
title PahamTeks - Auto-Sync Daemon (Pull & Push Otomatis)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\auto-sync.ps1"
pause
