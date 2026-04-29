# Cowry — Replit Layout Fix

This package fixes the layout problems you're seeing on Replit (everything overflows the screen, items stacked weirdly, tab bar floating in the wrong place).

## What's broken and why

The Cowry components were designed to render at **phone size** (around 390px wide). When Replit shows your app in its desktop preview, it stretches everything to fill the full browser window — which makes the layout look wrong because the components were never meant for that width.

Two specific issues:

1. **No phone container** — your app spreads across the whole browser window instead of staying at iPhone width.
2. **Tab bar uses `position: fixed`** — which means it sticks to the *browser window* rather than to the phone container. So it floats around in the wrong place.

## The fix

Two new files do the work:

- **`MobileFrame.jsx`** — wraps your entire app in a 390×844 phone-shaped container, centered on screen. On actual mobile devices it goes edge-to-edge.
- **`HomeScreen.css` (replacement)** — updated version that uses `position: absolute` instead of `position: fixed` for the tab bar, so it stays inside the phone container.

## Setup in 3 steps

### 1. Add the new files

In your Replit project, navigate to `src/components/` and upload:

- `MobileFrame.jsx`
- `MobileFrame.css`

Then **replace your existing `HomeScreen.css`** with the new version in this package. (The JSX file doesn't need to change — only the CSS.)

### 2. Wrap your app in MobileFrame

Open your `App.jsx` and use the example in `App-replit-fixed.jsx` as your reference.

The change is one import and one wrapper:

```jsx
// Add this import
import MobileFrame from './components/MobileFrame';

// Wrap everything in <MobileFrame>...</MobileFrame>
export default function App() {
  return (
    <MobileFrame>
      {/* your existing app content */}
    </MobileFrame>
  );
}
```

### 3. Run it

Hit **Run** on Replit. The preview should now show a phone-shaped frame in the center, with your app rendering correctly inside it.

## What it'll look like

**On Replit's desktop preview:**
A 390×844 phone-shaped container, centered on a beige background, with a soft drop shadow and a subtle device-frame edge. Looks like an iPhone mockup. Every component renders the way it was designed.

**On a real phone (when you eventually deploy):**
The frame disappears at viewports under 480px. The app goes edge-to-edge like a real native app. Same components, no changes needed.

## Why position absolute matters

The tab bar at the bottom of the home screen previously used:

```css
position: fixed;
bottom: 0;
```

`fixed` positions an element relative to the **browser window**, not the parent container. So when you wrapped the home screen in a phone frame, the tab bar ignored the frame and stuck itself to the bottom of the whole browser. Looked wrong.

The new CSS uses:

```css
position: absolute;
bottom: 0;
```

`absolute` positions relative to the nearest **positioned parent** — which is the phone frame. The tab bar now stays inside the frame where it belongs.

## Replit Agent prompt

If you'd rather have the agent do this for you:

> I'm having layout issues — my React components were designed for mobile but they overflow when Replit renders them at desktop width. I uploaded MobileFrame.jsx and MobileFrame.css to src/components/, plus an updated HomeScreen.css. Please:
> 1. Wrap my entire App.jsx in `<MobileFrame>...</MobileFrame>`
> 2. Replace the existing HomeScreen.css with the new one I uploaded
> 3. Make sure MobileFrame is imported in App.jsx

Done.

## Coming next

Once layout is fixed, we'll tackle the rest of your list in this order:

1. **Cowry Tag** (@username) — so users can send to `@ashley` instead of typing a phone number
2. **QR codes** — every Cowry Tag gets a QR. Scan to send.
3. **Currency API integration** — live exchange rates from ExchangeRate-API
4. **White transaction backgrounds** — when actively sending/adding money, the screen goes white instead of cream (more bank-like, more focused)
5. **Move money between Pouches** — pull from main account into a pouch, transfer between pouches, withdraw from a pouch
6. **Delete pouches** — with a confirmation dialog asking what to do with the saved money

Each one will ship as its own package (just like splash, home, pouches). One thing at a time.
