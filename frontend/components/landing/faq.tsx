"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const Faq = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // FAQ items
  const faqItems: FaqItem[] = [
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

  return (
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
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
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
  );
};

export default Faq;
