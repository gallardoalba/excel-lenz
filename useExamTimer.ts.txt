// ── useExamTimer: Countdown timer for exam mode ──────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';

export function useExamTimer(durationInMinutes: number, onTimeUp: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(durationInMinutes * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  const start = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setTimeout(() => onTimeUpRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback((newDuration?: number) => {
    stop();
    setSecondsLeft((newDuration ?? durationInMinutes) * 60);
  }, [stop, durationInMinutes]);

  useEffect(() => {
    return stop;
  }, [stop]);

  const hours = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;
  const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return {
    secondsLeft,
    timeString,
    isUrgent: secondsLeft <= 300,
    isTimeUp: secondsLeft === 0,
    start,
    stop,
    reset,
  };
}
