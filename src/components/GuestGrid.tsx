import React from 'react';
import { Guest } from '../types';

interface GuestGridProps {
  guests: Guest[];
  onRowClick: (guest: Guest) => void;
  checkOutTime?: string;
}

export default function GuestGrid({ guests, onRowClick }: GuestGridProps) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Guest Name</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Room</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Check In</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Check Out</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Balance</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Payment Method</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Paid</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Total</th>
          <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Transaction Status</th>
        </tr>
      </thead>
      <tbody>
        {guests.map((guest) => {
          const isExpected = guest.status === 'Expected';
          const isConfirmed = guest.status === 'Confirmed';
          const isCheckedOut = guest.status === 'Checked Out';
          
          // Calculate dynamic balance for the grid
          const balance = (guest.totalAmount || 0) - (guest.amountPaid || 0);

          return (
            <tr 
              key={guest.id} 
              onClick={() => onRowClick(guest)}
              style={{ 
                cursor: 'pointer', 
                borderBottom: '1px solid #ddd',
                // Confirmed = Soft Blue | Expected = Loud Amber | Checked Out = Grey | Checked In = White
                backgroundColor: isExpected ? '#fffdf0' : isConfirmed ? '#f0f8ff' : isCheckedOut ? '#f8f9fa' : 'transparent',
                borderLeft: isExpected ? '4px solid #ffc107' : isConfirmed ? '4px solid #007bff' : isCheckedOut ? '4px solid #6c757d' : '4px solid #28a745',
                color: isCheckedOut ? '#6c757d' : '#333'
              }}
              onMouseOver={(e) => {
                if (!isExpected && !isCheckedOut && !isConfirmed) e.currentTarget.style.backgroundColor = '#f1f1f1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = isExpected ? '#fffdf0' : isConfirmed ? '#f0f8ff' : isCheckedOut ? '#f8f9fa' : 'transparent';
              }}
            >
              <td style={{ padding: '10px' }}>
                <div style={{ fontWeight: 'bold' }}>{guest.guestName}</div>
                <div style={{ fontSize: '0.8em', color: isExpected ? '#d39e00' : isConfirmed ? '#0056b3' : '#666' }}>
                  {guest.status}
                </div>
              </td>
              <td style={{ padding: '10px' }}>{guest.roomNumber}</td>
              <td style={{ padding: '10px' }}>{guest.checkInDate}</td>
              <td style={{ padding: '10px' }}>{guest.checkOutDate}</td>
              
              {/* Financial Data Columns */}
              <td style={{ padding: '10px', fontWeight: 'bold', color: balance > 0 ? '#d9534f' : '#28a745' }}>
                ${balance.toFixed(2)}
              </td>
              <td style={{ padding: '10px' }}>{guest.paymentMethod}</td>
              <td style={{ padding: '10px' }}>${(guest.amountPaid || 0).toFixed(2)}</td>
              <td style={{ padding: '10px' }}>${(guest.totalAmount || 0).toFixed(2)}</td>
              <td style={{ padding: '10px' }}>{guest.paymentStatus}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}