@echo off
title PahamTeks - Menjalankan Server & Client
echo ======================================================
echo  [PahamTeks] Menjalankan Server Backend & Client...
echo ======================================================
echo Backend GraphQL API : http://localhost:4000/graphql
echo Frontend Web App    : http://localhost:3000
echo.
echo Membuka jendela server backend dan client...
start "PahamTeks Backend (Port 4000)" cmd /k "npm --prefix server run dev"
start "PahamTeks Frontend (Port 3000)" cmd /k "npm --prefix client run dev"
echo.
echo [OK] Backend dan Frontend berhasil dinyalakan di jendela masing-masing!
echo Tekan sembarang tombol untuk menutup launcher ini...
timeout /t 5 >nul
exit
