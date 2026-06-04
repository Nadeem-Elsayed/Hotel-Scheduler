import React, { useState, useEffect, useMemo } from 'react';
import { Shift } from '../types';
import ShiftCalendar from './ShiftCalendar'; 
import ShiftForm from './ShiftForm';
import ShiftDrawer from './ShiftDrawer'; // <-- 1. Import the Drawer

interface ShiftDashboardProps {
  onBack: () => void;
}

export default function ShiftDashboard({ onBack }: ShiftDashboardProps) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [periodOffset, setPeriodOffset] = useState(0); 
  
  // Modal visibility states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const getPayPeriod = (offset: number) => {
    const anchor = new Date('2026-05-29T12:00:00'); 
    const today = new Date();
    
    const diffTime = today.getTime() - anchor.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const periodsPassed = Math.floor(diffDays / 14);

    const targetPeriod = periodsPassed + offset;

    const startDate = new Date(anchor);
    startDate.setDate(anchor.getDate() + (targetPeriod * 14));

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 13);

    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };

  const currentPeriod = getPayPeriod(periodOffset);

  const loadShifts = async () => {
    try {
      const data = await window.api.getShiftsByRange(currentPeriod.start, currentPeriod.end);
      setShifts(data);
    } catch (error) {
      console.error('Failed to load shifts from database:', error);
    }
  };

  useEffect(() => {
    loadShifts();
  }, [periodOffset]);

  const payrollSummary = useMemo(() => {
    const summary: Record<string, { role: string, hours: number }> = {};
    
    shifts.forEach(shift => {
      if (!summary[shift.employeeName]) {
        summary[shift.employeeName] = { role: shift.role, hours: 0 };
      }
      summary[shift.employeeName].hours += shift.totalHours;
    });

    return Object.entries(summary)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.hours - a.hours);
  }, [shifts]);

  // 2. Handle clicking a shift chip
  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedShift(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      <button onClick={onBack} style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }}>
        ← Back to Hub
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>Staff Shifts & Payroll</h2>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Schedule Shift
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#e9ecef', padding: '10px 15px', borderRadius: '8px', marginBottom: '20px' }}>
        <button onClick={() => setPeriodOffset(prev => prev - 1)} style={{ cursor: 'pointer', padding: '5px 10px' }}>◀ Previous Period</button>
        <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
          Pay Period: {currentPeriod.start} to {currentPeriod.end}
        </span>
        <button onClick={() => setPeriodOffset(prev => prev + 1)} style={{ cursor: 'pointer', padding: '5px 10px' }}>Next Period ▶</button>
        
        {periodOffset !== 0 && (
          <button onClick={() => setPeriodOffset(0)} style={{ marginLeft: 'auto', cursor: 'pointer', padding: '5px 10px' }}>Jump to Current</button>
        )}
      </div>

      {payrollSummary.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Bi-Weekly Hours Breakdown</h4>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {payrollSummary.map(emp => (
              <div key={emp.name} style={{ 
                backgroundColor: 'white', padding: '12px 20px', borderRadius: '8px', 
                border: emp.hours > 80 ? '2px solid #dc3545' : '1px solid #ddd', 
                minWidth: '150px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{emp.name}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '8px' }}>{emp.role}</div>
                
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: emp.hours > 80 ? '#dc3545' : '#28a745' }}>
                  {emp.hours.toFixed(2)} <span style={{ fontSize: '0.7em', color: '#666', fontWeight: 'normal' }}>hrs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 3. Pass the click handler to the calendar */}
      <ShiftCalendar 
        shifts={shifts} 
        periodStart={currentPeriod.start} 
        onShiftClick={handleShiftClick} 
      />

      {isFormOpen && (
        <ShiftForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={loadShifts} 
        />
      )}

      {/* 4. Mount the Drawer */}
      {isDrawerOpen && selectedShift && (
        <ShiftDrawer 
          shift={selectedShift} 
          onClose={closeDrawer} 
          onSuccess={loadShifts} 
        />
      )}
    </div>
  );
}