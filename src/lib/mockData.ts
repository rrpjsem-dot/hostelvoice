import { 
  User, 
  DayMenu, 
  Complaint, 
  MealFeedback, 
  CleaningRequest, 
  HotWaterStatus, 
  GatePass, 
  Announcement,
  HostelDetails,
  HostelUnit,
  HostelRoom,
  StudentFeeRecord,
  GroceryRequisition,
  DutyMember,
  FoodInspectionRecord
} from '@/types';

export const INITIAL_HOSTEL: HostelDetails = {
  id: 'hostel_main_01',
  name: 'Aryabhata Central Engineering Hostel',
  code: 'ACEH-2026',
  campus: 'Main Tech Campus, Tech Enclave',
  address: 'Hostel Complex, University Road, Pin 400076',
  wardenName: 'Dr. S. Kulkarni',
  wardenContact: '+91 98555 66778',
  wardenEmail: 'chief.warden@hostel.edu',
  wardenDob: '1970-05-15',
  wardenLoginId: 'WARDEN-01',
  createdAt: '2026-08-01T10:00:00Z',
  totalUnits: 3,
  totalRooms: 36,
  totalCapacity: 72,
  isConfigured: true
};

export const INITIAL_UNITS: HostelUnit[] = [
  {
    id: 'unit_1',
    name: 'Unit 1 (Block-A Junior Wing)',
    code: 'BLK-A',
    totalFloors: 3,
    roomsPerFloor: 6,
    totalRooms: 18
  },
  {
    id: 'unit_2',
    name: 'Unit 2 (Block-B Senior & 21+ Wing)',
    code: 'BLK-B',
    totalFloors: 3,
    roomsPerFloor: 6,
    totalRooms: 18
  },
  {
    id: 'unit_3',
    name: 'Unit 3 (Block-C PG & Research Wing)',
    code: 'BLK-C',
    totalFloors: 2,
    roomsPerFloor: 4,
    totalRooms: 8
  }
];

