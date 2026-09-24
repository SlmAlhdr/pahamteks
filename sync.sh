#!/usr/bin/env bash
# ==============================================================================
# Script Otomasi Git Sync (Pull & Push) khusus folder pahamteks
# Target Repo: https://github.com/slmalhadar-lab/pahamteks
# ==============================================================================

set -e

# Warna untuk output terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Direktori skrip berada (folder pahamteks)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Validasi keamanan: Pastikan hanya berjalan di repo pahamteks
if [ ! -d ".git" ]; then
    echo -e "${RED}[ERROR] Folder ini bukan repositori git! (.git tidak ditemukan)${NC}"
    exit 1
fi

REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$REMOTE_URL" != *"slmalhadar-lab/pahamteks"* ]]; then
    echo -e "${YELLOW}[WARNING] Remote origin tidak mengarah ke slmalhadar-lab/pahamteks!${NC}"
    echo -e "Remote saat ini: $REMOTE_URL"
    read -p "Lanjutkan? (y/N): " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo -e "${RED}Dibatalkan.${NC}"
        exit 1
    fi
fi

# Dapatkan branch saat ini (default: main)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

do_pull() {
    echo -e "${BLUE}=== [1/2] Menarik pembaruan dari GitHub (${CURRENT_BRANCH})... ===${NC}"
    
    # Cek apakah ada perubahan lokal yang belum di-commit
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        echo -e "${YELLOW}[INFO] Menyimpan perubahan lokal sementara (stash)...${NC}"
        git stash push -m "temp_sync_stash_$(date +%s)"
        STASHED=1
    else
        STASHED=0
    fi

    # Tarik update terbaru
    git pull --rebase origin "$CURRENT_BRANCH"
    echo -e "${GREEN}[OK] Berhasil menarik data terbaru dari origin/${CURRENT_BRANCH}!${NC}"

    # Kembalikan stash jika tadi ada perubahan lokal
    if [ "$STASHED" -eq 1 ]; then
        echo -e "${YELLOW}[INFO] Mengembalikan perubahan lokal dari stash...${NC}"
        git stash pop || echo -e "${YELLOW}[PERINGATAN] Terjadi konflik saat mengembalikan perubahan lokal. Silakan cek file.${NC}"
    fi
}

do_push() {
    local COMMIT_MSG="$1"
    echo -e "${BLUE}=== [2/2] Mengirim perubahan ke GitHub (${CURRENT_BRANCH})... ===${NC}"
    
    # Hanya menambahkan semua file di dalam folder pahamteks
    git add .

    # Cek apakah ada perubahan yang perlu di-commit
    if git diff-index --cached --quiet HEAD --; then
        echo -e "${YELLOW}[INFO] Tidak ada file baru/berubah untuk di-push.${NC}"
        return 0
    fi

    # Buat commit message otomatis jika tidak diisi
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="Update pahamteks: $(date '+%Y-%m-%d %H:%M:%S')"
    fi

    echo -e "${BLUE}[INFO] Membuat commit: \"$COMMIT_MSG\"${NC}"
    git commit -m "$COMMIT_MSG"

    echo -e "${BLUE}[INFO] Mengirim (push) ke origin/${CURRENT_BRANCH}...${NC}"
    if ! git push origin "$CURRENT_BRANCH"; then
        echo -e "\n${RED}[GAGAL PUSH] Autentikasi GitHub diperlukan untuk mengirim ke repositori ini.${NC}"
        echo -e "${YELLOW}Panduan Login/Autentikasi:${NC}"
        echo -e "1. Jalankan perintah ini langsung di aplikasi Terminal Anda: ${GREEN}./sync.sh push${NC}"
        echo -e "2. Masukkan Username GitHub Anda saat diminta."
        echo -e "3. Masukkan ${BLUE}Personal Access Token (PAT)${NC} saat diminta Password (bukan password akun biasa)."
        echo -e "   -> Buat PAT di: https://github.com/settings/tokens (centang opsi 'repo')."
        echo -e "4. macOS Keychain akan otomatis menyimpan token tersebut, sehingga push selanjutnya berjalan otomatis."
        return 1
    fi
    echo -e "${GREEN}[OK] Berhasil mengirim perubahan ke GitHub!${NC}"
}

do_status() {
    echo -e "${BLUE}=== Status Git Folder pahamteks ===${NC}"
    echo -e "Direktori : $SCRIPT_DIR"
    echo -e "Branch    : $CURRENT_BRANCH"
    echo -e "Remote    : $REMOTE_URL"
    echo ""
    echo -e "${BLUE}Perubahan file lokal:${NC}"
    git status -s
    echo ""
    echo -e "${BLUE}Memeriksa sinkronisasi dengan remote...${NC}"
    git fetch origin "$CURRENT_BRANCH" --quiet
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse "origin/$CURRENT_BRANCH")
    BASE=$(git merge-base HEAD "origin/$CURRENT_BRANCH")

    if [ "$LOCAL" = "$REMOTE" ]; then
        echo -e "${GREEN}Lokal dan GitHub sudah sinkron (Up-to-date).${NC}"
    elif [ "$LOCAL" = "$BASE" ]; then
        echo -e "${YELLOW}Ada pembaruan di GitHub yang belum ditarik (Jalankan: ./sync.sh pull).${NC}"
    elif [ "$REMOTE" = "$BASE" ]; then
        echo -e "${YELLOW}Ada commit lokal yang belum dikirim ke GitHub (Jalankan: ./sync.sh push).${NC}"
    else
        echo -e "${RED}Lokal dan GitHub telah bercabang (Diverged). Jalankan ./sync.sh sync.${NC}"
    fi
}

show_help() {
    echo "Penggunaan skrip automasi sync pahamteks:"
    echo "  ./sync.sh              -> Otomatis pull update terbaru lalu push perubahan lokal"
    echo "  ./sync.sh sync [pesan] -> Pull lalu push dengan pesan commit tertentu"
    echo "  ./sync.sh pull         -> Hanya menarik (pull) perubahan dari GitHub"
    echo "  ./sync.sh push [pesan] -> Hanya mengirim (commit & push) perubahan lokal"
    echo "  ./sync.sh status       -> Memeriksa status perubahan file & sinkronisasi"
    echo "  ./sync.sh help         -> Menampilkan panduan bantuan ini"
}

# Router Perintah
ACTION="${1:-sync}"
shift || true
CUSTOM_MSG="$*"

case "$ACTION" in
    sync)
        do_pull
        do_push "$CUSTOM_MSG"
        echo -e "\n${GREEN}✔ Proses sinkronisasi selesai sepenuhnya!${NC}"
        ;;
    pull)
        do_pull
        echo -e "\n${GREEN}✔ Proses pull selesai!${NC}"
        ;;
    push)
        do_push "$CUSTOM_MSG"
        echo -e "\n${GREEN}✔ Proses push selesai!${NC}"
        ;;
    status)
        do_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}[ERROR] Perintah tidak dikenal: $ACTION${NC}"
        show_help
        exit 1
        ;;
esac
