"use client";
import { useState, useEffect, Suspense, useCallback } from "react";
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

// Types
interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface Interview {
  id: string;
  title: string;
  scheduled_date?: string;
  company?: string;
}

interface InterviewParticipant {
  id: string;
  interview_id: string;
  user_id: string;
  status: string;
  joined_at: string;
  completed: boolean;
  interview: Interview;
}

interface PendingInterview {
  id: string;
  title: string;
  scheduledDate: string;
  company: string;
  logo: string;
}

// Constants
const SAMPLE_INTERVIEW: PendingInterview = {
  id: "sample-1",
  title: "Sample Interview",
  scheduledDate: "April 30, 2025",
  company: "SampleCorp",
  logo: "S",
};

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [completed, setCompleted] = useState<InterviewParticipant[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [addInterviewOpen, setAddInterviewOpen] = useState(false);
  const [pendingInterviews, setPendingInterviews] = useState<PendingInterview[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, showProfileForm, profileData, updateProfile } = useProfile();
  const { loading, step, redirectIfNeeded } = useCandidateOnboardingStep();

  // Get interview code from URL if present
  const interviewCode = searchParams.get('code');

  // Initialize floating elements
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

  // Get current user ID
  const getCurrentUserId = useCallback(async (): Promise<string | null> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      return userData.user?.id || null;
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  }, [supabase.auth]);

  // Fetch completed interviews
  const fetchCompletedInterviews = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { data, error } = await supabase
        .from("interview_participants")
        .select("*, interview:interview_id(*)")
        .eq("user_id", userId)
        .eq("completed", true)
        .order("joined_at", { ascending: false });

      if (error) {
        console.error("Error fetching completed interviews:", error);
        return;
      }

      setCompleted(data || []);
    } catch (error) {
      console.error("Error in fetchCompletedInterviews:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [supabase, getCurrentUserId]);

  // Fetch pending interviews
  const fetchPendingInterviews = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { data, error } = await supabase
        .from("interview_participants")
        .select("interview:interview_id(*), status")
        .eq("user_id", userId)
        .eq("completed", false);

      if (error) {
        console.error("Error fetching pending interviews:", error);
        // Keep sample data on error
        setPendingInterviews([SAMPLE_INTERVIEW]);
        return;
      }

      // Map to PendingInterview shape
      const mapped = (data || []).map((row: any): PendingInterview => {
        const interview = row.interview;
        return {
          id: interview.id,
          title: interview.title || "Interview",
          scheduledDate: interview.scheduled_date || "TBD",
          company: interview.company || "Unknown",
          logo: (interview.company || "?").charAt(0).toUpperCase(),
        };
      });

      setPendingInterviews([SAMPLE_INTERVIEW, ...mapped]);
    } catch (error) {
      console.error("Error in fetchPendingInterviews:", error);
      setPendingInterviews([SAMPLE_INTERVIEW]);
    } finally {
      setIsLoadingData(false);
    }
  }, [supabase, getCurrentUserId]);

  // Load data on component mount
  useEffect(() => {
    fetchCompletedInterviews();
    fetchPendingInterviews();
  }, [fetchCompletedInterviews, fetchPendingInterviews]);

  // Handle onboarding redirect
  useEffect(() => {
    redirectIfNeeded('dashboard');
  }, [loading, step, redirectIfNeeded]);

  // Auto-open AddInterviewModal if code is in URL
  useEffect(() => {
    if (interviewCode && !addInterviewOpen) {
      setAddInterviewOpen(true);
    }
  }, [interviewCode, addInterviewOpen]);

  // Refresh dashboard data
  const refreshDashboard = useCallback(() => {
    fetchCompletedInterviews();
  }, [fetchCompletedInterviews]);

  // Handle new interview success
  const handleInterviewSuccess = useCallback((newInterview: Interview | null) => {
    if (newInterview) {
      // Add to pending interviews
      const newPendingInterview: PendingInterview = {
        id: newInterview.id,
        title: newInterview.title || "Interview",
        scheduledDate: newInterview.scheduled_date || "TBD",
        company: newInterview.company || "Unknown",
        logo: (newInterview.company || "?").charAt(0).toUpperCase(),
      };

      setPendingInterviews((prev) => [newPendingInterview, ...prev]);
    } else {
      refreshDashboard();
    }
  }, [refreshDashboard]);

  // Loading states
  if (loading || step !== 'dashboard') {
    return <LoadingSpinner message="Loading Dashboard..." />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading Dashboard..." />;
  }

  if (showProfileForm) {
    return (
      <ProfileForm onSubmit={updateProfile} profileData={profileData || undefined} />
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        {/* Background with animated particles */}
        <BackgroundParticles elements={floatingElements} />

        <div className="relative z-10 container mx-auto p-6">
          {/* Header */}
          <DashboardHeader onAddInterview={() => setAddInterviewOpen(true)} />

          {/* Navigation Menu */}
          <NavigationMenu activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Content */}
          {activeTab === "pending" && (
            <PendingInterviews pendingInterviews={pendingInterviews} />
          )}

          {activeTab === "completed" && (
            <CompletedInterviews
              completed={completed}
              onInterviewClick={setOpenIdx}
              isLoading={isLoadingData}
            />
          )}

          <div className="mt-12" />

          {/* Modals */}
          {openIdx !== null && completed[openIdx] && (
            <InterviewDetailsModal
              interview={completed[openIdx]}
              onClose={() => setOpenIdx(null)}
            />
          )}

          {addInterviewOpen && (
            <AddInterviewModal
              onClose={() => setAddInterviewOpen(false)}
              onSuccess={handleInterviewSuccess}
              initialCode={interviewCode || undefined}
            />
          )}
        </div>
      </div>
    </Suspense>
  );
}

// Loading Spinner Component
function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p>{message}</p>
      </div>
    </div>
  );
}

// Background Particles Component
function BackgroundParticles({ elements }: { elements: FloatingElement[] }) {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl" />
      {elements.map((el) => (
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
    </>
  );
}

// Dashboard Header Component
function DashboardHeader({ onAddInterview }: { onAddInterview: () => void }) {
  return (
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
        onClick={onAddInterview}
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
  );
}

// Completed Interviews Component
function CompletedInterviews({
  completed,
  onInterviewClick,
  isLoading
}: {
  completed: InterviewParticipant[];
  onInterviewClick: (index: number) => void;
  isLoading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-8 text-center"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : completed.length === 0 ? (
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
              onClick={() => onInterviewClick(i)}
              className="bg-gray-800/60 hover:bg-gray-700/70 border border-gray-700 rounded-xl p-6 text-left transition-all shadow-md hover:shadow-blue-900/30"
            >
              <h4 className="text-white font-medium text-lg mb-1">
                {row.interview.title || "Interview"}
              </h4>
              <p className="text-sm text-gray-400 mb-2">
                {new Date(row.joined_at).toLocaleDateString()}
              </p>
              <div className="text-blue-400 text-xs">
                Click to view details
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
