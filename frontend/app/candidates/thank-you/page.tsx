"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/utils/auth";
import { useRouter } from "next/navigation";

const ThankYouPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // Redirect to login if not authenticated
          router.push("/login");
          return;
        }

        // Get user profile to show their name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();

        if (profile?.full_name) {
          setUserName(profile.full_name);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[800px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-10 text-center"
        >
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Thank You{userName ? `, ${userName}` : ""}!
          </h1>

          <p className="text-xl text-white/80 mb-8">
            Your interview responses have been successfully submitted and are
            being analyzed.
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-gray-800/60 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                What happens next?
              </h2>
              <ol className="text-left text-white/70 space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-500/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                    1
                  </span>
                  <span>
                    Our AI analyzes your responses to provide feedback on
                    communication skills, clarity, and other key factors.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                    2
                  </span>
                  <span>
                    You'll receive personalized feedback within 24 hours via
                    email.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                    3
                  </span>
                  <span>
                    The recruiting team will review your responses and feedback
                    as part of the selection process.
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-6">
              <h3 className="text-lg font-medium text-blue-300 mb-2">
                Tips to prepare for the next round
              </h3>
              <p className="text-white/70">
                Review your experience and prepare concrete examples of past
                achievements. Research the company further to align your skills
                with their needs.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/candidates" passHref>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-lg font-medium text-lg bg-blue-600/80 text-white hover:bg-blue-600 transition-all duration-200"
              >
                Back to Dashboard
              </motion.button>
            </Link>

            <Link href="/" passHref>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 bg-white/5 text-white/70 border-2 border-white/10 hover:bg-white/10"
              >
                Home
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYouPage;
