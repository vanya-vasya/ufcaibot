# UFC Typography Config - Quick Reference

## Import

```tsx
import { getPresetStyles } from '@/config/ufc-font';
```

## Most Common Presets

### Hero Section
```tsx
<h1 style={{ ...getPresetStyles('heroHeading'), color: 'white' }}>
<p style={{ ...getPresetStyles('heroSubheading'), color: 'white' }}>
```

### Page Sections
```tsx
<h2 style={{ ...getPresetStyles('h2'), color: '#1a1a1a' }}>
<h3 style={{ ...getPresetStyles('h3'), color: '#1a1a1a' }}>
```

### Body Text
```tsx
<p style={{ ...getPresetStyles('bodyNormal'), color: '#4a4a4a' }}>
<p style={{ ...getPresetStyles('bodyLarge'), color: '#4a4a4a' }}>
<p style={{ ...getPresetStyles('bodySmall'), color: '#666' }}>
```

### Buttons
```tsx
<button style={{ ...getPresetStyles('buttonLarge'), color: 'white' }}>
<button style={{ ...getPresetStyles('buttonNormal'), color: 'white' }}>
```

### Navigation
```tsx
<Link style={{ ...getPresetStyles('navLink'), color: '#000' }}>
```

### Footer
```tsx
<h3 style={{ ...getPresetStyles('footerHeading'), color: '#0f172a' }}>
<Link style={{ ...getPresetStyles('footerLink'), color: '#0f172a' }}>
<p style={{ ...getPresetStyles('footerText'), color: '#64748b' }}>
```

### Products
```tsx
<h3 style={{ ...getPresetStyles('productTitle'), color: '#000' }}>
<p style={{ ...getPresetStyles('productDescription'), color: '#666' }}>
```

## All Available Presets

| Preset | Size | Weight | Use Case |
|--------|------|--------|----------|
| `heroHeading` | 40px | 600 | Hero titles |
| `heroSubheading` | 16px | 600 | Hero descriptions |
| `navLink` | 16px | 700 | Navigation |
| `h1` | 36px | 700 | Page titles |
| `h2` | 30px | 700 | Section titles |
| `h3` | 24px | 600 | Subsection titles |
| `h4` | 20px | 600 | Card titles |
| `h5` | 18px | 600 | Small titles |
| `h6` | 16px | 600 | Tiny titles |
| `bodyLarge` | 18px | 400 | Large body text |
| `bodyNormal` | 16px | 400 | Standard body text |
| `bodySmall` | 14px | 400 | Small text |
| `footerHeading` | 16px | 600 | Footer section titles |
| `footerLink` | 14px | 600 | Footer links |
| `footerText` | 14px | 600 | Footer text |
| `buttonLarge` | 16px | 600 | Large buttons |
| `buttonNormal` | 14px | 600 | Standard buttons |
| `buttonSmall` | 12px | 600 | Small buttons |
| `productTitle` | 24px | 700 | Product titles |
| `productDescription` | 18px | 400 | Product descriptions |
| `code` | 14px | 400 | Code snippets |

## Advanced Usage

### Individual Values
```tsx
import { fontFamilies, fontSizes, fontWeights } from '@/config/ufc-font';

<h2 style={{
  fontFamily: fontFamilies.primary,
  fontSize: fontSizes['3xl'].value,
  fontWeight: fontWeights.bold,
  color: '#000'
}}>
```

### Responsive
```tsx
import { getResponsiveFontSize, getBreakpoint } from '@/config/ufc-font';

const { mobile, desktop } = getResponsiveFontSize('lg', '3xl');

<style jsx>{`
  .text {
    font-size: ${mobile};
  }
  ${getBreakpoint('md')} {
    .text {
      font-size: ${desktop};
    }
  }
`}</style>
```

### Custom Preset
```tsx
import { createCustomPreset, fontFamilies, fontSizes } from '@/config/ufc-font';

const myPreset = createCustomPreset({
  fontFamily: fontFamilies.heading,
  fontSize: fontSizes['4xl'].value,
  fontWeight: 800,
});
```

## Font Sizes Reference

| Key | Rem | Pixels |
|-----|-----|--------|
| `xs` | 0.75rem | 12px |
| `sm` | 0.875rem | 14px |
| `base` | 1rem | 16px |
| `lg` | 1.125rem | 18px |
| `xl` | 1.25rem | 20px |
| `2xl` | 1.5rem | 24px |
| `3xl` | 1.875rem | 30px |
| `4xl` | 2.25rem | 36px |
| `5xl` | 2.5rem | 40px |
| `6xl` | 3rem | 48px |

## Font Weights Reference

| Key | Value |
|-----|-------|
| `light` | 300 |
| `normal` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |
| `extrabold` | 800 |

## Line Heights Reference

| Key | Value |
|-----|-------|
| `none` | 1 |
| `tight` | 1.1 |
| `snug` | 1.2 |
| `normal` | 1.5 |
| `relaxed` | 1.625 |
| `loose` | 2 |

## Letter Spacing Reference

| Key | Value |
|-----|-------|
| `tighter` | -0.05em |
| `tight` | -0.025em |
| `normal` | 0 |
| `wide` | 0.01em |
| `wider` | 0.025em |
| `widest` | 0.05em |

## Remember

- ✅ Always use presets first
- ✅ Add colors separately
- ✅ Use spread operator (`...`)
- ❌ Never modify the config in components
- ❌ Don't hardcode font values

## Files

- **Config:** `/config/ufc-font.ts`
- **Full Guide:** `/config/UFC_FONT_USAGE_GUIDE.md`
- **Examples:** `/config/UFC_FONT_EXAMPLES.tsx`
- **Summary:** `/UFC_TYPOGRAPHY_IMPLEMENTATION.md`

