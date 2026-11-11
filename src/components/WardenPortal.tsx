'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  Utensils, 
  UserPlus, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  Megaphone, 
  CheckCircle2, 
  X, 
  Plus, 
  Sparkles, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Key, 
  Home, 
  ShoppingCart, 
  Eye, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import { UserRole } from '@/types';

export function WardenPortal() {
  const { 
    hostel, 
    units, 
    rooms, 
    fees, 
    groceries, 
    dutyMembers, 
    foodInspections, 
    users, 
    complaints, 
    announcements, 
    createStudent, 
    createIncharge, 
    allocateStudentToRoom, 
    approveGroceryRequisition, 
    updateComplaintStatus, 
    addComplaintComment, 
    addAnnouncement 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'units' | 'mess' | 'incharges' | 'students' | 'fees' | 'complaints' | 'notices'>('units');

  // Modals state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showInchargeModal, setShowInchargeModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // New Student Form State
  const [stuName, setStuName] = useState('');
  const [stuId, setStuId] = useState(`STU-${Math.floor(300 + Math.random() * 200)}`);
  const [stuDob, setStuDob] = useState('2005-06-18');
  const [stuAge, setStuAge] = useState(21);
  const [stuEmail, setStuEmail] = useState('');
  const [stuPhone, setStuPhone] = useState('+91 98765 00000');
  const [stuCourse, setStuCourse] = useState('B.Tech Mechanical');
  const [stuYear, setStuYear] = useState('4th Year');
  const [stuUnitId, setStuUnitId] = useState(units[0]?.id || 'unit_1');
  const [stuRoomId, setStuRoomId] = useState(rooms[0]?.id || 'rm_b_304');

  // New Incharge Form State
  const [incName, setIncName] = useState('');
  const [incId, setIncId] = useState(`INC-MESS-${Math.floor(10 + Math.random() * 90)}`);
  const [incDob, setIncDob] = useState('1983-07-22');
  const [incAge, setIncAge] = useState(43);
  const [incEmail, setIncEmail] = useState('');
  const [incPhone, setIncPhone] = useState('+91 98111 00000');
  const [incDept, setIncDept] = useState<'mess' | 'water_maintenance' | 'cleaning' | 'security'>('mess');

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'warden' | 'mess' | 'maintenance' | 'cleaning'>('warden');

  // Students list
  const studentsList = users.filter(u => u.role === 'student');
  const inchargesList = users.filter(u => u.role !== 'student' && u.role !== 'chief_warden');

  // Rooms filtered by unit
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const filteredRooms = rooms.filter(r => selectedUnitFilter === 'all' || r.unitId === selectedUnitFilter);

  // Calculation metrics
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.allocatedStudentIds.length, 0);
  const vacantBeds = totalBeds - occupiedBeds;

  const totalFeeDue = fees.reduce((acc, f) => acc + f.totalAmount, 0);
  const totalFeeCollected = fees.reduce((acc, f) => acc + f.paidAmount, 0);

  const pendingGroceries = groceries.filter(g => g.status === 'pending_warden_approval');

  const handleCreateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stuName.trim() || !stuId.trim() || !stuDob.trim()) return;

    createStudent({
      studentId: stuId,
      dateOfBirth: stuDob, // Password = DOB!
      name: stuName,
      email: stuEmail || `${stuId.toLowerCase()}@hostel.edu`,
      phone: stuPhone,
      age: Number(stuAge),
      course: stuCourse,
      year: stuYear,
      unitId: stuUnitId,
      roomId: stuRoomId
    });

    alert(`Student ${stuName} registered & room allocated!\n\nLogin ID: ${stuId}\nPassword (Date of Birth): ${stuDob}`);
    setShowStudentModal(false);
    setStuName('');
    setStuId(`STU-${Math.floor(300 + Math.random() * 200)}`);
  };

  const handleCreateInchargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incName.trim() || !incId.trim() || !incDob.trim()) return;

    let userRole: UserRole = 'mess_incharge';
    if (incDept === 'water_maintenance') userRole = 'maintenance_incharge';
    if (incDept === 'cleaning') userRole = 'cleaning_incharge';
    if (incDept === 'security') userRole = 'security_guard';

    createIncharge({
      inchargeId: incId,
      dateOfBirth: incDob, // Password = DOB!
      name: incName,
      email: incEmail || `${incId.toLowerCase()}@hostel.edu`,
      phone: incPhone,
      age: Number(incAge),
      department: incDept,
      role: userRole
    });

    alert(`Incharge ${incName} created for ${incDept.toUpperCase()}!\n\nLogin ID: ${incId}\nPassword (Date of Birth): ${incDob}`);
    setShowInchargeModal(false);
    setIncName('');
  };

  const handleCreateNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    addAnnouncement({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      badge: 'WARDEN DIRECTIVE',
      isPinned: true
    });

    setNoticeTitle('');
    setNoticeContent('');
    setShowNoticeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-700/60 border border-purple-400/40 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            👑
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{hostel.name}</h1>
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                Warden Master Command Center
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Chief Warden: <strong>{hostel.wardenName}</strong> (Login: <code>{hostel.wardenLoginId}</code> • Pass: <code>{hostel.wardenDob}</code>)
            </p>
            <p className="text-xs text-gray-400">
              {hostel.campus} • {units.length} Units • {rooms.length} Rooms • {totalBeds} Beds Capacity
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowStudentModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Allocate Student</span>
          </button>

          <button
            onClick={() => setShowInchargeModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Incharge ID</span>
          </button>

          <button
            onClick={() => setShowNoticeModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Post Notice</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-xs border border-gray-200 flex flex-wrap gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('units')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'units' ? 'bg-purple-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Units & Rooms ({units.length} Units, {rooms.length} Rooms)</span>
        </button>

        <button
          onClick={() => setActiveTab('mess')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'mess' ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>2. Mess & Grocery Approvals</span>
          {pendingGroceries.length > 0 && (
            <span className="bg-red-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">
              {pendingGroceries.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('incharges')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'incharges' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>3. Incharges Management ({inchargesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'students' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4. Students & Allocations ({studentsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'fees' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>5. Fees & Accounts</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'complaints' ? 'bg-red-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>6. Incharge SLA Oversight</span>
          <span className="bg-white/20 text-white px-1.5 py-0.2 rounded-full text-[10px]">
            {complaints.filter(c => c.isBreached).length} Breached
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: UNITS & ROOMS                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'units' && (
        <div className="space-y-6">
          {/* Units Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {units.map((unit, idx) => {
              const unitRooms = rooms.filter(r => r.unitId === unit.id);
              const unitOccupied = unitRooms.reduce((acc, r) => acc + r.allocatedStudentIds.length, 0);
              const unitTotalBeds = unitRooms.reduce((acc, r) => acc + r.capacity, 0);

              return (
                <div key={unit.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                      {unit.code}
                    </span>
                    <span className="text-xs text-gray-400">{unit.totalFloors} Floors</span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base">{unit.name}</h3>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Total Rooms: <strong>{unitRooms.length} Rooms</strong></p>
                    <p>Occupancy: <strong>{unitOccupied} / {unitTotalBeds} Beds Filled</strong></p>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${unitTotalBeds > 0 ? (unitOccupied / unitTotalBeds) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rooms Grid in Selected Unit */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Hostel Rooms Inventory</h3>
                <p className="text-xs text-gray-500">Filter rooms by unit to inspect cleanliness, geysers, and student allocations.</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-semibold">Select Unit:</span>
                <select
                  value={selectedUnitFilter}
                  onChange={(e) => setSelectedUnitFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-1.5 bg-white font-medium"
                >
                  <option value="all">All Units ({rooms.length} Rooms)</option>
                  {units.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRooms.map(rm => {
                const isFull = rm.allocatedStudentIds.length >= rm.capacity;
                const isPartiallyFilled = rm.allocatedStudentIds.length > 0 && !isFull;

                return (
                  <div 
                    key={rm.id} 
                    className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                      isFull ? 'bg-gray-50 border-gray-200' :
                      isPartiallyFilled ? 'bg-blue-50/40 border-blue-200' :
                      'bg-emerald-50/30 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">
                        Room {rm.roomNumber} ({rm.unitName.split(' ')[0]})
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isFull ? 'bg-gray-200 text-gray-700' :
                        isPartiallyFilled ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isFull ? 'Occupied' : `${rm.capacity - rm.allocatedStudentIds.length} Beds Free`}
                      </span>
                    </div>

                    <p className="text-gray-500">Floor: {rm.floor} • Capacity: {rm.capacity} Beds</p>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Occupants:</span>
                      {rm.allocatedStudentNames.length > 0 ? (
                        <div className="font-medium text-gray-800 space-y-0.5 mt-0.5">
                          {rm.allocatedStudentNames.map((name, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              <span>{name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No students allocated yet</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
                      <span className={rm.geyserStatus === 'operational' ? 'text-emerald-700 font-medium' : 'text-red-600 font-semibold'}>
                        Geyser: {rm.geyserStatus}
                      </span>
                      <span className="text-gray-500">
                        {rm.cleanlinessStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MESS & GROCERY APPROVALS                                          */}
      {/* ========================================================================= */}
      {activeTab === 'mess' && (
        <div className="space-y-6">
          {/* Grocery Approvals (Mess Incharge Indents) */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-600" />
                  <span>Mess Grocery Indents & Warden Approval Gateway</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Mess Incharge submits grocery requirements (sprouts, milk, paneer, wheat). Warden grants official budget clearance.
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                {pendingGroceries.length} Pending Approvals
              </span>
            </div>

            <div className="space-y-4">
              {groceries.map(indent => {
                const isPending = indent.status === 'pending_warden_approval';

                return (
                  <div 
                    key={indent.id} 
                    className={`p-5 rounded-2xl border transition-all ${
                      isPending ? 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                            {indent.indentNumber}
                          </span>
                          <span className="text-gray-500">Requested by: <strong>{indent.requestedByInchargeName}</strong></span>
                          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                            indent.status === 'approved_by_warden' ? 'bg-emerald-100 text-emerald-800' :
                            indent.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-200 text-amber-900 animate-pulse'
                          }`}>
                            {indent.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Items breakdown */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs">
                          <p className="font-bold text-gray-700 mb-1.5 uppercase text-[10px]">Grocery Requisition Items:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {indent.items.map(item => (
                              <div key={item.id} className="flex items-center justify-between p-1.5 rounded bg-gray-50 text-gray-800">
                                <span>{item.name} ({item.quantity})</span>
                                <span className="font-mono font-bold text-gray-900">₹{item.estimatedCost}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t flex justify-between font-bold text-gray-900">
                            <span>Total Estimated Cost:</span>
                            <span className="text-amber-800">₹{indent.totalCost}</span>
                          </div>
                        </div>

                        {indent.wardenNotes && (
                          <p className="text-xs text-gray-600">
                            <strong>Warden Note:</strong> {indent.wardenNotes}
                          </p>
                        )}
                      </div>

                      {/* Approval Actions */}
                      {isPending && (
                        <div className="flex flex-col gap-2 shrink-0 pt-2 md:pt-0">
                          <button
                            onClick={() => {
                              approveGroceryRequisition(indent.id, true, 'Approved by Chief Warden Dr. Kulkarni. Release PO to supplier.');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Grocery Indent</span>
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for rejection:');
                              if (reason) approveGroceryRequisition(indent.id, false, reason);
                            }}
                            className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-4 py-2 rounded-xl text-xs"
                          >
                            Reject Indent
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Food Quality Inspections Log */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-600" />
              <span>Mess Food Inspections Audit Log</span>
            </h3>
            <div className="space-y-2">
              {foodInspections.map(fi => (
                <div key={fi.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 capitalize">{fi.mealType} ({fi.inspectionDate})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        fi.isHygienePassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {fi.isHygienePassed ? 'Hygiene Passed' : 'Hygiene Warning'}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{fi.remarks}</p>
                    <p className="text-gray-400 text-[11px]">Inspected by: {fi.inspectedByName}</p>
                  </div>

                  <div className="text-right text-gray-600">
                    <p>Oil Quality: <strong>{fi.oilQualityScore} / 5</strong></p>
                    <p>Food Temp: <strong>{fi.foodTemperatureC}°C</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INCHARGES MANAGEMENT (Create Incharge ID with password = DOB)     */}
      {/* ========================================================================= */}
      {activeTab === 'incharges' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Hostel Incharges Roster & Credential Generator</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Work is split under specific incharges (Mess, Water, Cleaning, Security). 
                  <strong> Each Incharge ID logs in using their Date of Birth (DOB) as password.</strong>
                </p>
              </div>

              <button
                onClick={() => setShowInchargeModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Incharge ID</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Incharge ID (Login)</th>
                    <th className="py-2.5 px-3">Full Name</th>
                    <th className="py-2.5 px-3">Department Role</th>
                    <th className="py-2.5 px-3">Password (Date of Birth)</th>
                    <th className="py-2.5 px-3">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inchargesList.map(inc => (
                    <tr key={inc.id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700 bg-blue-50/50">
                        {inc.loginId}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-900">{inc.name}</td>
                      <td className="py-2.5 px-3">
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-semibold capitalize">
                          {inc.roleTitle}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">
                        {inc.dateOfBirth}
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">{inc.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STUDENTS MANAGEMENT & ROOM ALLOCATION (Password = DOB)            */}
      {/* ========================================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Student Enrollment & Room Allocation</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Warden creates student ID after allocating room. 
                  <strong> Student logs in using Student ID and their Date of Birth (DOB) as password.</strong>
                </p>
              </div>

              <button
                onClick={() => setShowStudentModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Allocate New Student</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Student ID (Login)</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Age</th>
                    <th className="py-2.5 px-3">Allocated Room & Unit</th>
                    <th className="py-2.5 px-3">Password (Date of Birth)</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {studentsList.map(stu => (
                    <tr key={stu.id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                        {stu.loginId}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-900">
                        {stu.name}
                        {stu.age >= 21 && (
                          <span className="ml-1 text-[10px] bg-blue-100 text-blue-700 font-bold px-1 rounded">21+</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">{stu.age} yrs</td>
                      <td className="py-2.5 px-3 font-semibold text-gray-800">
                        Room {stu.roomNumber} ({stu.unitName || stu.block})
                      </td>
                      <td className="py-2.5 px-3 font-mono text-purple-700 font-bold">
                        {stu.dateOfBirth}
                      </td>
                      <td className="py-2.5 px-3 text-gray-500">{stu.course}</td>
                      <td className="py-2.5 px-3 text-gray-500">{stu.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: FEES & ACCOUNTS                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500 uppercase">Total Fees Expected</span>
              <p className="text-2xl font-bold text-gray-900 mt-2">₹{totalFeeDue.toLocaleString()}</p>
              <p className="text-[11px] text-gray-400 mt-1">Hostel rent + mess + maintenance</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500 uppercase">Total Fees Collected</span>
              <p className="text-2xl font-bold text-emerald-600 mt-2">₹{totalFeeCollected.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                {totalFeeDue > 0 ? Math.round((totalFeeCollected / totalFeeDue) * 100) : 100}% collection rate
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
              <span className="text-xs font-semibold text-gray-500 uppercase">Pending Dues</span>
              <p className="text-2xl font-bold text-red-600 mt-2">₹{(totalFeeDue - totalFeeCollected).toLocaleString()}</p>
              <p className="text-[11px] text-red-600 font-semibold mt-1">Reminders dispatched to students</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Student Fee Records & Payment Receipts</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3">Rent</th>
                    <th className="py-2.5 px-3">Mess Fees</th>
                    <th className="py-2.5 px-3">Total Due</th>
                    <th className="py-2.5 px-3">Paid</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Receipt #</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fees.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-medium text-gray-900">
                        {f.studentName} ({f.studentLoginId})
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">{f.roomNumber}</td>
                      <td className="py-2.5 px-3">₹{f.hostelRent}</td>
                      <td className="py-2.5 px-3">₹{f.messFees}</td>
                      <td className="py-2.5 px-3 font-bold text-gray-900">₹{f.totalAmount}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">₹{f.paidAmount}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          f.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          f.status === 'partial' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-gray-500">{f.receiptNumber || 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: INCHARGE SLA OVERSIGHT                                            */}
      {/* ========================================================================= */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Anti-Neglect Grievance Monitor (Supervising Incharges)</span>
              </h3>
              <p className="text-xs text-gray-500">
                Every grievance is assigned to its specific incharge. If an incharge ignores complaints past SLA, enforce directives or penalties.
              </p>
            </div>

            <div className="space-y-3">
              {complaints.map(comp => (
                <div key={comp.id} className="p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {comp.ticketNumber}
                      </span>
                      <span className="font-bold text-gray-900">{comp.title}</span>
                    </div>
                    <span className="text-purple-700 font-bold">
                      Assigned: {comp.assignedInchargeName}
                    </span>
                  </div>

                  <p className="text-gray-600">{comp.description}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-gray-500">
                    <span>Filed by: <strong>{comp.studentName}</strong> (Room {comp.roomNumber})</span>
                    <span>{comp.upvotes.length} students upvoted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ALLOCATE NEW STUDENT & PASSWORD (DOB)                             */}
      {/* ========================================================================= */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Enroll Student & Allocate Room</h3>
                <p className="text-xs text-gray-500">Warden creates Student ID; Password is their Date of Birth (DOB).</p>
              </div>
              <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Student Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={stuName}
                  onChange={(e) => setStuName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Student Login ID:</label>
                  <input
                    type="text"
                    required
                    value={stuId}
                    onChange={(e) => setStuId(e.target.value.toUpperCase())}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Date of Birth (PASSWORD):
                  </label>
                  <input
                    type="date"
                    required
                    value={stuDob}
                    onChange={(e) => setStuDob(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Student Age:</label>
                  <input
                    type="number"
                    min={17}
                    max={30}
                    required
                    value={stuAge}
                    onChange={(e) => setStuAge(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                  {stuAge >= 21 && (
                    <span className="text-[10px] text-blue-700 font-bold">✓ 21+ Adult Gate Pass Authorized</span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Mobile Phone:</label>
                  <input
                    type="text"
                    required
                    value={stuPhone}
                    onChange={(e) => setStuPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Select Unit / Block:</label>
                  <select
                    value={stuUnitId}
                    onChange={(e) => setStuUnitId(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Select Room:</label>
                  <select
                    value={stuRoomId}
                    onChange={(e) => setStuRoomId(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                  >
                    {rooms.filter(r => r.unitId === stuUnitId).map(r => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} ({r.allocatedStudentIds.length}/{r.capacity} Beds)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 font-medium">
                <strong>Password Policy:</strong> Student will log in using <strong>Student ID: {stuId}</strong> and <strong>Password: {stuDob}</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Complete Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE INCHARGE ID & PASSWORD (DOB)                               */}
      {/* ========================================================================= */}
      {showInchargeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Create Incharge ID</h3>
                <p className="text-xs text-gray-500">Password is their Date of Birth (DOB).</p>
              </div>
              <button onClick={() => setShowInchargeModal(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInchargeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Incharge Department:</label>
                <select
                  value={incDept}
                  onChange={(e) => {
                    const d = e.target.value as any;
                    setIncDept(d);
                    if (d === 'mess') setIncId(`INC-MESS-${Math.floor(10 + Math.random() * 90)}`);
                    if (d === 'water_maintenance') setIncId(`INC-WATER-${Math.floor(10 + Math.random() * 90)}`);
                    if (d === 'cleaning') setIncId(`INC-CLEAN-${Math.floor(10 + Math.random() * 90)}`);
                    if (d === 'security') setIncId(`INC-GATE-${Math.floor(10 + Math.random() * 90)}`);
                  }}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="mess">🍽️ Mess & Food Quality Incharge</option>
                  <option value="water_maintenance">🚿 Hot Water & Maintenance Incharge</option>
                  <option value="cleaning">🧹 Housekeeping & Cleaning Incharge</option>
                  <option value="security">🛡️ Main Gate Security Officer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Incharge Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Ramesh Verma"
                  value={incName}
                  onChange={(e) => setIncName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Incharge Login ID:</label>
                  <input
                    type="text"
                    required
                    value={incId}
                    onChange={(e) => setIncId(e.target.value.toUpperCase())}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">
                    Date of Birth (PASSWORD):
                  </label>
                  <input
                    type="date"
                    required
                    value={incDob}
                    onChange={(e) => setIncDob(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-900 font-medium">
                <strong>Password Policy:</strong> Incharge will log in using <strong>Incharge ID: {incId}</strong> and <strong>Password: {incDob}</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInchargeModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl shadow-md"
                >
                  Generate Incharge ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: POST OFFICIAL DIRECTIVE                                           */}
      {/* ========================================================================= */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Issue Official Hostel Directive</h3>
            <form onSubmit={handleCreateNoticeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mess Food Quality Reform & Hot Water Schedule"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Content:</label>
                <textarea
                  required
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
