import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, CheckCircle, Plus, ShieldCheck } from 'lucide-react';
import { Backlog, BacklogResult } from '../types';

export const BacklogView: React.FC = () => {
  const { backlogs, addBacklog, updateBacklog, deleteBacklog } = useApp();
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [sem, setSem] = useState(4);
  const [attempt, setAttempt] = useState(2);
  const [examDate, setExamDate] = useState('2026-12-20');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    addBacklog({
      subjectName: subName.trim(),
      subjectCode: subCode.trim() || 'BACKLOG01',
      semester: Number(sem),
      attemptNumber: Number(attempt),
      preparationStatus: 'In Progress',
      examDate,
      resultStatus: 'Pending',
      checklist: {
        syllabusCovered: false,
        pyqSolved: false,
        revisionDone: false
      }
    });

    setSubName('');
    setSubCode('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-100 dark:bg-red-900/40 p-3 text-red-600 dark:text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              University Backlog Clearance Engine
            </h1>
            <p className="text-xs text-slate-500">
              Track pending supplementary papers, attempt history, target exam dates, and clearance checklists.
            </p>
          </div>
        </div>

        {/* Form to Add Backlog */}
        <form onSubmit={handleAdd} className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Subject Name (e.g. FLAT)"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Subject Code"
            value={subCode}
            onChange={(e) => setSubCode(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Semester (1-8)"
            value={sem}
            onChange={(e) => setSem(Number(e.target.value))}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Attempt No."
            value={attempt}
            onChange={(e) => setAttempt(Number(e.target.value))}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700 shadow"
          >
            <Plus className="h-4 w-4" /> Add Backlog
          </button>
        </form>
      </div>

      {/* Backlog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {backlogs.map(bl => (
          <div key={bl.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                  Semester {bl.semester} • Attempt #{bl.attemptNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {bl.subjectName} ({bl.subjectCode})
                </h3>
                <p className="text-xs text-slate-400">Exam Date: {bl.examDate || 'TBD'}</p>
              </div>
              <select
                value={bl.resultStatus}
                onChange={(e) => updateBacklog(bl.id, { resultStatus: e.target.value as BacklogResult })}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-semibold"
              >
                <option value="Pending">Pending</option>
                <option value="Cleared">Cleared ✅</option>
                <option value="Failed">Failed ❌</option>
              </select>
            </div>

            {/* Clearance Progress Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-500">Clearance Milestones</label>
              {[
                { key: 'syllabusCovered', label: 'All 5 Units Covered & Notes Made' },
                { key: 'pyqSolved', label: 'Last 5 Years University PYQs Solved' },
                { key: 'revisionDone', label: 'Completed 1-7-30 Day Spaced Revisions' }
              ].map(item => {
                const checked = (bl.checklist as any)[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => updateBacklog(bl.id, {
                      checklist: {
                        ...bl.checklist,
                        [item.key]: !checked
                      }
                    })}
                    className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <input type="checkbox" checked={checked} onChange={() => {}} className="rounded text-red-600" />
                    <span className={checked ? 'line-through text-slate-400' : ''}>{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => deleteBacklog(bl.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove Tracker
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
