"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductIconProps {
  iconUrl?: string;
  fallback: string;
  alt: string;
  size?: number;
}

/**
 * ProductIcon Component
 * 
 * Renders a product icon with fallback handling.
 * If the icon fails to load or no iconUrl is provided, shows the fallback emoji/text.
 * 
 * @param iconUrl - URL or path to the icon image
 * @param fallback - Emoji or text to show if icon fails
 * @param alt - Alt text for accessibility
 * @param size - Icon size in pixels (default: 20)
 */
export const ProductIcon = ({ iconUrl, fallback, alt, size = 20 }: ProductIconProps) => {
  const [hasError, setHasError] = useState(false);

  if (!iconUrl || hasError) {
    return (
      <span className="text-lg flex-shrink-0" role="img" aria-label={alt}>
        {fallback}
      </span>
    );
  }

  return (
    <Image
      src={iconUrl}
      alt={alt}
      width={size}
      height={size}
      className="flex-shrink-0"
      onError={() => setHasError(true)}
    />
  );
};

