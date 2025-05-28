"use client";
import { useState, useEffect, Suspense } from "react"; // Import Suspense
import { createClient } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

export default function CandidateDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>(
    []
  );
  const [completed, setCompleted] = useState<any[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null); // modal
  const supabase = createClient();

  const toObj = (v: any) =>
    typeof v === "string" && v.trim().length ? JSON.parse(v) : v ?? {};

  const row = openIdx !== null ? completed[openIdx] : null;
  const scores = row ? toObj(row.behavioral_scores) : {};
  const comm = row ? toObj(row.communication_analysis) : {};
  const emot = row ? toObj(row.emotion_results) : {};
  // Generate random floating elements on mount

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
        .from("interview_answers")
        .select("*")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .order("created_at", { ascending: false });
      console.log("successfully retrieved supabase data");
      if (error) console.error("completed‑fetch", error);
      else setCompleted(data || []);
    };

    fetchCompleted();
  }, []);

  // For demonstration, using dummy pending interview data:
  const pendingInterviews = [
    {
      id: "1",
      title: "Interview: Frontend Developer",
      scheduledDate: "April 15, 2025",
      company: "TechInnovate",
      logo: "T",
    },
    {
      id: "2",
      title: "Interview: UX Designer",
      scheduledDate: "April 18, 2025",
      company: "DesignCraft",
      logo: "D",
    },
  ];

  // Handler for starting/resuming an interview
  const handleStartInterview = (interviewId: string) => {
    // router.push(`/interview/${interviewId}`);
    router.push("/candidates");
  };

  // Handler for profile navigation
  const handleNavigateToProfile = () => {
    router.push("/candidates/profile");
  };

  return (
    // Wrap the entire content in Suspense
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
          {/* Top header and profile section */}
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Candidate Dashboard
            </motion.h1>
          </div>

          {/* Improved modern menu bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-2 mb-8 sticky top-4 z-20 shadow-xl border border-gray-700/50"
          >
            <div className="flex flex-wrap justify-between">
              <div className="flex space-x-1 md:space-x-2">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 ${
                    activeTab === "pending"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
                      : "text-gray-300 hover:bg-gray-700/70"
                  }`}
                >
                  Pending Interviews
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 ${
                    activeTab === "completed"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
                      : "text-gray-300 hover:bg-gray-700/70"
                  }`}
                >
                  Completed Interviews
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 ${
                    activeTab === "stats"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
                      : "text-gray-300 hover:bg-gray-700/70"
                  }`}
                >
                  Stats
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => router.push("/")}
                  className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 
                    text-gray-300 hover:bg-gray-700/70 flex items-center gap-1`}
                >
                  <HomeIcon className="h-4 w-4" />
                  <span>Home</span>
                </button>

                <button
                  onClick={handleNavigateToProfile}
                  className={`px-3 py-2 md:px-4 md:py-2 text-sm rounded-xl transition-all duration-300 
                    text-gray-300 hover:bg-gray-700/70 flex items-center gap-1`}
                >
                  <PersonIcon className="h-4 w-4" />
                  <span>My Profile</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Tab Content with staggered animations */}
          {activeTab === "pending" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Your Pending Interviews
              </h2>

              {pendingInterviews.length === 0 ? (
                <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-500 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-400">
                    No pending interviews at the moment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingInterviews.map((interview, index) => (
                    <motion.div
                      key={interview.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden shadow-xl hover:shadow-blue-900/20 transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {interview.logo}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {interview.title}
                            </h3>
                            <p className="text-blue-300 mb-1">
                              {interview.company}
                            </p>
                            <div className="flex items-center text-gray-400 text-sm">
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
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {interview.scheduledDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-700/50">
                        <button
                          onClick={() => handleStartInterview(interview.id)}
                          className="w-full py-4 text-center font-medium text-white bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                        >
                          Start Interview
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-500 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                {completed.length === 0 ? (
                  <div className="bg-gray-800/50 … rounded-xl p-8 text-center">
                    <p className="text-gray-400">
                      Your completed interviews will appear here.
                    </p>
                  </div>
                ) : (
                  /*  -------- step 3: buttons for each completed interview -------- */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {completed.map((row, i) => (
                      <button
                        key={row.id}
                        onClick={() => setOpenIdx(i)}
                        className="bg-gray-800/60 hover:bg-gray-700/70 border border-gray-700 rounded-xl p-6 text-left transition-all shadow-md hover:shadow-blue-900/30"
                      >
                        <h4 className="text-white font-medium text-lg mb-1">
                          {row.question_text || "Interview"}
                        </h4>
                        <p className="text-sm text-gray-400 mb-2">
                          {new Date(row.created_at).toLocaleDateString()}
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
                  <div className="text-gray-400 text-sm mb-1">
                    Average Score
                  </div>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">
                  Skill Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">
                        Problem Solving
                      </span>
                      <span className="text-sm text-blue-300">85%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">
                        Technical Knowledge
                      </span>
                      <span className="text-sm text-purple-300">78%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">
                        Communication
                      </span>
                      <span className="text-sm text-green-300">92%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">
                        System Design
                      </span>
                      <span className="text-sm text-yellow-300">65%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        {/* ───────── Modal ───────── */}
        {openIdx !== null && completed[openIdx] ? (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 w-full max-w-3xl mx-4 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
                <h4 className="text-lg font-semibold text-white">
                  Interview Details
                </h4>
                <button
                  onClick={() => setOpenIdx(null)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <CloseIcon />
                </button>
              </div>
              {/* ───── pretty modal content – replace the <pre> block with this  ───── */}
              {(() => {
                const row = completed[openIdx]; // the active interview
                const scores = row.behavioral_scores ?? {}; // parsed objects are already JSONB
                const comm = row.communication_analysis ?? {};
                const emot = row.emotion_results ?? {};

                return (
                  <div className="divide-y divide-gray-700 overflow-auto max-h-[70vh]">
                    {/* top summary */}
                    <section className="p-6 space-y-2">
                      <h5 className="text-xl font-semibold text-white">
                        {row.question_text || "Interview"}
                      </h5>
                      <p className="text-sm text-gray-400">
                        Completed&nbsp;
                        {new Date(row.created_at).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                        <h6 className="text-sm font-medium text-gray-300 mb-1">
                          AI Summary
                        </h6>
                        <p className="text-gray-100 text-sm whitespace-pre-wrap">
                          {row.summary || "—"}
                        </p>
                      </div>
                    </section>

                    {/* behavioural & comm scores */}
                    <section className="grid md:grid-cols-2 gap-px bg-gray-700/50">
                      {/* behavioural */}
                      <div className="p-6 bg-gray-900">
                        <h6 className="text-sm font-medium text-gray-300 mb-4">
                          Behavioural Scores
                        </h6>
                        {Object.keys(scores).length === 0 ? (
                          <p className="text-gray-500 text-sm">
                            No scores available.
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {Object.entries(scores).map(([k, v]) => (
                              <li key={k} className="flex justify-between">
                                <span className="text-gray-400 text-sm capitalize">
                                  {k}
                                </span>
                                <span className="text-white text-sm font-medium">
                                  {String(v)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* communication */}
                      <div className="p-6 bg-gray-900">
                        <h6 className="text-sm font-medium text-gray-300 mb-4">
                          Communication Analysis
                        </h6>
                        {Object.keys(comm).length === 0 ? (
                          <p className="text-gray-500 text-sm">
                            No data available.
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {Object.entries(comm).map(([key, value]) => (
                              <li key={key} className="flex justify-between">
                                <span className="text-gray-400 text-sm capitalize">
                                  {key}
                                </span>
                                <span className="text-white text-sm font-medium">
                                  {String(value)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </section>

                    {/* emotions */}
                    {/* <section className="p-6">
                      <h6 className="text-sm font-medium text-gray-300 mb-4">
                        Detected Emotions{" "}
                        <span className="text-gray-500">(top 3)</span>
                      </h6>
                      {Object.keys(emot).length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No emotion data.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(emot)
                            .sort((a, b) => Number(b[1]) - Number(a[1]))
                            .slice(0, 3)
                            .map(([emo, val]) => (
                              <span
                                key={emo}
                                className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-300"
                              >
                                {emo}&nbsp;{Math.round(Number(val) * 100)}%
                              </span>
                            ))}
                        </div>
                      )}
                    </section> */}

                    {/* collapsible transcript */}
                    <details className="p-6 bg-gray-800/50 border-t border-gray-700 group">
                      <summary className="cursor-pointer text-gray-300 text-sm select-none flex items-center gap-2">
                        <svg
                          className="h-4 w-4 transform transition-transform group-open:rotate-90"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        Full Transcript
                      </summary>
                      <pre className="mt-4 max-h-56 overflow-y-auto whitespace-pre-wrap text-gray-200 text-xs leading-relaxed">
                        {row.transcript || "—"}
                      </pre>
                    </details>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : openIdx !== null ? (
          <div className="fixed inset-0 flex items-center justify-center z-50 text-white">
            Loading interview details...
          </div>
        ) : null}
      </div>
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
