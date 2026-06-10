import React, { useState } from 'react';
import { Guest } from '../types';

interface GuestFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function GuestForm({ onClose, onSuccess }: GuestFormProps) {
  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];

  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    checkInDate: today,
    checkOutDate: tomorrow, 
    totalAmount: 0,
    amountPaid: 0,
    paymentMethod: 'Walk-in',
    paymentStatus: 'Pending',
    notes: '',
    status: 'Confirmed' 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' || name === 'amountPaid' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await window.api.addGuest(formData);
    
    if (response.success) {
      onSuccess();
      onClose();
    } else {
      alert('Failed to save guest: ' + response.error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          width: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>New Reservation / Check-In</h3>
        <hr style={{ marginBottom: "20px" }} />

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label>Guest Name *</label>
            <input
              required
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label>Room Number *</label>
              <input
                required
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Payment Method*</label>
              <input
                required
                type="text"
                name="paymentMethod"
                placeholder="e.g., Expedia, Walk-in..."
                value={formData.paymentMethod}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Arrival Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="Confirmed">Confirmed (Standard)</option>
                <option value="Expected">Expected (Late/Night Alert)</option>
                <option value="Checked In">Checked In</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label>Check-In Date *</label>
              <input
                required
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Check-Out Date *</label>
              <input
                required
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label>Total Amount ($)</label>
              <input
                type="number"
                step="0.01"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Amount Paid ($)</label>
              <input
                type="number"
                step="0.01"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
          </div>

          <div>
            <label>Transaction Status</label>
            <input
              type="text"
              name="paymentStatus"
              placeholder="e.g., Cash, EVC, Pending..."
              value={formData.paymentStatus}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div>
            <label>Front Desk Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", minHeight: "60px" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <button
              onClick={onClose}
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
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Save Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}