import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, FileText, Command } from 'lucide-react';
import { apiFetch } from '../../context/AuthContext';

interface SearchResult {
  type: 'course' | 'exercise';
  id: string;
  title: string;
  courseTitle?: string;
  url: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ⌘K / Ctrl+K to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Fetch data on open
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIdx(0);
      return;
    }
    apiFetch('/courses')
      .then((courses: any[]) => {
        const items: SearchResult[] = [];
        for (const c of courses) {
          items.push({ type: 'course', id: c.id, title: c.title, url: `/courses/${c.id}` });
        }
        // Fetch all courses with exercises for search
        Promise.all(
          courses.map((c: any) =>
            apiFetch(`/courses/${c.id}`)
              .then((detail: any) => {
                if (detail?.exercises) {
                  for (const ex of detail.exercises) {
                    items.push({
                      type: 'exercise',
                      id: ex.id,
                      title: ex.title,
                      courseTitle: c.title,
                      url: `/exercises/${ex.id}`,
                    });
                  }
                }
              })
              .catch(() => {})
          )
        ).then(() => {
          // Sort: exercises first, then courses
          items.sort((a, b) => {
            if (a.type !== b.type) return a.type === 'exercise' ? -1 : 1;
            return a.title.localeCompare(b.title);
          });
          setResults(items);
        });
      })
      .catch(() => {});
    // Focus input after render
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Filter results
  const filtered = query.trim()
    ? results.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        (r.courseTitle || '').toLowerCase().includes(query.toLowerCase())
      )
    : results.slice(0, 10);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  // Scroll selected into view
  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.children[selectedIdx] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIdx]);

  const handleSelect = useCallback((item: SearchResult) => {
    navigate(item.url);
    setOpen(false);
  }, [navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIdx]) {
      e.preventDefault();
      handleSelect(filtered[selectedIdx]);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="cmd-palette-backdrop" onClick={() => setOpen(false)} />
      <div className="cmd-palette" role="dialog" aria-label="Suche">
        <div className="cmd-input-wrap">
          <Search size={18} className="cmd-search-icon" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Übung oder Kurs suchen..."
            className="cmd-input"
            aria-label="Suchbegriff"
          />
          <kbd className="cmd-kbd-esc">Esc</kbd>
        </div>

        <div className="cmd-results" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="cmd-empty">
              {query.trim() ? 'Keine Ergebnisse gefunden.' : 'Übungen werden geladen...'}
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.type + item.id}
                className={`cmd-item${idx === selectedIdx ? ' selected' : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIdx(idx)}
                role="option"
                aria-selected={idx === selectedIdx}
              >
                <span className="cmd-item-icon">
                  {item.type === 'course' ? <BookOpen size={16} /> : <FileText size={16} />}
                </span>
                <div className="cmd-item-body">
                  <div className="cmd-item-title">{item.title}</div>
                  {item.courseTitle && (
                    <div className="cmd-item-meta">{item.courseTitle}</div>
                  )}
                </div>
                <span className="cmd-item-badge">
                  {item.type === 'course' ? 'Kurs' : 'Übung'}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="cmd-footer">
          <span><kbd><Command size={10} style={{marginRight:2}} />K</kbd> öffnen</span>
          <span><kbd>↑↓</kbd> navigieren</span>
          <span><kbd>↵</kbd> öffnen</span>
          <span><kbd>Esc</kbd> schließen</span>
        </div>
      </div>
    </>
  );
}
