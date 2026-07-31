import { useState, useEffect } from 'react';
import { apiFetch } from '../context/AuthContext';

/**
 * Simple in-memory cache for API responses.
 * Avoids re-fetching data that rarely changes during a session.
 */
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useCachedFetch<T>(path: string, deps: any[] = []): { data: T | null; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    const cached = cache.get(path);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    apiFetch(path)
      .then((result: T) => {
        cache.set(path, { data: result, timestamp: Date.now() });
        setData(result);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [path, ...deps]);

  return { data, loading, error, refetch: fetchData };
}

/** Clear the entire cache (e.g., on logout) */
export function clearFetchCache() {
  cache.clear();
}
