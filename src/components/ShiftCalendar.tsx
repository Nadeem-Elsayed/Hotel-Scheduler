import React from 'react';
import { Shift } from '../types';

interface ShiftCalendarProps {
  shifts: Shift[];
  periodStart: string;
  onDayClick: (dateStr: string) => void;
}

export default function ShiftCalendar({ shifts, periodStart, onDayClick }: ShiftCalendarProps) {
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(periodStart + 'T12:00:00');
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Night Audit': return '#552cb7';
      case 'Reception Desk': return '#026ba6';
      case 'Housekeeping': return '#a64402';
      default: return '#333';
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginTop: '20px' }}>
      {days.map(dayStr => {
        const dayShifts = shifts.filter(s => s.shiftDate === dayStr);
        return (
          <div key={dayStr} onClick={() => onDayClick(dayStr)} style={{ 
            backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '8px',
            minHeight: '120px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px'
          }}>
            <div style={{ fontSize: '0.8em', color: '#888', marginBottom: '4px', textAlign: 'right' }}>{dayStr.slice(5)}</div>
            
            {/* Vertical list of names */}
            {dayShifts.map(s => (
              <div key={s.id} style={{ 
                padding: '3px 6px', 
                borderRadius: '4px', 
                backgroundColor: getRoleColor(s.role) + '15', 
                borderLeft: `4px solid ${getRoleColor(s.role)}`,
                fontSize: '0.75em', 
                fontWeight: 'bold',
                color: '#333',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {s.employeeName}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}