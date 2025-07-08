"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  // Handle tab changes for testimonials
  const handleTabChange = (newValue: number) => {
    setActiveTestimonial(newValue);
    setTabValue(newValue);
  };

  // Testimonials
  const testimonials: Testimonial[] = [
    {
      quote:
        "GalacticHire cut our interview review time in half while improving our hiring decisions. The candidate feedback feature has dramatically improved our employer brand.",
      name: "Sarah Chen",
      role: "Head of Talent, TechStartup",
      avatar: "/avatars/sarah.jpg",
    },
    {
      quote:
        "The AI insights helped me understand exactly where I needed to improve. I used the feedback to ace my next interview and landed my dream job!",
      name: "Marcus Johnson",
      role: "Software Developer",
      avatar: "/avatars/marcus.jpg",
    },
    {
      quote:
        "We've seen a 40% increase in candidate satisfaction since implementing HireVision's feedback system. It's transformed our hiring process.",
      name: "Priya Sharma",
      role: "HR Director, Enterprise Solutions",
      avatar: "/avatars/priya.jpg",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative z-10 py-20 px-6 bg-[#0A0F1A]"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-3 text-center">What People Say</h2>
        <p className="text-xl text-gray-400 text-center mb-16">
          Trusted by recruiters and candidates worldwide
        </p>

        <div className="relative">
          {/* Custom tab navigation */}
          <div className="flex justify-center mb-8 border-b border-gray-700">
            <div className="flex space-x-4">
              {testimonials.map((testimonial, index) => (
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
            {testimonials.map((testimonial, index) => (
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
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-700 mr-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="object-cover"
                        onError={(e) => {
                          if (e.currentTarget) {
                            e.currentTarget.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-14 h-14 rounded-full bg-[#F48C06] flex items-center justify-center font-bold text-xl">
                                ${testimonial.name.charAt(0)}
                              </div>`;
                            }
                          }
                        }}
                      />
                    </div>
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
