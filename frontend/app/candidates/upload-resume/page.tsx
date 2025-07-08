"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/auth";
import { getBackendUrl } from "@/utils/env";
import { useCandidateOnboardingStep } from '@/hooks/useCandidateOnboardingStep';

const ACCEPTED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/rtf"];
const MAX_SIZE_MB = 5;

export default function UploadResumePage() {
    // All hooks must be called unconditionally
    const { loading, step, profile, redirectIfNeeded, refresh } = useCandidateOnboardingStep();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        redirectIfNeeded('resume');
    }, [loading, step]);
    if (loading || step !== 'resume') {
        return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">Loading...</div>;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        validateAndSetFile(selected);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0];
        validateAndSetFile(dropped);
    };

    const validateAndSetFile = (selected?: File) => {
        setError(null);
        if (!selected) return;
        if (!ACCEPTED_TYPES.includes(selected.type)) {
            setError("Invalid file type. Please upload a PDF, DOCX, or RTF file.");
            return;
        }
        if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File is too large. Max size is ${MAX_SIZE_MB}MB.`);
            return;
        }
        setFile(selected);
    };

    const handleUpload = async () => {
        console.log("Upload button clicked");
        if (!file) {
            console.log("No file selected");
            return;
        }
        setUploading(true);
        setError(null);
        setProgress(0);
        try {
            // Get current user ID from Supabase
            const supabase = createClient();
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                setError("Could not get user ID. Please log in again.");
                setUploading(false);
                console.error("User error or no user", userError, user);
                return;
            }
            const userId = user.id;

            // Prepare form data
            const formData = new FormData();
            formData.append("file", file);
            formData.append("user_id", userId);

            console.log("Uploading to backend...");
            // Upload to backend
            const response = await fetch(`${getBackendUrl()}/upload-resume`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const res = await response.json();
                setError(res.detail || "Upload failed. Please try again.");
                setUploading(false);
                console.error("Backend upload failed", res);
                return;
            }

            const res = await response.json();
            console.log("Backend upload complete", res);
            // Optionally, show progress (simulate for now)
            await new Promise((resolve) => {
                let prog = 0;
                const interval = setInterval(() => {
                    prog += 10;
                    setProgress(prog);
                    if (prog >= 100) {
                        clearInterval(interval);
                        resolve(true);
                    }
                }, 30);
            });

            // No need to update profiles table. Just refresh onboarding state.
            console.log("Refreshing onboarding after resume upload...");
            await refresh();

            // Call backend to generate personalized questions
            try {
                const genRes = await fetch(`${getBackendUrl()}/generate-resume-questions-from-db`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId }),
                });
                const genData = await genRes.json();
                if (!genRes.ok || !genData.questions) {
                    setError(genData.error || "Failed to generate personalized questions. Please try again.");
                    setUploading(false);
                    return;
                }
                console.log("Personalized questions generated", genData.questions);
            } catch (err) {
                setError("Failed to generate personalized questions. Please try again.");
                setUploading(false);
                return;
            }

            setSuccess(true);
            console.log("Upload flow complete, success set to true");
        } catch (err) {
            setError("Upload failed. Please try again.");
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-lg">
                {/* Progress UI: Step 2 of 3 */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Step 2 of 3</span>
                        <span className="text-sm text-gray-400">Upload Resume</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '66%' }}></div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-6">Welcome! Upload Your Resume</h2>
                <p className="text-gray-300 text-center mb-6">To complete your profile, please upload your resume. Supported formats: PDF, DOCX, RTF. Max size: 5MB.</p>
                <div
                    className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center cursor-pointer ${error ? "border-red-500" : "border-gray-600 hover:border-blue-500"}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <input
                        type="file"
                        accept=".pdf,.docx,.doc,.rtf"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    {file ? (
                        <div className="text-white">
                            <span className="font-medium">Selected file:</span> {file.name}
                        </div>
                    ) : (
                        <div className="text-gray-400">Drag and drop your resume here, or <span className="text-blue-400 underline">browse</span></div>
                    )}
                </div>
                {error && <div className="mb-4 p-2 bg-red-900/50 text-red-200 rounded">{error}</div>}
                {file && !success && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
                    >
                        {uploading ? "Uploading..." : "Upload & Continue"}
                    </button>
                )}
                {uploading && (
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
                {success && (
                    <>
                        <div className="mb-4 p-2 bg-green-900/50 text-green-200 rounded text-center">Upload successful!</div>
                        <button
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 mb-4"
                            onClick={() => redirectIfNeeded('dashboard')}
                        >
                            Continue
                        </button>
                    </>
                )}
            </div>
        </div>
    );
} 