export const INITIAL_ROOMS: HostelRoom[] = [
  {
    id: 'rm_b_304',
    unitId: 'unit_2',
    unitName: 'Unit 2 (Block-B)',
    floor: 3,
    roomNumber: '304',
    capacity: 2,
    allocatedStudentIds: ['user_student_1'],
    allocatedStudentNames: ['Rahul Sharma (Age 21)'],
    hasAttachedBathroom: true,
    geyserStatus: 'maintenance',
    cleanlinessStatus: 'needs_attention',
    lastCleanedAt: '4 days ago'
  },
  {
    id: 'rm_b_302',
    unitId: 'unit_2',
    unitName: 'Unit 2 (Block-B)',
    floor: 3,
    roomNumber: '302',
    capacity: 2,
    allocatedStudentIds: ['user_student_6'],
    allocatedStudentNames: ['Amit Verma'],
    hasAttachedBathroom: false,
    geyserStatus: 'maintenance',
    cleanlinessStatus: 'clean',
    lastCleanedAt: 'Yesterday'
  },
  {
    id: 'rm_b_201',
    unitId: 'unit_2',
    unitName: 'Unit 2 (Block-B)',
    floor: 2,
    roomNumber: '201',
    capacity: 2,
    allocatedStudentIds: ['user_student_7'],
    allocatedStudentNames: ['Devendra S.'],
    hasAttachedBathroom: true,
    geyserStatus: 'operational',
    cleanlinessStatus: 'clean',
    lastCleanedAt: 'Today 10:00 AM'
  },
  {
    id: 'rm_a_208',
    unitId: 'unit_1',
    unitName: 'Unit 1 (Block-A)',
    floor: 2,
    roomNumber: '208',
    capacity: 2,
    allocatedStudentIds: ['user_student_2'],
    allocatedStudentNames: ['Priya Patel (Age 20)'],
    hasAttachedBathroom: true,
    geyserStatus: 'heating',
    cleanlinessStatus: 'clean',
    lastCleanedAt: 'Today 09:30 AM'
  },
  {
    id: 'rm_a_101',
    unitId: 'unit_1',
    unitName: 'Unit 1 (Block-A)',
    floor: 1,
    roomNumber: '101',
    capacity: 2,
    allocatedStudentIds: [],
    allocatedStudentNames: [],
    hasAttachedBathroom: false,
    geyserStatus: 'operational',
    cleanlinessStatus: 'clean',
    lastCleanedAt: 'Today 08:00 AM'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_student_1',
    loginId: 'STU-304',
    dateOfBirth: '2005-04-12', // Password is DOB!
    name: 'Rahul Sharma',
    email: 'rahul.s@hostel.edu',
    role: 'student',
    roomNumber: '304',
    block: 'Block-B',
    unitId: 'unit_2',
    unitName: 'Unit 2 (Block-B)',
    age: 21,
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    course: 'B.Tech Computer Science',
    year: '4th Year (Final Year)',
    isAdult: true,
    roleTitle: 'Resident Student (Adult 21+)'
  },
  {
    id: 'user_student_2',
    loginId: 'STU-208',
    dateOfBirth: '2006-09-20', // Password is DOB!
    name: 'Priya Patel',
    email: 'priya.p@hostel.edu',
    role: 'student',
    roomNumber: '208',
    block: 'Block-A',
    unitId: 'unit_1',
    unitName: 'Unit 1 (Block-A)',
    age: 20,
    phone: '+91 98765 88990',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    course: 'B.Tech Electrical Engg',
    year: '3rd Year',
    isAdult: true,
    roleTitle: 'Resident Student'
  },
  {
    id: 'user_mess_incharge',
    loginId: 'INC-MESS',
    dateOfBirth: '1982-08-14', // Password is DOB!
    name: 'Mr. Ramesh Verma',
    email: 'mess.incharge@hostel.edu',
    role: 'mess_incharge',
    inchargeDepartment: 'mess',
    age: 44,
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    roleTitle: 'Head Mess & Catering Incharge'
  },
  {
    id: 'user_cleaning_incharge',
    loginId: 'INC-CLEAN',
    dateOfBirth: '1978-11-25', // Password is DOB!
    name: 'Mrs. Shanti Devi',
    email: 'cleaning.incharge@hostel.edu',
    role: 'cleaning_incharge',
    inchargeDepartment: 'cleaning',
    age: 48,
    phone: '+91 98222 33445',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    roleTitle: 'Housekeeping & Cleanliness Incharge'
  },
  {
    id: 'user_maint_incharge',
    loginId: 'INC-WATER',
    dateOfBirth: '1985-03-30', // Password is DOB!
    name: 'Mr. Rajesh Kumar',
    email: 'maintenance.incharge@hostel.edu',
    role: 'maintenance_incharge',
    inchargeDepartment: 'water_maintenance',
    age: 41,
    phone: '+91 98333 44556',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    roleTitle: 'Facilities & Hot Water Incharge'
  },
  {
    id: 'user_security_guard',
    loginId: 'INC-GATE',
    dateOfBirth: '1976-12-10', // Password is DOB!
    name: 'Officer Bahadur Singh',
    email: 'gate.security@hostel.edu',
    role: 'security_guard',
    inchargeDepartment: 'security',
    age: 50,
    phone: '+91 98444 55667',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    roleTitle: 'Main Gate Head Security Incharge'
  },
  {
    id: 'user_chief_warden',
    loginId: 'WARDEN-01',
    dateOfBirth: '1970-05-15', // Password is DOB!
    name: 'Dr. S. Kulkarni',
    email: 'chief.warden@hostel.edu',
    role: 'chief_warden',
    inchargeDepartment: 'general',
    age: 56,
    phone: '+91 98555 66778',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    roleTitle: 'Chief Warden & Executive Rector'
  }
];

export const INITIAL_FEES: StudentFeeRecord[] = [
  {
    id: 'fee_1',
    studentId: 'user_student_1',
    studentLoginId: 'STU-304',
    studentName: 'Rahul Sharma',
    roomNumber: '304',
    unitName: 'Unit 2 (Block-B)',
    semester: 'Semester 7 (Autumn 2026)',
    hostelRent: 18000,
    messFees: 16500,
    maintenanceFee: 2500,
    totalAmount: 37000,
    paidAmount: 37000,
    status: 'paid',
    dueDate: '2026-08-20',
    receiptNumber: 'RCP-2026-7841',
    paidAt: '2026-08-14T11:30:00Z'
  },
  {
    id: 'fee_2',
    studentId: 'user_student_2',
    studentLoginId: 'STU-208',
    studentName: 'Priya Patel',
    roomNumber: '208',
    unitName: 'Unit 1 (Block-A)',
    semester: 'Semester 5 (Autumn 2026)',
    hostelRent: 18000,
    messFees: 16500,
    maintenanceFee: 2500,
    totalAmount: 37000,
    paidAmount: 20000,
    status: 'partial',
    dueDate: '2026-11-20',
    receiptNumber: 'RCP-2026-7842',
    paidAt: '2026-08-16T14:20:00Z'
  }
];

