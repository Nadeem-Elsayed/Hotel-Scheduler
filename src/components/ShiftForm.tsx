import React, { useState } from 'react';
import { Employee } from '../types';

interface ShiftFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string; // <-- Add this new optional prop
}

export default function ShiftForm({ onClose, onSuccess, initialDate }: ShiftFormProps) {
  // If the calendar passes a date, use it. Otherwise, default to today.
  const today = initialDate || new Date().toISOString().split('T')[0];
  const [directory, setDirectory] = useState<Employee[]>([]);

  React.useEffect(() => {window.api.getEmployees().then(setDirectory);}, []);
  const [formData, setFormData] = useState({
    employeeName: '',
    role: 'Reception Desk',
    shiftDate: today, // Uses the smart date
    startTime: '07:00',
    endTime: '15:00',
    totalHours: 8,
    notes: ''
  });

  // Automatically calculate hours, safely handling overnight shifts
  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let hours = (endHour + endMin / 60) - (startHour + startMin / 60);
    
    // If the shift ends before it starts, it crossed midnight into the next day
    if (hours < 0) {
      hours += 24; 
    }
    
    return parseFloat(hours.toFixed(2));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: name === 'totalHours' ? parseFloat(value) || 0 : value
      };

      // Auto-fill role if they pick a name
    if (name === 'employeeName') {
      const selectedEmp = directory.find(emp => emp.name === value);
      if (selectedEmp) updated.role = selectedEmp.defaultRole;
    }

      // If the manager changes the time, automatically update the payroll hours
      if (name === 'startTime' || name === 'endTime') {
        updated.totalHours = calculateHours(updated.startTime, updated.endTime);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await window.api.addShift(formData);
    
    if (response.success) {
      onSuccess(); // Refresh the grid
      onClose();   // Close the modal
    } else {
      alert('Failed to save shift: ' + response.error);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '450px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{ marginTop: 0 }}>Schedule New Shift</h3>
        <hr style={{ marginBottom: '20px' }} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label>Employee Name *</label>
            <select required name="employeeName" value={formData.employeeName} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
              <option value="" disabled>Select Employee...</option>
              {directory.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                <option value="Reception Desk">Reception Desk</option>
                <option value="Night Audit">Night Audit</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Management">Management</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Shift Date *</label>
              <input required type="date" name="shiftDate" value={formData.shiftDate} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>Start Time *</label>
              <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label>End Time *</label>
              <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          <div>
            <label>Calculated Payroll Hours</label>
            <input type="number" step="0.25" name="totalHours" value={formData.totalHours} onChange={handleChange} style={{ width: '100%', padding: '8px', backgroundColor: '#e9ecef' }} />
          </div>

          <div>
            <label>Manager Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ width: '100%', padding: '8px', minHeight: '60px' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Shift</button>
          </div>
        </form>
      </div>
    </div>
  );
}