#!/usr/bin/env bash
# =============================================================================
# Excel-lenz — HTML Page Generator
# =============================================================================
# Generates the public HTML pages from the Lehrplan Markdown sources.
#
# Usage:
#   ./generate_lehrplan_html.sh                    # Generate both HTML pages
#   ./generate_lehrplan_html.sh --anfaenger         # Only Anfänger
#   ./generate_lehrplan_html.sh --fortgeschrittene  # Only Fortgeschrittene
#   ./generate_lehrplan_html.sh --clean             # Regenerate both
#   ./generate_lehrplan_html.sh --all               # HTML + PDFs + downloads ZIPs
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_FILTER="${SCRIPT_DIR}/promote-module-headings.lua"
LEHRPLAN_DIR="${SCRIPT_DIR}/../lehrplan"
PUBLIC_DIR="${SCRIPT_DIR}/../../frontend/public"
DOWNLOADS_DIR="${PUBLIC_DIR}/downloads"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

DO_CLEAN=false
DO_ANFAENGER=false
DO_FORTG=false
DO_ALL=false

for arg in "$@"; do
    case "$arg" in
        --clean)           DO_CLEAN=true ;;
        --anfaenger)       DO_ANFAENGER=true ;;
        --fortgeschrittene) DO_FORTG=true ;;
        --all)             DO_ALL=true ;;
    esac
done

# Default: generate both
if ! $DO_ANFAENGER && ! $DO_FORTG; then
    DO_ANFAENGER=true
    DO_FORTG=true
fi

# Pre-flight checks
if ! command -v pandoc &>/dev/null; then
    echo -e "${RED}Error: pandoc not found. Install with: apt install pandoc${NC}"
    exit 1
fi

for f in "$MODULE_FILTER"; do
    if [[ ! -f "$f" ]]; then
        echo -e "${RED}Error: File not found: $f${NC}"
        exit 1
    fi
