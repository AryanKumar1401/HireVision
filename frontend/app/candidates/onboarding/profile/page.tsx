"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/auth";

export default function OnboardingProfilePage() {
    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        experience: "",
        linkedin: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                setError("Could not get user. Please log in again.");
                setLoading(false);
                return;
            }
            // Validate all fields are filled
            for (const key of Object.keys(form)) {
                if (!form[key as keyof typeof form]) {
                    setError("All fields are required.");
                    setLoading(false);
                    return;
                }
            }
            // Update profile
            const { error: updateError } = await supabase
                .from("profiles")
                .update({ ...form, updated_at: new Date().toISOString() })
                .eq("id", user.id);
            if (updateError) {
                setError("Failed to save profile. Please try again.");
                setLoading(false);
                return;
            }
            setSuccess(true);
            setTimeout(() => router.push("/candidates/upload-resume"), 1000);
        } catch (err) {
            setError("Unexpected error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full p-8 bg-gray-800 rounded-xl shadow-lg">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Step 1 of 3</span>
                        <span className="text-sm text-gray-400">Complete Profile</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-6">Complete Your Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Full Name</label>
                        <input name="full_name" type="text" required value={form.full_name} onChange={handleChange} className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                        <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className="mt-1 block w-full text-black rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Experience Level</label>
                        <select name="experience" required value={form.experience} onChange={handleChange} className="mt-1 text-black block w-full rounded-md border border-gray-300 px-3 py-2">
                            <option value="">Select experience</option>
                            <option value="0-2">0-2 years</option>
                            <option value="2-5">2-5 years</option>
                            <option value="5-8">5-8 years</option>
                            <option value="8+">8+ years</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">LinkedIn URL</label>
                        <input name="linkedin" type="url" required value={form.linkedin} onChange={handleChange} className="mt-1 block text-black w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700" disabled={loading}>
                        {loading ? "Saving..." : "Save & Continue"}
                    </button>
                </form>
                {error && <div className="mt-4 p-2 bg-red-900/50 text-red-200 rounded">{error}</div>}
                {success && <div className="mt-4 p-2 bg-green-900/50 text-green-200 rounded text-center">Profile saved! Redirecting...</div>}
            </div>
        </div>
    );
} 