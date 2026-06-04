import React from 'react';
import { Shift } from '../types';

interface DailyRosterProps {
  date: string;
  shifts: Shift[];
  onClose: () => void;
  onShiftClick: (s: Shift) => void;
}

export default function DailyRoster({ date, shifts, onClose, onShiftClick }: DailyRosterProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Night Audit': return '#552cb7';
      case 'Reception Desk': return '#026ba6';
      case 'Housekeeping': return '#a64402';
      default: return '#333';
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh', backgroundColor: 'white', padding: '20px', boxShadow: '-2px 0 10px rgba(0,0,0,0.1)', zIndex: 900 }}>
      <h3>Schedule for {date}</h3>
      <button onClick={onClose} style={{ marginBottom: '20px', cursor: 'pointer' }}>Close</button>
      
      {shifts.length === 0 ? <p>No shifts scheduled.</p> : shifts.map(s => (
        <div key={s.id} onClick={() => onShiftClick(s)} style={{ 
          padding: '12px', 
          borderLeft: `6px solid ${getRoleColor(s.role)}`, 
          backgroundColor: '#f8f9fa', 
          marginBottom: '10px', 
          cursor: 'pointer',
          borderRadius: '4px'
        }}>
          <div style={{ fontWeight: 'bold', color: getRoleColor(s.role) }}>{s.employeeName}</div>
          <div style={{ fontSize: '0.85em', color: '#555' }}>{s.startTime} - {s.endTime}</div>
          <div style={{ fontSize: '0.75em', marginTop: '4px' }}>{s.role}</div>
        </div>
      ))}
    </div>
  );
}