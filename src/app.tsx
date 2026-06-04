import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import LandingPage from './components/LandingPage';
import GuestDashboard from './components/GuestDashboard';
import ShiftDashboard from './components/ShiftDashboard';

type ViewState = 'landing' | 'guests' | 'shifts';

// 1. The Main Router Component
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
    </div>
  );
}

// 2. The React Anchor (This is what was missing!)
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}