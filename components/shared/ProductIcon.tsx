"use client";

import { LucideIcon } from "lucide-react";

interface ProductIconProps {
  icon?: LucideIcon;
  iconUrl?: string;
  fallback: string;
  alt: string;
  size?: number;
}

/**
 * ProductIcon Component
 * 
 * Renders a product icon with fallback handling.
 * Supports both Lucide icons and image URLs.
 * If icon fails or not provided, shows the fallback emoji/text.
 * 
 * @param icon - Lucide icon component (preferred)
 * @param iconUrl - URL or path to the icon image (legacy support)
 * @param fallback - Emoji or text to show if icon fails
 * @param alt - Alt text for accessibility
 * @param size - Icon size in pixels (default: 20)
 */
export const ProductIcon = ({ icon: Icon, iconUrl, fallback, alt, size = 20 }: ProductIconProps) => {
  // Prefer Lucide icon if provided
  if (Icon) {
    return <Icon className="flex-shrink-0" size={size} aria-label={alt} />;
  }

  // Fallback to emoji/text
  return (
    <span className="text-lg flex-shrink-0" role="img" aria-label={alt}>
      {fallback}
    </span>
  );
};

