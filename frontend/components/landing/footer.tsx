"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#" },
      { label: "Demo", href: "#" },
    ],
    company: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
    support: [
      { label: "Contact", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  };

  return (
    <footer className="relative z-10 bg-[var(--surface-dark)] border-t border-[var(--border-subtle)]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-[var(--accent-primary)]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto py-16 px-6">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand section */}
          <div className="max-w-xs">
            <Link href="/" className="inline-block mb-6">
          <Image
            src="/logo.png"
            alt="HireVision Logo"
            width={140}
            height={35}
                className="rounded-lg"
          />
            </Link>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Revolutionizing the hiring process with AI-powered interview insights and analytics.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {[
                { name: "Twitter", icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
                { name: "LinkedIn", icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" },
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface-card-hover)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all"
                >
                  <span className="sr-only">{social.name}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
        </div>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors text-sm"
                      >
                        {link.label}
                </a>
              </li>
                  ))}
            </ul>
          </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} <span className="text-[var(--accent-primary)]">HireVision</span>. All rights reserved.
        </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-sm transition-colors">
              Terms of Service
            </a>
            <span className="text-[var(--border-subtle)]">•</span>
            <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-sm transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
