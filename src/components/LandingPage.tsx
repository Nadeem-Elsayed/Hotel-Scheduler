import React from 'react';

interface LandingPageProps {
  onNavigate: (view: 'guests' | 'shifts' | 'settings') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', backgroundColor: '#f4f6f8',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      <h1 style={{ marginBottom: '8px', fontSize: '2.8rem', fontWeight: 800, color: '#1a202c', letterSpacing: '-0.5px' }}>
        Pod Inn Hotel
      </h1>
      <p style={{ color: '#718096', marginBottom: '40px', fontSize: '1.1rem' }}>Hotel Operations & Management Hub</p>
      
      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Guest Module Card */}
        <div 
          onClick={() => onNavigate('guests')}
          style={{
            width: '280px', height: '220px', backgroundColor: 'white', 
            borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.02)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,123,255,0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏨</div>
          <h2 style={{ color: '#007bff', margin: '0 0 6px 0', fontSize: '1.4rem', fontWeight: 700 }}>Guest Operations</h2>
          <p style={{ color: '#718096', margin: 0, fontSize: '0.9rem' }}>Check-in, Ledger & Billing</p>
        </div>

        {/* Staff Module Card */}
        <div 
          onClick={() => onNavigate('shifts')}
          style={{
            width: '280px', height: '220px', backgroundColor: 'white', 
            borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.02)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(40,167,69,0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🗓️</div>
          <h2 style={{ color: '#28a745', margin: '0 0 6px 0', fontSize: '1.4rem', fontWeight: 700 }}>Staff Roster</h2>
          <p style={{ color: '#718096', margin: 0, fontSize: '0.9rem' }}>Shifts, Payroll & Schedules</p>
        </div>
      </div>

      {/* Settings Bottom Action */}
      <div style={{ position: 'absolute', bottom: '40px' }}>
        <button 
          onClick={() => onNavigate('settings')}
          style={{
            padding: '12px 24px',
            backgroundColor: 'white',
            color: '#4a5568',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.borderColor = '#cbd5e0'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
        >
          ⚙️ Settings & System Data
        </button>
      </div>
    </div>
  );
}