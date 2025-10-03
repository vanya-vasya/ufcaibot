"use client";

import { useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PRODUCT_ITEMS } from "@/constants/product-navigation";
import { ProductIcon } from "@/components/shared/ProductIcon";

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
        <div className="space-y-4 py-6 px-6 flex flex-col h-full bg-white border-r border-green-100 shadow-lg">
          <div className="px-3 py-2 flex-1">
            <Link href="/dashboard" className="flex items-center pl-3 mb-14">
              <Image width={"150"} height={"60"} className="mr-4" alt="Yum-mi Logo" src="/logos/yum-mi-onigiri-logo.png" />
            </Link>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-100">
                <div className="space-y-2 py-6">
                  <Collapsible open={isProductsOpen} onOpenChange={setIsProductsOpen}>
                    <CollapsibleTrigger className="mobile-nav-link -mx-3 w-full text-left block rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span>Products</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 space-y-2 mt-2">
                      {PRODUCT_ITEMS.map((product) => (
                        <Link
                          key={product.href}
                          href={product.href}
                          className="mobile-nav-link flex items-center gap-3 rounded-lg px-3 py-2"
                        >
                          <ProductIcon 
                            icon={product.icon}
                            iconUrl={product.iconUrl}
                            fallback={product.iconFallback}
                            alt={product.label}
                            size={20}
                          />
                          <span>{product.label}</span>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                  
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className="mobile-nav-link -mx-3 block rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center flex-1">
                        {route.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
      <style jsx global>{`
        .mobile-nav-link {
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-weight: 600;
          font-size: 16px;
          line-height: 1.1;
          letter-spacing: 0.01em;
          text-transform: none;
          color: #000000;
          transition: all 500ms ease-in-out;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link:focus-visible,
        .mobile-nav-link:active {
          background: linear-gradient(to right, #10b981, #059669, #047857);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-decoration: none;
        }
      `}</style>
    </Sheet>
  );
};
