'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  Utensils, 
  Sparkles, 
  Wrench, 
  ShieldCheck, 
  Crown, 
  GraduationCap, 
  UserCheck, 
  AlertTriangle,
  RotateCcw,
  Bell,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Plus
} from 'lucide-react';
import { UserRole } from '@/types';

interface Props {
  onOpenCreateHostel: () => void;
}

export function Navbar({ onOpenCreateHostel }: Props) {
  const { currentUser, users, switchUser, resetToDefaults, complaints, logout, hostel } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const breachedCount = complaints.filter(c => c.isBreached && c.status !== 'resolved').length;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'student': return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'mess_incharge': return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'cleaning_incharge': return <Sparkles className="w-4 h-4 text-cyan-600" />;
      case 'maintenance_incharge': return <Wrench className="w-4 h-4 text-orange-600" />;
      case 'security_guard': return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'chief_warden': return <Crown className="w-4 h-4 text-purple-600" />;
      default: return <UserCheck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'student': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'mess_incharge': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cleaning_incharge': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'maintenance_incharge': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'security_guard': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'chief_warden': return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      {/* Top Banner: One-Click Instant Persona Switcher for pair programming & testing */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              QUICK LOGIN SWITCHER:
            </span>
            <span className="text-gray-300 hidden sm:inline">Switch perspective instantly:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {users.map((u) => {
              const isActive = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-300'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`${u.name} (ID: ${u.loginId} • Pass: ${u.dateOfBirth})`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  <span>{u.name.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-75 hidden md:inline">
                    ({u.loginId})
                  </span>
                </button>
              );
            })}
            
            <button
              onClick={onOpenCreateHostel}
              className="bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ml-1"
              title="Warden Create Hostel"
            >
              <Plus className="w-3 h-3" />
              <span>Create Hostel</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset all demo data back to initial hostel state?')) {
                  resetToDefaults();
                }
              }}
              className="text-gray-400 hover:text-white text-xs flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800 ml-1"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden lg:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 bg-clip-text text-transparent">
                  HostelVoice
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {hostel.code}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">
                {hostel.name} • Direct Incharge Routing & SLA
              </p>
            </div>
          </div>

          {/* Right Area: Alerts & Active User Indicator */}
          <div className="flex items-center gap-3">
            {/* SLA Breaches / Alerts Indicator */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="Grievance SLA Alerts"
              >
                <Bell className="w-5 h-5" />
                {breachedCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {breachedCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotificationPopup && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-3 px-4 z-50 text-sm">
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Hostel SLA & Grievance Alerts
                    </span>
                    <span className="text-xs text-gray-400">{breachedCount} breached</span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {breachedCount === 0 ? (
                      <p className="text-xs text-gray-500 py-2 text-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 inline mr-1" />
                        No neglected complaints right now!
                      </p>
                    ) : (
                      complaints
                        .filter(c => c.isBreached && c.status !== 'resolved')
                        .map(comp => (
                          <div key={comp.id} className="p-2 rounded-lg bg-red-50/70 border border-red-100 text-xs">
                            <div className="flex items-center justify-between font-semibold text-red-900">
                              <span>{comp.ticketNumber}</span>
                              <span className="text-[10px] bg-red-200 text-red-800 px-1.5 py-0.2 rounded">
                                ⚠️ SLA Breached
                              </span>
                            </div>
                            <p className="text-gray-700 line-clamp-1 mt-0.5">{comp.title}</p>
                            <p className="text-[10px] text-gray-500 mt-1">
                              Target: {comp.assignedInchargeName.split('(')[0]}
                            </p>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Current User Card & Selector */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition-all ${getRoleBadgeColor(
                  currentUser.role
                )} hover:shadow-xs`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-white shadow-2xs"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold leading-tight text-gray-900 flex items-center gap-1">
                    {currentUser.name}
                    <span className="text-[10px] font-mono text-gray-500">({currentUser.loginId})</span>
                  </div>
                  <div className="text-[10px] text-gray-600 flex items-center gap-1">
                    {getRoleIcon(currentUser.role)}
                    <span className="truncate max-w-[140px]">{currentUser.roleTitle}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {/* Dropdown to switch or view profile */}
              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-[11px] text-gray-500 font-mono">
                      Login ID: <strong>{currentUser.loginId}</strong> • Password (DOB): <strong>{currentUser.dateOfBirth}</strong>
                    </p>
                    {currentUser.role === 'student' && (
                      <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                        Room {currentUser.roomNumber}, {currentUser.block} • Age: {currentUser.age} yrs
                      </p>
                    )}
                  </div>

                  <div className="px-2 py-1.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                      Switch Active Account
                    </p>
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                          u.id === currentUser.id ? 'bg-blue-50 font-semibold text-blue-900' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{u.name} ({u.loginId})</div>
                          <div className="text-[10px] text-gray-500 truncate">Pass: {u.dateOfBirth}</div>
                        </div>
                        {u.id === currentUser.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out to Login Screen</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
