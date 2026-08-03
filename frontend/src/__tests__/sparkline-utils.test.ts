import { describe, it, expect } from 'vitest';
import {
  parseSparklineRange,
  colLetterToIndex,
  resolveSparklineData,
  type SparklineDef,
} from '../components/spreadsheet/Sparkline';

describe('colLetterToIndex', () => {
  it('A → 0', () => expect(colLetterToIndex('A')).toBe(0));
  it('B → 1', () => expect(colLetterToIndex('B')).toBe(1));
  it('Z → 25', () => expect(colLetterToIndex('Z')).toBe(25));
  it('AA → 26', () => expect(colLetterToIndex('AA')).toBe(26));
  it('AB → 27', () => expect(colLetterToIndex('AB')).toBe(27));
  it('BA → 52', () => expect(colLetterToIndex('BA')).toBe(52));
  it('ZZ → 701', () => expect(colLetterToIndex('ZZ')).toBe(701));
  it('AAA → 702', () => expect(colLetterToIndex('AAA')).toBe(702));
  it('handles lowercase', () => expect(colLetterToIndex('ab')).toBe(27));
  it('handles mixed case', () => expect(colLetterToIndex('aB')).toBe(27));
  it('single letter H → 7', () => expect(colLetterToIndex('H')).toBe(7));
});

describe('parseSparklineRange', () => {
  const headers = ['Name', 'Jan', 'Feb', 'Mär', 'Apr'];

  it('parses simple column range B2:B5', () => {
    const result = parseSparklineRange('B2:B5', headers);
    expect(result).toEqual([1, 2, 3, 4]); // rows 2-5 → 0-based 1-4
  });

  it('parses range A2:A10', () => {
    const result = parseSparklineRange('A2:A10', headers);
    expect(result).toHaveLength(9);
    expect(result[0]).toBe(1);
    expect(result[8]).toBe(9);
  });

  it('parses single-cell range H1:H1', () => {
    const result = parseSparklineRange('H1:H1', headers);
    expect(result).toEqual([0]);
  });

  it('returns empty for invalid format', () => {
    expect(parseSparklineRange('not-a-range', headers)).toEqual([]);
  });

  it('returns empty for multi-column range B2:C5', () => {
    expect(parseSparklineRange('B2:C5', headers)).toEqual([]);
  });

  it('returns empty for reversed rows B5:B2', () => {
    expect(parseSparklineRange('B5:B2', headers)).toEqual([]);
  });

  it('returns empty for empty string', () => {
    expect(parseSparklineRange('', headers)).toEqual([]);
  });

  it('handles large column letter AA with rows', () => {
    const result = parseSparklineRange('AA5:AA10', headers);
    expect(result).toEqual([4, 5, 6, 7, 8, 9]);
  });
});

describe('resolveSparklineData', () => {
  const headers = ['Name', 'Wert1', 'Wert2'];
  // Row 1 (Excel) = header, row 2 = data[0], row 3 = data[1], etc.
  const data: (string | number | null)[][] = [
    ['Alice', 10, 20],
    ['Bob',   15, 25],
    ['Carol', 20, 30],
    ['Dave',  25, 35],
    ['Eve',   30, 40],
    ['Frank', 35, 45],
  ];

  it('resolves B2:B7 to numeric values from column B', () => {
    const def: SparklineDef = { cell: 'B10', type: 'line', range: 'B2:B7' };
    const result = resolveSparklineData(def, data, headers);
    // Col B (index 1): data[0..5][1] = 10,15,20,25,30,35
    expect(result).toEqual([10, 15, 20, 25, 30, 35]);
  });

  it('resolves B3:B5 to column B values', () => {
    const def: SparklineDef = { cell: 'B10', type: 'column', range: 'B3:B5' };
    const result = resolveSparklineData(def, data, headers);
    // Col B (index 1): row 3→data[1][1]=15, 4→data[2][1]=20, 5→data[3][1]=25
    expect(result).toEqual([15, 20, 25]);
  });

  it('returns NaN for empty cells in range', () => {
    const sparseData = [
      ['X', 10],
      ['Y', null],
      ['Z', 30],
    ];
    const def: SparklineDef = { cell: 'A1', type: 'line', range: 'B2:B4' };
    const result = resolveSparklineData(def, sparseData, headers);
    // Row 2 = sparseData[0][1]=10, Row 3 = sparseData[1][1]=null→NaN, Row 4 = sparseData[2][1]=30
    expect(result).toEqual([10, NaN, 30]);
  });

  it('returns empty for invalid range format', () => {
    const def: SparklineDef = { cell: 'A1', type: 'line', range: 'invalid' };
    expect(resolveSparklineData(def, data, headers)).toEqual([]);
  });

  it('handles out-of-bounds rows gracefully', () => {
    const def: SparklineDef = { cell: 'A1', type: 'line', range: 'A100:A105' };
    const result = resolveSparklineData(def, data, headers);
    // All rows out of bounds → NaN for each
    expect(result).toHaveLength(6);
    expect(result.every(n => isNaN(n))).toBe(true);
  });

  it('resolves column C range', () => {
    const def: SparklineDef = { cell: 'C1', type: 'line', range: 'C3:C6' };
    const result = resolveSparklineData(def, data, headers);
    // Col C (index 2): row 3→data[1][2]=25, 4→data[2][2]=30, 5→data[3][2]=35, 6→data[4][2]=40
    expect(result).toEqual([25, 30, 35, 40]);
  });

  it('handles mixed numeric and string values', () => {
    const mixedData: (string | number | null)[][] = [
      ['Item1', '10'],
      ['Item2', 20],
      ['Item3', 'not-a-number'],
    ];
    const def: SparklineDef = { cell: 'A1', type: 'line', range: 'B2:B4' };
    const result = resolveSparklineData(def, mixedData, headers);
    expect(result[0]).toBe(10);         // '10' → Number 10
    expect(result[1]).toBe(20);          // 20 → 20
    expect(result[2]).toBeNaN();         // 'not-a-number' → NaN
  });
});
