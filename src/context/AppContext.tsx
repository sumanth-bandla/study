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
import { getUserStorageKey } from '../lib/userSecurity';

interface AppContextType {
  userId?: string;
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

export const AppProvider: React.FC<{ children: React.ReactNode; currentUserId?: string }> = ({ 
  children, 
  currentUserId = 'default_student' 
}) => {
  // Helper to get key either per-user or legacy fallback for the default user
  const getKey = (dataKey: string) => {
    return currentUserId ? getUserStorageKey(currentUserId, dataKey) : `STUDYHUB_${dataKey}`;
  };

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const key = getKey('SUBJECTS');
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // For legacy default student, load initial B.Tech demo curriculum.
    // For a newly registered user, start with a pristine workspace!
    return currentUserId === 'default_student' ? INITIAL_SUBJECTS : [];
  });

  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    const key = getKey('TASKS');
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return currentUserId === 'default_student' ? INITIAL_TASKS : [];
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const key = getKey('SESSIONS');
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return currentUserId === 'default_student' ? [
      { id: 's1', subjectId: 'sub-bda', date: new Date().toISOString().split('T')[0], durationMinutes: 75, slot: 'Morning', notesSummary: 'HDFS and NameNode high availability' },
      { id: 's2', subjectId: 'sub-sadp', date: new Date().toISOString().split('T')[0], durationMinutes: 50, slot: 'Afternoon', notesSummary: 'Design patterns in Java' }
    ] : [];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const key = getKey('NOTES');
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return currentUserId === 'default_student' ? [
      {
        id: 'n1',
        subjectId: 'sub-bda',
        unitId: 'u-bda-1',
        title: 'HDFS NameNode vs DataNode High Availability Notes',
        content: '# HDFS Architecture & Fault Tolerance\n\n- **NameNode**: Master node maintaining filesystem namespace, directory tree, and file block mappings.\n- **DataNodes**: Slave nodes that store actual block replicas (default 3x replication factor).\n- **Secondary NameNode**: Periodically checkpoints edit logs into fsimage; does NOT act as a live standby failover!\n- **ZooKeeper FailoverController (ZKFC)**: Used in production Hadoop clusters for automatic active-standby NameNode election.',
        updatedAt: new Date().toISOString(),
        tags: ['Hadoop', 'HDFS', 'Storage']
      }
    ] : [];
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const key = getKey('EXAMS');
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return currentUserId === 'default_student' ? INITIAL_EXAMS : [];
  });

  const [revisions, setRevisions] = useState<RevisionItem[]>(() => {
    const key = getKey('REVISIONS');
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return currentUserId === 'default_student' ? INITIAL_REVISIONS : [];
  });

  const [backlogs, setBacklogs] = useState<Backlog[]>(() => {
    const key = getKey('BACKLOGS');
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return currentUserId === 'default_student' ? INITIAL_BACKLOGS : [];
  });

  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    const key = getKey('QUIZZES');
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
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

  // Save to isolated per-user localStorage & shadow backup
  useEffect(() => {
    localStorage.setItem(getKey('SUBJECTS'), JSON.stringify(subjects));
    localStorage.setItem(getKey('TASKS'), JSON.stringify(tasks));
    localStorage.setItem(getKey('SESSIONS'), JSON.stringify(sessions));
    localStorage.setItem(getKey('NOTES'), JSON.stringify(notes));
    localStorage.setItem(getKey('EXAMS'), JSON.stringify(exams));
    localStorage.setItem(getKey('REVISIONS'), JSON.stringify(revisions));
    localStorage.setItem(getKey('BACKLOGS'), JSON.stringify(backlogs));
    localStorage.setItem(getKey('QUIZZES'), JSON.stringify(quizResults));
    localStorage.setItem('STUDYHUB_THEME', theme);
    localStorage.setItem('STUDYHUB_GEMINI_KEY', apiKey);

    // Continuous data backup snapshot
    createDataBackup({ subjects, tasks, sessions, notes, exams, revisions, backlogs });
  }, [subjects, tasks, sessions, notes, exams, revisions, backlogs, quizResults, theme, apiKey, currentUserId]);

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

  // Sync theme to root HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // SUBJECT & UNIT METHODS
  const addSubject = (sub: Omit<Subject, 'id' | 'units'>) => {
    const newSubject: Subject = {
      ...sub,
      id: `sub_${Date.now()}`,
      units: [1, 2, 3, 4, 5].map(uNum => ({
        id: `u_${Date.now()}_${uNum}`,
        unitNumber: uNum,
        title: `Unit ${uNum}: Core Curriculum Topics`,
        completed: false,
        topics: [
          { id: `top_${Date.now()}_${uNum}_1`, title: `Unit ${uNum} Essential Principle`, completed: false, isImportant: true },
          { id: `top_${Date.now()}_${uNum}_2`, title: `Unit ${uNum} Architecture & Operations`, completed: false },
          { id: `top_${Date.now()}_${uNum}_3`, title: `Unit ${uNum} University Problem Solving`, completed: false }
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
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      return {
        ...s,
        units: s.units.map(u => {
          if (u.id !== unitId) return u;
          const nextCompleted = !u.completed;
          return {
            ...u,
            completed: nextCompleted,
            topics: u.topics.map(t => ({ ...t, completed: nextCompleted }))
          };
        })
      };
    }));
  };

  const toggleTopicCompletion = (subjectId: string, unitId: string, topicId: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      return {
        ...s,
        units: s.units.map(u => {
          if (u.id !== unitId) return u;
          const updatedTopics = u.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t);
          const allTopicsDone = updatedTopics.every(t => t.completed);
          return {
            ...u,
            topics: updatedTopics,
            completed: allTopicsDone
          };
        })
      };
    }));
  };

  const addTopic = (subjectId: string, unitId: string, title: string, isImportant: boolean = false) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      return {
        ...s,
        units: s.units.map(u => {
          if (u.id !== unitId) return u;
          return {
            ...u,
            topics: [...u.topics, { id: `top_${Date.now()}`, title, completed: false, isImportant }]
          };
        })
      };
    }));
  };

  // TASK ACTIONS
  const addTask = (task: Omit<DailyTask, 'id' | 'completed' | 'rescheduledCount'>) => {
    const newTask: DailyTask = {
      ...task,
      id: `task_${Date.now()}`,
      completed: false,
      rescheduledCount: 0
    };
    setTasks(prev => [...prev, newTask]);
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

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // NOTES
  const addNote = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, content: string, title?: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id !== id) return n;
      return {
        ...n,
        content,
        title: title || n.title,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // TIMER & SESSIONS
  const startTimer = (subjectId: string, unitId?: string) => {
    setActiveTimer({
      isRunning: true,
      elapsedSeconds: 0,
      subjectId,
      unitId
    });
  };

  const pauseTimer = () => {
    setActiveTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setActiveTimer({
      isRunning: false,
      elapsedSeconds: 0
    });
  };

  const saveSession = (durationMinutes: number, slot: TimeSlot, notesSummary?: string) => {
    if (!activeTimer.subjectId) return;
    const newSession: StudySession = {
      id: `session_${Date.now()}`,
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

  // REVISIONS
  const toggleRevisionDone = (revId: string, stage: 1 | 2 | 3) => {
    setRevisions(prev => prev.map(r => {
      if (r.id !== revId) return r;
      if (stage === 1) return { ...r, rev1Done: !r.rev1Done };
      if (stage === 2) return { ...r, rev2Done: !r.rev2Done };
      if (stage === 3) return { ...r, rev3Done: !r.rev3Done };
      return r;
    }));
  };

  const addRevisionItem = (item: Omit<RevisionItem, 'id' | 'rev1Done' | 'rev2Done' | 'rev3Done'>) => {
    const newRev: RevisionItem = {
      ...item,
      id: `rev_${Date.now()}`,
      rev1Done: false,
      rev2Done: false,
      rev3Done: false
    };
    setRevisions(prev => [newRev, ...prev]);
  };

  // BACKLOGS
  const addBacklog = (bl: Omit<Backlog, 'id'>) => {
    const newBL: Backlog = {
      ...bl,
      id: `bl_${Date.now()}`
    };
    setBacklogs(prev => [...prev, newBL]);
  };

  const updateBacklog = (id: string, updates: Partial<Backlog>) => {
    setBacklogs(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBacklog = (id: string) => {
    setBacklogs(prev => prev.filter(b => b.id !== id));
  };

  // QUIZ RESULTS
  const saveQuizResult = (res: Omit<QuizResult, 'id' | 'date'>) => {
    const newRes: QuizResult = {
      ...res,
      id: `quiz_${Date.now()}`,
      date: new Date().toISOString()
    };
    setQuizResults(prev => [newRes, ...prev]);
  };

  // RESTORE
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
        userId: currentUserId,
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
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
