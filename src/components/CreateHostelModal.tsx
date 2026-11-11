'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Building2, CheckCircle2, X, Plus, Sparkles, Shield, User, Calendar, MapPin, Phone, Mail } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateHostelModal({ isOpen, onClose }: Props) {
  const { createHostel } = useApp();

  const [name, setName] = useState('Imperial Engineering Campus Hostel');
  const [campus, setCampus] = useState('North Tech Campus, Sector 4');
  const [address, setAddress] = useState('Hostel Enclave, University Boulevard, Pin 400076');
  const [totalUnits, setTotalUnits] = useState(3);
  const [floorsPerUnit, setFloorsPerUnit] = useState(3);
  const [roomsPerFloor, setRoomsPerFloor] = useState(6);
  const [wardenName, setWardenName] = useState('Dr. S. Kulkarni');
  const [wardenDob, setWardenDob] = useState('1970-05-15');
  const [wardenContact, setWardenContact] = useState('+91 98555 66778');
  const [wardenEmail, setWardenEmail] = useState('chief.warden@hostel.edu');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHostel({
      name,
      campus,
      address,
      totalUnits: Number(totalUnits),
      floorsPerUnit: Number(floorsPerUnit),
      roomsPerFloor: Number(roomsPerFloor),
      wardenName,
      wardenDob,
      wardenContact,
      wardenEmail
    });
    alert(`Hostel "${name}" created successfully!\n\nUnits generated: ${totalUnits}\nRooms per unit: ${floorsPerUnit * roomsPerFloor}\nTotal Rooms: ${totalUnits * floorsPerUnit * roomsPerFloor}\n\nWarden Login ID: WARDEN-01\nPassword (Warden DOB): ${wardenDob}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Hostel</h2>
              <p className="text-xs text-gray-500">Configure hostel units, room structure, and Warden master login.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hostel Identity */}
          <div className="space-y-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-purple-600" />
              1. Hostel Identity & Campus
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hostel Name:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aryabhata Central Engineering Hostel"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Campus Location:</label>
                <input
                  type="text"
                  required
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Address / Landmark:</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Units & Rooms Structure */}
          <div className="space-y-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              2. Units & Rooms Configuration
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Total Units / Blocks:</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  required
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <span className="text-[10px] text-gray-400">e.g. Unit 1 (Block-A), Unit 2 (Block-B)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Floors per Unit:</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  required
                  value={floorsPerUnit}
                  onChange={(e) => setFloorsPerUnit(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <span className="text-[10px] text-gray-400">e.g. 3 floors</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rooms per Floor:</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  required
                  value={roomsPerFloor}
                  onChange={(e) => setRoomsPerFloor(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <span className="text-[10px] text-gray-400">e.g. 6 rooms (101-106)</span>
              </div>
            </div>

            <div className="text-xs text-blue-800 bg-blue-100/60 p-2.5 rounded-xl font-medium">
              Calculated Total: <strong>{totalUnits * floorsPerUnit * roomsPerFloor} Rooms</strong> across {totalUnits} Units ({totalUnits * floorsPerUnit * roomsPerFloor * 2} Student Beds capacity).
            </div>
          </div>

          {/* Warden Identity & Password (DOB) */}
          <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              3. Chief Warden Profile & Password (Date of Birth)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Warden Full Name:</label>
                <input
                  type="text"
                  required
                  value={wardenName}
                  onChange={(e) => setWardenName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Warden Date of Birth (Used as Password):
                </label>
                <input
                  type="date"
                  required
                  value={wardenDob}
                  onChange={(e) => setWardenDob(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                />
                <span className="text-[10px] text-emerald-700 font-semibold">
                  Password will be: {wardenDob}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Official Mobile Phone:</label>
                <input
                  type="text"
                  required
                  value={wardenContact}
                  onChange={(e) => setWardenContact(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Official Email:</label>
                <input
                  type="email"
                  required
                  value={wardenEmail}
                  onChange={(e) => setWardenEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-purple-500/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Initialize Hostel & Master Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
