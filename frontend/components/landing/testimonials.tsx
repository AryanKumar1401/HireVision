"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [testimonialType, setTestimonialType] = useState<'recruiters' | 'candidates'>('recruiters');

  // Handle tab changes for testimonials
  const handleTabChange = (newValue: number) => {
    setActiveTestimonial(newValue);
    setTabValue(newValue);
  };

  // Handle testimonial type toggle
  const handleTypeToggle = (type: 'recruiters' | 'candidates') => {
    setTestimonialType(type);
    setActiveTestimonial(0);
    setTabValue(0);
  };

  // Recruiter testimonials
  const recruiterTestimonials: Testimonial[] = [
    {
      quote:
        "GalacticHire's philosophy is right. Hiring is a two way street, and transparency has never been more important.",
      name: "Praveen B, PhD",
      role: "Principial Research Scientist, LinkedIn",
    },
    {
      quote:
        "Understanding perspective is a step a lot of hirers have overlooked. GalacticHire is taking the steps to re-incorporate that perspective.",
      name: "Eli B, JD",
      role: "CEO, Launch a Biz",
    },
    {
      quote:
        "The AI-powered analysis offers AI-driven insights that change the game for a lot of companies' hiring processes.",
      name: "Stephy Liu",
      role: "VC, HKTP",
    },
  ];

  // Candidate testimonials
  const candidateTestimonials: Testimonial[] = [
    {
      quote:
        "Getting detailed feedback after each interview was a game-changer. I could see exactly what I was doing well and what to work on.",
      name: "Goku T",
      role: "CSE Student | NYU",
    },
    {
      quote:
        "The personalized questions based on my resume made me feel like the company really understood my background. Much better than generic interviews.",
      name: "Alex Thompson",
      role: "Computer Science Student | Cornell University",
    },
    {
      quote:
        "I love how transparent the process is. I get real insights about my performance and can track my improvement over time.",
      name: "Sandy Lin",
      role: "UX Designer",
    },
  ];

  // Get current testimonials based on type
  const currentTestimonials = testimonialType === 'recruiters' ? recruiterTestimonials : candidateTestimonials;

  return (
    <section
      id="testimonials"
      className="relative z-10 py-20 px-6 bg-[#0A0F1A]"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-3 text-center">What People Say</h2>
        <p className="text-xl text-gray-400 text-center mb-8">
          Trusted by recruiters and candidates worldwide
        </p>

        {/* Toggle between Recruiters and Candidates */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#1A2333] p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => handleTypeToggle('recruiters')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                testimonialType === 'recruiters'
                  ? "bg-[#F48C06] text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              Recruiters
            </button>
            <button
              onClick={() => handleTypeToggle('candidates')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                testimonialType === 'candidates'
                  ? "bg-[#F48C06] text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              Candidates
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Custom tab navigation */}
          <div className="flex justify-center mb-8 border-b border-gray-700">
            <div className="flex space-x-4">
              {currentTestimonials.map((testimonial, index) => (
                <button
                  key={index}
                  className={`pb-2 px-4 text-base font-medium transition-colors duration-300 ${
                    tabValue === index
                      ? "text-[#F48C06] border-b-2 border-[#F48C06]"
                      : "text-white hover:text-[#F48C06]/80"
                  }`}
                  onClick={() => handleTabChange(index)}
                >
                  {testimonial.name}
                </button>
              ))}
            </div>
          </div>

          <div
            className="relative overflow-hidden"
            style={{ minHeight: "280px" }}
          >
            {currentTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  position: "absolute",
                  width: "100%",
                }}
                animate={{
                  opacity: activeTestimonial === index ? 1 : 0,
                  zIndex: activeTestimonial === index ? 1 : 0,
                  transition: { duration: 0.5 },
                }}
                className="w-full px-4"
              >
                <div className="bg-[#1A2333] p-8 rounded-xl shadow-xl">
                  <div className="flex items-center mb-6">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-lg italic">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
