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
    name: "Company: QUICK FIT LTD",
    icon: Building2,
    ariaLabel: "Company name",
  },
  {
    name: "Company Number: 15995367",
    icon: FileCheck,
    ariaLabel: "Company registration number",
  },
  {
    name: "support@ufcaibot.com",
    icon: MailOpen,
    ariaLabel: "Email contact",
  },
  {
    name: `DEPT 2, 43 OWSTON ROAD, CARCROFT, DONCASTER, UNITED KINGDOM, DN6 8DA`,
    icon: MapPinned,
    ariaLabel: "Business address",
  },
];

const Footer = () => {
  const date = new Date();
  let year = date.getFullYear();
  
  const ufcHeadingFont = '"UFC Sans Condensed", "Arial Narrow", Arial, sans-serif';
  const footerHeadingStyles = getPresetStyles('footerHeading');
  const footerLinkStyles = getPresetStyles('footerLink');
  const footerTextStyles = getPresetStyles('footerText');

  return (
    <footer className="main-footer w-full bg-white">
      <div className="main-footer__top bg-white">
        <div className="px-4 bg-white max-w-[1350px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="pr-4 pl-4 flex items-center">
              <div className="footer-widget__column footer-widget__about">
                <div className="flex justify-center mb-6">
                  <Link href="/" className="inline-block" aria-label="UFC AI Bot Homepage">
                    <Image 
                      width={49} 
                      height={20} 
                      src="/logos/ufc-fighter-logo.png" 
                      alt="UFC Fighter Logo"
                      className="transition-transform duration-200 hover:scale-110 focus-visible:scale-110"
                    />
                  </Link>
                </div>
                <p 
                  className="footer-widget__about-text text-center"
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

            <div className="pr-4 pl-4 pt-6 md:pt-0">
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
            <div className="pr-4 pl-4 pt-6 xl:pt-0">
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
            <div className="pr-4 pl-4 pt-6 xl:pt-0">
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
    </footer>
  );
};

export default Footer;
