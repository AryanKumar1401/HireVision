'use client';
import { motion } from 'framer-motion';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-0">
        <Image
          src="/logo.png"
          alt="HireVision Logo"
          width={200}
          height={100}
          className="rounded-lg"
        />
       
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Animated stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              opacity: i % 2 === 0 ? 0.5 : 0.3,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center gap-16 max-w-4xl mx-auto text-center">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-purple-900 leading-tight">
            <div className="text-white mb-2">Transform</div>
            <div className="text-white mb-2 flex items-center justify-center gap-3">
              the job
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.div>
            </div>
            <div className="text-white mb-4">recruitment process</div>
            <div className="flex items-center justify-center gap-2 text-white">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-purple-400"
              >
                ✨
              </motion.span>
              with HIREVISION
            </div>
          </h1>
        </motion.div>

        {/* Buttons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-8 w-full max-w-2xl justify-center px-4"
        >
          {/* Applicant Button */}
          <Link href="/candidates" className="w-full md:w-64">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl p-6 flex flex-col items-center gap-4 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xl font-medium text-gray-800">APPLICANT</span>
            </motion.div>
          </Link>

          {/* Recruiter Button */}
          <Link href="/recruiters" className="w-full md:w-64">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl p-6 flex flex-col items-center gap-4 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xl font-medium text-gray-800">RECRUITER</span>
            </motion.div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;