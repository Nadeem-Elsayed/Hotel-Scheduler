import { contextBridge, ipcRenderer } from 'electron';
import { Guest, Shift } from './types'; // Make sure Shift is imported

contextBridge.exposeInMainWorld('api', {
  // --- Guest Operations ---
  getGuestsByDate: (targetDate: string) => ipcRenderer.invoke('get-guests-by-date', targetDate),
  addGuest: (guestData: Omit<Guest, 'id'>) => ipcRenderer.invoke('add-guest', guestData),
  updateGuest: (id: number, updateData: Partial<Guest>) => ipcRenderer.invoke('update-guest', id, updateData),

  // --- Shift Operations ---
  getShiftsByRange: (startDate: string, endDate: string) => ipcRenderer.invoke('get-shifts-by-range', startDate, endDate),
  addShift: (shiftData: Omit<Shift, 'id'>) => ipcRenderer.invoke('add-shift', shiftData),
  updateShift: (id: number, updateData: Partial<Shift>) => ipcRenderer.invoke('update-shift', id, updateData),
});