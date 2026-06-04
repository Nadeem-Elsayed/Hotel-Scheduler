import React, { useState, useEffect, useMemo } from 'react';
import { Shift } from '../types';
import ShiftCalendar from './ShiftCalendar'; 
import ShiftForm from './ShiftForm';
import ShiftDrawer from './ShiftDrawer'; 
import DailyRoster from './DailyRoster';
import StaffManager from './StaffManager';
import ShiftLegend from './ShiftLegend';

interface ShiftDashboardProps {
  onBack: () => void;
}

export default function ShiftDashboard({ onBack }: ShiftDashboardProps) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [periodOffset, setPeriodOffset] = useState(0); 
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isStaffManagerOpen, setIsStaffManagerOpen] = useState(false);
  
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

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
    return { start: startDate.toISOString().split('T')[0], end: endDate.toISOString().split('T')[0] };
  };

  const currentPeriod = getPayPeriod(periodOffset);

  const loadShifts = async () => {
    const data = await window.api.getShiftsByRange(currentPeriod.start, currentPeriod.end);
    setShifts(data);
  };

  useEffect(() => { loadShifts(); }, [periodOffset]);

  // Payroll Calculation
  const payrollSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    shifts.forEach(s => {
      summary[s.employeeName] = (summary[s.employeeName] || 0) + Number(s.totalHours);
    });
    return Object.entries(summary).map(([name, hours]) => ({ name, hours }));
  }, [shifts]);

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsRosterOpen(true);
  };

  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
    setIsRosterOpen(false);
    setIsDrawerOpen(true);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <button
        onClick={onBack}
        style={{ padding: "8px 16px", marginBottom: "20px", cursor: "pointer" }}
      >
        ← Back to Hub
      </button>

      {/* Header with Title and Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h2 style={{ margin: 0 }}>Staff Shifts & Payroll</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setIsStaffManagerOpen(true)}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#6c757d", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer", 
              fontWeight: "bold" 
            }}
          >
            Manage Staff
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Schedule Shift
          </button>
        </div>
      </div>

      {/* Payroll Summary Component */}
      <div style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f1f3f5",
          borderRadius: "8px",
      }}>
        <h4 style={{ margin: "0 0 10px 0" }}>Bi-Weekly Hours Breakdown</h4>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {payrollSummary.map((emp) => (
            <div
              key={emp.name}
              style={{
                backgroundColor: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #dee2e6",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{emp.name}:</span> {emp.hours.toFixed(2)} hrs
            </div>
          ))}
        </div>
      </div>

      <ShiftCalendar
        shifts={shifts}
        periodStart={currentPeriod.start}
        onDayClick={handleDayClick}
      />

      <ShiftLegend />

      {/* Modals and Drawers */}
      {isRosterOpen && (
        <DailyRoster
          date={selectedDate}
          shifts={shifts.filter((s) => s.shiftDate === selectedDate)}
          onClose={() => setIsRosterOpen(false)}
          onShiftClick={handleShiftClick}
        />
      )}

      {isDrawerOpen && selectedShift && (
        <ShiftDrawer
          shift={selectedShift}
          onClose={() => setIsDrawerOpen(false)}
          onSuccess={loadShifts}
        />
      )}

      {isFormOpen && (
        <ShiftForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={loadShifts}
        />
      )}

      {isStaffManagerOpen && (
        <StaffManager onClose={() => setIsStaffManagerOpen(false)} />
      )}
    </div>
  );
}