import React from 'react';

export default function ShiftLegend() {
  const [roles, setRoles] = React.useState<any[]>([]);

  React.useEffect(() => {
    window.api.getRoles().then(setRoles);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', ... }}>
      {roles.map(r => (
        <div key={r.name} style={{ ... }}>
          <div style={{ backgroundColor: r.color, ... }}></div>
          {r.name}
        </div>
      ))}
    </div>
  );
}