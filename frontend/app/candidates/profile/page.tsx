"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// import { createClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/auth";

// Initialize Supabase client - replace with your actual credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient();

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Profile data state
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    experience: "",
    linkedin: "",
    updated_at: null as string | null,
    email: "",
  });

  // Form data state (for editing)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    experience: "",
    linkedin: "",
    email: "",
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);

        // Get the current user
        const {
          data: { session },
          error: sessionErr,
        } = await supabase.auth.getSession();

        if (sessionErr || !session) {
          router.push("/login");
          return;
        }
        const user = session.user;

        setCheckingSession(false);

        // Fetch the profile data
        const { data, error } = await supabase
          .from("profiles") // Assuming your table is named 'profiles'
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
        console.error(
          "Error fetching profile:",
          error instanceof Error ? error.message : "Unknown error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Current timestamp for updated_at
      const now = new Date().toISOString();

      // Update the profile in the database
      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          updated_at: now,
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update local state
      setProfileData({
        ...formData,
        updated_at: now,
      });

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error instanceof Error ? error.message : "Unknown error"
      );
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
    // Reset form data to current profile data
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Decorative background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2 }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl"
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with back button */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
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

          <h1 className="text-3xl font-bold text-white ml-auto mr-auto">
            My Profile
          </h1>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            {/* Profile Card */}
            <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600/40 to-purple-600/40 p-8 text-center relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {profileData.full_name
                    ? profileData.full_name.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {profileData.full_name || "Your Name"}
                </h2>
                <p className="text-blue-300 mt-1">
                  {profileData.experience || "Your Experience"}
                </p>

                {/* Last updated info */}
                <div className="text-gray-400 text-sm mt-2 flex items-center justify-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Last updated: {formatDate(profileData.updated_at)}
                </div>

                {/* Edit/Save Button */}
                <div className="absolute top-4 right-4">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600/70 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center transition-colors"
                    >
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600/70 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className={`bg-green-600/70 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center transition-colors ${
                          isSaving ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                            Saving
                          </>
                        ) : (
                          <>
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-600/20 border border-green-600/30 text-green-400 px-4 py-2 text-center">
                  {successMessage}
                </div>
              )}

              {/* Profile Content */}
              <div className="p-6">
                {/* Profile fields */}
                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg px-4 py-3 text-white">
                        {profileData.full_name || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email address"
                      />
                    ) : (
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg px-4 py-3 text-white">
                        {profileData.email || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg px-4 py-3 text-white">
                        {profileData.phone || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Experience
                    </label>
                    {isEditing ? (
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                        placeholder="Describe your professional experience"
                      />
                    ) : (
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg px-4 py-3 text-white min-h-16 whitespace-pre-wrap">
                        {profileData.experience || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      LinkedIn Profile
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your LinkedIn URL"
                      />
                    ) : (
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg px-4 py-3 text-white">
                        {profileData.linkedin ? (
                          <a
                            href={
                              profileData.linkedin.startsWith("http")
                                ? profileData.linkedin
                                : `https://${profileData.linkedin}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {profileData.linkedin}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-700 p-4 flex justify-between items-center">
                <div className="text-gray-400 text-sm">
                  <span>Need help? </span>
                  <a
                    href="/help"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Contact support
                  </a>
                </div>

                {isEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors ${
                        isSaving ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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
