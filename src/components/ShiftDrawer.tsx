import React, { useState, useEffect } from 'react';
import { Shift } from '../types';

interface ShiftDrawerProps {
  shift: Shift;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ShiftDrawer({ shift, onClose, onSuccess }: ShiftDrawerProps) {
  const [editData, setEditData] = useState<Partial<Shift>>({
    employeeName: shift.employeeName,
    role: shift.role,
    shiftDate: shift.shiftDate,
    startTime: shift.startTime,
    endTime: shift.endTime,
    totalHours: shift.totalHours,
    notes: shift.notes
  });

  useEffect(() => {
    setEditData({
      employeeName: shift.employeeName,
      role: shift.role,
      shiftDate: shift.shiftDate,
      startTime: shift.startTime,
      endTime: shift.endTime,
      totalHours: shift.totalHours,
      notes: shift.notes
    });
  }, [shift]);

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let hours = (endHour + endMin / 60) - (startHour + startMin / 60);
    if (hours < 0) hours += 24; 
    
    return parseFloat(hours.toFixed(2));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setEditData(prev => {
      const updated = {
        ...prev,
        [name]: name === 'totalHours' ? parseFloat(value) || 0 : value
      };

      if (name === 'startTime' || name === 'endTime') {
        updated.totalHours = calculateHours(updated.startTime || '00:00', updated.endTime || '00:00');
      }
      
      return updated;
    });
  };

  const handleUpdate = async () => {
    const response = await window.api.updateShift(shift.id, editData);
    
    if (response.success) {
      onSuccess(); 
      onClose();   
    } else {
      alert('Failed to update shift: ' + response.error);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh',
      backgroundColor: 'white', boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      padding: '20px', boxSizing: 'border-box', overflowY: 'auto', zIndex: 900
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Edit Shift</h3>
        <button onClick={onClose} style={{ cursor: 'pointer', padding: '5px 10px' }}>Close</button>
      </div>
      
      <hr style={{ margin: '20px 0' }} />

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold' }}>Employee Name</label>
        <input type="text" name="employeeName" value={editData.employeeName} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold' }}>Role</label>
          <select name="role" value={editData.role} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="Reception Desk">Reception Desk</option>
            <option value="Night Audit">Night Audit</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Management">Management</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold' }}>Shift Date</label>
          <input type="date" name="shiftDate" value={editData.shiftDate} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold' }}>Start Time</label>
          <input type="time" name="startTime" value={editData.startTime} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold' }}>End Time</label>
          <input type="time" name="endTime" value={editData.endTime} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>
      </div>

      <div style={{ padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px', marginBottom: '15px' }}>
        <div style={{ fontSize: '1.1em' }}>
          <strong>Calculated Hours: </strong> {editData.totalHours} hrs
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold' }}>Manager Notes</label>
        <textarea name="notes" value={editData.notes} onChange={handleChange} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
      </div>

      <button 
        onClick={handleUpdate}
        style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
      >
        Save Updates
      </button>
    </div>
  );
}