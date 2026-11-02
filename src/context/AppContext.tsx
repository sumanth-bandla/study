import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Subject, 
  DailyTask, 
  StudySession, 
  Note, 
  Exam, 
  RevisionItem, 
  Backlog, 
  QuizResult,
  TimeSlot 
} from '../types';
import { 
  INITIAL_SUBJECTS, 
  INITIAL_TASKS, 
  INITIAL_REVISIONS, 
  INITIAL_BACKLOGS,
  INITIAL_EXAMS 
} from '../data/initialData';
import { createDataBackup } from '../lib/accidentalLossGuard';

interface AppContextType {
  subjects: Subject[];
  tasks: DailyTask[];
  sessions: StudySession[];
  notes: Note[];
  exams: Exam[];
  revisions: RevisionItem[];
  backlogs: Backlog[];
  quizResults: QuizResult[];
  theme: 'dark' | 'light';
  apiKey: string;
  activeTimer: { isRunning: boolean; elapsedSeconds: number; subjectId?: string; unitId?: string };
  toggleTheme: () => void;
  setApiKey: (key: string) => void;
  // Subject & Unit CRUD
  addSubject: (sub: Omit<Subject, 'id' | 'units'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  toggleUnitCompletion: (subjectId: string, unitId: string) => void;
  toggleTopicCompletion: (subjectId: string, unitId: string, topicId: string) => void;
  addTopic: (subjectId: string, unitId: string, title: string, isImportant?: boolean) => void;
  // Task actions
  addTask: (task: Omit<DailyTask, 'id' | 'completed' | 'rescheduledCount'>) => void;
  toggleTask: (id: string) => void;
  rescheduleTask: (id: string, targetDate: string, targetSlot?: TimeSlot) => void;
  deleteTask: (id: string) => void;
  // Notes
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, content: string, title?: string) => void;
  deleteNote: (id: string) => void;
  // Timer & Study Sessions
  startTimer: (subjectId: string, unitId?: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  saveSession: (durationMinutes: number, slot: TimeSlot, notes?: string) => void;
  // Revisions
  toggleRevisionDone: (revId: string, stage: 1 | 2 | 3) => void;
  addRevisionItem: (item: Omit<RevisionItem, 'id' | 'rev1Done' | 'rev2Done' | 'rev3Done'>) => void;
  // Backlogs
  addBacklog: (bl: Omit<Backlog, 'id'>) => void;
  updateBacklog: (id: string, updates: Partial<Backlog>) => void;
  deleteBacklog: (id: string) => void;
  // Quiz
  saveQuizResult: (res: Omit<QuizResult, 'id' | 'date'>) => void;
  // Full Reset / Restore
  restoreAllData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('STUDYHUB_SUBJECTS');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem('STUDYHUB_TASKS');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('STUDYHUB_SESSIONS');
    return saved ? JSON.parse(saved) : [
      { id: 's1', subjectId: 'sub-bda', date: new Date().toISOString().split('T')[0], durationMinutes: 75, slot: 'Morning', notesSummary: 'HDFS and NameNode high availability' },
      { id: 's2', subjectId: 'sub-sadp', date: new Date().toISOString().split('T')[0], durationMinutes: 50, slot: 'Afternoon', notesSummary: 'Design patterns in Java' }
    ];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('STUDYHUB_NOTES');
    return saved ? JSON.parse(saved) : [
      {
        id: 'n1',
        subjectId: 'sub-bda',
        unitId: 'u-bda-1',
        title: 'HDFS NameNode vs DataNode High Availability Notes',
        content: '# HDFS Architecture & Fault Tolerance\n\n- **NameNode**: Master node maintaining filesystem namespace, directory tree, and file block mappings.\n- **DataNodes**: Slave nodes that store actual block replicas (default 3x replication factor).\n- **Secondary NameNode**: Periodically checkpoints edit logs into fsimage; does NOT act as a live standby failover!\n- **ZooKeeper FailoverController (ZKFC)**: Used in production Hadoop clusters for automatic active-standby NameNode election.',
        updatedAt: new Date().toISOString(),
        tags: ['Hadoop', 'HDFS', 'Storage']
      },
      {
        id: 'n2',
        subjectId: 'sub-ads',
        unitId: 'u-ads-1',
        title: 'AVL Tree Rotation Summary & Height Balancing',
        content: '# AVL Tree Rotations\n\nBalance Factor = Height(Left Subtree) - Height(Right Subtree)\nPermissible Balance Factors: -1, 0, +1.\n\n### 4 Rotation Types:\n1. **LL (Left of Left)**: Single Right Rotation.\n2. **RR (Right of Right)**: Single Left Rotation.\n3. **LR (Right of Left)**: Double Rotation (Left on child, then Right on root).\n4. **RL (Left of Right)**: Double Rotation (Right on child, then Left on root).\n\n*Time Complexity: Search, Insert, Delete all strictly O(log N).*',
        updatedAt: new Date().toISOString(),
        tags: ['Trees', 'AVL', 'Algorithms']
      }
    ];
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('STUDYHUB_EXAMS');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [revisions, setRevisions] = useState<RevisionItem[]>(() => {
    const saved = localStorage.getItem('STUDYHUB_REVISIONS');
    return saved ? JSON.parse(saved) : INITIAL_REVISIONS;
  });

  const [backlogs, setBacklogs] = useState<Backlog[]>(() => {
    const saved = localStorage.getItem('STUDYHUB_BACKLOGS');
    return saved ? JSON.parse(saved) : INITIAL_BACKLOGS;
  });

  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('STUDYHUB_QUIZZES');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('STUDYHUB_THEME') as 'dark' | 'light') || 'dark';
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('STUDYHUB_GEMINI_KEY') || '';
  });

  const [activeTimer, setActiveTimer] = useState<{ isRunning: boolean; elapsedSeconds: number; subjectId?: string; unitId?: string }>({
    isRunning: false,
    elapsedSeconds: 0
  });

  // Save to localStorage & auto shadow backup
  useEffect(() => {
    localStorage.setItem('STUDYHUB_SUBJECTS', JSON.stringify(subjects));
    localStorage.setItem('STUDYHUB_TASKS', JSON.stringify(tasks));
    localStorage.setItem('STUDYHUB_SESSIONS', JSON.stringify(sessions));
    localStorage.setItem('STUDYHUB_NOTES', JSON.stringify(notes));
    localStorage.setItem('STUDYHUB_EXAMS', JSON.stringify(exams));
    localStorage.setItem('STUDYHUB_REVISIONS', JSON.stringify(revisions));
    localStorage.setItem('STUDYHUB_BACKLOGS', JSON.stringify(backlogs));
    localStorage.setItem('STUDYHUB_QUIZZES', JSON.stringify(quizResults));
    localStorage.setItem('STUDYHUB_THEME', theme);
    localStorage.setItem('STUDYHUB_GEMINI_KEY', apiKey);

    // Continuous data backup snapshot
    createDataBackup({ subjects, tasks, sessions, notes, exams, revisions, backlogs });
  }, [subjects, tasks, sessions, notes, exams, revisions, backlogs, quizResults, theme, apiKey]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer(prev => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer.isRunning]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Subject CRUD
  const addSubject = (sub: Omit<Subject, 'id' | 'units'>) => {
    const newSubject: Subject = {
      ...sub,
      id: 'sub-' + Date.now(),
      units: [1, 2, 3, 4, 5].map(uNum => ({
        id: `u-${Date.now()}-${uNum}`,
        unitNumber: uNum,
        title: `Unit ${uNum} - Core Syllabus`,
        completed: false,
        topics: [
          { id: `t-${Date.now()}-${uNum}-1`, title: `Syllabus Overview & Fundamental Concepts`, completed: false }
        ]
      }))
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const toggleUnitCompletion = (subjectId: string, unitId: string) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id !== subjectId) return sub;
      return {
        ...sub,
        units: sub.units.map(unit => {
          if (unit.id !== unitId) return unit;
          const nextVal = !unit.completed;
          return {
            ...unit,
            completed: nextVal,
            topics: unit.topics.map(t => ({ ...t, completed: nextVal }))
          };
        })
      };
    }));
  };

  const toggleTopicCompletion = (subjectId: string, unitId: string, topicId: string) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id !== subjectId) return sub;
      return {
        ...sub,
        units: sub.units.map(unit => {
          if (unit.id !== unitId) return unit;
          const nextTopics = unit.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t);
          const allDone = nextTopics.length > 0 && nextTopics.every(t => t.completed);
          return {
            ...unit,
            completed: allDone,
            topics: nextTopics
          };
        })
      };
    }));
  };

  const addTopic = (subjectId: string, unitId: string, title: string, isImportant = false) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id !== subjectId) return sub;
      return {
        ...sub,
        units: sub.units.map(unit => {
          if (unit.id !== unitId) return unit;
          return {
            ...unit,
            completed: false,
            topics: [...unit.topics, { id: 'top-' + Date.now(), title, completed: false, isImportant }]
          };
        })
      };
    }));
  };

  // Task Actions
  const addTask = (task: Omit<DailyTask, 'id' | 'completed' | 'rescheduledCount'>) => {
    const newTask: DailyTask = {
      ...task,
      id: 'task-' + Date.now(),
      completed: false,
      rescheduledCount: 0
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const rescheduleTask = (id: string, targetDate: string, targetSlot?: TimeSlot) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        scheduledDate: targetDate,
        slot: targetSlot || t.slot,
        rescheduledCount: t.rescheduledCount + 1
      };
    }));
  };

  const deleteTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  // Notes
  const addNote = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: 'note-' + Date.now(),
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, content: string, title?: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { 
      ...n, 
      content, 
      title: title || n.title, 
      updatedAt: new Date().toISOString() 
    } : n));
  };

  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));

  // Timer
  const startTimer = (subjectId: string, unitId?: string) => {
    setActiveTimer({
      isRunning: true,
      elapsedSeconds: 0,
      subjectId,
      unitId
    });
  };

  const pauseTimer = () => {
    setActiveTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setActiveTimer({ isRunning: false, elapsedSeconds: 0 });
  };

  const saveSession = (durationMinutes: number, slot: TimeSlot, notesSummary?: string) => {
    if (!activeTimer.subjectId) return;
    const newSession: StudySession = {
      id: 'sess-' + Date.now(),
      subjectId: activeTimer.subjectId,
      unitId: activeTimer.unitId,
      date: new Date().toISOString().split('T')[0],
      durationMinutes,
      slot,
      notesSummary
    };
    setSessions(prev => [newSession, ...prev]);
    resetTimer();
  };

  // Revisions
  const toggleRevisionDone = (revId: string, stage: 1 | 2 | 3) => {
    setRevisions(prev => prev.map(r => {
      if (r.id !== revId) return r;
      if (stage === 1) return { ...r, rev1Done: !r.rev1Done };
      if (stage === 2) return { ...r, rev2Done: !r.rev2Done };
      return { ...r, rev3Done: !r.rev3Done };
    }));
  };

  const addRevisionItem = (item: Omit<RevisionItem, 'id' | 'rev1Done' | 'rev2Done' | 'rev3Done'>) => {
    const newItem: RevisionItem = {
      ...item,
      id: 'rev-' + Date.now(),
      rev1Done: false,
      rev2Done: false,
      rev3Done: false
    };
    setRevisions(prev => [...prev, newItem]);
  };

  // Backlogs
  const addBacklog = (bl: Omit<Backlog, 'id'>) => {
    const newBl: Backlog = { ...bl, id: 'bl-' + Date.now() };
    setBacklogs(prev => [...prev, newBl]);
  };

  const updateBacklog = (id: string, updates: Partial<Backlog>) => {
    setBacklogs(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBacklog = (id: string) => setBacklogs(prev => prev.filter(b => b.id !== id));

  // Quiz
  const saveQuizResult = (res: Omit<QuizResult, 'id' | 'date'>) => {
    const newRes: QuizResult = {
      ...res,
      id: 'quiz-' + Date.now(),
      date: new Date().toISOString()
    };
    setQuizResults(prev => [newRes, ...prev]);
  };

  const restoreAllData = (data: any) => {
    if (data.subjects) setSubjects(data.subjects);
    if (data.tasks) setTasks(data.tasks);
    if (data.sessions) setSessions(data.sessions);
    if (data.notes) setNotes(data.notes);
    if (data.exams) setExams(data.exams);
    if (data.revisions) setRevisions(data.revisions);
    if (data.backlogs) setBacklogs(data.backlogs);
  };

  return (
    <AppContext.Provider
      value={{
        subjects,
        tasks,
        sessions,
        notes,
        exams,
        revisions,
        backlogs,
        quizResults,
        theme,
        apiKey,
        activeTimer,
        toggleTheme,
        setApiKey,
        addSubject,
        updateSubject,
        deleteSubject,
        toggleUnitCompletion,
        toggleTopicCompletion,
        addTopic,
        addTask,
        toggleTask,
        rescheduleTask,
        deleteTask,
        addNote,
        updateNote,
        deleteNote,
        startTimer,
        pauseTimer,
        resetTimer,
        saveSession,
        toggleRevisionDone,
        addRevisionItem,
        addBacklog,
        updateBacklog,
        deleteBacklog,
        saveQuizResult,
        restoreAllData
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
