// ── useExamTimer: Countdown timer for exam mode ──────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react';

export function useExamTimer(durationInMinutes: number, onTimeUp: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(durationInMinutes * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endTimeRef = useRef<number>(0);
  const secondsLeftRef = useRef(secondsLeft);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;
  secondsLeftRef.current = secondsLeft;

  const start = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    endTimeRef.current = Date.now() + secondsLeftRef.current * 1000;
    intervalRef.current = setInterval(() => {
      const remaining = Math.round((endTimeRef.current - Date.now()) / 1000);
      if (remaining <= 0) {
        setSecondsLeft(0);
        clearInterval(intervalRef.current!);
        timeoutRef.current = setTimeout(() => onTimeUpRef.current(), 0);
      } else {
        setSecondsLeft(remaining);
      }
    }, 500);
  }, []); // Stable callback — uses refs for latest values

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
    return () => {
      stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
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