export const INITIAL_GROCERIES: GroceryRequisition[] = [
  {
    id: 'groc_req_1',
    indentNumber: 'GROC-2026-101',
    requestedDate: '2026-11-11',
    requestedByInchargeName: 'Mr. Ramesh Verma (Mess Incharge)',
    items: [
      { id: 'gi_1', name: 'Fresh Green Moong Sprouts', quantity: '40 kg', category: 'Vegetables', estimatedCost: 3200 },
      { id: 'gi_2', name: 'Fresh Buffalo Curd / Dahi', quantity: '60 Litres', category: 'Dairy & Paneer', estimatedCost: 4800 },
      { id: 'gi_3', name: 'Whole Wheat MP Sharbati Atta', quantity: '200 kg', category: 'Grains & Pulses', estimatedCost: 7600 },
      { id: 'gi_4', name: 'Fresh Paneer (Malai Cubes)', quantity: '35 kg', category: 'Dairy & Paneer', estimatedCost: 11200 },
      { id: 'gi_5', name: 'Mustard Oil & Pure Ghee', quantity: '25 Litres', category: 'Spices & Oil', estimatedCost: 5500 }
    ],
    totalCost: 32300,
    status: 'pending_warden_approval',
    wardenNotes: 'Pending review by Chief Warden Dr. Kulkarni'
  },
  {
    id: 'groc_req_2',
    indentNumber: 'GROC-2026-098',
    requestedDate: '2026-11-04',
    requestedByInchargeName: 'Mr. Ramesh Verma (Mess Incharge)',
    items: [
      { id: 'gi_6', name: 'Basmati Rice & Jeera', quantity: '150 kg', category: 'Grains & Pulses', estimatedCost: 8200 },
      { id: 'gi_7', name: 'Potatoes, Tomatoes, Onions', quantity: '120 kg', category: 'Vegetables', estimatedCost: 4400 }
    ],
    totalCost: 12600,
    status: 'approved_by_warden',
    wardenNotes: 'Approved. Bill to be cleared against contractor quota.',
    approvedAt: '2026-11-04T15:00:00Z',
    budgetAllocated: 12600
  }
];

export const INITIAL_DUTY_MEMBERS: DutyMember[] = [
  {
    id: 'dm_1',
    name: 'Master Chef Gurpal Singh',
    role: 'Head Chef',
    department: 'mess',
    shift: 'Morning (06:00 - 14:00)',
    contact: '+91 97111 44551',
    status: 'on_duty'
  },
  {
    id: 'dm_2',
    name: 'Cook Santosh Kumar',
    role: 'Assistant Cook',
    department: 'mess',
    shift: 'Evening (13:00 - 21:00)',
    contact: '+91 97222 55662',
    status: 'on_duty'
  },
  {
    id: 'dm_3',
    name: 'Helper Chhotu Ram',
    role: 'Helper / Chopper',
    department: 'mess',
    shift: 'Morning (06:00 - 14:00)',
    contact: '+91 97333 66773',
    status: 'on_duty'
  },
  {
    id: 'dm_4',
    name: 'Ramesh Cleaner',
    role: 'Sweeper',
    department: 'cleaning',
    shift: 'Full Day (08:00 - 18:00)',
    contact: '+91 97444 77884',
    status: 'on_duty'
  },
  {
    id: 'dm_5',
    name: 'Suresh Kumar Plumber',
    role: 'Plumber',
    department: 'maintenance',
    shift: 'Full Day (08:00 - 18:00)',
    contact: '+91 97555 88995',
    status: 'on_duty'
  }
];

export const INITIAL_FOOD_INSPECTION: FoodInspectionRecord[] = [
  {
    id: 'fi_1',
    inspectionDate: '2026-11-11',
    mealType: 'lunch',
    inspectedByName: 'Mr. Ramesh Verma (Mess Incharge)',
    oilQualityScore: 4,
    vegetableFreshnessScore: 4,
    foodTemperatureC: 72,
    sampleKeptInFridge: true,
    tastedByIncharge: true,
    remarks: 'Tadkewali dal and jeera rice freshly cooked. Temperature maintained at 72°C. Clean serving vessels.',
    isHygienePassed: true
  },
  {
    id: 'fi_2',
    inspectionDate: '2026-11-10',
    mealType: 'dinner',
    inspectedByName: 'Mr. Ramesh Verma (Mess Incharge)',
    oilQualityScore: 2,
    vegetableFreshnessScore: 3,
    foodTemperatureC: 54,
    sampleKeptInFridge: true,
    tastedByIncharge: true,
    remarks: 'Warning issued to evening cook: Rotis were stiff and dal lacked salt. Corrective measures initiated.',
    isHygienePassed: false
  }
];

