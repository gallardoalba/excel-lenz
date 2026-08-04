#!/usr/bin/env bash
# =============================================================================
# Excel-lenz — Didaktik HTML + PDF Generator
# =============================================================================
# Generates HTML pages and updates downloadable PDFs for the didactic guides.
#
# Usage:
#   ./generate_didaktik_html.sh                    # Generate both
#   ./generate_didaktik_html.sh --anfaenger         # Only Anfänger
#   ./generate_didaktik_html.sh --fortgeschrittene  # Only Fortgeschrittene
#   ./generate_didaktik_html.sh --clean             # Regenerate both
#   ./generate_didaktik_html.sh --all               # HTML + PDFs + update downloads
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIDAKTIK_DIR="${SCRIPT_DIR}/../didaktik"
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

if ! $DO_ANFAENGER && ! $DO_FORTG; then
    DO_ANFAENGER=true
    DO_FORTG=true
fi

if ! command -v pandoc &>/dev/null; then
    echo -e "${RED}Error: pandoc not found.${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Excel-lenz — Didaktik HTML + PDF Generator${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

GENERATED=0
FAILED=0

# ---------------------------------------------------------------------------
generate_didaktik() {
    local input_md="$1"
    local output_html="$2"
    local output_pdf="$3"
    local title="$4"
    local label="$5"

    if [[ ! -f "$input_md" ]]; then
        echo -e "  ${RED}✗${NC} ${label}: File not found"
        return 1
    fi

    $DO_CLEAN && rm -f "$output_html" "$output_pdf"

    # Generate HTML
    echo -e "  ${CYAN}→${NC} ${label} (HTML)"
    local stderr
    stderr=$(pandoc "$input_md" -o "$output_html" --standalone \
        --metadata title="$title" 2>&1) || true

    if echo "$stderr" | grep -qi "Error"; then
        echo "$stderr" | grep -i "Error" | while read -r line; do
            echo -e "    ${RED}${line}${NC}"
        done
    fi

    if [[ -f "$output_html" ]]; then
        local hsize=$(du -h "$output_html" | cut -f1)
        echo -e "    ${GREEN}✓${NC} $(basename "$output_html") (${hsize})"
    else
        echo -e "    ${RED}✗ HTML failed${NC}"
        return 1
    fi

    # Generate PDF
    echo -e "  ${CYAN}→${NC} ${label} (PDF)"
    stderr=$(pandoc "$input_md" -o "$output_pdf" --pdf-engine=pdflatex 2>&1) || true

    if echo "$stderr" | grep -qi "Error"; then
        echo "$stderr" | grep -i "Error" | head -2 | while read -r line; do
            echo -e "    ${RED}${line}${NC}"
        done
    fi

    if [[ -f "$output_pdf" ]]; then
        local psize=$(du -h "$output_pdf" | cut -f1)
        echo -e "    ${GREEN}✓${NC} $(basename "$output_pdf") (${psize})"
    else
        echo -e "    ${RED}✗ PDF failed${NC}"
        return 1
    fi

    return 0
}

# ---- Anfänger ----
if $DO_ANFAENGER; then
    generate_didaktik \
        "${DIDAKTIK_DIR}/Didaktischer_Leitfaden_Excel_Anfaenger.md" \
        "${PUBLIC_DIR}/didaktik-anfaenger.html" \
        "${DIDAKTIK_DIR}/Didaktischer_Leitfaden_Excel_Anfaenger.pdf" \
        "Didaktischer Leitfaden: Excel für Anfänger" \
        "Didaktik Anfaenger" && (( ++GENERATED )) || (( ++FAILED ))
fi

# ---- Fortgeschrittene ----
if $DO_FORTG; then
    generate_didaktik \
        "${DIDAKTIK_DIR}/Didaktischer_Leitfaden_Excel_Fortgeschrittene.md" \
        "${PUBLIC_DIR}/didaktik-fortgeschrittene.html" \
        "${DIDAKTIK_DIR}/Didaktischer_Leitfaden_Excel_Fortgeschrittene.pdf" \
        "Didaktischer Leitfaden: Excel für Fortgeschrittene" \
        "Didaktik Fortgeschrittene" && (( ++GENERATED )) || (( ++FAILED ))
fi

# ---- Copy PDFs to downloads ----
if $DO_ALL; then
    echo ""
    echo -e "${CYAN}  ── Downloads ──${NC}"
    for src in "${DIDAKTIK_DIR}/Didaktischer_Leitfaden_Excel_Anfaenger.pdf" \
               "${DIDAKTIK_DIR}/Didaktischer_Leitfaden_Excel_Fortgeschrittene.pdf"; do
        if [[ -f "$src" ]]; then
            cp "$src" "$DOWNLOADS_DIR/"
            echo -e "    ${GREEN}✓${NC} $(basename "$src") → downloads/"
        fi
    done
fi

echo ""
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "  ${GREEN}Generated: ${GENERATED}  Failed: ${FAILED}${NC}"
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo ""

if $DO_ALL; then
    echo -e "  🌐 HTML pages:     ${PUBLIC_DIR}/didaktik-*.html"
    echo -e "  📄 PDF files:      ${DIDAKTIK_DIR}/"
    echo -e "  📥 Downloads:      ${DOWNLOADS_DIR}/"
    echo ""
fi
