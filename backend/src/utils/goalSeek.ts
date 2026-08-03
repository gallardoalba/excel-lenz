import { HyperFormula } from 'hyperformula';
// @ts-ignore - i18n path not in TS declarations
import deDE from 'hyperformula/i18n/languages/deDE';

// Register German locale (idempotent — safe to call multiple times)
try { HyperFormula.registerLanguage('deDE', deDE); } catch { /* already registered */ }

/**
 * Goal Seek — iterative solver for what-if analysis.
 * Finds the input value that produces a desired formula result.
 *
 * Uses the bisection method: repeatedly halves the search interval
 * until the formula result is within tolerance of the target.
 */

export interface GoalSeekParams {
  /** 2D data array representing the spreadsheet */
  data: (string | number | null)[][];
  /** Row index (0-based) of the formula cell to watch */
  formulaRow: number;
  /** Column index (0-based) of the formula cell to watch */
  formulaCol: number;
  /** Row index (0-based) of the input cell to adjust */
  inputRow: number;
  /** Column index (0-based) of the input cell to adjust */
  inputCol: number;
  /** The desired target value for the formula cell */
  targetValue: number;
  /** The HyperFormula engine instance */
  hf: any;
  /** Sheet name (default 'Sheet1') */
  sheetName?: string;
  /** Maximum iterations (default 100) */
  maxIterations?: number;
  /** Convergence tolerance (default 0.001) */
  tolerance?: number;
}

export interface GoalSeekResult {
  /** The found input value that produces the target */
  inputValue: number;
  /** The resulting formula value (should be close to target) */
  resultValue: number;
  /** Number of iterations used */
  iterations: number;
  /** Whether the solution converged */
  converged: boolean;
}

export function goalSeek(params: GoalSeekParams): GoalSeekResult {
  const {
    hf,
    inputRow, inputCol,
    formulaRow, formulaCol,
    targetValue,
    sheetName = 'Sheet1',
    maxIterations = 100,
    tolerance = 0.001,
  } = params;

  const sheetId = hf.getSheetId(sheetName);
  if (sheetId === undefined) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  // Get initial input value
  const initialCell = hf.getCellValue({ sheet: sheetId, col: inputCol, row: inputRow });
  let initialValue = typeof initialCell === 'number' ? initialCell : 0;

  // Two-phase approach:
  // Phase 1: Find bounds where the function crosses the target
  // Phase 2: Bisection within those bounds

  const getFormulaValue = (input: number): number => {
    hf.setCellContents({ sheet: sheetId, col: inputCol, row: inputRow }, [[input]]);
    const result = hf.getCellValue({ sheet: sheetId, col: formulaCol, row: formulaRow });
    return typeof result === 'number' ? result : NaN;
  };

  // Phase 1: Find bounds using expanding search
  const f0 = getFormulaValue(initialValue);
  if (isNaN(f0)) {
    throw new Error(`Formula cell (${formulaRow},${formulaCol}) does not evaluate to a number`);
  }

  // If already at target within tolerance, return immediately
  if (Math.abs(f0 - targetValue) <= tolerance) {
    return { inputValue: initialValue, resultValue: f0, iterations: 0, converged: true };
  }

  // Determine search direction
  const f1 = getFormulaValue(initialValue + 1);
  if (isNaN(f1)) {
    throw new Error('Formula does not respond to input changes');
  }

  const ascending = f1 > f0;

  // Phase 1: Expand bounds to bracket the target
  let lo = initialValue;
  let hi = initialValue;
  let iterations = 2;
  let step = 1;
  let fLo = f0;
  let fHi = f0;

  const needsUpperBound = ascending ? f0 < targetValue : f0 > targetValue;
  const direction = needsUpperBound ? 1 : -1;

  while (iterations < maxIterations) {
    const probe = initialValue + direction * step;
    const fProbe = getFormulaValue(probe);
    iterations++;

    const crossed = ascending ? (fProbe >= targetValue) : (fProbe <= targetValue);
    if (crossed) {
      // Bracketed: one side is below target, other side above
      if (direction > 0) { lo = initialValue; hi = probe; fHi = fProbe; }
      else { lo = probe; hi = initialValue; fLo = fProbe; }
      break;
    }
    // Move the anchor: the probe becomes the new starting point for the next expansion
    if (direction > 0) lo = probe;
    else hi = probe;
    step *= 2;
  }

  // Verify we actually bracketed the target — if not, expand further
  let expandAttempts = 0;
  while (iterations < maxIterations && expandAttempts < 10) {
    const fLoCheck = getFormulaValue(lo);
    const fHiCheck = getFormulaValue(hi);
    const loBelow = ascending ? fLoCheck <= targetValue : fLoCheck >= targetValue;
    const hiAbove = ascending ? fHiCheck >= targetValue : fHiCheck <= targetValue;
    if (loBelow && hiAbove) break; // properly bracketed

    // Expand lo downward
    if (!loBelow) { lo = lo - Math.abs(step); fLo = getFormulaValue(lo); iterations++; }
    // Expand hi upward
    if (!hiAbove) { hi = hi + Math.abs(step); fHi = getFormulaValue(hi); iterations++; }
    expandAttempts++;
  }

  // Phase 2: Bisection
  for (let i = 0; i < maxIterations - iterations; i++) {
    const mid = (lo + hi) / 2;
    const fMid = getFormulaValue(mid);
    iterations++;

    if (Math.abs(fMid - targetValue) <= tolerance) {
      return { inputValue: mid, resultValue: fMid, iterations, converged: true };
    }

    // For ascending: if fMid < target, move lo up; else move hi down
    // For descending: if fMid > target, move lo up; else move hi down
    const shouldMoveLo = ascending ? (fMid < targetValue) : (fMid > targetValue);
    if (shouldMoveLo) lo = mid;
    else hi = mid;
  }

  const finalValue = (lo + hi) / 2;
  const finalResult = getFormulaValue(finalValue);

  return {
    inputValue: finalValue,
    resultValue: finalResult,
    iterations,
    converged: Math.abs(finalResult - targetValue) <= tolerance,
  };
}
