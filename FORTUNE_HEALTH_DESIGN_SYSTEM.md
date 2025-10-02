# Fortune Health Design System Implementation

This document outlines the design system implementation based on Fortune.com's health section visual design patterns.

## 🎯 Overview

We've implemented a comprehensive design system that matches Fortune's professional, editorial aesthetic while maintaining accessibility and responsive design principles.

## 🎨 Design Tokens

### Typography
- **Primary Font**: `"Graphik", "Helvetica Neue", Arial, sans-serif` (Fortune's primary typeface)
- **Secondary Font**: `"Chronicle Text", Georgia, serif` (For editorial content)
- **Font Scale**: Carefully calibrated scale from 12px to 48px
- **Font Weights**: Light (300) to Extra Bold (800)
- **Letter Spacing**: Tight spacing for headlines, normal for body text

### Color Palette
```css
/* Brand Colors */
--color-brand-primary: #000000;    /* Fortune Black */
--color-brand-secondary: #CC0000;  /* Fortune Red */
--color-brand-accent: #F5F5F5;     /* Light Gray */

/* Text Colors */
--color-text-primary: #1a1a1a;     /* Almost Black */
--color-text-secondary: #4a4a4a;   /* Medium Gray */
--color-text-tertiary: #767676;    /* Light Gray */

/* Interactive Colors */
--color-interactive-link: #CC0000;      /* Fortune Red */
--color-interactive-link-hover: #990000; /* Darker Red */
```

### Spacing System
Based on 8px grid system:
- Base unit: 8px (0.5rem)
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px, 96px, 128px

### Shadows
Professional, subtle shadows that match Fortune's clean aesthetic:
```css
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
```

## 📱 Component System

### FortuneArticleCard
**Reference**: Fortune Health article cards
**Key Features**:
- 4:3 aspect ratio images (Fortune standard)
- Clean typography hierarchy
- Subtle hover effects
- Category tags with Fortune styling
- Meta information (author, date, read time)
- Red accent color for interactive elements

**Responsive Behavior**:
- Mobile: Single column, full-width cards
- Tablet: 2-column grid
- Desktop: 3-column grid
- Large screens: Maintains max-width constraints

### FortuneInsightsSection
**Reference**: Fortune Health section layout
**Key Features**:
- Featured article layout (large hero card)
- Grid system for regular articles
- Fortune-style typography and spacing
- Professional loading and error states
- Pagination with Fortune-style button design

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│                     Section Header                          │
│                  "More Health" Title                        │
│                    Description                              │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│  Featured Article (50% width)    │  Featured Image (50%)   │
│  - Large title                   │  - 4:3 aspect ratio    │
│  - Extended summary              │  - High-quality image   │
│  - Author & meta info            │                         │
│                                                            │
├─────────────────────────────────────────────────────────────┤
│                   Regular Articles Grid                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                    │
│  │ Article │  │ Article │  │ Article │                    │
│  │  Card   │  │  Card   │  │  Card   │                    │
│  └─────────┘  └─────────┘  └─────────┘                    │
│                        ...                                 │
└─────────────────────────────────────────────────────────────┘
```

## 🎛️ Design Token Usage

### CSS Custom Properties
The design system exports CSS custom properties for easy integration:

```css
.fortune-styled-element {
  font-family: var(--font-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-6);
  box-shadow: var(--shadow-base);
}
```

### TypeScript Integration
```typescript
import { fortuneHealthTokens } from '@/lib/design-tokens/fortune-health';

// Access tokens programmatically
const primaryColor = fortuneHealthTokens.colors.brand.primary;
const headingFont = fortuneHealthTokens.typography.fontFamilies.primary;
```

## ♿ Accessibility Implementation

### WCAG AA Compliance
- **Color Contrast**: All text meets minimum 4.5:1 contrast ratio
- **Focus States**: Visible focus indicators on all interactive elements
- **Semantic HTML**: Proper heading hierarchy, landmarks, and ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Comprehensive alt text and ARIA descriptions

### Semantic Structure
```html
<article role="article" aria-labelledby="article-title">
  <h3 id="article-title">Article Title</h3>
  <div aria-label="Article metadata">
    <time datetime="2025-09-27">Sept 27, 2025</time>
    <span aria-label="Read time">5 min read</span>
  </div>
  <p aria-describedby="article-summary">Article summary...</p>
</article>
```

## 📐 Responsive Design

### Breakpoint System
```css
/* Mobile First Approach */
.article-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: Single column */
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .article-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .article-grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
  }
}
```

### Image Optimization
- Next.js Image component with optimized loading
- Responsive image sizing with proper `sizes` attribute
- WebP format support with fallbacks
- Lazy loading for performance
- Priority loading for above-the-fold content

## 🔧 Implementation Mapping

### Fortune Health Reference → Implementation

| Fortune Element | Implementation | Notes |
|----------------|---------------|-------|
| Typography Scale | `fortuneHealthTokens.typography.fontSizes` | Matches Fortune's editorial hierarchy |
| Color Palette | `fortuneHealthTokens.colors` | Fortune black/red/gray system |
| Card Layout | `FortuneArticleCard` | 4:3 aspect ratio, clean typography |
| Grid System | CSS Grid with responsive breakpoints | Mobile-first responsive design |
| Button Styles | Fortune-style buttons with borders | Black border, hover to fill |
| Category Tags | White/black tags matching Fortune | Uppercase, tracking, bold weight |
| Link Styles | Red color with subtle animations | Fortune red (#CC0000) |

## 🚀 Performance Optimizations

### Image Loading
- WebP format with fallbacks
- Responsive image sizing
- Priority loading for featured articles
- Lazy loading for grid articles
- Proper aspect ratio containers

### CSS Optimization
- CSS Custom Properties for consistent theming
- Minimal CSS payload through design tokens
- Hardware-accelerated animations
- Reduced layout shifts through aspect ratio containers

### JavaScript
- Code splitting for components
- Lazy loading of non-critical features
- Optimized bundle size through tree shaking
- Performance monitoring with Core Web Vitals

## 📊 Analytics & SEO

### Structured Data
Each article includes comprehensive JSON-LD structured data:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article summary",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization", 
    "name": "Fortune"
  }
}
```

