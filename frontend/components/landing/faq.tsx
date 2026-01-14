"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const Faq = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqItems: FaqItem[] = [
    {
      question: "How does the AI work?",
      answer: "HireVision uses advanced natural language processing and emotion detection algorithms to analyze interview responses. Our AI examines verbal content, tone, confidence, and clarity to provide comprehensive feedback.",
    },
    {
      question: "Is candidate data private?",
      answer: "Yes. We take privacy seriously. All candidate data is encrypted, anonymized where appropriate, and never shared with third parties. You retain full control over your interview data.",
    },
    {
      question: "Can I use my own video interview?",
      answer: "Absolutely! HireVision integrates with most video interview platforms. You can upload recordings from Zoom, Teams, or any standard video format for analysis.",
    },
    {
      question: "How accurate is the AI feedback?",
      answer: "Our AI has been trained on thousands of interviews and achieves over 90% accuracy when compared to human recruiter assessments. We continuously improve our models for even greater precision.",
    },
    {
      question: "Can I customize the feedback criteria?",
      answer: "Yes. HireVision allows recruiters to customize which skills and traits are prioritized in the analysis, ensuring feedback aligns with your specific hiring needs.",
    },
  ];

  return (
    <section id="faq" className="relative z-10 py-24 px-6 bg-[var(--surface-dark)]">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[var(--accent-tertiary)]/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[var(--accent-primary)] text-xs font-mono tracking-wider uppercase">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-[var(--text-primary)]">
          Frequently Asked Questions
        </h2>
          <p className="text-lg text-[var(--text-secondary)]">
          Everything you need to know about HireVision
        </p>
        </motion.div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${
                activeFaq === index ? "border-[var(--accent-primary)]/30 shadow-lg shadow-[var(--accent-primary)]/5" : ""
              }`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left group"
              >
                <h3 className={`text-base font-medium pr-4 transition-colors ${
                  activeFaq === index ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]"
                }`}>
                  {item.question}
                </h3>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  activeFaq === index 
                    ? "bg-[var(--accent-primary)] text-[var(--surface-dark)]" 
                    : "bg-[var(--surface-elevated)] text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]"
                }`}>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeFaq === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                </div>
              </button>
              
              <AnimatePresence>
                {activeFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
              >
                    <div className="px-5 pb-5 pt-0 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)]">
                      <p className="pt-4">{item.answer}</p>
                </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-[var(--text-muted)]">
            Still have questions?{" "}
            <a href="#" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-medium transition-colors">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
