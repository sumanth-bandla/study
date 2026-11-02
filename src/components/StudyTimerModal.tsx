import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, RotateCcw, Save, X, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyTimerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { subjects, activeTimer, startTimer, pauseTimer, resetTimer, saveSession } = useApp();
  const [selectedSubId, setSelectedSubId] = useState(subjects[0]?.id || '');
  const [slot, setSlot] = useState<'Morning' | 'Afternoon' | 'Night'>('Morning');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const minutes = Math.floor(activeTimer.elapsedSeconds / 60);
  const seconds = activeTimer.elapsedSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

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
            <BookOpen className="h-5 w-5 text-indigo-500" /> Focus Study Session Timer
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Digital Clock */}
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
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
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
      </div>
    </div>
  );
};
