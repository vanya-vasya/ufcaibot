"use client";

import { useEffect, useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const routes = [
  {
    label: "Our Story",
    href: "/story",
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const productRoutes = [
  {
    label: "Your Own Chef",
    href: "/dashboard/conversation?toolId=master-chef",
  },
  {
    label: "Your Own Nutritionist",
    href: "/dashboard/conversation?toolId=master-nutritionist",
  },
  {
    label: "Your Own Tracker",
    href: "/dashboard/conversation?toolId=cal-tracker",
  },
];

export const GuestMobileSidebar = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button variant="sidebar" size="icon" className="lg:hidden text-green-600">
        <Menu stroke="currentColor" />
      </Button>
    </SheetTrigger>
      <SheetContent side="left" className="p-0 border-r-0">
        <div className="space-y-4 py-6 px-6 flex flex-col h-full bg-white sm:ring-1 sm:ring-[#3c3c77] text-white border-none">
          <div className="px-3 py-2 flex-1">
            <Link href="/dashboard" className="flex items-center pl-3 mb-14">
              <Image width={"150"} height={"60"} className="mr-4" alt="Yum-mi Logo" src="/logos/yum-mi-onigiri-logo.png" />
            </Link>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Collapsible open={isProductsOpen} onOpenChange={setIsProductsOpen}>
                    <CollapsibleTrigger className="-mx-3 w-full text-left block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#a1aac9] hover:text-white">
                      <div className="flex items-center justify-between">
                        <span>Products</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 space-y-2 mt-2">
                      {productRoutes.map((product) => (
                        <Link
                          key={product.href}
                          href={product.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium leading-7 text-[#a1aac9] hover:text-white"
                        >
                          {product.label}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                  
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#a1aac9] hover:text-white"
                    >
                      <div className="flex items-center flex-1">
                        {route.label}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                <SignedIn>
                <Link 
                  href="/dashboard"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#a1aac9] hover:text-white"
                >
                  Dashboard
                </Link>
                </SignedIn>
                <SignedOut>
                <Link 
                  href="/dashboard"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-[#a1aac9] hover:text-white"
                >
                  Sign In / Sign Up
                </Link>
                </SignedOut>
              </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
