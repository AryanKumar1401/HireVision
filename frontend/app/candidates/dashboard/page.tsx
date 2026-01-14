"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/auth";
import { motion, AnimatePresence } from "framer-motion";
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
  const [completed, setCompleted] = useState<any[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [addInterviewOpen, setAddInterviewOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, showProfileForm, profileData, updateProfile } = useProfile();
  const { loading, step, redirectIfNeeded } = useCandidateOnboardingStep();
  const [pendingInterviews, setPendingInterviews] = useState<any[]>([]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    router.push("/login");
  };

  const interviewCode = searchParams.get('code');

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) return;

        const { data, error } = await supabase
          .from("interview_participants")
          .select("*, interview:interview_id(*)")
          .eq("user_id", userId)
          .eq("completed", true)
          .order("joined_at", { ascending: false });
        
        if (error) {
          console.error("completed‑fetch", error);
        } else {
          setCompleted(data || []);
        }
      } catch (err) {
        console.error("completed‑fetch error:", err);
      }
    };

    fetchCompleted();
  }, []);

  useEffect(() => {
    redirectIfNeeded('dashboard');
  }, [loading, step]);

  useEffect(() => {
    if (interviewCode && !addInterviewOpen) {
      setAddInterviewOpen(true);
    }
  }, [interviewCode, addInterviewOpen]);

  useEffect(() => {
    const fetchPending = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;
      const { data, error } = await supabase
        .from("interview_participants")
        .select("interview:interview_id(*), status")
        .eq("user_id", userId)
        .eq("completed", false);
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
    const fetchCompleted = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        if (!userId) return;

        const { data, error } = await supabase
          .from("interview_participants")
          .select("*, interview:interview_id(*)")
          .eq("user_id", userId)
          .eq("completed", true)
          .order("joined_at", { ascending: false });
        
        if (error) {
          console.error("completed‑fetch", error);
        } else {
          setCompleted(data || []);
        }
      } catch (err) {
        console.error("completed‑fetch error:", err);
      }
    };
      
    fetchCompleted();
  };

  if (loading || step !== 'dashboard') {
    return <LoadingFallback />;
  }

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (showProfileForm) {
    return (
      <ProfileForm onSubmit={updateProfile} profileData={profileData || undefined} />
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen bg-[var(--surface-dark)] relative overflow-hidden dashboard-scroll">
        {/* Layered background effects */}
        <div className="fixed inset-0 mesh-gradient pointer-events-none" />
        <div className="fixed inset-0 grid-pattern pointer-events-none opacity-50" />
        
        {/* Decorative corner accents */}
        <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[var(--accent-tertiary)]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 min-h-screen">
          {/* Header Section */}
          <header className="border-b border-[var(--border-subtle)] bg-[var(--surface-dark)]/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="container mx-auto px-6 py-5">
              <div className="flex justify-between items-center">
        <motion.div
                  initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                >
                  <span className="text-[var(--text-muted)] text-sm font-mono tracking-wider uppercase">Dashboard</span>
                  <h1 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] tracking-tight">
                    Welcome Back
                  </h1>
                </motion.div>
                
                <motion.div 
                  initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                  className="flex items-center gap-3"
                >
                  <button
                onClick={() => setAddInterviewOpen(true)}
                    className="btn-accent px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 font-medium"
              >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Interview</span>
                  </button>
                  
                  <button
                onClick={handleLogout}
                    className="px-4 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all duration-200 flex items-center gap-2 border border-[var(--border-subtle)]"
              >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4.5A1.5 1.5 0 014.5 3h7a1.5 1.5 0 011.5 1.5v3a.75.75 0 01-1.5 0v-3h-7v15h7v-3a.75.75 0 011.5 0v3A1.5 1.5 0 0111.5 21h-7A1.5 1.5 0 013 19.5v-15z" clipRule="evenodd" />
                  <path d="M16.28 8.22a.75.75 0 10-1.06 1.06L17.94 12l-2.72 2.72a.75.75 0 101.06 1.06l3.25-3.25a.75.75 0 000-1.06l-3.25-3.25z" />
                </svg>
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-6 py-8">
          {/* Navigation Menu */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
          <NavigationMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            </motion.div>

            {/* Tab Content with AnimatePresence for smooth transitions */}
            <AnimatePresence mode="wait">
          {activeTab === "pending" && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
            <PendingInterviews pendingInterviews={pendingInterviews} />
                </motion.div>
          )}

          {activeTab === "completed" && (
            <motion.div
                  key="completed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-6xl mx-auto"
            >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-[var(--text-primary)] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                        </div>
                  Completed Interviews
                </h2>
                      <p className="text-[var(--text-muted)] text-sm mt-1 ml-13">Review your past interview performances</p>
                    </div>
                    
                    <select className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)]/50 transition-colors">
                    <option>All time</option>
                    <option>This month</option>
                    <option>Last month</option>
                  </select>
              </div>

                {completed.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[var(--surface-elevated)] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="text-[var(--text-secondary)] text-lg">No completed interviews yet</p>
                      <p className="text-[var(--text-muted)] text-sm mt-1">Your completed interviews will appear here</p>
                  </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {completed.map((row, i) => (
                        <motion.button
                        key={row.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        onClick={() => setOpenIdx(i)}
                          className="glass-card glass-card-hover rounded-2xl p-6 text-left transition-all duration-300 group"
                      >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-[var(--text-primary)] font-medium text-lg mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                          {row.interview.title || "Interview"}
                        </h4>
                              <p className="text-[var(--text-muted)] text-sm font-mono">
                                {new Date(row.joined_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                        </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                            <span className="text-[var(--accent-primary)] text-sm font-medium">View Details</span>
                            <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        </motion.button>
                    ))}
                  </div>
                )}
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-6xl mx-auto"
            >
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-[var(--text-primary)] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                      </div>
                      Performance Analytics
              </h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1 ml-13">Track your interview progress and skill development</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass-card rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[var(--text-muted)] text-sm font-medium">Average Score</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                  </div>
                </div>
                      <div className="text-4xl font-semibold text-[var(--text-primary)]">
                        82<span className="text-lg text-[var(--text-muted)] font-normal">/100</span>
                      </div>
                      <div className="mt-4 h-2 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "82%" }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                        />
                  </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass-card rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[var(--text-muted)] text-sm font-medium">Interviews</span>
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-4xl font-semibold text-[var(--text-primary)]">4</div>
                      <div className="mt-4 flex items-center text-emerald-400 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    +2 this month
                  </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="glass-card rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[var(--text-muted)] text-sm font-medium">Top Skill</span>
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-tertiary)]/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-[var(--accent-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                </div>
                  </div>
                      <div className="text-xl font-semibold text-[var(--text-primary)]">Problem Solving</div>
                      <div className="mt-4 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                            className={`w-5 h-5 ${i < 4 ? 'text-[var(--accent-primary)]' : 'text-[var(--surface-elevated)]'}`} 
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                    </motion.div>
              </div>

                  {/* Skills Breakdown */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-6">Skill Performance</h3>
                    <div className="space-y-5">
                  {[
                        { name: "Problem Solving", score: 85, color: "var(--accent-primary)" },
                        { name: "Technical Knowledge", score: 78, color: "var(--accent-secondary)" },
                        { name: "Communication", score: 92, color: "var(--accent-tertiary)" },
                        { name: "System Design", score: 65, color: "#a78bfa" },
                      ].map((skill, idx) => (
                    <div key={skill.name}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-[var(--text-secondary)]">{skill.name}</span>
                            <span className="text-sm font-mono" style={{ color: skill.color }}>{skill.score}%</span>
                      </div>
                          <div className="h-2 bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.score}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)` }}
                            />
                      </div>
                    </div>
                  ))}
                </div>
                  </motion.div>
            </motion.div>
          )}
            </AnimatePresence>
          </main>
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

function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--surface-dark)]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full"
      />
      <p className="text-[var(--text-muted)] mt-4 font-medium">Loading Dashboard...</p>
    </div>
  );
}
