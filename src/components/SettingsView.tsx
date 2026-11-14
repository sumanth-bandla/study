import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  UserSession, 
  updateUserProfile, 
  changeUserPassword 
} from '../lib/userSecurity';
import { 
  getSupabaseSettings, 
  updateSupabaseCredentials 
} from '../lib/supabase';
import { 
  downloadBackupFile 
} from '../lib/accidentalLossGuard';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Cloud, 
  Database, 
  ShieldCheck, 
  Save, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  FileDown,
  Sparkles,
  Palette
} from 'lucide-react';

interface Props {
  session: UserSession;
}

export const SettingsView: React.FC<Props> = ({ session }) => {
  const { subjects, theme, toggleTheme, apiKey, setApiKey } = useApp();

  // Profile State
  const [profileName, setProfileName] = useState(session.name);
  const [collegeId, setCollegeId] = useState(session.collegeId || '');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Gemini API Key State
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [apiMsg, setApiMsg] = useState<string | null>(null);

  // Supabase Real-time Cloud Settings
  const sbSettings = getSupabaseSettings();
  const [supabaseUrl, setSupabaseUrl] = useState(sbSettings.url);
  const [supabaseKey, setSupabaseKey] = useState(sbSettings.key);
  const [cloudMsg, setCloudMsg] = useState<string | null>(null);

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    if (!profileName.trim()) {
      setProfileMsg({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }
    const ok = updateUserProfile(session.userId, { name: profileName, collegeId });
    if (ok) {
      setProfileMsg({ type: 'success', text: 'Student profile updated successfully.' });
      setTimeout(() => setProfileMsg(null), 3000);
    } else {
      setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    const res = await changeUserPassword(session.userId, currentPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 3000);
    } else {
      setPasswordMsg({ type: 'error', text: res.error || 'Password update failed.' });
    }
  };

  // Handle API Key Save
  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(tempApiKey.trim());
    setApiMsg('Gemini API key saved in encrypted browser storage.');
    setTimeout(() => setApiMsg(null), 3000);
  };

  // Handle Supabase Cloud Save
  const handleSaveCloud = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseCredentials(supabaseUrl, supabaseKey);
    setCloudMsg('Supabase cloud credentials saved. Reloading channel...');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
              <SettingsIcon className="h-3.5 w-3.5" /> Workspace Settings
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your student profile, Web Crypto security, Gemini AI API key, and data backups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> 2FA OTP Active
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Profile Information
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Academic Email</label>
              <input
                type="email"
                disabled
                value={session.email}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Email is permanently bound to this isolated workspace.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Student Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Roll Number / College ID</label>
              <input
                type="text"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                placeholder="e.g. 21B91A05XX"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            {profileMsg && (
              <div className={`text-xs p-2.5 rounded-xl flex items-center gap-1.5 ${
                profileMsg.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
              }`}>
                <CheckCircle2 className="h-4 w-4" /> {profileMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow transition"
            >
              <Save className="h-4 w-4" /> Save Profile Changes
            </button>
          </form>
        </div>

        {/* Password & Security Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Security & Password
            </h3>
          </div>

          <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password (Min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            {passwordMsg && (
              <div className={`text-xs p-2.5 rounded-xl flex items-center gap-1.5 ${
                passwordMsg.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
              }`}>
                {passwordMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {passwordMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs shadow transition border border-slate-700"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Update Password
            </button>
          </form>
        </div>

        {/* Gemini AI API Configuration */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Gemini AI Tutor Configuration
            </h3>
          </div>

          <form onSubmit={handleSaveApiKey} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Required for real-time 7-mark question generation, MCQs, and AI voice tutor.
              </span>
            </div>

            {apiMsg && (
              <div className="text-xs p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> {apiMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow transition"
            >
              <Key className="h-4 w-4" /> Save Gemini API Key
            </button>
          </form>
        </div>

        {/* Data Backup & Theme */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Database className="h-5 w-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Isolation & Academic Backup
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Visual Appearance
            </label>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <span className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-indigo-500" /> UI Theme
              </span>
              <span className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 text-[11px] shadow-sm">
                {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Download Personal Data Snapshot
            </label>
            <button
              onClick={() => downloadBackupFile(subjects)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <FileDown className="h-4 w-4 text-indigo-500" /> Export My Isolated Data (JSON)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
