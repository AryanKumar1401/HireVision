'use client';
import { motion, Variants } from 'framer-motion';
import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  const floatingAnimation: Variants = {
    animate: {
      x: [0, 10, -10, 0],
      y: [0, -10, 10, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }
    }
  };

  const slowFloat: Variants = {
    animate: {
      x: [0, 15, -15, 0],
      y: [0, -15, 15, 0],
      transition: {
        duration: 30,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }
    }
  };

  const fastFloat: Variants = {
    animate: {
      x: [0, 5, -5, 0],
      y: [0, -5, 5, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }
    }
  };

  const asteroidFloat: Variants = {
    animate: {
      rotate: [-3, 3, -3],
      x: [0, 4, -4, 0],
      y: [0, -4, 4, 0],
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Enhanced Asteroid Logo */}
      <motion.div
        variants={asteroidFloat}
        animate="animate"
        className="absolute top-8 left-8 z-20"
      >
        <div className="relative">
          {/* Enhanced outer glow */}
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full transform scale-150" />
          <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full transform scale-125 rotate-45" />

          {/* More detailed asteroid shape */}
          <motion.div
            className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-[42px]"
            style={{
              clipPath: "polygon(20% 0%, 65% 3%, 90% 15%, 98% 40%, 95% 70%, 85% 90%, 60% 98%, 30% 95%, 10% 85%, 2% 60%, 5% 30%, 15% 10%)"
            }}
          >
            {/* Multiple layer effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-800/50 to-transparent rounded-3xl" />

            {/* Enhanced crater details */}
            <div className="absolute top-3 right-4 w-2 h-2 rounded-full bg-gray-700 shadow-inner" />
            <div className="absolute bottom-4 left-3 w-3 h-3 rounded-full bg-gray-800 shadow-inner" />
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-gray-700 shadow-inner" />
            <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-gray-800 shadow-inner" />

            {/* Surface texture details */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

            {/* Logo text with enhanced styling */}
            <div className="relative z-10 flex flex-col">
              <span className="text-white/90 font-light text-lg tracking-wide">
                Hire
              </span>
              <span className="text-white/90 font-light text-lg tracking-wide -mt-1">
                Vision
              </span>

              {/* Subtle text glow */}
              <div className="absolute inset-0 bg-white/5 blur-sm" />
            </div>

            {/* Additional surface details */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent mix-blend-overlay" />
          </motion.div>
        </div>
      </motion.div>

      <div className="fixed inset-0 overflow-hidden">
        {/* Star field */}
        {[...Array(50)].map((_, i) => {
          // Use index-based values instead of random
          const size = i % 2 === 0 ? '1' : '0.5';
          const opacity = i % 2 === 0 ? '50' : '30';
          const left = ((i * 17) % 100);
          const top = (i * 23) % 100;
          return (
        <motion.div
          key={i}
          className={`absolute w-${size} h-${size} bg-white rounded-full opacity-${opacity}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
          );
        })}

        {/* Nebula-like gradients */}
        <motion.div
          variants={slowFloat}
          animate="animate"
          className="absolute top-1/4 -left-1/4 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          variants={slowFloat}
          animate="animate"
          className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl"
        />

        {/* Floating geometric elements */}
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/10 rounded-full"
        />
        <motion.div
          variants={fastFloat}
          animate="animate"
          className="absolute bottom-1/4 left-1/4 w-16 h-16 border border-white/10 rounded-full"
        />
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-1/3 left-1/3 w-24 h-24 border border-white/5 rotate-45"
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center gap-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <h1 className="text-6xl font-light tracking-tight text-white relative">
            <span className="relative">
              Connect
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />
            </span>
          </h1>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 relative"
        >
          {/* Connecting element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-4 bg-white/20 sm:w-4 sm:h-px" />

          {/* Enhanced buttons with cosmic hover effects */}
            <Link href="/candidates"><button className="group px-8 py-3 text-sm font-medium text-gray-900 bg-white rounded-full hover:bg-white/90 transition-all duration-300 relative overflow-hidden">
            <span className="relative z-10">candidates</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button></Link>

          <button className="group px-8 py-3 text-sm font-medium text-white border border-white/20 rounded-full hover:border-white/40 transition-all duration-300 relative overflow-hidden">
            <span className="relative z-10">recruiters</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;