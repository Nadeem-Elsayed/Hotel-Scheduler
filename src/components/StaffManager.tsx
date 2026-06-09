import React, { useState, useEffect } from 'react';

interface StaffManagerProps {
  onClose: () => void;
}

export default function StaffManager({ onClose }: StaffManagerProps) {
  // State for lists
  const [employees, setEmployees] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  // State for forms
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#007bff');

  // Search state
  const [employeeSearch, setEmployeeSearch] = useState('');

  // Load all data on mount
  const loadData = async () => {
    const empData = await window.api.getEmployees();
    setEmployees(empData.filter((e: any) => e.status !== 'Archived'));

    const roleData = await window.api.getRoles();
    setRoles(roleData);
    
    // Auto-select first role in the dropdown if we don't have one selected
    if (roleData.length > 0 && !newRole) {
      setNewRole(roleData[0].name);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole) return;

    const res = await window.api.addEmployee({ name: newName.trim(), defaultRole: newRole });
    if (res.success) {
      setNewName('');
      loadData();
    } else {
      alert('Failed to add employee: ' + res.error);
    }
  };

  const handleArchiveEmployee = async (id: number) => {
    if (confirm("Archive this employee? They will be hidden from the scheduler, but payroll history will remain.")) {
      await window.api.archiveEmployee(id);
      loadData();
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    
    await window.api.addRole({ name: newRoleName.trim(), color: newRoleColor });
    setNewRoleName('');
    loadData();
  };

  const handleDeleteRole = async (id: number) => {
    if (confirm("Remove this role? (To edit a color, remove the role and add it again)")) {
      await window.api.deleteRole(id);
      loadData();
    }
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) || 
    emp.defaultRole.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '450px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Manage Staff Directory</h3>
          <button onClick={onClose} style={{ cursor: 'pointer' }}>Close</button>
        </div>

        {/* --- ADD EMPLOYEE SECTION --- */}
        <form onSubmit={handleAddEmployee} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input type="text" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} style={{ flex: 2, padding: '8px' }} />
          
          <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ flex: 1, padding: '8px' }}>
            {roles.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
            {roles.length === 0 && <option value="">No roles yet</option>}
          </select>
          
          <button type="submit" disabled={roles.length === 0} style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: roles.length === 0 ? 'not-allowed' : 'pointer' }}>Add</button>
        </form>

        {/* --- SEARCH BAR --- */}
        <input 
          type="text" 
          placeholder="Search staff by name or role..." 
          value={employeeSearch}
          onChange={(e) => setEmployeeSearch(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
        />

        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '25px' }}>
          {filteredEmployees.map(emp => (
            <div key={emp.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{emp.name}</div>
                <div style={{ color: '#666', fontSize: '0.8em' }}>{emp.defaultRole}</div>
              </div>
              <button onClick={() => handleArchiveEmployee(emp.id)} style={{ padding: '4px 8px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>Archive</button>
            </div>
          ))}
          {filteredEmployees.length === 0 && <div style={{ padding: '15px', textAlign: 'center', color: '#888' }}>No employees found.</div>}
        </div>

        {/* --- ADD / MANAGE ROLES SECTION --- */}
        <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>Manage Roles & Colors</h4>
          
          <form onSubmit={handleAddRole} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input type="text" placeholder="New Role Name" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} style={{ flex: 1, padding: '8px' }} />
            <input type="color" value={newRoleColor} onChange={e => setNewRoleColor(e.target.value)} style={{ width: '50px', cursor: 'pointer', padding: '0', border: '1px solid #ddd' }} />
            <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Role</button>
          </form>

          {/* List of existing roles so you can see/delete them */}
          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
            {roles.map(r => (
              <div key={r.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: r.color }}></div>
                  <span style={{ fontWeight: 'bold' }}>{r.name}</span>
                </div>
                <button onClick={() => handleDeleteRole(r.id)} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>Remove</button>
              </div>
            ))}
            {roles.length === 0 && <div style={{ padding: '15px', textAlign: 'center', color: '#888' }}>No roles created yet.</div>}
          </div>
        </div>

      </div>
    </div>
  );
}