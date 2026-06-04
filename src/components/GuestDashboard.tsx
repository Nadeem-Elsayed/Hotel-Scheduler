import React, { useState, useEffect } from 'react';
import { Guest } from '../types';
import GuestGrid from './GuestGrid';
import GuestDrawer from './GuestDrawer';
import GuestForm from './GuestForm';

interface GuestDashboardProps {
  onBack: () => void;
}

export default function GuestDashboard({ onBack }: GuestDashboardProps) {
  // 1. Calculate Today and Yesterday
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];

  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  // 2. Track which date the user is currently viewing
  const [viewDate, setViewDate] = useState(todayStr);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); 

  const loadGuests = async () => {
    try {
      // Fetch based on the currently selected viewDate, not necessarily today
      const data = await window.api.getGuestsByDate(viewDate);
      setGuests(data);
    } catch (error) {
      console.error('Failed to load guests from database:', error);
    }
  };

  // Re-fetch data whenever the viewDate toggle changes
  useEffect(() => {
    loadGuests();
  }, [viewDate]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      <button onClick={onBack} style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer' }}>
        ← Back to Hub
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        
        {/* Toggle Controls for the Night Audit Shift */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ margin: 0 }}>
            {viewDate === todayStr ? "Today's Operations" : "Yesterday's Operations"}
          </h2>
          <div style={{ display: 'flex', backgroundColor: '#e9ecef', borderRadius: '6px', overflow: 'hidden' }}>
            <button 
              onClick={() => setViewDate(yesterdayStr)}
              style={{ padding: '6px 12px', border: 'none', cursor: 'pointer', backgroundColor: viewDate === yesterdayStr ? '#007bff' : 'transparent', color: viewDate === yesterdayStr ? 'white' : '#333' }}
            >
              Yesterday ({yesterdayStr})
            </button>
            <button 
              onClick={() => setViewDate(todayStr)}
              style={{ padding: '6px 12px', border: 'none', cursor: 'pointer', backgroundColor: viewDate === todayStr ? '#007bff' : 'transparent', color: viewDate === todayStr ? 'white' : '#333' }}
            >
              Today ({todayStr})
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(true)}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + New Reservation
        </button>
      </div>
      
      <GuestGrid guests={guests} onRowClick={(guest) => { setSelectedGuest(guest); setIsDrawerOpen(true); }} />

      {isDrawerOpen && selectedGuest && (
        <GuestDrawer guest={selectedGuest} onClose={() => { setIsDrawerOpen(false); setSelectedGuest(null); }} onSuccess={loadGuests} />
      )}

      {isFormOpen && (
        <GuestForm onClose={() => setIsFormOpen(false)} onSuccess={loadGuests} />
      )}
    </div>
  );
}