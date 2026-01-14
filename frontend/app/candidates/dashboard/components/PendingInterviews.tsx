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
        router.push(`/candidates/interview?interview_id=${interviewId}`);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-semibold text-[var(--text-primary)] flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                        </div>
                        Upcoming Interviews
            </h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1 ml-13">
                        {pendingInterviews.length > 0 
                            ? `You have ${pendingInterviews.length} interview${pendingInterviews.length > 1 ? 's' : ''} scheduled`
                            : 'No interviews scheduled at the moment'
                        }
                    </p>
                </div>
                
                {pendingInterviews.length > 0 && (
                    <div className="hidden md:flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                        Ready to start
                    </div>
                )}
            </div>

            {pendingInterviews.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-2xl p-12 text-center"
                >
                    <div className="w-20 h-20 rounded-2xl bg-[var(--surface-elevated)] flex items-center justify-center mx-auto mb-5">
                        <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                    <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">No Pending Interviews</h3>
                    <p className="text-[var(--text-muted)] max-w-md mx-auto">
                        When you receive an interview invitation or add an interview code, it will appear here.
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {pendingInterviews.map((interview, index) => (
                        <motion.div
                            key={interview.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="glass-card glass-card-hover rounded-2xl overflow-hidden group"
                        >
                            {/* Card Content */}
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Company Logo/Initial */}
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[var(--surface-dark)] font-bold text-xl shadow-lg shadow-[var(--accent-primary)]/20">
                                        {interview.logo}
                                        </div>
                                        {/* Online indicator */}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--surface-dark)]" />
                                    </div>
                                    
                                    {/* Interview Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                                            {interview.title}
                                        </h3>
                                        <p className="text-[var(--accent-primary)]/80 text-sm font-medium mb-2">
                                            {interview.company}
                                        </p>
                                        
                                        {/* Date Badge */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] text-[var(--text-muted)] text-sm">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="font-mono text-xs">{interview.scheduledDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="px-6 pb-6">
                                <button
                                    onClick={() => handleStartInterview(interview.id)}
                                    className="w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 
                                        bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] 
                                        text-[var(--surface-dark)]
                                        shadow-lg shadow-[var(--accent-primary)]/20
                                        hover:shadow-xl hover:shadow-[var(--accent-primary)]/30
                                        hover:scale-[1.02]
                                        active:scale-[0.98]"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Start Interview
                                </button>
                            </div>

                            {/* Decorative corner accent */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Quick Tips Section */}
            {pendingInterviews.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/30"
                >
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-tertiary)]/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-[var(--accent-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">Quick Tips</h4>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                                Make sure your camera and microphone are working before starting. Find a quiet, well-lit space for the best interview experience.
                            </p>
                        </div>
                    </div>
        </motion.div>
            )}
        </div>
    );
} 
