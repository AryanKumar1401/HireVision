import CloseIcon from "@mui/icons-material/Close";

interface InterviewDetailsModalProps {
    interview: any;
    onClose: () => void;
}

export default function InterviewDetailsModal({ interview, onClose }: InterviewDetailsModalProps) {
    const scores = interview.behavioral_scores ?? {};
    const comm = interview.communication_analysis ?? {};
    const emot = interview.emotion_results ?? {};

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 w-full max-w-3xl mx-4 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
                    <h4 className="text-lg font-semibold text-white">Interview Details</h4>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        <CloseIcon />
                    </button>
                </div>

                <div className="divide-y divide-gray-700 overflow-auto max-h-[70vh]">
                    {/* top summary */}
                    <section className="p-6 space-y-2">
                        <h5 className="text-xl font-semibold text-white">
                            {interview.question_text || "Interview"}
                        </h5>
                        <p className="text-sm text-gray-400">
                            Completed&nbsp;
                            {new Date(interview.created_at).toLocaleString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>

                        <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                            <h6 className="text-sm font-medium text-gray-300 mb-1">AI Summary</h6>
                            <p className="text-gray-100 text-sm whitespace-pre-wrap">
                                {interview.summary || "—"}
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
                                <p className="text-gray-500 text-sm">No scores available.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {Object.entries(scores).map(([k, v]) => (
                                        <li key={k} className="flex justify-between">
                                            <span className="text-gray-400 text-sm capitalize">{k}</span>
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
                                <p className="text-gray-500 text-sm">No data available.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {Object.entries(comm).map(([key, value]) => (
                                        <li key={key} className="flex justify-between">
                                            <span className="text-gray-400 text-sm capitalize">{key}</span>
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
                    <section className="p-6">
                        <h6 className="text-sm font-medium text-gray-300 mb-4">
                            Detected Emotions <span className="text-gray-500">(top 3)</span>
                        </h6>
                        {Object.keys(emot).length === 0 ? (
                            <p className="text-gray-500 text-sm">No emotion data.</p>
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
                    </section>

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
                            {interview.transcript || "—"}
                        </pre>
                    </details>
                </div>
            </div>
        </div>
    );
} 