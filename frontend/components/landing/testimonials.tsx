"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonialType, setTestimonialType] = useState<'recruiters' | 'candidates'>('recruiters');

  const handleTypeToggle = (type: 'recruiters' | 'candidates') => {
    setTestimonialType(type);
    setActiveTestimonial(0);
  };

  const recruiterTestimonials: Testimonial[] = [
    {
      quote: "HireVision's philosophy is right. Hiring is a two way street, and transparency has never been more important.",
      name: "Praveen B, PhD",
      role: "Principal Research Scientist, LinkedIn",
      initials: "PB",
    },
    {
      quote: "Understanding perspective is a step a lot of hirers have overlooked. HireVision is taking the steps to re-incorporate that perspective.",
      name: "Eli B, JD",
      role: "CEO, Launch a Biz",
      initials: "EB",
    },
    {
      quote: "The AI-powered analysis offers AI-driven insights that change the game for a lot of companies' hiring processes.",
      name: "Stephy Liu",
      role: "VC, HKTP",
      initials: "SL",
    },
  ];

  const candidateTestimonials: Testimonial[] = [
    {
      quote: "Getting detailed feedback after each interview was a game-changer. I could see exactly what I was doing well and what to work on.",
      name: "Goku T",
      role: "CSE Student | NYU",
      initials: "GT",
    },
    {
      quote: "The personalized questions based on my resume made me feel like the company really understood my background. Much better than generic interviews.",
      name: "Alex Thompson",
      role: "Computer Science Student | Cornell",
      initials: "AT",
    },
    {
      quote: "I love how transparent the process is. I get real insights about my performance and can track my improvement over time.",
      name: "Sandy Lin",
      role: "UX Designer",
      initials: "SL",
    },
  ];

  const currentTestimonials = testimonialType === 'recruiters' ? recruiterTestimonials : candidateTestimonials;

  return (
    <section id="testimonials" className="relative z-10 py-24 px-6 bg-[var(--surface-elevated)]">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[var(--accent-primary)] text-xs font-mono tracking-wider uppercase">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 text-[var(--text-primary)]">
            What People Say
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Trusted by recruiters and candidates worldwide
          </p>
        </motion.div>

        {/* Type Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex p-1.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)]">
            {(['recruiters', 'candidates'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${testimonialType === type
                  ? "text-[var(--surface-dark)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
              >
                {testimonialType === type && (
                  <motion.div
                    layoutId="testimonialTypeIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 capitalize">{type}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {currentTestimonials.map((testimonial, index) => (
            <motion.button
              key={`${testimonialType}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setActiveTestimonial(index)}
              className={`p-4 rounded-xl text-left transition-all duration-300 ${activeTestimonial === index
                ? "glass-card border-[var(--accent-primary)]/30 shadow-lg shadow-[var(--accent-primary)]/10"
                : "bg-[var(--surface-card)]/50 border border-transparent hover:border-[var(--border-subtle)]"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold ${activeTestimonial === index
                  ? "bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--surface-dark)]"
                  : "bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  }`}>
                  {testimonial.initials}
                </div>
                <div>
                  <p className={`text-sm font-medium transition-colors ${activeTestimonial === index ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                    }`}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate max-w-[120px]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Quote Display */}
        <div className="relative" style={{ minHeight: "200px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${testimonialType}-${activeTestimonial}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 md:p-10 rounded-2xl"
            >
              {/* Quote mark */}
              <div className="absolute top-6 left-8 text-6xl text-[var(--accent-primary)]/20 font-serif leading-none">
                "
              </div>

              <blockquote className="text-xl md:text-2xl text-[var(--text-primary)] leading-relaxed pl-8 md:pl-10 relative">
                {currentTestimonials[activeTestimonial].quote}
              </blockquote>

              <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[var(--surface-dark)] font-semibold">
                    {currentTestimonials[activeTestimonial].initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {currentTestimonials[activeTestimonial].name}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {currentTestimonials[activeTestimonial].role}
                    </p>
                  </div>
                </div>

                {/* Navigation dots */}
                <div className="flex gap-2">
                  {currentTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${activeTestimonial === index
                        ? "w-6 bg-[var(--accent-primary)]"
                        : "bg-[var(--text-muted)]/30 hover:bg-[var(--text-muted)]/50"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
