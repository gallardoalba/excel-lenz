// ── ContextMenu: Excel-style right-click context menu ──────────────────────
// Appears on right-click on the spreadsheet grid with cut/copy/paste,
// insert/delete, clear contents, and format options.

import { useEffect, useRef, useState } from 'react';
import type { ContextMenuAction, CellRange } from './types';
import { rangeToRef } from './types';

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  cellRange: CellRange | null;
  isHeader?: boolean;
  onAction: (action: ContextMenuAction) => void;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  action?: ContextMenuAction;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: { label: string; action: ContextMenuAction }[];
}

export default function ContextMenu({
  visible,
  x,
  y,
  cellRange,
  isHeader,
  onAction,
  onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside or Escape
  useEffect(() => {
    if (!visible) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // Delay to prevent the right-click event itself from closing
    setTimeout(() => {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKey);
    }, 0);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const rangeLabel = cellRange ? (isHeader ? `Spalte ${String.fromCharCode(65 + cellRange.startCol)}` : rangeToRef(cellRange)) : '';

  const cellMenu: MenuItem[][] = [
    // Section 1: Clipboard
    [
      { label: 'Ausschneiden', action: 'cut', shortcut: 'Strg+X' },
      { label: 'Kopieren', action: 'copy', shortcut: 'Strg+C' },
      { label: 'Einfügen', action: 'paste', shortcut: 'Strg+V' },
      { label: 'Inhalte einfügen', submenu: [
        { label: 'Werte', action: 'pasteValues' },
        { label: 'Formeln', action: 'pasteFormulas' },
        { label: 'Formatierung', action: 'pasteFormats' },
        { label: 'Transponieren', action: 'pasteTranspose' },
      ]},
    ],
    // Section 2: Insert / Delete
    [
      { label: 'Einfügen', submenu: [
        { label: 'Zellen...', action: 'insertCells' },
        { label: 'Zeile', action: 'insertRow' },
        { label: 'Spalte', action: 'insertColumn' },
      ]},
      { label: 'Löschen', submenu: [
        { label: 'Zellen...', action: 'deleteCells' },
        { label: 'Zeile', action: 'deleteRow' },
        { label: 'Spalte', action: 'deleteColumn' },
      ]},
    ],
    // Section 3: Clear
    [
      { label: 'Inhalte löschen', action: 'clearContents', shortcut: 'Entf' },
      { label: 'Formate löschen', action: 'clearFormats' },
    ],
    // Section 4: Sort & Filter
    [
      { label: 'Sortieren A → Z', action: 'sortAsc' },
      { label: 'Sortieren Z → A', action: 'sortDesc' },
      { label: 'Filtern nach Zellwert', action: 'filterByValue' },
    ],
    // Section 5: Format
    [
      { label: 'Zellen formatieren...', action: 'formatCells', shortcut: 'Strg+1' },
      { label: 'Zellen verbinden', action: 'mergeCells' },
      { label: 'Als Tabelle formatieren', action: 'formatAsTable' },
      { label: 'Spaltenbreite automatisch', action: 'autoFitColumn' },
    ],
    // Section 6: Quick Analysis
    [
      { label: 'Schnellanalyse', action: 'quickAnalysis' },
    ],
  ];

  const headerMenu: MenuItem[][] = [
    [
      { label: 'Ausschneiden', action: 'cut', shortcut: 'Strg+X' },
    ],
    [
      { label: 'Spalte einfügen', action: 'insertColumn' },
      { label: 'Spalte löschen', action: 'deleteColumn' },
    ],
    [
      { label: 'Spaltenbreite automatisch', action: 'autoFitColumn' },
      { label: 'Ausblenden', action: 'hideColumn' },
      { label: 'Einblenden', action: 'unhideColumn' },
    ],
  ];

  const menuItems = isHeader ? headerMenu : cellMenu;

  // Adjust position to keep menu within viewport
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 400);

  const isRightEdge = x > window.innerWidth - 250;

  return (
    <div
      ref={menuRef}
      className={`excel-context-menu ${isRightEdge ? 'is-right-edge' : ''}`}
      style={{ left: adjustedX, top: adjustedY }}
    >
      {rangeLabel && (
        <div className="context-menu-header">{rangeLabel}</div>
      )}
      {menuItems.map((section, si) => (
        <div key={si}>
          {si > 0 && <div className="context-menu-divider" />}
          {section.map((item, ii) => (
            <ContextMenuItem key={ii} item={item} onAction={onAction} onClose={onClose} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ContextMenuItem({ item, onAction, onClose }: {
  item: MenuItem;
  onAction: (action: ContextMenuAction) => void;
  onClose: () => void;
}) {
  const [showSub, setShowSub] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (item.submenu) setShowSub(true);
  };

  const handleMouseLeave = () => {
    if (item.submenu) {
      closeTimer.current = window.setTimeout(() => setShowSub(false), 200);
    }
  };

  const handleClick = () => {
    if (item.submenu) return;
    if (item.action) {
      onAction(item.action);
      onClose();
    }
  };

  return (
    <div
      className={`context-menu-item ${item.disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span>{item.label}</span>
      {item.shortcut && <span className="context-menu-shortcut">{item.shortcut}</span>}
      {item.submenu && <span className="context-menu-arrow">▶</span>}
      {item.submenu && showSub && (
        <div className="context-submenu">
          {item.submenu.map((sub, i) => (
            <div key={i} className="context-menu-item"
              onClick={() => { onAction(sub.action); onClose(); }}>
              <span>{sub.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
