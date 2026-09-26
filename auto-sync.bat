@echo off
title PahamTeks - Auto-Sync Commit & Push
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\auto-sync.ps1"
pause
