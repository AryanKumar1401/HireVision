"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Recruiters() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-gray-900 via-black to-gray-800 p-8 relative overflow-hidden">
      {/* Background accents */}
      <motion.div
        className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-500 opacity-20 blur-3xl rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500 opacity-20 blur-3xl rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg tracking-tight">
        Recruiters Page
      </h1>

      {/* Left-aligned "Your Applications" title with underline effect */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-3xl font-bold text-white relative inline-block after:absolute after:content-[''] after:w-full after:h-1 after:bg-gradient-to-r from-purple-500 to-blue-500 after:bottom-0 after:left-0 after:rounded-full">
          Your Applications
        </h2>
      </div>

      {/* Application Links Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl w-full">
        {['Application 1', 'Application 2', 'Application 3', 'Application 4', 'Application 5', 'Application 6'].map((app, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform-gpu"
          >
            {app}
          </motion.button>
        ))}
      </div>

      {/* "Go Back" button with glowing effect */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/')}
        className="mt-16 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold text-lg relative"
      >
        Go Back
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
      </motion.button>
    </main>
  );
}
