import React from 'react';
import { Shift } from '../types';

interface ShiftGridProps {
  shifts: Shift[];
  onRowClick: (shift: Shift) => void;
}

export default function ShiftGrid({ shifts, onRowClick }: ShiftGridProps) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Employee</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Role</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Date</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Start Time</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>End Time</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Total Hours</th>
        </tr>
      </thead>
      <tbody>
        {shifts.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No shifts scheduled for today.
            </td>
          </tr>
        ) : (
          shifts.map((shift) => (
            <tr 
              key={shift.id} 
              onClick={() => onRowClick(shift)}
              style={{ cursor: 'pointer', borderBottom: '1px solid #ddd' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '10px', fontWeight: 'bold' }}>{shift.employeeName}</td>
              <td style={{ padding: '10px' }}>{shift.role}</td>
              <td style={{ padding: '10px' }}>{shift.shiftDate}</td>
              <td style={{ padding: '10px' }}>{shift.startTime}</td>
              <td style={{ padding: '10px' }}>{shift.endTime}</td>
              <td style={{ padding: '10px' }}>{shift.totalHours}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}