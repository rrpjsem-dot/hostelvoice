export type UserRole = 
  | 'student' 
  | 'mess_incharge' 
  | 'cleaning_incharge' 
  | 'maintenance_incharge' 
  | 'security_guard' 
  | 'chief_warden';

export interface User {
  id: string;
  loginId: string; // e.g. STU-304, INC-MESS, WARDEN-01
  dateOfBirth: string; // Used as password! e.g. 2005-08-15
  name: string;
  email: string;
  role: UserRole;
  roomNumber?: string;
  block?: string;
  unitId?: string;
  unitName?: string;
  age: number;
  phone: string;
  avatar: string;
  course?: string;
  year?: string;
  isAdult?: boolean;
  roleTitle: string;
  inchargeDepartment?: 'mess' | 'water_maintenance' | 'cleaning' | 'security' | 'general';
}

export interface HostelUnit {
  id: string;
  name: string; // e.g. "Unit 1 (Block-A)", "Unit 2 (Block-B)"
  code: string;
  totalFloors: number;
  roomsPerFloor: number;
  totalRooms: number;
}

export interface HostelRoom {
  id: string;
  unitId: string;
  unitName: string;
  floor: number;
  roomNumber: string; // e.g. 101, 204, 304
  capacity: number; // e.g. 2 beds
  allocatedStudentIds: string[];
  allocatedStudentNames: string[];
  hasAttachedBathroom: boolean;
  geyserStatus: 'operational' | 'heating' | 'off' | 'maintenance';
  cleanlinessStatus: 'clean' | 'cleaning_scheduled' | 'needs_attention';
  lastCleanedAt?: string;
}

export interface HostelDetails {
  id: string;
  name: string;
  code: string;
  campus: string;
  address: string;
  wardenName: string;
  wardenContact: string;
  wardenEmail: string;
  wardenDob: string; // Warden's DOB (password)
  wardenLoginId: string;
  createdAt: string;
  totalUnits: number;
  totalRooms: number;
  totalCapacity: number;
  isConfigured: boolean;
}

export interface StudentFeeRecord {
  id: string;
  studentId: string;
  studentLoginId: string;
  studentName: string;
  roomNumber: string;
  unitName: string;
  semester: string;
  hostelRent: number;
  messFees: number;
  maintenanceFee: number;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'pending';
  dueDate: string;
  receiptNumber?: string;
  paidAt?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: 'Vegetables' | 'Dairy & Paneer' | 'Grains & Pulses' | 'Spices & Oil' | 'Gas & Essentials';
  estimatedCost: number;
}

export interface GroceryRequisition {
  id: string;
  indentNumber: string; // e.g. GROC-2026-101
  requestedDate: string;
  requestedByInchargeName: string;
  items: GroceryItem[];
  totalCost: number;
  status: 'pending_warden_approval' | 'approved_by_warden' | 'rejected';
  wardenNotes?: string;
  approvedAt?: string;
  budgetAllocated?: number;
}

export interface DutyMember {
  id: string;
  name: string;
  role: 'Head Chef' | 'Assistant Cook' | 'Helper / Chopper' | 'Dishwasher' | 'Plumber' | 'Electrician' | 'Sweeper';
  department: 'mess' | 'maintenance' | 'cleaning';
  shift: 'Morning (06:00 - 14:00)' | 'Evening (13:00 - 21:00)' | 'Full Day (08:00 - 18:00)';
  contact: string;
  status: 'on_duty' | 'off_duty' | 'on_leave';
}

export interface FoodInspectionRecord {
  id: string;
  inspectionDate: string;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  inspectedByName: string;
  oilQualityScore: number; // 1 to 5
  vegetableFreshnessScore: number; // 1 to 5
  foodTemperatureC: number;
  sampleKeptInFridge: boolean;
  tastedByIncharge: boolean;
  remarks: string;
  isHygienePassed: boolean;
}

export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type DayOfWeek = 
  | 'Monday' 
  | 'Tuesday' 
  | 'Wednesday' 
  | 'Thursday' 
  | 'Friday' 
  | 'Saturday' 
  | 'Sunday';

export interface MealDetails {
  items: string[];
  time: string;
  calories: number;
  protein: string;
  carbs: string;
  isSpecialDiet: boolean;
  dietTags: string[];
  description: string;
}

export interface DayMenu {
  day: DayOfWeek;
  dateStr?: string;
  breakfast: MealDetails;
  lunch: MealDetails;
  snacks: MealDetails;
  dinner: MealDetails;
}

export type TasteRating = 'Delicious' | 'Good' | 'Average' | 'Tasteless' | 'Uneatable';

export interface MealFeedback {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  day: DayOfWeek;
  mealType: MealType;
  date: string;
  rating: number; // 1 to 5
  taste: TasteRating;
  hygieneRating: number;
  tags: string[];
  comment: string;
  createdAt: string;
}

export type ComplaintCategory = 
  | 'mess_food' 
  | 'room_cleaning' 
  | 'hot_water' 
  | 'plumbing' 
  | 'electrical' 
  | 'security' 
  | 'general';

export type ComplaintPriority = 'critical' | 'high' | 'medium' | 'low';

export type ComplaintStatus = 
  | 'submitted' 
  | 'in_progress' 
  | 'resolved' 
  | 'escalated_to_warden' 
  | 'reopened';

export interface ComplaintComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  assignedRole: UserRole;
  assignedInchargeName: string;
  studentId: string;
  studentName: string;
  studentAge: number;
  roomNumber: string;
  block: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  upvotes: string[];
  comments: ComplaintComment[];
  photoUrl?: string;
  createdAt: string;
  slaHours: number;
  slaDeadline: string;
  isBreached: boolean;
  resolvedAt?: string;
  resolutionNotes?: string;
  studentSatisfactionRating?: number;
  studentReopenReason?: string;
}

export type CleaningStatus = 'requested' | 'assigned' | 'in_progress' | 'completed' | 'verified';

export interface CleaningRequest {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  block: string;
  date: string;
  timeSlot: string;
  status: CleaningStatus;
  specialInstructions?: string;
  assignedCleaner?: string;
  completedAt?: string;
  studentRating?: number;
  createdAt: string;
}

export type GeyserState = 'operational' | 'heating' | 'off' | 'maintenance';

export interface HotWaterStatus {
  id: string;
  block: string;
  floor: number;
  status: GeyserState;
  temperature: number;
  morningSchedule: string;
  eveningSchedule: string;
  isAvailableNow: boolean;
  lastUpdated: string;
  reportedColdCount: number;
}

export type GatePassStatus = 
  | 'active' 
  | 'departed' 
  | 'returned' 
  | 'overdue' 
  | 'cancelled';

export interface GatePass {
  id: string;
  passCode: string;
  studentId: string;
  studentName: string;
  studentAge: number;
  studentPhone: string;
  roomNumber: string;
  block: string;
  destination: string;
  reason: string;
  passType: 'adult_day_outing' | 'college_academic' | 'overnight_leave' | 'emergency';
  isSelfApproved: boolean;
  outTimeExpected: string;
  returnTimeExpected: string;
  actualOutTime?: string;
  actualInTime?: string;
  status: GatePassStatus;
  loggedByGuardName?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'mess' | 'maintenance' | 'cleaning' | 'warden' | 'general';
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
  isPinned: boolean;
  badge?: string;
}
