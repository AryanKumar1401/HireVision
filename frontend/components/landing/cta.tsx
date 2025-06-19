"use client";
import { motion } from "framer-motion";
import React from "react";

const Cta = () => {
  return (
    <section className="relative z-10 py-20 bg-gradient-to-b from-[#0D1321] to-[#1A2333]">
      <div className="max-w-4xl mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start interviewing smarter today
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of companies revolutionizing their hiring process
          </p>

          <button className="bg-[#F48C06] hover:bg-[#E07C00] text-white font-semibold py-4 px-10 text-lg rounded-lg shadow-lg shadow-[#F48C06]/30 transform hover:scale-105 transition-all duration-300">
            Try HireVision Free
          </button>

          <p className="mt-4 text-gray-400">No credit card required</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Cta;
