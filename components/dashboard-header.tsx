"use client";
import Link from "next/link";
import Image from "next/image";
import { GuestMobileSidebar } from "@/components/guest-mobile-sidebar";
import { UsageProgress } from "@/components/usage-progress";
import { UserButton } from "@clerk/nextjs";

const routes = [
  {
    name: "Our Story",
    href: "/story",
  },
  {
    name: "Pricing",
    href: "/#pricing",
  },
  {
    name: "FAQ",
    href: "/faq",
  },
  {
    name: "Blog",
    href: "/blog",
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-6 gap-1">
        <div className="flex">
          <Link href="/dashboard" className="-m-1.5 p-1.5">
            <Image width={98} height={39} src="/logos/yum-mi-onigiri-logo.png" alt="Yum-mi Logo"/>
          </Link>
        </div>
        <div className="flex gap-x-12 ml-12">
          <div className="nav-container-light-green">
            <Link
              href="/#products"
              className="nav-link"
            >
              Products
            </Link>
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
        <div className="flex lg:flex-1 lg:justify-end">
          <div className="flex items-center space-x-4">
            <div className="hidden md:block w-[220px]">
              <UsageProgress
                initialUsedGenerations={initialUsedGenerations}
                initialAvailableGenerations={initialAvailableGenerations}
              />
            </div>
            <div className="rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-filter backdrop-blur-sm">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
          <GuestMobileSidebar />
        </div>
      </nav>

      <style jsx global>{`
        :root {
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
          font-family: var(--contact-font);
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

        .main-header__login-sing-up .nav-link {
          font-family: var(--contact-font) !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          line-height: 1.1 !important;
          letter-spacing: 0.01em !important;
          text-transform: none !important;
          color: #0f172a !important;
          padding: 8px 16px !important;
          border-radius: 9999px !important;
          border: none !important;
        }

        .nav-link:hover {
          background: linear-gradient(to right, #10b981, #059669, #047857);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-decoration: none;
        }

      `}</style>
    </header>
  );
};

export default DashboardHeader;

