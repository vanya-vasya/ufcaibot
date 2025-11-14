# UFC Hero Background - Quick Reference Card

## 📦 Generated Assets

| Device  | Filename | Path | Dimensions | Size | Format |
|---------|----------|------|------------|------|--------|
| Desktop | `ufc-octagon-hero-desktop.webp` | `/public/assets/images/` | 1536x1024 | 131KB | WebP |
| Mobile  | `ufc-octagon-hero-mobile.webp` | `/public/assets/images/` | 1024x1536 | 207KB | WebP |

---

## 🎨 Prompts Used

### Desktop
```
Professional UFC octagon arena background, dramatic overhead perspective looking down at the iconic octagon cage, dark atmospheric lighting with focused spotlights creating depth, subtle metallic textures on the cage mesh, deep shadows in corners with soft spotlight highlights in the center, minimalist composition perfect for text overlay, cinematic sports photography style, high contrast but not overpowering, professional UFC branding aesthetic, canvas floor with subtle texture, cage posts and structure visible but not dominating, moody and intense atmosphere, ultra-wide desktop wallpaper format, subtle vignette around edges for seamless text integration
```

### Mobile
```
Professional UFC octagon arena background optimized for mobile vertical format, dramatic angled perspective of the iconic octagon cage, dark atmospheric lighting with focused spotlights creating depth and drama, subtle metallic textures on cage mesh, deep shadows with strategic highlight areas for text placement, upper third darker for header content and middle section with balanced lighting, minimalist composition perfect for mobile UI overlay, cinematic sports photography style, high contrast but text-friendly, professional UFC branding aesthetic, canvas floor with subtle texture, cage structure elegant and non-intrusive, moody intense atmosphere, vertical mobile wallpaper format, natural vignette for seamless content integration
```

---

## ♿ Alt Text

**Desktop:**
```
UFC octagon arena with dramatic overhead lighting creating depth and atmosphere, dark background optimized for text overlay
```

**Mobile:**
```
UFC octagon arena vertical view with atmospheric lighting and shadows, optimized for mobile text content display
```

---

## 🚀 Quick Implementation

### Option 1: Simple CSS (Current Method)
```tsx
// components/landing/hero.tsx
<section 
  style={{
    backgroundImage: 'url(/assets/images/ufc-octagon-hero-desktop.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '50vh'
  }}
>
```

### Option 2: Responsive with CSS
Add to your component's `<style jsx>`:
```css
@media (max-width: 768px) {
  section {
    background-image: url(/assets/images/ufc-octagon-hero-mobile.webp) !important;
  }
}
```

### Option 3: Next.js Image (Recommended)
```tsx
<div className="absolute inset-0 -z-10">
  <Image
    src="/assets/images/ufc-octagon-hero-desktop.webp"
    alt="UFC octagon arena with dramatic overhead lighting"
    fill
    priority
    quality={90}
    className="object-cover hidden md:block"
  />
  <Image
    src="/assets/images/ufc-octagon-hero-mobile.webp"
    alt="UFC octagon arena vertical view"
    fill
    priority
    quality={90}
    className="object-cover block md:hidden"
  />
</div>
```

---

## ✅ Text Overlay Guidelines

### Colors with Excellent Contrast
- ✅ **White text** (15:1+ ratio)
- ✅ **Green gradient** (from-green-400 via-green-500 to-green-600)
- ✅ **Light grays** (#e5e5e5+)

### Safe Zones
- **Desktop:** Center 60% width, center 50% height
- **Mobile:** Center 80% width, top 40-60% height

### Optional Enhancement
```css
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
```

---

## 📊 Performance

- **Total Size:** 338KB (both variants)
- **Format:** WebP (85% quality)
- **Loading:** Use `priority` prop for above-the-fold
- **Optimization:** Compressed for web, no visible artifacts

---

## 🎯 Quick Migration

**Replace this:**
```tsx
backgroundImage: 'url(/assets/images/minimalist-background.jpg)'
```

**With this:**
```tsx
backgroundImage: 'url(/assets/images/ufc-octagon-hero-desktop.webp)'
```

**For responsive:**
```tsx
// Add media query in <style jsx>
@media (max-width: 768px) {
  section {
    background-image: url(/assets/images/ufc-octagon-hero-mobile.webp) !important;
  }
}
```

---

## 🔍 Visual Features

- ✨ **Dramatic overhead lighting** creates depth
- 🎨 **Natural vignette** on edges for text blending
- 🏟️ **Iconic octagon cage** with metallic textures
- 🌑 **Dark atmospheric** mood (professional UFC aesthetic)
- 💡 **Strategic highlights** don't overpower text

---

## ✔️ Testing Checklist

- [ ] Text clearly visible on desktop (1920x1080+)
- [ ] Mobile variant loads on small screens (<768px)
- [ ] Green gradient text maintains visibility
- [ ] Images load within 2 seconds
- [ ] No distortion at breakpoints
- [ ] WCAG AA contrast compliance

---

## 📝 Notes

- Images saved to: `/public/assets/images/`
- WebP format with broad browser support
- Compressed at 85% quality (optimal balance)
- Generation date: November 11, 2025
- Tool: OpenAI GPT Image via MCP

---

**See full documentation:** `UFC_HERO_BACKGROUND_DOCUMENTATION.md`

