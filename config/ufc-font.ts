/**
 * UFC AI Bot Typography Configuration
 * Centralized typography system for consistent text styling across the application
 * Excludes color properties - handle those separately per component/theme
 * 
 * @version 1.0.0
 * @author UFC AI Bot Team
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Font family configuration with fallback stack
 */
export interface FontFamily {
  /** Primary font with full fallback stack */
  primary: string;
  /** Heading/display font with fallback stack */
  heading: string;
  /** Monospace font for code/technical content */
  mono: string;
  /** UFC brand sans-serif font */
  ufcSans: string;
  /** UFC brand condensed font for headings */
  ufcHeading: string;
}

/**
 * Font size scale with rem and pixel equivalents
 */
export interface FontSize {
  /** Actual CSS value (rem, px, em) */
  value: string;
  /** Pixel equivalent at 16px base */
  px: number;
  /** Rem value */
  rem: number;
}

/**
 * Complete font size scale
 */
export interface FontSizeScale {
  xs: FontSize;
  sm: FontSize;
  base: FontSize;
  lg: FontSize;
  xl: FontSize;
  '2xl': FontSize;
  '3xl': FontSize;
  '4xl': FontSize;
  '5xl': FontSize;
  '6xl': FontSize;
}

/**
 * Font weight variants
 */
export interface FontWeight {
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
}

/**
 * Line height scale
 */
export interface LineHeight {
  none: number;
  tight: number;
  snug: number;
  normal: number;
  relaxed: number;
  loose: number;
}

/**
 * Letter spacing scale (tracking)
 */
export interface LetterSpacing {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
}

/**
 * Text transform options
 */
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

/**
 * Responsive breakpoint definitions
 */
export interface Breakpoint {
  /** Breakpoint name */
  name: string;
  /** Media query string */
  query: string;
  /** Minimum width in pixels */
  minWidth: number;
  /** Maximum width in pixels (optional) */
  maxWidth?: number;
}

/**
 * Typography preset for common text styles
 */
export interface TypographyPreset {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
  textTransform?: TextTransform;
}

/**
 * Complete typography configuration
 */
export interface TypographyConfig {
  fontFamilies: FontFamily;
  fontSizes: FontSizeScale;
  fontWeights: FontWeight;
  lineHeights: LineHeight;
  letterSpacing: LetterSpacing;
  breakpoints: Breakpoint[];
  presets: Record<string, TypographyPreset>;
}

// ============================================================================
// CONFIGURATION VALUES
// ============================================================================

/**
 * Font Family Stack
 * Primary: Inter with system font fallbacks for optimal performance
 */
export const fontFamilies: FontFamily = {
  primary: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  heading: '"Space Grotesk", Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", Consolas, monospace',
  ufcSans: '"UFC Sans", Arial, sans-serif',
  ufcHeading: '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif',
};

/**
 * Font Size Scale
 * Based on 16px base with responsive scaling
 * Provides both rem and pixel values for reference
 */
export const fontSizes: FontSizeScale = {
  xs: { value: '0.75rem', px: 12, rem: 0.75 },
  sm: { value: '0.875rem', px: 14, rem: 0.875 },
  base: { value: '1rem', px: 16, rem: 1 },
  lg: { value: '1.125rem', px: 18, rem: 1.125 },
  xl: { value: '1.25rem', px: 20, rem: 1.25 },
  '2xl': { value: '1.5rem', px: 24, rem: 1.5 },
  '3xl': { value: '1.875rem', px: 30, rem: 1.875 },
  '4xl': { value: '2.25rem', px: 36, rem: 2.25 },
  '5xl': { value: '2.5rem', px: 40, rem: 2.5 },
  '6xl': { value: '3rem', px: 48, rem: 3 },
};

/**
 * Font Weight Scale
 * Standard numerical weights for cross-browser compatibility
 */
export const fontWeights: FontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

/**
 * Line Height Scale
 * Unitless values for proportional scaling
 */
export const lineHeights: LineHeight = {
  none: 1,
  tight: 1.1,
  snug: 1.2,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

/**
 * Letter Spacing Scale (Tracking)
 * Em-based values for proportional spacing
 */
export const letterSpacing: LetterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.01em',
  wider: '0.025em',
  widest: '0.05em',
};

/**
 * Responsive Breakpoints
 * Standard mobile-first breakpoints
 */
