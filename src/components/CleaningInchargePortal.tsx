'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  MapPin, 
  CheckSquare, 
  Calendar 
} from 'lucide-react';
import { CleaningStatus } from '@/types';

export function CleaningInchargePortal() {
  const { 
    currentUser, 
    cleaningRequests, 
    complaints, 
    updateCleaningStatus, 
    updateComplaintStatus, 
    addComplaintComment 
  } = useApp();

  const [selectedStaff, setSelectedStaff] = useState<Record<string, string>>({});
  const [resolvingCompId, setResolvingCompId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Housekeeping complaints
  const cleaningComplaints = complaints.filter(c => c.category === 'room_cleaning' || c.assignedRole === 'cleaning_incharge');
  const openCleaningComplaints = cleaningComplaints.filter(c => c.status !== 'resolved');

  const pendingRequests = cleaningRequests.filter(cr => cr.status === 'requested' || cr.status === 'assigned');
  const inProgressRequests = cleaningRequests.filter(cr => cr.status === 'in_progress');
  const completedRequests = cleaningRequests.filter(cr => cr.status === 'completed' || cr.status === 'verified');

  const staffList = ['Cleaner Ramesh', 'Cleaner Sunita', 'Cleaner Manoj', 'Cleaner Rekha'];

  const handleAssignAndProgress = (reqId: string) => {
    const cleaner = selectedStaff[reqId] || staffList[0];
    updateCleaningStatus(reqId, 'in_progress', cleaner);
  };

  const handleMarkCompleted = (reqId: string) => {
    updateCleaningStatus(reqId, 'completed');
  };

  const handleResolveComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingCompId || !resolutionNotes.trim()) return;

    updateComplaintStatus(resolvingCompId, 'resolved', resolutionNotes);
    addComplaintComment(resolvingCompId, `Resolution by Cleaning Incharge: ${resolutionNotes}`);
    setResolvingCompId(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-800 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400/40 shadow-lg"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Housekeeping & Cleanliness Incharge
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Directly overseeing daily hostel room cleaning schedules, corridor hygiene, and student cleanliness grievances.
            </p>
          </div>
        </div>

        <div className="text-right text-xs bg-white/10 p-3 rounded-xl border border-white/20 shrink-0">
          <p className="font-bold text-cyan-200">Today's Duty Roster:</p>
          <p>4 Housekeeping Staff Active</p>
          <p className="text-emerald-300 font-semibold">{completedRequests.length} Rooms Cleaned Today</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase">Pending Room Requests</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">{pendingRequests.length} Rooms</p>
          <p className="text-[11px] text-gray-400 mt-1">Awaiting cleaner dispatch</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase">Cleaning In Progress</span>
          <p className="text-2xl font-bold text-cyan-600 mt-2">{inProgressRequests.length} Rooms</p>
          <p className="text-[11px] text-gray-400 mt-1">Staff currently sweeping/mopping</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase">Cleanliness Grievances</span>
          <p className="text-2xl font-bold text-red-600 mt-2">{openCleaningComplaints.length} Tickets</p>
          <p className="text-[11px] text-gray-400 mt-1">Uncleaned rooms & hygiene issues</p>
        </div>
      </div>

      {/* Room Cleaning Requests Queue */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>Student Room Cleaning Requests</span>
            </h2>
            <p className="text-xs text-gray-500">
              Students submit their preferred time slots. Assign a cleaner and update status when finished.
            </p>
          </div>
          <span className="text-xs font-bold bg-cyan-100 text-cyan-800 px-2.5 py-1 rounded-full">
            {cleaningRequests.length} Total Requests
          </span>
        </div>

        <div className="space-y-3">
          {cleaningRequests.map(cr => (
            <div 
              key={cr.id}
              className={`p-4 rounded-xl border transition-all ${
                cr.status === 'completed' || cr.status === 'verified'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : cr.status === 'in_progress'
                  ? 'bg-cyan-50/40 border-cyan-300'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-gray-900 text-sm">
                      Room {cr.roomNumber} ({cr.block})
                    </span>
                    <span className="text-gray-500">• Student: <strong>{cr.studentName}</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      cr.status === 'completed' || cr.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                      cr.status === 'in_progress' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {cr.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600">
                    <strong>Slot:</strong> {cr.timeSlot} on {cr.date}
                    {cr.specialInstructions && (
                      <span className="text-gray-800 ml-2">({cr.specialInstructions})</span>
                    )}
                  </p>

                  {cr.assignedCleaner && (
                    <p className="text-xs text-cyan-800 font-medium">
                      Assigned: {cr.assignedCleaner}
                    </p>
                  )}
                </div>

                {/* Dispatch / Complete Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {cr.status === 'requested' && (
                    <>
                      <select
                        value={selectedStaff[cr.id] || staffList[0]}
                        onChange={(e) => setSelectedStaff({ ...selectedStaff, [cr.id]: e.target.value })}
                        className="border border-gray-300 rounded-lg text-xs py-1.5 px-2 bg-white"
                      >
                        {staffList.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssignAndProgress(cr.id)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                      >
                        Dispatch Cleaner
                      </button>
                    </>
                  )}

                  {cr.status === 'in_progress' && (
                    <button
                      onClick={() => handleMarkCompleted(cr.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Room Cleaned</span>
                    </button>
                  )}

                  {(cr.status === 'completed' || cr.status === 'verified') && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Cleaned ✓ {cr.studentRating ? `(Rated ${cr.studentRating}⭐)` : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cleanliness Complaints Queue */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Room Cleaning Grievances (Directly Assigned)</span>
        </h2>

        <div className="space-y-3">
          {cleaningComplaints.length === 0 ? (
            <p className="text-xs text-gray-500 py-3 text-center">No room cleanliness complaints open.</p>
          ) : (
            cleaningComplaints.map(comp => (
              <div key={comp.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                      {comp.ticketNumber}
                    </span>
                    <span className="font-bold text-gray-900">{comp.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    comp.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {comp.status}
                  </span>
                </div>
                <p className="text-gray-600">{comp.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-gray-500">Student: {comp.studentName} (Room {comp.roomNumber})</span>
                  {comp.status !== 'resolved' && (
                    <button
                      onClick={() => setResolvingCompId(comp.id)}
                      className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-lg text-xs"
                    >
                      Resolve & Send Cleaner
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Resolution Modal */}
      {resolvingCompId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Resolve Cleaning Grievance</h3>
            <form onSubmit={handleResolveComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Action Taken:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Dispatched Cleaner Ramesh with floor phenyl and disinfectant. Cleaned balcony and mopped room completely."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingCompId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Mark Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
