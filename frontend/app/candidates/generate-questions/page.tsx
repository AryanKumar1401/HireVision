"use client";
import { useState } from "react";
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
    const [resumeText, setResumeText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResumeResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleGenerateQuestions = async () => {
        if (!resumeText.trim()) {
            setError("Please enter your resume text");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Get current user ID
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                setError("Could not get user ID. Please log in again.");
                setLoading(false);
                return;
            }

            // Call the backend API
            const response = await fetch(`${getBackendUrl()}/generate-resume-questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    resume_text: resumeText,
                    user_id: user.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.detail || "Failed to generate questions");
                setLoading(false);
                return;
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError("Failed to generate questions. Please try again.");
            console.error("Error generating questions:", err);
        } finally {
            setLoading(false);
        }
    };

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
                    <h1 className="text-3xl font-bold text-white">Generate Interview Questions</h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Paste Your Resume</h2>
                        <p className="text-gray-300 mb-4">
                            Paste your resume text below to generate hyper-specific interview questions based on your experiences.
                        </p>
                        
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your resume text here... Include your work experiences with company names, titles, dates, and bullet points."
                            className="w-full h-96 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:border-blue-500 focus:outline-none"
                            disabled={loading}
                        />
                        
                        <button
                            onClick={handleGenerateQuestions}
                            disabled={loading || !resumeText.trim()}
                            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Generating Questions...
                                </div>
                            ) : (
                                "Generate Questions"
                            )}
                        </button>
                        
                        {error && (
                            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                                {error}
                            </div>
                        )}
                    </motion.div>

                    {/* Results Section */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Generated Questions</h2>
                        
                        {!result && !loading && (
                            <div className="text-gray-400 text-center py-12">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-600 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <p>Your generated questions will appear here</p>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-400">Analyzing your resume and generating questions...</p>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-6">
                                <div className="text-green-400 font-medium">
                                    Found {result.total_experiences} experience{result.total_experiences !== 1 ? 's' : ''}
                                </div>
                                
                                {result.experiences.map((experience, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                                    >
                                        <div className="mb-3">
                                            <h3 className="text-lg font-semibold text-white">
                                                {experience.company}
                                            </h3>
                                            <p className="text-blue-400 font-medium">
                                                {experience.title}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                {experience.dates}
                                            </p>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-300 mb-2">Key Responsibilities:</h4>
                                            <ul className="space-y-1">
                                                {experience.bullets.map((bullet, bulletIndex) => (
                                                    <li key={bulletIndex} className="text-gray-400 text-sm flex items-start">
                                                        <span className="text-blue-400 mr-2">•</span>
                                                        {bullet}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-300 mb-2">Generated Questions:</h4>
                                            <ol className="space-y-2">
                                                {experience.questions.map((question, questionIndex) => (
                                                    <li key={questionIndex} className="text-white text-sm">
                                                        <span className="text-blue-400 font-medium mr-2">
                                                            {questionIndex + 1}.
                                                        </span>
                                                        {question}
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 