// Add this below your Guest interface
export interface Shift {
  id: number;
  employeeName: string;
  role: string; // e.g., 'Receptionist', 'Housekeeping', 'Manager'
  shiftDate: string;
  startTime: string; // e.g., '07:00' (24-hour format)
  endTime: string;   // e.g., '15:00'
  totalHours: number;
  notes: string;
}
export interface Guest {
  id: number;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  amountPaid: number;
  paymentMethod: string; // e.g., 'Expedia Collect', 'Website', 'Walk-in'
  paymentStatus: string; // e.g., 'Cash', 'EVC Machine', 'Pending'
  notes: string;
  status: string;
}
export interface Employee {
  id: number;
  name: string;
  defaultRole: string;
}

export interface Role {
  id: number;
  name: string;
  color: string;
}


declare global {
  // Inside src/types/index.ts
export interface Window {
  api: {
    // Shifts
    getShiftsByRange: (start: string, end: string) => Promise<Shift[]>;
    addShift: (shift: Partial<Shift>) => Promise<{ success: boolean; id?: number; error?: string }>;
    updateShift: (id: number, shift: Partial<Shift>) => Promise<{ success: boolean; error?: string }>;
    deleteShift: (id: number) => Promise<{ success: boolean; error?: string }>;
    
    // Guests
    getGuestsByDate: (dateStr: string) => Promise<Guest[]>;
    addGuest: (guest: Partial<Guest>) => Promise<{ success: boolean; id?: number; error?: string }>;
    updateGuest: (id: number, guest: Partial<Guest>) => Promise<{ success: boolean; error?: string }>;
    deleteGuest: (id: number) => Promise<{ success: boolean; error?: string }>;

    // Employees & Roles
    getEmployees: () => Promise<Employee[]>;
    addEmployee: (emp: Partial<Employee>) => Promise<{ success: boolean; id?: number; error?: string }>;
    archiveEmployee: (id: number) => Promise<{ success: boolean; error?: string }>;
    getRoles: () => Promise<any[]>;
    addRole: (role: any) => Promise<{ success: boolean }>;
    deleteRole: (id: number) => Promise<{ success: boolean }>;

    // CSV Exports
    exportCalendarCSV: (start: string, end: string) => Promise<{ success: boolean; error?: string }>;
    exportYearlyCSV: (year: string) => Promise<{ success: boolean; error?: string }>;

    // Settings & Data Management (The missing handlers)
    getSetting: (key: string, defaultValue: string) => Promise<string>;
    updateSetting: (key: string, value: string) => Promise<{ success: boolean }>;
    openBackupFolder: () => Promise<void>;
    restoreDatabase: () => Promise<{ success: boolean; error?: string }>;
    purgeDatabase: () => Promise<{ success: boolean; error?: string }>;
    importCSV: (type: 'guests' | 'shifts') => Promise<{ success: boolean; error?: string }>;

    showMessage: (message: string, title?: string) => Promise<void>;
    showConfirm: (message: string, title?: string) => Promise<boolean>;
  };
}
}