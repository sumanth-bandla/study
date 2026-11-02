import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAITutorResponse, TutorMode } from '../services/geminiService';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  Copy, 
  FileText,
  Key
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AITutorView: React.FC = () => {
  const { subjects, apiKey, setApiKey, saveQuizResult } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedUnitId, setSelectedUnitId] = useState(subjects[0]?.units[0]?.id || '');
  const [selectedTopicId, setSelectedTopicId] = useState(subjects[0]?.units[0]?.topics[0]?.id || '');
  const [customPrompt, setCustomPrompt] = useState('');
  const [mode, setMode] = useState<TutorMode>('seven_mark_answer');
  const [studyContext, setStudyContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const [quizData, setQuizData] = useState<any[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentUnit = currentSubject?.units.find(u => u.id === selectedUnitId);
  const currentTopic = currentUnit?.topics.find(t => t.id === selectedTopicId);

  const handleGenerate = async () => {
    if (!currentSubject || !currentUnit) return;
    setIsLoading(true);
    setQuizData(null);
    setQuizSubmitted(false);
    setUserAnswers({});

    const topicTitle = currentTopic?.title || 'Core Syllabus Unit Concepts';

    const response = await generateAITutorResponse({
      subjectName: currentSubject.name,
      unitNumber: currentUnit.unitNumber,
      unitTitle: currentUnit.title,
      topicTitle,
      mode,
      userPrompt: customPrompt,
      studyMaterialContext: studyContext,
      apiKey
    });

    setAiOutput(response);
    setIsLoading(false);

    if (mode === 'practice_mcqs') {
      try {
        const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed)) {
          setQuizData(parsed);
        }
      } catch (err) {
        // Fallback: render as text
      }
    }
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    if (!quizData) return;
    setQuizSubmitted(true);
    let score = 0;
    quizData.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score++;
    });

    saveQuizResult({
      subjectId: selectedSubjectId,
      unitId: selectedUnitId,
      score,
      total: quizData.length
    });

    if (score === quizData.length) {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & API Key Alert */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            Gemini AI Study Tutor & Exam Question Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate 7-mark university answers, step-by-step proofs, formulas, and practice MCQs.
          </p>
        </div>

        {/* API Key Input */}
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-slate-400" />
          <input
            type="password"
            placeholder="Enter Gemini API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subject / Unit / Topic Selection & Controls */}
        <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-500" />
            Target Syllabus Selection
          </h2>

          {/* Subject Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                const sub = subjects.find(s => s.id === e.target.value);
                if (sub && sub.units[0]) {
                  setSelectedUnitId(sub.units[0].id);
                  if (sub.units[0].topics[0]) setSelectedTopicId(sub.units[0].topics[0].id);
                }
              }}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-medium text-slate-900 dark:text-white"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          {/* Unit Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Unit (1 to 5)</label>
            <select
              value={selectedUnitId}
              onChange={(e) => {
                setSelectedUnitId(e.target.value);
                const unit = currentSubject?.units.find(u => u.id === e.target.value);
                if (unit && unit.topics[0]) setSelectedTopicId(unit.topics[0].id);
              }}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-medium text-slate-900 dark:text-white"
            >
              {currentSubject?.units.map(u => (
                <option key={u.id} value={u.id}>Unit {u.unitNumber}: {u.title}</option>
              ))}
            </select>
          </div>

          {/* Topic Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Topic</label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-medium text-slate-900 dark:text-white"
            >
              {currentUnit?.topics.map(t => (
                <option key={t.id} value={t.id}>{t.title} {t.isImportant ? '⭐ (Important)' : ''}</option>
              ))}
            </select>
          </div>

          {/* AI Mode Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Tutor Generation Mode</label>
            <div className="mt-2 grid grid-cols-1 gap-1.5">
              {[
                { id: 'seven_mark_answer', label: '📝 7-Mark University Answer', desc: 'Full-credit diagram & steps' },
                { id: 'simple_explain', label: '💡 Simple English (ELI5)', desc: 'Intuitive analogies' },
                { id: 'short_notes', label: '📌 High-Yield Short Notes', desc: 'Bullet points & formulas' },
                { id: 'practice_mcqs', label: '🎯 Interactive Practice MCQs', desc: 'Quiz with scoring' },
                { id: 'important_questions', label: '⭐ Important University Qs', desc: 'Frequently asked list' },
                { id: 'revision_summary', label: '⚡ Rapid Revision Summary', desc: '3-minute recap' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id as TutorMode)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition ${
                    mode === item.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Study Material Context */}
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Optional Study Material Context (Avoids Hallucination)
            </label>
            <textarea
              rows={3}
              value={studyContext}
              onChange={(e) => setStudyContext(e.target.value)}
              placeholder="Paste lecture excerpts or textbook syllabus points here..."
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Custom Question */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Custom Clarification (Optional)</label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Include a neat comparison table"
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Gemini Generating Answer...
              </span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Generate with Gemini AI
              </>
            )}
          </button>
        </div>

        {/* Right 2 Columns: AI Output & Interactive Quiz Player */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentTopic?.title || 'Academic Tutor Output'}
              </span>
            </div>
            {aiOutput && (
              <button
                onClick={() => navigator.clipboard.writeText(aiOutput)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                title="Copy Markdown"
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            )}
          </div>

          <div className="mt-4 flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-3" />
                <p className="text-xs">Synthesizing engineering knowledge & university format...</p>
              </div>
            ) : quizData ? (
              /* Interactive MCQ Quiz View */
              <div className="space-y-6">
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-4 border border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                      Interactive Practice Quiz
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">
                      Topic: {currentTopic?.title} • {quizData.length} Questions
                    </p>
                  </div>
                  {quizSubmitted && (
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                        {quizData.filter((q, i) => userAnswers[i] === q.correctIndex).length} / {quizData.length}
                      </span>
                      <div className="text-[10px] text-slate-400">Final Score</div>
                    </div>
                  )}
                </div>

                {quizData.map((q, qIdx) => (
                  <div key={qIdx} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Q{qIdx + 1}. {q.question}
                    </p>
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt: string, optIdx: number) => {
                        const isSelected = userAnswers[qIdx] === optIdx;
                        const isCorrect = q.correctIndex === optIdx;
                        let optionClass = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40';

                        if (quizSubmitted) {
                          if (isCorrect) optionClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                          else if (isSelected && !isCorrect) optionClass = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200';
                        } else if (isSelected) {
                          optionClass = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 font-bold';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleOptionSelect(qIdx, optIdx)}
                            className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${optionClass}`}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <p className="mt-2 text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 font-bold text-xs text-white hover:bg-emerald-700 shadow"
                  >
                    Submit Quiz & Save Score
                  </button>
                ) : (
                  <button
                    onClick={() => { setQuizSubmitted(false); setUserAnswers({}); }}
                    className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-white"
                  >
                    Retake Quiz
                  </button>
                )}
              </div>
            ) : aiOutput ? (
              <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {aiOutput}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                <Sparkles className="h-10 w-10 text-indigo-400 mb-2 opacity-50" />
                <p className="text-xs">Select your Subject and Unit, then click "Generate with Gemini AI".</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
