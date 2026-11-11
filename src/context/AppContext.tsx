'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  DayMenu, 
  Complaint, 
  MealFeedback, 
  CleaningRequest, 
  HotWaterStatus, 
  GatePass, 
  Announcement,
  MealType,
  DayOfWeek,
  TasteRating,
  ComplaintCategory,
  ComplaintPriority,
  CleaningStatus,
  HostelDetails,
  HostelUnit,
  HostelRoom,
  StudentFeeRecord,
  GroceryRequisition,
  DutyMember,
  FoodInspectionRecord,
  GroceryItem
} from '@/types';
import {
  INITIAL_HOSTEL,
  INITIAL_UNITS,
  INITIAL_ROOMS,
  INITIAL_USERS,
  INITIAL_FEES,
  INITIAL_GROCERIES,
  INITIAL_DUTY_MEMBERS,
  INITIAL_FOOD_INSPECTION,
  INITIAL_WEEKLY_MENU,
  INITIAL_MEAL_FEEDBACKS,
  INITIAL_COMPLAINTS,
  INITIAL_CLEANING_REQUESTS,
  INITIAL_HOT_WATER_STATUS,
  INITIAL_GATE_PASSES,
  INITIAL_ANNOUNCEMENTS
} from '@/lib/mockData';

interface AppContextType {
  // Hostel Info
  hostel: HostelDetails;
  units: HostelUnit[];
  rooms: HostelRoom[];
  fees: StudentFeeRecord[];
  groceries: GroceryRequisition[];
  dutyMembers: DutyMember[];
  foodInspections: FoodInspectionRecord[];

  // Core Data
  currentUser: User;
  users: User[];
  weeklyMenu: DayMenu[];
  mealFeedbacks: MealFeedback[];
  complaints: Complaint[];
  cleaningRequests: CleaningRequest[];
  hotWaterStatus: HotWaterStatus[];
  gatePasses: GatePass[];
  announcements: Announcement[];
  skippedMeals: Record<string, boolean>;

  // Authentication State
  isAuthenticated: boolean;
  loginError: string | null;

  // Hostel Creation & Setup
  createHostel: (data: {
    name: string;
    campus: string;
    address: string;
    totalUnits: number;
    floorsPerUnit: number;
    roomsPerFloor: number;
    wardenName: string;
    wardenDob: string;
    wardenContact: string;
    wardenEmail: string;
  }) => void;
  resetHostelToUnconfigured: () => void;

  // Warden Operations: Creating IDs & Room Allocation
  createStudent: (data: {
    studentId: string; // e.g. STU-305
    dateOfBirth: string; // Used as password!
    name: string;
    email: string;
    phone: string;
    age: number;
    course: string;
    year: string;
    unitId: string;
    roomId: string;
  }) => User;

  createIncharge: (data: {
    inchargeId: string; // e.g. INC-MESS-02
    dateOfBirth: string; // Used as password!
    name: string;
    email: string;
    phone: string;
    age: number;
    department: 'mess' | 'water_maintenance' | 'cleaning' | 'security';
    role: UserRole;
  }) => User;

  allocateStudentToRoom: (studentId: string, roomId: string) => void;

  // Authentication & Switching
  login: (loginId: string, dobPassword: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;

  // Fee Management
  payStudentFee: (feeId: string, amount: number) => void;

  // Groceries & Indents (Mess -> Warden approval)
  submitGroceryRequisition: (items: Omit<GroceryItem, 'id'>[]) => GroceryRequisition;
  approveGroceryRequisition: (indentId: string, approved: boolean, notes?: string, budgetAllocated?: number) => void;

  // Duty Members & Inspection
  addDutyMember: (member: Omit<DutyMember, 'id'>) => void;
  recordFoodInspection: (data: Omit<FoodInspectionRecord, 'id' | 'inspectedByName'>) => void;

  // Complaints & Grievance Routing
  addComplaint: (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    photoUrl?: string;
  }) => Complaint;
  upvoteComplaint: (complaintId: string) => void;
  addComplaintComment: (complaintId: string, text: string) => void;
  updateComplaintStatus: (complaintId: string, status: Complaint['status'], resolutionNotes?: string) => void;
  escalateToChiefWarden: (complaintId: string, reason?: string) => void;
  rateComplaintResolution: (complaintId: string, rating: number, feedback?: string) => void;
  reopenComplaint: (complaintId: string, reason: string) => void;

  // Mess & Menu
  addMealFeedback: (data: {
    day: DayOfWeek;
    mealType: MealType;
    date: string;
    rating: number;
    taste: TasteRating;
    hygieneRating: number;
    tags: string[];
    comment: string;
  }) => void;
  toggleMealSkip: (date: string, mealType: MealType) => void;
  isMealSkipped: (date: string, mealType: MealType) => boolean;
  updateMealItem: (day: DayOfWeek, mealType: MealType, details: DayMenu[MealType]) => void;

