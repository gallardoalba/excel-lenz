// ── FormulaBar: Excel-style formula bar ───────────────────────────────────
// Name Box + formula input with autocomplete and syntax highlighting

import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import {
  EXCEL_FUNCTIONS_DE,
  positionToRef,
  type CellPosition,
} from './types';

interface FormulaBarProps {
  cellValue?: string;
  isFormulaMode?: boolean;
  onChange?: (value: string) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onNavigate?: (direction: 'enter' | 'tab' | 'shiftEnter' | 'shiftTab') => void;
  onNavigateToRef?: (ref: string) => void;
  activeCell: CellPosition | null;
  onStartEditing?: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────

/** Extract the function-name prefix at cursor position for autocomplete matching */
function extractPartialFunction(val: string): string | null {
  // Match the last word after =, (, ,, ;, +, -, *, /, &, space
  const m = val.match(/(?:^=|[(,;+\-*/><=& ])\s*([A-Za-z_ÄÖÜäöüß]+)$/);
  return m ? m[1].toUpperCase() : null;
}

// ── Component ────────────────────────────────────────────────────────────

export default function FormulaBar(props: FormulaBarProps) {
  const {
    cellValue,
    isFormulaMode,
    onChange,
    onConfirm,
    onCancel,
    onNavigate,
    onNavigateToRef,
    activeCell,
    onStartEditing,
  } = props;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nameBoxRef = useRef<HTMLInputElement>(null);

  const [editValue, setEditValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteIndex, setAutocompleteIndex] = useState(0);
  const [autocompleteItems, setAutocompleteItems] = useState<typeof EXCEL_FUNCTIONS_DE>([]);
  const [showFunctionDialog, setShowFunctionDialog] = useState(false);
  const [functionSearch, setFunctionSearch] = useState('');
  const [expanded, setExpanded] = useState(false);

  const functions = EXCEL_FUNCTIONS_DE;

  // Sync from parent prop — only when user is NOT actively editing
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setEditValue(cellValue ?? '');
    }
    // Auto-trigger autocomplete when cell contains a partial formula
    if (cellValue && cellValue.startsWith('=')) {
      const partial = extractPartialFunction(cellValue);
      if (partial) {
        const filtered = functions.filter((f) => f.name.startsWith(partial));
        if (filtered.length > 0) {
          setAutocompleteItems(filtered);
          setShowAutocomplete(true);
          setAutocompleteIndex(0);
          return;
        }
      }
    }
    setShowAutocomplete(false);
  }, [cellValue, functions]);

  // Focus input when formula mode activates
  useEffect(() => {
    if (isFormulaMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFormulaMode]);

  // ── Name Box ──

  const nameBoxValue = activeCell ? positionToRef(activeCell) : '';
  const [nameBoxVal, setNameBoxVal] = useState(nameBoxValue);

  // Sync name box when active cell changes externally
  useEffect(() => {
    setNameBoxVal(nameBoxValue);
  }, [nameBoxValue]);

  const handleNameBoxKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const ref = target.value.trim().toUpperCase();
      if (ref && onNavigateToRef) {
        const isValid = /^[A-Z]+\d+(:[A-Z]+\d+)?$/.test(ref);
        if (isValid) {
          onNavigateToRef(ref);
          target.style.borderColor = ''; // Clear error
        } else {
          target.style.borderColor = '#ff0000'; // Show error
          target.style.boxShadow = '0 0 0 1px #ff0000';
          setTimeout(() => {
            target.style.borderColor = '';
            target.style.boxShadow = '';
          }, 1500);
        }
      }
    }
  }, [onNavigateToRef]);

  const handleNameBoxFocus = useCallback(() => {
    if (nameBoxRef.current) nameBoxRef.current.select();
  }, []);

  // ── Syntax highlighting ──────────────────────────────────────────────

  const highlightFormula = useCallback((val: string): React.ReactNode => {
    if (!val.startsWith('=')) return val;

    const parts: React.ReactNode[] = [];
    let remaining = val.slice(1);
    let key = 0;

    // Step 1 fix: match absolute references with $ (e.g. $A$1, $A1, A$1)
    const regex = /([A-Za-z_ÄÖÜäöüß]+)\(|"([^"]*)"|(\$?[A-Za-z]+\$?\d+(?::\$?[A-Za-z]+\$?\d+)?)|(\d+[,.]?\d*)/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    parts.push(<span key={key++} className="fb-token-eq">=</span>);

    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIdx) {
        parts.push(<span key={key++}>{remaining.slice(lastIdx, match.index)}</span>);
      }

      if (match[1]) {
        parts.push(<span key={key++} className="fb-token-fn">{match[1]}</span>);
        parts.push(<span key={key++} className="fb-token-paren">(</span>);
      } else if (match[2]) {
        parts.push(<span key={key++} className="fb-token-str">"{match[2]}"</span>);
      } else if (match[3]) {
        parts.push(<span key={key++} className="fb-token-ref">{match[3].toUpperCase()}</span>);
      } else if (match[4]) {
        parts.push(<span key={key++} className="fb-token-num">{match[4]}</span>);
      }

      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < remaining.length) {
      parts.push(<span key={key++}>{remaining.slice(lastIdx)}</span>);
    }

    return <>{parts}</>;
  }, []);

  // ── Autocomplete ─────────────────────────────────────────────────────

  const handleInput = useCallback((val: string) => {
    setEditValue(val);
    onChange?.(val);
    const partial = extractPartialFunction(val);
    if (partial) {
      const filtered = functions.filter((f) => f.name.startsWith(partial));
      if (filtered.length > 0) {
        setAutocompleteItems(filtered);
        setShowAutocomplete(true);
        setAutocompleteIndex(0);
        return;
      }
    }
    setShowAutocomplete(false);
  }, [onChange, functions]);

  const selectAutocomplete = useCallback((fn: typeof EXCEL_FUNCTIONS_DE[0]) => {
    const newVal = editValue.replace(/([A-Za-z_ÄÖÜäöüß]+)$/, fn.name + '(');
    setEditValue(newVal);
    onChange?.(newVal);
    setShowAutocomplete(false);
    // Step 3: restore focus and position cursor after inserted function
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      if (inputRef.current) {
        const pos = newVal.length;
        inputRef.current.selectionStart = pos;
        inputRef.current.selectionEnd = pos;
      }
    });
  }, [onChange, editValue]);

  // ── Keyboard handling ────────────────────────────────────────────────

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showAutocomplete) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setAutocompleteIndex((i) => Math.min(i + 1, autocompleteItems.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setAutocompleteIndex((i) => Math.max(i - 1, 0)); return; }
      if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); selectAutocomplete(autocompleteItems[autocompleteIndex]); return; }
      if (e.key === 'Escape') { e.preventDefault(); setShowAutocomplete(false); return; }
    }
    if (e.key === 'Enter') { e.preventDefault(); onNavigate?.(e.shiftKey ? 'shiftEnter' : 'enter'); onConfirm?.(); }
    else if (e.key === 'Tab') { e.preventDefault(); onNavigate?.(e.shiftKey ? 'shiftTab' : 'tab'); onConfirm?.(); }
    // Bug #10.2 fix: Escape dismisses formula bar and returns focus to the grid
    else if (e.key === 'Escape') { e.preventDefault(); onCancel?.(); }
    else if (e.ctrlKey && e.key === 'Tab') { e.preventDefault(); onCancel?.(); }
  }, [showAutocomplete, autocompleteItems, autocompleteIndex, selectAutocomplete, onConfirm, onCancel, onNavigate]);

  const handleConfirm = useCallback(() => { onConfirm?.(); }, [onConfirm]);
  const handleCancel = useCallback(() => { onCancel?.(); }, [onCancel]);

  const handleFocus = useCallback(() => {
    setIsEditing(true);
    onStartEditing?.();
    if (editValue && !isFormulaMode && onChange) onChange(editValue);
  }, [editValue, isFormulaMode, onChange, onStartEditing]);

  // Detect if the value is a formula
  const isFormula = editValue.startsWith('=');
  const showFormulaHighlight = isFormulaMode && editValue.startsWith('=');

  return (
    <div className="excel-formulabar" role="region" aria-label="Bearbeitungsleiste">
      {/* ── Name Box ── */}
      <input
        ref={nameBoxRef}
        className="formulabar-namebox"
        value={nameBoxVal}
        onChange={e => setNameBoxVal(e.target.value)}
        onKeyDown={handleNameBoxKeyDown}
        onFocus={handleNameBoxFocus}
        aria-label="Zellbezug"
        title="Zellbezug eingeben und Enter drücken"
        spellCheck={false}
      />

      {/* ── Action Buttons ── */}
      <div className="formulabar-buttons">
        <button
          className="formulabar-btn formulabar-btn-cancel"
          onClick={handleCancel}
          aria-label="Abbrechen"
          title="Abbrechen"
        >✗</button>
        <button
          className="formulabar-btn formulabar-btn-confirm"
          onClick={handleConfirm}
          aria-label="Bestätigen"
          title="Bestätigen"
        >✓</button>
        <button
          className="formulabar-btn"
          onClick={() => {
            // Step 3: preserve existing formula content, don't overwrite
            const startVal = editValue || (cellValue && cellValue.startsWith('=') ? cellValue : '=');
            if (!startVal.startsWith('=')) {
              setEditValue('=');
              onChange?.('=');
            } else {
              setEditValue(startVal);
              onChange?.(startVal);
            }
            setShowFunctionDialog(true);
            inputRef.current?.focus();
          }}
          aria-label="Formel einfügen"
          title="Formel einfügen"
        >fx</button>
      </div>

      {/* ── Formula Input ── */}
      <div className="formulabar-input-wrap">
        {/* Syntax-highlighted overlay */}
        {showFormulaHighlight && (
          <div className="formulabar-highlight" aria-hidden="true">
            {highlightFormula(editValue)}
          </div>
        )}

        <textarea
          ref={inputRef}
          className="formulabar-input"
          value={editValue}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (relatedTarget?.classList.contains('formulabar-btn-cancel')) return;
            if (isEditing && editValue !== cellValue) handleConfirm();
            setIsEditing(false);
          }}
          rows={expanded ? 3 : 1}
          aria-label={isFormula ? 'Formel eingeben' : 'Zellinhalt'}
          aria-autocomplete={showAutocomplete ? 'list' : undefined}
          aria-controls={showAutocomplete ? 'formula-autocomplete-list' : undefined}
          aria-activedescendant={showAutocomplete && autocompleteItems[autocompleteIndex] ? `fb-ac-${autocompleteIndex}` : undefined}
          role="combobox"
          aria-expanded={showAutocomplete}
          placeholder="Zellwert oder =Formel..."
          spellCheck={false}
        />

        {/* ── Expand/Collapse button ── */}
        <button
          className="formulabar-expand-btn"
          onClick={() => setExpanded(e => !e)}
          title={expanded ? 'Formelleiste verkleinern' : 'Formelleiste erweitern'}
          aria-label={expanded ? 'Formelleiste verkleinern' : 'Formelleiste erweitern'}
        >{expanded ? '▲' : '▼'}</button>

        {/* ── Autocomplete dropdown ── */}
        {showAutocomplete && autocompleteItems.length > 0 && (
          <div
            id="formula-autocomplete-list"
            className="formulabar-autocomplete"
            role="listbox"
            aria-label="Funktionsvorschläge"
          >
            {autocompleteItems.map((fn, i) => (
              <div
                key={fn.name}
                id={`fb-ac-${i}`}
                className={`autocomplete-item${i === autocompleteIndex ? ' active' : ''}`}
                role="option"
                aria-selected={i === autocompleteIndex}
                onClick={() => selectAutocomplete(fn)}
                onMouseEnter={() => setAutocompleteIndex(i)}
              >
                <span className="autocomplete-name">{fn.name}</span>
                <span className="autocomplete-syntax">{fn.syntax}</span>
              </div>
            ))}
          </div>
        )}

      {/* Function Insert Dialog */}
      {showFunctionDialog && (
        <div className="excel-dialog-overlay" onClick={() => setShowFunctionDialog(false)}>
          <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, maxHeight: 420 }}>
            <div className="excel-dialog-header">
              <span>Funktion einfügen</span>
              <button onClick={() => setShowFunctionDialog(false)}>✗</button>
            </div>
            <div style={{ padding: '8px 0' }}>
              <input
                type="text"
                placeholder="Funktion suchen..."
                value={functionSearch}
                onChange={e => setFunctionSearch(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4, fontSize: '0.82rem', boxSizing: 'border-box' }}
                autoFocus
              />
            </div>
            <div style={{ maxHeight: 260, overflow: 'auto' }}>
              {functions
                .filter(f => !functionSearch || f.name.toLowerCase().includes(functionSearch.toLowerCase()))
                .map(f => (
                  <button
                    key={f.name}
                    onClick={() => {
                      const selectedFn = f.name + '(';
                      const currentVal = editValue || '';
                      const cursorPos = inputRef.current?.selectionStart ?? currentVal.length;

                      let valToInsert = selectedFn;
                      if (!currentVal.startsWith('=')) {
                        valToInsert = '=' + selectedFn;
                      }

                      const newVal = currentVal.substring(0, cursorPos) + valToInsert + currentVal.substring(cursorPos);
                      const newPos = cursorPos + valToInsert.length;

                      setEditValue(newVal);
                      setIsEditing(true);
                      onChange?.(newVal);
                      setShowFunctionDialog(false);
                      setFunctionSearch('');

                      setTimeout(() => {
                        inputRef.current?.focus();
                        if (inputRef.current) {
                          inputRef.current.selectionStart = newPos;
                          inputRef.current.selectionEnd = newPos;
                        }
                      }, 0);
                    }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', border: 'none', background: 'none',
                      padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem',
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = '#e8edf2')}
                    onMouseOut={e => (e.currentTarget.style.background = 'none')}
                  >
                    <strong>{f.name}</strong>
                    <span style={{ color: '#888', marginLeft: 10, fontSize: '0.74rem' }}>{f.syntax}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

