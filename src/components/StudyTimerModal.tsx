import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, RotateCcw, Save, X, BookOpen, Coffee, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyTimerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { subjects, activeTimer, startTimer, pauseTimer, resetTimer, saveSession } = useApp();
  const [selectedSubId, setSelectedSubId] = useState(subjects[0]?.id || '');
  const [slot, setSlot] = useState<'Morning' | 'Afternoon' | 'Night'>('Morning');
  const [notes, setNotes] = useState('');

  // Break Timer State (Pomodoro Focus & Break cycles)
  const [timerMode, setTimerMode] = useState<'study' | 'short_break' | 'long_break'>('study');
  const [breakSecondsLeft, setBreakSecondsLeft] = useState<number>(5 * 60);
  const [isBreakRunning, setIsBreakRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isBreakRunning && breakSecondsLeft > 0) {
      interval = setInterval(() => {
        setBreakSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsBreakRunning(false);
            try {
              confetti({ particleCount: 50, spread: 60 });
              new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcHCek3fPEkFclJqzV58WZXicmrNXnxZleJyas1efFmV4nJqzV58WZXic=').play().catch(() => {});
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakRunning, breakSecondsLeft]);

  if (!isOpen) return null;

  // Study timer display
  const minutes = Math.floor(activeTimer.elapsedSeconds / 60);
  const seconds = activeTimer.elapsedSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Break timer display
  const breakMin = Math.floor(breakSecondsLeft / 60);
  const breakSec = breakSecondsLeft % 60;
  const breakFormatted = `${String(breakMin).padStart(2, '0')}:${String(breakSec).padStart(2, '0')}`;

  const startBreak = (durationMins: number, mode: 'short_break' | 'long_break') => {
    // If active study timer is running, automatically pause it
    if (activeTimer.isRunning) {
      pauseTimer();
    }
    setTimerMode(mode);
    setBreakSecondsLeft(durationMins * 60);
    setIsBreakRunning(true);
  };

  const handleSave = () => {
    if (minutes === 0 && seconds < 10) {
      alert('Please study for at least 10 seconds before saving.');
      return;
    }
    saveSession(Math.max(1, minutes), slot, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {timerMode === 'study' ? (
              <>
                <BookOpen className="h-5 w-5 text-indigo-500" /> Focus Study Session Timer
              </>
            ) : (
              <>
                <Coffee className="h-5 w-5 text-amber-500" /> Study Break & Recharge
              </>
            )}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mt-4 grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setIsBreakRunning(false);
              setTimerMode('study');
            }}
            className={`py-2 rounded-lg transition ${
              timerMode === 'study'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            📖 Focus Study
          </button>
          <button
            onClick={() => startBreak(5, 'short_break')}
            className={`py-2 rounded-lg transition ${
              timerMode === 'short_break'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            ☕ 5m Quick Break
          </button>
          <button
            onClick={() => startBreak(15, 'long_break')}
            className={`py-2 rounded-lg transition ${
              timerMode === 'long_break'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            🌿 15m Long Break
          </button>
        </div>

        {timerMode === 'study' ? (
          <>
            {/* Digital Clock for Study */}
            <div className="my-6 text-center">
              <div className="text-6xl font-extrabold tracking-tight font-mono text-indigo-600 dark:text-indigo-400">
                {timeFormatted}
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {activeTimer.isRunning ? 'Active Study Session in Progress...' : 'Session Paused'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3 mb-6">
              <button
                onClick={() => {
                  if (activeTimer.isRunning) pauseTimer();
                  else startTimer(selectedSubId);
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
              >
                {activeTimer.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {activeTimer.isRunning ? 'Pause' : 'Start / Resume'}
              </button>
              <button
                onClick={resetTimer}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>

            {/* Form to log */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-500">Subject</label>
                <select
                  value={selectedSubId}
                  onChange={(e) => setSelectedSubId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Time Slot</label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {(['Morning', 'Afternoon', 'Night'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={`py-1.5 rounded-lg border text-xs font-semibold ${
                        slot === s
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Session Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Completed MapReduce Partitioners notes"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
              >
                <Save className="h-4 w-4" /> Save Study Session into Analytics
              </button>
            </div>
          </>
        ) : (
          /* Break Timer Screen */
          <div className="py-4 text-center space-y-5">
            <div className="my-4">
              <div className="text-6xl font-extrabold tracking-tight font-mono text-amber-500 dark:text-amber-400">
                {breakFormatted}
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                {isBreakRunning
                  ? 'Relax, stretch your eyes, hydrate, and prepare your mind!'
                  : breakSecondsLeft === 0
                  ? '🎉 Break Complete! Ready to resume studying?'
                  : 'Break Timer Paused'}
              </p>
            </div>

            {/* Break Controls */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsBreakRunning(!isBreakRunning)}
                className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold shadow-md transition"
              >
                {isBreakRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isBreakRunning ? 'Pause Break' : 'Resume Break'}
              </button>
              <button
                onClick={() => {
                  setBreakSecondsLeft(timerMode === 'short_break' ? 5 * 60 : 15 * 60);
                  setIsBreakRunning(false);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>

            {/* Preset quick break pickers */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-left space-y-2">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Coffee className="h-4 w-4 text-amber-600" /> Pomodoro Rest Recommendations:
              </div>
              <ul className="text-[11px] text-amber-800 dark:text-amber-300/90 list-disc list-inside space-y-1">
                <li>Look at an object 20 feet away for 20 seconds (20-20-20 Rule).</li>
                <li>Drink a glass of water and do light neck and shoulder stretches.</li>
                <li>Avoid social media feeds during short breaks to preserve cognitive focus.</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setIsBreakRunning(false);
                setTimerMode('study');
                startTimer(selectedSubId);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow"
            >
              🚀 Resume Focus Study Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
