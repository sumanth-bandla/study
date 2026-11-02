import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarDays, 
  Plus, 
  Sun, 
  Sunrise, 
  Moon, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { TimeSlot } from '../types';

export const PlannerView: React.FC<{ onOpenTimer: () => void }> = ({ onOpenTimer }) => {
  const { subjects, tasks, addTask, toggleTask, rescheduleTask, deleteTask } = useApp();

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [slot, setSlot] = useState<TimeSlot>('Morning');

  const filteredTasks = tasks.filter(t => t.scheduledDate === selectedDate);
  const morningTasks = filteredTasks.filter(t => t.slot === 'Morning');
  const afternoonTasks = filteredTasks.filter(t => t.slot === 'Afternoon');
  const nightTasks = filteredTasks.filter(t => t.slot === 'Night');

  // Automatic pending task detector for past unfinished tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => !t.completed && t.scheduledDate < todayStr);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedSubjectId) return;

    addTask({
      subjectId: selectedSubjectId,
      title: taskTitle.trim(),
      scheduledDate: selectedDate,
      slot
    });

    setTaskTitle('');
  };

  const handleRescheduleTomorrow = (taskId: string) => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    rescheduleTask(taskId, tomorrow);
  };

  const renderSlotSection = (title: string, slotTasks: typeof tasks, icon: any, color: string) => {
    const Icon = icon;
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{slotTasks.length} tasks</span>
        </div>

        {slotTasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">No tasks scheduled for this slot.</p>
        ) : (
          <div className="space-y-2">
            {slotTasks.map(t => {
              const sub = subjects.find(s => s.id === t.subjectId);
              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition ${
                    t.completed 
                      ? 'border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/20 dark:bg-emerald-950/20' 
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div 
                    onClick={() => toggleTask(t.id)}
                    className="flex items-start gap-2.5 flex-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => {}}
                      className="mt-0.5 h-4 w-4 rounded text-indigo-600"
                    />
                    <div>
                      <span className={`text-xs font-semibold ${t.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {t.title}
                      </span>
                      <div className="text-[10px] text-indigo-500 font-medium mt-0.5">
                        {sub?.name || 'General Subject'} {t.rescheduledCount > 0 ? `(Rescheduled ${t.rescheduledCount}x)` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {!t.completed && (
                      <button
                        onClick={() => handleRescheduleTomorrow(t.id)}
                        className="p-1 rounded text-slate-400 hover:text-amber-500"
                        title="Reschedule to Tomorrow"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500"
                      title="Delete Task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-indigo-500" />
            Smart Academic Study Planner
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize daily morning, afternoon, and night sessions with automated pending-task rollover.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
          />
          <button
            onClick={onOpenTimer}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow"
          >
            <Clock className="h-4 w-4" /> Focus Timer
          </button>
        </div>
      </div>

      {/* Overdue / Pending Task Alert Banner */}
      {overdueTasks.length > 0 && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                You have {overdueTasks.length} pending task(s) from past days!
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Unfinished study sessions should be rescheduled so your 5 units don't slip behind.
              </p>
            </div>
          </div>
          <button
            onClick={() => overdueTasks.forEach(t => rescheduleTask(t.id, todayStr))}
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm"
          >
            Reschedule All to Today
          </button>
        </div>
      )}

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Task title (e.g. Master MapReduce Combiner numericals)"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
        />
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white font-medium"
        >
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
          ))}
        </select>
        <div className="flex gap-2">
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value as TimeSlot)}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-2 text-xs font-semibold"
          >
            <option value="Morning">🌅 Morning</option>
            <option value="Afternoon">☀️ Afternoon</option>
            <option value="Night">🌙 Night</option>
          </select>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* 3 Slots: Morning, Afternoon, Night */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderSlotSection('Morning Session (06:00 - 12:00)', morningTasks, Sunrise, 'bg-amber-100 dark:bg-amber-900/40 text-amber-600')}
        {renderSlotSection('Afternoon Session (12:00 - 18:00)', afternoonTasks, Sun, 'bg-orange-100 dark:bg-orange-900/40 text-orange-600')}
        {renderSlotSection('Night Session (18:00 - 00:00)', nightTasks, Moon, 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600')}
      </div>
    </div>
  );
};
