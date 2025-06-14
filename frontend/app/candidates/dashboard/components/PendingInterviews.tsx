import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface PendingInterview {
    id: string;
    title: string;
    scheduledDate: string;
    company: string;
    logo: string;
}

interface PendingInterviewsProps {
    pendingInterviews: PendingInterview[];
}

export default function PendingInterviews({ pendingInterviews }: PendingInterviewsProps) {
    const router = useRouter();

    const handleStartInterview = (interviewId: string) => {
        router.push("/candidates");
    };

    return (
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
                    <p className="text-gray-400">No pending interviews at the moment.</p>
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
                                        <p className="text-blue-300 mb-1">{interview.company}</p>
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
    );
} 