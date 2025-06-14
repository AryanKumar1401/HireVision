"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/auth";
import { getBackendUrl } from "@/utils/env";

const ACCEPTED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/rtf"];
const MAX_SIZE_MB = 5;

export default function UploadResumePage() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
        if (!file) return;
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
                return;
            }
            const userId = user.id;

            // Prepare form data
            const formData = new FormData();
            formData.append("file", file);
            formData.append("user_id", userId);

            // Upload to backend
            const response = await fetch(`${getBackendUrl()}/upload-resume`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const res = await response.json();
                setError(res.detail || "Upload failed. Please try again.");
                setUploading(false);
                return;
            }

            const res = await response.json();
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

            setSuccess(true);
            setTimeout(() => router.push("/candidates/dashboard"), 1000);
        } catch (err) {
            setError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-lg">
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
                {/* Resume Preview Section */}
                {file && (
                    <div className="mb-4">
                        <div className="font-medium text-white mb-2">Preview:</div>
                        <div
                            className="cursor-pointer group"
                            onClick={() => setIsPreviewOpen(true)}
                        >
                            {file.type === "application/pdf" ? (
                                <iframe
                                    src={URL.createObjectURL(file)}
                                    title="PDF Preview"
                                    className="w-full h-32 border rounded group-hover:ring-2 group-hover:ring-blue-400 transition"
                                />
                            ) : (
                                <div className="text-gray-300">
                                    {file.name} <br />
                                    <span className="text-xs text-gray-400">
                                        Preview not available for this file type. Click to expand.
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Modal Popup for Large Preview */}
                        {isPreviewOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                                <div className="relative bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full mx-4 p-6 flex flex-col items-center">
                                    <button
                                        onClick={() => setIsPreviewOpen(false)}
                                        className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold"
                                        aria-label="Close preview"
                                    >
                                        &times;
                                    </button>
                                    <div className="w-full flex flex-col items-center">
                                        {file.type === "application/pdf" ? (
                                            <iframe
                                                src={URL.createObjectURL(file)}
                                                title="PDF Large Preview"
                                                className="w-full h-[70vh] border rounded"
                                            />
                                        ) : (
                                            <div className="text-gray-200 text-lg text-center">
                                                <div className="mb-2 font-semibold">{file.name}</div>
                                                <div className="text-gray-400 text-base">Preview not available for this file type.<br />Download to view.</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
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
                    <div className="mb-4 p-2 bg-green-900/50 text-green-200 rounded text-center">Upload successful! Redirecting...</div>
                )}
            </div>
        </div>
    );
} 