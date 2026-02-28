"use client";

import { Building2, FileCheck, MailOpen, MapPinned } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPresetStyles } from "@/config/ufc-font";

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

const importantLinks = [
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    name: "Terms and Conditions",
    href: "/terms-and-conditions",
  },
  {
    name: "Return Policy",
    href: "/return-policy",
  },
  {
    name: "Cookies Policy",
    href: "/cookies-policy",
  },
];

const companyDetails = [
  {
    name: "Company: DIGIARIA SP.Z.O.O",
    icon: Building2,
    ariaLabel: "Company name",
  },
  {
    name: "KRS: 0001189469",
    icon: FileCheck,
    ariaLabel: "Company registration number",
  },
  {
    name: "support@ufcaibot.com",
    icon: MailOpen,
    ariaLabel: "Email contact",
  },
  {
    name: `ul. JANA HEWELIUSZA, nr 11, lok. 819, GDAŃSK, 80-890, POLSKA`,
    icon: MapPinned,
    ariaLabel: "Business address",
  },
];

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';
  const footerHeadingStyles = getPresetStyles('footerHeading');
  const footerLinkStyles = getPresetStyles('footerLink');
  const footerTextStyles = getPresetStyles('footerText');

  return (
    <footer className="main-footer w-full bg-white">
      <div className="main-footer__top bg-white">
        <div className="px-4 bg-white max-w-[1350px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="flex items-start">
              <div className="footer-widget__column footer-widget__about">
                <div className="flex justify-start mb-6">
                  <Link href="/" className="inline-block logo-hover-effect" aria-label="UFC AI Bot Homepage">
                    <Image 
                      width={49} 
                      height={20} 
                      src="/logos/ufc-fighter-logo.png" 
                      alt="UFC Fighter Logo"
                    />
                  </Link>
                </div>
                <p 
                  className="footer-widget__about-text text-left"
                  style={{
                    ...footerTextStyles,
                    fontFamily: ufcHeadingFont,
                    textTransform: 'uppercase',
                    color: '#0f172a'
                  }}
                >
                  An AI sidekick that scans live odds, decodes fighter histories and news, and points your lineup toward the most likely winners
                </p>
              </div>
            </div>

            <div className="pt-6 md:pt-0">
              <div className="footer-widget__column footer-widget__company">
                <div className="footer-widget__title-box">
                  <h3 
                    className="footer-widget__title"
                    style={{
                      ...footerHeadingStyles,
                      fontFamily: ufcHeadingFont,
                      textTransform: 'uppercase',
                      color: '#0f172a'
                    }}
                  >Menu</h3>
                </div>
                <div className="footer-widget__resources-list-box">
                  <ul className="footer-widget__resources-list">
                    {routes.map((route) => (
                      <li key={route.name}>
                        <Link 
                          href={route.href}
                          aria-label={`Navigate to ${route.name} page`}
                          style={{
                            ...footerLinkStyles,
                            fontFamily: ufcHeadingFont,
                            textTransform: 'uppercase',
                            color: '#0f172a'
                          }}
                        >{route.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-6 xl:pt-0">
              <div className="footer-widget__column footer-widget__resources">
                <div className="footer-widget__title-box">
                  <h3 
                    className="footer-widget__title"
                    style={{
                      ...footerHeadingStyles,
                      fontFamily: ufcHeadingFont,
                      textTransform: 'uppercase',
                      color: '#0f172a'
                    }}
                  >Links</h3>
                </div>
                <div className="footer-widget__resources-list-box">
                  <ul className="footer-widget__resources-list">
                    {importantLinks.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href}
                          aria-label={`Read our ${link.name}`}
                          style={{
                            ...footerLinkStyles,
                            fontFamily: ufcHeadingFont,
                            textTransform: 'uppercase',
                            color: '#0f172a'
                          }}
                        >{link.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-6 xl:pt-0">
              <div className="footer-widget__column footer-widget__resources">
                <div className="footer-widget__title-box">
                  <h3 
                    className="footer-widget__title"
                    style={{
                      ...footerHeadingStyles,
                      fontFamily: ufcHeadingFont,
                      textTransform: 'uppercase',
                      color: '#0f172a'
                    }}
                  >Company</h3>
                </div>
                <div className="footer-widget__company-list-box">
                  <ul className="space-y-4">
                    {companyDetails.map((detail) => (
                      <li 
                        key={detail.name} 
                        className="flex text-sm items-start"
                        style={{
                          ...footerTextStyles,
                          fontFamily: ufcHeadingFont,
                          textTransform: 'uppercase',
                          color: '#0f172a'
                        }}
                      >
                        <detail.icon 
                          className="h-5 w-5 mr-3 min-w-fit flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" 
                          aria-label={detail.ariaLabel}
                          role="img"
                        />
                        <span>{detail.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-footer__bottom bg-white">
        <div className="flex justify-between items-center px-4 bg-white max-w-[1350px] mx-auto">
          <div className="">
            <p 
              className="text-center"
              style={{
                ...footerTextStyles,
                fontFamily: ufcHeadingFont,
                textTransform: 'uppercase',
                color: '#0f172a'
              }}
            >
              ufcaibot, Copyright © {year}. All Rights Reserved.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-center bg-white">
          <Image
            src="/cards_new.svg"
            alt="cards"
            width={300}
            height={100}
            className=""
          />
        </div>
      </div>

      <style jsx global>{`
        /* Logo hover effect - consistent with header */
        .logo-hover-effect {
          transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
          display: inline-block;
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
          .logo-hover-effect {
            transition: none;
          }
          
          .logo-hover-effect:hover,
          .logo-hover-effect:focus-visible {
            transform: none;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
