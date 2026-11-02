import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Star, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  BookOpen,
  AlertCircle
} from 'lucide-react';
import { Priority } from '../types';

export const SubjectsView: React.FC = () => {
  const { 
    subjects, 
    addSubject, 
    updateSubject, 
    deleteSubject, 
    toggleUnitCompletion, 
    toggleTopicCompletion, 
    addTopic 
  } = useApp();

  const [expandedSubId, setExpandedSubId] = useState<string | null>(subjects[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubPriority, setNewSubPriority] = useState<Priority>('High');
  const [newSubColor, setNewSubColor] = useState('#6366f1');
  const [newSubExamDate, setNewSubExamDate] = useState('');

  // Topic input state map
  const [newTopicTexts, setNewTopicTexts] = useState<{ [key: string]: string }>({});

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) return;

    addSubject({
      code: newSubCode.trim().toUpperCase(),
      name: newSubName.trim(),
      priority: newSubPriority,
      color: newSubColor,
      examDate: newSubExamDate || undefined
    });

    setNewSubCode('');
    setNewSubName('');
    setShowAddModal(false);
  };

  const handleAddTopicToUnit = (subjectId: string, unitId: string) => {
    const text = newTopicTexts[unitId];
    if (!text || !text.trim()) return;
    addTopic(subjectId, unitId, text.trim(), false);
    setNewTopicTexts(prev => ({ ...prev, [unitId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-500" />
            Subject & 5-Unit Curriculum Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage course curriculum, 5 syllabus units, topics checklist, priorities, and exam deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Subject
        </button>
      </div>

      {/* Subjects Accordion List */}
      <div className="space-y-4">
        {subjects.map(subject => {
          const isExpanded = expandedSubId === subject.id;
          const completedUnitsCount = subject.units.filter(u => u.completed).length;
          const pct = Math.round((completedUnitsCount / 5) * 100);

          return (
            <div 
              key={subject.id} 
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition"
            >
              {/* Subject Header Bar */}
              <div 
                onClick={() => setExpandedSubId(isExpanded ? null : subject.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className="h-4 w-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: subject.color }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {subject.name}
                      </span>
                      <span className="text-xs font-mono font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                        {subject.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        subject.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' :
                        subject.priority === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300' :
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                      }`}>
                        {subject.priority}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Exam: {subject.examDate || 'Not Scheduled'}</span>
                      <span>•</span>
                      <span>{completedUnitsCount} of 5 Units Completed ({pct}%)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex gap-1">
                    {subject.units.map(u => (
                      <div 
                        key={u.id}
                        className={`h-2 w-6 rounded-full ${u.completed ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete ${subject.name}? All 5 units will be removed.`)) {
                        deleteSubject(subject.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition"
                    title="Delete Subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </div>
              </div>

              {/* 5 Units Details (Accordion Body) */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subject.units.map(unit => {
                      const completedTopics = unit.topics.filter(t => t.completed).length;

                      return (
                        <div 
                          key={unit.id}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2.5">
                              <button
                                onClick={() => toggleUnitCompletion(subject.id, unit.id)}
                                className="mt-0.5"
                                title="Toggle entire unit completion"
                              >
                                {unit.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : (
                                  <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600 hover:text-indigo-500" />
                                )}
                              </button>
                              <div>
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                                  Unit {unit.unitNumber}
                                </span>
                                <h4 className={`text-xs font-bold ${unit.completed ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                                  {unit.title}
                                </h4>
                                <div className="text-[10px] text-slate-400">
                                  {completedTopics} / {unit.topics.length} topics finished
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Topics Checklist */}
                          <div className="space-y-1.5 pl-6">
                            {unit.topics.map(topic => (
                              <div
                                key={topic.id}
                                onClick={() => toggleTopicCompletion(subject.id, unit.id, topic.id)}
                                className="flex items-center justify-between text-xs cursor-pointer group"
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={topic.completed}
                                    onChange={() => {}}
                                    className="h-3.5 w-3.5 rounded text-indigo-600"
                                  />
                                  <span className={topic.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                                    {topic.title}
                                  </span>
                                </div>
                                {topic.isImportant && (
                                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Quick Add Topic Input */}
                          <div className="pt-2 flex gap-2">
                            <input
                              type="text"
                              placeholder="Add topic to this unit..."
                              value={newTopicTexts[unit.id] || ''}
                              onChange={(e) => setNewTopicTexts({ ...newTopicTexts, [unit.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddTopicToUnit(subject.id, unit.id);
                              }}
                              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                            />
                            <button
                              onClick={() => handleAddTopicToUnit(subject.id, unit.id)}
                              className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-indigo-700"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add New Subject (5 Units Auto-Scaffolded)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Creates the subject and pre-configures all 5 academic units ready for topic planning.
            </p>

            <form onSubmit={handleCreateSubject} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Computing & DevOps"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500">Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS609PC"
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500">Priority</label>
                  <select
                    value={newSubPriority}
                    onChange={(e) => setNewSubPriority(e.target.value as Priority)}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Examination Date (Optional)</label>
                <input
                  type="date"
                  value={newSubExamDate}
                  onChange={(e) => setNewSubExamDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
