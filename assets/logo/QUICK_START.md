# 🚀 Quick Start - Khabib Logo Implementation

## In 60 Seconds

### 1. Add Favicons
```html
<!-- Copy to app/layout.tsx or index.html <head> -->
<link rel="icon" type="image/png" sizes="16x16" href="/assets/logo/favicon-khabib-16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/logo/favicon-khabib-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/assets/logo/favicon-khabib-48.png">
<link rel="apple-touch-icon" href="/assets/logo/app-icon-khabib-512.png">
```

### 2. Add Logo to Navbar (Next.js)
```tsx
import Image from 'next/image';

<Image 
  src="/assets/logo/logo-khabib-main-1024.png"
  alt="UFC AI Bot"
  width={160}
  height={160}
  className="h-12 w-auto"
  priority
/>
```

### 3. Dark Mode Support
```tsx
const logoSrc = theme === 'dark' 
  ? '/assets/logo/logo-khabib-light-1024.png'
  : '/assets/logo/logo-khabib-main-1024.png';
```

### 4. Add Brand Colors to Tailwind
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'ufc-red': '#D20A0A',
      'championship-gold': '#FFD700',
      'dagestani-blue': '#0066CC',
    },
  },
}
```

---

## Which Logo to Use?

| File | When to Use |
|------|-------------|
| `logo-khabib-main-1024.png` | ✅ Light backgrounds, white sections |
| `logo-khabib-light-1024.png` | 🌙 Dark backgrounds, dark mode |
| `logo-khabib-monochrome-1024.png` | 🖨️ Print, watermarks, single-color |
| `app-icon-khabib-*.png` | 📱 Favicons, PWA, mobile apps |

---

## Brand Colors

```css
Primary:   #D20A0A  /* UFC Red */
Accent:    #FFD700  /* Championship Gold */
Secondary: #0066CC  /* Dagestani Blue */
Dark:      #2C2C2C  /* Fighter Gray */
```

---

## Complete Example

```tsx
'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';

export const Logo = () => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center gap-3">
      <Image 
        src={theme === 'dark' 
          ? '/assets/logo/logo-khabib-light-1024.png'
          : '/assets/logo/logo-khabib-main-1024.png'
        }
        alt="UFC AI Bot"
        width={48}
        height={48}
        className="w-12 h-12"
        priority
      />
      <h1 className="text-2xl font-display font-black">
        <span className="text-championship-gold">UFC</span>
        {' '}
        <span className="text-ufc-red">AI Bot</span>
      </h1>
    </div>
  );
};
```

---

## Need More Info?

- **Full Guide**: See `README.md`
- **Design System**: See `DESIGN_SYSTEM.md`
- **Generation Details**: See `GENERATION_DETAILS.md`
- **Index**: See `INDEX.md`

---

**That's it! Your Khabib-inspired logo is ready.** 🦅

*Inspired by the undefeated champion: 29-0*
