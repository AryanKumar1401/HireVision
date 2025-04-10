"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // Update scrolled state based on scroll position
      setScrolled(offset > 50);

      // Determine which section is currently in view
      const sections = ["features", "how-it-works", "testimonials", "faq"];
      let currentSection = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveItem(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { key: "features", label: "Features" },
    { key: "how-it-works", label: "How It Works" },
    { key: "testimonials", label: "Testimonials" },
    { key: "faq", label: "FAQ" },
  ];

  const scrollToSection = (key: string) => {
    setActiveItem(key);
    const element = document.getElementById(key);
    if (element) {
      const yOffset = -80; // Offset for the fixed navbar
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          scrolled
            ? "h-16 bg-[#0D1321]/70 backdrop-blur-md shadow-sm"
            : "h-20 bg-transparent"
        }`}
      >
        <div className="max-w-screen-xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-20">
            <div className="transition-all duration-300 flex items-center">
              <Image
                src="/logo.png"
                alt="HireVision Logo"
                width={scrolled ? 110 : 130}
                height={scrolled ? 28 : 33}
                className="rounded-md"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative py-1 px-2 bg-[#1A2333]/0 rounded-full transition-all duration-300 ease-in-out">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  className={`relative px-4 py-2 text-sm transition-colors duration-200 ${
                    activeItem === item.key
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {activeItem === item.key && (
                    <motion.span
                      layoutId="bubble"
                      className="absolute inset-0 bg-[#F48C06]/10 rounded-full"
                      style={{ borderRadius: 9999 }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative z-20 p-2 rounded-full focus:outline-none focus:ring-1 focus:ring-[#F48C06]/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-5 flex flex-col justify-between items-center">
              <span
                className={`w-5 h-0.5 bg-white rounded-full transform transition-all duration-300 origin-left ${
                  mobileMenuOpen ? "rotate-45 translate-x-px" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-white rounded-full transform transition-all duration-300 origin-left ${
                  mobileMenuOpen ? "-rotate-45 translate-x-px" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-gradient-to-b from-[#0D1321] to-[#1A2333]/95 backdrop-blur-lg flex flex-col pt-20"
          >
            <div className="flex flex-col items-center gap-6 pt-10">
              {navItems.map((item) => (
                <motion.button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  className="text-lg font-light px-8 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    className={
                      activeItem === item.key ? "text-[#F48C06]" : "text-white"
                    }
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
              <div className="w-full max-w-[200px] h-px bg-gradient-to-r from-transparent via-gray-600/30 to-transparent my-4" />
              <div className="flex gap-4 mt-4">
                <Link
                  href="/recruiters"
                  className="px-6 py-2 bg-[#F48C06]/90 hover:bg-[#F48C06] rounded-full text-white text-sm font-medium transition-colors duration-300"
                >
                  For Recruiters
                </Link>
                <Link
                  href="/candidates"
                  className="px-6 py-2 border border-[#F48C06]/50 hover:border-[#F48C06] rounded-full text-[#F48C06] text-sm font-medium transition-colors duration-300"
                >
                  For Candidates
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
