'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Home,
  Utensils, 
  Sparkles, 
  Wrench, 
  ShieldCheck, 
  QrCode, 
  Flame, 
  Clock, 
  ThumbsUp, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  Star, 
  Calendar, 
  MapPin, 
  Send, 
  MessageSquare, 
  X, 
  Camera, 
  Info,
  Droplets,
  HeartPulse,
  UserCheck,
  CreditCard,
  Download,
  Bell,
  Users
} from 'lucide-react';
import { 
  MealType, 
  DayOfWeek, 
  TasteRating, 
  ComplaintCategory, 
  ComplaintPriority,
  Complaint 
} from '@/types';

export function StudentPortal() {
  const { 
    currentUser, 
    rooms,
    units,
    fees,
    weeklyMenu, 
    mealFeedbacks, 
    complaints, 
    cleaningRequests, 
    hotWaterStatus, 
    gatePasses, 
    announcements,
    payStudentFee,
    addComplaint, 
    upvoteComplaint, 
    addComplaintComment, 
    escalateToChiefWarden, 
    rateComplaintResolution, 
    reopenComplaint,
    addMealFeedback, 
    toggleMealSkip, 
    isMealSkipped,
    requestCleaning, 
    rateCleaningRequest,
    reportColdWater,
    createGatePass,
    markGateDeparture,
    markGateArrival,
    cancelGatePass
  } = useApp();

  const [activeTab, setActiveTab] = useState<'room' | 'complaints' | 'mess' | 'fees' | 'gatepass' | 'notices'>('room');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  
  // Modals state
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);
  const [showMealFeedbackModal, setShowMealFeedbackModal] = useState<{ open: boolean; mealType: MealType; day: DayOfWeek }>({
    open: false,
    mealType: 'lunch',
    day: 'Monday'
  });
  const [showCleaningModal, setShowCleaningModal] = useState(false);
  const [showNewGatePassModal, setShowNewGatePassModal] = useState(false);

  // New Complaint Form State
  const [newCompTitle, setNewCompTitle] = useState('');
  const [newCompDesc, setNewCompDesc] = useState('');
  const [newCompCategory, setNewCompCategory] = useState<ComplaintCategory>('mess_food');
  const [newCompPriority, setNewCompPriority] = useState<ComplaintPriority>('high');
  const [newCompPhoto, setNewCompPhoto] = useState('');

  // Meal Feedback Form State
  const [mealRatingVal, setMealRatingVal] = useState<number>(3);
  const [mealTasteVal, setMealTasteVal] = useState<TasteRating>('Tasteless');
  const [mealHygieneVal, setMealHygieneVal] = useState<number>(3);
  const [mealTagsVal, setMealTagsVal] = useState<string[]>(['No Salt', 'Cold Food']);
  const [mealCommentVal, setMealCommentVal] = useState('');

  // Cleaning Form State
  const [cleanTimeSlot, setCleanTimeSlot] = useState('09:00 AM - 11:00 AM');
  const [cleanDate, setCleanDate] = useState('2026-11-12');
  const [cleanNotes, setCleanNotes] = useState('');

  // Gate Pass Form State
  const [gpDestination, setGpDestination] = useState('');
  const [gpReason, setGpReason] = useState('');
  const [gpOutTime, setGpOutTime] = useState('05:00 PM');
  const [gpReturnTime, setGpReturnTime] = useState('09:30 PM');
  const [gpType, setGpType] = useState<'adult_day_outing' | 'college_academic' | 'overnight_leave' | 'emergency'>('adult_day_outing');

  // Filter complaints
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'mine' | 'breached' | 'mess' | 'hotwater' | 'cleaning'>('all');

  // Student specific data
  const myRoom = rooms.find(r => r.roomNumber === currentUser.roomNumber) || rooms[0];
  const myUnit = units.find(u => u.id === myRoom?.unitId) || units[0];
  const myFee = fees.find(f => f.studentId === currentUser.id || f.studentLoginId === currentUser.loginId);
  const myActivePass = gatePasses.find(gp => gp.studentId === currentUser.id && (gp.status === 'active' || gp.status === 'departed'));
  const myFloorHw = hotWaterStatus.find(h => h.block === (currentUser.block || 'Block-B') && h.floor === 3);

  // Filtered complaints
  const filteredComplaints = complaints.filter(c => {
    if (complaintFilter === 'mine') return c.studentId === currentUser.id;
    if (complaintFilter === 'breached') return c.isBreached && c.status !== 'resolved';
    if (complaintFilter === 'mess') return c.category === 'mess_food';
    if (complaintFilter === 'hotwater') return c.category === 'hot_water';
    if (complaintFilter === 'cleaning') return c.category === 'room_cleaning';
    return true;
  });

  const handleCreateComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompTitle.trim() || !newCompDesc.trim()) return;

    addComplaint({
      title: newCompTitle,
      description: newCompDesc,
      category: newCompCategory,
      priority: newCompPriority,
      photoUrl: newCompPhoto || undefined
    });

    setNewCompTitle('');
    setNewCompDesc('');
    setNewCompPhoto('');
    setShowNewComplaintModal(false);
  };

  const handleMealFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMealFeedback({
      day: showMealFeedbackModal.day,
      mealType: showMealFeedbackModal.mealType,
      date: new Date().toISOString().split('T')[0],
      rating: mealRatingVal,
      taste: mealTasteVal,
      hygieneRating: mealHygieneVal,
      tags: mealTagsVal,
      comment: mealCommentVal
    });

    setShowMealFeedbackModal({ open: false, mealType: 'lunch', day: 'Monday' });
    setMealCommentVal('');
  };

  const handleCleaningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestCleaning({
      date: cleanDate,
      timeSlot: cleanTimeSlot,
      specialInstructions: cleanNotes
    });
    setCleanNotes('');
    setShowCleaningModal(false);
  };

  const handleGatePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gpDestination.trim()) return;
    createGatePass({
      destination: gpDestination,
      reason: gpReason || 'Regular evening errands / books purchase',
      passType: gpType,
      outTimeExpected: gpOutTime,
      returnTimeExpected: gpReturnTime
    });
    setGpDestination('');
    setGpReason('');
    setShowNewGatePassModal(false);
  };

  const currentDayMenu = weeklyMenu.find(m => m.day === selectedDay) || weeklyMenu[0];

  return (
    <div className="space-y-6">
      {/* Student Profile & Quick Pain-Point Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-400/40 shadow-lg"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                <span className="font-mono bg-blue-400/20 text-blue-200 border border-blue-400/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  ID: {currentUser.loginId}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Age: {currentUser.age} (Adult Resident)
                </span>
                <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs px-2.5 py-0.5 rounded-full">
                  Room {currentUser.roomNumber}, {currentUser.block}
                </span>
              </div>
              <p className="text-gray-300 text-sm mt-1">
                {currentUser.course} • {currentUser.year} • Password (DOB): <code>{currentUser.dateOfBirth}</code>
              </p>
              
              {/* Highlight 21+ Gate Policy & Direct Incharge Guarantee */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-blue-200 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 max-w-2xl">
                <span className="font-semibold text-amber-300 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Direct Incharge Routing:
                </span>
                <span>
                  Food complaints reach <strong>Food Incharge</strong>, water reaches <strong>Water Incharge</strong>. 
                  As a <strong>21-year-old student</strong>, you have <strong>self-service gate pass</strong> rights.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Real-Time Status Widgets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className={`p-3 rounded-xl border text-xs backdrop-blur-xs ${
              myFloorHw?.status === 'operational'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                : 'bg-red-950/40 border-red-500/30 text-red-200'
            }`}>
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> 3rd Flr Geyser
                </span>
                <span className={`w-2 h-2 rounded-full ${myFloorHw?.status === 'operational' ? 'bg-emerald-400' : 'bg-red-400 animate-ping'}`}></span>
              </div>
              <p className="mt-1 font-bold text-sm">
                {myFloorHw?.status === 'operational' ? `${myFloorHw.temperature}°C (Hot)` : 'Cold / Tripping!'}
              </p>
              <p className="text-[10px] text-gray-300 mt-0.5">
                {myFloorHw?.status === 'operational' ? 'Heating Active' : 'Under Incharge SLA'}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-white/15 bg-white/5 text-xs backdrop-blur-xs text-blue-200">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5" /> Gate Outpass
                </span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1 rounded">21+ Self</span>
              </div>
              <p className="mt-1 font-bold text-sm text-white">
                {myActivePass ? myActivePass.passCode : 'No Active Pass'}
              </p>
              <p className="text-[10px] text-gray-300 mt-0.5">
                {myActivePass ? (myActivePass.status === 'departed' ? 'Outside Campus' : 'Ready at Gate') : 'Generate in 10s'}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-white/15 bg-white/5 text-xs backdrop-blur-xs text-amber-200 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Fees Status
                </span>
                <span className={`text-[10px] px-1 rounded font-bold uppercase ${
                  myFee?.status === 'paid' ? 'bg-emerald-500/30 text-emerald-200' : 'bg-amber-500/30 text-amber-200'
                }`}>
                  {myFee?.status || 'Active'}
                </span>
              </div>
              <p className="mt-1 font-bold text-sm text-white">
                {myFee ? `₹${myFee.paidAmount} / ₹${myFee.totalAmount}` : 'Settled'}
              </p>
              <p className="text-[10px] text-gray-300 mt-0.5">Hostel + Mess Fee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-xs border border-gray-200 flex flex-wrap gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('room')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'room' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>1. Room Details</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'complaints' ? 'bg-red-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>2. Complaints & Incharge Routing</span>
          <span className="bg-red-100 text-red-800 px-1.5 py-0.2 rounded-full text-[10px]">
            {complaints.filter(c => c.status !== 'resolved').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mess')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'mess' ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>3. Mess & Diet Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'fees' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>4. Fees & Receipts</span>
        </button>

        <button
          onClick={() => setActiveTab('gatepass')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'gatepass' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>5. Instant 21+ Gate Pass</span>
          {myActivePass && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'notices' ? 'bg-purple-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>6. Notifications ({announcements.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ROOM DETAILS                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'room' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  <span>My Allocated Room: Room {currentUser.roomNumber} ({currentUser.block})</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Unit: {myUnit?.name || 'Unit 2'} • Floor: 3 • Capacity: {myRoom?.capacity || 2} Beds
                </p>
              </div>

              <button
                onClick={() => setShowCleaningModal(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Request Room Cleaning</span>
              </button>
            </div>

            {/* Room Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-bold text-gray-500 uppercase text-[10px]">Room Occupants / Roommates</span>
                <div className="space-y-1 font-semibold text-gray-800">
                  <p className="text-blue-700">✓ {currentUser.name} (You - Age {currentUser.age})</p>
                  <p className="text-gray-600">✓ Amit Verma (Roll 2023-CS-18)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-bold text-gray-500 uppercase text-[10px]">Hot Water / Geyser Status</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm">{myFloorHw?.temperature || 18}°C</span>
                  <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    {myFloorHw?.status.toUpperCase() || 'MAINTENANCE'}
                  </span>
                </div>
                <p className="text-gray-500 text-[11px]">
                  Scheduled: 06:00 AM - 09:30 AM & 06:00 PM - 08:30 PM
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="font-bold text-gray-500 uppercase text-[10px]">Cleanliness Status</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm">Needs Attention</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    Sweep Due
                  </span>
                </div>
                <p className="text-gray-500 text-[11px]">Last mopped: 4 days ago</p>
              </div>
            </div>

            {/* Recent Cleaning Requests for this room */}
            <div className="pt-2">
              <h3 className="font-bold text-gray-800 text-xs mb-2">Cleaning Requests History for Room {currentUser.roomNumber}:</h3>
              <div className="space-y-2">
                {cleaningRequests.map(cr => (
                  <div key={cr.id} className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-gray-900">{cr.timeSlot} on {cr.date}</span>
                      <p className="text-gray-500 text-[11px]">{cr.specialInstructions || 'Regular sweep & mop'}</p>
                    </div>
                    <span className="bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                      {cr.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMPLAINTS & DIRECT INCHARGE ROUTING                              */}
      {/* ========================================================================= */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>Direct Incharge Grievance Routing</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                  Guaranteed SLA Countdown
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Food complaints reach <strong>Mr. Ramesh Verma (Food Incharge)</strong>, cold water reaches <strong>Mr. Rajesh Kumar (Water Incharge)</strong>. 
                Other students can upvote to escalate priority!
              </p>
            </div>

            <button
              onClick={() => setShowNewComplaintModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Raise New Complaint</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-gray-500 font-semibold uppercase tracking-wider text-[11px] mr-1">Filter:</span>
            {[
              { id: 'all', label: `All Tickets (${complaints.length})` },
              { id: 'mine', label: 'Filed by Me' },
              { id: 'breached', label: `⚠️ SLA Breached (${complaints.filter(c => c.isBreached && c.status !== 'resolved').length})` },
              { id: 'mess', label: 'Mess & Food' },
              { id: 'hotwater', label: 'Hot Water & Plumbing' },
              { id: 'cleaning', label: 'Room Cleanliness' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setComplaintFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                  complaintFilter === f.id
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Complaint Cards Grid */}
          <div className="space-y-4">
            {filteredComplaints.map(comp => {
              const isMyComplaint = comp.studentId === currentUser.id;
              const hasUpvoted = comp.upvotes.includes(currentUser.id);
              const isBreached = comp.isBreached && comp.status !== 'resolved';

              return (
                <div
                  key={comp.id}
                  className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md ${
                    isBreached ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {comp.ticketNumber}
                        </span>
                        
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                          comp.category === 'mess_food' ? 'bg-amber-100 text-amber-800' :
                          comp.category === 'room_cleaning' ? 'bg-cyan-100 text-cyan-800' :
                          comp.category === 'hot_water' ? 'bg-orange-100 text-orange-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {comp.category.replace('_', ' ')}
                        </span>

                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          comp.priority === 'critical' ? 'bg-red-600 text-white' :
                          comp.priority === 'high' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {comp.priority} priority
                        </span>

                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800">
                          {comp.status.replace('_', ' ')}
                        </span>

                        {isBreached && (
                          <span className="text-[11px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> SLA BREACHED (Neglected)
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-gray-900">{comp.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{comp.description}</p>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs text-gray-500 border-t border-gray-100">
                        <div>
                          <span className="text-gray-400">Assigned Incharge: </span>
                          <span className="font-semibold text-gray-800">{comp.assignedInchargeName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Filed by: </span>
                          <span className="font-medium text-gray-700">{comp.studentName} (Room {comp.roomNumber})</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>SLA: {comp.slaHours}h response guarantee</span>
                        </div>
                      </div>

                      {/* Resolution details if fixed */}
                      {comp.status === 'resolved' && (
                        <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                          <p className="font-semibold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Resolved by Incharge: {comp.resolutionNotes || 'Fixed and verified.'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Upvote & Escalate */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                      <button
                        onClick={() => upvoteComplaint(comp.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          hasUpvoted ? 'bg-blue-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Show community solidarity"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-white' : ''}`} />
                        <span>{comp.upvotes.length} Facing This</span>
                      </button>

                      {comp.status !== 'resolved' && comp.status !== 'escalated_to_warden' && (
                        <button
                          onClick={() => {
                            const reason = prompt('Why escalate to Warden?');
                            if (reason) escalateToChiefWarden(comp.id, reason);
                          }}
                          className="text-xs text-purple-700 hover:text-purple-900 font-semibold px-2.5 py-1.5 rounded-lg border border-purple-200"
                        >
                          👑 Escalate to Warden
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MESS OR MENU (Solving tasteless / bad food)                       */}
      {/* ========================================================================= */}
      {activeTab === 'mess' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">Weekly Diet Plan & Meal Quality System</span>
                <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Nutritional Transparency
                </span>
              </div>
              <p className="text-amber-100 text-xs mt-1 max-w-2xl">
                No more tasteless, mystery food. View balanced macronutrients, calories, and vote on meal quality. If food is tasteless or uneatable, your review alerts Mr. Ramesh Verma (Food Incharge).
              </p>
            </div>

            <button
              onClick={() => setShowMealFeedbackModal({ open: true, mealType: 'lunch', day: selectedDay })}
              className="bg-white text-amber-800 font-bold px-4 py-2 rounded-xl text-xs shadow-md hover:bg-amber-50 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Rate Current Meal</span>
            </button>
          </div>

          {/* Day of Week Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-gray-200">
            {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as DayOfWeek[]).map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                  selectedDay === day ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Meals of Selected Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealType[]).map(mealKey => {
              const meal = currentDayMenu[mealKey];
              const todayDateStr = new Date().toISOString().split('T')[0];
              const isSkipped = isMealSkipped(todayDateStr, mealKey);

              return (
                <div 
                  key={mealKey} 
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    isSkipped ? 'border-dashed border-gray-300 opacity-75 bg-gray-50/50' : 'border-gray-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 capitalize text-base">{mealKey}</span>
                        {meal.isSpecialDiet && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <HeartPulse className="w-3 h-3" /> Diet Plan
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" /> {meal.time}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-gray-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                      {meal.calories} kcal • {meal.protein} Protein
                    </span>
                  </div>

                  <div className="py-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Today's Dishes:</p>
                    <ul className="space-y-1.5">
                      {meal.items.map((item, idx) => (
                        <li key={idx} className="text-sm font-medium text-gray-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                    <button
                      onClick={() => toggleMealSkip(todayDateStr, mealKey)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        isSkipped ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSkipped ? '✓ Marked as Skipping' : 'Skip This Meal'}
                    </button>

                    <button
                      onClick={() => setShowMealFeedbackModal({ open: true, mealType: mealKey, day: selectedDay })}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span>Review Quality</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FEES & RECEIPTS                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span>Hostel & Mess Fee Statement</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Student: {currentUser.name} ({currentUser.loginId}) • Room {currentUser.roomNumber}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  myFee?.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  Status: {myFee?.status || 'Active'}
                </span>
              </div>
            </div>

            {myFee ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-gray-400 block uppercase font-bold text-[10px]">Hostel Room Rent:</span>
                    <span className="text-base font-bold text-gray-900">₹{myFee.hostelRent}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase font-bold text-[10px]">Mess Food Charges:</span>
                    <span className="text-base font-bold text-gray-900">₹{myFee.messFees}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase font-bold text-[10px]">Maintenance & Geyser:</span>
                    <span className="text-base font-bold text-gray-900">₹{myFee.maintenanceFee}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase font-bold text-[10px]">Total Amount:</span>
                    <span className="text-base font-bold text-indigo-700">₹{myFee.totalAmount}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <div>
                    <p className="font-bold text-gray-900">Amount Paid: ₹{myFee.paidAmount}</p>
                    <p className="text-gray-500 text-[11px]">
                      Balance Due: ₹{myFee.totalAmount - myFee.paidAmount} (Due Date: {myFee.dueDate})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {myFee.status !== 'paid' && (
                      <button
                        onClick={() => {
                          const amt = prompt('Enter payment amount to pay online (in ₹):', `${myFee.totalAmount - myFee.paidAmount}`);
                          if (amt) payStudentFee(myFee.id, Number(amt));
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                      >
                        Pay Online Now
                      </button>
                    )}

                    {myFee.receiptNumber && (
                      <button
                        onClick={() => alert(`Official Payment Receipt: ${myFee.receiptNumber}\nStudent: ${myFee.studentName}\nTotal Paid: ₹${myFee.paidAmount}\nStatus: ${myFee.status.toUpperCase()}`)}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Receipt ({myFee.receiptNumber})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-3">No active fee balance record found.</p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: INSTANT 21+ GATE PASS GENERATOR                                   */}
      {/* ========================================================================= */}
      {activeTab === 'gatepass' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">21+ Adult Resident Gate Outpass</span>
                <span className="bg-emerald-400 text-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  ✓ Self-Service Permitted
                </span>
              </div>
              <p className="text-emerald-100 text-xs mt-1 max-w-2xl">
                As you are <strong>21 years old</strong>, you do not need permission to leave hostel. You just need to register your gate pass to keep official records at the main security gate.
              </p>
            </div>

            <button
              onClick={() => setShowNewGatePassModal(true)}
              className="bg-white text-emerald-900 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Instant Pass</span>
            </button>
          </div>

          {/* Active Pass Card */}
          {myActivePass ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-md">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 font-mono font-bold text-sm px-3 py-1 rounded-lg">
                      {myActivePass.passCode}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 uppercase">
                      {myActivePass.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{myActivePass.destination}</h3>
                    <p className="text-gray-600 mt-0.5">{myActivePass.reason}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 block">Student:</span>
                      <span className="font-semibold text-gray-800">{myActivePass.studentName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Room & Block:</span>
                      <span className="font-semibold text-gray-800">Rm {myActivePass.roomNumber}, {myActivePass.block}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Expected Out:</span>
                      <span className="font-semibold text-gray-800">{myActivePass.outTimeExpected}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Expected Return:</span>
                      <span className="font-semibold text-gray-800">{myActivePass.returnTimeExpected}</span>
                    </div>
                  </div>
                </div>

                {/* QR Simulation */}
                <div className="flex flex-col items-center p-4 bg-slate-900 text-white rounded-2xl shrink-0 w-64 text-center">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className={i % 2 === 0 ? 'bg-black' : 'bg-white'} />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold mt-2 text-emerald-300">
                    {myActivePass.passCode}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">Show to Gate Security Guard</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-3">
              <QrCode className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-gray-900 text-base">No Active Gate Pass</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Generate your 21+ adult gate outpass in 10 seconds without waiting for any approvals.
              </p>
              <button
                onClick={() => setShowNewGatePassModal(true)}
                className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-700"
              >
                + Register Gate Pass
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: NOTIFICATIONS & HOSTEL DIRECTIVES                                 */}
      {/* ========================================================================= */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          {announcements.map(ann => (
            <div key={ann.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2 text-xs">
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
                From: <strong>{ann.authorName}</strong> ({ann.authorRole.replace('_', ' ')})
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: RAISE NEW COMPLAINT */}
      {showNewComplaintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Raise Grievance to Incharge</h3>
                <p className="text-xs text-gray-500">Automatically routes to the specific incharge with an SLA timer.</p>
              </div>
              <button onClick={() => setShowNewComplaintModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaintSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Category & Target Incharge:
                </label>
                <select
                  value={newCompCategory}
                  onChange={(e) => setNewCompCategory(e.target.value as ComplaintCategory)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="mess_food">🍽️ Food & Mess (Reaches Mr. Ramesh Verma - Food Incharge)</option>
                  <option value="hot_water">🚿 Hot Water & Geysers (Reaches Mr. Rajesh Kumar - Water Incharge)</option>
                  <option value="room_cleaning">🧹 Room Cleaning (Reaches Mrs. Shanti Devi - Cleaning Incharge)</option>
                  <option value="plumbing">🚰 Washroom Plumbing (Reaches Mr. Rajesh Kumar - Maintenance Incharge)</option>
                  <option value="electrical">⚡ Electrical & Breakers (Reaches Mr. Rajesh Kumar - Maintenance Incharge)</option>
                  <option value="general">👑 General Neglect (Reaches Chief Warden Dr. Kulkarni)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Issue Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tasteless watery dal in dinner or Cold water on 3rd floor"
                  value={newCompTitle}
                  onChange={(e) => setNewCompTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Description:</label>
                <textarea
                  required
                  rows={3}
                  value={newCompDesc}
                  onChange={(e) => setNewCompDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewComplaintModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Dispatch to Incharge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RATE MEAL */}
      {showMealFeedbackModal.open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">
              Rate {showMealFeedbackModal.day} {showMealFeedbackModal.mealType.toUpperCase()}
            </h3>
            <form onSubmit={handleMealFeedbackSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-2">Stars (1 to 5):</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setMealRatingVal(star)}
                      className="p-1"
                    >
                      <Star className={`w-7 h-7 ${star <= mealRatingVal ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-2">Taste Quality:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Delicious', 'Good', 'Average', 'Tasteless', 'Uneatable'] as TasteRating[]).map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setMealTasteVal(t)}
                      className={`py-2 px-2 rounded-xl font-bold border ${
                        mealTasteVal === t ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Feedback Comment:</label>
                <textarea
                  required
                  rows={2}
                  value={mealCommentVal}
                  onChange={(e) => setMealCommentVal(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMealFeedbackModal({ open: false, mealType: 'lunch', day: 'Monday' })}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 text-white font-bold px-4 py-2 rounded-xl shadow-md"
                >
                  Submit Food Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 21+ GATE PASS */}
      {showNewGatePassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Generate 21+ Gate Outpass</h3>
            <form onSubmit={handleGatePassSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Destination:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Central Library, Coaching, Market"
                  value={gpDestination}
                  onChange={(e) => setGpDestination(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Reason:</label>
                <input
                  type="text"
                  placeholder="e.g. Project research books, evening groceries"
                  value={gpReason}
                  onChange={(e) => setGpReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
                <strong>✓ Auto-Approved:</strong> Age 21 verified. Instant QR outpass registered for Gate Security.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewGatePassModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow-md"
                >
                  Issue Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CLEANING REQUEST */}
      {showCleaningModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Schedule Daily Room Cleaning</h3>
            <form onSubmit={handleCleaningSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Preferred Time Slot:</label>
                <select
                  value={cleanTimeSlot}
                  onChange={(e) => setCleanTimeSlot(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                  <option value="11:00 AM - 01:00 PM">Noon (11:00 AM - 01:00 PM)</option>
                  <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                  <option value="04:00 PM - 06:00 PM">Evening (04:00 PM - 06:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Special Instructions:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mop balcony floor, sweep under beds, wipe desk dust..."
                  value={cleanNotes}
                  onChange={(e) => setCleanNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCleaningModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 text-white font-bold px-4 py-2 rounded-xl shadow-md"
                >
                  Schedule Cleaning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
