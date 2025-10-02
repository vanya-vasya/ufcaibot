import { UserButton } from "@clerk/nextjs";
import {
  getApiUsedGenerations,
  getApiAvailableGenerations,
} from "@/lib/api-limit";
import { UsageProgress } from "@/components/usage-progress";
import { AnimatedLayout, AnimatedPage } from "@/components/animated-layout";
import Link from "next/link";
import Image from "next/image";
import { GuestMobileSidebar } from "@/components/guest-mobile-sidebar";

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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiUsedGenerations = await getApiUsedGenerations();
  const apiAvailableGenerations = await getApiAvailableGenerations();

  return (
    <div className="h-auto relative min-h-screen bg-white">

      <AnimatedLayout>
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
                    initialUsedGenerations={apiUsedGenerations}
                    initialAvailableGenerations={apiAvailableGenerations}
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
      </AnimatedLayout>

      <main className="flex-1 py-12 lg:pt-16 relative z-10">
        <div className="container py-8 md:py-10">
          <AnimatedPage>{children}</AnimatedPage>
        </div>
      </main>

      <footer className="py-6 border-t border-gray-200 bg-white">
        <div className="container">
          <div className="px-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: 1.2,
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: '#0f172a'
              }}
            >
            QUICK FIT LTD (№15995367) <br /> Email: support@yum-mi.com{" "}
              <br />
              DEPT 2, 43 OWSTON ROAD, CARCROFT, DONCASTER, UNITED KINGDOM, DN6 8DA, <br />
              Copyright © {new Date().getFullYear()}. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="/privacy-policy" 
                className="hover:text-indigo-600"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#0f172a'
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="hover:text-indigo-600"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#0f172a'
                }}
              >
                Terms and Conditions
              </Link>
              <Link 
                href="/return-policy" 
                className="hover:text-indigo-600"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#0f172a'
                }}
              >
                Return Policy
              </Link>
              <Link 
                href="/cookies-policy" 
                className="hover:text-indigo-600"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: 1.2,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#0f172a'
                }}
              >
                Cookies Policy
              </Link>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Image src="/cards_new.svg" alt="cards" width={300} height={100} />
          </div>
        </div>
      </footer>
    </div>
  );
}
