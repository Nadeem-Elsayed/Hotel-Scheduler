import React, { useState, useEffect } from 'react';

interface SettingsPageProps {
  onBack: () => void;
}

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const [payrollAnchor, setPayrollAnchor] = useState('2026-05-29');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [checkInTime, setCheckInTime] = useState('14:00'); // 2:00 PM

  // Load Settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setPayrollAnchor(await window.api.getSetting('payrollAnchor', '2026-05-29'));
      setCheckOutTime(await window.api.getSetting('checkOutTime', '11:00'));
      setCheckInTime(await window.api.getSetting('checkInTime', '14:00'));
    };
    loadSettings();
  }, []);

  // Save Settings handlers
  const handleSaveAppPreferences = async () => {
    await window.api.updateSetting('payrollAnchor', payrollAnchor);
    await window.api.updateSetting('checkOutTime', checkOutTime);
    await window.api.updateSetting('checkInTime', checkInTime);
    
    // REPLACE alert()
    await window.api.showMessage('App preferences saved successfully!', 'Success');
  };

  // Danger Zone Handlers
  // Danger Zone Handlers
  const handleRestore = async () => {
    // REPLACE confirm()
    const isConfirmed = await window.api.showConfirm("🚨 DANGER: This will OVERWRITE your current live database with a backup. All data entered since that backup will be permanently lost. Are you sure you want to proceed?", "Restore Backup");
    
    if (isConfirmed) {
      const res = await window.api.restoreDatabase();
      if (res.error && res.error !== 'cancelled') {
        await window.api.showMessage('Failed to restore: ' + res.error, 'Error');
      }
    }
  };

  const handlePurge = async () => {
    // REPLACE confirm()
    const isConfirmed = await window.api.showConfirm("🚨 WARNING: This will permanently delete all shifts and guest records older than 1 year from the live view. A permanent archive file will be saved in your Backups folder first. Proceed?", "Archive & Purge");
    
    if (isConfirmed) {
      const res = await window.api.purgeDatabase();
      if (res.success) {
        await window.api.showMessage('Database successfully purged! An archive file has been created in your Backups folder.', 'Success');
      } else {
        await window.api.showMessage('Failed to purge database: ' + res.error, 'Error');
      }
    }
  };

 const handleImport = async (type: 'guests' | 'shifts') => {
    const res = await window.api.importCSV(type);
    if (res.error && res.error !== 'cancelled') {
       // REPLACE alert()
       await window.api.showMessage(res.error, 'Import Error');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
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
        >Back to hub</button>

      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Settings & System Data</h2>

      {/* --- SECTION 1: APP PREFERENCES --- */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>App Preferences</h3>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold', marginBottom: '5px' }}>Payroll Anchor Date</label>
            <input type="date" value={payrollAnchor} onChange={(e) => setPayrollAnchor(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <span style={{ fontSize: '0.8em', color: '#666' }}>The start date of your 14-day bi-weekly pay cycle.</span>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold', marginBottom: '5px' }}>Standard Check-Out Time</label>
            <input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold', marginBottom: '5px' }}>Standard Check-In Time</label>
            <input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
        </div>

        <button onClick={handleSaveAppPreferences} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Save Preferences
        </button>
      </div>

      {/* --- SECTION 2: DATA IMPORT --- */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>Data Import</h3>
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>Upload historical data from external spreadsheets. Files must be in standard .CSV format.</p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => handleImport('guests')} style={{ flex: 1, padding: '12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            ↑ Import Guests (CSV)
          </button>
          <button onClick={() => handleImport('shifts')} style={{ flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            ↑ Import Shifts (CSV)
          </button>
        </div>
      </div>

      {/* --- SECTION 3: DANGER ZONE --- */}
      <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffeeba' }}>
        <h3 style={{ marginTop: 0, color: '#856404' }}>Danger Zone</h3>
        <p style={{ fontSize: '0.9em', color: '#856404', marginBottom: '15px' }}>Actions here manipulate the local database file directly.</p>
        
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <button onClick={() => window.api.openBackupFolder()} style={{ padding: '10px', backgroundColor: 'white', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>
            📂 Open Backups Folder
          </button>
          
          <button onClick={handleRestore} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>
            ⚠️ Restore Database from Backup
          </button>

          <button onClick={handlePurge} style={{ padding: '10px', backgroundColor: '#343a40', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>
            🗑️ Archive & Purge Records Older Than 1 Year
          </button>
        </div>
      </div>
    </div>
  );
}