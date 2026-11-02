import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Flame, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string) => void;
  onOpenTimer: () => void;
}

export const DashboardView: React.FC<Props> = ({ onNavigate, onOpenTimer }) => {
  const { subjects, tasks, sessions, exams, revisions, backlogs, toggleTask } = useApp();

  const totalSubjects = subjects.length;
  const totalUnits = subjects.reduce((acc, sub) => acc + sub.units.length, 0);
  const completedUnits = subjects.reduce(
    (acc, sub) => acc + sub.units.filter(u => u.completed).length, 
    0
  );
  const pendingUnits = totalUnits - completedUnits;
  const overallPercentage = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  // Study hours for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const todayHours = (todayMinutes / 60).toFixed(1);

  // Today's tasks
  const todayTasks = tasks.filter(t => t.scheduledDate === todayStr);
  const completedTasksCount = todayTasks.filter(t => t.completed).length;

  // Next upcoming exam
  const sortedExams = [...exams].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
  const nextExam = sortedExams[0];
  const nextExamSubject = nextExam ? subjects.find(s => s.id === nextExam.subjectId) : null;
  const daysLeft = nextExam 
    ? Math.max(0, Math.ceil((new Date(nextExam.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  // Pending revisions due today
  const pendingRevisionsToday = revisions.filter(r => 
    (!r.rev1Done && r.rev1Date <= todayStr) || 
    (!r.rev2Done && r.rev2Date <= todayStr) || 
    (!r.rev3Done && r.rev3Date <= todayStr)
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome & Motivational Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Flame className="h-4 w-4 text-amber-300" /> B.Tech Academic Command Center
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
            StudyHub AI — Personal Study Manager
          </h1>
          <p className="mt-2 text-sm md:text-base text-indigo-100">
            {pendingUnits} units pending across {totalSubjects} core subjects. Next exam is {nextExamSubject ? `${nextExamSubject.name} in ${daysLeft} days.` : 'around the corner.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onOpenTimer}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-900 shadow-md transition hover:bg-indigo-50"
            >
              <Clock className="h-4 w-4 text-indigo-600" />
              Launch Focus Timer
            </button>
            <button
              onClick={() => onNavigate('ai_tutor')}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/30 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-indigo-500/40 border border-white/20"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              Ask Gemini AI Tutor
            </button>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 h-56 w-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Subjects & Units */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Subjects</span>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/40 p-2 text-blue-600 dark:text-blue-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalSubjects}</span>
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">({totalUnits} units total)</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            BDA, HRPM, SADP, DMGT, IoT, DE, ES, ADS
          </div>
        </div>

        {/* Units Completed */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Unit Completion</span>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/40 p-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{completedUnits}</span>
            <span className="text-xs text-slate-500">/ {totalUnits} Units</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Daily Study Hours */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Today's Study Time</span>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-900/40 p-2 text-purple-600 dark:text-purple-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{todayHours}h</span>
            <span className="ml-2 text-xs text-slate-500">/ 4.0h goal</span>
          </div>
          <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
            {todayMinutes} minutes logged today
          </div>
        </div>

        {/* Pending Revisions & Backlogs */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Spaced Revisions</span>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/40 p-2 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingRevisionsToday}</span>
            <span className="ml-2 text-xs text-slate-500">due today</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {backlogs.length} active backlog subject(s)
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Progress + Today's Planner Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subject 5-Unit Progress Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                Subject-Wise 5-Unit Mastery
              </h2>
              <p className="text-xs text-slate-500">Track 5 unit completion milestones for each B.Tech subject</p>
            </div>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              Manage Subjects <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            {subjects.map(subject => {
              const compUnits = subject.units.filter(u => u.completed).length;
              const subPercent = Math.round((compUnits / 5) * 100);

              return (
                <div key={subject.id} className="rounded-xl border border-slate-100 dark:border-slate-800/80 p-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {subject.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          Code: {subject.code} • Priority: <span className="font-medium text-slate-600 dark:text-slate-300">{subject.priority}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{compUnits}/5 Units</span>
                      <div className="text-[11px] text-slate-400">{subPercent}% complete</div>
                    </div>
                  </div>

                  {/* 5-Unit Blocks Visualizer */}
                  <div className="mt-3 grid grid-cols-5 gap-1.5">
                    {subject.units.map((unit) => (
                      <div 
                        key={unit.id}
                        title={`Unit ${unit.unitNumber}: ${unit.title} (${unit.completed ? 'Done' : 'Pending'})`}
                        className={`h-2.5 rounded-md transition-all ${
                          unit.completed 
                            ? 'bg-emerald-500 shadow-sm' 
                            : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Today's Tasks & Next Exam */}
        <div className="space-y-6">
          {/* Next Exam Countdown Card */}
          {nextExamSubject && (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/20 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Upcoming Examination
                </span>
                <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  {daysLeft} Days Left
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                {nextExamSubject.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Date: {new Date(nextExam.examDate).toLocaleDateString(undefined, { dateStyle: 'medium' })} • {nextExam.examType}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onNavigate('exam_prep')}
                  className="w-full rounded-lg bg-indigo-600 py-2 text-center text-xs font-bold text-white hover:bg-indigo-700 transition"
                >
                  Open Exam Prep & PYQs
                </button>
              </div>
            </div>
          )}

          {/* Today's Planner Checklist */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Today's Tasks ({completedTasksCount}/{todayTasks.length})
              </h3>
              <button
                onClick={() => onNavigate('planner')}
                className="text-xs text-indigo-500 font-medium hover:underline"
              >
                Open Planner
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No tasks scheduled for today. Add sessions in Planner!</p>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map(task => {
                  const sub = subjects.find(s => s.id === task.subjectId);
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        task.completed 
                          ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/20' 
                          : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="mt-0.5 h-4 w-4 rounded text-indigo-600 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-medium text-indigo-500">
                            {sub?.code || 'General'}
                          </span>
                          <span className="text-[10px] text-slate-400">• {task.slot}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