### Analytics Events
- Article impressions tracking
- Click-through rate monitoring
- User engagement metrics
- Performance monitoring

## 🔄 Maintenance & Updates

### Design Token Updates
To update the design system:

1. Modify tokens in `/lib/design-tokens/fortune-health.ts`
2. CSS custom properties automatically update
3. Components inherit new values
4. No manual component updates needed

### Adding New Components
1. Import design tokens
2. Use token values for styling
3. Follow established patterns
4. Maintain accessibility standards
5. Add responsive behavior

## 📝 Usage Examples

### Basic Article Card
```tsx
import FortuneArticleCard from '@/components/insights/FortuneArticleCard';
import { fortuneHealthTokens } from '@/lib/design-tokens/fortune-health';

<FortuneArticleCard
  article={articleData}
  index={0}
  priority={true} // For above-the-fold content
/>
```

### Custom Styled Component
```tsx
const CustomComponent = styled.div`
  font-family: ${fortuneHealthTokens.typography.fontFamilies.primary};
  color: ${fortuneHealthTokens.colors.text.primary};
  font-size: ${fortuneHealthTokens.typography.fontSizes.lg};
  margin: ${fortuneHealthTokens.spacing[6]};
  
  &:hover {
    color: ${fortuneHealthTokens.colors.interactive.link};
  }
`;
```

## 🎯 Next Steps

1. **Performance Monitoring**: Set up monitoring for Core Web Vitals
2. **A/B Testing**: Test design variations against user engagement
3. **Accessibility Audit**: Regular automated and manual accessibility testing
4. **Design System Expansion**: Add more Fortune-style components as needed
5. **Documentation Updates**: Keep this guide updated as the system evolves

---

**Last Updated**: October 1, 2025
**Version**: 1.0.0
**Maintainer**: Yum-mi Development Team
