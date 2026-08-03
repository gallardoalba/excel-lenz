#!/usr/bin/env bash
# =============================================================================
# Excel-lenz — Lehrplan PDF Generator
# =============================================================================
# Usage:
#   ./generate_lehrplan_pdf.sh           # Generate PDF
#   ./generate_lehrplan_pdf.sh --clean   # Remove existing PDF, then generate
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HEADER_TEX="${SCRIPT_DIR}/header.tex"
TEMPLATE_TEX="${SCRIPT_DIR}/excellenz-template.tex"
ORPHAN_FILTER="${SCRIPT_DIR}/heading-orphans.lua"
LEHRPLAN_DIR="${SCRIPT_DIR}/../lehrplan"
INPUT_MD="${LEHRPLAN_DIR}/Lehrplan_Excel_Anfaenger.md"
OUTPUT_PDF="${LEHRPLAN_DIR}/Lehrplan_Excel_Anfaenger.pdf"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

DO_CLEAN=false
[[ "${1:-}" == "--clean" ]] && DO_CLEAN=true

# Pre-flight checks
for cmd in pandoc pdflatex; do
    if ! command -v "$cmd" &>/dev/null; then
        echo -e "${RED}Error: '$cmd' not found.${NC}"
        exit 1
    fi
done

for f in "$INPUT_MD" "$HEADER_TEX" "$TEMPLATE_TEX" "$ORPHAN_FILTER"; do
    if [[ ! -f "$f" ]]; then
        echo -e "${RED}Error: File not found: $f${NC}"
        exit 1
    fi
done

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Excel-lenz — Lehrplan PDF Generator${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

$DO_CLEAN && rm -f "$OUTPUT_PDF"

echo -e "  ${CYAN}→${NC} Lehrplan_Excel_Anfaenger.md"

if pandoc "$INPUT_MD" \
    -o "$OUTPUT_PDF" \
    --pdf-engine=pdflatex \
    --template="$TEMPLATE_TEX" \
    --include-in-header="$HEADER_TEX" \
    --lua-filter="$ORPHAN_FILTER" --lua-filter="${SCRIPT_DIR}/promote-module-headings.lua" \
    --verbose 2>&1 | while IFS= read -r line; do
        if [[ "$line" =~ [Ww]arning|[Ee]rror|!|Fatal ]]; then
            echo -e "    ${RED}${line}${NC}"
        fi
    done; then
    echo -e "    ${GREEN}✓${NC} $(basename "$OUTPUT_PDF")"
    echo ""
    echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
    echo -e "  ${GREEN}Generated: 1  Failed: 0${NC}"
    echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
    echo ""
else
    echo -e "    ${RED}✗ Failed${NC}"
    exit 1
fi
