'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { StudentPortal } from '@/components/StudentPortal';
import { MessInchargePortal } from '@/components/MessInchargePortal';
import { CleaningInchargePortal } from '@/components/CleaningInchargePortal';
import { MaintenanceInchargePortal } from '@/components/MaintenanceInchargePortal';
import { SecurityGuardPortal } from '@/components/SecurityGuardPortal';
import { WardenPortal } from '@/components/WardenPortal';
import { LoginModal } from '@/components/LoginModal';
import { CreateHostelModal } from '@/components/CreateHostelModal';
import { 
  Building2, 
  Utensils, 
  Sparkles, 
  Wrench, 
  ShieldCheck, 
  Crown, 
  GraduationCap, 
  Info,
  X,
  Plus
} from 'lucide-react';

export default function Home() {
  const { currentUser, isAuthenticated, hostel } = useApp();
  const [showCreateHostelModal, setShowCreateHostelModal] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  // If user is not authenticated, show Login Screen (with Create Hostel option)
  if (!isAuthenticated) {
    return (
      <>
        <LoginModal onOpenCreateHostel={() => setShowCreateHostelModal(true)} />
        <CreateHostelModal 
          isOpen={showCreateHostelModal} 
          onClose={() => setShowCreateHostelModal(false)} 
        />
      </>
    );
  }

  // Render the portal corresponding to the logged-in role
  const renderRolePortal = () => {
    switch (currentUser.role) {
      case 'chief_warden':
        return <WardenPortal />;
      case 'student':
        return <StudentPortal />;
      case 'mess_incharge':
        return <MessInchargePortal />;
      case 'cleaning_incharge':
        return <CleaningInchargePortal />;
      case 'maintenance_incharge':
        return <MaintenanceInchargePortal />;
      case 'security_guard':
        return <SecurityGuardPortal />;
      default:
        return <StudentPortal />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenCreateHostel={() => setShowCreateHostelModal(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Anti-Neglect & Direct Routing Guidance Callout */}
        {showInfoBanner && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-xs relative">
            <button
              onClick={() => setShowInfoBanner(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 p-1"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5 pr-8">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-bold text-gray-900">
                  Hostel Management Architecture (Role-Based Logins with Password = Date of Birth):
                </p>
                <p className="text-gray-600 leading-relaxed text-xs">
                  • <strong>Warden creates Hostel:</strong> Configures <strong>1. Units & Rooms</strong>, <strong>2. Mess</strong>, <strong>3. Incharges</strong> (Mess, Water, Cleaning), <strong>4. Student Allocations</strong>, <strong>5. Fees</strong>, <strong>6. Complaints Oversight</strong>.
                  <br />
                  • <strong>Student Login:</strong> Enters Student ID (e.g. <code>STU-304</code>) and password = <strong>Date of Birth</strong> (<code>2005-04-12</code>). Views Room details, Mess menu, Fees, Instant 21+ Gate pass, and raises direct complaints.
                  <br />
                  • <strong>Incharge Login:</strong> Enters Incharge ID (e.g. <code>INC-MESS</code>) and password = <strong>Date of Birth</strong> (<code>1982-08-14</code>). Resolves food grievances, updates menus, requests grocery permissions from Warden, and logs food inspections!
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                  <span className="font-semibold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded">
                    Logged in as: <strong>{currentUser.name}</strong> ({currentUser.roleTitle})
                  </span>
                  <span className="font-mono text-purple-700 font-bold bg-purple-100/70 px-2 py-0.5 rounded">
                    Login ID: {currentUser.loginId} • Password (DOB): {currentUser.dateOfBirth}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Portal Content */}
        {renderRolePortal()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-gray-800">{hostel.name}</span>
            <span>• Direct Incharge Routing & Transparent Grievance Resolution</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Units & Rooms • Mess Groceries • Duty Rosters • Instant 21+ Gate Pass</span>
          </div>
        </div>
      </footer>

      {/* CREATE HOSTEL MODAL */}
      <CreateHostelModal 
        isOpen={showCreateHostelModal} 
        onClose={() => setShowCreateHostelModal(false)} 
      />
    </div>
  );
}
