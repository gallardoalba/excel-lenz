import { describe, it, expect } from 'vitest';
import { HyperFormula } from 'hyperformula';
import deDE from 'hyperformula/i18n/languages/deDE';

HyperFormula.registerLanguage('deDE', deDE);

describe('DBSUMME (DSUM)', () => {
  it('sums Gehalt where Abteilung=IT AND Standort=Berlin', () => {
    const hf = HyperFormula.buildFromArray([
      ['Name', 'Abteilung', 'Gehalt', 'Standort'],
      ['Müller', 'IT', 55000, 'Berlin'],
      ['Schmidt', 'HR', 48000, 'München'],
      ['Weber', 'IT', 62000, 'Berlin'],
      ['Fischer', 'Marketing', 51000, 'Hamburg'],
      ['Wagner', 'IT', 58000, 'Berlin'],
      [],
      [],
      ['Abteilung', 'Standort', null],
      ['IT', 'Berlin', '=DBSUMME(A1:D7,"Gehalt",A9:B10)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    expect(hf.getCellValue({ sheet: 0, row: 9, col: 2 })).toBe(175000);
  });

  it('returns 0 when no records match', () => {
    const hf = HyperFormula.buildFromArray([
      ['Name', 'Gehalt'],
      ['A', 100],
      ['B', 200],
      [],
      ['Name', null],
      ['X', '=DBSUMME(A1:B3,"Gehalt",A5:A6)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    expect(hf.getCellValue({ sheet: 0, row: 5, col: 1 })).toBe(0);
  });
});

describe('DBAUSZUG (DGET)', () => {
  it('extracts single matching value', () => {
    const hf = HyperFormula.buildFromArray([
      ['Name', 'Abteilung', 'Gehalt'],
      ['Müller', 'IT', 55000],
      ['Schmidt', 'HR', 48000],
      [],
      ['Name', null],
      ['Müller', '=DBAUSZUG(A1:C3,"Gehalt",A5:A6)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    expect(hf.getCellValue({ sheet: 0, row: 5, col: 1 })).toBe(55000);
  });

  it('returns VALUE error with multiple matches', () => {
    const hf = HyperFormula.buildFromArray([
      ['Name', 'Abteilung', 'Gehalt'],
      ['Müller', 'IT', 55000],
      ['Weber', 'IT', 62000],
      [],
      ['Abteilung', null],
      ['IT', '=DBAUSZUG(A1:C3,"Gehalt",A5:A6)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    const r = hf.getCellValue({ sheet: 0, row: 5, col: 1 });
    expect((r as any).type).toBe("NUM");
  });
});

describe('RMZ (PMT)', () => {
  it('calculates monthly payment for 100k at 5% over 10 years', () => {
    const hf = HyperFormula.buildFromArray([
      [100000, 0.05, 10, '=RMZ(B1/12,C1*12,A1)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    expect(Math.abs(hf.getCellValue({ sheet: 0, row: 0, col: 3 }) as number)).toBeCloseTo(1060.66, 0);
  });

  it('higher rate = higher payment', () => {
    const hf = HyperFormula.buildFromArray([
      ['=RMZ(0.05/12,120,100000)', '=RMZ(0.10/12,120,100000)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    const lo = Math.abs(hf.getCellValue({ sheet: 0, row: 0, col: 0 }) as number);
    const hi = Math.abs(hf.getCellValue({ sheet: 0, row: 0, col: 1 }) as number);
    expect(hi).toBeGreaterThan(lo);
  });

  it('longer term = lower payment', () => {
    const hf = HyperFormula.buildFromArray([
      ['=RMZ(0.05/12,120,100000)', '=RMZ(0.05/12,240,100000)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    const sh = Math.abs(hf.getCellValue({ sheet: 0, row: 0, col: 0 }) as number);
    const lo = Math.abs(hf.getCellValue({ sheet: 0, row: 0, col: 1 }) as number);
    expect(lo).toBeLessThan(sh);
  });

  it('zero interest returns principal / periods', () => {
    const hf = HyperFormula.buildFromArray([
      ['=RMZ(0,120,120000)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    expect(Math.abs(hf.getCellValue({ sheet: 0, row: 0, col: 0 }) as number)).toBeCloseTo(1000, 0);
  });
});

describe('LINKS (LEFT)', () => {
  it('extracts leftmost characters', () => {
    const hf = HyperFormula.buildFromArray([
      ['Excel-lenz', '=LINKS(A1,5)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    expect(hf.getCellValue({ sheet: 0, row: 0, col: 1 })).toBe('Excel');
  });

  it('default count is 1', () => {
    const hf = HyperFormula.buildFromArray([
      ['Hallo', '=LINKS(A1)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    expect(hf.getCellValue({ sheet: 0, row: 0, col: 1 })).toBe('H');
  });

  it('count=0 returns empty', () => {
    const hf = HyperFormula.buildFromArray([
      ['Excel', '=LINKS(A1,0)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    expect(hf.getCellValue({ sheet: 0, row: 0, col: 1 })).toBe('');
  });

  it('count > length returns full string', () => {
    const hf = HyperFormula.buildFromArray([
      ['Hi', '=LINKS(A1,10)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    expect(hf.getCellValue({ sheet: 0, row: 0, col: 1 })).toBe('Hi');
  });

  it('works with numbers', () => {
    const hf = HyperFormula.buildFromArray([
      [12345, '=LINKS(A1,3)'],
    ], { language: 'deDE', licenseKey: 'gpl-v3' });
    expect(hf.getCellValue({ sheet: 0, row: 0, col: 1 })).toBe('123');
  });
});
