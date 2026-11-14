import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  RotateCcw,
  Inbox
} from 'lucide-react';
import { 
  requestRegistrationOtp, 
  requestLoginOtp, 
  verifyOtpAndLogin, 
  UserSession,
  getRegisteredUsers
} from '../lib/userSecurity';

interface Props {
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthView: React.FC<Props> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // OTP Verification Step
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedMailNotice, setSimulatedMailNotice] = useState<{ otp: string; email: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const res = await requestRegistrationOtp(name, email, password, collegeId);
        if (!res.success || !res.otp) {
          setError(res.error || 'Failed to send verification code.');
          setIsLoading(false);
          return;
        }
        setSimulatedMailNotice({ otp: res.otp, email: email.trim() });
        setStep('otp');
      } else {
        const res = await requestLoginOtp(email, password);
        if (!res.success || !res.otp) {
          setError(res.error || 'Invalid academic credentials.');
          setIsLoading(false);
          return;
        }
        setSimulatedMailNotice({ otp: res.otp, email: email.trim() });
        setStep('otp');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    const res = verifyOtpAndLogin(otpCode.trim());
    if (!res.success || !res.session) {
      setError(res.error || 'Invalid verification code.');
      return;
    }

    onLoginSuccess(res.session);
  };

  // Quick 1-Click Demo Profiles
  const handleQuickDemo = async (roleName: string, roleEmail: string) => {
    setIsLoading(true);
    setError('');
    try {
      const users = getRegisteredUsers();
      const existing = users.find(u => u.email === roleEmail);
      if (!existing) {
        const reg = await requestRegistrationOtp(roleName, roleEmail, 'demo123456', 'ENG-DEMO-01');
        if (reg.otp) {
          const auth = verifyOtpAndLogin(reg.otp);
          if (auth.session) {
            onLoginSuccess(auth.session);
            return;
          }
        }
      }
      const req = await requestLoginOtp(roleEmail, 'demo123456');
      if (req.otp) {
        const auth = verifyOtpAndLogin(req.otp);
        if (auth.session) {
          onLoginSuccess(auth.session);
          return;
        }
      }
      setError('Failed to auto-sign demo.');
    } catch (err: any) {
      setError(err?.message || 'Quick demo setup error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            STUDYHUB AI
          </h1>
          <p className="text-xs text-slate-400">
            Secure Multi-Tenant Academic Management & Real-Time Study Lounge
          </p>
        </div>

        {step === 'form' ? (
          <>
            {/* Tab Toggle */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-800/80 mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setError(''); }}
                className={`py-2 rounded-lg transition ${
                  !isSignUp ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In Existing
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setError(''); }}
                className={`py-2 rounded-lg transition ${
                  isSignUp ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create New Account
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isSignUp && (
              <div className="mb-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-[11px] text-indigo-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Isolated Blank Application Workspace
                </div>
                <p className="text-indigo-300/80">
                  When you create a new account, your workspace starts clean with zero data from other students.
                </p>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Student Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sumanth Bandla"
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/70 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Academic Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/70 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password (PBKDF2 SHA-256 Hashed)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/70 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Roll Number / College ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="21B91A05XX"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/70 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition transform active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Generate OTP & Register' : 'Send Verification OTP'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* 1-Click Demo Profiles */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <p className="text-[11px] text-center text-slate-400 mb-3">
                Instant Demo Access:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickDemo('Sumanth Bandla', 'sumanth@student.edu')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 border border-slate-700/60 transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Sumanth (Demo)</span>
                </button>
                <button
                  onClick={() => handleQuickDemo('Alex Rivera', 'alex@university.edu')}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 border border-slate-700/60 transition"
                >
                  <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Alex (Peer)</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* OTP Verification Step Screen */
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-indigo-600/20 text-indigo-400 items-center justify-center mb-1">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Enter Email Verification OTP</h3>
              <p className="text-xs text-slate-400">
                A 6-digit security code was dispatched to:
              </p>
              <div className="text-xs font-bold text-indigo-400 bg-indigo-950/40 py-1 px-3 rounded-lg inline-block border border-indigo-800/50">
                {simulatedMailNotice?.email}
              </div>
            </div>

            {/* In-Browser Security OTP Mail Dispatch Notification */}
            {simulatedMailNotice && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-2 shadow-inner">
                <div className="flex items-center justify-between font-bold text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> Academic Mail Gateway
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Delivered
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/80">
                  Your one-time email verification code is:
                </p>
                <div className="text-center py-2 bg-slate-900/80 rounded-xl border border-emerald-500/30 font-mono text-2xl font-black tracking-widest text-emerald-400">
                  {simulatedMailNotice.otp}
                </div>
                <p className="text-[10px] text-emerald-400/70 text-center">
                  Valid for 5 minutes. (Auto-filled on click or enter manually below)
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-xl border border-slate-700 bg-slate-800 text-white outline-none focus:border-indigo-500"
                />
              </div>

              {simulatedMailNotice && !otpCode && (
                <button
                  type="button"
                  onClick={() => setOtpCode(simulatedMailNotice.otp)}
                  className="w-full text-[11px] text-indigo-400 hover:text-indigo-300 underline text-center"
                >
                  ⚡ Auto-fill code ({simulatedMailNotice.otp})
                </button>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow-lg transition"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Verify OTP & Enter Workspace</span>
              </button>

              <button
                type="button"
                onClick={() => { setStep('form'); setError(''); }}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Back to Credentials
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
