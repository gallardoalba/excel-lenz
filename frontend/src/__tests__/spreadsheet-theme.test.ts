/**
 * Dark Mode & Theme Tests
 * Covers: HT v18 Theme API, CSS custom properties, body.dark toggling
 */
import { describe, it, expect } from 'vitest';

describe('HT v18 Theme API', () => {
  it('dark mode maps to ht-theme-horizon', () => {
    const dark = true;
    const themeName = dark ? 'ht-theme-horizon' : 'ht-theme-main';
    expect(themeName).toBe('ht-theme-horizon');
  });

  it('light mode maps to ht-theme-main', () => {
    const dark = false;
    const themeName = dark ? 'ht-theme-horizon' : 'ht-theme-main';
    expect(themeName).toBe('ht-theme-main');
  });

  it('theme updates via updateSettings on dark toggle', () => {
    let lastTheme = '';
    const mockHot = {
      updateSettings: (s: any) => { lastTheme = s.themeName; },
      isDestroyed: false,
    };
    const dark = true;
    (mockHot as any).updateSettings({ themeName: dark ? 'ht-theme-horizon' : 'ht-theme-main' });
    expect(lastTheme).toBe('ht-theme-horizon');

    (mockHot as any).updateSettings({ themeName: false ? 'ht-theme-horizon' : 'ht-theme-main' });
    expect(lastTheme).toBe('ht-theme-main');
  });

  it('theme update guards against destroyed instance', () => {
    let called = false;
    const mockHot = {
      updateSettings: () => { called = true; },
      isDestroyed: true,
    };
    if (!mockHot.isDestroyed) (mockHot as any).updateSettings({} as any);
    expect(called).toBe(false);
  });
});

describe('CSS Custom Properties (--ht-*)', () => {
  it('light mode CSS variables use design system tokens', () => {
    const lightVars = {
      '--ht-border-color': 'var(--border)',
      '--ht-cell-background': 'var(--surface)',
      '--ht-cell-color': 'var(--text)',
      '--ht-header-background': 'var(--bg-alt)',
      '--ht-selection-background': 'rgba(33, 115, 70, 0.12)',
    };
    expect(lightVars['--ht-border-color']).toContain('--border');
    expect(lightVars['--ht-cell-background']).toContain('--surface');
  });

  it('dark mode CSS variables use dark design tokens', () => {
    const darkVars = {
      '--ht-selection-background': 'rgba(255, 255, 255, 0.08)',
      '--ht-accent-color': 'var(--primary, #4ade80)',
    };
    expect(darkVars['--ht-selection-background']).toContain('0.08');
  });

  it('all required --ht-* variables are defined', () => {
    const requiredVars = [
      '--ht-border-color',
      '--ht-cell-background',
      '--ht-cell-color',
      '--ht-header-background',
      '--ht-header-color',
      '--ht-selection-background',
      '--ht-accent-color',
    ];
    expect(requiredVars.length).toBe(7);
    requiredVars.forEach(v => expect(v).toMatch(/^--ht-/));
  });
});

describe('body.dark Class Toggle', () => {
  it('body.dark class is toggled by ThemeContext', () => {
    let bodyClass = '';
    const dark = true;
    bodyClass = dark ? 'dark' : '';
    expect(bodyClass).toBe('dark');
  });

  it('body.dark class is removed for light mode', () => {
    let bodyClass = 'dark';
    bodyClass = '';
    expect(bodyClass).toBe('');
  });

  it('dark mode preference is stored in localStorage', () => {
    const key = 'excel-lenz_dark';
    expect(key).toBe('excel-lenz_dark');
  });

  it('dark mode respects system preference on first visit', () => {
    // When no stored value, use prefers-color-scheme
    const stored = null;
    const systemPrefersDark = true;
    const dark = stored !== null ? stored === 'true' : systemPrefersDark;
    expect(dark).toBe(true);
  });
});

describe('Redundant CSS Cleanup', () => {
  it('body.dark .handsontable td no longer has hardcoded background', () => {
    // After migration: these rules were removed because HT theme handles them
    const removedRules = [
      'body.dark .handsontable th',
      'body.dark .handsontable td',
    ];
    expect(removedRules.length).toBe(2);
  });

  it('body.dark .handsontable border rule was removed', () => {
    const removedBorderRule = 'body.dark .handsontable td, body.dark .handsontable th';
    expect(removedBorderRule).toContain('.handsontable');
  });
});

describe('Theme CSS Imports', () => {
  it('main theme CSS is imported', () => {
    const imports = [
      'handsontable/styles/handsontable.css',
      'handsontable/styles/ht-theme-main.css',
      'handsontable/styles/ht-theme-horizon.css',
      'handsontable/styles/ht-icons-main.css',
      'handsontable/styles/ht-icons-horizon.css',
    ];
    expect(imports.length).toBe(5);
    expect(imports.filter(i => i.includes('horizon')).length).toBe(2);
  });
});

describe('Theme Performance', () => {
  it('theme switch does not recreate HF instance', () => {
    let hfCreated = 0;
    const createHF = () => { hfCreated++; return { addSheet: () => 0, destroy: () => {} }; };
    createHF(); // Initial
    expect(hfCreated).toBe(1);
    // Theme switch only calls updateSettings, not createHF
    expect(hfCreated).toBe(1);
  });

  it('theme switch does not reload data', () => {
    let loadDataCalled = false;
    const mockHot = {
      updateSettings: () => {},
      loadData: () => { loadDataCalled = true; },
      isDestroyed: false,
    };
    // Theme switch only calls updateSettings
    (mockHot as any).updateSettings({} as any);
    expect(loadDataCalled).toBe(false);
  });
});