done

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Excel-lenz — HTML Page Generator${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# ---------------------------------------------------------------------------
# Generate a single HTML page
# ---------------------------------------------------------------------------
generate_html() {
    local input_md="$1"
    local output_html="$2"
    local title="$3"
    local label="$4"

    if [[ ! -f "$input_md" ]]; then
        echo -e "  ${RED}✗${NC} ${label}: File not found: $input_md"
        return 1
    fi

    $DO_CLEAN && rm -f "$output_html"

    echo -e "  ${CYAN}→${NC} ${label}"

    # Run pandoc; capture stderr for error reporting but don't fail on grep exit code
    local pandoc_stderr
    pandoc_stderr=$(pandoc "$input_md" \
        -o "$output_html" \
        --standalone \
        --metadata title="$title" \
        --lua-filter="$MODULE_FILTER" 2>&1) || true

    # Show any real errors (not TeX math warnings)
    echo "$pandoc_stderr" | grep -i "Error" | while IFS= read -r line; do
        echo -e "    ${RED}${line}${NC}"
    done

    if [[ -f "$output_html" ]]; then
        local size=$(du -h "$output_html" | cut -f1)
        echo -e "    ${GREEN}✓${NC} $(basename "$output_html") (${size})"
        return 0
    else
        echo -e "    ${RED}✗ Failed${NC}"
        return 1
    fi
}

# ---------------------------------------------------------------------------
# Copy PDF to downloads
# ---------------------------------------------------------------------------
copy_pdf() {
    local src="$1"
    local dst="$2"
    local label="$3"

    if [[ -f "$src" ]]; then
        cp "$src" "$dst"
        local size=$(du -h "$dst" | cut -f1)
        echo -e "    ${GREEN}✓${NC} ${label} (${size})"
    else
        echo -e "    ${RED}✗${NC} ${label}: PDF not found — run generate_lehrplan_pdf.sh first"
    fi
}

# ---------------------------------------------------------------------------
# Rebuild ZIP with Python
# ---------------------------------------------------------------------------
rebuild_zip() {
    local zip_path="$1"
    local pdf_path="$2"
    local uebungen_path="$3"
    local label="$4"

    if [[ ! -f "$zip_path" ]]; then
        echo -e "    ${RED}✗${NC} ${label}: ZIP not found"
        return 1
    fi

    python3 -c "
import zipfile, os, sys
tmp = '${zip_path}.tmp'
try:
    with zipfile.ZipFile('${zip_path}', 'r') as zin:
        with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename not in [os.path.basename('${pdf_path}'), 'Ubungen_mit_Loesungen.md']:
                    zout.writestr(item, zin.read(item.filename))
            if os.path.exists('${pdf_path}'):
                zout.write('${pdf_path}', os.path.basename('${pdf_path}'))
            if os.path.exists('${uebungen_path}'):
                zout.write('${uebungen_path}', 'Ubungen_mit_Loesungen.md')
    os.replace(tmp, '${zip_path}')
except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
    sys.exit(1)
" 2>&1 && echo -e "    ${GREEN}✓${NC} ${label}" || echo -e "    ${RED}✗${NC} ${label}"
}

GENERATED=0
FAILED=0

# ---- Anfänger ----
if $DO_ANFAENGER; then
    generate_html \
        "${LEHRPLAN_DIR}/Lehrplan_Excel_Anfaenger.md" \
        "${PUBLIC_DIR}/lehrplan-anfaenger.html" \
        "Lehrplan: Excel für Anfänger" \
        "lehrplan-anfaenger.html" && (( ++GENERATED )) || (( ++FAILED ))
fi

# ---- Fortgeschrittene ----
if $DO_FORTG; then
    generate_html \
        "${LEHRPLAN_DIR}/Lehrplan_Excel_Fortgeschrittene.md" \
        "${PUBLIC_DIR}/lehrplan-fortgeschrittene.html" \
        "Lehrplan: Excel für Fortgeschrittene" \
        "lehrplan-fortgeschrittene.html" && (( ++GENERATED )) || (( ++FAILED ))
fi

# ---- Optional: Full deployment (PDFs + ZIPs) ----
if $DO_ALL; then
    echo ""
    echo -e "${CYAN}  ── Downloads ──${NC}"

    if $DO_ANFAENGER; then
        copy_pdf \
            "${LEHRPLAN_DIR}/Lehrplan_Excel_Anfaenger.pdf" \
            "${DOWNLOADS_DIR}/Lehrplan_Excel_Anfaenger.pdf" \
            "Lehrplan_Excel_Anfaenger.pdf"

        rebuild_zip \
            "${DOWNLOADS_DIR}/Excel-lenz_Anfaenger_Materialien.zip" \
            "${LEHRPLAN_DIR}/Lehrplan_Excel_Anfaenger.pdf" \
            "${SCRIPT_DIR}/../ubungen/anfaenger/ubungen_anfaenger.md" \
            "Anfänger_Materialien.zip"
    fi

    if $DO_FORTG; then
        copy_pdf \
            "${LEHRPLAN_DIR}/Lehrplan_Excel_Fortgeschrittene.pdf" \
            "${DOWNLOADS_DIR}/Lehrplan_Excel_Fortgeschrittene.pdf" \
            "Lehrplan_Excel_Fortgeschrittene.pdf"

        rebuild_zip \
            "${DOWNLOADS_DIR}/Excel-lenz_Fortgeschrittene_Materialien.zip" \
            "${LEHRPLAN_DIR}/Lehrplan_Excel_Fortgeschrittene.pdf" \
            "${SCRIPT_DIR}/../ubungen/fortgeschrittene/ubungen_fortgeschrittene.md" \
            "Fortgeschrittene_Materialien.zip"
    fi
fi

echo ""
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "  ${GREEN}Generated: ${GENERATED}  Failed: ${FAILED}${NC}"
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo ""

if $DO_ALL; then
    echo -e "  📂 Public folder:  ${PUBLIC_DIR}"
    echo -e "  📥 Downloads:      ${DOWNLOADS_DIR}"
    echo ""
fi
