import React from 'react';
import { Shift } from '../types';

interface ShiftCalendarProps {
  shifts: Shift[];
  periodStart: string; 
  onShiftClick: (shift: Shift) => void;
}

export default function ShiftCalendar({ shifts, periodStart, onShiftClick }: ShiftCalendarProps) {
  const days = [];
  const start = new Date(periodStart + 'T12:00:00'); 

  for (let i = 0; i < 14; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    days.push(currentDate.toISOString().split('T')[0]);
  }

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'Night Audit': return { bg: '#e0cffc', text: '#552cb7', border: '#b28df8' };
      case 'Reception Desk': return { bg: '#d0f0fd', text: '#026ba6', border: '#8bd4f8' };
      case 'Housekeeping': return { bg: '#fde0d0', text: '#a64402', border: '#f8aa8b' };
      case 'Maintenance': return { bg: '#fffdf0', text: '#856404', border: '#ffc107' };
      case 'Management': return { bg: '#d4edda', text: '#155724', border: '#c3e6cb' };
      default: return { bg: '#f8f9fa', text: '#333', border: '#ddd' };
    }
  };

  const dayHeaders = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '10px' }}>
        {dayHeaders.map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: '#666', fontSize: '0.9em' }}>
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', gridAutoRows: 'minmax(120px, auto)' }}>
        {days.map(dayStr => {
          const dayShifts = shifts.filter(s => s.shiftDate === dayStr);
          const dateObj = new Date(dayStr + 'T12:00:00');
          const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div key={dayStr} style={{ 
              backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '10px',
              display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#888', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '2px', textAlign: 'right' }}>
                {displayDate}
              </div>
              
              {dayShifts.map(shift => {
                const colors = getRoleStyle(shift.role);
                return (
                  <div 
                    key={shift.id} 
                    onClick={() => onShiftClick(shift)}
                    style={{
                      backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
                      padding: '6px 8px', borderRadius: '4px', fontSize: '0.8em', cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'transform 0.1s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{shift.employeeName}</div>
                    <div>{shift.startTime} - {shift.endTime}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}