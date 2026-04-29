// ════════════════════════════════════════════════════════════
// MobileFrame.jsx
// Cowry · Mobile-app frame for desktop/Replit preview
// ────────────────────────────────────────────────────────────
// Wraps your entire app in a phone-sized container so it
// renders correctly when previewing on Replit's desktop view.
//
// ON DESKTOP / REPLIT PREVIEW:
//   Shows the app inside a 390px-wide phone frame, centered
//   on a beige background with a soft shadow — looks like an
//   iPhone mockup.
//
// ON ACTUAL MOBILE DEVICES:
//   Goes full-screen, edge-to-edge, like a real app.
//
// USAGE in App.jsx:
//   import MobileFrame from './components/MobileFrame';
//
//   export default function App() {
//     return (
//       <MobileFrame>
//         {/* ...your existing app content... */}
//         <SplashScreen ... />
//         <HomeScreen ... />
//       </MobileFrame>
//     );
//   }
//
// FILE PLACEMENT:
//   src/components/MobileFrame.jsx
//   src/components/MobileFrame.css
// ════════════════════════════════════════════════════════════

import './MobileFrame.css';

export default function MobileFrame({ children }) {
  return (
    <div className="cowry-mobile-frame-bg">
      <div className="cowry-mobile-frame">
        <div className="cowry-mobile-frame-inner">
          {children}
        </div>
      </div>
    </div>
  );
}
