"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/auth";
import { getBackendUrl } from "@/utils/env";
import { ProfileForm } from "./components/ProfileForm";
import { VideoPreview } from "./components/VideoPreview";
import { RecordingControls } from "./components/RecordingControls";
import { useVideoRecording } from "@/hooks/useVideoRecording";
import { useSupabaseUpload } from "@/hooks/useSupabaseUpload";
import { useProfile } from "@/hooks/useProfile";
import { AudioLevelMeter } from "./components/AudioLevelMeter";
import { DeviceSelector } from "./components/DeviceSelector";

const supabase = createClient();

// Create background floating elements for visual appeal
const floatingElements = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.floor(Math.random() * 150) + 50,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.floor(Math.random() * 20) + 15,
  delay: Math.random() * 10,
}));

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
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(true);

  //Fetch the interview question from Supabase on mount
  useEffect(() => {
    async function fetchQuestions() {
      const { data, error } = await supabase
        .from("interview_questions")
        .select("question");
      if (error) {
        console.error("Error retrieving questions from supabase");
      } else if (data) {
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
    setRecordedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: videoBlob,
    }));
    setIsAnswerRecorded(true);
    const { signedUrl: newSignedUrl } = await uploadVideo(videoBlob);
    if (newSignedUrl) {
      setSignedUrl(newSignedUrl);
      setTimeout(() => setShowPreview(true), 300); // Add a short delay
      console.log("Preview video URL:", newSignedUrl);

    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setIsAnswerRecorded(false);
    setSignedUrl(null);
    setShowPreview(false);
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
          const response = await fetch(`${getBackendUrl()}/analyze-video`, {
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
              `Processed ${completedUploads} of ${Object.keys(recordedAnswers).length
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
    return (
      <ProfileForm
        onSubmit={updateProfile}
        profileData={profileData || undefined}
      />
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        {/* Improved background with subtle animated particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl" />

        {floatingElements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute rounded-full bg-gradient-to-br from-blue-600/5 to-purple-600/5"
            style={{
              width: `${el.size}px`,
              height: `${el.size}px`,
              left: `${el.x}%`,
              top: `${el.y}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 0.9, 1.1],
              x: [0, 30, -20, 15, 0],
              y: [0, -30, 20, -15, 0],
            }}
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
          {/* User info and navigation bar */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 backdrop-blur-md bg-gray-900/50 border-b border-gray-800/30"
          >
            {userEmail && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="text-white/70">{userEmail}</span>
              </div>
            )}

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/candidates/dashboard")}
                className="px-3 py-1 rounded-lg text-sm bg-gray-800/70 text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-3 py-1 rounded-lg text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Sign Out
              </motion.button>
            </div>
          </motion.div>

          {/* Main content */}
          <div className="w-full max-w-7xl flex flex-col items-center justify-center pt-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-3 text-white/90 tracking-tight text-center"
            >
              {isInterviewStarted ? "Record Your Interview" : "Interview Setup"}
            </motion.h1>

            {!isInterviewFinished && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-[600px] mx-auto mb-8"
              >
                <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{
                      width: isInterviewStarted
                        ? `${((currentQuestionIndex +
                          (isAnswerRecorded ? 1 : 0)) /
                          questions.length) *
                        100
                        }%`
                        : "5%",
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-gray-400">
                  <span>Setup</span>
                  <span>
                    {isInterviewStarted
                      ? `Question ${currentQuestionIndex + 1} of ${questions.length
                      }`
                      : "Interview"}
                  </span>
                  <span>Complete</span>
                </div>
              </motion.div>
            )}

            {!isInterviewStarted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[800px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-10"
              >
                <h2 className="text-2xl text-white/90 font-medium mb-4 text-center">
                  You're about to start your interview
                </h2>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
                  <h3 className="text-blue-300 font-medium flex items-center text-lg mb-2">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Important Tips:
                  </h3>
                  <ul className="text-white/70 space-y-2 pl-7 list-disc">
                    <li>Find a quiet place with good lighting.</li>
                    <li>Test your camera and microphone.</li>
                    <li>Speak clearly and maintain good posture.</li>
                    <li>
                      You'll answer {questions.length} questions one at a time.
                    </li>
                    <li>
                      You can review each recording before moving to the next
                      question.
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={activateCamera}
                    className="px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 bg-blue-500/20 text-blue-500 border-2 border-blue-500/50 hover:bg-blue-500/30 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Test Camera & Mic
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startInterview}
                    className="px-8 py-3 rounded-lg font-medium text-lg bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center shadow-lg"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Begin Interview
                  </motion.button>
                </div>

                {isCameraActive && (
                  <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-white/90 text-lg mb-3 font-medium">
                      Camera Preview
                    </h3>
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

                    <div className="mt-4 text-center text-white/70 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <h4 className="text-blue-300 font-medium mb-1">
                        Testing Tips
                      </h4>
                      <p>Speak normally to test your microphone levels.</p>
                      <p className="mt-1 text-sm">
                        The meter should move as you speak. If it doesn't,
                        select a different microphone.
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

                  {!isAnalysisComplete ? (
                    <div className="flex flex-col items-center my-8 space-y-4">
                      <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                      <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg px-6 py-3 text-white/80">
                        {processingStatus}
                      </div>
                    </div>
                  ) : (
                    <div className="my-8 flex flex-col items-center">
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-12 h-12 text-green-500"
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
                      <p className="text-white/80 text-lg">
                        {processingStatus}
                      </p>
                      <p className="text-white/60 text-sm mt-2">
                        You will be redirected in a moment...
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              // Interview in progress - display current question and recording UI
              <div className="w-full max-w-[1400px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-6">
                {/* Question card with styling */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={currentQuestionIndex}
                  className="mb-6 bg-gradient-to-r from-blue-600/5 to-purple-600/5 p-6 rounded-xl border border-blue-500/20"
                >
                  <div className="flex items-center text-blue-400 font-medium mb-2">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Question {currentQuestionIndex + 1} of{" "}
                      {isQuestionsLoading ? "..." : questions.length}
                    </span>
                  </div>
                  <h2 className="text-2xl text-white/90 font-medium">
                    {isQuestionsLoading ? (
                      <div className="h-8 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
                    ) : (
                      questions[currentQuestionIndex]
                    )}
                  </h2>
                </motion.div>

                <VideoPreview
                  stream={streamRef.current}
                  recordedUrl={showPreview ? signedUrl : null}
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
                  onGoBack={() => router.push("/candidates/dashboard")}
                />

                {/* Next/Finish button - only visible when answer is recorded */}
                {isAnswerRecorded && !isRecording && !isUploading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mt-8"
                  >
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700/50 text-center max-w-2xl">
                      <p className="text-white/80 mb-4">
                        {currentQuestionIndex === questions.length - 1
                          ? "Great job! You've answered all questions. Ready to finish your interview?"
                          : "Ready to continue to the next question?"}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={
                          currentQuestionIndex === questions.length - 1
                            ? handleFinishInterview
                            : handleNextQuestion
                        }
                        className="px-8 py-3 rounded-lg font-medium text-lg bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg flex items-center"
                      >
                        {currentQuestionIndex === questions.length - 1 ? (
                          <>
                            <svg
                              className="w-5 h-5 mr-2"
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
                            Complete Interview
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                              />
                            </svg>
                            Next Question
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {isAnswerRecorded && signedUrl && !isRecording && !isUploading && (
                  <div className="flex justify-center mt-4">
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white mr-2"
                      onClick={() => setShowPreview((prev) => !prev)}
                    >
                      {showPreview ? "Show Camera" : "View Preview"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}

// Simple fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      Loading Interview...
    </div>
  );
}
