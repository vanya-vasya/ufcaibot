/**
 * Fortune Health Design System Tokens
 * Based on Fortune.com/section/health/ visual design patterns
 */

export const fortuneHealthTokens = {
  // Typography System - Based on Fortune's font stack
  typography: {
    fontFamilies: {
      primary: '"Graphik", "Helvetica Neue", Arial, sans-serif',
      secondary: '"Chronicle Text", Georgia, serif',
      mono: '"SF Mono", Consolas, monospace'
    },
    fontSizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px  
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeights: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
    }
  },

  // Color System - Fortune brand colors
  colors: {
    brand: {
      primary: '#000000',     // Fortune black
      secondary: '#CC0000',   // Fortune red
      accent: '#F5F5F5',      // Light gray
    },
    text: {
      primary: '#1a1a1a',     // Almost black
      secondary: '#4a4a4a',   // Medium gray
      tertiary: '#767676',    // Light gray
      muted: '#a1a1a1',       // Very light gray
      inverse: '#ffffff',     // White
    },
    background: {
      primary: '#ffffff',     // White
      secondary: '#fafafa',   // Off-white
      tertiary: '#f5f5f5',    // Light gray
      accent: '#000000',      // Black
    },
    border: {
      light: '#e5e5e5',      // Light border
      medium: '#cccccc',     // Medium border
      dark: '#999999',       // Dark border
    },
    interactive: {
      link: '#CC0000',        // Fortune red for links
      linkHover: '#990000',   // Darker red for hover
      focus: '#0066CC',       // Blue for focus states
    },
    status: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },

  // Spacing System - 8px base scale
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
  },

  // Shadows - Professional, subtle shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Layout System
  layout: {
    maxWidth: {
      sm: '640px',
      md: '768px', 
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    }
  },

  // Animation/Transitions
  motion: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    }
  },

  // Component-specific tokens
  components: {
    articleCard: {
      borderRadius: '0.5rem',
      padding: '1.5rem',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      hoverShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      titleFontSize: '1.25rem',
      titleLineHeight: '1.375',
      metaFontSize: '0.875rem',
    },
    button: {
      borderRadius: '0.25rem',
      paddingX: '1.5rem',
      paddingY: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '600',
    },
    tag: {
      borderRadius: '1rem',
      paddingX: '0.75rem',
      paddingY: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '500',
    }
  }
} as const;

// Utility function to get token values
export const getToken = (path: string) => {
  const keys = path.split('.');
  let value: any = fortuneHealthTokens;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      console.warn(`Design token not found: ${path}`);
      return undefined;
    }
  }
  
  return value;
};

// CSS custom properties for use in stylesheets
export const fortuneHealthCSSVars = {
  // Typography
  '--font-primary': fortuneHealthTokens.typography.fontFamilies.primary,
  '--font-secondary': fortuneHealthTokens.typography.fontFamilies.secondary,
  
  // Colors
  '--color-text-primary': fortuneHealthTokens.colors.text.primary,
  '--color-text-secondary': fortuneHealthTokens.colors.text.secondary,
  '--color-text-tertiary': fortuneHealthTokens.colors.text.tertiary,
  '--color-brand-primary': fortuneHealthTokens.colors.brand.primary,
  '--color-brand-secondary': fortuneHealthTokens.colors.brand.secondary,
  '--color-background-primary': fortuneHealthTokens.colors.background.primary,
  '--color-background-secondary': fortuneHealthTokens.colors.background.secondary,
  '--color-border-light': fortuneHealthTokens.colors.border.light,
  '--color-interactive-link': fortuneHealthTokens.colors.interactive.link,
  '--color-interactive-link-hover': fortuneHealthTokens.colors.interactive.linkHover,
  
  // Spacing
  '--spacing-4': fortuneHealthTokens.spacing[4],
  '--spacing-6': fortuneHealthTokens.spacing[6],
  '--spacing-8': fortuneHealthTokens.spacing[8],
  '--spacing-12': fortuneHealthTokens.spacing[12],
  '--spacing-16': fortuneHealthTokens.spacing[16],
  
  // Layout
  '--max-width-2xl': fortuneHealthTokens.layout.maxWidth['2xl'],
  
  // Shadows
  '--shadow-base': fortuneHealthTokens.shadows.base,
  '--shadow-md': fortuneHealthTokens.shadows.md,
  '--shadow-lg': fortuneHealthTokens.shadows.lg,
} as const;

export type FortuneHealthTokens = typeof fortuneHealthTokens;
export type FortuneHealthCSSVars = typeof fortuneHealthCSSVars;
