import { describe, it, expect } from 'vitest';
import { colToLetter, positionToRef, refToRange } from '../components/spreadsheet/types';

describe('Spreadsheet Utilities', () => {
  describe('colToLetter', () => {
    it('converts 0 to A', () => { expect(colToLetter(0)).toBe('A'); });
    it('converts 1 to B', () => { expect(colToLetter(1)).toBe('B'); });
    it('converts 25 to Z', () => { expect(colToLetter(25)).toBe('Z'); });
    it('converts 26 to AA', () => { expect(colToLetter(26)).toBe('AA'); });
    it('converts 27 to AB', () => { expect(colToLetter(27)).toBe('AB'); });
    it('converts 51 to AZ', () => { expect(colToLetter(51)).toBe('AZ'); });
    it('converts 52 to BA', () => { expect(colToLetter(52)).toBe('BA'); });
    it('converts 701 to ZZ', () => { expect(colToLetter(701)).toBe('ZZ'); });
    it('converts 702 to AAA', () => { expect(colToLetter(702)).toBe('AAA'); });
  });


  describe('positionToRef', () => {
    it('converts row 0, col 0 to A1', () => {
      expect(positionToRef({ row: 0, col: 0 })).toBe('A1');
    });
    it('converts row 1, col 1 to B2', () => {
      expect(positionToRef({ row: 1, col: 1 })).toBe('B2');
    });
    it('converts row 9, col 2 to C10', () => {
      expect(positionToRef({ row: 9, col: 2 })).toBe('C10');
    });
  });

  describe('refToRange', () => {
    it('parses A1:B2', () => {
      const result = refToRange('A1:B2');
      expect(result).toEqual({
        startRow: 0, startCol: 0,
        endRow: 1, endCol: 1,
      });
    });
    it('parses C3:D4', () => {
      const result = refToRange('C3:D4');
      expect(result).toEqual({
        startRow: 2, startCol: 2,
        endRow: 3, endCol: 3,
      });
    });
  });
});
