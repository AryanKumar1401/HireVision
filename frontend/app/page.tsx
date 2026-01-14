import React from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";
import Faq from "@/components/landing/faq";
import Cta from "@/components/landing/cta";
import Footer from "@/components/landing/footer";
import ScrollToTop from "@/components/landing/scroll-to-top";
import StarryBackground from "@/components/landing/starry-background";
import { Suspense } from "react";
import Loading from "./loading";
import Error from "./error";

export default async function Home() {
  return (
    <div className="min-h-screen text-[var(--text-primary)] overflow-hidden relative bg-[var(--surface-dark)]">
      {/* Starry Background */}
      <StarryBackground />
      
      {/* Animated mesh gradient */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />

      {/* Navbar */}
      <Navbar />

      {/* Add padding to account for fixed navbar */}
      <div className="pt-24 relative z-10">
        <Suspense fallback={<Loading />}>
          <Error>
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <Faq />
            <Cta />
          </Error>
        </Suspense>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Scroll to top button */}
      <div className="relative z-10">
        <ScrollToTop />
      </div>
    </div>
  );
}
