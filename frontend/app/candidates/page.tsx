"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/auth";
import NavigationMenu from "./dashboard/components/NavigationMenu";
import PendingInterviews from "./dashboard/components/PendingInterviews";
import InterviewDetailsModal from "./dashboard/components/InterviewDetailsModal";
import { useProfile } from "@/hooks/useProfile";
import { ProfileForm } from "./components/ProfileForm";
import { useCandidateOnboardingStep } from '@/hooks/useCandidateOnboardingStep';
import AddInterviewModal from "./components/AddInterviewModal";

type FloatingElement = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

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
      if (error && Object.keys(error).length > 0) console.error("completed-fetch", error);
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
        console.error("pending-fetch", error);
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
      if (error && Object.keys(error).length > 0) console.error("completed-fetch", error);
      else setCompleted(data || []);        
    };
    fetchCompleted();
  };

  if (loading || step !== 'dashboard') {
    return <div>Loading Dashboard...</div>;
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
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        {/* Improved background with subtle animated particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl" />

        {floatingElements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-600/5 to-purple-600/5"
            style={{
              width: `${el.size}px`,
              height: `${el.size}px`,
              left: `${el.x}%`,
              top: `${el.y}%`,
              animationDuration: `${el.duration}s`,
              animationDelay: `${el.delay}s`,
            }}
          />
        ))}

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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-8 text-center"
            >
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
            </motion.div>
          )}

          <div className="mt-12" />

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
      </div>
    </Suspense>
  );
}
