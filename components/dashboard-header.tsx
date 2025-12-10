"use client";
import Link from "next/link";
import Image from "next/image";
import { GuestMobileSidebar } from "@/components/guest-mobile-sidebar";
import { UsageProgress } from "@/components/usage-progress";
// DISABLED FOR LOCAL DESIGN WORK - Re-enable for production
// import { UserButton } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageIcon, Wand2, Eraser, Palette, Layers, Image as ImageRestore } from "lucide-react";

// Product navigation items
const PRODUCT_ITEMS = [
  {
    label: "Image Generation",
    href: "/dashboard/image-generation",
    icon: ImageIcon,
    iconUrl: null,
    iconFallback: "IG"
  },
  {
    label: "Image Restore",
    href: "/dashboard/image-restore",
    icon: ImageRestore,
    iconUrl: null,
    iconFallback: "IR"
  },
  {
    label: "Background Removal",
    href: "/dashboard/image-background-removal",
    icon: Layers,
    iconUrl: null,
    iconFallback: "BR"
  },
  {
    label: "Object Remove",
    href: "/dashboard/image-object-remove",
    icon: Eraser,
    iconUrl: null,
    iconFallback: "OR"
  },
  {
    label: "Object Recolor",
    href: "/dashboard/image-object-recolor",
    icon: Palette,
    iconUrl: null,
    iconFallback: "OC"
  },
  {
    label: "Generative Fill",
    href: "/dashboard/image-generative-fill",
    icon: Wand2,
    iconUrl: null,
    iconFallback: "GF"
  },
];

