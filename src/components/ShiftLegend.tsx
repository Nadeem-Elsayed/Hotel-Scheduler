import React, { useState, useEffect } from 'react';

export default function ShiftLegend() {
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    window.api.getRoles().then(setRoles);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', flexWrap: 'wrap' }}>
      {roles.map(r => (
        <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85em', fontWeight: 'bold' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: r.color }}></div>
          {r.name}
        </div>
      ))}
      {roles.length === 0 && <span style={{ fontSize: '0.85em', color: '#888' }}>No roles defined. Add some in Manage Staff.</span>}
    </div>
  );
}