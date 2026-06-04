import React, { useState, useEffect } from 'react';
import { Guest } from '../types';

interface GuestDrawerProps {
  guest: Guest;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GuestDrawer({ guest, onClose, onSuccess }: GuestDrawerProps) {
  const [editData, setEditData] = useState<Partial<Guest>>({
    checkInDate: guest.checkInDate,
    checkOutDate: guest.checkOutDate,
    totalAmount: guest.totalAmount,
    amountPaid: guest.amountPaid,
    paymentMethod: guest.paymentMethod,
    paymentStatus: guest.paymentStatus,
    notes: guest.notes,
    status: guest.status // Includes the Arrival Status field
  });

  // Re-sync if the user clicks a different guest
  useEffect(() => {
    setEditData({
      checkInDate: guest.checkInDate,
      checkOutDate: guest.checkOutDate,
      totalAmount: guest.totalAmount,
      amountPaid: guest.amountPaid,
      paymentMethod: guest.paymentMethod,
      paymentStatus: guest.paymentStatus,
      notes: guest.notes,
      status: guest.status
    });
  }, [guest]);

  const computedBalance = (editData.totalAmount || 0) - (editData.amountPaid || 0);

  // Includes the HTMLSelectElement fix for the dropdowns
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' || name === 'amountPaid' ? parseFloat(value) || 0 : value
    }));
  };

  const handleUpdate = async () => {
    const response = await window.api.updateGuest(guest.id, editData);
    
    if (response.success) {
      onSuccess(); 
      onClose();   
    } else {
      alert('Failed to update guest: ' + response.error);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, width: '400px', height: '100vh',
      backgroundColor: 'white', boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      padding: '20px', boxSizing: 'border-box', overflowY: 'auto', zIndex: 900
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{guest.guestName} - Room {guest.roomNumber}</h3>
        <button onClick={onClose} style={{ cursor: 'pointer', padding: '5px 10px' }}>Close</button>
      </div>
      
      <hr style={{ margin: '20px 0' }} />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.9em' }}>Check-In</label>
          <input type="date" name="checkInDate" value={editData.checkInDate} onChange={handleChange} style={{ width: '100%', padding: '6px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.9em' }}>Check-Out</label>
          <input type="date" name="checkOutDate" value={editData.checkOutDate} onChange={handleChange} style={{ width: '100%', padding: '6px' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.9em' }}>Total Amount ($)</label>
          <input type="number" step="0.01" name="totalAmount" value={editData.totalAmount} onChange={handleChange} style={{ width: '100%', padding: '6px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.9em' }}>Amount Paid ($)</label>
          <input type="number" step="0.01" name="amountPaid" value={editData.amountPaid} onChange={handleChange} style={{ width: '100%', padding: '6px' }} />
        </div>
      </div>

      <div style={{ padding: '15px', backgroundColor: computedBalance <= 0 ? '#d4edda' : '#fff3cd', borderRadius: '5px', marginBottom: '15px' }}>
        <div style={{ fontSize: '1.2em', color: computedBalance <= 0 ? '#155724' : '#856404' }}>
          <strong>Remaining Balance: </strong> ${computedBalance.toFixed(2)}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '0.9em' }}>Booking Channel</label>
        <input type="text" name="paymentMethod" value={editData.paymentMethod} onChange={handleChange} style={{ width: '100%', padding: '6px' }} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '0.9em' }}>Transaction Medium</label>
        <input type="text" name="paymentStatus" value={editData.paymentStatus} onChange={handleChange} style={{ width: '100%', padding: '6px' }} />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold', color: '#007bff' }}>Guest Status</label>
        <select name="status" value={editData.status} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '2px solid #007bff', borderRadius: '4px' }}>
          <option value="Confirmed">Confirmed</option>
          <option value="Expected">Expected (Late Arrival)</option>
          <option value="Checked In">Checked In</option>
          <option value="Checked Out">Checked Out</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '0.9em' }}>Front Desk Notes</label>
        <textarea name="notes" value={editData.notes} onChange={handleChange} style={{ width: '100%', padding: '6px', minHeight: '80px' }} />
      </div>

      <button 
        onClick={handleUpdate}
        style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
      >
        Save Updates
      </button>
    </div>
  );
}