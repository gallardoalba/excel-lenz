import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DailyGoalState {
  target: number;
  completed: number;
}

interface DailyGoalContextType {
  goal: DailyGoalState | null;
  setGoal: (g: DailyGoalState | null) => void;
  increment: () => void;
}

const DailyGoalContext = createContext<DailyGoalContextType>({
  goal: null,
  setGoal: () => {},
  increment: () => {},
});

export function DailyGoalProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState<DailyGoalState | null>(null);

  const increment = useCallback(() => {
    setGoal(prev => prev ? { ...prev, completed: prev.completed + 1 } : prev);
  }, []);

  return (
    <DailyGoalContext.Provider value={{ goal, setGoal, increment }}>
      {children}
    </DailyGoalContext.Provider>
  );
}

export function useDailyGoal() {
  return useContext(DailyGoalContext);
}
