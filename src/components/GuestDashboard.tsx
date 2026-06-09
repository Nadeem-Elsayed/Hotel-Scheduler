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
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const loadGuests = async () => {
    try {
      const data = await window.api.getGuestsByDate(viewDate);
      setGuests(data);
    } catch (error) {
      console.error('Failed to load guests from database:', error);
    }
  };

  useEffect(() => {
    loadGuests();
  }, [viewDate]);

  // Filter guests based on search input
  const filteredGuests = guests.filter(g => 
    g.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.roomNumber && g.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    g.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search name or room..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
          />
          <button 
            onClick={() => setIsFormOpen(true)}
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + New Reservation
          </button>
        </div>
      </div>
      
      <GuestGrid guests={filteredGuests} onRowClick={(guest) => { setSelectedGuest(guest); setIsDrawerOpen(true); }} />

      {isDrawerOpen && selectedGuest && (
        <GuestDrawer guest={selectedGuest} onClose={() => { setIsDrawerOpen(false); setSelectedGuest(null); }} onSuccess={loadGuests} />
      )}

      {isFormOpen && (
        <GuestForm onClose={() => setIsFormOpen(false)} onSuccess={loadGuests} />
      )}
    </div>
  );
}