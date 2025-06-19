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
import { Suspense } from "react";
import Loading from "./loading";
import Error from "./error";

export default async function Home() {
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
      <Footer />

      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
}
