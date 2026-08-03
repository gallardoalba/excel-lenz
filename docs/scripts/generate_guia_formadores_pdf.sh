#!/usr/bin/env bash
# Generate Spanish Instructor Guide PDF
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HEADER_TEX="${SCRIPT_DIR}/header.tex"
TEMPLATE_TEX="${SCRIPT_DIR}/excellenz-template.tex"
ORPHAN_FILTER="${SCRIPT_DIR}/heading-orphans.lua"
PROMOTE_FILTER="${SCRIPT_DIR}/promote-module-headings.lua"
INPUT_MD="${SCRIPT_DIR}/../lehrplan/Guia_para_Formadores.md"
OUTPUT_PDF="${SCRIPT_DIR}/../lehrplan/Guia_para_Formadores.pdf"

echo "→ Guia_para_Formadores.md"
if pandoc "$INPUT_MD" -o "$OUTPUT_PDF" --pdf-engine=pdflatex --template="$TEMPLATE_TEX" --include-in-header="$HEADER_TEX" --lua-filter="$ORPHAN_FILTER" --lua-filter="$PROMOTE_FILTER" 2>&1 | grep -E "Error|Warning" || true; then
    echo "✓ Generated"
else
    echo "✗ Failed"
    exit 1
fi
