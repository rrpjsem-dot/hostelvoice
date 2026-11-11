'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Utensils, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Star, 
  Edit3, 
  Plus, 
  Save, 
  X,
  Users,
  HeartPulse,
  ChefHat,
  ShoppingCart,
  Bot,
  Eye,
  Calendar,
  Sparkles,
  Send,
  CheckSquare
} from 'lucide-react';
import { DayOfWeek, MealType, DayMenu, GroceryItem } from '@/types';

export function MessInchargePortal() {
  const { 
    currentUser, 
    complaints, 
    weeklyMenu, 
    mealFeedbacks, 
    groceries,
    dutyMembers,
    foodInspections,
    skippedMeals, 
    updateComplaintStatus, 
    addComplaintComment,
    updateMealItem,
    submitGroceryRequisition,
    addDutyMember,
    recordFoodInspection,
    addAnnouncement 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'complaints' | 'menu' | 'grocery' | 'duty' | 'ai' | 'inspection'>('complaints');

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('dinner');
  const [editingMenuModal, setEditingMenuModal] = useState(false);

  // Edit Menu Form state
  const [editItemsText, setEditItemsText] = useState('');
  const [editCalories, setEditCalories] = useState(600);
  const [editProtein, setEditProtein] = useState('20g');
  const [editDietTags, setEditDietTags] = useState('High Protein, Balanced');
  const [editDesc, setEditDesc] = useState('');

  // Resolution modal state
  const [resolvingCompId, setResolvingCompId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Grocery Indent Form state
  const [showGroceryModal, setShowGroceryModal] = useState(false);
  const [grocItems, setGrocItems] = useState<Array<Omit<GroceryItem, 'id'>>>([
    { name: 'Fresh Moong Sprouts', quantity: '30 kg', category: 'Vegetables', estimatedCost: 2400 },
    { name: 'Fresh Curd / Dahi', quantity: '50 Litres', category: 'Dairy & Paneer', estimatedCost: 4000 },
    { name: 'Wheat Flour (MP Sharbati)', quantity: '150 kg', category: 'Grains & Pulses', estimatedCost: 5800 }
  ]);

  // Duty Member Form state
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [dutyName, setDutyName] = useState('');
  const [dutyRole, setDutyRole] = useState<'Head Chef' | 'Assistant Cook' | 'Helper / Chopper' | 'Dishwasher'>('Assistant Cook');
  const [dutyShift, setDutyShift] = useState<'Morning (06:00 - 14:00)' | 'Evening (13:00 - 21:00)'>('Evening (13:00 - 21:00)');
  const [dutyContact, setDutyContact] = useState('+91 98765 11223');

  // Food Inspection Form state
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspMealType, setInspMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('dinner');
  const [inspOilScore, setInspOilScore] = useState(4);
  const [inspVegScore, setInspVegScore] = useState(4);
  const [inspTemp, setInspTemp] = useState(72);
  const [inspSampleKept, setInspSampleKept] = useState(true);
  const [inspTasted, setInspTasted] = useState(true);
  const [inspRemarks, setInspRemarks] = useState('Food properly cooked with adequate spices, salt, and warm rotis. Oil is fresh.');
  const [inspPassed, setInspPassed] = useState(true);

  // AI Helper state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Complaints assigned to mess
  const messComplaints = complaints.filter(c => c.category === 'mess_food' || c.assignedRole === 'mess_incharge');
  const openComplaints = messComplaints.filter(c => c.status !== 'resolved');

  // Calculate sentiment stats
  const totalReviews = mealFeedbacks.length;
  const avgRating = totalReviews > 0 ? (mealFeedbacks.reduce((a, b) => a + b.rating, 0) / totalReviews).toFixed(1) : '3.0';

  const handleOpenEditMenu = () => {
    const currentDayData = weeklyMenu.find(m => m.day === selectedDay) || weeklyMenu[0];
    const meal = currentDayData[selectedMealType];
    setEditItemsText(meal.items.join('\n'));
    setEditCalories(meal.calories);
    setEditProtein(meal.protein);
    setEditDietTags(meal.dietTags.join(', '));
    setEditDesc(meal.description);
    setEditingMenuModal(true);
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const items = editItemsText.split('\n').map(s => s.trim()).filter(Boolean);
    const tags = editDietTags.split(',').map(s => s.trim()).filter(Boolean);

    const currentDayData = weeklyMenu.find(m => m.day === selectedDay) || weeklyMenu[0];
    const existing = currentDayData[selectedMealType];

    updateMealItem(selectedDay, selectedMealType, {
      ...existing,
      items,
      calories: Number(editCalories),
      protein: editProtein,
      dietTags: tags,
      description: editDesc,
      isSpecialDiet: true
    });

    setEditingMenuModal(false);
  };

  const handleResolveComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingCompId || !resolutionNotes.trim()) return;

    updateComplaintStatus(resolvingCompId, 'resolved', resolutionNotes);
    addComplaintComment(resolvingCompId, `Resolution by Mess Incharge: ${resolutionNotes}`);

    setResolvingCompId(null);
    setResolutionNotes('');
  };

  const handleCreateGrocerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitGroceryRequisition(grocItems);
    alert('Grocery requisition submitted to Chief Warden for permission & budget allocation!');
    setShowGroceryModal(false);
  };

  const handleAddDutySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dutyName.trim()) return;
    addDutyMember({
      name: dutyName,
      role: dutyRole,
      department: 'mess',
      shift: dutyShift,
      contact: dutyContact,
      status: 'on_duty'
    });
    setDutyName('');
    setShowDutyModal(false);
  };

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordFoodInspection({
      inspectionDate: new Date().toISOString().split('T')[0],
      mealType: inspMealType,
      oilQualityScore: Number(inspOilScore),
      vegetableFreshnessScore: Number(inspVegScore),
      foodTemperatureC: Number(inspTemp),
      sampleKeptInFridge: inspSampleKept,
      tastedByIncharge: inspTasted,
      remarks: inspRemarks,
      isHygienePassed: inspPassed
    });
    setShowInspectionModal(false);
    alert('Daily food inspection record logged successfully!');
  };

  const runAiHelper = (queryType: 'diet' | 'grocery' | 'complaint') => {
    setIsAiLoading(true);
    setTimeout(() => {
      if (queryType === 'diet') {
        setAiResponse(`🥗 AI Balanced Diet Suggestion for College Hostel:
• Protein Target: 24g - 28g per student.
• Recommendation: Substitute watery dal with slow-simmered Yellow Moong Dal + Panch Phoran tadka in ghee. 
• Add 50g sprouted moong tossed in lemon and Himalayan salt as an optional protein topper.
• Ensure rotis are made from 100% whole wheat with 5-minute resting dough to prevent hardness.`);
      } else if (queryType === 'grocery') {
        setAiResponse(`📦 AI Grocery Estimation based on Attendance & Skips:
• Expected Diners: 215 students (35 skipping).
• Rice required: 26 kg Basmati.
• Atta for rotis: 38 kg Whole wheat (averaging 3 rotis per student).
• Vegetables: 22 kg Seasonal vegetables + 12 kg Potatoes.
• Milk & Curd: 45 Litres fresh dahi.
• Estimated cost: ₹18,400 (Saves ₹3,800 by factoring in student meal skips!).`);
      } else {
        setAiResponse(`✍️ AI Drafted Response to Student Food Grievance:
"Dear Rahul, thank you for flagging the dinner quality. We immediately tested the yellow dal batch and found the cumin-mustard tempering had been omitted by the assistant cook. A written warning was issued, and fresh hot tadka was prepared for subsequent trays. We have also replaced the roti dough mixer. Please reach out anytime."`);
      }
      setIsAiLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/40 shadow-lg"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <span className="font-mono bg-amber-400/20 text-amber-200 border border-amber-400/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                ID: {currentUser.loginId}
              </span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5" />
                Mess & Catering Head
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Directly responsible for meal taste, diet plans, student food grievances, grocery permissions, and kitchen staff.
            </p>
            <p className="text-xs text-amber-200">
              Password (DOB): <code>{currentUser.dateOfBirth}</code>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowGroceryModal(true)}
            className="bg-white text-amber-900 font-bold px-3.5 py-2 rounded-xl text-xs shadow-md hover:bg-amber-50 transition-all flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-700" />
            <span>+ Request Groceries (Warden)</span>
          </button>

          <button
            onClick={() => setShowInspectionModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Record Food Inspection</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs matching user prompt */}
      <div className="bg-white rounded-2xl p-2 shadow-xs border border-gray-200 flex flex-wrap gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'complaints' ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>1. Student Complaints ({openComplaints.length} Open)</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'menu' ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>2. Generate Menu & Diet Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('grocery')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'grocery' ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>3. Grocery (Warden Permissions)</span>
        </button>

        <button
          onClick={() => setActiveTab('duty')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'duty' ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4. Duty Members & Cooks</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'ai' ? 'bg-purple-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>5. AI Helper (Diet & Cost Assistant)</span>
        </button>

        <button
          onClick={() => setActiveTab('inspection')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'inspection' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>6. Food Quality Inspection</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COMPLAINTS RAISED BY STUDENTS (Direct Food Grievances)            */}
      {/* ========================================================================= */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>Student Food Grievances (Directly Assigned to Mess Incharge)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  When students report tasteless, raw, or cold food, complaints land directly in your queue with an SLA countdown.
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                {openComplaints.length} Pending Actions
              </span>
            </div>

            <div className="space-y-3">
              {messComplaints.map(comp => {
                const isResolved = comp.status === 'resolved';

                return (
                  <div 
                    key={comp.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isResolved ? 'bg-gray-50/50 border-gray-200 opacity-80' : 
                      comp.isBreached ? 'bg-red-50/40 border-red-300' : 'bg-white border-amber-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            {comp.ticketNumber}
                          </span>
                          <span className="text-gray-500">Student: <strong>{comp.studentName}</strong> (Room {comp.roomNumber})</span>
                          <span className="text-blue-700 font-semibold">• {comp.upvotes.length} students upvoted</span>
                          {comp.isBreached && (
                            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ⚠️ SLA Breached (Reported to Chief Warden)
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-900 text-sm">{comp.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{comp.description}</p>

                        {isResolved && (
                          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-900 font-medium">
                            ✓ Resolved: {comp.resolutionNotes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-end gap-2 shrink-0">
                        {!isResolved && (
                          <>
                            <button
                              onClick={() => updateComplaintStatus(comp.id, 'in_progress')}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg"
                            >
                              Mark In Progress
                            </button>
                            <button
                              onClick={() => setResolvingCompId(comp.id)}
                              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs"
                            >
                              Resolve with Action Notes
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GENERATE / UPDATE MENU                                            */}
      {/* ========================================================================= */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-emerald-600" />
                  <span>Generate & Customize Weekly Diet Menu</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Provide nutritious, high-protein recipes to stop tasteless food complaints.
                </p>
              </div>

              <button
                onClick={handleOpenEditMenu}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Selected Meal</span>
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as DayOfWeek[]).map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedDay === day ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="flex gap-2 text-xs border-b pb-2">
              {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`font-semibold capitalize px-2 py-1 rounded ${
                    selectedMealType === type ? 'text-amber-800 border-b-2 border-amber-600 font-bold' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Selected Meal Preview */}
            {(() => {
              const currentDayData = weeklyMenu.find(m => m.day === selectedDay) || weeklyMenu[0];
              const meal = currentDayData[selectedMealType];
              return (
                <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm capitalize">{selectedDay} {selectedMealType}</span>
                    <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                      {meal.calories} kcal • {meal.protein} Protein
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{meal.description}</p>
                  <div className="pt-2">
                    <span className="font-semibold text-gray-600">Dishes:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-800 font-medium">
                      {meal.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GROCERY REQUISITIONS (Warden Permission)                          */}
      {/* ========================================================================= */}
      {activeTab === 'grocery' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-600" />
                  <span>Grocery Requisitions (Warden Approval Workflow)</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Mess Incharge prepares grocery indents for fresh vegetables, paneer, and milk. 
                  <strong> Chief Warden approves purchases and allocates official budget.</strong>
                </p>
              </div>

              <button
                onClick={() => setShowGroceryModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Grocery Indent</span>
              </button>
            </div>

            <div className="space-y-3">
              {groceries.map(indent => (
                <div key={indent.id} className="p-4 rounded-xl border border-gray-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {indent.indentNumber}
                      </span>
                      <span className="text-gray-500">Date: {indent.requestedDate}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      indent.status === 'approved_by_warden' ? 'bg-emerald-100 text-emerald-800' :
                      indent.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {indent.status === 'approved_by_warden' ? '✓ Warden Approved' : indent.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {indent.items.map(item => (
                      <div key={item.id} className="p-2 rounded bg-gray-50 border border-gray-100">
                        <span className="font-medium text-gray-800 block">{item.name}</span>
                        <span className="text-gray-500 text-[11px]">{item.quantity} • ₹{item.estimatedCost}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 font-bold">
                    <span>Total Cost: ₹{indent.totalCost}</span>
                    {indent.wardenNotes && (
                      <span className="text-gray-600 font-normal">Warden Remark: {indent.wardenNotes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DUTY MEMBERS & COOKS ROSTER                                       */}
      {/* ========================================================================= */}
      {activeTab === 'duty' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Kitchen Duty Members & Shifts</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Track cooks, helpers, and dishwashers on duty to enforce meal punctuality and hygiene.
                </p>
              </div>

              <button
                onClick={() => setShowDutyModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Staff Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dutyMembers.filter(dm => dm.department === 'mess').map(member => (
                <div key={member.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">{member.name}</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {member.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-amber-800 font-semibold">{member.role}</p>
                  <p className="text-gray-500">Shift: {member.shift}</p>
                  <p className="text-gray-400 text-[11px]">Phone: {member.contact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AI HELPER (Smart Diet & Recipe Assistant)                         */}
      {/* ========================================================================= */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-300" />
              <h2 className="text-xl font-bold">HostelVoice AI Mess & Diet Assistant</h2>
            </div>
            <p className="text-xs text-purple-200 max-w-2xl leading-relaxed">
              Use smart AI algorithms to formulate healthy diet menus, calculate exact grocery quantities based on student skip attendance, and draft resolution notes for complaints.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => runAiHelper('diet')}
                className="bg-white text-purple-900 font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-purple-50 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Suggest Balanced Diet Recipe</span>
              </button>

              <button
                onClick={() => runAiHelper('grocery')}
                className="bg-white text-purple-900 font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-purple-50 flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-purple-600" />
                <span>Estimate Groceries from Skips</span>
              </button>

              <button
                onClick={() => runAiHelper('complaint')}
                className="bg-white text-purple-900 font-bold px-3.5 py-2 rounded-xl text-xs hover:bg-purple-50 flex items-center gap-1.5"
              >
                <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
                <span>Draft Grievance Resolution</span>
              </button>
            </div>
          </div>

          {/* AI Response Output */}
          {isAiLoading && (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-xs text-gray-500">
              <Sparkles className="w-6 h-6 text-purple-600 animate-spin mx-auto mb-2" />
              <p className="font-semibold">AI Assistant is analyzing hostel nutritional parameters...</p>
            </div>
          )}

          {aiResponse && !isAiLoading && (
            <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-purple-900 text-xs uppercase flex items-center gap-1">
                  <Bot className="w-4 h-4 text-purple-600" /> AI Recommendation
                </span>
                <button onClick={() => setAiResponse(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <pre className="text-xs text-gray-800 whitespace-pre-wrap font-sans leading-relaxed pt-2">
                {aiResponse}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: FOOD QUALITY INSPECTION                                           */}
      {/* ========================================================================= */}
      {activeTab === 'inspection' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Daily Food Quality & Hygiene Inspections</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Inspect oil freshness, serving temperature, and taste before meals are served to students.
                </p>
              </div>

              <button
                onClick={() => setShowInspectionModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Inspection</span>
              </button>
            </div>

            <div className="space-y-3">
              {foodInspections.map(insp => (
                <div key={insp.id} className="p-4 rounded-xl border border-gray-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm capitalize">
                      {insp.mealType} ({insp.inspectionDate})
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                      insp.isHygienePassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {insp.isHygienePassed ? '✓ Passed Inspection' : 'Flagged Warning'}
                    </span>
                  </div>

                  <p className="text-gray-700">{insp.remarks}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 text-gray-600">
                    <div>Oil Quality: <strong>{insp.oilQualityScore}/5</strong></div>
                    <div>Veg Freshness: <strong>{insp.vegetableFreshnessScore}/5</strong></div>
                    <div>Temperature: <strong>{insp.foodTemperatureC}°C</strong></div>
                    <div>Tasted: <strong>{insp.tastedByIncharge ? 'Yes ✓' : 'No'}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {resolvingCompId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Resolve Food Grievance</h3>
            <form onSubmit={handleResolveComplaint} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Action Taken:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Added cumin-mustard tadka to dal batch, replaced hard rotis with fresh hot wheat rotis."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingCompId(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Mark Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MENU MODAL */}
      {editingMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">
              Edit {selectedDay} {selectedMealType.toUpperCase()}
            </h3>

            <form onSubmit={handleSaveMenu} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Menu Items (One per line):
                </label>
                <textarea
                  required
                  rows={4}
                  value={editItemsText}
                  onChange={(e) => setEditItemsText(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Calories (kcal):</label>
                  <input
                    type="number"
                    value={editCalories}
                    onChange={(e) => setEditCalories(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Protein grams:</label>
                  <input
                    type="text"
                    value={editProtein}
                    onChange={(e) => setEditProtein(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-1.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMenuModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 text-white font-bold px-5 py-2 rounded-xl"
                >
                  Save Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW GROCERY INDENT MODAL */}
      {showGroceryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Submit Grocery Requisition to Warden</h3>
            <p className="text-xs text-gray-500">Chief Warden Dr. Kulkarni must grant official purchase permission.</p>

            <form onSubmit={handleCreateGrocerySubmit} className="space-y-3 text-xs">
              <div className="space-y-2">
                {grocItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...grocItems];
                        updated[idx].name = e.target.value;
                        setGrocItems(updated);
                      }}
                      className="flex-2 border border-gray-300 rounded-lg px-2.5 py-1.5"
                    />
                    <input
                      type="text"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...grocItems];
                        updated[idx].quantity = e.target.value;
                        setGrocItems(updated);
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5"
                    />
                    <input
                      type="number"
                      placeholder="Cost ₹"
                      value={item.estimatedCost}
                      onChange={(e) => {
                        const updated = [...grocItems];
                        updated[idx].estimatedCost = Number(e.target.value);
                        setGrocItems(updated);
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-amber-900 font-medium">
                Total Budget Requested: ₹{grocItems.reduce((acc, it) => acc + it.estimatedCost, 0)}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGroceryModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Submit Indent to Warden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOD INSPECTION MODAL */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Record Daily Food Quality Inspection</h3>
            <form onSubmit={handleInspectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Meal Inspected:</label>
                <select
                  value={inspMealType}
                  onChange={(e) => setInspMealType(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Oil Freshness (1-5):</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={inspOilScore}
                    onChange={(e) => setInspOilScore(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Serving Temp (°C):</label>
                  <input
                    type="number"
                    value={inspTemp}
                    onChange={(e) => setInspTemp(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Inspection Remarks:</label>
                <textarea
                  rows={2}
                  value={inspRemarks}
                  onChange={(e) => setInspRemarks(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Log Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DUTY MEMBER MODAL */}
      {showDutyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Add Kitchen Staff Member</h3>
            <form onSubmit={handleAddDutySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Staff Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Cook"
                  value={dutyName}
                  onChange={(e) => setDutyName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Role:</label>
                <select
                  value={dutyRole}
                  onChange={(e) => setDutyRole(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Head Chef">Head Chef</option>
                  <option value="Assistant Cook">Assistant Cook</option>
                  <option value="Helper / Chopper">Helper / Chopper</option>
                  <option value="Dishwasher">Dishwasher</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Shift:</label>
                <select
                  value={dutyShift}
                  onChange={(e) => setDutyShift(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                  <option value="Evening (13:00 - 21:00)">Evening (13:00 - 21:00)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDutyModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Add Duty Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
