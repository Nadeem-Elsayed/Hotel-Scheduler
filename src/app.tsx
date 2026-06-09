import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import LandingPage from './components/LandingPage';
import GuestDashboard from './components/GuestDashboard';
import ShiftDashboard from './components/ShiftDashboard';
import SettingsPage from './components/SettingsPage';

// Added 'settings' to the ViewState
type ViewState = 'landing' | 'guests' | 'shifts' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  return (
    <div className="App" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {currentView === 'landing' && (
        <LandingPage onNavigate={(view) => setCurrentView(view)} />
      )}
      
      {currentView === 'guests' && (
        <GuestDashboard onBack={() => setCurrentView('landing')} />
      )}
      
      {currentView === 'shifts' && (
        <ShiftDashboard onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'settings' && (
        <SettingsPage onBack={() => setCurrentView('landing')} />
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}