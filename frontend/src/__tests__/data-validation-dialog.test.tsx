import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DataValidationDialog from '../components/spreadsheet/DataValidationDialog';

describe('DataValidationDialog', () => {
  const headers = ['Name', 'Alter', 'Stadt', 'Punkte'];

  const defaultProps = {
    visible: true,
    headers,
    onApply: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Visibility ───────────────────────────────────────────────

  it('renders when visible=true', () => {
    render(<DataValidationDialog {...defaultProps} />);
    expect(screen.getByText('Datenüberprüfung')).toBeInTheDocument();
  });

  it('does not render when visible=false', () => {
    render(<DataValidationDialog {...defaultProps} visible={false} />);
    expect(screen.queryByText('Datenüberprüfung')).toBeNull();
  });

  // ── Column Selection ─────────────────────────────────────────

  it('shows all headers in column selector', () => {
    render(<DataValidationDialog {...defaultProps} />);
    const select = screen.getByRole('combobox', { name: /spalte/i });
    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(4);
    expect(options[0].textContent).toBe('Name');
    expect(options[1].textContent).toBe('Alter');
  });

  it('defaults to first column (col=0)', () => {
    render(<DataValidationDialog {...defaultProps} />);
    const select = screen.getByRole('combobox', { name: /spalte/i }) as HTMLSelectElement;
    expect(select.value).toBe('0');
  });

  // ── Validation Type ──────────────────────────────────────────

  it('shows validation type selector', () => {
    render(<DataValidationDialog {...defaultProps} />);
    const typeSelect = screen.getByRole('combobox', { name: /typ/i }) as HTMLSelectElement;
    expect(typeSelect.value).toBe('number');
  });

  it('switching to list shows list input', () => {
    render(<DataValidationDialog {...defaultProps} />);
    const typeSelect = screen.getByRole('combobox', { name: /typ/i });

    fireEvent.change(typeSelect, { target: { value: 'list' } });

    // Should show list input with comma-separated placeholder
    expect(screen.getByPlaceholderText(/Ja.*Nein/i)).toBeInTheDocument();
  });

  it('switching to number shows min/max inputs', () => {
    render(<DataValidationDialog {...defaultProps} />);
    // Default is number — min/max should be visible
    expect(screen.getByText('Minimum:')).toBeInTheDocument();
    expect(screen.getByText('Maximum:')).toBeInTheDocument();
  });

  // ── Number Validation ────────────────────────────────────────

  it('applies valid number range rule', () => {
    const onApply = vi.fn();
    render(<DataValidationDialog {...defaultProps} onApply={onApply} />);

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '0' } });  // min
    fireEvent.change(inputs[1], { target: { value: '100' } }); // max

    fireEvent.click(screen.getByRole('button', { name: /übernehmen/i }));

    expect(onApply).toHaveBeenCalledWith({
      col: 0,
      type: 'number',
      min: 0,
      max: 100,
      list: undefined,
      errorMessage: 'Ungültiger Wert',
    });
  });

  it('shows error when min > max', () => {
    const onApply = vi.fn();
    render(<DataValidationDialog {...defaultProps} onApply={onApply} />);

    const inputs2 = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs2[0], { target: { value: '100' } });
    fireEvent.change(inputs2[1], { target: { value: '0' } });

    fireEvent.click(screen.getByRole('button', { name: /übernehmen/i }));

    // Should show inline error, not call onApply
    expect(screen.getByText(/Mindestwert darf nicht größer/i)).toBeInTheDocument();
    expect(onApply).not.toHaveBeenCalled();
  });

  it('allows min-only (no maximum)', () => {
    const onApply = vi.fn();
    render(<DataValidationDialog {...defaultProps} onApply={onApply} />);

    const inputs3 = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs3[0], { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: /übernehmen/i }));

    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({
      min: 5,
      max: undefined,
    }));
  });

  it('allows max-only (no minimum)', () => {
    const onApply = vi.fn();
    render(<DataValidationDialog {...defaultProps} onApply={onApply} />);

    const inputs4 = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs4[1], { target: { value: '50' } });

    fireEvent.click(screen.getByRole('button', { name: /übernehmen/i }));

    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({
      min: undefined,
      max: 50,
    }));
  });

  // ── List Validation ──────────────────────────────────────────

  it('applies list validation rule', () => {
    const onApply = vi.fn();
    render(<DataValidationDialog {...defaultProps} onApply={onApply} />);

    fireEvent.change(screen.getByRole('combobox', { name: /typ/i }), { target: { value: 'list' } });
    fireEvent.change(screen.getByPlaceholderText(/Ja.*Nein/i), { target: { value: 'Berlin,München,Hamburg' } });

    fireEvent.click(screen.getByRole('button', { name: /übernehmen/i }));

    expect(onApply).toHaveBeenCalledWith({
      col: 0,
      type: 'list',
      min: undefined,
      max: undefined,
      list: 'Berlin,München,Hamburg',
      errorMessage: 'Ungültiger Wert',
    });
  });

  // ── Error Message ────────────────────────────────────────────

  it('allows custom error message', () => {
    const onApply = vi.fn();
    render(<DataValidationDialog {...defaultProps} onApply={onApply} />);

    // The error message input has an initial value of 'Ungültiger Wert'
    const errorInput = screen.getByDisplayValue('Ungültiger Wert');
    fireEvent.change(errorInput, { target: { value: 'Bitte eine gültige Zahl eingeben' } });

    // Click button with text "Übernehmen"
    const applyBtn = screen.getByText('Übernehmen').closest('button')!;
    fireEvent.click(applyBtn);

    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({
      errorMessage: 'Bitte eine gültige Zahl eingeben',
    }));
  });

  // ── Close / Cancel ───────────────────────────────────────────

  it('calls onClose when cancel button clicked', () => {
    render(<DataValidationDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /schließen/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking overlay', () => {
    render(<DataValidationDialog {...defaultProps} />);
    // The overlay is the outermost div with class excel-dialog-overlay
    const overlay = document.querySelector('.excel-dialog-overlay');
    if (overlay) fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  // ── Empty headers ────────────────────────────────────────────

  it('renders with empty header as placeholder', () => {
    render(<DataValidationDialog {...defaultProps} headers={['', '', '']} />);
    const options = screen.getByRole('combobox', { name: /spalte/i }).querySelectorAll('option');
    expect(options[0].textContent).toBe('Spalte 1');
  });
});
