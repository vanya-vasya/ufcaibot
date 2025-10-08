"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";

export const MobileSidebar = ({
  apiAvailableGenerations = 0,
  apiUsedGenerations = 0,
}: {
  apiAvailableGenerations: number;
  apiUsedGenerations: number;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-close menu when route changes (client-side navigation)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Store original padding to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <Menu className="text-green-600" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="p-0 border-r-0"
        aria-label="Mobile sidebar navigation"
      >
        <Sidebar
          apiAvailableGenerations={apiAvailableGenerations}
          apiUsedGenerations={apiUsedGenerations}
        />
      </SheetContent>
    </Sheet>
  );
};
