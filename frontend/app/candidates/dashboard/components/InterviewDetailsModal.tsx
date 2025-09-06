import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/auth";

interface InterviewDetailsModalProps {
    interview: any;
    onClose: () => void;
}

export default function InterviewDetailsModal({ interview, onClose }: InterviewDetailsModalProps) {
    const [interviewAnswers, setInterviewAnswers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchInterviewAnswers = async () => {
            try {
                // Get the user ID from the interview participant record
                const userId = interview.user_id;

                // Fetch all interview answers for this user
                const { data: answers, error } = await supabase
                    .from("interview_answers")
                    .select("*")
                    .eq("user_id", userId)
                    .order("question_index", { ascending: true });

                if (error) {
                    console.error("Error fetching interview answers:", error);
                } else {
                    setInterviewAnswers(answers || []);
                }
            } catch (error) {
                console.error("Error in fetchInterviewAnswers:", error);
            } finally {
                setLoading(false);
            }
        };

        if (interview) {
            fetchInterviewAnswers();
        }
    }, [interview]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gray-900 w-full max-w-3xl mx-4 rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
                        <h4 className="text-lg font-semibold text-white">Interview Details</h4>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
                        <p className="text-gray-400 mt-4">Loading interview responses...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 w-full max-w-4xl mx-4 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
                    <h4 className="text-lg font-semibold text-white">Interview Details</h4>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        <CloseIcon />
                    </button>
                </div>

                <div className="divide-y divide-gray-700 overflow-auto max-h-[70vh]">
                    {/* Interview Summary */}
                    <section className="p-6 space-y-2">
                        <h5 className="text-xl font-semibold text-white">
                            {interview.interview?.title || "Interview"}
                        </h5>
                        <p className="text-sm text-gray-400">
                            Joined&nbsp;
                            {new Date(interview.joined_at).toLocaleString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                        <p className="text-sm text-gray-400">
                            {interviewAnswers.length} question{interviewAnswers.length !== 1 ? 's' : ''} answered
                        </p>
                    </section>

                    {/* Interview Responses */}
                    <section className="p-6">
                        <h6 className="text-lg font-medium text-white mb-4">Your Responses</h6>
                        {interviewAnswers.length === 0 ? (
                            <p className="text-gray-500 text-sm">No responses found for this interview.</p>
                        ) : (
                            <div className="space-y-6">
                                {interviewAnswers.map((answer, index) => (
                                    <div key={answer.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="text-sm font-medium text-blue-300">
                                                Question {answer.question_index + 1}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(answer.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <p className="text-sm text-gray-300 mb-2">
                                                <strong>Question:</strong> {answer.question_text}
                                            </p>
                                        </div>

                                        {answer.summary && (
                                            <div className="mb-3">
                                                <div className="text-xs font-medium text-gray-400 mb-1">AI Summary</div>
                                                <p className="text-sm text-gray-100 whitespace-pre-wrap">
                                                    {answer.summary}
                                                </p>
                                            </div>
                                        )}

                                        {answer.behavioral_insights && (
                                            <div className="mb-3">
                                                <div className="text-xs font-medium text-gray-400 mb-1">Behavioral Insights</div>
                                                <div className="text-sm text-gray-100">
                                                    {typeof answer.behavioral_insights === 'string'
                                                        ? answer.behavioral_insights
                                                        : JSON.stringify(answer.behavioral_insights, null, 2)}
                                                </div>
                                            </div>
                                        )}

                                        {answer.transcript && (
                                            <details className="mt-3">
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
                                                    View Transcript
                                                </summary>
                                                <pre className="mt-2 max-h-32 overflow-y-auto whitespace-pre-wrap text-gray-200 text-xs leading-relaxed bg-gray-900/50 p-2 rounded">
                                                    {answer.transcript}
                                                </pre>
                                            </details>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
} 