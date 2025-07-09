"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/auth";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import NavigationMenu from "./components/NavigationMenu";
import PendingInterviews from "./components/PendingInterviews";
import InterviewDetailsModal from "./components/InterviewDetailsModal";
import { useProfile } from "@/hooks/useProfile";
import { ProfileForm } from "../components/ProfileForm";
import { useCandidateOnboardingStep } from '@/hooks/useCandidateOnboardingStep';
import AddInterviewModal from "../components/AddInterviewModal";

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [addInterviewOpen, setAddInterviewOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, showProfileForm, profileData, updateProfile } = useProfile();
  const { loading, step, redirectIfNeeded } = useCandidateOnboardingStep();
  const [pendingInterviews, setPendingInterviews] = useState<any[]>([]);

  // Get interview code from URL if present
  const interviewCode = searchParams.get('code');

  interface FloatingElement {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }

  useEffect(() => {
    const elements = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 20,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setFloatingElements(elements);
  }, []);

  useEffect(() => {
    const fetchCompleted = async () => {
      const { data, error } = await supabase
        .from("interview_participants")
        .select("*, interview:interview_id(*)")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .eq("completed", true)
        .order("completed_at", { ascending: false });
      console.log("successfully retrieved completed interviews data");
      if (error) console.error("completed‑fetch", error);
      else setCompleted(data || []);
    };

    fetchCompleted();
  }, []);

  useEffect(() => {
    redirectIfNeeded('dashboard');
  }, [loading, step]);

  // Auto-open AddInterviewModal if code is in URL
  useEffect(() => {
    if (interviewCode && !addInterviewOpen) {
      setAddInterviewOpen(true);
    }
  }, [interviewCode, addInterviewOpen]);

  useEffect(() => {
    // Fetch pending interviews for the user
    const fetchPending = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;
      // Fetch interviews the user is a participant in and are not completed
      const { data, error } = await supabase
        .from("interview_participants")
        .select("interview:interview_id(*), status")
        .eq("user_id", userId)
        .not("status", "eq", "completed");
      if (error) {
        console.error("pending‑fetch", error);
        setPendingInterviews([
          {
            id: "sample-1",
            title: "Sample Interview",
            scheduledDate: "April 30, 2025",
            company: "SampleCorp",
            logo: "S",
          },
        ]);
      } else {
        // Map to PendingInterview shape
        const mapped = (data || []).map((row: any) => {
          const interview = row.interview;
          return {
            id: interview.id,
            title: interview.title || "Interview",
            scheduledDate: interview.scheduled_date || "TBD",
            company: interview.company || "Unknown",
            logo: (interview.company || "?").charAt(0).toUpperCase(),
          };
        });
        setPendingInterviews([
          {
            id: "sample-1",
            title: "Sample Interview",
            scheduledDate: "April 30, 2025",
            company: "SampleCorp",
            logo: "S",
          },
          ...mapped,
        ]);
      }
    };
    fetchPending();
  }, []);

  const refreshDashboard = () => {
    // Refresh completed interviews
    const fetchCompleted = async () => {
      const { data, error } = await supabase
        .from("interview_participants")
        .select("*, interview:interview_id(*)")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .eq("completed", true)
        .order("completed_at", { ascending: false });
      if (error) console.error("completed‑fetch", error);
      else setCompleted(data || []);        

    };
      
    fetchCompleted();
  };

  if (loading || step !== 'dashboard') {
    return <LoadingFallback />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        Loading Dashboard...
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <ProfileForm onSubmit={updateProfile} profileData={profileData || undefined} />
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        {/* Floating background elements */}
        {floatingElements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/10"
            initial={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.3, 0.1],
              scale: [1, 1.2, 0.9, 1.1],
              x: [0, 30, -20, 15, 0],
              y: [0, -30, 20, -15, 0],
            }}
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}

        {/* Main gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/30 via-purple-600/20 to-transparent blur-3xl"
        />

        <div className="relative z-10 container mx-auto p-6">
          {/* Top header */}
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Candidate Dashboard
            </motion.h1>
            <motion.button
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={() => setAddInterviewOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl font-medium flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add Interview</span>
            </motion.button>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Content */}
          {activeTab === "pending" && (
            <PendingInterviews pendingInterviews={pendingInterviews} />
          )}

          {activeTab === "completed" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-green-400"
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
                  Completed Interviews
                </h2>
                <div className="text-sm text-gray-400">
                  <select className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>All time</option>
                    <option>This month</option>
                    <option>Last month</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-8 text-center">
                {completed.length === 0 ? (
                  <div className="bg-gray-800/50 rounded-xl p-8 text-center">
                    <p className="text-gray-400">
                      Your completed interviews will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {completed.map((row, i) => (
                      <button
                        key={row.id}
                        onClick={() => setOpenIdx(i)}
                        className="bg-gray-800/60 hover:bg-gray-700/70 border border-gray-700 rounded-xl p-6 text-left transition-all shadow-md hover:shadow-blue-900/30"
                      >
                        <h4 className="text-white font-medium text-lg mb-1">
                          {row.interview.title || "Interview"}
                        </h4>
                        <p className="text-sm text-gray-400 mb-2">
                          {new Date(row.completed_at).toLocaleDateString()}
                        </p>
                        <div className="text-blue-400 text-xs">
                          Click to view details
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Your Interview Stats
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-1">Average Score</div>
                  <div className="text-3xl font-bold text-white flex items-end">
                    82<span className="text-green-400 text-xl ml-1">/100</span>
                  </div>
                  <div className="h-1 w-full bg-gray-700 mt-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                      style={{ width: "82%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-1">
                    Interviews Completed
                  </div>
                  <div className="text-3xl font-bold text-white">4</div>
                  <div className="text-green-400 text-sm mt-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    +2 this month
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                  <div className="text-gray-400 text-sm mb-1">Top Skill</div>
                  <div className="text-2xl font-bold text-white">
                    Problem Solving
                  </div>
                  <div className="flex items-center mt-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${i < 4 ? "text-yellow-400" : "text-gray-600"
                          }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  Skill Performance
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Problem Solving", score: 85, color: "blue" },
                    { name: "Technical Knowledge", score: 78, color: "purple" },
                    { name: "Communication", score: 92, color: "green" },
                    { name: "System Design", score: 65, color: "yellow" },
                  ].map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-300">{skill.name}</span>
                        <span className={`text-sm text-${skill.color}-300`}>
                          {skill.score}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div
                          className={`h-full bg-gradient-to-r from-${skill.color}-500 to-${skill.color}-400 rounded-full`}
                          style={{ width: `${skill.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Interview Details Modal */}
        {openIdx !== null && completed[openIdx] && (
          <InterviewDetailsModal
            interview={completed[openIdx]}
            onClose={() => setOpenIdx(null)}
          />
        )}
      </div>

      {/* Add Interview Modal */}
      {addInterviewOpen && (
        <AddInterviewModal
          onClose={() => setAddInterviewOpen(false)}
          onSuccess={(newInterview) => {
            if (newInterview) {
              // Add to pending interviews
              setPendingInterviews((prev) => [
                {
                  id: newInterview.id,
                  title: newInterview.title || "Interview",
                  scheduledDate: newInterview.scheduled_date || "TBD",
                  company: newInterview.company || "Unknown",
                  logo: (newInterview.company || "?").charAt(0).toUpperCase(),
                },
                ...prev,
              ]);
            } else {
              refreshDashboard();
            }
          }}
          initialCode={interviewCode || undefined}
        />
      )}
    </Suspense>
  );
}

// Simple fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      Loading Dashboard...
    </div>
  );
}
