import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Radio, 
  Wifi, 
  WifiOff, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Layers,
  Settings,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useRealtimeStudyRoom } from '../lib/useRealtimeStudyRoom';
import { useApp } from '../context/AppContext';
import { getSupabaseSettings, updateSupabaseCredentials } from '../lib/supabase';

export const RealtimeStudyRoomView: React.FC = () => {
  const { subjects, activeTimer } = useApp();
  
  const currentSubjectObj = subjects.find(s => s.id === activeTimer.subjectId);
  const currentSubjectName = currentSubjectObj ? currentSubjectObj.name : 'Independent Study';

  const {
    currentUser,
    updateStudentName,
    peers,
    messages,
    sendMessage,
    isConnected,
    syncedWithCloud
  } = useRealtimeStudyRoom(currentSubjectName, activeTimer.isRunning);

  const [inputMsg, setInputMsg] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentUser.name);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const sbSettings = getSupabaseSettings();
  const [supabaseUrl, setSupabaseUrl] = useState(sbSettings.url);
  const [supabaseKey, setSupabaseKey] = useState(sbSettings.key);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendMessage(inputMsg);
    setInputMsg('');
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateStudentName(tempName.trim());
      setEditingName(false);
    }
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseCredentials(supabaseUrl, supabaseKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setShowConfigModal(false);
      setSavedSuccess(false);
    }, 800);
  };

  const allActiveUsers = [currentUser, ...peers];
  const studyingCount = allActiveUsers.filter(u => u.isTimerRunning).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold backdrop-blur-sm border border-indigo-400/20">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Real-Time Collaboration & Lounge</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Virtual Co-Study Room
            </h1>
            <p className="text-sm text-indigo-200 max-w-xl">
              Study with peers in real-time, see who is actively focusing across devices or browser tabs, and sync live study notes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfigModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur transition border border-white/10"
              title="Configure Supabase Cloud Sync"
            >
              <Settings className="h-4 w-4" />
              <span>Cloud Sync Settings</span>
            </button>
            <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur border ${syncedWithCloud ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200' : 'bg-amber-500/20 border-amber-500/30 text-amber-200'}`}>
              {syncedWithCloud ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span>{syncedWithCloud ? 'Supabase Live' : 'Cross-Tab Peer Sync'}</span>
            </div>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-700/50">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-xs text-indigo-300 font-medium">Students In Lounge</div>
            <div className="text-xl font-black mt-0.5 flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-300" />
              {allActiveUsers.length}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-xs text-indigo-300 font-medium">Actively In Deep Focus</div>
            <div className="text-xl font-black mt-0.5 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              {studyingCount}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-xs text-indigo-300 font-medium">Your Current Status</div>
            <div className="text-sm font-bold mt-1 text-emerald-300 truncate">
              {activeTimer.isRunning ? '🔥 Focus Timer Running' : 'Idle / Planning'}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-xs text-indigo-300 font-medium">Target Focus Subject</div>
            <div className="text-sm font-bold mt-1 text-white truncate">
              {currentSubjectName}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Peer List & Profiles, Right = Live Study Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Your Profile & Active Peers */}
        <div className="space-y-6 lg:col-span-1">
          {/* Your Profile Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Presence Profile
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className={`h-12 w-12 rounded-2xl ${currentUser.avatarColor} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                {editingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-indigo-400 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none"
                      maxLength={24}
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </span>
                      <button
                        onClick={() => { setTempName(currentUser.name); setEditingName(true); }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {currentSubjectName}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Session Timer:</span>
              <span className={`font-bold ${activeTimer.isRunning ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {activeTimer.isRunning ? `${Math.floor(activeTimer.elapsedSeconds / 60)}m ${activeTimer.elapsedSeconds % 60}s Active` : 'Stopped'}
              </span>
            </div>
          </div>

          {/* Active Peers List */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                Active Peers ({allActiveUsers.length})
              </h3>
              <span className="text-[11px] text-indigo-500 font-medium">Real-Time Sync</span>
            </div>

            <div className="space-y-3">
              {allActiveUsers.map((user) => {
                const isMe = user.id === currentUser.id;
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition hover:border-indigo-200 dark:hover:border-indigo-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`relative h-9 w-9 rounded-xl ${user.avatarColor || 'bg-indigo-600'} text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0`}>
                        {user.name.charAt(0).toUpperCase()}
                        <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${user.isTimerRunning ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {user.name}
                          </span>
                          {isMe && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user.currentSubject || 'General Study'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {user.isTimerRunning ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Clock className="h-3 w-3 animate-spin" /> Focusing
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Break</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Chat & Discussion */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col h-[560px] lg:col-span-2 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Real-time Peer Study Lounge Chat
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ask doubt questions, share progress, or celebrate study milestones together
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Radio className="h-3 w-3 text-emerald-500" /> Live Feed
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((msg) => {
              const isMe = msg.userId === currentUser.id;
              const isSystem = msg.userId === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="max-w-md rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 px-3.5 py-2 text-center text-xs text-indigo-700 dark:text-indigo-300">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`h-8 w-8 rounded-xl ${msg.userAvatar || 'bg-indigo-600'} text-white flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0`}>
                    {msg.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end' : ''}`}>
                    <div className={`flex items-center gap-1.5 text-[11px] text-slate-400 ${isMe ? 'justify-end' : ''}`}>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{msg.userName}</span>
                      {msg.subjectTag && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                          {msg.subjectTag}
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={`Message study room as ${currentUser.name}...`}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs transition shadow-sm"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Supabase Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Supabase Real-Time Cloud Sync
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Connect your project's Supabase credentials for multi-device sync
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSupabase} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supabase Anon Public API Key
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-200/50 dark:border-slate-700/50">
                💡 <span className="font-semibold text-slate-700 dark:text-slate-200">Note:</span> If left empty, StudyHub AI uses ultra-fast local Web BroadcastChannels for seamless real-time syncing between browser windows and tabs!
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Credentials saved! Reloading real-time channel...
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
