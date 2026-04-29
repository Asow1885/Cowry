// ════════════════════════════════════════════════════════════
// App.jsx
// Cowry · Wrapped in MobileFrame for Replit preview
// ────────────────────────────────────────────────────────────
// THE KEY CHANGE: everything is wrapped in <MobileFrame>.
// This makes the app render at phone-size (390×844) on
// Replit's desktop preview, but go full-screen on actual
// mobile devices.
// ════════════════════════════════════════════════════════════

import { useState } from 'react';
import MobileFrame from './components/MobileFrame';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import CreatePouchFlow from './components/CreatePouchFlow';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [creatingPouch, setCreatingPouch] = useState(false);
  const [pouches, setPouches] = useState([
    { name: "Mama's hospital", emoji: '🏥', saved: 340, goal: 2000, currency: 'USD' },
    { name: 'School fees', emoji: '🎓', saved: 1200, goal: 1500, currency: 'USD' },
  ]);

  const handlePouchCreated = (newPouch) => {
    setPouches([...pouches, newPouch]);
    setCreatingPouch(false);
  };

  return (
    <MobileFrame>
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {!showSplash && (
        <>
          <HomeScreen
            user={{ name: 'Ashley', initials: 'AS' }}
            balance={{ amount: 1240.00, currency: 'USD' }}
            accounts={[
              { flag: '🇺🇸', currency: 'USD', amount: '$1,240.00' },
              { flag: '🇬🇳', currency: 'GNF', amount: '0 GNF' },
              { flag: '🇪🇺', currency: 'EUR', amount: '€0.00' },
            ]}
            pouches={pouches}
            transactions={[
              { type: 'sent', name: 'Mama Sow', detail: 'Sent · 2 days ago',
                amount: '50 USD', sub: 'To GNF' },
              { type: 'received', name: 'Chase Bank', detail: 'Added · Thursday',
                amount: '+1,000 USD', sub: '' },
            ]}
            onSend={() => console.log('Send tapped')}
            onCreatePouch={() => setCreatingPouch(true)}
            onTabChange={(tab) => console.log('Tab:', tab)}
          />

          {creatingPouch && (
            <CreatePouchFlow
              onComplete={handlePouchCreated}
              onCancel={() => setCreatingPouch(false)}
            />
          )}
        </>
      )}
    </MobileFrame>
  );
}
