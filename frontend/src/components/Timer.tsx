import { useState, useEffect } from 'react';

interface TimerProps {
  initialMinutes: number;
  onTimeUp?: () => void;
}

export const Timer = ({ initialMinutes, onTimeUp }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft <= 60; // Less than 1 minute left

  return (
    <div className={`flex items-center gap-2 font-jetbrains font-bold text-xl px-4 py-2 rounded-lg border-[0.5px] ${isWarning ? 'bg-error-container text-on-error-container border-error' : 'bg-surface-container text-on-surface border-outline-variant'}`}>
      <span className="material-symbols-outlined">timer</span>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};
