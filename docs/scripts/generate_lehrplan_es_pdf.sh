#!/usr/bin/env bash
# Generate Spanish Lehrplan PDF
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HEADER_TEX="${SCRIPT_DIR}/header.tex"
TEMPLATE_TEX="${SCRIPT_DIR}/excellenz-template.tex"
ORPHAN_FILTER="${SCRIPT_DIR}/heading-orphans.lua"
INPUT_MD="${SCRIPT_DIR}/../lehrplan/Plan_de_Estudios_Excel_Principiantes.md"
OUTPUT_PDF="${SCRIPT_DIR}/../lehrplan/Plan_de_Estudios_Excel_Principiantes.pdf"

echo "→ Plan_de_Estudios_Excel_Principiantes.md"
if pandoc "$INPUT_MD" -o "$OUTPUT_PDF" --pdf-engine=pdflatex --template="$TEMPLATE_TEX" --include-in-header="$HEADER_TEX" --lua-filter="$ORPHAN_FILTER" 2>&1 | grep -E "Error|Warning" || true; then
    echo "✓ Generated"
else
    echo "✗ Failed"
    exit 1
fi
