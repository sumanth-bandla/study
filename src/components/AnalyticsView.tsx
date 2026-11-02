import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle2, 
  Brain, 
  Flame,
  Target
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { subjects, sessions, revisions, quizResults } = useApp();

  const totalUnits = subjects.reduce((acc, sub) => acc + sub.units.length, 0);
  const completedUnits = subjects.reduce((acc, sub) => acc + sub.units.filter(u => u.completed).length, 0);
  const syllabusRate = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  // Total logged hours
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Spaced revision retention rate
  const totalRevStages = revisions.length * 3;
  const completedRevStages = revisions.reduce((acc, r) => {
    let count = 0;
    if (r.rev1Done) count++;
    if (r.rev2Done) count++;
    if (r.rev3Done) count++;
    return acc + count;
  }, 0);
  const revisionRate = totalRevStages > 0 ? Math.round((completedRevStages / totalRevStages) * 100) : 0;

  // Composite exam readiness score (60% syllabus, 20% revisions, 20% study hours)
  const readinessIndex = Math.min(100, Math.round(
    (syllabusRate * 0.6) + (revisionRate * 0.2) + (Math.min(100, (Number(totalHours) / 20) * 100) * 0.2)
  ));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 dark:bg-indigo-900/40 p-3 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Academic Performance & Readiness Analytics
            </h1>
            <p className="text-xs text-slate-500">
              Real-time calculations of 5-unit coverage, study time distribution, and revision retention.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Overall Readiness</span>
            <Target className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
            {readinessIndex}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Weighted Readiness Index</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>5-Unit Completion</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {syllabusRate}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{completedUnits} of {totalUnits} Units Finished</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Logged Study</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
            {totalHours}h
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Across all sessions</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Revision Adherence</span>
            <Brain className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            {revisionRate}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">1-7-30 Day review rate</p>
        </div>
      </div>

      {/* Subject-Wise Mastery Bars */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-500" />
          Subject-Wise Syllabus Progress (8 Core B.Tech Subjects)
        </h3>

        <div className="space-y-4">
          {subjects.map(sub => {
            const cUnits = sub.units.filter(u => u.completed).length;
            const pct = Math.round((cUnits / 5) * 100);

            return (
              <div key={sub.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span 
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: sub.color }}
                    />
                    <span className="text-slate-900 dark:text-white">{sub.name} ({sub.code})</span>
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400">{cUnits}/5 Units ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: sub.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
