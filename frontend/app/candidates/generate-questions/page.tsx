"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/auth";
import { getBackendUrl } from "@/utils/env";
import { motion } from "framer-motion";

interface Experience {
    company: string;
    title: string;
    dates: string;
    bullets: string[];
    questions: string[];
}

interface ResumeResult {
    experiences: Experience[];
    total_experiences: number;
    error?: string;
}

export default function GenerateQuestionsPage() {
    const [questions, setQuestions] = useState<{ question: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            setError(null);
            try {
                // Get current user ID
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) {
                    setError("Could not get user ID. Please log in again.");
                    setLoading(false);
                    return;
                }
                // Call the backend API
                const response = await fetch(`${getBackendUrl()}/get-personalized-questions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: user.id }),
                });
                const data = await response.json();
                if (!response.ok || !data.questions) {
                    setError(data.error || "Failed to fetch personalized questions");
                    setLoading(false);
                    return;
                }
                setQuestions(data.questions);
            } catch (err) {
                setError("Failed to fetch personalized questions. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleBack = () => {
        router.push("/candidates/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center mb-8"
                >
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-white">Your Personalized Interview Questions</h1>
                </motion.div>

                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-400">Fetching your personalized questions...</p>
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                            {error}
                        </div>
                    )}
                    {!loading && !error && questions.length > 0 && (
                        <div className="space-y-6">
                            {questions.map((q, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                                >
                                    <div className="text-white font-medium mb-2">Question {idx + 1}</div>
                                    <div className="text-gray-200">{q.question}</div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    {!loading && !error && questions.length === 0 && (
                        <div className="text-gray-400 text-center py-12">
                            No personalized questions found. Please upload your resume first.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 