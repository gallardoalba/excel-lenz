// Vitest setup for spreadsheet tests
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock canvas for Handsontable
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
})) as any;

// Mock ResizeObserver
(globalThis as any).ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })),
});

// Mock getComputedStyle for CSS custom properties
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = vi.fn((elt) => ({
  ...originalGetComputedStyle(elt),
  getPropertyValue: vi.fn((prop: string) => {
    if (prop === '--border') return '#e0e0e0';
    if (prop === '--surface') return '#ffffff';
    if (prop === '--text') return '#1a1a1a';
    return '';
  }),
})) as any;
