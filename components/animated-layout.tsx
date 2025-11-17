"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * AnimatedLayout - Wraps header with animation
 * 
 * Note: This component wraps the DashboardHeader with motion animations.
 * It uses a <motion.div> instead of <motion.header> to avoid nested headers,
 * since DashboardHeader already has its own <header> tag.
 */
export function AnimatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </>
  );
}

export function AnimatedPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
