"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export default function Dashboard() {
  // Framer Motion variants for the container can be defined if desired.
  // For simplicity, we define animations inline in each component.

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700">
      {/* Animated Floating Blobs */}
      <motion.div
        initial={{ opacity: 0.7, x: -150, y: -100 }}
        animate={{ x: [ -150, 50, -150 ], y: [ -100, 20, -100 ] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-56 h-56 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70"
      />
      <motion.div
        initial={{ opacity: 0.6, x: 200, y: 50 }}
        animate={{ x: [200, -50, 200], y: [50, -80, 50] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
      />
      <motion.div
        initial={{ opacity: 0.65, x: -100, y: 300 }}
        animate={{ x: [-100, 100, -100], y: [300, 250, 300] }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
      />

      {/* Dashboard Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
        {/* Bold Welcome Header */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-5xl md:text-8xl font-extrabold text-white drop-shadow-2xl"
        >
          Welcome to the Future
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-4 text-xl md:text-3xl text-indigo-200"
        >
          Discover smarter hiring. Transform your business.
        </motion.p>
        {/* Call-to-Action Button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10"
        >
          <Link
  href="/companies/manage"
  className="px-8 py-4 bg-black text-white font-semibold rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300"
>
  Get Started
</Link>
        </motion.div>
        {/* Additional Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-6 text-lg md:text-xl text-indigo-100"
        >
          Your dashboard for hiring the best talent is waiting.
        </motion.div>
      </div>
    </div>
  );
}