export const breakpoints: Breakpoint[] = [
  { name: 'xs', query: '@media (max-width: 480px)', minWidth: 0, maxWidth: 480 },
  { name: 'sm', query: '@media (max-width: 640px)', minWidth: 481, maxWidth: 640 },
  { name: 'md', query: '@media (min-width: 768px)', minWidth: 768 },
  { name: 'lg', query: '@media (min-width: 1024px)', minWidth: 1024 },
  { name: 'xl', query: '@media (min-width: 1280px)', minWidth: 1280 },
  { name: '2xl', query: '@media (min-width: 1536px)', minWidth: 1536 },
];

/**
 * Typography Presets
 * Pre-configured text styles for common use cases
 */
export const typographyPresets: Record<string, TypographyPreset> = {
  // Hero/Landing Page
  heroHeading: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['5xl'].value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none',
  },
  
  heroSubheading: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.base.value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none',
  },

  // Navigation
  navLink: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.base.value,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    textTransform: 'uppercase',
  },

  // Headers
  h1: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['4xl'].value,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    textTransform: 'none',
  },

  h2: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['3xl'].value,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    textTransform: 'none',
  },

  h3: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['2xl'].value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    textTransform: 'none',
  },

  h4: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.xl.value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    textTransform: 'none',
  },

  h5: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.lg.value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    textTransform: 'none',
  },

  h6: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.base.value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    textTransform: 'none',
  },

  // Body Text
  bodyLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.lg.value,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    textTransform: 'none',
  },

  bodyNormal: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.base.value,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    textTransform: 'none',
  },

  bodySmall: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.sm.value,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    textTransform: 'none',
  },

  // Footer
  footerHeading: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.base.value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none',
  },

  footerLink: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.sm.value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none',
  },

  footerText: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.sm.value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none',
  },

  // Buttons
  buttonLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.base.value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none',
  },

  buttonNormal: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.sm.value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none',
  },

  buttonSmall: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.xs.value,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none',
  },

  // Products Section
  productTitle: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['2xl'].value,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal,
    textTransform: 'uppercase',
  },

  productDescription: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.lg.value,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
    textTransform: 'none',
  },

  // Code/Technical
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm.value,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    textTransform: 'none',
  },
};

/**
 * Complete typography configuration object
 */
export const typographyConfig: TypographyConfig = {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  breakpoints,
  presets: typographyPresets,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get CSS custom property string for font family
 * @param family Font family key
 * @returns CSS var() string
 */
export const getFontFamilyVar = (family: keyof FontFamily): string => {
  const varMap: Record<keyof FontFamily, string> = {
    primary: 'var(--font-sans)',
    heading: 'var(--font-heading)',
    mono: 'var(--font-mono)',
    ufcSans: 'var(--font-ufc-sans)',
    ufcHeading: 'var(--font-ufc-heading)',
  };
  return varMap[family];
};

/**
 * Generate inline style object from preset
 * @param presetName Name of the typography preset
 * @returns React CSSProperties object (without color)
 */
export const getPresetStyles = (presetName: keyof typeof typographyPresets): React.CSSProperties => {
  const preset = typographyPresets[presetName];
  if (!preset) {
    console.warn(`Typography preset "${presetName}" not found`);
    return {};
  }

  return {
    fontFamily: preset.fontFamily,
    fontSize: preset.fontSize,
    fontWeight: preset.fontWeight,
    lineHeight: preset.lineHeight,
    letterSpacing: preset.letterSpacing,
    textTransform: preset.textTransform,
  };
};

/**
 * Generate responsive font size with mobile/desktop variants
 * @param mobile Mobile font size key
 * @param desktop Desktop font size key
 * @returns Object with mobile and desktop values
 */
export const getResponsiveFontSize = (
  mobile: keyof FontSizeScale,
  desktop: keyof FontSizeScale
) => ({
  mobile: fontSizes[mobile].value,
  desktop: fontSizes[desktop].value,
});

/**
 * Get CSS media query string for breakpoint
 * @param breakpoint Breakpoint name
 * @returns Media query string
 */
export const getBreakpoint = (breakpoint: string): string => {
  const bp = breakpoints.find(b => b.name === breakpoint);
  return bp ? bp.query : '';
};

/**
 * Create custom typography preset
 * @param config Partial preset configuration
 * @returns Complete preset with defaults
 */
export const createCustomPreset = (config: Partial<TypographyPreset>): TypographyPreset => ({
  fontFamily: config.fontFamily || fontFamilies.primary,
  fontSize: config.fontSize || fontSizes.base.value,
  fontWeight: config.fontWeight || fontWeights.normal,
  lineHeight: config.lineHeight || lineHeights.normal,
  letterSpacing: config.letterSpacing || letterSpacing.normal,
  textTransform: config.textTransform || 'none',
});

// ============================================================================
// EXPORTS
// ============================================================================

export default typographyConfig;

