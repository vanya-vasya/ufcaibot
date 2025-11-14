# UFC Font Typography Config - Usage Guide

## Overview

The `ufc-font.ts` configuration file provides a centralized, type-safe typography system for the entire application. All text styling parameters (except colors) are managed here for consistency and maintainability.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration Structure](#configuration-structure)
- [Using Presets](#using-presets)
- [Utility Functions](#utility-functions)
- [Migration Examples](#migration-examples)
- [Best Practices](#best-practices)
- [Responsive Typography](#responsive-typography)

---

## Quick Start

### Basic Import

```typescript
import { typographyPresets, getPresetStyles } from '@/config/ufc-font';
```

### Using Presets in Components

```tsx
import { getPresetStyles } from '@/config/ufc-font';

const MyComponent = () => {
  return (
    <h1 style={getPresetStyles('heroHeading')}>
      Welcome to UFC AI Bot
    </h1>
  );
};
```

### Custom Inline Styles

```tsx
import { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacing } from '@/config/ufc-font';

const MyComponent = () => {
  return (
    <p style={{
      fontFamily: fontFamilies.primary,
      fontSize: fontSizes.lg.value,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.wide,
      color: '#000000', // Colors handled separately
    }}>
      Your text here
    </p>
  );
};
```

---

## Configuration Structure

### Font Families

Available font stacks:

```typescript
import { fontFamilies } from '@/config/ufc-font';

fontFamilies.primary    // Inter with system fallbacks
fontFamilies.heading    // Space Grotesk with fallbacks
fontFamilies.mono       // JetBrains Mono for code
fontFamilies.ufcSans    // UFC brand sans-serif
fontFamilies.ufcHeading // UFC brand condensed
```

### Font Sizes

Complete scale from xs to 6xl:

```typescript
import { fontSizes } from '@/config/ufc-font';

fontSizes.xs    // 0.75rem (12px)
fontSizes.sm    // 0.875rem (14px)
fontSizes.base  // 1rem (16px)
fontSizes.lg    // 1.125rem (18px)
fontSizes.xl    // 1.25rem (20px)
fontSizes['2xl'] // 1.5rem (24px)
fontSizes['3xl'] // 1.875rem (30px)
fontSizes['4xl'] // 2.25rem (36px)
fontSizes['5xl'] // 2.5rem (40px)
fontSizes['6xl'] // 3rem (48px)

// Access as: fontSizes.lg.value, fontSizes.lg.px, fontSizes.lg.rem
```

### Font Weights

```typescript
import { fontWeights } from '@/config/ufc-font';

fontWeights.light      // 300
fontWeights.normal     // 400
fontWeights.medium     // 500
fontWeights.semibold   // 600
fontWeights.bold       // 700
fontWeights.extrabold  // 800
```

### Line Heights

```typescript
import { lineHeights } from '@/config/ufc-font';

lineHeights.none     // 1
lineHeights.tight    // 1.1
lineHeights.snug     // 1.2
lineHeights.normal   // 1.5
lineHeights.relaxed  // 1.625
lineHeights.loose    // 2
```

### Letter Spacing

```typescript
import { letterSpacing } from '@/config/ufc-font';

letterSpacing.tighter  // -0.05em
letterSpacing.tight    // -0.025em
letterSpacing.normal   // 0
letterSpacing.wide     // 0.01em
letterSpacing.wider    // 0.025em
letterSpacing.widest   // 0.05em
```

---

## Using Presets

### Available Presets

#### Hero/Landing
- `heroHeading` - Large hero titles
- `heroSubheading` - Hero descriptive text

#### Navigation
- `navLink` - Navigation menu items

#### Headers (H1-H6)
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6`

#### Body Text
- `bodyLarge` - 18px body text
- `bodyNormal` - 16px standard text
- `bodySmall` - 14px small text

#### Footer
- `footerHeading` - Footer section titles
- `footerLink` - Footer navigation links
- `footerText` - Footer body text

#### Buttons
- `buttonLarge` - Large button text
- `buttonNormal` - Standard button text
- `buttonSmall` - Small button text

#### Products
- `productTitle` - Product section titles
- `productDescription` - Product descriptions

#### Technical
- `code` - Code snippets and technical text

### Preset Usage Examples

```tsx
import { getPresetStyles } from '@/config/ufc-font';

// Hero Section
<h2 style={getPresetStyles('heroHeading')}>
  AI Engine built for MINDFUL EATER
</h2>

<p style={getPresetStyles('heroSubheading')}>
  Snap a picture, and your meal's story comes alive
</p>

// Navigation
<Link href="/dashboard" style={getPresetStyles('navLink')}>
  Dashboard
</Link>

// Footer
<h3 style={getPresetStyles('footerHeading')}>
  Menu
</h3>

<Link href="/story" style={getPresetStyles('footerLink')}>
  Our Story
</Link>

// Buttons
<button style={getPresetStyles('buttonLarge')}>
  Get Started
</button>
```

---

## Utility Functions

### getPresetStyles()

Returns a React CSSProperties object for inline styles:

```tsx
import { getPresetStyles } from '@/config/ufc-font';

const styles = getPresetStyles('heroHeading');
// Returns: { fontFamily: '...', fontSize: '...', ... }

<h1 style={styles}>Title</h1>
```

### getFontFamilyVar()

Get CSS custom property for font families:

```tsx
import { getFontFamilyVar } from '@/config/ufc-font';

const fontVar = getFontFamilyVar('primary');
// Returns: 'var(--font-sans)'
```

### getResponsiveFontSize()

Generate responsive font sizes:

```tsx
import { getResponsiveFontSize } from '@/config/ufc-font';

const sizes = getResponsiveFontSize('2xl', '5xl');
// Returns: { mobile: '1.5rem', desktop: '2.5rem' }

<style jsx>{`
  .hero-heading {
    font-size: ${sizes.mobile};
  }
  
  @media (min-width: 768px) {
    .hero-heading {
      font-size: ${sizes.desktop};
    }
  }
`}</style>
```

### getBreakpoint()

Get media query string:

```tsx
import { getBreakpoint } from '@/config/ufc-font';

const mediaQuery = getBreakpoint('md');
// Returns: '@media (min-width: 768px)'
```

### createCustomPreset()

Create ad-hoc presets:

```tsx
import { createCustomPreset, fontFamilies, fontSizes, fontWeights } from '@/config/ufc-font';

const myCustomPreset = createCustomPreset({
  fontFamily: fontFamilies.primary,
  fontSize: fontSizes['3xl'].value,
  fontWeight: fontWeights.bold,
});

<h2 style={myCustomPreset}>Custom Styled Text</h2>
```

---

## Migration Examples

### Before (Hardcoded)

```tsx
<h2 
  className="hero-heading text-center"
  style={{
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: 600,
    fontSize: '2.5rem',
    lineHeight: 1.1,
    letterSpacing: '0.01em',
    textTransform: 'none',
    color: 'white'
  }}
>
  AI Engine built for
</h2>
```

### After (Using Config)

```tsx
import { getPresetStyles } from '@/config/ufc-font';

<h2 
  className="text-center"
  style={{
    ...getPresetStyles('heroHeading'),
    color: 'white' // Colors handled separately
  }}
>
  AI Engine built for
</h2>
```

### Before (CSS Variables)

```tsx
<style jsx global>{`
  :root {
    --contact-font: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }

  .hero-heading {
    font-family: var(--contact-font);
    font-weight: 600;
    font-size: 2.5rem;
    line-height: 1.1;
    letter-spacing: 0.01em;
  }
`}</style>
```

### After (Using Config)

```tsx
import { getPresetStyles } from '@/config/ufc-font';

// Option 1: Inline styles
<h2 style={getPresetStyles('heroHeading')}>Title</h2>

// Option 2: CSS-in-JS with config values
import { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacing } from '@/config/ufc-font';

<style jsx>{`
  .hero-heading {
    font-family: ${fontFamilies.primary};
    font-weight: ${fontWeights.semibold};
    font-size: ${fontSizes['5xl'].value};
    line-height: ${lineHeights.tight};
    letter-spacing: ${letterSpacing.wide};
  }
`}</style>
```

---

## Best Practices

### 1. Use Presets First

Always check if a preset exists before creating custom styles:

```tsx
// ✅ Good: Use existing preset
<h1 style={getPresetStyles('heroHeading')}>Title</h1>

// ❌ Avoid: Recreating preset manually
<h1 style={{
  fontFamily: 'Inter...',
  fontSize: '2.5rem',
  // ...
}}>Title</h1>
```

### 2. Keep Colors Separate

Never add colors to the typography config. Handle them per component:

```tsx
// ✅ Good: Colors separate
<h1 style={{
  ...getPresetStyles('heroHeading'),
  color: 'white',
  background: '#000'
}}>Title</h1>

// ❌ Avoid: Mixing typography with colors in config
```

### 3. Use Type Safety

Leverage TypeScript for autocomplete and type checking:

```tsx
import type { TypographyPreset } from '@/config/ufc-font';

const MyComponent = ({ preset }: { preset: keyof typeof typographyPresets }) => {
  return <h1 style={getPresetStyles(preset)}>Title</h1>;
};
```

### 4. Responsive Design

Use the responsive utilities for breakpoints:

```tsx
import { getResponsiveFontSize, getBreakpoint } from '@/config/ufc-font';

const sizes = getResponsiveFontSize('2xl', '5xl');

<style jsx>{`
  .heading {
    font-size: ${sizes.mobile};
  }
  
  ${getBreakpoint('md')} {
    .heading {
      font-size: ${sizes.desktop};
    }
  }
`}</style>
```

### 5. Consistent Imports

Always import from the same source:

```tsx
// ✅ Good: Direct imports
import { fontSizes, fontWeights, getPresetStyles } from '@/config/ufc-font';

// ❌ Avoid: Mixing default and named imports
import typographyConfig from '@/config/ufc-font';
const { fontSizes } = typographyConfig;
```

---

## Responsive Typography

### Mobile-First Approach

```tsx
import { fontSizes, breakpoints } from '@/config/ufc-font';

<style jsx>{`
  .responsive-text {
    /* Mobile: base size */
    font-size: ${fontSizes.base.value};
  }
  
  /* Tablet and up */
  @media (min-width: 768px) {
    .responsive-text {
      font-size: ${fontSizes.lg.value};
    }
  }
  
  /* Desktop and up */
  @media (min-width: 1024px) {
    .responsive-text {
      font-size: ${fontSizes.xl.value};
    }
  }
`}</style>
```

### Utility Function

```tsx
import { getResponsiveFontSize } from '@/config/ufc-font';

const MyComponent = () => {
  const { mobile, desktop } = getResponsiveFontSize('base', 'xl');
  
  return (
    <>
      <p className="responsive-text">Responsive text</p>
      <style jsx>{`
        .responsive-text {
          font-size: ${mobile};
        }
        
        @media (min-width: 768px) {
          .responsive-text {
            font-size: ${desktop};
          }
        }
      `}</style>
    </>
  );
};
```

---

## Advanced Usage

### Creating Component-Specific Styles

```tsx
import { createCustomPreset, fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacing } from '@/config/ufc-font';

const specialHeading = createCustomPreset({
  fontFamily: fontFamilies.heading,
  fontSize: fontSizes['4xl'].value,
  fontWeight: fontWeights.extrabold,
  lineHeight: lineHeights.tight,
  letterSpacing: letterSpacing.tighter,
});

<h1 style={specialHeading}>Special Heading</h1>
```

### Combining with Tailwind

```tsx
import { getPresetStyles } from '@/config/ufc-font';

// Use config for custom overrides, Tailwind for utilities
<h1 
  className="text-center mb-4 text-white"
  style={getPresetStyles('heroHeading')}
>
  Best of Both Worlds
</h1>
```

### Dynamic Presets

```tsx
import { getPresetStyles } from '@/config/ufc-font';

const HeadingComponent = ({ level }: { level: 1 | 2 | 3 | 4 | 5 | 6 }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const preset = `h${level}` as keyof typeof typographyPresets;
  
  return <Tag style={getPresetStyles(preset)}>Dynamic Heading</Tag>;
};
```

---

## Troubleshooting

### Issue: Preset not applying

```tsx
// ❌ Wrong
<h1 style="heroHeading">Title</h1>

// ✅ Correct
import { getPresetStyles } from '@/config/ufc-font';
<h1 style={getPresetStyles('heroHeading')}>Title</h1>
```

### Issue: TypeScript errors

```tsx
// Ensure you're importing types correctly
import type { TypographyPreset, FontFamily } from '@/config/ufc-font';
```

### Issue: Font not loading

```tsx
// Check that fonts are loaded in your layout.tsx or globals.css
// The config only provides the font-family string, not the @font-face rules
```

---

## File Structure

```
/config
  ├── ufc-font.ts                  # Main config file
  └── UFC_FONT_USAGE_GUIDE.md      # This guide

/app
  └── globals.css                   # Font @font-face declarations
  
/components
  └── [your-component].tsx          # Import and use presets
```

---

## Support & Contribution

For questions or suggestions about the typography system:
1. Review this guide
2. Check existing presets in `ufc-font.ts`
3. Create custom presets using utility functions
4. Propose new presets by extending the `typographyPresets` object

---

**Version:** 1.0.0  
**Last Updated:** November 11, 2025  
**Maintainer:** UFC AI Bot Team

