"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { createClient } from "@/utils/auth";
import { isRecruiter } from "@/utils/auth";

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle tab changes for testimonials
  const handleTabChange = (newValue: number) => {
    setActiveTestimonial(newValue);
    setTabValue(newValue);
  };

  // Handle scroll for showing/hiding scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // FAQ items
  const faqItems = [
    {
      question: "How does the AI work?",
      answer:
        "HireVision uses advanced natural language processing and emotion detection algorithms to analyze interview responses. Our AI examines verbal content, tone, confidence, and clarity to provide comprehensive feedback.",
    },
    {
      question: "Is candidate data private?",
      answer:
        "Yes. We take privacy seriously. All candidate data is encrypted, anonymized where appropriate, and never shared with third parties. You retain full control over your interview data.",
    },
    {
      question: "Can I use my own video interview?",
      answer:
        "Absolutely! HireVision integrates with most video interview platforms. You can upload recordings from Zoom, Teams, or any standard video format for analysis.",
    },
    {
      question: "How accurate is the AI feedback?",
      answer:
        "Our AI has been trained on thousands of interviews and achieves over 90% accuracy when compared to human recruiter assessments. We continuously improve our models for even greater precision.",
    },
    {
      question: "Can I customize the feedback criteria?",
      answer:
        "Yes. HireVision allows recruiters to customize which skills and traits are prioritized in the analysis, ensuring feedback aligns with your specific hiring needs.",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote:
        "HireVision cut our interview review time in half while improving our hiring decisions. The candidate feedback feature has dramatically improved our employer brand.",
      name: "Sarah Chen",
      role: "Head of Talent, TechStartup",
      avatar: "/avatars/sarah.jpg",
    },
    {
      quote:
        "The AI insights helped me understand exactly where I needed to improve. I used the feedback to ace my next interview and landed my dream job!",
      name: "Marcus Johnson",
      role: "Software Developer",
      avatar: "/avatars/marcus.jpg",
    },
    {
      quote:
        "We've seen a 40% increase in candidate satisfaction since implementing HireVision's feedback system. It's transformed our hiring process.",
      name: "Priya Sharma",
      role: "HR Director, Enterprise Solutions",
      avatar: "/avatars/priya.jpg",
    },
  ];

  // Feature cards
  const features = [
    {
      title: "AI Interview Summary",
      description:
        "Get concise, actionable insights from every interview in seconds, not hours.",
      icon: (
        <svg
          className="w-8 h-8 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Emotion & Confidence Scoring",
      description:
        "Track emotional intelligence and confidence levels to identify top performers.",
      icon: (
        <svg
          className="w-8 h-8 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Recruiter Insights Dashboard",
      description:
        "Compare candidates side-by-side with detailed metrics and skill assessments.",
      icon: (
        <svg
          className="w-8 h-8 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Real-Time Candidate Feedback",
      description:
        "Provide immediate, constructive feedback to improve candidate experience.",
      icon: (
        <svg
          className="w-8 h-8 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
  ];

  // How it works steps
  const steps = [
    {
      title: "Upload or Record",
      description:
        "Upload existing interviews or conduct them directly on the platform",
      icon: (
        <svg
          className="w-10 h-10 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
    },
    {
      title: "AI Analysis",
      description: "Our AI processes emotions, skills, and behavioral patterns",
      icon: (
        <svg
          className="w-10 h-10 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: "Recruiter Insights",
      description: "Get comprehensive breakdown of candidate performance",
      icon: (
        <svg
          className="w-10 h-10 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Candidate Feedback",
      description: "Candidates receive actionable feedback to improve",
      icon: (
        <svg
          className="w-10 h-10 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
  ];

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
        <section className="relative z-10 flex flex-col items-center justify-center px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <motion.span 
                className="text-[#F48C06] inline-block"
                animate={{ 
                  scale: [1, 1.03, 1],
                  textShadow: ["0px 0px 0px rgba(244, 140, 6, 0)", "0px 0px 8px rgba(244, 140, 6, 0.3)", "0px 0px 0px rgba(244, 140, 6, 0)"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                Smarter Interviews.
              </motion.span>{" "}
              <span className="font-light">Faster Hires.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10">
              AI-powered insights for recruiters. Instant feedback for
              applicants.
            </p>
            
            {/* Enhanced CTA section with visual grouping */}
            <div className="relative max-w-2xl mx-auto">
              {/* Visual container with subtle glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F48C06]/20 via-purple-600/10 to-[#F48C06]/20 rounded-xl blur-md"></div>
              
              <div className="relative bg-[#0D1321]/80 backdrop-blur-sm rounded-xl p-6 border border-[#F48C06]/20">
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                  <Link href="/recruiters" className="w-full sm:w-auto">
                    <button className="bg-[#F48C06] hover:bg-[#E07C00] text-white font-semibold py-3 px-8 rounded-lg w-full sm:w-auto min-w-[200px] shadow-lg shadow-[#F48C06]/25 transition-all duration-300 flex items-center justify-center gap-2 group">
                      <svg 
                        className="w-5 h-5 transition-transform group-hover:scale-110" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                        />
                      </svg>
                      Try as Recruiter
                    </button>
                  </Link>
                  <Link href="/candidates" className="w-full sm:w-auto">
                    <button className="border-2 border-[#F48C06] text-[#F48C06] hover:bg-[#F48C06]/10 font-semibold py-3 px-8 rounded-lg w-full sm:w-auto min-w-[200px] transition-all duration-300 flex items-center justify-center gap-2 group">
                      <svg 
                        className="w-5 h-5 transition-transform group-hover:rotate-12" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                        />
                      </svg>
                      Try as Candidate
                    </button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-[#F48C06]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>See how your applicants score</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-[#F48C06]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Get feedback on your skills</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Companies banner - moved up closer to CTAs */}
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              className="bg-gradient-to-r from-[#1A2333] to-[#1A2333]/90 border border-[#F48C06]/30 rounded-xl px-8 py-6 max-w-md text-center shadow-xl hover:shadow-[#F48C06]/10 hover:border-[#F48C06]/50 transition-all duration-300 relative overflow-hidden"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px rgba(244, 140, 6, 0.15)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background image with overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0D1321] to-transparent"></div>
                <Image 
                  src="/team-collaboration.jpg" 
                  alt="Team Collaboration"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.currentTarget) {
                      e.currentTarget.style.display = "none";
                    }
                  }}
                />
              </div>
              
              <div className="relative z-10">
                <motion.h3
                  className="text-2xl font-bold text-white mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Empower Your Business
                </motion.h3>
                <motion.p
                  className="text-gray-300 mb-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Join a network of forward-thinking companies achieving real
                  growth.
                </motion.p>
                <Link href="/companies/login">
                  <motion.button
                    className="bg-[#F48C06] hover:bg-[#F48C06]/90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-[#F48C06]/20 flex items-center mx-auto gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Companies, Start Here
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero illustration/mockup - modern professional dashboard with scroll animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 w-full max-w-5xl mx-auto relative"
            style={{ height: "500px" }}
          >
            <div className="absolute inset-0">
              {/* Caption overlay */}
              <motion.div 
                className="absolute top-4 left-4 z-20 bg-[#0D1321]/70 backdrop-blur-lg px-4 py-2 rounded-xl border border-[#F48C06]/20 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-[#F48C06]">Recruiter Dashboard</h3>
              </motion.div>
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-[#1A2333] to-[#0D1321] rounded-2xl overflow-hidden border border-gray-800/40 shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 opacity-5">
                    <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLThjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLThjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLThjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wIDQ4YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptLTgtNGMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6bTAtOGMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6bTAtOGMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6bTAtOGMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6bTAtOGMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6bS04IDQwYzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMC04YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMC04YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMC04YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptLTggMzJjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLThjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLThjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLThjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLTggYzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptLTggMjRjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLThjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLThjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLTggYzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptMC04YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptLTggMTZjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLThjMCAxLjEtLjkgMi0yIDJzLTItLjktMi0yIC45LTIgMi0yIDIgLjkgMiAyem0wLTggYzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMnptLTggMGMwIDEuMS0uOSAyLTIgMnMtMi0uOS0yLTIgLjktMiAyLTIgMiAuOSAyIDJ6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=')]"></div>
                  </div>
                </div>
                
                {/* Content container */}
                <div className="absolute inset-0 p-5 flex">
                  {/* Left sidebar */}
                  <motion.div 
                    className="hidden lg:block w-60 h-full rounded-xl bg-[#0A0F1A]/60 backdrop-blur-md mr-4 p-4 border border-gray-800/30 shadow-lg"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div 
                      className="flex items-center mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <div className="w-9 h-9 rounded-full bg-[#F48C06]/90 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-300">Candidate</div>
                        <div className="text-xs text-gray-500">#CR-2025-104</div>
                      </div>
                    </motion.div>
                    
                    <motion.h4 
                      className="text-[#F48C06] font-semibold text-sm uppercase tracking-wider mb-3"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      Performance Metrics
                    </motion.h4>
                    
                    {/* KPI metrics with improved styling */}
                    {[
                      { name: 'Technical Skills', value: 92 },
                      { name: 'Communication', value: 85 },
                      { name: 'Problem Solving', value: 79 },
                      { name: 'Culture Fit', value: 88 }
                    ].map((metric, idx) => (
                      <motion.div 
                        key={idx} 
                        className="mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.6 + (idx * 0.1) }}
                      >
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-gray-400">{metric.name}</span>
                          <div>
                            <span className={`${metric.value >= 80 ? 'text-green-400' : metric.value >= 70 ? 'text-[#F48C06]' : 'text-red-400'}`}>
                              {metric.value}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                          <motion.div 
                            className={`h-1.5 rounded-full ${
                              metric.value >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' : 
                              metric.value >= 70 ? 'bg-gradient-to-r from-[#F48C06] to-yellow-400' :
                              'bg-gradient-to-r from-red-500 to-red-400'
                            }`}
                            style={{width: 0}}
                            whileInView={{ width: `${metric.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.8 + (idx * 0.1) }}
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.div 
                      className="border-t border-gray-800/50 my-4 pt-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 1.2 }}
                    >
                      <h4 className="text-[#F48C06] font-semibold text-sm uppercase tracking-wider mb-3">Emotion Analysis</h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {['Confidence', 'Enthusiasm', 'Authenticity', 'Engagement'].map((item, i) => (
                          <motion.div 
                            key={i} 
                            className="bg-[#1A2333]/60 rounded-lg p-2 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 1.3 + (i * 0.1) }}
                          >
                            <div className="text-xs text-gray-400 mb-1">{item}</div>
                            <div className="text-sm font-medium text-white">
                              {['High', 'Medium', 'High', 'Very High'][i]}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  {/* Main dashboard area */}
                  <motion.div 
                    className="flex-1 h-full flex flex-col"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    {/* Top navigation bar */}
                    <motion.div 
                      className="flex justify-between items-center mb-4 p-2 bg-[#0A0F1A]/60 backdrop-blur-md rounded-xl border border-gray-800/30"
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <div className="flex space-x-1">
                        {['Overview', 'Details', 'Timeline', 'Feedback'].map((tab, i) => (
                          <motion.div 
                            key={i} 
                            className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer ${
                              i === 0 ? 'bg-[#F48C06] text-white font-medium' : 'text-gray-400 hover:bg-[#1A2333]/70'
                            }`}
                            initial={{ opacity: 0, y: -5 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.2, delay: 0.6 + (i * 0.1) }}
                          >
                            {tab}
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.div 
                          className="w-8 h-8 rounded-full bg-[#1A2333]/80 flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.9 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </motion.div>
                        <motion.div 
                          className="w-8 h-8 rounded-full bg-[#1A2333]/80 flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 1 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    {/* Content grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                      {/* AI Summary Card */}
                      <motion.div 
                        className="bg-[#1A2333]/50 backdrop-blur-md rounded-xl p-4 border border-gray-800/30 shadow-lg h-full flex flex-col"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-white font-medium">AI Interview Summary</h3>
                          <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-full">Generated 2m ago</span>
                        </div>
                        
                        <div className="bg-[#0A0F1A]/70 rounded-lg p-3 flex-grow">
                          <motion.p 
                            className="text-sm text-gray-300 mb-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                          >
                            The candidate demonstrated strong technical knowledge in cloud architecture and DevOps practices.
                          </motion.p>
                          <motion.p 
                            className="text-sm text-gray-300 mb-2"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                          >
                            Communication was clear and concise, with good examples from previous experience.
                          </motion.p>
                          <motion.p 
                            className="text-sm text-gray-300"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 1.3 }}
                          >
                            Problem-solving approach was methodical but could benefit from more creative solutions.
                          </motion.p>
                          
                          <motion.div 
                            className="mt-4 border-t border-gray-800/50 pt-3"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 1.5 }}
                          >
                            <h4 className="text-[#F48C06] text-xs font-medium mb-2">Key Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                              {['AWS expertise', 'Communication', 'Team leadership', 'Microservices'].map((tag, i) => (
                                <motion.span 
                                  key={i} 
                                  className="text-xs px-2 py-1 bg-[#F48C06]/20 text-[#F48C06] rounded-md"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.2, delay: 1.6 + (i * 0.1) }}
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                      
                      {/* Response Analysis */}
                      <motion.div 
                        className="bg-[#1A2333]/50 backdrop-blur-md rounded-xl p-4 border border-gray-800/30 shadow-lg flex flex-col"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-white font-medium">Response Analysis</h3>
                          <div className="flex space-x-1">
                            <motion.div 
                              className="w-6 h-6 rounded-full bg-[#0A0F1A]/80 flex items-center justify-center"
                              whileHover={{ scale: 1.2 }}
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.2, delay: 1 }}
                            >
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </motion.div>
                            <motion.div 
                              className="w-6 h-6 rounded-full bg-[#0A0F1A]/80 flex items-center justify-center"
                              whileHover={{ scale: 1.2 }}
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.2, delay: 1.1 }}
                            >
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col">
                          {/* Sentiment over time */}
                          <motion.div 
                            className="bg-[#0A0F1A]/70 rounded-lg p-3 mb-3 flex-grow"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 1.2 }}
                          >
                            <h4 className="text-xs text-gray-400 mb-2">Sentiment Trends</h4>
                            <div className="h-16 flex items-end gap-1">
                              {[60, 75, 65, 80, 90, 85, 95, 85, 90, 85, 90, 92].map((height, i) => (
                                <motion.div 
                                  key={i} 
                                  className="flex-1 bg-gradient-to-t from-[#F48C06]/20 to-[#F48C06]/80 rounded-sm" 
                                  style={{ height: '0%' }}
                                  initial={{ height: '0%' }}
                                  whileInView={{ height: `${height}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.4, delay: 1.4 + (i * 0.05) }}
                                ></motion.div>
                              ))}
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500">Start</span>
                              <span className="text-xs text-gray-500">End</span>
                            </div>
                          </motion.div>
                          
                          {/* Keywords */}
                          <motion.div 
                            className="bg-[#0A0F1A]/70 rounded-lg p-3"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 1.5 }}
                          >
                            <h4 className="text-xs text-gray-400 mb-2">Frequently Used Words</h4>
                            <div className="flex flex-wrap gap-2">
                              {[
                                {word: 'architecture', size: 'text-sm'},
                                {word: 'scalable', size: 'text-xs'},
                                {word: 'solutions', size: 'text-base'},
                                {word: 'implementation', size: 'text-xs'},
                                {word: 'cloud', size: 'text-sm'},
                                {word: 'experience', size: 'text-sm'},
                                {word: 'development', size: 'text-xs'},
                              ].map((item, i) => (
                                <motion.span 
                                  key={i} 
                                  className={`${item.size} px-2 py-1 bg-[#1A2333] text-gray-300 rounded-md`}
                                  initial={{ opacity: 0, y: 5 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.3, delay: 1.7 + (i * 0.1) }}
                                >
                                  {item.word}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Glassmorphic highlight effect */}
              <motion.div 
                className="absolute -inset-0.5 bg-gradient-to-r from-[#F48C06]/0 via-[#F48C06]/20 to-[#F48C06]/0 rounded-2xl blur-md z-0 opacity-70"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              ></motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="relative z-10 py-20 px-6 bg-[#0A0F1A]"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-3 text-center">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16">
              Everything you need to optimize your hiring process
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#1A2333] p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] border border-gray-800"
                >
                  <div className="mb-4 p-3 bg-[#2A3343] inline-block rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-3 text-center">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16">
              Streamlined process from interview to insights
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-[#1A2333] p-6 rounded-xl text-center h-full flex flex-col items-center">
                    <div className="mb-4 p-4 bg-[#2A3343] rounded-full">
                      {step.icon}
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F48C06] flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>

                  {/* Connector line (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-[#F48C06]"></div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/learn-more">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-[#F48C06] font-medium cursor-pointer inline-flex items-center"
                >
                  Learn More
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.span>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="relative z-10 py-20 px-6 bg-[#0A0F1A]"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-3 text-center">
              What People Say
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16">
              Trusted by recruiters and candidates worldwide
            </p>

            <div className="relative">
              {/* Custom tab navigation */}
              <div className="flex justify-center mb-8 border-b border-gray-700">
                <div className="flex space-x-4">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={index}
                      className={`pb-2 px-4 text-base font-medium transition-colors duration-300 ${
                        tabValue === index
                          ? "text-[#F48C06] border-b-2 border-[#F48C06]"
                          : "text-white hover:text-[#F48C06]/80"
                      }`}
                      onClick={() => handleTabChange(index)}
                    >
                      {testimonial.name}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="relative overflow-hidden"
                style={{ minHeight: "280px" }}
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      position: "absolute",
                      width: "100%",
                    }}
                    animate={{
                      opacity: activeTestimonial === index ? 1 : 0,
                      zIndex: activeTestimonial === index ? 1 : 0,
                      transition: { duration: 0.5 },
                    }}
                    className="w-full px-4"
                  >
                    <div className="bg-[#1A2333] p-8 rounded-xl shadow-xl">
                      <div className="flex items-center mb-6">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-700 mr-4">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            width={56}
                            height={56}
                            className="object-cover"
                            onError={(e) => {
                              if (e.currentTarget) {
                                e.currentTarget.style.display = "none";
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-14 h-14 rounded-full bg-[#F48C06] flex items-center justify-center font-bold text-xl">
                                ${testimonial.name.charAt(0)}
                              </div>`;
                                }
                              }
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                      <blockquote className="text-lg italic">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="relative z-10 py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-3 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16">
              Everything you need to know about HireVision
            </p>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`mb-4 border border-gray-700 rounded-lg overflow-hidden bg-[#1A2333] transition-all duration-300 ${
                    activeFaq === index ? "shadow-lg" : ""
                  }`}
                >
                  <button
                    onClick={() =>
                      setActiveFaq(activeFaq === index ? null : index)
                    }
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <h3 className="text-lg font-medium">{item.question}</h3>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        activeFaq === index ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      activeFaq === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-5 pt-0 text-gray-400 bg-[#232D40]">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative z-10 py-20 bg-gradient-to-b from-[#0D1321] to-[#1A2333]">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Start interviewing smarter today
              </h2>
              <p className="text-xl text-gray-300 mb-10">
                Join thousands of companies revolutionizing their hiring process
              </p>

              <button className="bg-[#F48C06] hover:bg-[#E07C00] text-white font-semibold py-4 px-10 text-lg rounded-lg shadow-lg shadow-[#F48C06]/30 transform hover:scale-105 transition-all duration-300">
                Try HireVision Free
              </button>

              <p className="mt-4 text-gray-400">No credit card required</p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0A0F1A] py-10 px-6 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Image
                src="/logo.png"
                alt="HireVision Logo"
                width={140}
                height={35}
                className="rounded-lg mb-4"
              />
              <p className="text-gray-400 max-w-xs">
                Revolutionizing the hiring process with AI-powered interview
                insights.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                      Demo
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 HireVision. All rights reserved.
            </p>

            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>

              <a href="#" className="text-gray-400 hover:text-[#F48C06]">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-6 right-6 z-50 bg-[#F48C06] hover:bg-[#E07C00] w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white"
            onClick={scrollToTop}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
