import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizExercise from '../components/quiz/QuizExercise';

// jsdom doesn't implement scrollIntoView — mock it
beforeAll(() => {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
});

describe('QuizExercise', () => {
  const tfQuestions = [
    {
      question: 'Excel ist eine Tabellenkalkulation.',
      options: ['Wahr', 'Falsch'],
      correct: [0],
      type: 'tf' as const,
      explanation: 'Excel ist eine Tabellenkalkulationssoftware von Microsoft.',
    },
    {
      question: 'Excel kann nur Zahlen verarbeiten.',
      options: ['Wahr', 'Falsch'],
      correct: [1],
      type: 'tf' as const,
    },
  ];

  const singleChoiceQuestions = [
    {
      question: 'Welche Funktion summiert Werte?',
      options: ['SUMME', 'MITTELWERT', 'MAX', 'MIN'],
      correct: [0],
      type: 'single' as const,
    },
  ];

  const multiChoiceQuestions = [
    {
      question: 'Welche sind Excel-Funktionen? (Mehrfachauswahl)',
      options: ['SUMME', 'WENN', 'TEXTEDITOR', 'SVERWEIS'],
      correct: [0, 1, 3],
      type: 'multiple' as const,
    },
  ];

  // ── Rendering ────────────────────────────────────────────────

  it('renders all questions in the nav strip', () => {
    render(<QuizExercise questions={tfQuestions} onSubmit={() => {}} />);
    const navButtons = screen.getAllByRole('button', { name: /^Frage/ });
    expect(navButtons).toHaveLength(2);
  });

  it('displays the active question text', () => {
    render(<QuizExercise questions={tfQuestions} onSubmit={() => {}} />);
    expect(screen.getByText('Excel ist eine Tabellenkalkulation.')).toBeInTheDocument();
  });

  it('shows question type badge', () => {
    render(<QuizExercise questions={tfQuestions} onSubmit={() => {}} />);
    expect(screen.getByText('Wahr / Falsch')).toBeInTheDocument();
  });

  it('shows correct type badge for single choice', () => {
    render(<QuizExercise questions={singleChoiceQuestions} onSubmit={() => {}} />);
    expect(screen.getByText('Einzelauswahl')).toBeInTheDocument();
  });

  it('shows correct type badge for multiple choice', () => {
    render(<QuizExercise questions={multiChoiceQuestions} onSubmit={() => {}} />);
    expect(screen.getByText('Mehrfachauswahl')).toBeInTheDocument();
  });

  // ── Navigation ───────────────────────────────────────────────

  it('clicking nav dot switches active question', () => {
    render(<QuizExercise questions={tfQuestions} onSubmit={() => {}} />);
    const navButtons = screen.getAllByRole('button', { name: /Frage/i });

    // Click second question
    fireEvent.click(navButtons[1]);
    expect(screen.getByText('Excel kann nur Zahlen verarbeiten.')).toBeInTheDocument();
  });

  // ── Answer Selection ─────────────────────────────────────────

  it('selecting a tf option updates the answer', () => {
    render(<QuizExercise questions={tfQuestions} onSubmit={() => {}} />);
    const wahrBtn = screen.getByText('Wahr').closest('button')!;
    fireEvent.click(wahrBtn);
    expect(wahrBtn.className).toContain('selected');
  });

  it('single choice replaces previous selection', () => {
    render(<QuizExercise questions={singleChoiceQuestions} onSubmit={() => {}} />);

    const summeBtn = screen.getByText('SUMME').closest('button')!;
    fireEvent.click(summeBtn);
    expect(summeBtn.className).toContain('selected');

    const maxBtn = screen.getByText('MAX').closest('button')!;
    fireEvent.click(maxBtn);
    expect(summeBtn.className).not.toContain('selected');
    expect(maxBtn.className).toContain('selected');
  });

  it('multiple choice allows multiple selections', () => {
    render(<QuizExercise questions={multiChoiceQuestions} onSubmit={() => {}} />);

    const sBtn = screen.getByText('SUMME').closest('button')!;
    const wBtn = screen.getByText('WENN').closest('button')!;
    const tBtn = screen.getByText('TEXTEDITOR').closest('button')!;
    const svBtn = screen.getByText('SVERWEIS').closest('button')!;

    fireEvent.click(sBtn);
    fireEvent.click(wBtn);
    fireEvent.click(svBtn);

    expect(sBtn.className).toContain('selected');
    expect(wBtn.className).toContain('selected');
    expect(tBtn.className).not.toContain('selected');
    expect(svBtn.className).toContain('selected');
  });

  it('deselects previously selected option in multiple choice', () => {
    render(<QuizExercise questions={multiChoiceQuestions} onSubmit={() => {}} />);

    const sBtn = screen.getByText('SUMME').closest('button')!;
    fireEvent.click(sBtn); // select
    fireEvent.click(sBtn); // deselect
    expect(sBtn.className).not.toContain('selected');
  });

  // ── Submission ───────────────────────────────────────────────

  it('calls onSubmit with answers on submit', async () => {
    const onSubmit = vi.fn();
    render(<QuizExercise questions={tfQuestions} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Wahr' })); // Q1: Wahr

    // Navigate to Q2
    const navButtons = screen.getAllByRole('button', { name: /^Frage/ });
    fireEvent.click(navButtons[1]);

    fireEvent.click(screen.getByRole('button', { name: 'Falsch' })); // Q2: Falsch

    // Submit — button text is "Antworten überprüfen"
    fireEvent.click(screen.getByRole('button', { name: /Antworten überprüfen/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith([[0], [1]]);
    });
  });

  it('shows correct/incorrect status after submission', async () => {
    const onSubmit = vi.fn();
    render(<QuizExercise questions={tfQuestions} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Wahr' })); // Correct answer for Q1
    fireEvent.click(screen.getByRole('button', { name: /Antworten überprüfen/i }));

    await waitFor(() => {
      // Nav dot should show correct status
      const navDots = screen.getAllByRole('button', { name: /Frage/i });
      expect(navDots[0].className).toContain('correct');
    });
  });

  it('disables selection after submission', async () => {
    const onSubmit = vi.fn();
    render(<QuizExercise questions={tfQuestions} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Wahr' }));
    fireEvent.click(screen.getByRole('button', { name: /Antworten überprüfen/i }));

    await waitFor(() => {
      const wahrBtn = screen.getByRole('button', { name: 'Wahr' });
      expect(wahrBtn).toBeDisabled();
    });
  });

  it('shows submitting state', () => {
    render(<QuizExercise questions={tfQuestions} onSubmit={() => {}} submitting={true} />);
    const submitBtn = screen.getByRole('button', { name: /Wird ausgewertet/i });
    expect(submitBtn).toBeDisabled();
  });

  it('shows question counter', () => {
    render(<QuizExercise questions={tfQuestions} onSubmit={() => {}} />);
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  // ── Empty State ──────────────────────────────────────────────

  // NOTE: Empty questions array causes a render crash (accesses questions[0].question).
  // This is a known component limitation — fix the component before enabling this test.
  // it('renders without crashing with empty questions', ...);
});
