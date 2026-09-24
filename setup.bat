@echo off
title PahamTeks - Setup Awal Proyek
echo ======================================================
echo  [PahamTeks] Setup Dependensi & Lingkungan Awal Tim
echo ======================================================
echo.

if not exist "server\.env" (
    echo [1/3] Menyiapkan server/.env dari template server/.env.example...
    copy "server\.env.example" "server\.env" >nul
    echo [OK] Berkas server/.env berhasil dibuat. Silakan isi GEMINI_API_KEY Anda.
) else (
    echo [1/3] Berkas server/.env sudah ada.
)
echo.

echo [2/3] Memasang seluruh dependensi (Frontend & Backend)...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] npm install monorepo menemui kendala, mencoba per folder...
    call npm --prefix server install
    call npm --prefix client install
)
echo [OK] Seluruh pustaka dependensi terpasang rapi!
echo.

echo [3/3] Setup awal selesai!
echo Anda kini bisa menjalankan aplikasi hanya dengan klik dua kali "start-dev.bat"
echo.
pause
