import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Star, 
  ChevronRight, 
  AlertCircle,
  Download
} from 'lucide-react';

export const ExamPrepView: React.FC = () => {
  const { subjects, exams } = useApp();
  const [selectedSubId, setSelectedSubId] = useState<string>(subjects[0]?.id || '');

  // Live countdown ticker state
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const selectedSubject = subjects.find(s => s.id === selectedSubId);
  const selectedExam = exams.find(e => e.subjectId === selectedSubId);

  // Calculate countdown components
  const targetTime = selectedExam ? new Date(selectedExam.examDate).getTime() : 0;
  const diff = Math.max(0, targetTime - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Subject unit completion percentage
  const compUnits = selectedSubject ? selectedSubject.units.filter(u => u.completed).length : 0;
  const readinessScore = Math.round((compUnits / 5) * 100);

  // Mock PYQ bank
  const pyqs = [
    { year: '2025 Regular', title: `${selectedSubject?.code} University Semester Exam Paper`, solved: true },
    { year: '2024 Supplementary', title: `${selectedSubject?.code} Supply Question Paper`, solved: false },
    { year: '2023 Regular', title: `${selectedSubject?.code} Regular End-Sem Exam Paper`, solved: true }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-indigo-500" />
            University Examination Preparation Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time exam countdown clocks, 5-unit readiness score, and previous question papers (PYQs).
          </p>
        </div>

        {/* Subject Switcher */}
        <select
          value={selectedSubId}
          onChange={(e) => setSelectedSubId(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
        >
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
          ))}
        </select>
      </div>

      {/* Main Countdown & Readiness Card */}
      <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
              Exam: {selectedExam?.examType || 'Final Semester Exam'}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {selectedSubject?.name} ({selectedSubject?.code})
            </h2>
            <p className="text-xs text-indigo-200">
              Scheduled: {selectedExam ? new Date(selectedExam.examDate).toLocaleString() : 'Date Pending'} • Venue: {selectedExam?.room || 'Main Exam Hall'}
            </p>
          </div>

          {/* Digital Flip Countdown */}
          <div className="flex items-center gap-3">
            {[
              { val: days, label: 'Days' },
              { val: hours, label: 'Hours' },
              { val: minutes, label: 'Mins' },
              { val: seconds, label: 'Secs' }
            ].map((t, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-mono font-extrabold shadow-inner">
                  {String(t.val).padStart(2, '0')}
                </div>
                <span className="text-[10px] text-indigo-300 uppercase font-semibold mt-1">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-extrabold text-emerald-400">{readinessScore}%</div>
            <div>
              <div className="text-xs font-bold text-white">5-Unit Syllabus Readiness Index</div>
              <div className="text-[11px] text-indigo-200">{compUnits} of 5 Units completely mastered</div>
            </div>
          </div>

          <div className="flex gap-2">
            {selectedSubject?.units.map(u => (
              <div 
                key={u.id}
                title={`Unit ${u.unitNumber}: ${u.title}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  u.completed ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                U{u.unitNumber} {u.completed ? '✓' : '...'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Unit Breakdown & PYQ Repository */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5-Unit Checklist */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            5-Unit Syllabus Examination Coverage
          </h3>

          <div className="space-y-3">
            {selectedSubject?.units.map(unit => (
              <div key={unit.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-500 uppercase">Unit {unit.unitNumber}</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{unit.title}</h4>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {unit.topics.length} syllabus topics included
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  unit.completed 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                }`}>
                  {unit.completed ? 'Ready for Exam' : 'Revision Incomplete'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Previous Year Question Papers (PYQs) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-500" />
            Previous Years University Question Papers (PYQs)
          </h3>

          <div className="space-y-3">
            {pyqs.map((paper, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-500">{paper.year}</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{paper.title}</h4>
                  <p className="text-[10px] text-slate-400">Includes 7-mark & 2-mark questions</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${paper.solved ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-400'}`}>
                    {paper.solved ? 'Solved' : 'Unsolved'}
                  </span>
                  <button 
                    onClick={() => alert(`Opening sample PYQ for ${paper.title}`)}
                    className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
