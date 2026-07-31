// ── ConditionalFormatDialog: Excel-style conditional formatting ─────────────
// Supports highlight cell rules (greater than, less than, between, equal to,
// text contains) and top/bottom rules with visual style presets.

import { useState, useCallback } from 'react';
import type { CellRange } from './types';
import { rangeToRef } from './types';

export interface ConditionalFormatRule {
  id: string;
  range: CellRange;
  type: 'greaterThan' | 'lessThan' | 'between' | 'equalTo' | 'textContains' | 'topPercent' | 'bottomPercent';
  value1: string;
  value2?: string; // only for 'between'
  style: ConditionalFormatStyle;
}

export interface ConditionalFormatStyle {
  bgColor: string;
  fontColor: string;
  bold?: boolean;
}

interface ConditionalFormatDialogProps {
  visible: boolean;
  cellRange: CellRange | null;
  existingRules: ConditionalFormatRule[];
  onApply: (rules: ConditionalFormatRule[]) => void;
  onClose: () => void;
}

// ── Style presets ──────────────────────────────────────────────────────

const STYLE_PRESETS: { label: string; style: ConditionalFormatStyle }[] = [
  { label: 'Hellrote Füllung / dunkelroter Text', style: { bgColor: '#ffc7ce', fontColor: '#9c0006' } },
  { label: 'Gelbe Füllung / dunkelgelber Text', style: { bgColor: '#ffeb9c', fontColor: '#9c6500' } },
  { label: 'Grüne Füllung / dunkelgrüner Text', style: { bgColor: '#c6efce', fontColor: '#006100' } },
  { label: 'Hellblaue Füllung / dunkelblauer Text', style: { bgColor: '#bdd7ee', fontColor: '#1f4e79' } },
];

const RULE_TYPES: { value: ConditionalFormatRule['type']; label: string }[] = [
  { value: 'greaterThan', label: 'Größer als...' },
  { value: 'lessThan', label: 'Kleiner als...' },
  { value: 'between', label: 'Zwischen...' },
  { value: 'equalTo', label: 'Gleich...' },
  { value: 'textContains', label: 'Text enthält...' },
  { value: 'topPercent', label: 'Obere 10%' },
  { value: 'bottomPercent', label: 'Untere 10%' },
];

export default function ConditionalFormatDialog({
  visible,
  cellRange,
  existingRules,
  onApply,
  onClose,
}: ConditionalFormatDialogProps) {
  const [ruleType, setRuleType] = useState<ConditionalFormatRule['type']>('greaterThan');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [localRules, setLocalRules] = useState<ConditionalFormatRule[]>(existingRules);

  const rangeLabel = cellRange ? rangeToRef(cellRange) : '';

  const handleAddRule = useCallback(() => {
    if (!cellRange) return;
    const newRule: ConditionalFormatRule = {
      id: `cf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      range: { ...cellRange },
      type: ruleType,
      value1,
      value2: ruleType === 'between' ? value2 : undefined,
      style: STYLE_PRESETS[selectedStyle].style,
    };
    setLocalRules([...localRules, newRule]);
    setValue1('');
    setValue2('');
  }, [cellRange, ruleType, value1, value2, selectedStyle, localRules]);

  const handleRemoveRule = useCallback((ruleId: string) => {
    setLocalRules(localRules.filter(r => r.id !== ruleId));
  }, [localRules]);

  const handleApply = useCallback(() => {
    onApply(localRules);
    onClose();
  }, [localRules, onApply, onClose]);

  if (!visible) return null;

  return (
    <div className="excel-dialog-overlay" onClick={onClose}>
      <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="excel-dialog-titlebar">
          <span>Bedingte Formatierung{rangeLabel ? ` — ${rangeLabel}` : ''}</span>
          <button className="excel-dialog-close" onClick={onClose}>✕</button>
        </div>

        <div className="excel-dialog-body">
          {/* ── Add New Rule ── */}
          <div className="cf-section">
            <h4>Neue Regel</h4>
            <div className="cf-row">
              <label>Regeltyp:</label>
              <select
                value={ruleType}
                onChange={e => setRuleType(e.target.value as ConditionalFormatRule['type'])}
              >
                {RULE_TYPES.map(rt => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            </div>
            <div className="cf-row">
              <label>Wert(e):</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  placeholder={ruleType === 'textContains' ? 'Text' : 'Wert'}
                  value={value1}
                  onChange={e => setValue1(e.target.value)}
                  style={{ width: ruleType === 'between' ? '45%' : '100%' }}
                />
                {ruleType === 'between' && (
                  <>
                    <span style={{ lineHeight: '28px' }}>und</span>
                    <input
                      type="text"
                      placeholder="Wert"
                      value={value2}
                      onChange={e => setValue2(e.target.value)}
                      style={{ width: '45%' }}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="cf-row">
              <label>Format:</label>
              <div className="cf-styles">
                {STYLE_PRESETS.map((preset, i) => (
                  <div
                    key={i}
                    className={`cf-style-swatch ${i === selectedStyle ? 'selected' : ''}`}
                    style={{ background: preset.style.bgColor, color: preset.style.fontColor }}
                    onClick={() => setSelectedStyle(i)}
                    title={preset.label}
                  >
                    {preset.style.bold ? <b>Aa</b> : 'Aa'}
                  </div>
                ))}
              </div>
            </div>
            <button
              className="cf-add-btn"
              onClick={handleAddRule}
              disabled={!cellRange || (!value1 && ruleType !== 'topPercent' && ruleType !== 'bottomPercent')}
            >
              + Regel hinzufügen
            </button>
          </div>

          {/* ── Existing Rules ── */}
          {localRules.length > 0 && (
            <div className="cf-section">
              <h4>Vorhandene Regeln ({localRules.length})</h4>
              <div className="cf-rules-list">
                {localRules.map(rule => (
                  <div key={rule.id} className="cf-rule-item">
                    <div
                      className="cf-rule-swatch"
                      style={{ background: rule.style.bgColor, color: rule.style.fontColor }}
                    >
                      Aa
                    </div>
                    <div className="cf-rule-info">
                      <span className="cf-rule-range">{rangeToRef(rule.range)}</span>
                      <span className="cf-rule-desc">
                        {RULE_TYPES.find(rt => rt.value === rule.type)?.label} {rule.value1}
                        {rule.value2 ? ` – ${rule.value2}` : ''}
                      </span>
                    </div>
                    <button
                      className="cf-rule-remove"
                      onClick={() => handleRemoveRule(rule.id)}
                      title="Regel entfernen"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="excel-dialog-footer">
          <button className="excel-btn excel-btn-secondary" onClick={onClose}>Abbrechen</button>
          <button className="excel-btn excel-btn-primary" onClick={handleApply}>Anwenden</button>
        </div>
      </div>
    </div>
  );
}
