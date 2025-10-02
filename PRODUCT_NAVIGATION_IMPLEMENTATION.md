# Product Navigation Implementation

## Overview
This document describes the implementation of the Products dropdown menu with consistent styling, icons, and centralized configuration.

## Architecture

### 1. Centralized Configuration (`constants/product-navigation.ts`)

The product navigation items are defined in a single source of truth:

```typescript
export interface ProductNavigationItem {
  label: string;
  href: string;
  iconUrl?: string;
  iconFallback: string;
  description?: string;
}

export const PRODUCT_ITEMS: ProductNavigationItem[]
```

**Icon URL Sources:**
- Icons are loaded from `/public/assets/icons/` (relative paths)
- Can also use external URLs (https://...)
- Fallback emojis used if icon fails to load or isn't provided

**To add new products:**
1. Add a new entry to `PRODUCT_ITEMS` array
2. Provide `iconUrl` (relative path or absolute URL)
3. Provide `iconFallback` emoji as backup
4. Specify the `href` with appropriate toolId parameter

### 2. ProductIcon Component (`components/shared/ProductIcon.tsx`)

Handles icon rendering with automatic fallback:
- Attempts to load image from `iconUrl`
- Falls back to emoji/text if loading fails
- Provides consistent sizing and alignment
- Includes proper accessibility attributes

### 3. Typography Styles

**Centralized Typography Values:**
- Font family: `var(--nav-font)` (Inter, system-ui fallback)
- Font weight: 600
- Font size: 16px
- Line height: 1.1
- Letter spacing: 0.01em

**Hover State:**
- Green gradient effect: `linear-gradient(to right, #10b981, #059669, #047857)`
- Text becomes transparent with gradient background clip
- Smooth 500ms transition

### 4. Component Integration

#### Desktop Headers
- `components/landing/header.tsx`
- `components/dashboard-header.tsx`

Both use:
- `DropdownMenu` from Radix UI
- `.dropdown-menu-item` class matching nav-link styles
- Icons rendered via `ProductIcon` component
- Dynamic content from `PRODUCT_ITEMS`

#### Mobile Sidebar
- `components/guest-mobile-sidebar.tsx`

Uses:
- Collapsible component for expandable menu
- Same `PRODUCT_ITEMS` configuration
- Icons with slightly smaller size (18px vs 20px)

## Styling Details

### Dropdown Menu Items
```css
.dropdown-menu-item {
  font-family: var(--nav-font);
  font-weight: 600;
  font-size: 16px;
  line-height: 1.1;
  letter-spacing: 0.01em;
  text-transform: none;
  color: #0f172a;
  padding: 10px 14px;
  border-radius: 8px;
  transition: all 500ms ease-in-out;
}
```

### Responsive Behavior
- Desktop (>1024px): Full navigation with dropdown
- Mobile (<1024px): Hamburger menu with collapsible Products section
- Navigation container hidden on small screens

### Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
  .dropdown-menu-item {
    color: #f1f5f9;
  }
}
```

## Features

✅ **Consistent Typography** - All navigation items use identical styles  
✅ **Centralized Configuration** - Single source for product data  
✅ **Icon System** - Images with emoji fallbacks  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Dark Mode Ready** - Supports system preferences  
✅ **Accessible** - Proper ARIA labels and keyboard navigation  
✅ **Maintainable** - Easy to add/modify products  

## Extending the System

### Adding a New Product

1. **Update `constants/product-navigation.ts`:**
```typescript
{
  label: "Your New Product",
  href: "/dashboard/conversation?toolId=new-product",
  iconUrl: "/assets/icons/new-icon.svg",
  iconFallback: "🎯",
  description: "Description of the new product"
}
```

2. **Add icon file:**
- Place icon in `/public/assets/icons/`
- Or use external URL

3. **Configure backend:**
- Ensure the toolId is recognized by the conversation page
- Update tool configurations as needed

### Customizing Styles

To modify typography or colors:
1. Update CSS variables in component `<style jsx global>` blocks
2. Or modify `NAV_TYPOGRAPHY` constants for programmatic access
3. Changes propagate to all navigation items automatically

## Testing Checklist

- [ ] Desktop dropdown shows all products with icons
- [ ] Mobile menu expands/collapses Products section
- [ ] Icons load correctly or show fallback
- [ ] Hover effects match header navigation
- [ ] Links navigate to correct URLs with toolId
- [ ] Responsive breakpoints work correctly
- [ ] Dark mode styling applies properly
- [ ] Keyboard navigation works in dropdown

## Files Modified

1. `constants/product-navigation.ts` - New file
2. `components/shared/ProductIcon.tsx` - New file
3. `components/landing/header.tsx` - Updated
4. `components/dashboard-header.tsx` - Updated
5. `components/guest-mobile-sidebar.tsx` - Updated

## Dependencies

- React 18+
- Next.js 13+ (App Router)
- Radix UI (dropdown-menu, collapsible)
- Lucide React (icons)
- Tailwind CSS