export const INITIAL_WEEKLY_MENU: DayMenu[] = [
  {
    day: 'Monday',
    breakfast: {
      items: ['Aloo Paratha (with fresh curd)', 'Boiled Eggs / Bananas (Gym Diet)', 'Mint Chutney', 'Tea & Coffee'],
      time: '07:30 AM - 09:30 AM',
      calories: 520,
      protein: '16g',
      carbs: '68g',
      isSpecialDiet: true,
      dietTags: ['High Energy', 'Protein Option', 'Probiotic Curd'],
      description: 'Wholesome breakfast with freshly curdled yogurt and optional protein supplements for athletes.'
    },
    lunch: {
      items: ['Jeera Rice', 'Tadka Yellow Dal (Low oil)', 'Paneer Bhurji / Soya chunks', 'Tandoori Chapati', 'Cucumber & Carrot Salad'],
      time: '12:30 PM - 02:30 PM',
      calories: 680,
      protein: '24g',
      carbs: '85g',
      isSpecialDiet: true,
      dietTags: ['Balanced Diet', 'Vegetarian Protein', 'Fiber Rich'],
      description: 'Balanced midday diet packed with legumes and fiber.'
    },
    snacks: {
      items: ['Sprouts Chaat with lemon', 'Biscuits', 'Ginger Lemon Tea'],
      time: '05:00 PM - 06:15 PM',
      calories: 210,
      protein: '9g',
      carbs: '32g',
      isSpecialDiet: true,
      dietTags: ['Zero Junk', 'Gym Friendly', 'Sprouts Diet'],
      description: 'High-protein moong sprouts tossed with lemon juice, onion, and tomatoes.'
    },
    dinner: {
      items: ['Butter Roti (Wheat)', 'Rajma Masala (Slow Cooked)', 'Steamed Basmati Rice', 'Seasonal Mixed Veg', 'Gulab Jamun (1 pc)'],
      time: '07:30 PM - 09:45 PM',
      calories: 640,
      protein: '22g',
      carbs: '90g',
      isSpecialDiet: false,
      dietTags: ['Comfort Food', 'Iron Rich', 'Special Dessert'],
      description: 'Nutritious Punjabi Rajma prepared with minimal saturated oils.'
    }
  },
  {
    day: 'Tuesday',
    breakfast: {
      items: ['Vegetable Poha with peanuts', 'Boiled Eggs / Sweet Potato', 'Coconut Chutney', 'Masala Milk / Tea'],
      time: '07:30 AM - 09:30 AM',
      calories: 460,
      protein: '14g',
      carbs: '60g',
      isSpecialDiet: true,
      dietTags: ['Light Diet', 'Digestive', 'Iron Rich'],
      description: 'Flattened rice lightly tempered with mustard seeds, curry leaves, and crunchy peanuts.'
    },
    lunch: {
      items: ['Steamed Rice', 'Dal Tadka', 'Bhindi Masala (Crispy)', 'Phulka Roti with light ghee', 'Fresh Butter Milk (Chaas)'],
      time: '12:30 PM - 02:30 PM',
      calories: 610,
      protein: '18g',
      carbs: '80g',
      isSpecialDiet: true,
      dietTags: ['Hydrating Chaas', 'Low Sodium', 'Gut Friendly'],
      description: 'Refreshing summer meal with digestive butter milk to prevent afternoon lethargy.'
    },
    snacks: {
      items: ['Veg Cutlet (Baked/Light Fried)', 'Green Chutney', 'Cardamom Tea'],
      time: '05:00 PM - 06:15 PM',
      calories: 240,
      protein: '5g',
      carbs: '36g',
      isSpecialDiet: false,
      dietTags: ['Crispy Snacks'],
      description: 'Vegetable and potato patties seasoned with Indian herbs.'
    },
    dinner: {
      items: ['Multigrain Roti', 'Chole Curry (Kabuli Chana)', 'Jeera Pulao', 'Boondi Raita', 'Green Salad'],
      time: '07:30 PM - 09:45 PM',
      calories: 690,
      protein: '23g',
      carbs: '95g',
      isSpecialDiet: true,
      dietTags: ['High Protein Legumes', 'Multigrain Roti'],
      description: 'High protein chickpeas with multigrain flour rotis.'
    }
  },
  {
    day: 'Wednesday',
    breakfast: {
      items: ['Steamed Idli & Medu Vada (1 pc)', 'Rich Vegetable Sambar', 'Fresh Coconut Chutney', 'Filter Coffee / Tea'],
      time: '07:30 AM - 09:30 AM',
      calories: 480,
      protein: '12g',
      carbs: '74g',
      isSpecialDiet: true,
      dietTags: ['Fermented Probiotic', 'Low Fat', 'Traditional South Indian'],
      description: 'Easily digestible steamed rice cakes paired with vegetable lentil stew.'
    },
    lunch: {
      items: ['Veg Biryani / Pulav', 'Mixed Dal Fry', 'Paneer Butter Masala', 'Mint Raita', 'Papad'],
      time: '12:30 PM - 02:30 PM',
      calories: 720,
      protein: '26g',
      carbs: '92g',
      isSpecialDiet: true,
      dietTags: ['Feast Day', 'High Protein Paneer'],
      description: 'Mid-week special aromatic biryani with cottage cheese cubes in rich tomato gravy.'
    },
    snacks: {
      items: ['Sweet Corn Chaat (Steamed)', 'Chaat Masala', 'Tea / Black Coffee'],
      time: '05:00 PM - 06:15 PM',
      calories: 190,
      protein: '6g',
      carbs: '38g',
      isSpecialDiet: true,
      dietTags: ['Clean Eating', 'Steamed', 'Zero Oil'],
      description: 'Naturally sweet tender corn kernels with lemon and pink Himalayan salt.'
    },
    dinner: {
      items: ['Wheat Phulka', 'Moong Dal (Digestive Yellow)', 'Aloo Gobi Matar', 'Steamed Rice', 'Kheer (Rice Pudding)'],
      time: '07:30 PM - 09:45 PM',
      calories: 630,
      protein: '19g',
      carbs: '88g',
      isSpecialDiet: true,
      dietTags: ['Light Dinner', 'Digestive', 'Sweet Treat'],
      description: 'Comforting moong dal ideal for peaceful sleep and easy digestion.'
    }
  },
  {
    day: 'Thursday',
    breakfast: {
      items: ['Methi Thepla / Poori Bhaji', 'Chhena / Curd Cup', 'Pickle', 'Hot Masala Chai'],
      time: '07:30 AM - 09:30 AM',
      calories: 510,
      protein: '15g',
      carbs: '65g',
      isSpecialDiet: true,
      dietTags: ['Fenugreek Fiber', 'Calcium Boost'],
      description: 'Whole wheat flatbread infused with fresh fenugreek leaves.'
    },
    lunch: {
      items: ['Steamed Rice', 'Kadhi Pakora', 'Aloo Beans Fry', 'Rotis', 'Onion & Lemon Salad'],
      time: '12:30 PM - 02:30 PM',
      calories: 650,
      protein: '17g',
      carbs: '89g',
      isSpecialDiet: true,
      dietTags: ['Traditional Kadhi', 'Probiotic Yogurt'],
      description: 'Sour yogurt curry tempered with hing and fenugreek.'
    },
    snacks: {
      items: ['Roasted Makhana (Foxnuts)', 'Fruit Bowl', 'Green Tea / Regular Tea'],
      time: '05:00 PM - 06:15 PM',
      calories: 180,
      protein: '5g',
      carbs: '28g',
      isSpecialDiet: true,
      dietTags: ['Superfood Snack', 'Diet Friendly', 'Antioxidant'],
      description: 'Lightly roasted calcium-dense foxnuts with black pepper.'
    },
    dinner: {
      items: ['Roti', 'Egg Curry (2 eggs) / Shahi Paneer (Veg Option)', 'Jeera Rice', 'Dal Fry', 'Fruit Custard'],
      time: '07:30 PM - 09:45 PM',
      calories: 710,
      protein: '28g',
      carbs: '82g',
      isSpecialDiet: true,
      dietTags: ['High Protein Eggs/Paneer', 'Gym Choice'],
      description: 'Choice of homestyle egg curry or rich cottage cheese gravy.'
    }
  },
  {
    day: 'Friday',
    breakfast: {
      items: ['Masala Dosa / Plain Dosa', 'Potato Masala', 'Sambar', 'Tomato & Mint Chutney', 'Tea / Coffee'],
      time: '07:30 AM - 09:30 AM',
      calories: 490,
      protein: '11g',
      carbs: '76g',
      isSpecialDiet: false,
      dietTags: ['Crispy Dosa', 'South Indian Special'],
      description: 'Golden fermented rice and black gram crepes.'
    },
    lunch: {
      items: ['Basmati Rice', 'Dal Makhani (Slow simmered)', 'Dum Aloo Kashmiri', 'Tandoori Roti', 'Kachumber Salad'],
      time: '12:30 PM - 02:30 PM',
      calories: 740,
      protein: '21g',
      carbs: '94g',
      isSpecialDiet: false,
      dietTags: ['North Indian Feast', 'Hearty Meal'],
      description: 'Authentic slow-simmered black lentils.'
    },
    snacks: {
      items: ['Samosa (1 pc) / Boiled Chickpea Chaat', 'Imli Chutney', 'Tea'],
      time: '05:00 PM - 06:15 PM',
      calories: 270,
      protein: '7g',
      carbs: '40g',
      isSpecialDiet: true,
      dietTags: ['Weekend Eve Special'],
      description: 'Crispy samosa with healthy chickpea alternate available.'
    },
    dinner: {
      items: ['Garlic Butter Naan / Roti', 'Mix Vegetable Korma', 'Peas Pulao', 'Dal Tadka', 'Ice Cream Cup'],
      time: '07:30 PM - 09:45 PM',
      calories: 700,
      protein: '18g',
      carbs: '95g',
      isSpecialDiet: false,
      dietTags: ['Friday Night Treat'],
      description: 'Relaxed Friday night dinner with cool ice cream.'
    }
  },
  {
    day: 'Saturday',
    breakfast: {
      items: ['Uttapam with Onion & Tomato', 'Boiled Eggs (Optional)', 'Coconut & Sambar', 'Tea / Milk'],
      time: '08:00 AM - 10:00 AM',
      calories: 440,
      protein: '13g',
      carbs: '64g',
      isSpecialDiet: true,
      dietTags: ['Weekend Brunch Time', 'Fermented Nutrition'],
      description: 'Fluffy pancake-style uttapam loaded with fresh veggies.'
    },
    lunch: {
      items: ['Khichdi with pure Ghee', 'Gujarati Kadhi', 'Aloo Chokha', 'Papad', 'Sweet Pickle'],
      time: '12:30 PM - 02:30 PM',
      calories: 590,
      protein: '16g',
      carbs: '82g',
      isSpecialDiet: true,
      dietTags: ['Detox Meal', 'Stomach Friendly', 'Comfort Khichdi'],
      description: 'Soothing Ayurvedic moong dal khichdi to reset digestion.'
    },
    snacks: {
      items: ['Bread Pakora / Brown Bread Sandwich', 'Green Chutney', 'Hot Coffee'],
      time: '05:00 PM - 06:15 PM',
      calories: 260,
      protein: '7g',
      carbs: '38g',
      isSpecialDiet: false,
      dietTags: ['Evening Snack'],
      description: 'Choice between spiced potato stuffed pakora or fresh vegetable sandwich.'
    },
    dinner: {
      items: ['Pav Bhaji (Butter toasted pav)', 'Chopped Onions & Lemon', 'Pulao', 'Curd', 'Jalebi (2 pcs)'],
      time: '07:30 PM - 10:00 PM',
      calories: 750,
      protein: '17g',
      carbs: '105g',
      isSpecialDiet: false,
      dietTags: ['Street Style Weekend Special'],
      description: 'Famous Mumbai pav bhaji packed with cauliflower, peas, and tomatoes.'
    }
  },
  {
    day: 'Sunday',
    breakfast: {
      items: ['Chole Bhature (Special Sunday)', 'Pickle & Raw Onion', 'Lassi / Sweet Buttermilk', 'Tea'],
      time: '08:00 AM - 10:30 AM',
      calories: 690,
      protein: '19g',
      carbs: '96g',
      isSpecialDiet: false,
      dietTags: ['Sunday Grand Breakfast', 'Student Favorite'],
      description: 'Hostel signature Sunday breakfast awaited all week.'
    },
    lunch: {
      items: ['Veg Dum Biryani / Paneer Tikka Biryani', 'Mirchi Ka Salan', 'Boondi Raita', 'Double Ka Meetha'],
      time: '12:30 PM - 03:00 PM',
      calories: 790,
      protein: '32g',
      carbs: '98g',
      isSpecialDiet: true,
      dietTags: ['Grand Feast', 'High Protein'],
      description: 'Slow-dum cooked long grain basmati rice biryani with rich spices.'
    },
    snacks: {
      items: ['Bhel Puri with raw mango', 'Tea / Lemonade'],
      time: '05:00 PM - 06:15 PM',
      calories: 190,
      protein: '4g',
      carbs: '36g',
      isSpecialDiet: true,
      dietTags: ['Light Evening Snack'],
      description: 'Puffed rice tossed with tangy tamarind and spicy mint chutneys.'
    },
    dinner: {
      items: ['Chapati / Phulka', 'Lauki Chana Dal (Light dinner)', 'Jeera Rice', 'Curd', 'Fresh Seasonal Fruit (Apple/Banana)'],
      time: '07:30 PM - 09:30 PM',
      calories: 540,
      protein: '16g',
      carbs: '78g',
      isSpecialDiet: true,
      dietTags: ['Clean Sunday Reset', 'Fruit Included'],
      description: 'Light, restorative dinner before the upcoming academic week.'
    }
  }
];

