"use client";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
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
              textShadow: [
                "0px 0px 0px rgba(244, 140, 6, 0)",
                "0px 0px 8px rgba(244, 140, 6, 0.3)",
                "0px 0px 0px rgba(244, 140, 6, 0)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            Smarter Interviews.
          </motion.span>{" "}
          <span className="font-light">Faster Hires.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10">
          AI-powered insights for recruiters. Instant feedback for applicants.
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
                <svg
                  className="w-4 h-4 text-[#F48C06]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>See how your applicants score</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-[#F48C06]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Companies, Start Here
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Hero illustration/mockup */}
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
            className="absolute top-4 left-4 z-20 bg-[#0D1321]/70 backdrop-blur-lg px-4 py-2 rounded-xl border border-gray-700/20 shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-white">
              Recruiter Dashboard
            </h3>
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
                    <svg
                      className="w-5 h-5 text-white"
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
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-300">
                      Candidate
                    </div>
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
                  { name: "Technical Skills", value: 92 },
                  { name: "Communication", value: 85 },
                  { name: "Problem Solving", value: 79 },
                  { name: "Culture Fit", value: 88 },
                ].map((metric, idx) => (
                  <motion.div
                    key={idx}
                    className="mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.6 + idx * 0.1 }}
                  >
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-gray-400">{metric.name}</span>
                      <div>
                        <span
                          className={`${
                            metric.value >= 80
                              ? "text-green-400"
                              : metric.value >= 70
                              ? "text-[#F48C06]"
                              : "text-red-400"
                          }`}
                        >
                          {metric.value}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                      <motion.div
                        className={`h-1.5 rounded-full ${
                          metric.value >= 80
                            ? "bg-gradient-to-r from-green-500 to-green-400"
                            : metric.value >= 70
                            ? "bg-gradient-to-r from-[#F48C06] to-[#FF9F29]"
                            : "bg-gradient-to-r from-red-500 to-red-400"
                        }`}
                        style={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: 0.8 + idx * 0.1,
                        }}
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
                  <h4 className="text-[#F48C06] font-semibold text-sm uppercase tracking-wider mb-3">
                    Emotion Analysis
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Confidence",
                      "Enthusiasm",
                      "Authenticity",
                      "Engagement",
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className="bg-[#1A2333]/60 rounded-lg p-2 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 1.3 + i * 0.1 }}
                      >
                        <div className="text-xs text-gray-400 mb-1">{item}</div>
                        <div className="text-sm font-medium text-white">
                          {["High", "Medium", "High", "Very High"][i]}
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
                    {["Overview", "Details", "Timeline", "Feedback"].map(
                      (tab, i) => (
                        <motion.div
                          key={i}
                          className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer ${
                            i === 0
                              ? "bg-[#F48C06] text-white font-medium"
                              : "text-gray-400 hover:bg-[#1A2333]/70"
                          }`}
                          initial={{ opacity: 0, y: -5 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.2,
                            delay: 0.6 + i * 0.1,
                          }}
                        >
                          {tab}
                        </motion.div>
                      )
                    )}
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
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
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
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
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
                      <h3 className="text-white font-medium">
                        AI Interview Summary
                      </h3>
                      <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-full">
                        Generated 2m ago
                      </span>
                    </div>

                    <div className="bg-[#0A0F1A]/70 rounded-lg p-3 flex-grow">
                      <motion.p
                        className="text-sm text-gray-300 mb-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                      >
                        The candidate demonstrated strong technical knowledge in
                        cloud architecture and DevOps practices.
                      </motion.p>
                      <motion.p
                        className="text-sm text-gray-300 mb-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                      >
                        Communication was clear and concise, with good examples
                        from previous experience.
                      </motion.p>
                      <motion.p
                        className="text-sm text-gray-300"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.3 }}
                      >
                        Problem-solving approach was methodical but could
                        benefit from more creative solutions.
                      </motion.p>

                      <motion.div
                        className="mt-4 border-t border-gray-800/50 pt-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 1.5 }}
                      >
                        <h4 className="text-[#F48C06] text-xs font-medium mb-2">
                          Key Strengths
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "AWS expertise",
                            "Communication",
                            "Team leadership",
                            "Microservices",
                          ].map((tag, i) => (
                            <motion.span
                              key={i}
                              className="text-xs px-2 py-1 bg-[#F48C06]/20 text-[#F48C06] rounded-md"
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.2,
                                delay: 1.6 + i * 0.1,
                              }}
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
                      <h3 className="text-white font-medium">
                        Response Analysis
                      </h3>
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-6 h-6 rounded-full bg-[#0A0F1A]/80 flex items-center justify-center"
                          whileHover={{ scale: 1.2 }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.2, delay: 1 }}
                        >
                          <svg
                            className="w-3.5 h-3.5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
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
                          <svg
                            className="w-3.5 h-3.5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
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
                        <h4 className="text-xs text-gray-400 mb-2">
                          Sentiment Trends
                        </h4>
                        <div className="h-16 flex items-end gap-1">
                          {[60, 75, 65, 80, 90, 85, 95, 85, 90, 85, 90, 92].map(
                            (height, i) => (
                              <motion.div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-[#F48C06]/20 to-[#F48C06]/80 rounded-sm"
                                style={{ height: "0%" }}
                                initial={{ height: "0%" }}
                                whileInView={{ height: `${height}%` }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.4,
                                  delay: 1.4 + i * 0.05,
                                }}
                              ></motion.div>
                            )
                          )}
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
                        <h4 className="text-xs text-gray-400 mb-2">
                          Frequently Used Words
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { word: "architecture", size: "text-sm" },
                            { word: "scalable", size: "text-xs" },
                            { word: "solutions", size: "text-base" },
                            { word: "implementation", size: "text-xs" },
                            { word: "cloud", size: "text-sm" },
                            { word: "experience", size: "text-sm" },
                            { word: "development", size: "text-xs" },
                          ].map((item, i) => (
                            <motion.span
                              key={i}
                              className={`${item.size} px-2 py-1 bg-[#1A2333] text-gray-300 rounded-md`}
                              initial={{ opacity: 0, y: 5 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.3,
                                delay: 1.7 + i * 0.1,
                              }}
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

          {/* Shadow effect without orange glow */}
          <motion.div
            className="absolute -inset-0.5 bg-gradient-to-r from-gray-800/0 via-gray-800/20 to-gray-800/0 rounded-2xl blur-md z-0 opacity-50"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
