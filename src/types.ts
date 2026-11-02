export type Priority = 'High' | 'Medium' | 'Low';
export type TimeSlot = 'Morning' | 'Afternoon' | 'Night';
export type PrepStatus = 'Not Started' | 'In Progress' | 'Ready' | 'Exam Taken';
export type BacklogResult = 'Pending' | 'Cleared' | 'Failed';

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
  isImportant?: boolean;
}

export interface Unit {
  id: string;
  unitNumber: number; // Strictly 1 to 5
  title: string;
  completed: boolean;
  topics: Topic[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  priority: Priority;
  examDate?: string;
  color: string;
  units: Unit[]; // Strictly 5 units
}

export interface DailyTask {
  id: string;
  subjectId: string;
  unitId?: string;
  title: string;
  scheduledDate: string; // YYYY-MM-DD
  slot: TimeSlot;
  completed: boolean;
  rescheduledCount: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  unitId?: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  slot: TimeSlot;
  notesSummary?: string;
}

export interface Note {
  id: string;
  subjectId: string;
  unitId: string;
  title: string;
  content: string;
  updatedAt: string;
  tags?: string[];
  attachmentName?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  examDate: string;
  examType: string;
  targetScore: number;
  room?: string;
  pyqLinks?: { year: string; title: string; url?: string }[];
}

export interface RevisionItem {
  id: string;
  subjectId: string;
  unitId: string;
  topicTitle: string;
  initialDate: string;
  rev1Date: string; // +1 day
  rev1Done: boolean;
  rev2Date: string; // +7 days
  rev2Done: boolean;
  rev3Date: string; // +30 days
  rev3Done: boolean;
}

export interface Backlog {
  id: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  attemptNumber: number;
  preparationStatus: PrepStatus;
  examDate?: string;
  resultStatus: BacklogResult;
  checklist: {
    syllabusCovered: boolean;
    pyqSolved: boolean;
    revisionDone: boolean;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  id: string;
  subjectId: string;
  unitId: string;
  score: number;
  total: number;
  date: string;
}