export const INITIAL_MEAL_FEEDBACKS: MealFeedback[] = [
  {
    id: 'mf_1',
    studentId: 'user_student_1',
    studentName: 'Rahul Sharma',
    roomNumber: '304',
    day: 'Tuesday',
    mealType: 'dinner',
    date: '2026-11-10',
    rating: 2,
    taste: 'Tasteless',
    hygieneRating: 3,
    tags: ['No Salt', 'Cold Food', 'Too Oily'],
    comment: 'The dal tasted like colored hot water, completely tasteless with zero salt or jeera tadka. Rotis were stiff like cardboards.',
    createdAt: '2026-11-10T20:45:00Z'
  },
  {
    id: 'mf_2',
    studentId: 'user_student_2',
    studentName: 'Priya Patel',
    roomNumber: '208',
    day: 'Tuesday',
    mealType: 'dinner',
    date: '2026-11-10',
    rating: 1,
    taste: 'Uneatable',
    hygieneRating: 2,
    tags: ['Undercooked', 'Tasteless'],
    comment: 'Could not finish dinner. Chole was undercooked, raw in the middle. We pay full mess fees every semester, please bring strict quality control!',
    createdAt: '2026-11-10T21:10:00Z'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp_1',
    ticketNumber: 'HV-2026-081',
    title: 'No hot water in 3rd Floor Block-B for 2 days (Geyser tripping)',
    description: 'The geyser on 3rd floor Block B is not functioning. Whenever switched on, it trips the miniature circuit breaker (MCB) immediately. We have to take cold water showers in freezing weather! Multiple complaints to underwarden were completely ignored.',
    category: 'hot_water',
    assignedRole: 'maintenance_incharge',
    assignedInchargeName: 'Mr. Rajesh Kumar (Maintenance & Water Incharge)',
    studentId: 'user_student_1',
    studentName: 'Rahul Sharma',
    studentAge: 21,
    roomNumber: '304',
    block: 'Block-B',
    priority: 'critical',
    status: 'escalated_to_warden',
    upvotes: ['user_student_1', 'user_student_2'],
    comments: [
      {
        id: 'c_1',
        authorId: 'user_student_1',
        authorName: 'Rahul Sharma',
        authorRole: 'student',
        text: 'Third floor residents have been taking cold showers since Sunday morning. Extremely urgent!',
        createdAt: '2026-11-09T08:15:00Z'
      },
      {
        id: 'c_2',
        authorId: 'user_chief_warden',
        authorName: 'Dr. S. Kulkarni',
        authorRole: 'chief_warden',
        text: '⚠️ SLA Breached (24 Hours Exceeded). Maintenance incharge Rajesh Kumar is directed to resolve this heater coil issue within 3 hours or explain cause to Rector.',
        createdAt: '2026-11-10T11:00:00Z'
      }
    ],
    createdAt: '2026-11-09T07:30:00Z',
    slaHours: 12,
    slaDeadline: '2026-11-09T19:30:00Z',
    isBreached: true
  },
  {
    id: 'comp_2',
    ticketNumber: 'HV-2026-082',
    title: 'Room 304 not swept or mopped for 4 days despite requests',
    description: 'Housekeeping staff has not entered 3rd floor rooms 301-306 for the last 4 days. Balcony dust and floor dirt have accumulated. When we asked the cleaner in corridor, he stated he does not have cleaning mop liquid.',
    category: 'room_cleaning',
    assignedRole: 'cleaning_incharge',
    assignedInchargeName: 'Mrs. Shanti Devi (Housekeeping Incharge)',
    studentId: 'user_student_1',
    studentName: 'Rahul Sharma',
    studentAge: 21,
    roomNumber: '304',
    block: 'Block-B',
    priority: 'high',
    status: 'in_progress',
    upvotes: ['user_student_1'],
    comments: [
      {
        id: 'c_3',
        authorId: 'user_cleaning_incharge',
        authorName: 'Mrs. Shanti Devi',
        authorRole: 'cleaning_incharge',
        text: 'Staff Ramesh assigned. Deep cleaning and phenyl mop scheduled for 11:30 AM today.',
        createdAt: '2026-11-11T09:00:00Z'
      }
    ],
    createdAt: '2026-11-10T14:00:00Z',
    slaHours: 24,
    slaDeadline: '2026-11-11T14:00:00Z',
    isBreached: false
  },
  {
    id: 'comp_3',
    ticketNumber: 'HV-2026-083',
    title: 'Tasteless watery dal & hard rubber rotis in Mess dinner',
    description: 'Repeated complaint regarding mess dinner quality. The yellow dal is 90% warm water without any spices or tadka. Rotis are stretched hard and impossible to chew. There is no diet plan or nutritional balance provided.',
    category: 'mess_food',
    assignedRole: 'mess_incharge',
    assignedInchargeName: 'Mr. Ramesh Verma (Mess Incharge)',
    studentId: 'user_student_1',
    studentName: 'Rahul Sharma',
    studentAge: 21,
    roomNumber: '304',
    block: 'Block-B',
    priority: 'high',
    status: 'submitted',
    upvotes: ['user_student_1', 'user_student_2'],
    comments: [],
    createdAt: '2026-11-10T21:30:00Z',
    slaHours: 12,
    slaDeadline: '2026-11-11T09:30:00Z',
    isBreached: true
  }
];