  // Cleaning
  requestCleaning: (data: {
    date: string;
    timeSlot: string;
    specialInstructions?: string;
  }) => CleaningRequest;
  updateCleaningStatus: (requestId: string, status: CleaningStatus, assignedCleaner?: string) => void;
  rateCleaningRequest: (requestId: string, rating: number) => void;

  // Hot Water
  updateGeyserStatus: (id: string, status: HotWaterStatus['status'], temp?: number) => void;
  reportColdWater: (id: string) => void;

  // Gate Pass
  createGatePass: (data: {
    destination: string;
    reason: string;
    passType: GatePass['passType'];
    outTimeExpected: string;
    returnTimeExpected: string;
  }) => GatePass;
  markGateDeparture: (passId: string) => void;
  markGateArrival: (passId: string) => void;
  cancelGatePass: (passId: string) => void;

  // Announcements
  addAnnouncement: (data: {
    title: string;
    content: string;
    category: Announcement['category'];
    badge?: string;
    isPinned?: boolean;
  }) => void;

  // Reset demo
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Hostel setup & structure
  const [hostel, setHostel] = useState<HostelDetails>(INITIAL_HOSTEL);
  const [units, setUnits] = useState<HostelUnit[]>(INITIAL_UNITS);
  const [rooms, setRooms] = useState<HostelRoom[]>(INITIAL_ROOMS);
  const [fees, setFees] = useState<StudentFeeRecord[]>(INITIAL_FEES);
  const [groceries, setGroceries] = useState<GroceryRequisition[]>(INITIAL_GROCERIES);
  const [dutyMembers, setDutyMembers] = useState<DutyMember[]>(INITIAL_DUTY_MEMBERS);
  const [foodInspections, setFoodInspections] = useState<FoodInspectionRecord[]>(INITIAL_FOOD_INSPECTION);

