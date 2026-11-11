'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  Key, 
  UserCheck, 
  LogIn, 
  ShieldCheck, 
  Calendar, 
  AlertCircle, 
  GraduationCap, 
  Utensils, 
  Wrench, 
  Sparkles, 
  Crown,
  Plus
} from 'lucide-react';
import { UserRole } from '@/types';

interface Props {
  onOpenCreateHostel: () => void;
}

export function LoginModal({ onOpenCreateHostel }: Props) {
  const { login, loginError, users } = useApp();

  const [loginId, setLoginId] = useState('STU-304');
  const [dobPassword, setDobPassword] = useState('2005-04-12');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const success = login(loginId, dobPassword);
    if (!success) {
      setErrorMsg(loginError || 'Invalid credentials. Password is your Date of Birth (YYYY-MM-DD).');
    }
  };

  const handleQuickDemoFill = (id: string, dob: string) => {
    setLoginId(id);
    setDobPassword(dob);
    login(id, dob);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Left Side: Brand & Quick Demo Logins */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold">HostelVoice</span>
                <span className="block text-[10px] text-blue-300 uppercase tracking-widest font-semibold">
                  Accountability Platform
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Sign in with your assigned ID. <strong>Your password is your Date of Birth (DOB)</strong> registered by the Warden.
            </p>

            {/* Quick Demo Autofill List */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Quick 1-Click Demo Profiles (Testing):
              </span>

              <div className="grid grid-cols-1 gap-2 text-xs">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickDemoFill(u.loginId, u.dateOfBirth)}
                    className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold text-white leading-tight">{u.name}</div>
                        <div className="text-[10px] text-gray-300">{u.roleTitle}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px]">
                      <span className="bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded font-bold">{u.loginId}</span>
                      <span className="block text-gray-400 text-[9px] mt-0.5">Pass: {u.dateOfBirth}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
            <span>Student-First Hostel Governance</span>
            <button
              onClick={onOpenCreateHostel}
              className="text-amber-300 hover:text-white font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Hostel</span>
            </button>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-center space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sign In to Hostel</h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter your Student ID or Incharge ID and your Date of Birth as password.
            </p>
          </div>

          {(errorMsg || loginError) && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg || loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Login ID (Student ID / Incharge ID):
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. STU-304, INC-MESS, WARDEN-01"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Examples: STU-304 (Student), INC-MESS (Mess Incharge), WARDEN-01 (Warden)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Password = Date of Birth (YYYY-MM-DD):
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="YYYY-MM-DD (e.g. 2005-04-12)"
                  value={dobPassword}
                  onChange={(e) => setDobPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                Rule: Password is always the user&apos;s Date of Birth.
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-500">
            <span>Are you a Chief Warden setting up a new hostel? </span>
            <button
              onClick={onOpenCreateHostel}
              className="font-bold text-blue-600 hover:text-blue-800 underline"
            >
              Create Hostel Wizard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
