"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/auth";
import { ProfileForm } from "@/components/ProfileForm";
import { VideoPreview } from "@/components/VideoPreview";
import { RecordingControls } from "@/components/RecordingControls";
import { useVideoRecording } from "@/hooks/useVideoRecording";
import { useSupabaseUpload } from "@/hooks/useSupabaseUpload";
import { useProfile } from "@/hooks/useProfile";

const supabase = createClient();

export default function Candidates() {
  const router = useRouter();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const {
    isRecording,
    recordingTime,
    isLoading,
    cameraError,
    streamRef,
    startRecording,
    stopRecording,
  } = useVideoRecording();

  const { isUploading, uploadProgress, uploadVideo } = useSupabaseUpload();

  const {
    showProfileForm,
    profileData,
    userEmail,
    updateProfile,
    updateVideoUrl,
  } = useProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleStopRecording = async () => {
    const videoBlob = await stopRecording();
    const {
      publicUrl,
      signedUrl: newSignedUrl,
      filename,
    } = await uploadVideo(videoBlob);

    if (publicUrl && newSignedUrl) {
      setSignedUrl(newSignedUrl);
      await updateVideoUrl(filename);

      try {
        const response = await fetch("http://localhost:8000/analyze-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            video_url: newSignedUrl,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          }),
        });

        if (response.ok) {
          console.log("Analysis initiated successfully");
        }
      } catch (error) {
        console.error("Error initiating analysis:", error);
      }
    }
  };

  if (showProfileForm) {
    return <ProfileForm onSubmit={updateProfile} profileData={profileData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {userEmail && (
          <div className="absolute top-4 right-4 flex items-center gap-4">
            <span className="text-white/70">Logged in as {userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 text-white/90 tracking-tight"
        >
          Record Your Interview
        </motion.h1>

        <div className="w-full max-w-[1400px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-6">
          <VideoPreview
            stream={streamRef.current}
            recordedUrl={signedUrl}
            isLoading={isLoading}
            error={cameraError}
          />

          <RecordingControls
            isRecording={isRecording}
            recordingTime={recordingTime}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            onStartRecording={startRecording}
            onStopRecording={handleStopRecording}
            onGoBack={() => router.push("/")}
          />
        </div>

        {signedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 w-full max-w-[1400px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-6"
          >
            <h2 className="text-xl font-medium text-white/90 mb-4">
              Recording Preview
            </h2>
            <video
              src={signedUrl}
              controls
              className="w-full aspect-video rounded-xl bg-gray-800/50"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