  // Users & Auth
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  // Default to Rahul Sharma (Age 21 student in Room 304, Block-B)
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Other state
  const [weeklyMenu, setWeeklyMenu] = useState<DayMenu[]>(INITIAL_WEEKLY_MENU);
  const [mealFeedbacks, setMealFeedbacks] = useState<MealFeedback[]>(INITIAL_MEAL_FEEDBACKS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [cleaningRequests, setCleaningRequests] = useState<CleaningRequest[]>(INITIAL_CLEANING_REQUESTS);
  const [hotWaterStatus, setHotWaterStatus] = useState<HotWaterStatus[]>(INITIAL_HOT_WATER_STATUS);
  const [gatePasses, setGatePasses] = useState<GatePass[]>(INITIAL_GATE_PASSES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [skippedMeals, setSkippedMeals] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedHostel = localStorage.getItem('hv_hostel_v2');
      const savedUnits = localStorage.getItem('hv_units_v2');
      const savedRooms = localStorage.getItem('hv_rooms_v2');
      const savedFees = localStorage.getItem('hv_fees_v2');
      const savedGroceries = localStorage.getItem('hv_groceries_v2');
      const savedDuty = localStorage.getItem('hv_duty_v2');
      const savedInspect = localStorage.getItem('hv_inspect_v2');
      const savedUsers = localStorage.getItem('hv_users_v2');
      const savedCurrentUser = localStorage.getItem('hv_currentUser_v2');
      const savedComplaints = localStorage.getItem('hv_complaints_v2');
      const savedMenu = localStorage.getItem('hv_menu_v2');
      const savedGatePasses = localStorage.getItem('hv_gatePasses_v2');
      const savedAnnounce = localStorage.getItem('hv_announcements_v2');

      if (savedHostel) setHostel(JSON.parse(savedHostel));
      if (savedUnits) setUnits(JSON.parse(savedUnits));
      if (savedRooms) setRooms(JSON.parse(savedRooms));
      if (savedFees) setFees(JSON.parse(savedFees));
      if (savedGroceries) setGroceries(JSON.parse(savedGroceries));
      if (savedDuty) setDutyMembers(JSON.parse(savedDuty));
      if (savedInspect) setFoodInspections(JSON.parse(savedInspect));
      if (savedUsers) setUsers(JSON.parse(savedUsers));
      if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));
      if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
      if (savedMenu) setWeeklyMenu(JSON.parse(savedMenu));
      if (savedGatePasses) setGatePasses(JSON.parse(savedGatePasses));
      if (savedAnnounce) setAnnouncements(JSON.parse(savedAnnounce));
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hv_hostel_v2', JSON.stringify(hostel));
      localStorage.setItem('hv_units_v2', JSON.stringify(units));
      localStorage.setItem('hv_rooms_v2', JSON.stringify(rooms));
      localStorage.setItem('hv_fees_v2', JSON.stringify(fees));
      localStorage.setItem('hv_groceries_v2', JSON.stringify(groceries));
      localStorage.setItem('hv_duty_v2', JSON.stringify(dutyMembers));
      localStorage.setItem('hv_inspect_v2', JSON.stringify(foodInspections));
      localStorage.setItem('hv_users_v2', JSON.stringify(users));
      localStorage.setItem('hv_currentUser_v2', JSON.stringify(currentUser));
      localStorage.setItem('hv_complaints_v2', JSON.stringify(complaints));
      localStorage.setItem('hv_menu_v2', JSON.stringify(weeklyMenu));
      localStorage.setItem('hv_gatePasses_v2', JSON.stringify(gatePasses));
      localStorage.setItem('hv_announcements_v2', JSON.stringify(announcements));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [
    hostel, 
    units, 
    rooms, 
    fees, 
    groceries, 
    dutyMembers, 
    foodInspections, 
    users, 
    currentUser, 
    complaints, 
    weeklyMenu, 
    gatePasses, 
    announcements, 
    isLoaded
  ]);

  // LOGIN FUNCTION: Validates User ID and password = DOB!
  const login = (loginId: string, dobPassword: string): boolean => {
    const cleanId = loginId.trim().toUpperCase();
    const cleanDob = dobPassword.trim();

    const user = users.find(u => 
      u.loginId.toUpperCase() === cleanId || 
      u.email.toLowerCase() === loginId.trim().toLowerCase()
    );

    if (!user) {
      setLoginError(`No account found with ID "${loginId}".`);
      return false;
    }

    // Check if password matches date of birth (or formatted variant)
    // Support YYYY-MM-DD or DD-MM-YYYY or DDMMYYYY
    const userDobClean = user.dateOfBirth.replace(/-/g, '');
    const inputClean = cleanDob.replace(/-/g, '');

    if (user.dateOfBirth === cleanDob || userDobClean === inputClean) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLoginError(null);
      return true;
    } else {
      setLoginError(`Incorrect password. Password must be your Date of Birth in YYYY-MM-DD format (e.g. ${user.dateOfBirth}).`);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      setLoginError(null);
    }
  };

  // CREATE HOSTEL (Warden Flow)
  const createHostel = (data: {
    name: string;
    campus: string;
    address: string;
    totalUnits: number;
    floorsPerUnit: number;
    roomsPerFloor: number;
    wardenName: string;
    wardenDob: string;
    wardenContact: string;
    wardenEmail: string;
  }) => {
    const newHostelId = `hostel_${Date.now()}`;
    const generatedUnits: HostelUnit[] = [];
    const generatedRooms: HostelRoom[] = [];

    // Create Units (e.g., Unit 1 (Block-A), Unit 2 (Block-B), ...)
    const unitLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let u = 0; u < data.totalUnits; u++) {
      const letter = unitLetters[u % unitLetters.length];
      const unitId = `unit_${u + 1}`;
      const unitName = `Unit ${u + 1} (Block-${letter})`;
      
      generatedUnits.push({
        id: unitId,
        name: unitName,
        code: `BLK-${letter}`,
        totalFloors: data.floorsPerUnit,
        roomsPerFloor: data.roomsPerFloor,
        totalRooms: data.floorsPerUnit * data.roomsPerFloor
      });

      // Generate rooms for this unit
      for (let f = 1; f <= data.floorsPerUnit; f++) {
        for (let r = 1; r <= data.roomsPerFloor; r++) {
          const roomNum = `${f}0${r}`;
          generatedRooms.push({
            id: `rm_${letter.toLowerCase()}_${roomNum}`,
            unitId: unitId,
            unitName: unitName,
            floor: f,
            roomNumber: roomNum,
            capacity: 2,
            allocatedStudentIds: [],
            allocatedStudentNames: [],
            hasAttachedBathroom: f >= 2,
            geyserStatus: 'operational',
            cleanlinessStatus: 'clean',
            lastCleanedAt: 'Just now'
          });
        }
      }
    }

    const newHostel: HostelDetails = {
      id: newHostelId,
      name: data.name,
      code: `HST-${Math.floor(1000 + Math.random() * 9000)}`,
      campus: data.campus,
      address: data.address,
      wardenName: data.wardenName,
      wardenContact: data.wardenContact,
      wardenEmail: data.wardenEmail,
      wardenDob: data.wardenDob,
      wardenLoginId: 'WARDEN-01',
      createdAt: new Date().toISOString(),
      totalUnits: data.totalUnits,
      totalRooms: generatedRooms.length,
      totalCapacity: generatedRooms.length * 2,
      isConfigured: true
    };

    // Update Chief Warden User
    const updatedWarden: User = {
      id: 'user_chief_warden',
      loginId: 'WARDEN-01',
      dateOfBirth: data.wardenDob,
      name: data.wardenName,
      email: data.wardenEmail,
      role: 'chief_warden',
      age: 52,
      phone: data.wardenContact,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      roleTitle: 'Chief Warden & Executive Rector'
    };

    setHostel(newHostel);
    setUnits(generatedUnits);
    setRooms(generatedRooms);
    setUsers(prev => [updatedWarden, ...prev.filter(u => u.role !== 'chief_warden')]);
    setCurrentUser(updatedWarden);
  };

  const resetHostelToUnconfigured = () => {
    setHostel(prev => ({ ...prev, isConfigured: false }));
  };

  // WARDEN: Create Student ID and allocate room with Password = DOB!
  const createStudent = (data: {
    studentId: string;
    dateOfBirth: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    course: string;
    year: string;
    unitId: string;
    roomId: string;
  }): User => {
    const targetRoom = rooms.find(r => r.id === data.roomId);
    const targetUnit = units.find(u => u.id === data.unitId);

    const newStudentUser: User = {
      id: `stu_${Date.now()}`,
      loginId: data.studentId.toUpperCase(),
      dateOfBirth: data.dateOfBirth, // Password is DOB!
      name: data.name,
      email: data.email,
      role: 'student',
      roomNumber: targetRoom ? targetRoom.roomNumber : '101',
      block: targetUnit ? targetUnit.name.split('(')[1]?.replace(')', '') || 'Block-A' : 'Block-A',
      unitId: data.unitId,
      unitName: targetUnit?.name || 'Unit 1',
      age: data.age,
      phone: data.phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      course: data.course,
      year: data.year,
      isAdult: data.age >= 21,
      roleTitle: data.age >= 21 ? 'Resident Student (Adult 21+)' : 'Resident Student'
    };

    // Update Room allocations
    if (targetRoom) {
      setRooms(prev => prev.map(r => {
        if (r.id !== data.roomId) return r;
        return {
          ...r,
          allocatedStudentIds: [...r.allocatedStudentIds, newStudentUser.id],
          allocatedStudentNames: [...r.allocatedStudentNames, `${newStudentUser.name} (Age ${newStudentUser.age})`]
        };
      }));
    }

    // Auto-create initial fee record for student
    const newFeeRecord: StudentFeeRecord = {
      id: `fee_${Date.now()}`,
      studentId: newStudentUser.id,
      studentLoginId: newStudentUser.loginId,
      studentName: newStudentUser.name,
      roomNumber: newStudentUser.roomNumber || '101',
      unitName: newStudentUser.unitName || 'Unit 1',
      semester: 'Current Semester 2026',
      hostelRent: 18000,
      messFees: 16500,
      maintenanceFee: 2500,
      totalAmount: 37000,
      paidAmount: 0,
      status: 'pending',
      dueDate: '2026-12-15'
    };

    setUsers(prev => [newStudentUser, ...prev]);
    setFees(prev => [newFeeRecord, ...prev]);

    return newStudentUser;
  };

  // WARDEN: Create Incharge ID with Password = DOB!
  const createIncharge = (data: {
    inchargeId: string;
    dateOfBirth: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    department: 'mess' | 'water_maintenance' | 'cleaning' | 'security';
    role: UserRole;
  }): User => {
    const roleTitles: Record<UserRole, string> = {
      student: 'Resident Student',
      mess_incharge: 'Mess & Food Catering Incharge',
      cleaning_incharge: 'Housekeeping & Cleanliness Incharge',
      maintenance_incharge: 'Facilities & Hot Water Incharge',
      security_guard: 'Main Gate Security Officer',
      chief_warden: 'Chief Warden & Rector'
    };

    const newInchargeUser: User = {
      id: `inc_${Date.now()}`,
      loginId: data.inchargeId.toUpperCase(),
      dateOfBirth: data.dateOfBirth, // Password is DOB!
      name: data.name,
      email: data.email,
      role: data.role,
      inchargeDepartment: data.department,
      age: data.age,
      phone: data.phone,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      roleTitle: roleTitles[data.role] || 'Hostel Incharge'
    };

    setUsers(prev => [newInchargeUser, ...prev]);
    return newInchargeUser;
  };

  const allocateStudentToRoom = (studentId: string, roomId: string) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    const targetStudent = users.find(u => u.id === studentId);
    if (!targetRoom || !targetStudent) return;

    // Remove from previous rooms
    setRooms(prev => prev.map(r => ({
      ...r,
      allocatedStudentIds: r.allocatedStudentIds.filter(id => id !== studentId),
      allocatedStudentNames: r.allocatedStudentNames.filter(name => !name.includes(targetStudent.name))
    })));

    // Add to new room
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      return {
        ...r,
        allocatedStudentIds: [...r.allocatedStudentIds, studentId],
        allocatedStudentNames: [...r.allocatedStudentNames, `${targetStudent.name} (Age ${targetStudent.age})`]
      };
    }));

    // Update user record
    setUsers(prev => prev.map(u => {
      if (u.id !== studentId) return u;
      return {
        ...u,
        roomNumber: targetRoom.roomNumber,
        unitId: targetRoom.unitId,
        unitName: targetRoom.unitName
      };
    }));

    if (currentUser.id === studentId) {
      setCurrentUser(prev => ({
        ...prev,
        roomNumber: targetRoom.roomNumber,
        unitId: targetRoom.unitId,
        unitName: targetRoom.unitName
      }));
    }
  };

  // FEE PAYMENT
  const payStudentFee = (feeId: string, amount: number) => {
    setFees(prev => prev.map(f => {
      if (f.id !== feeId) return f;
      const newPaid = f.paidAmount + amount;
      const newStatus = newPaid >= f.totalAmount ? 'paid' : 'partial';
      const rcpNum = `RCP-${Math.floor(1000 + Math.random() * 9000)}`;

      return {
        ...f,
        paidAmount: newPaid,
        status: newStatus,
        receiptNumber: rcpNum,
        paidAt: new Date().toISOString()
      };
    }));
  };

  // GROCERY INDENTS (Mess Incharge -> Warden Approval)
  const submitGroceryRequisition = (items: Omit<GroceryItem, 'id'>[]): GroceryRequisition => {
    const totalCost = items.reduce((acc, it) => acc + it.estimatedCost, 0);
    const indentNum = `GROC-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newIndent: GroceryRequisition = {
      id: `groc_${Date.now()}`,
      indentNumber: indentNum,
      requestedDate: new Date().toISOString().split('T')[0],
      requestedByInchargeName: currentUser.name,
      items: items.map((it, idx) => ({ ...it, id: `gi_${Date.now()}_${idx}` })),
      totalCost,
      status: 'pending_warden_approval',
      wardenNotes: 'Submitted for Warden clearance'
    };

    setGroceries(prev => [newIndent, ...prev]);
    return newIndent;
  };

  const approveGroceryRequisition = (indentId: string, approved: boolean, notes?: string, budgetAllocated?: number) => {
    setGroceries(prev => prev.map(g => {
      if (g.id !== indentId) return g;
      return {
        ...g,
        status: approved ? 'approved_by_warden' : 'rejected',
        wardenNotes: notes || (approved ? 'Approved and budgeted by Chief Warden.' : 'Rejected. Revise quantities.'),
        approvedAt: approved ? new Date().toISOString() : undefined,
        budgetAllocated: budgetAllocated || g.totalCost
      };
    }));
  };

  // DUTY MEMBERS
  const addDutyMember = (member: Omit<DutyMember, 'id'>) => {
    const newMember: DutyMember = {
      ...member,
      id: `dm_${Date.now()}`
    };
    setDutyMembers(prev => [newMember, ...prev]);
  };

  // FOOD INSPECTION
  const recordFoodInspection = (data: Omit<FoodInspectionRecord, 'id' | 'inspectedByName'>) => {
    const newRecord: FoodInspectionRecord = {
      ...data,
      id: `fi_${Date.now()}`,
      inspectedByName: currentUser.name
    };
    setFoodInspections(prev => [newRecord, ...prev]);
  };

  // COMPLAINT ROUTING RULE:
  // If food -> reaches Mess Incharge
  // If water -> reaches Water/Maintenance Incharge
  // If cleaning -> reaches Cleaning Incharge
  const getInchargeForCategory = (category: ComplaintCategory): { role: UserRole; name: string; slaHours: number } => {
    switch (category) {
      case 'mess_food':
        return { role: 'mess_incharge', name: 'Mr. Ramesh Verma (Mess Incharge)', slaHours: 12 };
      case 'room_cleaning':
        return { role: 'cleaning_incharge', name: 'Mrs. Shanti Devi (Housekeeping Incharge)', slaHours: 24 };
      case 'hot_water':
        return { role: 'maintenance_incharge', name: 'Mr. Rajesh Kumar (Maintenance & Water Incharge)', slaHours: 12 };
      case 'plumbing':
      case 'electrical':
        return { role: 'maintenance_incharge', name: 'Mr. Rajesh Kumar (Maintenance & Water Incharge)', slaHours: 24 };
      case 'security':
        return { role: 'security_guard', name: 'Officer Bahadur Singh (Gate Security)', slaHours: 12 };
      case 'general':
      default:
        return { role: 'chief_warden', name: 'Dr. S. Kulkarni (Chief Warden)', slaHours: 48 };
    }
  };

  const addComplaint = (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    photoUrl?: string;
  }): Complaint => {
    const inchargeInfo = getInchargeForCategory(data.category);
    const now = new Date();
    const deadline = new Date(now.getTime() + inchargeInfo.slaHours * 60 * 60 * 1000);
    const ticketIdNum = Math.floor(100 + Math.random() * 900);

    const newComplaint: Complaint = {
      id: `comp_${Date.now()}`,
      ticketNumber: `HV-2026-${ticketIdNum}`,
      title: data.title,
      description: data.description,
      category: data.category,
      assignedRole: inchargeInfo.role,
      assignedInchargeName: inchargeInfo.name,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAge: currentUser.age,
      roomNumber: currentUser.roomNumber || '304',
      block: currentUser.block || 'Block-B',
      priority: data.priority,
      status: 'submitted',
      upvotes: [currentUser.id],
      comments: [],
      photoUrl: data.photoUrl,
      createdAt: now.toISOString(),
      slaHours: inchargeInfo.slaHours,
      slaDeadline: deadline.toISOString(),
      isBreached: false
    };

    setComplaints(prev => [newComplaint, ...prev]);
    return newComplaint;
  };

  const upvoteComplaint = (complaintId: string) => {
    setComplaints(prev => prev.map(comp => {
      if (comp.id !== complaintId) return comp;
      const alreadyUpvoted = comp.upvotes.includes(currentUser.id);
      const newUpvotes = alreadyUpvoted
        ? comp.upvotes.filter(id => id !== currentUser.id)
        : [...comp.upvotes, currentUser.id];
      
      let newPriority = comp.priority;
      if (newUpvotes.length >= 4 && comp.priority !== 'critical') {
        newPriority = 'critical';
      }

      return {
        ...comp,
        upvotes: newUpvotes,
        priority: newPriority
      };
    }));
  };

  const addComplaintComment = (complaintId: string, text: string) => {
    const newComment = {
      id: `comm_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text,
      createdAt: new Date().toISOString()
    };

    setComplaints(prev => prev.map(comp => {
      if (comp.id !== complaintId) return comp;
      return {
        ...comp,
        comments: [...comp.comments, newComment]
      };
    }));
  };

  const updateComplaintStatus = (complaintId: string, status: Complaint['status'], resolutionNotes?: string) => {
    setComplaints(prev => prev.map(comp => {
      if (comp.id !== complaintId) return comp;
      return {
        ...comp,
        status,
        resolutionNotes: resolutionNotes || comp.resolutionNotes,
        resolvedAt: status === 'resolved' ? new Date().toISOString() : comp.resolvedAt
      };
    }));
  };

  const escalateToChiefWarden = (complaintId: string, reason?: string) => {
    setComplaints(prev => prev.map(comp => {
      if (comp.id !== complaintId) return comp;
      const escalationComment = {
        id: `comm_esc_${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        text: `⚠️ ESCALATED DIRECTLY TO CHIEF WARDEN: ${reason || 'Complaint ignored or neglected past expected timeframe.'}`,
        createdAt: new Date().toISOString()
      };
      return {
        ...comp,
        status: 'escalated_to_warden',
        priority: 'critical',
        isBreached: true,
        comments: [...comp.comments, escalationComment]
      };
    }));
  };

  const rateComplaintResolution = (complaintId: string, rating: number, feedback?: string) => {
    setComplaints(prev => prev.map(comp => {
      if (comp.id !== complaintId) return comp;
      return {
        ...comp,
        studentSatisfactionRating: rating,
        comments: feedback ? [
          ...comp.comments,
          {
            id: `comm_rate_${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            text: `Student Resolution Rating: ${rating}/5 ⭐ - ${feedback}`,
            createdAt: new Date().toISOString()
          }
        ] : comp.comments
      };
    }));
  };

  const reopenComplaint = (complaintId: string, reason: string) => {
    setComplaints(prev => prev.map(comp => {
      if (comp.id !== complaintId) return comp;
      return {
        ...comp,
        status: 'reopened',
        studentReopenReason: reason,
        comments: [
          ...comp.comments,
          {
            id: `comm_reopen_${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            text: `⚠️ ISSUE REOPENED BY STUDENT: ${reason}`,
            createdAt: new Date().toISOString()
          }
        ]
      };
    }));
  };

  // Mess & Diet
  const addMealFeedback = (data: {
    day: DayOfWeek;
    mealType: MealType;
    date: string;
    rating: number;
    taste: TasteRating;
    hygieneRating: number;
    tags: string[];
    comment: string;
  }) => {
    const newFeedback: MealFeedback = {
      id: `mf_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNumber: currentUser.roomNumber || '304',
      day: data.day,
      mealType: data.mealType,
      date: data.date,
      rating: data.rating,
      taste: data.taste,
      hygieneRating: data.hygieneRating,
      tags: data.tags,
      comment: data.comment,
      createdAt: new Date().toISOString()
    };

    setMealFeedbacks(prev => [newFeedback, ...prev]);

    if (data.taste === 'Tasteless' || data.taste === 'Uneatable' || data.rating <= 2) {
      const ticketIdNum = Math.floor(100 + Math.random() * 900);
      const autoMessComplaint: Complaint = {
        id: `comp_food_${Date.now()}`,
        ticketNumber: `HV-2026-${ticketIdNum}`,
        title: `Food Quality Alert: ${data.day} ${data.mealType.toUpperCase()} rated ${data.taste}`,
        description: `Student feedback on ${data.date}: "${data.comment}". Tags reported: ${data.tags.join(', ')}. Meal Taste Rating: ${data.taste} (${data.rating}/5 Stars).`,
        category: 'mess_food',
        assignedRole: 'mess_incharge',
        assignedInchargeName: 'Mr. Ramesh Verma (Mess Incharge)',
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentAge: currentUser.age,
        roomNumber: currentUser.roomNumber || '304',
        block: currentUser.block || 'Block-B',
        priority: data.taste === 'Uneatable' ? 'critical' : 'high',
        status: 'submitted',
        upvotes: [currentUser.id],
        comments: [],
        createdAt: new Date().toISOString(),
        slaHours: 12,
        slaDeadline: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
        isBreached: false
      };
      setComplaints(prev => [autoMessComplaint, ...prev]);
    }
  };

  const toggleMealSkip = (date: string, mealType: MealType) => {
    const key = `${currentUser.id}_${date}_${mealType}`;
    setSkippedMeals(prev => {
      const updated = { ...prev };
      if (updated[key]) {
        delete updated[key];
      } else {
        updated[key] = true;
      }
      return updated;
    });
  };

  const isMealSkipped = (date: string, mealType: MealType): boolean => {
    const key = `${currentUser.id}_${date}_${mealType}`;
    return !!skippedMeals[key];
  };

  const updateMealItem = (day: DayOfWeek, mealType: MealType, details: DayMenu[MealType]) => {
    setWeeklyMenu(prev => prev.map(m => {
      if (m.day !== day) return m;
      return {
        ...m,
        [mealType]: details
      };
    }));
  };

  // Cleaning
  const requestCleaning = (data: {
    date: string;
    timeSlot: string;
    specialInstructions?: string;
  }): CleaningRequest => {
    const newReq: CleaningRequest = {
      id: `cr_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roomNumber: currentUser.roomNumber || '304',
      block: currentUser.block || 'Block-B',
      date: data.date,
      timeSlot: data.timeSlot,
      status: 'requested',
      specialInstructions: data.specialInstructions,
      createdAt: new Date().toISOString()
    };

    setCleaningRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  const updateCleaningStatus = (requestId: string, status: CleaningStatus, assignedCleaner?: string) => {
    setCleaningRequests(prev => prev.map(cr => {
      if (cr.id !== requestId) return cr;
      return {
        ...cr,
        status,
        assignedCleaner: assignedCleaner || cr.assignedCleaner,
        completedAt: status === 'completed' ? new Date().toISOString() : cr.completedAt
      };
    }));
  };

  const rateCleaningRequest = (requestId: string, rating: number) => {
    setCleaningRequests(prev => prev.map(cr => {
      if (cr.id !== requestId) return cr;
      return {
        ...cr,
        studentRating: rating,
        status: 'verified'
      };
    }));
  };

  // Hot Water
  const updateGeyserStatus = (id: string, status: HotWaterStatus['status'], temp?: number) => {
    setHotWaterStatus(prev => prev.map(hw => {
      if (hw.id !== id) return hw;
      return {
        ...hw,
        status,
        temperature: temp !== undefined ? temp : (status === 'operational' ? 45 : (status === 'heating' ? 38 : 20)),
        isAvailableNow: status === 'operational' || status === 'heating',
        lastUpdated: 'Just now'
      };
    }));
  };

  const reportColdWater = (id: string) => {
    setHotWaterStatus(prev => prev.map(hw => {
      if (hw.id !== id) return hw;
      return {
        ...hw,
        reportedColdCount: hw.reportedColdCount + 1,
        lastUpdated: 'Just now'
      };
    }));

    const targetHw = hotWaterStatus.find(h => h.id === id);
    if (targetHw) {
      addComplaint({
        title: `Cold Water reported in ${targetHw.block} Floor ${targetHw.floor}`,
        description: `Student ${currentUser.name} reported that hot water is unavailable during scheduled heating hours. Water is cold/lukewarm. Immediate technician check required.`,
        category: 'hot_water',
        priority: 'high'
      });
    }
  };

  // Gate Pass
  const createGatePass = (data: {
    destination: string;
    reason: string;
    passType: GatePass['passType'];
    outTimeExpected: string;
    returnTimeExpected: string;
  }): GatePass => {
    const isAdultSelfApproved = currentUser.age >= 21;
    const passNum = Math.floor(1000 + Math.random() * 9000);
    const passCode = `HV-PASS-${passNum}`;

    const newPass: GatePass = {
      id: `gp_${Date.now()}`,
      passCode,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAge: currentUser.age,
      studentPhone: currentUser.phone,
      roomNumber: currentUser.roomNumber || '304',
      block: currentUser.block || 'Block-B',
      destination: data.destination,
      reason: data.reason,
      passType: data.passType,
      isSelfApproved: isAdultSelfApproved,
      outTimeExpected: data.outTimeExpected,
      returnTimeExpected: data.returnTimeExpected,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setGatePasses(prev => [newPass, ...prev]);
    return newPass;
  };

  const markGateDeparture = (passId: string) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGatePasses(prev => prev.map(gp => {
      if (gp.id !== passId) return gp;
      return {
        ...gp,
        status: 'departed',
        actualOutTime: nowTimeStr,
        loggedByGuardName: currentUser.role === 'security_guard' ? currentUser.name : 'Officer Bahadur Singh'
      };
    }));
  };

  const markGateArrival = (passId: string) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGatePasses(prev => prev.map(gp => {
      if (gp.id !== passId) return gp;
      return {
        ...gp,
        status: 'returned',
        actualInTime: nowTimeStr,
        loggedByGuardName: currentUser.role === 'security_guard' ? currentUser.name : 'Officer Bahadur Singh'
      };
    }));
  };

  const cancelGatePass = (passId: string) => {
    setGatePasses(prev => prev.map(gp => {
      if (gp.id !== passId) return gp;
      return { ...gp, status: 'cancelled' };
    }));
  };

  // Announcements
  const addAnnouncement = (data: {
    title: string;
    content: string;
    category: Announcement['category'];
    badge?: string;
    isPinned?: boolean;
  }) => {
    const newAnn: Announcement = {
      id: `ann_${Date.now()}`,
      title: data.title,
      content: data.content,
      category: data.category,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      badge: data.badge || data.category.toUpperCase(),
      isPinned: data.isPinned || false,
      createdAt: new Date().toISOString()
    };

    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setHostel(INITIAL_HOSTEL);
    setUnits(INITIAL_UNITS);
    setRooms(INITIAL_ROOMS);
    setFees(INITIAL_FEES);
    setGroceries(INITIAL_GROCERIES);
    setDutyMembers(INITIAL_DUTY_MEMBERS);
    setFoodInspections(INITIAL_FOOD_INSPECTION);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setIsAuthenticated(true);
    setLoginError(null);
    setWeeklyMenu(INITIAL_WEEKLY_MENU);
    setMealFeedbacks(INITIAL_MEAL_FEEDBACKS);
    setComplaints(INITIAL_COMPLAINTS);
    setCleaningRequests(INITIAL_CLEANING_REQUESTS);
    setHotWaterStatus(INITIAL_HOT_WATER_STATUS);
    setGatePasses(INITIAL_GATE_PASSES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSkippedMeals({});
  };

  return (
    <AppContext.Provider
      value={{
        hostel,
        units,
        rooms,
        fees,
        groceries,
        dutyMembers,
        foodInspections,
        currentUser,
        users,
        weeklyMenu,
        mealFeedbacks,
        complaints,
        cleaningRequests,
        hotWaterStatus,
        gatePasses,
        announcements,
        skippedMeals,
        isAuthenticated,
        loginError,
        createHostel,
        resetHostelToUnconfigured,
        createStudent,
        createIncharge,
        allocateStudentToRoom,
        login,
        logout,
        switchUser,
        payStudentFee,
        submitGroceryRequisition,
        approveGroceryRequisition,
        addDutyMember,
        recordFoodInspection,
        addComplaint,
        upvoteComplaint,
        addComplaintComment,
        updateComplaintStatus,
        escalateToChiefWarden,
        rateComplaintResolution,
        reopenComplaint,
        addMealFeedback,
        toggleMealSkip,
        isMealSkipped,
        updateMealItem,
        requestCleaning,
        updateCleaningStatus,
        rateCleaningRequest,
        updateGeyserStatus,
        reportColdWater,
        createGatePass,
        markGateDeparture,
        markGateArrival,
        cancelGatePass,
        addAnnouncement,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
