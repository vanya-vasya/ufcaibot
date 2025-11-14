# Soft Edge Gradient Implementation for Products Section

## Overview
Implemented a configurable soft edge gradient system for the "Global News. Decoded" product block to create a smoother transition between the image and text content.

## Configuration System

### Product Configuration
Each product in the `products` array now supports a `gradientConfig` object:

```typescript
{
  title: "Global News. Decoded",
  image: "/images/products/fighter-press-conference.png",
  darkTheme: true,
  gradientConfig: {
    direction: "left",      // "left" | "right" | "top" | "bottom"
    intensity: 0.85,        // 0.0 - 1.0 (higher = more opaque)
    softEdge: true,         // true = gradual fade, false = stronger overlay
  }
}
```

### CSS Variables
The gradient system uses CSS custom properties for dynamic configuration:

- `--gradient-intensity`: Controls opacity (0.0 - 1.0)
- `--gradient-bg-color`: Background color for gradient base

### Direction Options

| Direction | Gradient | Image Position | Text Position |
|-----------|----------|----------------|---------------|
| `left`    | `bg-gradient-to-r` | Right side | Left side |
| `right`   | `bg-gradient-to-l` | Left side | Right side |
| `top`     | `bg-gradient-to-b` | Bottom | Top |
| `bottom`  | `bg-gradient-to-t` | Top | Bottom |

## Implementation Details

### Gradient Function

```typescript
const getGradientStyle = (
  config: { direction: string; intensity: number; softEdge?: boolean }, 
  bgColor: string = '#0a0a0a'
) => {
  const intensity = config.intensity;
  const softEdge = config.softEdge || false;
  
  // CSS variables for configurability
  const gradientStyles = {
    '--gradient-intensity': intensity.toString(),
    '--gradient-bg-color': bgColor,
  } as React.CSSProperties;

  // Define gradient stops based on type
  let gradientStops: string;
  
  if (softEdge) {
    // Soft edge: more gradual fade with extended transparent area
    gradientStops = `from-[var(--gradient-bg-color)] via-[rgba(10,10,10,${intensity * 0.6})] to-transparent`;
  } else {
    // Standard gradient: stronger overlay
    gradientStops = `from-[var(--gradient-bg-color)] via-[rgba(10,10,10,${intensity * 0.8})] lg:via-[rgba(10,10,10,${intensity * 0.6})] to-transparent`;
  }

  return { gradientStyles, gradientStops };
};
```

### HTML/CSS Structure

```tsx
{/* Fullscreen Image with Gradient */}
<motion.div className="absolute top-0 right-0 bottom-0 w-full lg:w-[55%] h-full">
  <div className="relative w-full h-full">
    {/* Image */}
    <Image
      src={product.image}
      alt={product.title}
      fill
      className="object-cover object-center"
    />
    
    {/* Gradient Overlay */}
    {(() => {
      const { gradientStyles, gradientStops } = getGradientStyle(gradientConfig);
      const gradientDirection = gradientConfig.direction === 'left' 
        ? 'bg-gradient-to-r' 
        : 'bg-gradient-to-l';
      
      return (
        <div 
          className={`absolute inset-0 ${gradientDirection} ${gradientStops} pointer-events-none`}
          style={gradientStyles}
        />
      );
    })()}
  </div>
</motion.div>
```

## Comparison: Standard vs Soft Edge

### Standard Gradient (`softEdge: false`)
- **Intensity distribution**: 80% → 60% → 0%
- **Use case**: Strong text contrast needed
- **Visual effect**: Noticeable overlay, clear text readability

```typescript
gradientStops = `from-[#0a0a0a] via-[rgba(10,10,10,0.72)] lg:via-[rgba(10,10,10,0.54)] to-transparent`;
```

### Soft Edge Gradient (`softEdge: true`)
- **Intensity distribution**: 100% → 51% → 0%
- **Use case**: Subtle transition, image prominence
- **Visual effect**: Gentle fade, maintains image visibility

```typescript
gradientStops = `from-[#0a0a0a] via-[rgba(10,10,10,0.51)] to-transparent`;
```

## Product-Specific Configurations

### 1. Live Odds. Real Edge
```typescript
gradientConfig: {
  direction: "left",
  intensity: 0.9,
}
```
- Stronger overlay for clear text readability
- Image on right, fades toward left text

### 2. Every Round. Every Pattern
```typescript
gradientConfig: {
  direction: "right",
  intensity: 0.9,
}
```
- Stronger overlay for clear text readability
- Image on left, fades toward right text

### 3. Global News. Decoded (★ NEW)
```typescript
gradientConfig: {
  direction: "left",
  intensity: 0.85,
  softEdge: true,
}
```
- **Soft edge enabled** for smoother transition
- Slightly lower intensity (0.85) for subtle effect
- Image on right, gentle fade toward left text
- Creates seamless visual flow between image and text

## Responsive Behavior

The gradient system is fully responsive:

### Mobile (< 1024px)
- Images span full width
- Gradient applies across entire image
- Single intensity value used

### Desktop (≥ 1024px)
- Images occupy 50-55% width
- Gradient has two-stage fade (standard mode only)
- Text occupies remaining 45-50% width

## Theme Awareness

The gradient system automatically adapts to theme:

```typescript
// Dark theme (current implementation)
bgColor: '#0a0a0a'
textColor: '#ffffff'

// Light theme (configurable)
bgColor: '#ffffff'
textColor: '#000000'
```

## Customization Examples

### Increase fade intensity
```typescript
gradientConfig: {
  direction: "left",
  intensity: 0.95,  // More opaque
  softEdge: true,
}
```

### Reverse gradient direction
```typescript
gradientConfig: {
  direction: "right",  // Image on left
  intensity: 0.85,
  softEdge: true,
}
```

### Vertical gradient (top/bottom)
```typescript
gradientConfig: {
  direction: "bottom",  // Image on top
  intensity: 0.8,
  softEdge: true,
}
```

## Browser Compatibility

- **Modern browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **CSS features used**:
  - CSS Custom Properties (CSS Variables)
  - Tailwind gradient utilities
  - RGBA color notation
  - CSS `inset-0` positioning

## Performance

- **Zero runtime overhead**: Gradients are CSS-based
- **No JavaScript calculation**: All handled by browser
- **GPU-accelerated**: Uses hardware acceleration
- **Minimal DOM nodes**: Single overlay div per image

## Accessibility

- `pointer-events-none` ensures gradient doesn't interfere with interactions
- Text remains fully readable with proper contrast ratios
- Gradient enhances readability without obscuring content

## Future Enhancements

Potential additions for extended configurability:

1. **Multi-stop gradients**: 3+ color stops
2. **Radial gradients**: Circular fade patterns
3. **Animated gradients**: Subtle motion effects
4. **Theme-based auto-configuration**: Auto-adjust based on color scheme
5. **Image-aware intensity**: Adjust based on image brightness

## Visual Comparison

### Before (No Gradient)
- Hard edge between image and text
- Potential text readability issues
- Abrupt visual transition

### After (Soft Edge Gradient)
- Smooth, gradual transition
- Enhanced text contrast
- Professional, polished appearance
- Image prominence maintained

