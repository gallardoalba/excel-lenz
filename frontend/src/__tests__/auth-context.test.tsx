import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth, apiFetch } from '../context/AuthContext';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock fetch globally
const mockFetch = vi.fn();
globalThis.fetch = mockFetch as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── apiFetch ────────────────────────────────────────────────

  describe('apiFetch', () => {
    it('attaches status code to error objects', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 401,
        ok: false,
        json: async () => ({ error: 'Unauthorized' }),
      });

      try {
        await apiFetch('/auth/me');
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(401);
        expect(err.message).toBe('Unauthorized');
      }
    });

    it('throws with status 500 for server errors', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 500,
        ok: false,
        json: async () => ({ error: 'Server error' }),
      });

      try {
        await apiFetch('/some/endpoint');
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err.status).toBe(500);
        expect(err.message).toBe('Server error');
      }
    });

    it('throws network error without status', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      try {
        await apiFetch('/some/endpoint');
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err.status).toBeUndefined();
        expect(err.message).toContain('Netzwerkfehler');
      }
    });

    it('includes Authorization header when token exists', async () => {
      localStorageMock.setItem('token', 'test-jwt-token');
      mockFetch.mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({ id: '1', email: 'test@ex.com' }),
      });

      await apiFetch('/auth/me');

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[1].headers).toHaveProperty('Authorization', 'Bearer test-jwt-token');
    });

    it('handles 204 No Content responses', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 204,
        ok: true,
        json: async () => { throw new Error('no body'); },
      });

      const result = await apiFetch('/some/endpoint');
      expect(result).toBeNull();
    });
  });

  // ── AuthProvider ────────────────────────────────────────────

  describe('AuthProvider', () => {
    it('starts with loading=true and user=null when no token', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
  });
});
