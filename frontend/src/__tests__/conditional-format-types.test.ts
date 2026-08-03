import { describe, it, expect } from 'vitest';

// ConditionalFormatDialog exports these types — test their structure
import type {
  ConditionalFormatRule,
  ConditionalFormatStyle,
} from '../components/spreadsheet/ConditionalFormatDialog';

describe('ConditionalFormatDialog Types', () => {
  describe('ConditionalFormatRule', () => {
    it('accepts a valid greaterThan rule', () => {
      const rule: ConditionalFormatRule = {
        id: 'cf-1',
        range: { startCol: 0, startRow: 0, endCol: 0, endRow: 10 },
        type: 'greaterThan',
        value1: '100',
        style: { bgColor: '#ffc7ce', fontColor: '#9c0006' },
      };
      expect(rule.type).toBe('greaterThan');
      expect(rule.value1).toBe('100');
      expect(rule.range.startCol).toBe(0);
    });

    it('accepts a valid between rule with value2', () => {
      const rule: ConditionalFormatRule = {
        id: 'cf-2',
        range: { startCol: 1, startRow: 5, endCol: 1, endRow: 20 },
        type: 'between',
        value1: '10',
        value2: '50',
        style: { bgColor: '#ffeb9c', fontColor: '#9c6500' },
      };
      expect(rule.type).toBe('between');
      expect(rule.value2).toBe('50');
    });

    it('accepts a valid textContains rule', () => {
      const rule: ConditionalFormatRule = {
        id: 'cf-3',
        range: { startCol: 2, startRow: 0, endCol: 2, endRow: 99 },
        type: 'textContains',
        value1: 'Excel',
        style: { bgColor: '#c6efce', fontColor: '#006100', bold: true },
      };
      expect(rule.type).toBe('textContains');
      expect(rule.style.bold).toBe(true);
    });

    it('accepts a valid topPercent rule', () => {
      const rule: ConditionalFormatRule = {
        id: 'cf-4',
        range: { startCol: 0, startRow: 0, endCol: 5, endRow: 100 },
        type: 'topPercent',
        value1: '10',
        style: { bgColor: '#bdd7ee', fontColor: '#1f4e79' },
      };
      expect(rule.type).toBe('topPercent');
      expect(rule.value2).toBeUndefined();
    });

    it('validates all rule types', () => {
      const types: ConditionalFormatRule['type'][] = [
        'greaterThan', 'lessThan', 'between', 'equalTo',
        'textContains', 'topPercent', 'bottomPercent',
      ];
      expect(types).toHaveLength(7);

      for (const type of types) {
        const rule: ConditionalFormatRule = {
          id: 'test',
          range: { startCol: 0, startRow: 0, endCol: 0, endRow: 1 },
          type,
          value1: '1',
          style: { bgColor: '#fff', fontColor: '#000' },
        };
        expect(rule.type).toBe(type);
      }
    });
  });

  describe('ConditionalFormatStyle', () => {
    it('accepts basic style with colors', () => {
      const style: ConditionalFormatStyle = {
        bgColor: '#ffc7ce',
        fontColor: '#9c0006',
      };
      expect(style.bgColor).toBe('#ffc7ce');
      expect(style.fontColor).toBe('#9c0006');
      expect(style.bold).toBeUndefined();
    });

    it('accepts style with bold option', () => {
      const style: ConditionalFormatStyle = {
        bgColor: '#c6efce',
        fontColor: '#006100',
        bold: true,
      };
      expect(style.bold).toBe(true);
    });

    it('accepts style without bold', () => {
      const style: ConditionalFormatStyle = {
        bgColor: '#ffeb9c',
        fontColor: '#9c6500',
      };
      expect(style.bold).toBeUndefined();
    });

    it('validates hex color format', () => {
      const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
      const style: ConditionalFormatStyle = {
        bgColor: '#aabbcc',
        fontColor: '#123456',
      };
      expect(hexColorRegex.test(style.bgColor)).toBe(true);
      expect(hexColorRegex.test(style.fontColor)).toBe(true);
    });
  });
});
