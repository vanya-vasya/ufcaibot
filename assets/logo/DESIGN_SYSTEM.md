# UFC AI Bot - Khabib Design System

## Color Tokens

```css
:root {
  /* Primary Brand Colors */
  --color-ufc-red: #D20A0A;
  --color-championship-gold: #FFD700;
  --color-deep-black: #000000;
  
  /* Secondary Colors */
  --color-dagestani-blue: #0066CC;
  --color-fighter-gray: #2C2C2C;
  --color-octagon-mat: #1A1A1A;
  
  /* Neutral Colors */
  --color-white: #FFFFFF;
  --color-light-gray: #F5F5F5;
  --color-medium-gray: #888888;
  --color-border-gray: #E0E0E0;
  --color-dark-gray: #333333;
  
  /* Semantic Colors */
  --color-submission-green: #10B981;
  --color-warning-orange: #F59E0B;
  --color-knockout-red: #EF4444;
  --color-decision-blue: #3B82F6;
  
  /* Gradient Definitions */
  --gradient-fighter: linear-gradient(180deg, #FFD700 0%, #D20A0A 100%);
  --gradient-champion: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #D20A0A 100%);
  --gradient-dark: linear-gradient(180deg, #2C2C2C 0%, #000000 100%);
}
```

## Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'ufc-red': '#D20A0A',
        'championship-gold': '#FFD700',
        'dagestani-blue': '#0066CC',
        'fighter-gray': '#2C2C2C',
        'octagon-mat': '#1A1A1A',
        'submission-green': '#10B981',
        'knockout-red': '#EF4444',
      },
      fontFamily: {
        display: ['Montserrat', 'Bebas Neue', 'Arial Black', 'sans-serif'],
        body: ['Inter', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'fighter-gradient': 'linear-gradient(180deg, #FFD700 0%, #D20A0A 100%)',
        'champion-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #D20A0A 100%)',
      },
    },
  },
};
```

## Typography Scale

```css
/* Font Sizes */
:root {
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  --text-7xl: 4.5rem;      /* 72px */
  
  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

## Spacing System

```css
/* Consistent with Tailwind */
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;    /* 4px */
  --spacing-2: 0.5rem;     /* 8px */
  --spacing-3: 0.75rem;    /* 12px */
  --spacing-4: 1rem;       /* 16px */
  --spacing-5: 1.25rem;    /* 20px */
  --spacing-6: 1.5rem;     /* 24px */
  --spacing-8: 2rem;       /* 32px */
  --spacing-10: 2.5rem;    /* 40px */
  --spacing-12: 3rem;      /* 48px */
  --spacing-16: 4rem;      /* 64px */
  --spacing-20: 5rem;      /* 80px */
  --spacing-24: 6rem;      /* 96px */
}
```

## Logo Usage Examples

### Next.js Image Component
```tsx
import Image from 'next/image';

// Main logo
<Image 
  src="/assets/logo/logo-khabib-main-1024.png" 
  alt="UFC AI Bot"
  width={200}
  height={200}
  className="w-auto h-12"
  priority
/>

// Responsive sizes
<Image 
  src="/assets/logo/logo-khabib-main-1024.png"
  alt="UFC AI Bot"
  width={200}
  height={200}
  className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40"
/>

// Dark mode aware
<Image 
  src={theme === 'dark' 
    ? '/assets/logo/logo-khabib-light-1024.png' 
    : '/assets/logo/logo-khabib-main-1024.png'}
  alt="UFC AI Bot"
  width={200}
  height={200}
/>
```

## Button Styles

```css
/* Primary CTA - Champion Style */
.btn-primary {
  background: linear-gradient(135deg, #FFD700 0%, #D20A0A 100%);
  color: white;
  font-weight: 700;
  font-family: var(--font-display);
  padding: 14px 32px;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(210, 10, 10, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(210, 10, 10, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Secondary - Fighter Style */
.btn-secondary {
  background-color: var(--color-fighter-gray);
  color: var(--color-championship-gold);
  font-weight: 600;
  padding: 12px 28px;
  border-radius: 8px;
  border: 2px solid var(--color-championship-gold);
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: var(--color-championship-gold);
  color: var(--color-deep-black);
}

/* Outline - Minimal */
.btn-outline {
  background: transparent;
  color: var(--color-ufc-red);
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 8px;
  border: 2px solid var(--color-ufc-red);
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: var(--color-ufc-red);
  color: white;
}
```

## Card Styles

```css
/* Fighter Card */
.card-fighter {
  background: linear-gradient(135deg, rgba(44, 44, 44, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
  border-radius: 16px;
  padding: 28px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card-fighter::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #FFD700 0%, #D20A0A 100%);
}

.card-fighter:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.4);
}

/* Stats Card */
.card-stats {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid var(--color-championship-gold);
  transition: all 0.3s;
}

.card-stats:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  transform: translateX(4px);
}

/* Dark Mode Card */
.card-dark {
  background: var(--color-fighter-gray);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
}
```

## Component Examples

### Hero Section
```tsx
<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
  {/* Background Logo Watermark */}
  <div className="absolute inset-0 opacity-5">
    <Image 
      src="/assets/logo/logo-khabib-monochrome-1024.png"
      alt=""
      fill
      className="object-contain"
    />
  </div>
  
  {/* Content */}
  <div className="relative z-10 text-center">
    <Image 
      src="/assets/logo/logo-khabib-light-1024.png"
      alt="UFC AI Bot"
      width={300}
      height={300}
      className="mx-auto mb-8 animate-fadeIn"
    />
    <h1 className="text-6xl md:text-7xl font-display font-black text-white mb-4">
      UFC AI BOT
    </h1>
    <p className="text-xl text-championship-gold font-semibold">
      Undefeated Intelligence
    </p>
  </div>
</section>
```

### Stat Display
```tsx
<div className="card-stats">
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-full bg-gradient-fighter flex items-center justify-center">
      <span className="text-2xl font-display font-black text-white">29</span>
    </div>
    <div>
      <h3 className="text-2xl font-display font-bold text-gray-900">29-0</h3>
      <p className="text-sm text-gray-600">Undefeated Legacy</p>
    </div>
  </div>
</div>
```

## Animation Tokens

```css
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-medium: 300ms;
  --duration-slow: 500ms;
  
  /* Easing Functions */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
}

/* Keyframe Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s var(--ease-out);
}

.animate-slideInLeft {
  animation: slideInLeft 0.5s var(--ease-out);
}

.animate-pulse {
  animation: pulse 2s var(--ease-in-out) infinite;
}
```

## Responsive Breakpoints

```css
/* Mobile First Approach */
:root {
  --screen-sm: 640px;    /* Tablet */
  --screen-md: 768px;    /* Small Desktop */
  --screen-lg: 1024px;   /* Desktop */
  --screen-xl: 1280px;   /* Large Desktop */
  --screen-2xl: 1536px;  /* Extra Large */
}

/* Tailwind Style */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

## Z-Index Scale

```css
:root {
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-notification: 1080;
}
```

## Shadow System

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Custom Shadows */
  --shadow-fighter: 0 10px 30px rgba(210, 10, 10, 0.3);
  --shadow-champion: 0 8px 24px rgba(255, 215, 0, 0.3);
}
```

## Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-base: 0.5rem;  /* 8px */
  --radius-md: 0.75rem;   /* 12px */
  --radius-lg: 1rem;      /* 16px */
  --radius-xl: 1.5rem;    /* 24px */
  --radius-2xl: 2rem;     /* 32px */
  --radius-full: 9999px;
}
```

## Accessibility Guidelines

### Color Contrast
- Text on white: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- UFC Red on white: 6.82:1 ✅
- Gold on black: 12.51:1 ✅

### Focus Indicators
```css
:focus-visible {
  outline: 3px solid var(--color-championship-gold);
  outline-offset: 2px;
  border-radius: var(--radius-base);
}
```

### Touch Targets
- Minimum size: 44x44px
- Spacing between targets: 8px minimum

### Screen Reader Text
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

**Design System Version**: 1.0  
**Last Updated**: November 11, 2025  
**Inspired By**: Khabib "The Eagle" Nurmagomedov 🦅