const routes = [
  {
    name: "Pricing",
    href: "/#pricing",
  },
  {
    name: "FAQ",
    href: "/faq",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

interface DashboardHeaderProps {
  initialUsedGenerations: number;
  initialAvailableGenerations: number;
}

const DashboardHeader = ({ initialUsedGenerations, initialAvailableGenerations }: DashboardHeaderProps) => {
  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-[1350px] items-center justify-between px-4 py-3">
        {/* Left - Logo (aligned with footer) */}
        <div className="flex items-center">
          <Link href="/dashboard" className="-m-1.5 p-1.5 logo-hover-effect" aria-label="Go to dashboard">
            <Image width={49} height={20} src="/logos/ufc-fighter-logo.png" alt="UFC Fighter Logo"/>
          </Link>
        </div>

        {/* Center Navigation - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="nav-container-light-green">
            <Link
              href="/"
              className="nav-link"
              tabIndex={0}
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center gap-1 outline-none">
                Products
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="bg-white border border-green-100 shadow-lg min-w-[240px] p-1"
              >
                {PRODUCT_ITEMS.map((product) => {
                  const Icon = product.icon;
                  return (
                    <DropdownMenuItem 
                      key={product.href} 
                      asChild
                      className="focus:bg-transparent focus:text-inherit hover:bg-transparent data-[highlighted]:bg-transparent"
                    >
                      <Link 
                        href={product.href}
                        className="dropdown-menu-item flex items-center gap-3 w-full"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1">{product.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            {routes.map((route) => (
              <Link
                key={route.name}
                href={route.href}
                className="nav-link"
                tabIndex={0}
              >
                {route.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side - Usage Progress & User */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="w-[220px]">
            <UsageProgress
              initialUsedGenerations={initialUsedGenerations}
              initialAvailableGenerations={initialAvailableGenerations}
            />
          </div>
          {/* DISABLED FOR LOCAL DESIGN WORK - UserButton replaced with placeholder */}
          {/* <UserButton afterSignOutUrl="/" /> */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center" aria-label="User profile">
            <span className="text-xs font-bold text-gray-600">U</span>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-2">
          <GuestMobileSidebar />
        </div>
      </nav>

      <style jsx global>{`
        :root {
          --header-font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          --header-font-size: 16px;
          --header-text-color: #000000;
          --nav-font: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          --contact-font: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .nav-container {
          display: flex;
          background-color: #f8fafc;
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .nav-container-green {
          display: flex;
          background-color: #86efac;
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .nav-container-light-green {
          display: flex;
          background-color: #dcfce7;
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .nav-link {
          font-family: var(--header-font-family);
          font-weight: 600;
          font-size: var(--header-font-size);
          line-height: 1.1;
          letter-spacing: 0.01em;
          text-transform: none;
          color: var(--header-text-color);
          padding: 8px 16px;
          border-radius: 9999px;
          transition: all 500ms ease-in-out;
        }

        .main-header__login-sing-up .nav-link {
          font-family: var(--header-font-family) !important;
          font-weight: 600 !important;
          font-size: var(--header-font-size) !important;
          line-height: 1.1 !important;
          letter-spacing: 0.01em !important;
          text-transform: none !important;
          color: var(--header-text-color) !important;
          padding: 8px 16px !important;
          border-radius: 9999px !important;
          border: none !important;
        }

        .nav-link:hover,
        .nav-link:focus-visible {
          background: linear-gradient(to right, #10b981, #059669, #047857);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-decoration: none;
        }

        /* Ensure dropdown trigger inherits nav-link hover styles */
        button.nav-link:hover,
        button.nav-link:focus-visible,
        button.nav-link[data-state="open"] {
          background: linear-gradient(to right, #10b981, #059669, #047857);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-decoration: none;
        }

        /* Dropdown menu item styling - solid black text, green gradient on hover */
        .dropdown-menu-item {
          font-family: var(--header-font-family);
          font-weight: 600;
          font-size: var(--header-font-size);
          line-height: 1.1;
          letter-spacing: 0.01em;
          text-transform: none;
          color: #000000 !important;
          padding: 10px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: all 500ms ease-in-out;
        }

        /* Override any inherited or conflicting text colors */
        .dropdown-menu-item *,
        .dropdown-menu-item span {
          color: inherit;
        }

        .dropdown-menu-item:hover,
        .dropdown-menu-item:focus-visible,
        .dropdown-menu-item:active {
          background: linear-gradient(to right, #10b981, #059669, #047857) !important;
          background-clip: text !important;
          -webkit-background-clip: text !important;
          color: transparent !important;
          text-decoration: none;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .nav-container-light-green {
            display: none;
          }
        }

        /* Logo hover effect - GPU accelerated with accessibility support */
        .logo-hover-effect {
          transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .logo-hover-effect:hover {
          transform: scale(1.075);
        }

        .logo-hover-effect:focus-visible {
          transform: scale(1.075);
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .logo-hover-effect,
          .nav-link,
          .dropdown-menu-item {
            transition: none;
          }
          
          .logo-hover-effect:hover,
          .logo-hover-effect:focus-visible {
            transform: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .dropdown-menu-item {
            color: #f1f5f9;
          }
        }

        /* Complete removal of all UserButton hover effects */
        /* Remove all visual changes on hover/focus/active states */
        .cl-userButtonTrigger,
        .cl-userButtonTrigger:hover,
        .cl-userButtonTrigger:focus,
        .cl-userButtonTrigger:active,
        .cl-userButtonTrigger:focus-visible {
          background-color: transparent !important;
          background: transparent !important;
          box-shadow: none !important;
          transform: none !important;
          scale: 1 !important;
          opacity: 1 !important;
          filter: none !important;
          outline: none !important;
          border: none !important;
          transition: none !important;
          cursor: pointer !important;
        }

        /* Remove hover effects from UserButton container */
        .cl-userButtonBox,
        .cl-userButtonBox:hover,
        .cl-userButtonBox:focus,
        .cl-userButtonBox:active {
          background-color: transparent !important;
          background: transparent !important;
          box-shadow: none !important;
          transform: none !important;
          transition: none !important;
        }

        /* Remove hover effects from Clerk data attributes */
        [data-clerk-element="userButton"],
        [data-clerk-element="userButton"]:hover,
        [data-clerk-element="userButton"]:focus,
        [data-clerk-element="userButton"]:active {
          background-color: transparent !important;
          background: transparent !important;
          box-shadow: none !important;
          transform: none !important;
          transition: none !important;
        }

        /* Remove hover effects from avatar image */
        .cl-userButtonAvatarBox,
        .cl-userButtonAvatarBox:hover,
        .cl-userButtonAvatarBox img,
        .cl-userButtonAvatarBox:hover img {
          transform: none !important;
          scale: 1 !important;
          filter: none !important;
          opacity: 1 !important;
          transition: none !important;
        }

        /* Ensure no hover effects on any Clerk user button elements */
        [class*="cl-userButton"]:hover,
        [class*="cl-userButton"]:focus,
        [class*="cl-userButton"]:active {
          background-color: transparent !important;
          background: transparent !important;
          box-shadow: none !important;
          transform: none !important;
          transition: none !important;
        }

      `}</style>
    </header>
  );
};

export default DashboardHeader;

