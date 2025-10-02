/**
 * Product Navigation Configuration
 * 
 * This file contains shared configuration for product navigation items,
 * including icons, labels, and routes. Icons are loaded from URLs or paths.
 * 
 * To extend with new items:
 * 1. Add a new entry to the PRODUCT_ITEMS array
 * 2. Include iconUrl (relative path from /public or absolute URL)
 * 3. Provide iconFallback emoji as backup if image fails
 * 4. Specify the href with appropriate toolId parameter
 * 
 * Icon URL Sources:
 * - Icons can be from /public/assets/icons/ (relative paths)
 * - External URLs (https://...)
 * - Or use iconFallback emoji if no custom icon available
 */

export interface ProductNavigationItem {
  label: string;
  href: string;
  iconUrl?: string; // Path to icon image (from /public or absolute URL)
  iconFallback: string; // Emoji or text fallback if icon fails to load
  description?: string;
}

export const PRODUCT_ITEMS: ProductNavigationItem[] = [
  {
    label: "Your Own Chef",
    href: "/dashboard/conversation?toolId=master-chef",
    iconUrl: "/assets/icons/home.svg", // Using existing icon as placeholder
    iconFallback: "👨‍🍳",
    description: "Get personalized recipes and cooking guidance"
  },
  {
    label: "Your Own Nutritionist",
    href: "/dashboard/conversation?toolId=master-nutritionist",
    iconUrl: "/assets/icons/stars.svg", // Using existing icon as placeholder
    iconFallback: "🥗",
    description: "Receive expert nutritional advice and meal plans"
  },
  {
    label: "Your Own Tracker",
    href: "/dashboard/conversation?toolId=cal-tracker",
    iconUrl: "/assets/icons/coins.svg", // Using existing icon as placeholder
    iconFallback: "📊",
    description: "Track calories and nutritional intake"
  }
];

/**
 * Shared navigation typography styles
 * These styles are used consistently across header and dropdown components
 */
export const NAV_TYPOGRAPHY = {
  fontFamily: "var(--nav-font)",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "1.1",
  letterSpacing: "0.01em",
  textTransform: "none" as const,
  color: "#0f172a",
} as const;

export const NAV_HOVER_GRADIENT = "linear-gradient(to right, #10b981, #059669, #047857)";

