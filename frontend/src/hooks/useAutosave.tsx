import { useEffect, useRef, useMemo } from 'react';

// Deterministic widths for skeleton
const SKELETON_WIDTHS = [82, 95, 68, 88, 55, 92, 73, 85, 60, 90];

// Autosave hook: saves data to localStorage every `intervalMs`
export function useAutosave<T>(
  key: string,
  data: T,
  intervalMs: number = 30000
): { saved: boolean; restore: () => T | null; clear: () => void } {
  const savedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (data !== undefined && data !== null) {
        localStorage.setItem(key, JSON.stringify(data));
        savedRef.current = true;
        console.log(`[Autosave] ${key} saved`);
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [key, data, intervalMs]);

  const restore = (): T | null => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const clear = () => localStorage.removeItem(key);

  return { saved: savedRef.current, restore, clear };
}

// Skeleton loading component
export function Skeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={className} style={{ padding: 24 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 16,
            background: 'var(--border)',
            borderRadius: 4,
            marginBottom: 12,
            width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%`,
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: 28 }}>
      <div style={{ width: 56, height: 56, borderRadius: 'var(--radius)', background: 'var(--border)', marginBottom: 18, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 20, width: '60%', background: 'var(--border)', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.1s' }} />
      <div style={{ height: 14, background: 'var(--border)', borderRadius: 4, marginBottom: 6, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.2s' }} />
      <div style={{ height: 14, width: '80%', background: 'var(--border)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.3s' }} />
    </div>
  );
}
