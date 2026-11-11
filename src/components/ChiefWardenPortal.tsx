'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Crown, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Building2, 
  Utensils, 
  Sparkles, 
  Wrench, 
  ShieldCheck, 
  Send, 
  Megaphone, 
  Clock, 
  Award,
  FileText
} from 'lucide-react';
import { UserRole } from '@/types';

export function ChiefWardenPortal() {
  const { 
    currentUser, 
    complaints, 
    mealFeedbacks, 
    gatePasses, 
    hotWaterStatus, 
    announcements, 
    addAnnouncement, 
    updateComplaintStatus, 
    addComplaintComment 
  } = useApp();

  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<'warden' | 'mess' | 'maintenance' | 'cleaning'>('warden');
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);

  // Filter breached and escalated complaints
  const breachedComplaints = complaints.filter(c => (c.isBreached || c.status === 'escalated_to_warden') && c.status !== 'resolved');
  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 100;

  // Incharge performance breakdown
  const messComplaints = complaints.filter(c => c.category === 'mess_food');
  const cleaningComplaints = complaints.filter(c => c.category === 'room_cleaning');
  const maintComplaints = complaints.filter(c => c.category === 'hot_water' || c.category === 'plumbing' || c.category === 'electrical');

  const handleIssueDirective = (compId: string, inchargeRole: string) => {
    const directive = prompt(`Enter formal Rector's directive to ${inchargeRole}:`, 'Resolve within 2 hours or explain failure to Disciplinary Board.');
    if (directive) {
      addComplaintComment(compId, `👑 RECTOR'S DIRECTIVE: ${directive}`);
      alert('Formal directive logged on ticket and SMS notification dispatched to incharge.');
    }
  };

  const handleImposeContractorPenalty = (compId: string) => {
    const penaltyAmount = prompt('Enter penalty amount to deduct from mess contractor bill (in ₹):', '5000');
    if (penaltyAmount) {
      addComplaintComment(compId, `⚖️ CONTRACTOR PENALTY: Rector Dr. Kulkarni has deducted ₹${penaltyAmount} from monthly mess contractor payment due to repeated food quality SLA breaches.`);
      alert(`₹${penaltyAmount} penalty recorded on catering contractor account.`);
    }
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement({
      title: annTitle,
      content: annContent,
      category: annCategory,
      badge: 'OFFICIAL HOSTEL DIRECTIVE',
      isPinned: true
    });

    setAnnTitle('');
    setAnnContent('');
    setShowAnnounceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-400/40 shadow-lg"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                Chief Warden & Executive Rector
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Hostel oversight & anti-neglect governance. Monitoring specific incharges to ensure student complaints are never ignored.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAnnounceModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Megaphone className="w-4 h-4" />
          <span>Publish Hostel Announcement</span>
        </button>
      </div>

      {/* SLA Breaches & Neglect Alert Warning */}
      {breachedComplaints.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-red-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
              <span>Critical Alerts: {breachedComplaints.length} Neglected Tickets Exceeded SLA</span>
            </h2>
            <span className="text-xs bg-red-200 text-red-800 font-bold px-2.5 py-0.5 rounded-full">
              Requires Rector Action
            </span>
          </div>
          <p className="text-xs text-red-700">
            The underwardens and specific incharges have not resolved these tickets within guaranteed SLA windows. Intervene directly below:
          </p>

          <div className="space-y-3 pt-2">
            {breachedComplaints.map(comp => (
              <div key={comp.id} className="bg-white p-4 rounded-xl border border-red-200 shadow-2xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                      {comp.ticketNumber}
                    </span>
                    <span className="font-bold text-gray-900">{comp.title}</span>
                  </div>
                  <span className="text-red-600 font-bold">
                    Assigned: {comp.assignedInchargeName}
                  </span>
                </div>

                <p className="text-xs text-gray-600">{comp.description}</p>
                <div className="text-xs text-gray-500">
                  Student: <strong>{comp.studentName}</strong> (Room {comp.roomNumber}) • 
                  <strong> {comp.upvotes.length} students upvoted</strong>
                </div>

                {/* Rector Intervention Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleIssueDirective(comp.id, comp.assignedRole)}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    👑 Issue Rector's Formal Directive
                  </button>

                  {comp.category === 'mess_food' && (
                    <button
                      onClick={() => handleImposeContractorPenalty(comp.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      ⚖️ Deduct Fine from Mess Contractor
                    </button>
                  )}

                  <button
                    onClick={() => {
                      updateComplaintStatus(comp.id, 'resolved', 'Chief Warden intervened and ordered external technical resolution.');
                      addComplaintComment(comp.id, 'Resolved via Chief Warden direct intervention.');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Force Resolve Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incharge Accountability Scorecards */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Specific Incharges Performance & Accountability Audit</span>
          </h2>
          <p className="text-xs text-gray-500">
            Work in the hostel is split among individual supervisors. This matrix prevents underwardens from shifting blame.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mess Incharge Scorecard */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5" /> Mess Incharge
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                Mr. Verma
              </span>
            </div>
            <p className="text-gray-600">Complaints: <strong>{messComplaints.length}</strong> (1 Breached)</p>
            <p className="text-gray-600">Student Satisfaction: <strong className="text-red-600">2.4 / 5.0 ⭐ (Low)</strong></p>
            <p className="text-gray-600">Status: <span className="text-amber-700 font-semibold">Under Quality Review</span></p>
          </div>

          {/* Cleaning Incharge Scorecard */}
          <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Cleaning Incharge
              </span>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded font-bold">
                Mrs. Shanti
              </span>
            </div>
            <p className="text-gray-600">Complaints: <strong>{cleaningComplaints.length}</strong></p>
            <p className="text-gray-600">Daily Cleanliness: <strong className="text-emerald-600">88% Satisfied</strong></p>
            <p className="text-gray-600">Status: <span className="text-emerald-700 font-semibold">Operational</span></p>
          </div>

          {/* Maintenance Incharge Scorecard */}
          <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-900 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> Maintenance Incharge
              </span>
              <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold">
                Mr. Rajesh
              </span>
            </div>
            <p className="text-gray-600">Tickets: <strong>{maintComplaints.length}</strong> (1 Breached)</p>
            <p className="text-gray-600">Hot Water Uptime: <strong className="text-amber-600">75% (3rd flr issue)</strong></p>
            <p className="text-gray-600">Status: <span className="text-amber-700 font-semibold">Boiler Part Ordered</span></p>
          </div>

          {/* Gate Security Scorecard */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Gate Security
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                Officer Bahadur
              </span>
            </div>
            <p className="text-gray-600">Gate Passes: <strong>{gatePasses.length} Active</strong></p>
            <p className="text-gray-600">21+ Self-Pass Compliance: <strong className="text-emerald-600">100%</strong></p>
            <p className="text-gray-600">Status: <span className="text-emerald-700 font-semibold">Secure</span></p>
          </div>
        </div>
      </div>

      {/* Hostel Announcements & Directives */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-purple-600" />
          <span>Active Hostel Notices & Directives</span>
        </h2>

        <div className="space-y-3">
          {announcements.map(ann => (
            <div key={ann.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {ann.badge || ann.category.toUpperCase()}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm">{ann.title}</h3>
                </div>
                <span className="text-gray-400 text-[11px]">{new Date(ann.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{ann.content}</p>
              <p className="text-[11px] text-gray-500 pt-1">
                Posted by: <strong>{ann.authorName}</strong> ({ann.authorRole.replace('_', ' ')})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ANNOUNCE MODAL */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Issue Official Hostel Notice</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Notice Category:</label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="warden">👑 Rector / Warden Directive</option>
                  <option value="mess">🍽️ Mess & Diet Policy</option>
                  <option value="maintenance">🚿 Maintenance & Hot Water Alert</option>
                  <option value="cleaning">🧹 Housekeeping Schedule</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Strict Penalty on Mess Vendor & New Balanced Diet Timetable"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Directive Details:</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the full announcement to broadcast to all resident students and staff..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
