import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  Save, 
  BookOpen,
  Share2
} from 'lucide-react';

export const NotesView: React.FC = () => {
  const { subjects, notes, addNote, updateNote, deleteNote } = useApp();

  const [selectedSubId, setSelectedSubId] = useState<string>('all');
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);

  // New Note state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSubId, setNewSubId] = useState(subjects[0]?.id || '');
  const [newUnitId, setNewUnitId] = useState(subjects[0]?.units[0]?.id || '');

  // Filter notes
  const filteredNotes = notes.filter(n => {
    if (selectedSubId !== 'all' && n.subjectId !== selectedSubId) return false;
    if (selectedUnitNumber !== 'all') {
      const sub = subjects.find(s => s.id === n.subjectId);
      const unit = sub?.units.find(u => u.id === n.unitId);
      if (unit?.unitNumber !== selectedUnitNumber) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    }
    return true;
  });

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addNote({
      subjectId: newSubId,
      unitId: newUnitId,
      title: newTitle.trim(),
      content: newContent
    });

    setIsCreating(false);
    setNewTitle('');
    setNewContent('');
  };

  const exportNote = (note: typeof notes[0]) => {
    const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-500" />
            Curriculum Notes & Document Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organized strictly by subject and units 1 to 5 with Markdown editing and download export.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow"
        >
          <Plus className="h-4 w-4" /> Create Study Note
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white"
          />
        </div>

        {/* Subject Filter */}
        <select
          value={selectedSubId}
          onChange={(e) => setSelectedSubId(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
        >
          <option value="all">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Unit Filter */}
        <select
          value={selectedUnitNumber}
          onChange={(e) => setSelectedUnitNumber(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
        >
          <option value="all">All Units (1-5)</option>
          <option value={1}>Unit 1</option>
          <option value={2}>Unit 2</option>
          <option value={3}>Unit 3</option>
          <option value={4}>Unit 4</option>
          <option value={5}>Unit 5</option>
        </select>
      </div>

      {/* Main Grid: Notes List + Editor / Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Notes List */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-2 max-h-[600px] overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No notes found. Create your first note!</p>
          ) : (
            filteredNotes.map(n => {
              const sub = subjects.find(s => s.id === n.subjectId);
              const unit = sub?.units.find(u => u.id === n.unitId);
              const isActive = activeNoteId === n.id;

              return (
                <div
                  key={n.id}
                  onClick={() => { setActiveNoteId(n.id); setIsCreating(false); }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    isActive 
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm' 
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-500">
                      {sub?.code || 'Subject'} • Unit {unit?.unitNumber || 1}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                    {n.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {n.content}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right 2 Columns: Editor or Reader */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm min-h-[500px]">
          {isCreating ? (
            /* Creation Form */
            <form onSubmit={handleSaveNew} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">New Study Note</h3>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newSubId}
                  onChange={(e) => {
                    setNewSubId(e.target.value);
                    const s = subjects.find(sub => sub.id === e.target.value);
                    if (s && s.units[0]) setNewUnitId(s.units[0].id);
                  }}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <select
                  value={newUnitId}
                  onChange={(e) => setNewUnitId(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                >
                  {subjects.find(s => s.id === newSubId)?.units.map(u => (
                    <option key={u.id} value={u.id}>Unit {u.unitNumber}: {u.title}</option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                required
                placeholder="Note title (e.g. MapReduce Partitioning and Combiners)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white font-semibold"
              />

              <textarea
                rows={14}
                required
                placeholder="Write in Markdown format (# Heading, - Bullet points, **bold**)..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white font-mono"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow"
                >
                  Save Note
                </button>
              </div>
            </form>
          ) : activeNote ? (
            /* Active Note Display & Quick Editor */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeNote.title}
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Last updated: {new Date(activeNote.updatedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportNote(activeNote)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs flex items-center gap-1 font-semibold"
                    title="Export to Markdown (.md)"
                  >
                    <Download className="h-3.5 w-3.5" /> Export .md
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this note permanently?')) {
                        deleteNote(activeNote.id);
                        setActiveNoteId(null);
                      }
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500"
                    title="Delete Note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Editable Markdown Content Area */}
              <textarea
                rows={16}
                value={activeNote.content}
                onChange={(e) => updateNote(activeNote.id, e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-4 text-xs font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
              <BookOpen className="h-10 w-10 text-indigo-400 mb-2 opacity-50" />
              <p className="text-xs">Select a note from the left or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
