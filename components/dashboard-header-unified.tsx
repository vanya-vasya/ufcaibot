"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, ChevronDown } from "lucide-react";
import { GuestMobileSidebar } from "@/components/guest-mobile-sidebar";
import { UsageProgress } from "@/components/usage-progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fontSizes, fontWeights, lineHeights, letterSpacing } from "@/config/ufc-font";

const routes = [
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

interface DashboardHeaderUnifiedProps {
  initialUsedGenerations: number;
  initialAvailableGenerations: number;
}

const DashboardHeaderUnified = ({
  initialUsedGenerations,
  initialAvailableGenerations,
}: DashboardHeaderUnifiedProps) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';

  const handleSignOut = () => {
    signOut(() => router.push("/"));
  };

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-[1350px] items-center justify-between px-4 py-3">
        {/* Left — Logo */}
        <div className="flex items-center">
          <Link href="/dashboard" className="logo-hover-effect" aria-label="Go to dashboard">
            <Image
              width={49}
              height={20}
              src="/logos/ufc-fighter-logo.png"
              alt="UFC Fighter Logo"
            />
          </Link>
        </div>

        {/* Center — Navigation (desktop only) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="nav-container-light-green">
            {routes.map((route) => (
              <Link key={route.name} href={route.href} className="nav-link" tabIndex={0}>
                {route.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right — Credits + User Avatar (desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <UsageProgress
            initialUsedGenerations={initialUsedGenerations}
            initialAvailableGenerations={initialAvailableGenerations}
          />

          {/* User Avatar Dropdown */}
          {isLoaded && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="User menu"
                  className="flex items-center gap-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user?.imageUrl || "/images/avatar-fighter.png"}
                    alt={user?.fullName ?? "User avatar"}
                    width={36}
                    height={36}
                    className="rounded-full object-cover border-2 border-gray-200 w-9 h-9"
                  />
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-100 shadow-lg p-1">
                {/* User info */}
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.fullName ?? user?.firstName ?? "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>

                <DropdownMenuSeparator className="bg-gray-100" />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 cursor-pointer rounded-md hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Right — Credits + Avatar + Hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <UsageProgress
            initialUsedGenerations={initialUsedGenerations}
            initialAvailableGenerations={initialAvailableGenerations}
          />

          {isLoaded && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="User menu"
                  className="outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user?.imageUrl || "/images/avatar-fighter.png"}
                    alt={user?.fullName ?? "User avatar"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover border-2 border-gray-200 w-8 h-8"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52 bg-white border border-gray-100 shadow-lg p-1">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.fullName ?? user?.firstName ?? "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-gray-100" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 cursor-pointer rounded-md hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <GuestMobileSidebar />
        </div>
      </nav>

      <style jsx global>{`
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

        .nav-link:hover,
        .nav-link:focus-visible {
          transform: scale(1.075);
          text-decoration: none;
        }

        @media (max-width: 1024px) {
          .nav-container-light-green {
            display: none;
          }
        }

        @media (min-width: 1024px) {
          .nav-container-light-green {
            gap: 8px;
          }
          .nav-link {
            margin: 0 4px;
          }
        }

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

        @media (prefers-reduced-motion: reduce) {
          .logo-hover-effect,
          .nav-link {
            transition: none;
          }
          .logo-hover-effect:hover,
          .logo-hover-effect:focus-visible,
          .nav-link:hover,
          .nav-link:focus-visible {
            transform: none;
          }
        }
      `}</style>
    </header>
  );
};

export default DashboardHeaderUnified;
