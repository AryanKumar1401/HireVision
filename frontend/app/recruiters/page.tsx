"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/auth";
import { useRecruiterProfile } from "./hooks/useRecruiterProfile";
import { RecruiterProfileForm } from "./components/RecruiterProfileForm";
import Dashboard from "./components/Dashboard";
import VideoAnalysis from "./components/VideoAnalysis";
import InterviewQuestions from "./components/InterviewQuestions";
import { Video } from "./types";
import { useVideoAnalysis } from "./hooks/useVideoAnalysis";

const supabase = createClient();

export default function RecruitersPage() {
  const router = useRouter();
  const { isLoading, showProfileForm, profileData, userEmail, updateProfile } =
    useRecruiterProfile();
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const { analysis, isAnalyzing, analyzeVideo } = useVideoAnalysis();
  const [inviteOpen, setInviteOpen] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const INVITE_API = "https://api.myapp.com/invite";

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteMessage(null);
    try {
      const res = await fetch(INVITE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
  
      if (!res.ok) {
        const { detail } = await res.json();
        throw new Error(detail || "Failed to send invite");
      }
  
      setInviteMessage("Invite sent! 🎉");
      setInviteEmail("");
    } catch (err: any) {
      console.error(err);
      setInviteMessage(err.message ?? "Error sending invite");
    }
  };
  


  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/recruiters/login");
  };

  const handleVideoSelect = async (video: Video) => {
    setSelectedVideo(video);
    await analyzeVideo(video);
  };

  const handleCloseAnalysis = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .not("video_url", "is", null);

        if (error) {
          console.error("Error fetching profiles:", error);
          return;
        }

        // Transform profiles into Video objects
        const videoData: Video[] = profiles.map((profile) => ({
          id: profile.id,
          title: `${profile.full_name}'s Interview`,
          url: profile.video_url || "",
          created_at: profile.created_at,
          candidate_details: {
            full_name: profile.full_name,
            email: profile.email,
            phone: profile.phone || "",
            experience: profile.experience || "",
            linkedin: profile.linkedin || "",
          },
        }));

        setVideos(videoData);
      } catch (error) {
        console.error("Error in fetchVideos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Show loading state while profile data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Show profile form if the recruiter hasn't completed their profile
  if (showProfileForm) {
    return (
      <RecruiterProfileForm
        onSubmit={updateProfile}
        profileData={profileData}
      />
    );
  }

  // Define top applicants based on most recent uploads
  const topApplicants = videos
    .slice(0, 2)
    .map((video) => video.candidate_details?.full_name || "");

  return (
    <div className="min-h-screen bg-gray-900">
      {userEmail && !selectedVideo && (
        <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-1">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Logout
          </button>
        </div>
      )}

      {inviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 w-full max-w-md rounded-xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Invite a Candidate
              </h3>

              <input
                type="email"
                placeholder="candidate@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
              />

              {<p className="mt-2 text-sm text-center text-gray-300">{inviteMessage}</p>}

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setInviteOpen(false);
                    setInviteMessage(null);
                    setInviteEmail("");
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={sendInvite}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  Invite Candidate
                </button>
              </div>
            </div>
          </div>
        )}

      {selectedVideo ? (
        <VideoAnalysis
          video={selectedVideo}
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          onClose={handleCloseAnalysis}
        />
      ) : (
        <>
        <Dashboard
          videos={videos}
          topApplicants={topApplicants}
          onVideoSelect={handleVideoSelect}
          onBackClick={() => router.push("/")}
          recruiterName={profileData?.full_name}
          recruiterEmail={userEmail}

        />
        <div className="mt-8 max-w-7xl mx-auto px-4">
          {profileData?.company_number ? (
              <InterviewQuestions company_number={profileData.company_number} />
            ) : (
              <div className="text-center text-white">
                Please update your profile with your Company ID to manage interview questions.
              </div>
            )}
        </div>
        </>
      )}
    </div>
  );
}
