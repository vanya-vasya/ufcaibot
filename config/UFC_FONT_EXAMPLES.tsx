/**
 * UFC Font Typography Config - Usage Examples
 * 
 * This file demonstrates various ways to use the centralized typography system.
 * These are working code examples that can be copied and adapted for your components.
 */

import React from 'react';
import Link from 'next/link';
import { 
  getPresetStyles, 
  fontFamilies, 
  fontSizes, 
  fontWeights, 
  lineHeights, 
  letterSpacing,
  getResponsiveFontSize,
  getBreakpoint,
  createCustomPreset,
  typographyPresets 
} from './ufc-font';

// ============================================================================
// EXAMPLE 1: Using Presets (Recommended Approach)
// ============================================================================

export const Example1_UsingPresets = () => {
  return (
    <div>
      <h1 style={getPresetStyles('heroHeading')}>
        Hero Heading
      </h1>
      
      <h2 style={{ ...getPresetStyles('h2'), color: '#1a1a1a' }}>
        Section Heading with Custom Color
      </h2>
      
      <p style={getPresetStyles('bodyNormal')}>
        This is normal body text using a preset.
      </p>
      
      <button style={{ ...getPresetStyles('buttonLarge'), color: 'white', background: '#10b981' }}>
        Large Button
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 2: Footer Component Pattern
// ============================================================================

export const Example2_FooterPattern = () => {
  const footerHeadingStyles = getPresetStyles('footerHeading');
  const footerLinkStyles = getPresetStyles('footerLink');
  const footerTextStyles = getPresetStyles('footerText');
  
  return (
    <footer>
      <h3 style={{ ...footerHeadingStyles, color: '#0f172a' }}>
        Quick Links
      </h3>
      
      <ul>
        <li>
          <Link href="/about" style={{ ...footerLinkStyles, color: '#0f172a' }}>
            About Us
          </Link>
        </li>
      </ul>
      
      <p style={{ ...footerTextStyles, color: '#64748b' }}>
        © 2025 Company Name. All rights reserved.
      </p>
    </footer>
  );
};

// ============================================================================
// EXAMPLE 3: Using Individual Typography Values
// ============================================================================

export const Example3_IndividualValues = () => {
  return (
    <div>
      <h2 style={{
        fontFamily: fontFamilies.primary,
        fontSize: fontSizes['3xl'].value,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wide,
        color: '#000000'
      }}>
        Custom Styled Heading
      </h2>
      
      <p style={{
        fontFamily: fontFamilies.primary,
        fontSize: fontSizes.base.value,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
        color: '#4a4a4a'
      }}>
        Custom styled paragraph text.
      </p>
    </div>
  );
};

// ============================================================================
// EXAMPLE 4: Responsive Typography with CSS-in-JS
// ============================================================================

export const Example4_ResponsiveTypography = () => {
  const { mobile, desktop } = getResponsiveFontSize('lg', '3xl');
  
  return (
    <>
      <h2 className="responsive-heading">
        Responsive Heading
      </h2>
      
      <style jsx>{`
        .responsive-heading {
          font-family: ${fontFamilies.heading};
          font-size: ${mobile};
          font-weight: ${fontWeights.bold};
          line-height: ${lineHeights.tight};
          color: #1a1a1a;
        }
        
        @media (min-width: 768px) {
          .responsive-heading {
            font-size: ${desktop};
          }
        }
      `}</style>
    </>
  );
};

// ============================================================================
// EXAMPLE 5: Navigation Links
// ============================================================================

export const Example5_NavigationLinks = () => {
  const navLinkStyles = getPresetStyles('navLink');
  
  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];
  
  return (
    <nav>
      {links.map(link => (
        <Link 
          key={link.name}
          href={link.href}
          style={{ ...navLinkStyles, color: '#000000' }}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

// ============================================================================
// EXAMPLE 6: Product Card with Mixed Typography
// ============================================================================

export const Example6_ProductCard = () => {
  const titleStyles = getPresetStyles('productTitle');
  const descriptionStyles = getPresetStyles('productDescription');
  const buttonStyles = getPresetStyles('buttonNormal');
  
  return (
    <div className="product-card">
      <h3 style={{ ...titleStyles, color: '#000000' }}>
        Product Name
      </h3>
      
      <p style={{ ...descriptionStyles, color: '#64748b' }}>
        This is a detailed product description that explains the key features and benefits.
      </p>
      
      <button style={{ 
        ...buttonStyles, 
        color: 'white', 
        background: '#10b981',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px'
      }}>
        Buy Now
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 7: Creating Custom Presets
// ============================================================================

export const Example7_CustomPresets = () => {
  // Create a one-off custom preset
  const specialHeadingPreset = createCustomPreset({
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes['4xl'].value,
    fontWeight: fontWeights.extrabold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.tighter,
  });
  
  return (
    <h1 style={{ ...specialHeadingPreset, color: '#8b5cf6' }}>
      Special Heading Style
    </h1>
  );
};

// ============================================================================
// EXAMPLE 8: Hero Section with Styled-JSX
// ============================================================================

export const Example8_HeroWithStyledJSX = () => {
  const heroHeadingStyles = getPresetStyles('heroHeading');
  const heroSubheadingStyles = getPresetStyles('heroSubheading');
  
  return (
    <section className="hero">
      <h1 
        className="hero-title"
        style={{ ...heroHeadingStyles, color: 'white' }}
      >
        Welcome to Our Platform
      </h1>
      
      <p 
        className="hero-subtitle"
        style={{ ...heroSubheadingStyles, color: 'rgba(255, 255, 255, 0.9)' }}
      >
        The best solution for your needs
      </p>
      
      <style jsx>{`
        .hero {
          padding: 80px 20px;
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .hero-title {
          margin-bottom: 20px;
        }
        
        .hero-subtitle {
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </section>
  );
};

// ============================================================================
// EXAMPLE 9: Dynamic Heading Component
// ============================================================================

interface DynamicHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export const Example9_DynamicHeading: React.FC<DynamicHeadingProps> = ({ 
  level, 
  children, 
  color = '#1a1a1a',
  className 
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const preset = `h${level}` as keyof typeof typographyPresets;
  const styles = getPresetStyles(preset);
  
  return (
    <Tag className={className} style={{ ...styles, color }}>
      {children}
    </Tag>
  );
};

// Usage:
export const Example9_Usage = () => (
  <div>
    <Example9_DynamicHeading level={1} color="#000000">
      H1 Heading
    </Example9_DynamicHeading>
    <Example9_DynamicHeading level={2} color="#1a1a1a">
      H2 Heading
    </Example9_DynamicHeading>
    <Example9_DynamicHeading level={3} color="#4a4a4a">
      H3 Heading
    </Example9_DynamicHeading>
  </div>
);

// ============================================================================
// EXAMPLE 10: Typography System with All Headings
// ============================================================================

export const Example10_AllHeadings = () => {
  return (
    <div>
      <h1 style={{ ...getPresetStyles('h1'), color: '#1a1a1a' }}>
        Heading 1 - Main Page Title
      </h1>
      
      <h2 style={{ ...getPresetStyles('h2'), color: '#1a1a1a' }}>
        Heading 2 - Section Title
      </h2>
      
      <h3 style={{ ...getPresetStyles('h3'), color: '#1a1a1a' }}>
        Heading 3 - Subsection Title
      </h3>
      
      <h4 style={{ ...getPresetStyles('h4'), color: '#1a1a1a' }}>
        Heading 4 - Card Title
      </h4>
      
      <h5 style={{ ...getPresetStyles('h5'), color: '#1a1a1a' }}>
        Heading 5 - Small Title
      </h5>
      
      <h6 style={{ ...getPresetStyles('h6'), color: '#1a1a1a' }}>
        Heading 6 - Tiny Title
      </h6>
      
      <p style={{ ...getPresetStyles('bodyNormal'), color: '#4a4a4a' }}>
        This is body text that provides additional context and information.
      </p>
    </div>
  );
};

// ============================================================================
// EXAMPLE 11: Button Variants
// ============================================================================

export const Example11_ButtonVariants = () => {
  const largeBtnStyles = getPresetStyles('buttonLarge');
  const normalBtnStyles = getPresetStyles('buttonNormal');
  const smallBtnStyles = getPresetStyles('buttonSmall');
  
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <button style={{ 
        ...largeBtnStyles, 
        padding: '16px 32px',
        background: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        Large Button
      </button>
      
      <button style={{ 
        ...normalBtnStyles, 
        padding: '12px 24px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        Normal Button
      </button>
      
      <button style={{ 
        ...smallBtnStyles, 
        padding: '8px 16px',
        background: '#8b5cf6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}>
        Small Button
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 12: Code Block Typography
// ============================================================================

export const Example12_CodeBlock = () => {
  const codeStyles = getPresetStyles('code');
  
  return (
    <pre style={{
      ...codeStyles,
      background: '#1e1e1e',
      color: '#d4d4d4',
      padding: '16px',
      borderRadius: '8px',
      overflow: 'auto'
    }}>
      <code>
        {`const greeting = 'Hello, World!';
console.log(greeting);`}
      </code>
    </pre>
  );
};

// ============================================================================
// EXAMPLE 13: Combining Presets with Tailwind
// ============================================================================

export const Example13_WithTailwind = () => {
  const h2Styles = getPresetStyles('h2');
  const bodyStyles = getPresetStyles('bodyNormal');
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 
        className="mb-6 text-slate-900"
        style={h2Styles}
      >
        Combining Typography Config with Tailwind
      </h2>
      
      <p 
        className="mb-4 text-slate-600"
        style={bodyStyles}
      >
        You can use Tailwind for layout, spacing, and colors while using the typography config for consistent text styling.
      </p>
      
      <button 
        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        style={getPresetStyles('buttonLarge')}
      >
        Get Started
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 14: Form with Typography
// ============================================================================

export const Example14_FormTypography = () => {
  const labelStyles = {
    ...getPresetStyles('bodySmall'),
    color: '#374151',
    fontWeight: fontWeights.semibold,
    display: 'block',
    marginBottom: '8px'
  };
  
  const inputStyles = {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.base.value,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    width: '100%'
  };
  
  return (
    <form>
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyles}>
          Email Address
        </label>
        <input 
          type="email" 
          style={inputStyles}
          placeholder="you@example.com"
        />
      </div>
      
      <button 
        type="submit"
        style={{
          ...getPresetStyles('buttonLarge'),
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Subscribe
      </button>
    </form>
  );
};

// ============================================================================
// EXAMPLE 15: Accessible Link with Typography
// ============================================================================

export const Example15_AccessibleLink = () => {
  const linkStyles = {
    ...getPresetStyles('bodyNormal'),
    color: '#2563eb',
    textDecoration: 'underline',
    cursor: 'pointer'
  };
  
  return (
    <Link 
      href="/learn-more"
      style={linkStyles}
      aria-label="Learn more about our services"
    >
      Learn more about our services
    </Link>
  );
};

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export const AllExamples = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ ...getPresetStyles('h1'), color: '#1a1a1a', marginBottom: '40px' }}>
        UFC Font Typography Examples
      </h1>
      
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ ...getPresetStyles('h2'), color: '#1a1a1a', marginBottom: '20px' }}>
          Example 1: Using Presets
        </h2>
        <Example1_UsingPresets />
      </section>
      
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ ...getPresetStyles('h2'), color: '#1a1a1a', marginBottom: '20px' }}>
          Example 10: All Headings
        </h2>
        <Example10_AllHeadings />
      </section>
      
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ ...getPresetStyles('h2'), color: '#1a1a1a', marginBottom: '20px' }}>
          Example 11: Button Variants
        </h2>
        <Example11_ButtonVariants />
      </section>
      
      {/* Add more sections as needed */}
    </div>
  );
};

export default AllExamples;

