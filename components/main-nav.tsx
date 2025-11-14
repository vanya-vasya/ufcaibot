"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  CreditCard,
} from "lucide-react";
import Image from "next/image";



export function MainNav({
  initialUsedGenerations,
  initialAvailableGenerations,
}: {
  initialUsedGenerations: number;
  initialAvailableGenerations: number;
}) {
  return (
    <div className="flex items-center justify-between w-full bg-white">
      <div className="flex items-center gap-8">
        <Link
          href="/dashboard"
          className="hidden items-center space-x-2 md:flex"
        >
          <Image src="/logos/ufc-fighter-logo.png" alt="UFC Fighter Logo" width={49} height={20} />
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="nav-container">
            <NavigationMenuItem>
              <Link href={"/dashboard/billing/payment-history"}>
                <div className="nav-link cursor-pointer group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 group bg-transparent">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payments
                </div>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <style jsx global>{`
        .nav-container {
          display: flex;
          background-color: #f8fafc;
          border-radius: 9999px;
          padding: 4px;
          gap: 4px;
        }

        .nav-link {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 16px;
          line-height: 1.1;
          letter-spacing: 0.01em;
          text-transform: none;
          color: #0f172a;
          padding: 8px 16px;
          border-radius: 9999px;
          transition: all 500ms ease-in-out;
        }

        .nav-link:hover {
          background: linear-gradient(to right, #10b981, #059669, #047857);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}