export const INITIAL_CLEANING_REQUESTS: CleaningRequest[] = [
  {
    id: 'cr_1',
    studentId: 'user_student_1',
    studentName: 'Rahul Sharma',
    roomNumber: '304',
    block: 'Block-B',
    date: '2026-11-11',
    timeSlot: '11:00 AM - 01:00 PM',
    status: 'in_progress',
    specialInstructions: 'Please mop balcony and wipe study table dust.',
    assignedCleaner: 'Cleaner Ramesh',
    createdAt: '2026-11-11T08:30:00Z'
  }
];

export const INITIAL_HOT_WATER_STATUS: HotWaterStatus[] = [
  {
    id: 'hw_b_f3',
    block: 'Block-B',
    floor: 3,
    status: 'maintenance',
    temperature: 18,
    morningSchedule: '06:00 AM - 09:30 AM',
    eveningSchedule: '06:00 PM - 08:30 PM',
    isAvailableNow: false,
    lastUpdated: '10 mins ago',
    reportedColdCount: 7
  },
  {
    id: 'hw_b_f2',
    block: 'Block-B',
    floor: 2,
    status: 'operational',
    temperature: 46,
    morningSchedule: '06:00 AM - 09:30 AM',
    eveningSchedule: '06:00 PM - 08:30 PM',
    isAvailableNow: true,
    lastUpdated: 'Just now',
    reportedColdCount: 0
  },
  {
    id: 'hw_a_f1',
    block: 'Block-A',
    floor: 1,
    status: 'operational',
    temperature: 45,
    morningSchedule: '06:00 AM - 09:30 AM',
    eveningSchedule: '06:00 PM - 08:30 PM',
    isAvailableNow: true,
    lastUpdated: '5 mins ago',
    reportedColdCount: 0
  }
];

