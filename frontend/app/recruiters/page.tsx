"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Recruiters() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-4xl font-bold mb-8">Recruiters Page</h1>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/')}
        className="px-8 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
      >
        Go Back
      </motion.button>
    </main>
  );
}
