// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }import { motion, Variants } from 'framer-motion';
'use client';
import { motion, Variants } from 'framer-motion';
import React from 'react';

const Home: React.FC = () => {
  const floatingAnimation: Variants = {
    animate: {
      x: [0, 10, -10, 0],
      y: [0, -10, 10, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }
    }
  };

  const slowFloat: Variants = {
    animate: {
      x: [0, 15, -15, 0],
      y: [0, -15, 15, 0],
      transition: {
        duration: 30,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }
    }
  };

  const fastFloat: Variants = {
    animate: {
      x: [0, 5, -5, 0],
      y: [0, -5, 5, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }
    }
  };

  const asteroidFloat: Variants = {
    animate: {
      rotate: [-3, 3, -3],
      x: [0, 4, -4, 0],
      y: [0, -4, 4, 0],
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Enhanced Asteroid Logo */}
      <motion.div
        variants={asteroidFloat}
        animate="animate"
        className="absolute top-8 left-8 z-20"
      >
        <div className="relative">
          {/* Enhanced outer glow */}
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full transform scale-150" />
          <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full transform scale-125 rotate-45" />
          
          {/* More detailed asteroid shape */}
          <motion.div 
            className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-[42px]"
            style={{
              clipPath: "polygon(20% 0%, 65% 3%, 90% 15%, 98% 40%, 95% 70%, 85% 90%, 60% 98%, 30% 95%, 10% 85%, 2% 60%, 5% 30%, 15% 10%)"
            }}
          >
            {/* Multiple layer effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-800/50 to-transparent rounded-3xl" />
            
            {/* Enhanced crater details */}
            <div className="absolute top-3 right-4 w-2 h-2 rounded-full bg-gray-700 shadow-inner" />
            <div className="absolute bottom-4 left-3 w-3 h-3 rounded-full bg-gray-800 shadow-inner" />
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-gray-700 shadow-inner" />
            <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-gray-800 shadow-inner" />
            
            {/* Surface texture details */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
            
            {/* Logo text with enhanced styling */}
            <div className="relative z-10 flex flex-col">
              <span className="text-white/90 font-light text-lg tracking-wide">
                Hire
              </span>
              <span className="text-white/90 font-light text-lg tracking-wide -mt-1">
                Vision
              </span>
              
              {/* Subtle text glow */}
              <div className="absolute inset-0 bg-white/5 blur-sm" />
            </div>

            {/* Additional surface details */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent mix-blend-overlay" />
          </motion.div>
        </div>
      </motion.div>

      <div className="fixed inset-0 overflow-hidden">
        {/* Star field */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-${Math.random() > 0.5 ? '1' : '0.5'} h-${Math.random() > 0.5 ? '1' : '0.5'} bg-white rounded-full opacity-${Math.random() > 0.5 ? '50' : '30'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}

        {/* Nebula-like gradients */}
        <motion.div
          variants={slowFloat}
          animate="animate"
          className="absolute top-1/4 -left-1/4 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          variants={slowFloat}
          animate="animate"
          className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl"
        />

        {/* Floating geometric elements */}
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/10 rounded-full"
        />
        <motion.div
          variants={fastFloat}
          animate="animate"
          className="absolute bottom-1/4 left-1/4 w-16 h-16 border border-white/10 rounded-full"
        />
        <motion.div
          variants={floatingAnimation}
          animate="animate"
          className="absolute top-1/3 left-1/3 w-24 h-24 border border-white/5 rotate-45"
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center gap-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <h1 className="text-6xl font-light tracking-tight text-white relative">
            <span className="relative">
              Connect
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />
            </span>
          </h1>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 relative"
        >
          {/* Connecting element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-4 bg-white/20 sm:w-4 sm:h-px" />

          {/* Enhanced buttons with cosmic hover effects */}
          <button className="group px-8 py-3 text-sm font-medium text-gray-900 bg-white rounded-full hover:bg-white/90 transition-all duration-300 relative overflow-hidden">
            <span className="relative z-10">candidates</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>

          <button className="group px-8 py-3 text-sm font-medium text-white border border-white/20 rounded-full hover:border-white/40 transition-all duration-300 relative overflow-hidden">
            <span className="relative z-10">recruiters</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;