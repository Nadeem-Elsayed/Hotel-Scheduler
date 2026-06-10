import React, { useState, useEffect } from 'react';
import { Guest } from '../types';
import GuestGrid from './GuestGrid';
import GuestDrawer from './GuestDrawer';
import GuestForm from './GuestForm';

interface GuestDashboardProps {
  onBack: () => void;
}

export default function GuestDashboard({ onBack }: GuestDashboardProps) {
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];

  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const [viewDate, setViewDate] = useState(todayStr);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); 

  const [checkOutTime, setCheckOutTime] = useState('11:00');
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState({
    'Expected': true,
    'Confirmed': true,
    'Checked In': true,
    'Checked Out': true
  });

  const loadGuests = async () => {
  try {
    const data = await window.api.getGuestsByDate(viewDate);
    setGuests(data);
    
    // Fetch global checkout time for visual alerts
    const time = await window.api.getSetting('checkOutTime', '11:00');
    setCheckOutTime(time);
  } catch (error) {
    console.error('Failed to load guests:', error);
  }
};

  useEffect(() => { loadGuests(); }, [viewDate]);

  const handleStatusToggle = (status: string) => {
    setStatusFilters(prev => ({
      ...prev,
      [status as keyof typeof statusFilters]: !prev[status as keyof typeof statusFilters]
    }));
  };

  // Filter based on checkboxes AND search text
  const filteredGuests = guests.filter(g => {
    if (!statusFilters[g.status as keyof typeof statusFilters]) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        g.guestName.toLowerCase().includes(query) ||
        (g.roomNumber && g.roomNumber.toLowerCase().includes(query)) ||
        g.status.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <button
          onClick={onBack}
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
          Back to Hub
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <h2 style={{ margin: 0 }}>
              {viewDate === todayStr
                ? "Today's Operations"
                : "Yesterday's Operations"}
            </h2>
            <div
              style={{
                display: "flex",
                backgroundColor: "#e9ecef",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setViewDate(yesterdayStr)}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor:
                    viewDate === yesterdayStr ? "#007bff" : "transparent",
                  color: viewDate === yesterdayStr ? "white" : "#333",
                }}
              >
                Yesterday ({yesterdayStr})
              </button>
              <button
                onClick={() => setViewDate(todayStr)}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor:
                    viewDate === todayStr ? "#007bff" : "transparent",
                  color: viewDate === todayStr ? "white" : "#333",
                }}
              >
                Today ({todayStr})
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search name or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minWidth: "200px",
              }}
            />
            <button
              onClick={() => setIsFormOpen(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              + New Reservation
            </button>
          </div>
        </div>

        {/* Visual Status Filter Controls */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "15px",
            padding: "10px 15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "6px",
            border: "1px solid #dee2e6",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontWeight: "bold", fontSize: "0.9em", color: "#495057" }}
          >
            Filter Status:
          </span>
          {Object.keys(statusFilters).map((status) => (
            <label
              key={status}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "0.9em",
              }}
            >
              <input
                type="checkbox"
                checked={statusFilters[status as keyof typeof statusFilters]}
                onChange={() => handleStatusToggle(status)}
                style={{ cursor: "pointer" }}
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      {/* SCROLLABLE GRID CONTAINER */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
        <GuestGrid
          guests={filteredGuests}
          onRowClick={(guest) => {
            setSelectedGuest(guest);
            setIsDrawerOpen(true);
          }}
          checkOutTime={checkOutTime}
        />
      </div>

      {isDrawerOpen && selectedGuest && (
        <GuestDrawer
          guest={selectedGuest}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedGuest(null);
          }}
          onSuccess={loadGuests}
        />
      )}
      {isFormOpen && (
        <GuestForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={loadGuests}
        />
      )}
    </div>
  );
}