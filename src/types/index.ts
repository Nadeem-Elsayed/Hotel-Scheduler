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
  interface Window {
    api: {
      // Guest Channels
      getGuestsByDate: (targetDate: string) => Promise<Guest[]>;
      addGuest: (
        guestData: Omit<Guest, "id">,
      ) => Promise<{ success: boolean; id?: number; error?: string }>;
      updateGuest: (
        id: number,
        updateData: Partial<Guest>,
      ) => Promise<{ success: boolean; error?: string }>;

      // Shift Channels
      getShiftsByRange: (
        startDate: string,
        endDate: string,
      ) => Promise<Shift[]>;
      addShift: (
        shiftData: Omit<Shift, "id">,
      ) => Promise<{ success: boolean; id?: number; error?: string }>;
      updateShift: (
        id: number,
        updateData: Partial<Shift>,
      ) => Promise<{ success: boolean; error?: string }>;

      //employees
      getEmployees: () => Promise<Employee[]>;
      addEmployee: (
        employee: Omit<Employee, "id">,
      ) => Promise<{ success: boolean; id?: number; error?: string }>;
      archiveEmployee: (
        id: number,
      ) => Promise<{ success: boolean; error?: string }>;

      // Inside your Window interface:
      getRoles: () => Promise<any[]>;
      addRole: (roleData: { name: string; color: string }) => Promise<{ success: boolean }>;
    };
  }
}