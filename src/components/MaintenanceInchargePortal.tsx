'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Wrench, 
  Flame, 
  Droplets, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sliders 
} from 'lucide-react';
import { HotWaterStatus } from '@/types';

export function MaintenanceInchargePortal() {
  const { 
    currentUser, 
    complaints, 
    hotWaterStatus, 
    updateGeyserStatus, 
    updateComplaintStatus, 
    addComplaintComment,
    addAnnouncement 
  } = useApp();

  const [resolvingCompId, setResolvingCompId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Maintenance tickets
  const maintComplaints = complaints.filter(c => 
    c.category === 'hot_water' || 
    c.category === 'plumbing' || 
    c.category === 'electrical' || 
    c.assignedRole === 'maintenance_incharge'
  );
  const openComplaints = maintComplaints.filter(c => c.status !== 'resolved');

  const handleResolveComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingCompId || !resolutionNotes.trim()) return;

    updateComplaintStatus(resolvingCompId, 'resolved', resolutionNotes);
    addComplaintComment(resolvingCompId, `Resolution by Maintenance Incharge: ${resolutionNotes}`);

    // If resolving the 3rd floor geyser complaint, auto-restore the geyser to operational!
    const targetComp = complaints.find(c => c.id === resolvingCompId);
    if (targetComp && targetComp.category === 'hot_water') {
      const b3Geyser = hotWaterStatus.find(h => h.block === 'Block-B' && h.floor === 3);
      if (b3Geyser) {
        updateGeyserStatus(b3Geyser.id, 'operational', 46);
      }
    }

    setResolvingCompId(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-800 via-amber-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-400/40 shadow-lg"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" />
                Hot Water & Facilities Incharge
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Directly responsible for hot water geysers, plumbing water flow, electricity, and fast repair turnarounds.
            </p>
          </div>
        </div>

        <div className="text-right text-xs bg-white/10 p-3 rounded-xl border border-white/20 shrink-0">
          <p className="font-bold text-amber-200">Heating Schedule Active:</p>
          <p>Morning: 06:00 AM - 09:30 AM</p>
          <p>Evening: 06:00 PM - 08:30 PM</p>
        </div>
      </div>

      {/* Geyser Control Center */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>Hostel Geyser & Hot Water Grid Control</span>
            </h2>
            <p className="text-xs text-gray-500">
              Real-time telemetry and manual controls. If an MCB trips or heating element fails, update status to notify students immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotWaterStatus.map(hw => {
            const isWorking = hw.status === 'operational';
            const isHeating = hw.status === 'heating';

            return (
              <div 
                key={hw.id}
                className={`p-4 rounded-xl border space-y-3 transition-all ${
                  isWorking ? 'bg-emerald-50/30 border-emerald-200' :
                  isHeating ? 'bg-amber-50/30 border-amber-200' :
                  'bg-red-50/40 border-red-300 ring-1 ring-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm">
                    {hw.block} • Floor {hw.floor}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    isWorking ? 'bg-emerald-100 text-emerald-800' :
                    isHeating ? 'bg-amber-100 text-amber-800' :
                    'bg-red-600 text-white'
                  }`}>
                    {hw.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Water Temp:</span>
                  <span className="font-bold text-base text-gray-900">{hw.temperature}°C</span>
                </div>

                {hw.reportedColdCount > 0 && (
                  <p className="text-xs text-red-600 font-semibold">
                    ⚠️ {hw.reportedColdCount} student cold water complaints
                  </p>
                )}

                {/* Control buttons */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => updateGeyserStatus(hw.id, 'operational', 48)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold py-1 rounded"
                  >
                    ON (Hot)
                  </button>
                  <button
                    onClick={() => updateGeyserStatus(hw.id, 'heating', 38)}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold py-1 rounded"
                  >
                    Heating
                  </button>
                  <button
                    onClick={() => updateGeyserStatus(hw.id, 'maintenance', 18)}
                    className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold py-1 rounded"
                  >
                    Maintenance
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Maintenance Grievance Queue */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span>Assigned Maintenance Grievances (Hot Water, Plumbing, Electrical)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Students report cold water, leaking taps, and electrical faults directly here. Resolve promptly before SLA breaches!
            </p>
          </div>
          <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full">
            {openComplaints.length} Pending
          </span>
        </div>

        <div className="space-y-3">
          {maintComplaints.map(comp => {
            const isResolved = comp.status === 'resolved';

            return (
              <div 
                key={comp.id}
                className={`p-4 rounded-xl border transition-all ${
                  isResolved ? 'bg-gray-50/50 border-gray-200 opacity-75' :
                  comp.isBreached ? 'bg-red-50/40 border-red-300' : 'bg-white border-orange-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                        {comp.ticketNumber}
                      </span>
                      <span className="font-semibold text-gray-700 capitalize">
                        {comp.category.replace('_', ' ')}
                      </span>
                      <span className="text-blue-700 font-semibold">• {comp.upvotes.length} students affected</span>
                      {comp.isBreached && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ⚠️ SLA Breached (Reported to Chief Warden)
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm">{comp.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{comp.description}</p>
                    <p className="text-xs text-gray-500">
                      Reported by: <strong>{comp.studentName}</strong> (Room {comp.roomNumber}, {comp.block})
                    </p>

                    {isResolved && (
                      <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-900 font-medium">
                        ✓ Fixed: {comp.resolutionNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-end gap-2 shrink-0">
                    {!isResolved && (
                      <button
                        onClick={() => setResolvingCompId(comp.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs"
                      >
                        Fix & Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resolution Modal */}
      {resolvingCompId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Resolve Maintenance Ticket</h3>
            <form onSubmit={handleResolveComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Repair Action / Parts Replaced:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Replaced faulty 3kW heating element in Block-B 3rd floor geyser. Re-tested MCB switch and water reached 46°C. Ready for use."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-orange-500"
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
                  Complete Repair
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
