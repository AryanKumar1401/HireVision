"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/auth";

const supabase = createClient();

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    experience: "",
    linkedin: "",
    updated_at: null as string | null,
    email: "",
  });

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    experience: "",
    linkedin: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession();

        if (sessionErr || !session) {
          router.push("/login");
          return;
        }
        const user = session.user;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfileData(data);
          setFormData({
            full_name: data.full_name || "",
            phone: data.phone || "",
            experience: data.experience || "",
            linkedin: data.linkedin || "",
            email: data.email || "",
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error instanceof Error ? error.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const now = new Date().toISOString();
      const { error } = await supabase
        .from("profiles")
        .update({ ...formData, updated_at: now })
        .eq("id", user.id);

      if (error) throw error;

      setProfileData({ ...formData, updated_at: now });
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsEditing(false);
      router.push("/candidates/upload-resume");
    } catch (error) {
      console.error("Error updating profile:", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never updated";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancel = () => {
    setFormData({
      full_name: profileData.full_name || "",
      phone: profileData.phone || "",
      experience: profileData.experience || "",
      linkedin: profileData.linkedin || "",
      email: profileData.email || "",
    });
    setIsEditing(false);
  };

  const handleBack = () => {
    router.push("/candidates/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--surface-dark)] relative overflow-hidden py-12 px-4">
      {/* Background effects */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-40" />
      
      {/* Decorative elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[var(--accent-primary)]/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[var(--accent-tertiary)]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Back to Dashboard</span>
          </button>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
              {/* Profile Header */}
              <div className="relative p-8 text-center bg-gradient-to-r from-[var(--accent-primary)]/10 via-[var(--surface-card)] to-[var(--accent-tertiary)]/10">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent-primary)]/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[var(--accent-tertiary)]/10 rounded-full blur-3xl" />
                </div>

                <motion.div 
                  className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-[var(--surface-dark)] text-3xl font-bold mx-auto mb-4 shadow-lg shadow-[var(--accent-primary)]/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {profileData.full_name ? profileData.full_name.charAt(0).toUpperCase() : "?"}
                </motion.div>
                
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  {profileData.full_name || "Your Name"}
                </h2>
                <p className="text-[var(--accent-primary)] mt-1">
                  {profileData.experience || "Your Experience"}
                </p>

                <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] text-sm mt-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Last updated: {formatDate(profileData.updated_at)}</span>
                </div>

                {/* Edit Button */}
                <div className="absolute top-4 right-4">
                  {!isEditing ? (
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-elevated)] hover:bg-white/5 border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-[var(--surface-elevated)] hover:bg-white/5 border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-secondary)] transition-all"
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 btn-accent rounded-xl text-sm disabled:opacity-50"
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSaving ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-3 h-3 border-2 border-[var(--surface-dark)] border-t-transparent rounded-full"
                            />
                            Saving
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Success Message */}
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[var(--status-success)]/10 border-b border-[var(--status-success)]/20 text-[var(--status-success)] px-6 py-3 text-center text-sm"
                >
                  {successMessage}
                </motion.div>
              )}

              {/* Profile Content */}
              <div className="p-8 space-y-6">
                {[
                  { label: "Full Name", name: "full_name", type: "text", placeholder: "Enter your full name" },
                  { label: "Email Address", name: "email", type: "email", placeholder: "Enter your email address" },
                  { label: "Phone Number", name: "phone", type: "tel", placeholder: "Enter your phone number" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      {field.label}
                    </label>
                    {isEditing ? (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-primary)] px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all placeholder:text-[var(--text-muted)]"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)]">
                        {profileData[field.name as keyof typeof profileData] || (
                          <span className="text-[var(--text-muted)]">Not provided</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                  {/* Experience */}
                  <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Experience
                    </label>
                    {isEditing ? (
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-primary)] px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all placeholder:text-[var(--text-muted)] min-h-[100px] resize-none"
                        placeholder="Describe your professional experience"
                      />
                    ) : (
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)] min-h-[80px] whitespace-pre-wrap">
                      {profileData.experience || (
                        <span className="text-[var(--text-muted)]">Not provided</span>
                      )}
                      </div>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      LinkedIn Profile
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                      className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-primary)] px-4 py-3 focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/30 transition-all placeholder:text-[var(--text-muted)]"
                        placeholder="Enter your LinkedIn URL"
                      />
                    ) : (
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-[var(--text-primary)]">
                        {profileData.linkedin ? (
                          <a
                          href={profileData.linkedin.startsWith("http") ? profileData.linkedin : `https://${profileData.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors flex items-center gap-2"
                          >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                            {profileData.linkedin}
                          </a>
                        ) : (
                        <span className="text-[var(--text-muted)]">Not provided</span>
                        )}
                      </div>
                    )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[var(--border-subtle)] p-6 flex justify-between items-center">
                <div className="text-[var(--text-muted)] text-sm">
                  Need help?{" "}
                  <a href="/help" className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">
                    Contact support
                  </a>
                </div>

                {isEditing && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="px-5 py-2.5 bg-[var(--surface-elevated)] hover:bg-white/5 border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-secondary)] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-5 py-2.5 btn-accent rounded-xl text-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-3 h-3 border-2 border-[var(--surface-dark)] border-t-transparent rounded-full"
                          />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
