'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  QrCode, 
  Search, 
  CheckCircle2, 
  LogOut, 
  LogIn, 
  Clock, 
  AlertCircle, 
  Users,
  Building2 
} from 'lucide-react';

export function SecurityGuardPortal() {
  const { 
    currentUser, 
    gatePasses, 
    markGateDeparture, 
    markGateArrival 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Filter gate passes by search
  const filteredPasses = gatePasses.filter(gp => 
    gp.passCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gp.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gp.roomNumber.includes(searchTerm) ||
    gp.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentlyOutCount = gatePasses.filter(gp => gp.status === 'departed').length;
  const returnedTodayCount = gatePasses.filter(gp => gp.status === 'returned').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/40 shadow-lg"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Main Gate Security Incharge
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Verify digital student gate passes, log departures & arrivals with 1-click timestamps. 
              <strong> Adult residents (21+) pass instantly without warden signatures.</strong>
            </p>
          </div>
        </div>

        <div className="text-right text-xs bg-white/10 p-3 rounded-xl border border-white/20 shrink-0">
          <p className="font-bold text-indigo-200">Main Gate Post Active</p>
          <p>Terminal ID: GATE-01 (Main Entry)</p>
          <p className="text-emerald-400 font-semibold">{currentlyOutCount} Students Currently Outside</p>
        </div>
      </div>

      {/* Live Roll Call Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase">Currently Outside Campus</span>
          <p className="text-3xl font-bold text-amber-600 mt-2">{currentlyOutCount}</p>
          <p className="text-[11px] text-gray-400 mt-1">Checked out at gate</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase">Checked In Back Today</span>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{returnedTodayCount}</p>
          <p className="text-[11px] text-gray-400 mt-1">Safely inside hostel</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase">Overdue Returns</span>
          <p className="text-3xl font-bold text-gray-700 mt-2">0</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ All hostellers on schedule</p>
        </div>
      </div>

      {/* Fast Pass Scanner & Search Terminal */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span>Gate Pass Fast Verification Terminal</span>
            </h2>
            <p className="text-xs text-gray-500">
              Search by pass code (e.g. <code>HV-PASS-8841</code>), student name, or room number to check out/in.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Pass Code / Room / Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredPasses.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No matching passes found.</p>
          ) : (
            filteredPasses.map(gp => {
              const isOut = gp.status === 'departed';
              const isIn = gp.status === 'returned';

              return (
                <div 
                  key={gp.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isOut ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200' :
                    isIn ? 'bg-emerald-50/30 border-emerald-200' :
                    'bg-white border-gray-200 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Pass Details */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                          {gp.passCode}
                        </span>

                        <span className="font-bold text-gray-900 text-sm">
                          {gp.studentName}
                        </span>

                        <span className="text-xs text-gray-500">
                          (Room {gp.roomNumber}, {gp.block})
                        </span>

                        {/* Adult 21+ badge */}
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Age: {gp.studentAge} (21+ Self-Pass)
                        </span>

                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isOut ? 'bg-amber-600 text-white' :
                          isIn ? 'bg-emerald-600 text-white' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {isOut ? 'Currently Outside' : isIn ? 'Returned (Safe)' : 'Pass Issued (Inside)'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-700">
                        <strong className="text-gray-900">Destination:</strong> {gp.destination} • 
                        <strong className="text-gray-900 ml-1">Reason:</strong> {gp.reason}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
                        <span>Expected Out: <strong>{gp.outTimeExpected}</strong></span>
                        <span>Expected Return: <strong>{gp.returnTimeExpected}</strong></span>
                        {gp.actualOutTime && (
                          <span className="text-amber-800 font-semibold">
                            ✓ Left Gate at: {gp.actualOutTime}
                          </span>
                        )}
                        {gp.actualInTime && (
                          <span className="text-emerald-800 font-semibold">
                            ✓ Returned at: {gp.actualInTime}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Guard Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {gp.status === 'active' && (
                        <button
                          onClick={() => markGateDeparture(gp.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Departure (OUT)</span>
                        </button>
                      )}

                      {gp.status === 'departed' && (
                        <button
                          onClick={() => markGateArrival(gp.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Log Arrival (IN)</span>
                        </button>
                      )}

                      {gp.status === 'returned' && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Gate Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
