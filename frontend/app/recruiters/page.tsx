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
          {/* <span className="text-white font-semibold">
            {profileData?.full_name}
          </span>
          <span className="text-white/70 text-sm">({userEmail})</span> */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Logout
          </button>
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
            <InterviewQuestions companyID={profileData?.companyID || ""} />
        </div>
        </>
      )}
    </div>
  );
}
