import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Brain, CheckCircle2, Plus, Clock, Sparkles } from 'lucide-react';

export const RevisionView: React.FC = () => {
  const { subjects, revisions, toggleRevisionDone, addRevisionItem } = useApp();

  const [selectedSubId, setSelectedSubId] = useState(subjects[0]?.id || '');
  const [topicName, setTopicName] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim() || !selectedSubId) return;

    const sub = subjects.find(s => s.id === selectedSubId);
    const unitId = sub?.units[0]?.id || 'u-default';

    const now = new Date();
    const d1 = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const d7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const d30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    addRevisionItem({
      subjectId: selectedSubId,
      unitId,
      topicTitle: topicName.trim(),
      initialDate: todayStr,
      rev1Date: d1,
      rev2Date: d7,
      rev3Date: d30
    });

    setTopicName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 dark:bg-purple-900/40 p-3 text-purple-600 dark:text-purple-400">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Spaced Repetition & Revision Management
            </h1>
            <p className="text-xs text-slate-500">
              Science-backed retention intervals: Review 1 (+1 day), Review 2 (+7 days), Review 3 (+30 days).
            </p>
          </div>
        </div>

        {/* Add Topic to Spaced Repetition */}
        <form onSubmit={handleAdd} className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={selectedSubId}
            onChange={(e) => setSelectedSubId(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="Enter studied topic (e.g. MapReduce Partitioners)"
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow"
          >
            <Plus className="h-4 w-4" /> Schedule 1-7-30 Day Revisions
          </button>
        </form>
      </div>

      {/* Revision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revisions.map(rev => {
          const sub = subjects.find(s => s.id === rev.subjectId);

          return (
            <div key={rev.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                    {sub?.name || 'Subject'}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {rev.topicTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400">First studied: {rev.initialDate}</p>
                </div>
              </div>

              {/* 3 Interval Stages */}
              <div className="grid grid-cols-3 gap-2">
                {/* Stage 1: Day 1 */}
                <div 
                  onClick={() => toggleRevisionDone(rev.id, 1)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-center ${
                    rev.rev1Done 
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' 
                      : rev.rev1Date <= todayStr 
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20' 
                        : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">1-Day Rev</div>
                  <div className="text-[10px] text-slate-400">{rev.rev1Date}</div>
                  <div className="mt-2 flex justify-center">
                    <CheckCircle2 className={`h-4 w-4 ${rev.rev1Done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`} />
                  </div>
                </div>

                {/* Stage 2: Day 7 */}
                <div 
                  onClick={() => toggleRevisionDone(rev.id, 2)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-center ${
                    rev.rev2Done 
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' 
                      : rev.rev2Date <= todayStr 
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20' 
                        : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">7-Day Rev</div>
                  <div className="text-[10px] text-slate-400">{rev.rev2Date}</div>
                  <div className="mt-2 flex justify-center">
                    <CheckCircle2 className={`h-4 w-4 ${rev.rev2Done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`} />
                  </div>
                </div>

                {/* Stage 3: Day 30 */}
                <div 
                  onClick={() => toggleRevisionDone(rev.id, 3)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-center ${
                    rev.rev3Done 
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' 
                      : rev.rev3Date <= todayStr 
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20' 
                        : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">30-Day Rev</div>
                  <div className="text-[10px] text-slate-400">{rev.rev3Date}</div>
                  <div className="mt-2 flex justify-center">
                    <CheckCircle2 className={`h-4 w-4 ${rev.rev3Done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
