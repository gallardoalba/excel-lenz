import { useEffect, useRef, useCallback } from 'react';
import { apiFetch } from '../context/AuthContext';

// ── Persistent session (survives F5, dies on tab close) ─────

const getSessionId = (): string => {
  let id = sessionStorage.getItem('analytics_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    sessionStorage.setItem('analytics_session_id', id);
  }
  return id;
};

const sessionId = getSessionId();

// ── Event batching queue ────────────────────────────────────

const eventQueue: Array<Record<string, unknown>> = [];

const flushQueue = () => {
  if (eventQueue.length === 0) return;

  const batch = eventQueue.splice(0, eventQueue.length);
  const payload = JSON.stringify({ events: batch });

  // sendBeacon guarantees delivery even on page close
  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    const success = navigator.sendBeacon('/api/analytics/track-batch', blob);
    if (success) return;
  }

  // Fallback to fetch with re-queue on failure
  apiFetch('/analytics/track-batch', {
    method: 'POST',
    body: payload,
  }).catch(() => {
    eventQueue.unshift(...batch); // Re-queue for retry
  });
};

// Flush every 5 seconds
setInterval(flushQueue, 5000);
// Flush on page unload
window.addEventListener('beforeunload', flushQueue);

// ── Public API ──────────────────────────────────────────────

export function trackEvent(
  event_type: string,
  options?: {
    resource_type?: string;
    resource_id?: string;
    metadata?: Record<string, unknown>;
  }
) {
  eventQueue.push({
    event_type,
    resource_type: options?.resource_type,
    resource_id: options?.resource_id,
    metadata: options?.metadata,
    session_id: sessionId,
    client_timestamp: new Date().toISOString(),
  });
}

export function usePageView(page: string) {
  useEffect(() => {
    trackEvent('page_view', { resource_type: 'page', resource_id: page });
  }, [page]);
}

export function useExerciseTimer(exerciseId: string) {
  const startRef = useRef(Date.now());
  const exerciseIdRef = useRef(exerciseId);

  useEffect(() => {
    startRef.current = Date.now();
    exerciseIdRef.current = exerciseId;
    trackEvent('exercise_start', { resource_type: 'exercise', resource_id: exerciseId });

    return () => {
      const durationSeconds = Math.round((Date.now() - startRef.current) / 1000);
      trackEvent('exercise_complete', {
        resource_type: 'exercise',
        resource_id: exerciseIdRef.current,
        metadata: { duration_seconds: durationSeconds },
      });
      flushQueue(); // Critical event — flush immediately
    };
  }, [exerciseId]);

  return {
    trackSubmit: useCallback((score: number) => {
      trackEvent('exercise_submit', {
        resource_type: 'exercise',
        resource_id: exerciseId,
        metadata: { score },
      });
      flushQueue(); // Critical event — flush immediately
    }, [exerciseId]),
  };
}

