"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Video } from "./types";
import { useVideoAnalysis } from "./hooks/useVideoAnalysis";
import VideoAnalysis from "./components/VideoAnalysis";
import Dashboard from "./components/Dashboard";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Recruiters() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [topApplicants] = useState<string[]>([
    "Application 1",
    "Application 3",
    "Application 4",
  ]);

  // Use our custom hook for video analysis
  const { analysis, isAnalyzing, analyzeVideo } = useVideoAnalysis();

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // Trigger analysis when a video is selected
  useEffect(() => {
    if (selectedVideo) {
      analyzeVideo(selectedVideo);
      console.log("Selected video:", selectedVideo);
    }
  }, [selectedVideo, analyzeVideo]);

  // Function to fetch videos from Supabase
  const fetchVideos = async () => {
    console.log("Fetching videos...");

    try {
      // Get all profiles that have video URLs
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError.message);
        return;
      }

      // Get signed URLs for each video
      const videoData = await Promise.all(
        profiles.map(async (profile, index) => {
          if (!profile.video_url) return null;

          const { data: signedData } = await supabase.storage
            .from("videos")
            .createSignedUrl(profile.video_url, 3600);

          if (!signedData?.signedUrl) return null;

          return {
            id: profile.id,
            title: `Application ${index + 1}`,
            url: signedData.signedUrl,
            candidate_details: {
              id: profile.id,
              full_name: profile.full_name,
              email: profile.email,
              phone: profile.phone,
              experience: profile.experience,
              linkedin: profile.linkedin,
            },
          };
        })
      );

      setVideos(videoData.filter((video) => video !== null));
    } catch (error) {
      console.error("Error in fetchVideos:", error);
    }
  };

  // Render the video analysis view if a video is selected
  if (selectedVideo) {
    return (
      <VideoAnalysis
        video={selectedVideo}
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        onClose={() => setSelectedVideo(null)}
      />
    );
  }

  // Otherwise render the dashboard
  return (
    <Dashboard
      videos={videos}
      topApplicants={topApplicants}
      onVideoSelect={setSelectedVideo}
      onBackClick={() => router.push("/")}
    />
  );
}
