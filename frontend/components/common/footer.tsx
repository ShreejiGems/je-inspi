"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { garamond } from "@/src/common/helper";

const Footer = () => {
  const socialMediaLinks: { src: string; href: string }[] = [];

  return (
    <div
      className={`relative w-full overflow-hidden bg-brand-50 ${garamond.className}`}
    >
      {/* Decorative Left SVG */}
      <div className="absolute left-0 bottom-0 z-20 opacity-40 sm:opacity-100">
        <Image
          src="/assets/home/FOOTER 1.svg"
          width={280}
          height={280}
          alt="Footer Decoration Left"
          className="w-[150px] sm:w-[220px] md:w-[280px] h-auto md:block hidden grayscale opacity-40"
          priority
        />
      </div>

      {/* Decorative Right SVG */}
      <div className="absolute right-0 bottom-0 z-20 opacity-40 sm:opacity-100">
        <Image
          src="/assets/home/FOOTER 2.svg"
          width={320}
          height={500}
          alt="Footer Decoration Right"
          className="w-[320px] sm:w-[260px] md:w-[350px] h-auto grayscale opacity-40"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="relative z-30 flex flex-col items-center py-14 sm:py-20 px-4">
        {/* Background Blur Box */}
        <div className="rounded-2xl w-full max-w-5xl px-2 sm:px-12 py-10 sm:py-16">
          {/* Grid Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-10 text-brand-900">
            {/* Discover */}
            <div className="flex flex-col text-start">
              <p className="font-semibold text-[18px] md:text-[22px] mb-4 text-brand-900">
                Discover
              </p>
              {[
                { label: "About Us", link: "/about-us" },
                { label: "Jewellery", link: "/jewellery" },
                { label: "Diamonds", link: "/diamond" },
                { label: "Fashion", link: "/fashion" },
                { label: "Customized", link: "/diamond/custom" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.link}
                  className="text-[14px] md:text-[16px] cursor-pointer hover:text-brand-700 transition mb-2 block"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Resources */}
            <div className="flex flex-col text-start">
              <p className="font-semibold text-[18px] md:text-[22px] mb-4 text-brand-900">
                Resources
              </p>
              <Link
                href="/contact-us"
                className="text-[14px] md:text-[16px] cursor-pointer hover:text-brand-700 transition mb-2 block"
              >
                Contact Us
              </Link>
              <Link
                href="/contact-us#events-section"
                className="text-[14px] md:text-[16px] cursor-pointer hover:text-brand-700 transition mb-2 block"
                onClick={(e) => {
                  // Only handle smooth scroll if we're already on the contact-us page
                  if (window.location.pathname === '/contact-us' && !e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    const el = document.getElementById("events-section");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }
                }}
              >
                Events
              </Link>
              <Link
                href="/contact-us#catalogue-section"
                className="text-[14px] md:text-[16px] cursor-pointer hover:text-brand-700 transition mb-2 block"
                onClick={(e) => {
                  // Only handle smooth scroll if we're already on the contact-us page
                  if (window.location.pathname === '/contact-us' && !e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    const el = document.getElementById("catalogue-section");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }
                }}
              >
                Catalogue
              </Link>
              <Link
                href="/contact-us#faq-section"
                className="text-[14px] md:text-[16px] cursor-pointer hover:text-brand-700 transition mb-2 block"
                onClick={(e) => {
                  // Only handle smooth scroll if we're already on the contact-us page
                  if (window.location.pathname === '/contact-us' && !e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    const el = document.getElementById("faq-section");
                    if (el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }
                }}
              >
                FAQs
              </Link>
            </div>

            {/* Legal */}
            <div className="flex flex-col text-start">
              <p className="font-semibold text-[18px] md:text-[22px] mb-4 text-brand-900">
                Legal
              </p>

              {[
                {
                  label: "Terms of Use",
                  link: "/assets/about-us/LEGAL Shreeji Gems Terms of Use.docx.pdf",
                  router: "/terms-of-use",
                },
                {
                  label: "Conditions Of Sale",
                  link: "/assets/about-us/LEGAL Shreeji Gems Conditions Of Sale.docx.pdf",
                  router: "/conditions-of-sale",
                },
                {
                  label: "Privacy Policy",
                  link: "/assets/about-us/LEGAL Shreeji Gems Privacy And Cookie Policy.docx.pdf",
                  router: "/privacy-policy",
                },
                {
                  label: "Shipping & Delivery Policy",
                  link: "/assets/about-us/LEGAL Shreeji Gems Shipping And Delivery Policy.docx.pdf",
                  router: "/shipping-and-delivery-policy",
                },
                {
                  label: "Returns & Exchanges Policy",
                  link: "/assets/about-us/LEGAL Shreeji Gems Returns And Exchanges Policy.docx.pdf",
                  router: "/returns-and-exchanges-policy",
                },
                { label: "B2B Login", router: "/login" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.router}
                  className="text-[14px] md:text-[16px] cursor-pointer hover:text-brand-700 transition mb-2 block"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Section */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="font-semibold text-[18px] md:text-[22px] text-brand-900">
              Be Part Of
            </p>
            <div className="flex gap-4 flex-wrap">
              {socialMediaLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:opacity-75 transition"
                >
                  <Image
                    src={item.src}
                    width={30}
                    height={30}
                    alt="Social Icon"
                    className="w-[26px] sm:w-[32px] h-auto"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full max-w-5xl flex flex-col items-center justify-between text-xs sm:text-sm text-brand-700 mt-6 gap-2">
          <p>© {new Date().getFullYear()} JE-Inspi. All rights reserved.</p>
          <p>Powered by JE-Inspi</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
