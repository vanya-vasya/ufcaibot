/**
 * Product Navigation Configuration
 * 
 * This file contains shared configuration for product navigation items,
 * including icons, labels, and routes. Uses Lucide icons for consistency.
 * 
 * To extend with new items:
 * 1. Add a new entry to the PRODUCT_ITEMS array
 * 2. Import the Lucide icon and add to icon property
 * 3. Provide iconFallback emoji as backup
 * 4. Specify the href with appropriate toolId parameter
 * 
 * Icon Sources:
 * - Crown: master-chef tool
 * - Activity: master-nutritionist tool
 * - Target: cal-tracker tool
 */

import { Crown, Activity, Target, LucideIcon } from "lucide-react";

export interface ProductNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon; // Lucide icon component
  iconUrl?: string; // Legacy support for image paths
  iconFallback: string; // Emoji or text fallback if icon fails to load
  description?: string;
}

export const PRODUCT_ITEMS: ProductNavigationItem[] = [
  {
    label: "Your Own Chef",
    href: "/dashboard/conversation?toolId=master-chef",
    icon: Crown,
    iconFallback: "👨‍🍳",
    description: "Get personalized recipes and cooking guidance"
  },
  {
    label: "Your Own Nutritionist",
    href: "/dashboard/conversation?toolId=master-nutritionist",
    icon: Activity,
    iconFallback: "🥗",
    description: "Receive expert nutritional advice and meal plans"
  },
  {
    label: "Your Own Tracker",
    href: "/dashboard/conversation?toolId=cal-tracker",
    icon: Target,
    iconFallback: "📊",
    description: "Track calories and nutritional intake"
  }
];

/**
 * Shared navigation typography styles
 * These styles are used consistently across header and dropdown components
 */
export const NAV_TYPOGRAPHY = {
  fontFamily: "var(--header-font-family)",
  fontWeight: 600,
  fontSize: "var(--header-font-size)",
  lineHeight: "1.1",
  letterSpacing: "0.01em",
  textTransform: "none" as const,
  color: "var(--header-text-color)",
} as const;

export const NAV_HOVER_GRADIENT = "linear-gradient(to right, #10b981, #059669, #047857)";

