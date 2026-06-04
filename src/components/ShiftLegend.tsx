import React from 'react';

export default function ShiftLegend() {
  const roles = [
    { name: 'Night Audit', color: '#552cb7' },
    { name: 'Reception Desk', color: '#026ba6' },
    { name: 'Housekeeping', color: '#a64402' },
    { name: 'Maintenance', color: '#ffc107' }
  ];

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      {roles.map(role => (
        <div key={role.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85em', fontWeight: 'bold' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: role.color }}></div>
          {role.name}
        </div>
      ))}
    </div>
  );
}