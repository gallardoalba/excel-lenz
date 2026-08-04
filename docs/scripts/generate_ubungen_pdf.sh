#!/usr/bin/env bash
# =============================================================================
# Excel-lenz — Übungen PDF Generator
# =============================================================================
# Generates professional PDFs from the Übungen (exercises + solutions) files.
# Uses the same LaTeX template and styling as the Lehrplan PDFs.
#
# Usage:
#   ./generate_ubungen_pdf.sh                    # Generate both
#   ./generate_ubungen_pdf.sh --anfaenger         # Only Anfänger
#   ./generate_ubungen_pdf.sh --fortgeschrittene  # Only Fortgeschrittene
#   ./generate_ubungen_pdf.sh --clean             # Regenerate both
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HEADER_TEX="${SCRIPT_DIR}/header.tex"
TEMPLATE_TEX="${SCRIPT_DIR}/excellenz-template.tex"
ORPHAN_FILTER="${SCRIPT_DIR}/heading-orphans.lua"
MODULE_FILTER="${SCRIPT_DIR}/promote-module-headings.lua"
TABLE_FILTER="${SCRIPT_DIR}/table-rules.lua"
UBUNGEN_DIR="${SCRIPT_DIR}/../ubungen"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

DO_CLEAN=false
DO_ANFAENGER=false
DO_FORTG=false

for arg in "$@"; do
    case "$arg" in
        --clean)           DO_CLEAN=true ;;
        --anfaenger)       DO_ANFAENGER=true ;;
        --fortgeschrittene) DO_FORTG=true ;;
    esac
done

if ! $DO_ANFAENGER && ! $DO_FORTG; then
    DO_ANFAENGER=true
    DO_FORTG=true
fi

for cmd in pandoc lualatex; do
    if ! command -v "$cmd" &>/dev/null; then
        echo -e "${RED}Error: '$cmd' not found.${NC}"
        exit 1
    fi
done

for f in "$HEADER_TEX" "$TEMPLATE_TEX" "$ORPHAN_FILTER" "$MODULE_FILTER" "$TABLE_FILTER"; do
    if [[ ! -f "$f" ]]; then
        echo -e "${RED}Error: File not found: $f${NC}"
        exit 1
    fi
done

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Excel-lenz — Übungen PDF Generator${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

LUA_FILTERS="--lua-filter=${ORPHAN_FILTER} --lua-filter=${MODULE_FILTER} --lua-filter=${TABLE_FILTER}"

# Additional header with color definitions
COLOR_HEADER=$(mktemp)
cat "$HEADER_TEX" > "$COLOR_HEADER"
cat >> "$COLOR_HEADER" << 'LATEX'
\usepackage{xcolor}
\definecolor{excelblue}{HTML}{1565C0}
\definecolor{excelgray}{HTML}{4D4D4D}
LATEX

generate_ubungen_pdf() {
    local input_md="$1"
    local output_pdf="$2"
    local title="$3"
    local author="$4"
    local label="$5"

    if [[ ! -f "$input_md" ]]; then
        echo -e "  ${RED}✗${NC} ${label}: File not found"
        return 1
    fi

    $DO_CLEAN && rm -f "$output_pdf"

    echo -e "  ${CYAN}→${NC} ${label}"

    local stderr
    stderr=$(pandoc "$input_md" \
        -f gfm \
        -o "$output_pdf" \
        --pdf-engine=lualatex \
        --template="$TEMPLATE_TEX" \
        --include-in-header="$COLOR_HEADER" \
        --metadata title="$title" \
        --metadata author="$author" \
        --metadata date="August 2026" \
        --metadata documentclass="article" \
        --metadata fontsize="11pt" \
        --metadata geometry="margin=2.5cm" \
        --metadata colorlinks="true" \
        --metadata linkcolor="blue" \
        $LUA_FILTERS \
        2>&1) || true

    if echo "$stderr" | grep -qi "Error"; then
        echo "$stderr" | grep -i "Error" | grep -v "longtable\|Rerun\|Label.*may have changed" | head -3 | while read -r line; do
            echo -e "    ${RED}${line}${NC}"
        done
    fi

    if [[ -f "$output_pdf" ]]; then
        local size=$(du -h "$output_pdf" | cut -f1)
        echo -e "    ${GREEN}✓${NC} $(basename "$output_pdf") (${size})"
        return 0
    else
        echo -e "    ${RED}✗ Failed${NC}"
        return 1
    fi
}

GENERATED=0
FAILED=0

if $DO_ANFAENGER; then
    generate_ubungen_pdf \
        "${UBUNGEN_DIR}/anfaenger/ubungen_anfaenger.md" \
        "${UBUNGEN_DIR}/anfaenger/Ubungen_Excel_Anfaenger.pdf" \
        "Excel für Anfänger — Übungen mit Lösungen" \
        "Cristóbal Gallardo" \
        "Übungen Anfaenger" && (( ++GENERATED )) || (( ++FAILED ))
fi

if $DO_FORTG; then
    generate_ubungen_pdf \
        "${UBUNGEN_DIR}/fortgeschrittene/ubungen_fortgeschrittene.md" \
        "${UBUNGEN_DIR}/fortgeschrittene/Ubungen_Excel_Fortgeschrittene.pdf" \
        "Excel für Fortgeschrittene — Übungen mit Lösungen" \
        "Cristóbal Gallardo" \
        "Übungen Fortgeschrittene" && (( ++GENERATED )) || (( ++FAILED ))
fi

rm -f "$COLOR_HEADER"

echo ""
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "  ${GREEN}Generated: ${GENERATED}  Failed: ${FAILED}${NC}"
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo ""
