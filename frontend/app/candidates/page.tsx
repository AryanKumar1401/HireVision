"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/auth";
import { ProfileForm } from "./components/ProfileForm";
import { VideoPreview } from "./components/VideoPreview";
import { RecordingControls } from "./components/RecordingControls";
import { useVideoRecording } from "@/hooks/useVideoRecording";
import { useSupabaseUpload } from "@/hooks/useSupabaseUpload";
import { useProfile } from "@/hooks/useProfile";
import { AudioLevelMeter } from "./components/AudioLevelMeter";
import { DeviceSelector } from "./components/DeviceSelector";

const supabase = createClient();

export default function Candidates() {
  const router = useRouter();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] =
    useState<string>("");
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] =
    useState<string>("");

  const {
    isRecording,
    recordingTime,
    isLoading: cameraLoading,
    cameraError,
    streamRef,
    startRecording,
    stopRecording,
    initializeCamera,
  } = useVideoRecording(
    isCameraActive,
    selectedVideoDeviceId,
    selectedAudioDeviceId
  );

  const { isUploading, uploadProgress, uploadVideo } = useSupabaseUpload();

  const {
    isLoading,
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

  const activateCamera = async () => {
    setIsCameraActive(true);
    await initializeCamera();
  };

  const startInterview = () => {
    if (!isCameraActive) {
      activateCamera();
    }
    setIsInterviewStarted(true);
  };

  const handleVideoDeviceChange = async (deviceId: string) => {
    setSelectedVideoDeviceId(deviceId);
    if (isCameraActive) {
      await initializeCamera();
    }
  };

  const handleAudioDeviceChange = async (deviceId: string) => {
    setSelectedAudioDeviceId(deviceId);
    if (isCameraActive) {
      await initializeCamera();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

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
          className="text-4xl font-bold mb-6 text-white/90 tracking-tight"
        >
          {isInterviewStarted ? "Record Your Interview" : "Interview Setup"}
        </motion.h1>

        {!isInterviewStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[800px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-10"
          >
            <h2 className="text-2xl text-white/90 font-medium mb-4 text-center">
              You're about to start your interview. Let's get set up first.
            </h2>
            <p className="text-white/70 mb-8 text-center">
              Make sure you're in a quiet place with good lighting before
              proceeding.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={activateCamera}
                className="px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 bg-blue-500/20 text-blue-500 border-2 border-blue-500/50 hover:bg-blue-500/30"
              >
                Check Camera/Mic
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startInterview}
                className="px-8 py-3 rounded-lg font-medium text-lg bg-green-600/80 text-white hover:bg-green-600 transition-all duration-200"
              >
                Start Interview
              </motion.button>
            </div>

            {isCameraActive && (
              <div className="mt-8">
                <h3 className="text-white/90 text-lg mb-3">Camera Preview</h3>
                <VideoPreview
                  stream={streamRef.current}
                  recordedUrl={null}
                  isLoading={cameraLoading}
                  error={cameraError}
                />

                {streamRef.current && !cameraError && !cameraLoading && (
                  <AudioLevelMeter stream={streamRef.current} />
                )}

                <DeviceSelector
                  onVideoDeviceChange={handleVideoDeviceChange}
                  onAudioDeviceChange={handleAudioDeviceChange}
                  selectedVideoDeviceId={selectedVideoDeviceId}
                  selectedAudioDeviceId={selectedAudioDeviceId}
                />

                <div className="mt-4 text-center text-white/70">
                  <p>Speak normally to test your microphone levels.</p>
                  <p className="mt-1 text-sm">
                    The meter should move as you speak.
                  </p>
                  <p className="text-sm mt-1 text-blue-400">
                    Use the selectors above to change your camera or microphone
                    if needed.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="w-full max-w-[1400px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-6">
            <VideoPreview
              stream={streamRef.current}
              recordedUrl={signedUrl}
              isLoading={cameraLoading && isCameraActive}
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
        )}

        {signedUrl && isInterviewStarted && (
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
