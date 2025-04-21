"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Testimonials from "../components/landing/Testimonials";
import Faq from "../components/landing/Faq";
import Cta from "../components/landing/Cta";
import Footer from "../components/landing/Footer";
import ScrollToTop from "../components/landing/ScrollToTop";
import { createClient } from "@/utils/auth";
import { isRecruiter } from "@/utils/auth";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0D1321] text-white overflow-hidden">
      {/* Background effects */}
      {/* <div className="fixed inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              opacity: i % 2 === 0 ? 0.3 : 0.1,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div> */}

      {/* Navbar */}
      <Navbar />

      {/* Add padding to account for fixed navbar */}
      <div className="pt-24">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* How It Works */}
        <HowItWorks />

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ Section */}
        <Faq />

        {/* Final CTA */}
        <Cta />

        {/* Footer */}
        <Footer />
      </div>

      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
