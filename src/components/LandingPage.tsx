import React from 'react';

interface LandingPageProps {
  onNavigate: (view: 'guests' | 'shifts') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', backgroundColor: '#f8f9fa',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ marginBottom: '40px', fontSize: '2.5rem', color: '#333' }}>Hotel Operating System</h1>
      
      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Guest Module Card */}
        <div 
          onClick={() => onNavigate('guests')}
          style={{
            width: '250px', height: '200px', backgroundColor: 'white', 
            borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h2 style={{ color: '#007bff' }}>Guest Operations</h2>
          <p style={{ color: '#666' }}>Check-in & Billing</p>
        </div>

        {/* Staff Module Card */}
        <div 
          onClick={() => onNavigate('shifts')}
          style={{
            width: '250px', height: '200px', backgroundColor: 'white', 
            borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h2 style={{ color: '#28a745' }}>Staff Management</h2>
          <p style={{ color: '#666' }}>Shifts & Schedules</p>
        </div>
      </div>
    </div>
  );
}