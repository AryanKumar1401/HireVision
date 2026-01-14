"use client";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const HowItWorks = () => {
  const steps: Step[] = [
    {
      title: "Upload or Record",
      description: "Upload existing interviews or conduct them directly on the platform",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      gradient: "from-[var(--accent-primary)] to-[var(--accent-secondary)]",
    },
    {
      title: "AI Analysis",
      description: "Our AI processes emotions, skills, and behavioral patterns",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      gradient: "from-violet-500 to-purple-400",
    },
    {
      title: "Recruiter Insights",
      description: "Get comprehensive breakdown of candidate performance",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-[var(--accent-tertiary)] to-emerald-400",
    },
    {
      title: "Candidate Feedback",
      description: "Candidates receive actionable feedback to improve",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      gradient: "from-rose-500 to-pink-400",
    },
  ];

  return (
    <section id="how-it-works" className="relative z-10 py-24 px-6 bg-[var(--surface-elevated)]">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[var(--accent-primary)] text-xs font-mono tracking-wider uppercase">Process</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-[var(--text-primary)]">
            How It Works
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Streamlined process from interview to insights in four simple steps
        </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="glass-card p-6 rounded-2xl text-center h-full flex flex-col items-center transition-all duration-300 hover:border-[var(--accent-primary)]/30">
                {/* Hover glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                
                {/* Step number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center font-bold text-[var(--surface-dark)] text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`mb-5 p-4 rounded-2xl bg-gradient-to-br ${step.gradient} text-white`}>
                  {step.icon}
                </div>

                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {step.title}
                </h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line (desktop only, except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/learn-more">
            <motion.span
              whileHover={{ x: 5 }}
              className="text-[var(--accent-primary)] font-medium cursor-pointer inline-flex items-center gap-2 hover:text-[var(--accent-secondary)] transition-colors"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
