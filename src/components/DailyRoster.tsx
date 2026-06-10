import React, { useState, useEffect } from 'react';
import { Shift } from '../types';

interface DailyRosterProps {
  date: string;
  shifts: Shift[];
  onClose: () => void;
  onShiftClick: (s: Shift) => void;
}

export default function DailyRoster({ date, shifts, onClose, onShiftClick }: DailyRosterProps) {
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    window.api.getRoles().then(setRoles);
  }, []);

  // Add day of week to the title
  const dayOfWeek = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
  const displayDate = `${dayOfWeek}, ${date}`;

  // Dynamic color lookup
  const getRoleColor = (roleName: string) => {
    const foundRole = roles.find(r => r.name === roleName);
    return foundRole ? foundRole.color : '#888'; 
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '90%', height: '90%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h3>Schedule for {displayDate}</h3>
          <button
          onClick={onClose}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#c2d7ec";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#e7eff7";
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "#e7eff7", // Soft off-white
            border: "1px solid #dee2e6", // Subtle border
            borderRadius: "6px", // Rounded corners
            cursor: "pointer",
            transition: "all 0.2s", // Smooth hover transition
            fontWeight: "500", // Slightly bolder text
          }}
        >
          Close
        </button>
        </div>

        {/* Timeline Grid with explicit column tracks */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '50px repeat(4, 1fr)', // 4 parallel swimlanes
          gridAutoRows: '40px', 
          overflowY: 'auto', 
          borderTop: '1px solid #ddd' 
        }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <React.Fragment key={i}>
              <div style={{ borderBottom: '1px solid #eee', fontSize: '0.8em', color: '#999', textAlign: 'right', paddingRight: '10px' }}>
                {i.toString().padStart(2, '0')}:00
              </div>
              <div style={{ borderBottom: '1px solid #eee', gridColumn: 'span 4' }} />
            </React.Fragment>
          ))}

          {/* Render shifts with column assignment to prevent overlap */}
          {shifts.map((s, index) => {
            const startRow = parseInt(s.startTime.split(':')[0]) + 1;
            const endRow = parseInt(s.endTime.split(':')[0]) + 1;
            
            return (
              <div key={s.id} onClick={() => onShiftClick(s)} style={{
                gridColumn: `${(index % 4) + 2}`, // Cycle through columns 2, 3, 4, 5
                gridRow: `${startRow} / ${endRow}`,
                backgroundColor: getRoleColor(s.role) + '30', // Adds transparency
                borderLeft: `4px solid ${getRoleColor(s.role)}`,
                margin: '2px',
                padding: '5px',
                fontSize: '0.75em',
                cursor: 'pointer',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <strong>{s.employeeName}</strong><br/>
                {s.role}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}