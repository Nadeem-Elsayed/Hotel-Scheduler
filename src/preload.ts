import { contextBridge, ipcRenderer } from 'electron';
import { Guest, Shift, Employee } from './types'; // Make sure Shift is imported


contextBridge.exposeInMainWorld('api', {
  // --- Guest Operations ---
  getGuestsByDate: (targetDate: string) => ipcRenderer.invoke('get-guests-by-date', targetDate),
  addGuest: (guestData: Omit<Guest, 'id'>) => ipcRenderer.invoke('add-guest', guestData),
  updateGuest: (id: number, updateData: Partial<Guest>) => ipcRenderer.invoke('update-guest', id, updateData),
  deleteGuest: (id: number) => ipcRenderer.invoke('delete-guest', id),
  // --- Shift Operations ---
  getShiftsByRange: (startDate: string, endDate: string) => ipcRenderer.invoke('get-shifts-by-range', startDate, endDate),
  addShift: (shiftData: Omit<Shift, 'id'>) => ipcRenderer.invoke('add-shift', shiftData),
  updateShift: (id: number, updateData: Partial<Shift>) => ipcRenderer.invoke('update-shift', id, updateData),
  deleteShift: (id: number) => ipcRenderer.invoke('delete-shift', id),

  // --- Employee Operations ---
  getEmployees: () => ipcRenderer.invoke('get-employees'),
  addEmployee: (employee: Omit<Employee, 'id'>) => ipcRenderer.invoke('add-employee', employee),
  archiveEmployee: (id: number) => ipcRenderer.invoke('archive-employee', id),

  getRoles: () => ipcRenderer.invoke('get-roles'),
  addRole: (roleData: any) => ipcRenderer.invoke('add-role', roleData),
  deleteRole: (id: number) => ipcRenderer.invoke('delete-role', id),

  exportYearlyCSV: (year: string) => ipcRenderer.invoke('export-yearly-csv', year),
  exportCalendarCSV: (start: string, end: string) => ipcRenderer.invoke('export-calendar-csv', start, end),

  openBackupFolder: () => ipcRenderer.invoke('open-backup-folder'),
  restoreDatabase: () => ipcRenderer.invoke('restore-database'),
  getSetting: (key: string, defaultValue: string) => ipcRenderer.invoke('get-setting', key, defaultValue),
  updateSetting: (key: string, value: string) => ipcRenderer.invoke('update-setting', key, value),
  purgeDatabase: () => ipcRenderer.invoke('purge-database'),
  importCSV: (type: 'guests' | 'shifts') => ipcRenderer.invoke('import-csv', type),

  showMessage: (message: string, title?: string) => ipcRenderer.invoke('show-message', message, title),
  showConfirm: (message: string, title?: string) => ipcRenderer.invoke('show-confirm', message, title),
});