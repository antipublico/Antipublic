# Credit Card Component

This folder contains the standalone credit card component that was removed from the main app.

## Files:
- `CreditCard.js` - The React component with all the 3D effects, animations, and interactions
- `CreditCard.css` - All the styling including hover effects, mobile responsiveness, and floating lean

## Features Included:
- **3D Card Flip** - Click/tap to flip between front and back
- **Mouse Tilt Effect** - Desktop mouse tracking for realistic tilt
- **Floating Lean** - Subtle left lean when idle (-2.5°)
- **Mobile Optimization** - Touch-friendly interactions and responsive design
- **Realistic Design** - Embossed text, plastic texture, holographic effects
- **Performance Optimized** - CSS containment, will-change hints, no expensive animations

## Usage:
This component is self-contained and can be imported separately if needed:

```jsx
import CreditCard from './card/CreditCard';

// Use in any component
<CreditCard 
  ownerName="Mateo" 
  number="4532 1234 5678 9012" 
  validThru="06/05" 
  bankName="ANTIPUBLIC" 
/>
```

The component is completely independent of the main app and includes all necessary styling.
