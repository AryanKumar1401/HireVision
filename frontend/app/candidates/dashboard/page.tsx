"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CandidateDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");

  // For demonstration, using dummy pending interview data:
  const pendingInterviews = [
    { id: "1", title: "Interview: Frontend Developer", scheduledDate: "April 15, 2025" },
    { id: "2", title: "Interview: UX Designer", scheduledDate: "April 18, 2025" },
  ];

  // Handler for starting/resuming an interview; adjust route as needed.
  const handleStartInterview = (interviewId: string) => {
    // Redirect candidate to the interview process page.
    router.push("/candidates");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Background animated element */}
      <motion.div
        initial={{ opacity: 0.6, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-600 via-purple-600 to-transparent blur-3xl"
      />

      <div className="relative z-10 p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
          Candidate Dashboard
        </h1>

        {/* Tabs Navigation */}
        <div className="flex justify-center space-x-6 mb-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 font-medium rounded transition-colors duration-200 ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Pending Interviews
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 font-medium rounded transition-colors duration-200 ${
              activeTab === "completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Completed Interviews
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 font-medium rounded transition-colors duration-200 ${
              activeTab === "stats"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            My Stats
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "pending" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your Pending Interviews
            </h2>
            {pendingInterviews.length === 0 ? (
              <p className="text-gray-400">No pending interviews at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg transition-transform hover:scale-105"
                  >
                    <h3 className="text-xl font-bold text-white">
                      {interview.title}
                    </h3>
                    <p className="text-gray-400 mt-2">
                      Scheduled for: {interview.scheduledDate}
                    </p>
                    <button
                      onClick={() => handleStartInterview(interview.id)}
                      className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Start Interview
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "completed" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Completed Interviews
            </h2>
            <p className="text-gray-400">
              Your completed interviews will appear here.
            </p>
          </div>
        )}
        {activeTab === "stats" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your Interview Stats
            </h2>
            <p className="text-gray-400">
              View your performance trends, feedback, and tips to improve your
              interview skills.
            </p>
            {/* Replace with charts or statistics as needed */}
          </div>
        )}
      </div>
    </div>
  );
}
