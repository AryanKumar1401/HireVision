import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
                const userId = interview.user_id;

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

        return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-[var(--surface-elevated)] w-full max-w-4xl rounded-2xl border border-[var(--border-subtle)] overflow-hidden shadow-2xl shadow-black/50"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--surface-dark)]/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-[var(--text-primary)]">Interview Details</h4>
                                <p className="text-xs text-[var(--text-muted)] font-mono">
                                    {interview.interview?.title || "Interview"} • Completed
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 rounded-xl bg-[var(--surface-card)] hover:bg-white/5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all border border-[var(--border-subtle)]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-10 h-10 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full mx-auto"
                            />
                            <p className="text-[var(--text-muted)] mt-4">Loading interview responses...</p>
                </div>
                    ) : (
                        <div className="divide-y divide-[var(--border-subtle)] overflow-auto max-h-[70vh] dashboard-scroll">
                    {/* Interview Summary */}
                            <section className="p-6">
                                <div className="glass-card rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h5 className="text-xl font-semibold text-[var(--text-primary)]">
                            {interview.interview?.title || "Interview"}
                        </h5>
                                        <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="font-mono text-xs">
                            {new Date(interview.joined_at).toLocaleString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{interviewAnswers.length} question{interviewAnswers.length !== 1 ? 's' : ''} answered</span>
                                        </div>
                                    </div>
                                </div>
                    </section>

                    {/* Interview Responses */}
                    <section className="p-6">
                                <h6 className="text-lg font-medium text-[var(--text-primary)] mb-5 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Your Responses
                                </h6>
                                
                        {interviewAnswers.length === 0 ? (
                                    <div className="glass-card rounded-xl p-8 text-center">
                                        <p className="text-[var(--text-muted)]">No responses found for this interview.</p>
                                    </div>
                        ) : (
                                    <div className="space-y-4">
                                {interviewAnswers.map((answer, index) => (
                                            <motion.div 
                                                key={answer.id} 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="glass-card rounded-xl p-5"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] text-sm font-bold">
                                                            {answer.question_index + 1}
                                                        </span>
                                                        <span className="text-sm font-medium text-[var(--text-secondary)]">Question</span>
                                            </div>
                                                    <span className="text-xs text-[var(--text-muted)] font-mono">
                                                {new Date(answer.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                                <div className="mb-4 pl-11">
                                                    <p className="text-[var(--text-primary)]">
                                                        {answer.question_text}
                                            </p>
                                        </div>

                                        {answer.summary && (
                                                    <div className="mb-4 pl-11">
                                                        <div className="text-xs font-medium text-[var(--accent-tertiary)] mb-2 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                            </svg>
                                                            AI Summary
                                                        </div>
                                                        <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                                                    {answer.summary}
                                                </p>
                                            </div>
                                        )}

                                        {answer.behavioral_insights && (
                                                    <div className="mb-4 pl-11">
                                                        <div className="text-xs font-medium text-purple-400 mb-2 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                            </svg>
                                                            Behavioral Insights
                                                        </div>
                                                        <div className="text-sm text-[var(--text-secondary)]">
                                                    {typeof answer.behavioral_insights === 'string'
                                                        ? answer.behavioral_insights
                                                        : JSON.stringify(answer.behavioral_insights, null, 2)}
                                                </div>
                                            </div>
                                        )}

                                        {answer.transcript && (
                                                    <details className="pl-11 group">
                                                        <summary className="cursor-pointer text-[var(--text-muted)] text-sm select-none flex items-center gap-2 hover:text-[var(--text-secondary)] transition-colors">
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
                                                            View Full Transcript
                                                </summary>
                                                        <pre className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap text-[var(--text-secondary)] text-xs leading-relaxed bg-[var(--surface-dark)] p-4 rounded-lg border border-[var(--border-subtle)] dashboard-scroll">
                                                    {answer.transcript}
                                                </pre>
                                            </details>
                                        )}
                                            </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
