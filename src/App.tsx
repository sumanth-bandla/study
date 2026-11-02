import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DashboardView } from './components/DashboardView';
import { SubjectsView } from './components/SubjectsView';
import { PlannerView } from './components/PlannerView';
import { AITutorView } from './components/AITutorView';
import { NotesView } from './components/NotesView';
import { ExamPrepView } from './components/ExamPrepView';
import { RevisionView } from './components/RevisionView';
import { BacklogView } from './components/BacklogView';
import { AnalyticsView } from './components/AnalyticsView';
import { StudyTimerModal } from './components/StudyTimerModal';
import { downloadBackupFile } from './lib/accidentalLossGuard';
import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarDays, 
  Sparkles, 
  FileText, 
  GraduationCap, 
  RotateCcw, 
  AlertOctagon, 
  BarChart3, 
  Sun, 
  Moon, 
  Clock, 
  Download,
  Menu,
  X
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { theme, toggleTheme, subjects } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Subjects (5 Units)', icon: BookOpen },
    { id: 'planner', label: 'Smart Planner', icon: CalendarDays },
    { id: 'ai_tutor', label: 'AI Study Tutor', icon: Sparkles, badge: 'Gemini' },
    { id: 'notes', label: 'Notes Manager', icon: FileText },
    { id: 'exam_prep', label: 'Exam Prep & PYQ', icon: GraduationCap },
    { id: 'revisions', label: 'Spaced Revision', icon: RotateCcw },
    { id: 'backlogs', label: 'Backlog Tracker', icon: AlertOctagon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow">
            SH
          </div>
          <span className="font-extrabold text-base tracking-tight">STUDYHUB AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg text-slate-500">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
              SH
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight leading-none text-slate-900 dark:text-white">
                STUDYHUB AI
              </div>
              <div className="text-[10px] text-indigo-500 font-semibold tracking-wider uppercase mt-1">
                B.Tech Smart Study
              </div>
            </div>
          </div>

          {/* Quick Focus Study Timer Button */}
          <div className="mt-5 px-1">
            <button
              onClick={() => { setIsTimerOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 py-2.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition shadow-sm"
            >
              <Clock className="h-4 w-4" /> Focus Study Timer
            </button>
          </div>

          {/* Nav Items */}
          <nav className="mt-5 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-amber-400/20 text-amber-500 dark:text-amber-300 text-[10px] px-2 py-0.5 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            onClick={() => downloadBackupFile(subjects)}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 py-2 text-[11px] font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5" /> Backup Academic Data (JSON)
          </button>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <span>Appearance</span>
            <span>{theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardView onNavigate={setActiveTab} onOpenTimer={() => setIsTimerOpen(true)} />
        )}
        {activeTab === 'subjects' && <SubjectsView />}
        {activeTab === 'planner' && <PlannerView onOpenTimer={() => setIsTimerOpen(true)} />}
        {activeTab === 'ai_tutor' && <AITutorView />}
        {activeTab === 'notes' && <NotesView />}
        {activeTab === 'exam_prep' && <ExamPrepView />}
        {activeTab === 'revisions' && <RevisionView />}
        {activeTab === 'backlogs' && <BacklogView />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Study Timer Overlay Modal */}
      <StudyTimerModal isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
