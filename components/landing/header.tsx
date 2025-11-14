"use client";
import Link from "next/link";
// DISABLED FOR LOCAL DESIGN WORK - Re-enable for production
// import { SignedIn, SignedOut } from "@clerk/nextjs";
import { GuestMobileSidebar } from "@/components/guest-mobile-sidebar";
import Image from "next/image";
import { motion } from "framer-motion";
import { fontSizes, fontWeights, lineHeights, letterSpacing } from "@/config/ufc-font";

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

const Header = () => {
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-center p-3 lg:px-6 relative">
        {/* Left Navigation - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex absolute left-0 lg:left-6">
          <div className="nav-container-light-green">
            {routes.map((route) => (
              <Link
                key={route.name}
                href={route.href}
                className="nav-link"
              >
                {route.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Centered Logo */}
        <div className="flex items-center justify-center">
          <Link href="/" className="-m-1.5 p-1.5 logo-hover-effect">
            <Image width={"49"} height={"20"} src="/logos/ufc-fighter-logo.png" alt="UFC Fighter Logo"/>
          </Link>
        </div>

        {/* Right Side - Begin Button */}
        <div className="hidden lg:flex absolute right-0 lg:right-6">
          <div className="flex">
            <ul className="main-header__login-sing-up">
              <li>
                {/* DISABLED FOR LOCAL DESIGN WORK - Showing "Begin" button for all users */}
                {/* <SignedIn>...</SignedIn> <SignedOut>...</SignedOut> */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="nav-container-green">
                    <Link
                      href="/dashboard"
                      className="nav-link"
                    >
                      Begin
                    </Link>
                  </div>
                </motion.div>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Menu - Always visible on mobile */}
        <div className="lg:hidden absolute right-3">
          <GuestMobileSidebar />
        </div>
      </nav>

      <style jsx global>{`
        .nav-container {
          display: flex;
          background-color: #f8fafc;
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .nav-container-green {
          display: flex;
          background-color: transparent;
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .nav-container-light-green {
          display: flex;
          background-color: transparent;
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .nav-link {
          font-family: ${ufcHeadingFont};
          font-weight: ${fontWeights.bold};
          font-size: ${fontSizes.base.value};
          line-height: ${lineHeights.snug};
          letter-spacing: ${letterSpacing.normal};
          text-transform: uppercase;
          color: #000000;
          padding: 8px 16px;
          border-radius: 9999px;
          transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .main-header__login-sing-up .nav-link {
          font-family: ${ufcHeadingFont} !important;
          font-weight: ${fontWeights.bold} !important;
          font-size: ${fontSizes.base.value} !important;
          line-height: ${lineHeights.snug} !important;
          letter-spacing: ${letterSpacing.normal} !important;
          text-transform: uppercase !important;
          color: #000000 !important;
          padding: 8px 16px !important;
          border-radius: 9999px !important;
          border: none !important;
        }

        .nav-link:hover,
        .nav-link:focus-visible {
          transform: scale(1.075);
          text-decoration: none;
        }

        /* Ensure dropdown trigger inherits nav-link hover styles */
        button.nav-link:hover,
        button.nav-link:focus-visible,
        button.nav-link[data-state="open"] {
          transform: scale(1.075);
          text-decoration: none;
        }

        /* Dropdown menu item styling - solid black text, scale on hover */
        .dropdown-menu-item {
          font-family: ${ufcHeadingFont};
          font-weight: ${fontWeights.bold};
          font-size: ${fontSizes.base.value};
          line-height: ${lineHeights.snug};
          letter-spacing: ${letterSpacing.normal};
          text-transform: uppercase;
          color: #000000 !important;
          padding: 10px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        /* Override any inherited or conflicting text colors */
        .dropdown-menu-item *,
        .dropdown-menu-item span {
          color: inherit;
        }

        .dropdown-menu-item:hover,
        .dropdown-menu-item:focus-visible,
        .dropdown-menu-item:active {
          transform: scale(1.075);
          text-decoration: none;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .nav-container-light-green {
            display: none;
          }
          
          /* Ensure mobile layout is properly centered */
          nav {
            padding-left: 12px;
            padding-right: 12px;
          }
        }

        /* Additional spacing for desktop layout */
        @media (min-width: 1024px) {
          .nav-container-light-green {
            gap: 8px;
          }
          
          /* Ensure proper spacing between navigation elements */
          .nav-link {
            margin: 0 4px;
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
          .logo-hover-effect:focus-visible,
          .nav-link:hover,
          .nav-link:focus-visible,
          button.nav-link:hover,
          button.nav-link:focus-visible,
          button.nav-link[data-state="open"],
          .dropdown-menu-item:hover,
          .dropdown-menu-item:focus-visible,
          .dropdown-menu-item:active {
            transform: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .dropdown-menu-item {
            color: #f1f5f9;
          }
        }

      `}</style>
    </header>
  );
};

export default Header;
