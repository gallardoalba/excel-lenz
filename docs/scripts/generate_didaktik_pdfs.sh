#!/usr/bin/env bash
# =============================================================================
# Excel-lenz — Didactic Guide PDF Generator
# =============================================================================
# Generates professional PDFs from the Markdown didactic guides using pandoc
# with pdflatex engine and the custom header_didaktik.tex preamble.
#
# Usage:
#   ./generate_didaktik_pdfs.sh              # Generate all 4 PDFs
#   ./generate_didaktik_pdfs.sh --clean      # Remove existing PDFs, then generate
#   ./generate_didaktik_pdfs.sh --de         # German only
#   ./generate_didaktik_pdfs.sh --es         # Spanish only
#   ./generate_didaktik_pdfs.sh --beginner   # Beginner level only
#   ./generate_didaktik_pdfs.sh --advanced   # Advanced level only
#
# Requirements:
#   - pandoc >= 3.0
#   - pdflatex (TeX Live)
#   - LaTeX packages: helvet, booktabs, xcolor, titlesec, enumitem,
#     parskip, microtype, tabularx, fancyhdr, etoolbox
# =============================================================================

set -euo pipefail

# ---- Paths ---------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIDAKTIK_DIR="${SCRIPT_DIR}/../didaktik"
HEADER_TEX="${SCRIPT_DIR}/header.tex"
TEMPLATE_TEX="${SCRIPT_DIR}/excellenz-template.tex"
ORPHAN_FILTER="${SCRIPT_DIR}/heading-orphans.lua"
OUTPUT_DIR="${DIDAKTIK_DIR}"

# ---- Color output --------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ---- Argument parsing ----------------------------------------------------
LANG_FILTER=""
LEVEL_FILTER=""
DO_CLEAN=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --clean)    DO_CLEAN=true ;;
        --de)       LANG_FILTER="de" ;;
        --es)       LANG_FILTER="es" ;;
        --beginner) LEVEL_FILTER="beginner" ;;
        --advanced) LEVEL_FILTER="advanced" ;;
        --help|-h)
            sed -n '2,/^$/p' "$0" | sed 's/^# //'
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information."
            exit 1
            ;;
    esac
    shift
done

# ---- Pre-flight checks ---------------------------------------------------
check_dependency() {
    if ! command -v "$1" &>/dev/null; then
        echo -e "${RED}Error: '$1' is not installed or not in PATH.${NC}"
        exit 1
    fi
}

check_dependency pandoc
check_dependency pdflatex

if [[ ! -f "$HEADER_TEX" ]]; then
    echo -e "${RED}Error: Header file not found: ${HEADER_TEX}${NC}"
    exit 1
fi

if [[ ! -d "$DIDAKTIK_DIR" ]]; then
    echo -e "${RED}Error: Didaktik directory not found: ${DIDAKTIK_DIR}${NC}"
    exit 1
fi

# ---- Build the list of documents ------------------------------------------
declare -A DOCUMENTS=(
    ["Didaktischer_Leitfaden_Excel_Anfaenger"]="de|beginner"
    ["Didaktischer_Leitfaden_Excel_Anfaenger_ES"]="es|beginner"
    ["Didaktischer_Leitfaden_Excel_Fortgeschrittene"]="de|advanced"
    ["Didaktischer_Leitfaden_Excel_Fortgeschrittene_ES"]="es|advanced"
)

# ---- Generate one PDF -----------------------------------------------------
generate_pdf() {
    local base_name="$1"
    local input_md="${DIDAKTIK_DIR}/${base_name}.md"
    local output_pdf="${OUTPUT_DIR}/${base_name}.pdf"

    if [[ ! -f "$input_md" ]]; then
        echo -e "  ${YELLOW}⚠ Skipping — source not found: ${input_md}${NC}"
        return 1
    fi

    echo -e "  ${CYAN}→${NC} ${base_name}.md"

    # Run pandoc with pdflatex engine and custom header
    if pandoc "$input_md" \
        -o "$output_pdf" \
        --pdf-engine=pdflatex \
        --template="$TEMPLATE_TEX" \
        --include-in-header="$HEADER_TEX" \
        --lua-filter="$ORPHAN_FILTER" \
        --verbose 2>&1 | while IFS= read -r line; do
            # Suppress routine pandoc output, show only warnings/errors
            if [[ "$line" =~ [Ww]arning|[Ee]rror|!|Fatal ]]; then
                echo -e "    ${YELLOW}${line}${NC}"
            fi
        done; then
        echo -e "    ${GREEN}✓${NC} $(basename "$output_pdf")"
        return 0
    else
        echo -e "    ${RED}✗ Failed to generate $(basename "$output_pdf")${NC}"
        return 1
    fi
}

# ---- Main -----------------------------------------------------------------
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Excel-lenz — Didactic Guide PDF Generator${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Header:  ${HEADER_TEX}"
echo -e "  Sources: ${DIDAKTIK_DIR}"
echo -e "  Engine:  pdflatex"
echo ""

# Clean existing PDFs if requested
if $DO_CLEAN; then
    echo -e "  ${YELLOW}Cleaning existing PDFs...${NC}"
    rm -f "${OUTPUT_DIR}"/*.pdf
    echo ""
fi

# Count generated and failed
COUNT_OK=0
COUNT_FAIL=0
COUNT_SKIP=0

for base_name in "${!DOCUMENTS[@]}"; do
    IFS='|' read -r doc_lang doc_level <<< "${DOCUMENTS[$base_name]}"

    # Apply filters
    if [[ -n "$LANG_FILTER" && "$doc_lang" != "$LANG_FILTER" ]]; then
        ((COUNT_SKIP++)) || true
        continue
    fi
    if [[ -n "$LEVEL_FILTER" && "$doc_level" != "$LEVEL_FILTER" ]]; then
        ((COUNT_SKIP++)) || true
        continue
    fi

    if generate_pdf "$base_name"; then
        ((COUNT_OK++)) || true
    else
        ((COUNT_FAIL++)) || true
    fi
done

# ---- Summary --------------------------------------------------------------
echo ""
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "  ${GREEN}Generated:${NC} ${COUNT_OK}  ${RED}Failed:${NC} ${COUNT_FAIL}  ${YELLOW}Skipped:${NC} ${COUNT_SKIP}"
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo ""

if [[ $COUNT_FAIL -gt 0 ]]; then
    exit 1
fi
