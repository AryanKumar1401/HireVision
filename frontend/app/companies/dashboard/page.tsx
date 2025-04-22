"use client";

import React, { Suspense } from "react"; // Import Suspense
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="relative min-h-screen overflow-hidden bg-gray-100">
        {/* Background Animated Blobs */}
        <motion.div
          initial={{ opacity: 0.7, x: -150, y: -100 }}
          animate={{ x: [-150, 50, -150], y: [-100, 20, -100] }}
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

        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-md z-20">
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-2xl font-bold text-gray-800">HireVision</h1>
          </div>
          <nav className="mt-4">
            <ul>
              <li>
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-200"
                >
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/companies/manage"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-200"
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-200"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-200"
                >
                  Account
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="ml-64 relative z-10 p-6">
          {/* Top Header */}
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            <div>
              <Link
                href="/account"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Profile
              </Link>
            </div>
          </header>

          {/* Dashboard Metrics Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                Total Candidates
              </h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">1,234</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                Interviews Scheduled
              </h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">87</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h3 className="text-xl font-semibold text-gray-700">
                Active Job Posts
              </h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">23</p>
            </motion.div>
          </section>

          {/* Main Dashboard Content */}
          <section className="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Activity
            </h3>
            <div className="text-gray-600">
              {/* Replace with your chart, table, or other dynamic content */}
              <p>No recent activity to display. Check back soon!</p>
            </div>
          </section>
        </div>
      </div>
    </Suspense>
  );
}

// Simple fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
      Loading Dashboard...
    </div>
  );
}
