"use client";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="relative z-10 py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-dark)] via-[var(--surface-elevated)] to-[var(--surface-dark)]" />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--accent-primary)]/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--accent-tertiary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[var(--accent-primary)] text-xs font-mono tracking-wider uppercase">Get Started</span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6 text-[var(--text-primary)]">
            Start interviewing{" "}
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              smarter
            </span>{" "}
            today
          </h2>
          
          <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
            Join thousands of companies revolutionizing their hiring process with AI-powered insights
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-accent px-8 py-4 rounded-xl text-base font-semibold shadow-lg shadow-[var(--accent-primary)]/30"
              >
                Try HireVision Free
              </motion.button>
            </Link>
            
            <Link href="#features">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl text-base font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-all"
              >
                See Features
              </motion.button>
            </Link>
          </div>

          <p className="mt-6 text-[var(--text-muted)] text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-[var(--status-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Cta;
