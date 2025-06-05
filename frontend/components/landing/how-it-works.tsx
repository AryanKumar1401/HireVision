"use client";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HowItWorks = () => {
  // How it works steps
  const steps: Step[] = [
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
    <section id="how-it-works" className="relative z-10 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-3 text-center">How It Works</h2>
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
  );
};

export default HowItWorks;