export const INITIAL_GATE_PASSES: GatePass[] = [
  {
    id: 'gp_1',
    passCode: 'HV-PASS-8841',
    studentId: 'user_student_1',
    studentName: 'Rahul Sharma',
    studentAge: 21,
    studentPhone: '+91 98765 43210',
    roomNumber: '304',
    block: 'Block-B',
    destination: 'City Central Library & Bookstore',
    reason: 'Final year project research materials & book purchase',
    passType: 'adult_day_outing',
    isSelfApproved: true,
    outTimeExpected: '04:00 PM',
    returnTimeExpected: '08:30 PM',
    actualOutTime: '04:12 PM',
    status: 'departed',
    loggedByGuardName: 'Officer Bahadur Singh',
    createdAt: '2026-11-11T15:45:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Dietary Consultation & Balanced Menu Implementation',
    content: 'Following widespread feedback on food quality, the Mess Committee has partnered with a clinical nutritionist. Fresh curd, sprouted salad, and multigrain rotis are now daily fixtures.',
    category: 'mess',
    authorName: 'Mr. Ramesh Verma',
    authorRole: 'mess_incharge',
    createdAt: '2026-11-11T09:00:00Z',
    isPinned: true,
    badge: 'MESS UPDATE'
  },
  {
    id: 'ann_2',
    title: 'Adult Resident (21+) Digital Self-Pass Gate Policy',
    content: 'Undergraduate and postgraduate students who are 21 years of age or older do not require warden signatures for regular daytime passes. Show your digital QR pass at the main gate terminal for instant logging.',
    category: 'warden',
    authorName: 'Dr. S. Kulkarni',
    authorRole: 'chief_warden',
    createdAt: '2026-11-10T16:00:00Z',
    isPinned: false,
    badge: 'GATE POLICY'
  }
];
