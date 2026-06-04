import React, { useState, useEffect } from 'react';
import { Employee } from '../types';

interface StaffManagerProps {
  onClose: () => void;
}

export default function StaffManager({ onClose }: StaffManagerProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Reception Desk');

  const loadEmployees = async () => {
    const data = await window.api.getEmployees();
    // Filter to show only active employees in the list
    setEmployees(data.filter((e: any) => e.status !== 'Archived'));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const res = await window.api.addEmployee({ name: newName.trim(), defaultRole: newRole });
    if (res.success) {
      setNewName('');
      loadEmployees();
    } else {
      alert('Failed to add employee: ' + res.error);
    }
  };

  const handleArchive = async (id: number) => {
    if (confirm("Archive this employee? They will be hidden from the scheduler, but payroll history will remain.")) {
      // We will define archiveEmployee in the next step
      await window.api.archiveEmployee(id);
      loadEmployees();
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Manage Staff Directory</h3>
          <button onClick={onClose} style={{ cursor: 'pointer' }}>Close</button>
        </div>

        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input type="text" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} style={{ flex: 2, padding: '8px' }} />
          <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ flex: 1, padding: '8px' }}>
            <option value="Reception Desk">Reception</option>
            <option value="Night Audit">Night Audit</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
        </form>

        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
          {employees.map(emp => (
            <div key={emp.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{emp.name}</div>
                <div style={{ color: '#666', fontSize: '0.8em' }}>{emp.defaultRole}</div>
              </div>
              <button 
                onClick={() => handleArchive(emp.id)} 
                style={{ padding: '4px 8px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}
              >
                Archive
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}