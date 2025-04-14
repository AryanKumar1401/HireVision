"use client";
import { useState, useEffect } from "react";
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

// Interview questions array
  // const interviewQuestions = [
  //   "Tell me about yourself and your background in this field.",
  //   "What are your greatest strengths and how do they help you in your work?",
  //   "Describe a challenging project you worked on and how you handled it.",
  // ];


export default function Candidates() {


  const router = useRouter();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] =
    useState<string>("");
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] =
    useState<string>("");

  // Multi-question state variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [recordedAnswers, setRecordedAnswers] = useState<Record<number, Blob>>(
    {}
  );
  const [isAnswerRecorded, setIsAnswerRecorded] = useState<boolean>(false);
  const [isInterviewFinished, setIsInterviewFinished] =
    useState<boolean>(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(true);

  //Fetch the interview question from Supabase on mount
  useEffect(() => {
    async function fetchQuestions() {
      const { data, error} = await supabase.from("interview_questions").select("question");
      if(error){
        console.error("Error retrieving questions from supabase");
      } else if(data){
        setQuestions(data.map((q) => q.question));
      }
      setIsQuestionsLoading(false);
    }
    fetchQuestions();
  }, []);


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

  const handleStopAnswerRecording = async () => {
    const videoBlob = await stopRecording();

    // Store this answer in the recordedAnswers object
    setRecordedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: videoBlob,
    }));

    // Mark that the current answer has been recorded
    setIsAnswerRecorded(true);

    // Store the most recent recording URL for preview
    const { signedUrl: newSignedUrl } = await uploadVideo(videoBlob);
    if (newSignedUrl) {
      setSignedUrl(newSignedUrl);
    }
  };

  const handleNextQuestion = () => {
    // Move to the next question
    setCurrentQuestionIndex((prev) => prev + 1);
    // Reset answer recording state
    setIsAnswerRecorded(false);
    // Clear the preview
    setSignedUrl(null);
  };

  const handleFinishInterview = async () => {
    // Show processing state
    setIsInterviewFinished(true);
    setProcessingStatus("Uploading and analyzing your interview responses...");

    const userId = (await supabase.auth.getUser()).data.user?.id;
    let completedUploads = 0;

    // Process each recorded answer
    for (const [questionIndex, videoBlob] of Object.entries(recordedAnswers)) {
      try {
        // Upload the video
        const {
          publicUrl,
          signedUrl: newSignedUrl,
          filename,
        } = await uploadVideo(videoBlob);

        if (publicUrl && newSignedUrl) {
          // Send for analysis with question index
          const response = await fetch("http://localhost:8000/analyze-video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              video_url: newSignedUrl,
              user_id: userId,
              question_index: parseInt(questionIndex),
              question_text: questions[parseInt(questionIndex)],
            }),
          });

          if (response.ok) {
            completedUploads++;
            setProcessingStatus(
              `Processed ${completedUploads} of ${
                Object.keys(recordedAnswers).length
              } responses...`
            );
          }
        }
      } catch (error) {
        console.error(
          `Error processing answer for question ${questionIndex}:`,
          error
        );
      }
    }

    // Mark analysis as complete
    setIsAnalysisComplete(true);
    setProcessingStatus(
      "All responses have been uploaded and sent for analysis!"
    );

    // Wait a moment to show completion message before redirecting
    setTimeout(() => {
      router.push("/candidates/thank-you");
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

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
        ) : isInterviewFinished ? (
          // Show processing/completion status after interview
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[800px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-10 text-center"
          >
            <div className="space-y-6">
              <h2 className="text-2xl text-white/90 font-medium">
                {isAnalysisComplete
                  ? "Interview Complete!"
                  : "Processing Your Interview"}
              </h2>

              {!isAnalysisComplete && (
                <div className="flex justify-center my-8">
                  <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
              )}

              <p className="text-white/80 text-lg">{processingStatus}</p>

              {isAnalysisComplete && (
                <div className="mt-4">
                  <svg
                    className="w-16 h-16 mx-auto text-green-500"
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
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          // Interview in progress - display current question and recording UI
          <div className="w-full max-w-[1400px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-6">
            {/* Question indicator */}
            <div className="mb-6 text-center">
              <div className="text-blue-400 font-medium mb-2">
                Question {currentQuestionIndex + 1} of {isQuestionsLoading ? "...": questions.length}
              </div>
              <h2 className="text-2xl text-white/90 font-medium">
                {isQuestionsLoading ? "Loading question...": questions[currentQuestionIndex]}
              </h2>
            </div>

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
              onStopRecording={handleStopAnswerRecording}
              onGoBack={() => router.push("/")}
            />

            {/* Next/Finish button - only visible when answer is recorded */}
            {isAnswerRecorded && !isRecording && (
              <div className="flex justify-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={
                    currentQuestionIndex === questions.length - 1
                      ? handleFinishInterview
                      : handleNextQuestion
                  }
                  className="px-8 py-3 rounded-lg font-medium text-lg bg-green-600/80 text-white hover:bg-green-600 transition-all duration-200"
                >
                  {currentQuestionIndex === questions.length - 1
                    ? "Finish Interview"
                    : "Next Question"}
                </motion.button>
              </div>
            )}
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
