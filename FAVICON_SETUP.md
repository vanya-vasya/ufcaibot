# Favicon Setup Guide

This document explains how the favicon system is configured and how to update it.

## Current Setup

The project uses a comprehensive favicon system that supports:
- Modern browsers (PNG, SVG, ICO)
- PWA/Mobile web apps (Web Manifest)
- iOS devices (Apple Touch Icon)
- Multiple sizes for different contexts

## Files Structure

```
public/
├── favicon.ico                 # Traditional favicon (32x32)
├── favicon.svg                 # Scalable vector favicon
├── favicon-16x16.png          # Small favicon
├── favicon-32x32.png          # Standard favicon
├── favicon-192x192.png        # Android icon
├── favicon-512x512.png        # High-res Android icon
├── apple-touch-icon.png       # iOS home screen (180x180)
└── site.webmanifest           # PWA manifest file
```

## Metadata Configuration

The favicon references are configured in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "UFC AI Bot",
  description: "AI-powered creative tools for everyone",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};
```

## How to Update the Favicon

### Step 1: Prepare Your Source Image

Your source image should:
- Be at least 512x512 pixels (higher resolution is better)
- Have a white background (or transparent if preferred)
- Be in PNG format
- Be named `favicon-source.png`

### Step 2: Place the Source Image

Save your source image to:
```
public/favicon-source.png
```

### Step 3: Generate All Favicon Sizes

Run the favicon generation script:

```bash
npm run favicon:generate
```

This script will automatically:
- Read `public/favicon-source.png`
- Generate all required favicon sizes
- Place them in the `public/` folder
- Add white backgrounds if needed
- Optimize for web delivery

### Step 4: Verify the Output

Check that all files were generated:
- ✓ favicon-16x16.png
- ✓ favicon-32x32.png
- ✓ favicon-192x192.png
- ✓ favicon-512x512.png
- ✓ apple-touch-icon.png
- ✓ favicon.ico

### Step 5: Test

1. **Development**: Run `npm run dev` and check the browser tab icon
2. **Production**: Deploy and verify across browsers
3. **Mobile**: Test on iOS (add to home screen) and Android

## Browser Support

| Browser/Platform | Supported Format | File Used |
|-----------------|------------------|-----------|
| Chrome/Edge/Firefox | PNG, SVG, ICO | favicon-32x32.png, favicon.svg |
| Safari | PNG, ICO | favicon-32x32.png |
| iOS Home Screen | PNG | apple-touch-icon.png |
| Android Home Screen | PNG | favicon-192x192.png, favicon-512x512.png |
| PWA | Web Manifest | site.webmanifest |

## Build Pipeline

The Next.js build pipeline automatically:
1. Copies all files from `public/` to the build output
2. Serves them at the root path (`/`)
3. Optimizes static assets
4. Includes them in the production bundle

No additional configuration is needed in `next.config.js` for favicons.

## Troubleshooting

### Favicon not updating in browser
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Close and reopen the browser
- Try incognito/private mode

### Generation script fails
- Ensure `sharp` is installed: `npm install sharp`
- Check that `favicon-source.png` exists in `public/`
- Verify the image is a valid PNG file
- Check file permissions

### Mobile icon not showing
- Verify `site.webmanifest` is accessible at `/site.webmanifest`
- Check that icon paths in manifest are correct
- Test on actual device (emulators may not show icons correctly)

## Current Favicon Design

The current favicon features:
- **Design**: Silhouette of a person with afro hairstyle, pointing upward
- **Background**: White (#FFFFFF)
- **Foreground**: Black silhouette
- **Style**: Bold, iconic, memorable
- **Theme**: Represents confidence, victory, achievement

## Additional Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Web Manifest Specification](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Favicon Best Practices](https://dev.to/masakudamatsu/favicon-nightmare-how-to-maintain-sanity-3al7)

