"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/auth";
import { getBackendUrl } from "@/utils/env";
import { ProfileForm } from "../components/ProfileForm";
import { VideoPreview } from "../components/VideoPreview";
import { RecordingControls } from "../components/RecordingControls";
import { useVideoRecording } from "@/hooks/useVideoRecording";
import { useSupabaseUpload } from "@/hooks/useSupabaseUpload";
import { useProfile } from "@/hooks/useProfile";
import { AudioLevelMeter } from "../components/AudioLevelMeter";
import { DeviceSelector } from "../components/DeviceSelector";
import React from "react";

const supabase = createClient();

export default function InterviewSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get('interview_id');

  // Interview state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>("");
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [recordedAnswers, setRecordedAnswers] = useState<Record<number, Blob>>({});
  const [isAnswerRecorded, setIsAnswerRecorded] = useState<boolean>(false);
  const [isInterviewFinished, setIsInterviewFinished] = useState<boolean>(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(true);
  const [usedPersonalized, setUsedPersonalized] = useState<boolean>(false);
  const [showConfirmFinishModal, setShowConfirmFinishModal] = useState(false);
  const [hasConfirmedFinish, setHasConfirmedFinish] = useState(false);
  const [showCameraDuringInterview, setShowCameraDuringInterview] = useState(true);

  // Fetch personalized questions on interview start
  const fetchPersonalizedQuestions = async (userId: string) => {
    try {
      const response = await fetch(`${getBackendUrl()}/get-personalized-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      if (response.ok && data.questions && data.questions.length > 0) {
        setQuestions(data.questions.map((q: { question: string }) => q.question));
        setUsedPersonalized(true);
        setIsQuestionsLoading(false);
        return true;
      }
    } catch (err) {}
    return false;
  };

  // Fetch generic questions from Supabase
  const fetchGenericQuestions = async () => {
    const { data, error } = await supabase
      .from("interview_questions")
      .select("question");
    if (error) {
      console.error("Error retrieving questions from supabase");
    } else if (data) {
      setQuestions(data.map((q) => q.question));
    }
    setIsQuestionsLoading(false);
  };

  // When interview starts, fetch personalized questions first, fallback to generic
  const startInterview = async () => {
    if (!isCameraActive) {
      await activateCamera();
    }
    setIsInterviewStarted(true);
    setIsQuestionsLoading(true);
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (userId) {
      const gotPersonalized = await fetchPersonalizedQuestions(userId);
      if (!gotPersonalized) {
        await fetchGenericQuestions();
        setUsedPersonalized(false);
      }
    } else {
      await fetchGenericQuestions();
      setUsedPersonalized(false);
    }
  };

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

  useEffect(() => {
    if (!isInterviewStarted) {
      initializeCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isInterviewStarted]);

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

  const { isLoading, showProfileForm, profileData, userEmail, updateProfile, updateVideoUrl } = useProfile();

  const activateCamera = async () => {
    setIsCameraActive(true);
    await initializeCamera();
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
      setTimeout(() => setShowPreview(true), 300);
      console.log("Preview video URL:", newSignedUrl);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setIsAnswerRecorded(false);
    setSignedUrl(null);
    setShowPreview(false);
  };

  const markInterviewCompleted = async (interviewId: string, userId: string) => {
    const { error } = await supabase
      .from("interview_participants")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("interview_id", interviewId)
      .eq("user_id", userId);
    if (error) {
      console.error("Error marking interview as completed:", error);
    }
  };

  const handleFinishInterview = async () => {
    setIsInterviewFinished(true);
    setProcessingStatus("Uploading and analyzing your interview responses...");
    const userId = (await supabase.auth.getUser()).data.user?.id;
    let completedUploads = 0;
    for (const [questionIndex, videoBlob] of Object.entries(recordedAnswers)) {
      try {
        const { publicUrl, signedUrl: newSignedUrl, filename } = await uploadVideo(videoBlob);
        if (publicUrl && newSignedUrl) {
          const response = await fetch(`${getBackendUrl()}/analyze-video`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              video_url: newSignedUrl,
              user_id: userId,
              question_index: parseInt(questionIndex),
              question_text: questions[parseInt(questionIndex)],
              interview_id: interviewId,
            }),
          });
          if (response.ok) {
            completedUploads++;
            setProcessingStatus(
              `Processed ${completedUploads} of ${Object.keys(recordedAnswers).length} responses...`
            );
          }
        }
      } catch (error) {
        console.error(`Error processing answer for question ${questionIndex}:`, error);
      }
    }
    setIsAnalysisComplete(true);
    setProcessingStatus("All responses have been uploaded and sent for analysis!");
    if (interviewId && userId) {
      try {
        const { error: updateError } = await supabase
          .from("interview_participants")
          .update({
            completed: true,
          })
          .eq("interview_id", interviewId)
          .eq("user_id", userId);
        if (updateError) {
          console.error(`Error updating interview ${interviewId}:`, updateError);
        } else {
          console.log(`Successfully marked interview ${interviewId} as completed`);
        }
      } catch (error) {
        console.error("Error updating interview completion status:", error);
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setTimeout(() => {
      router.push("/candidates/thank-you");
    }, 3000);
  };

  const handleFinishClick = () => {
    setShowConfirmFinishModal(true);
  };

  const handleConfirmFinish = async () => {
    setShowConfirmFinishModal(false);
    setHasConfirmedFinish(true);
    await handleFinishInterview();
  };

  const handleCancelFinish = () => {
    setShowConfirmFinishModal(false);
  };

  if (!interviewId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-400">Missing interview ID in URL.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-neutral-400 text-sm">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <ProfileForm onSubmit={updateProfile} profileData={profileData || undefined} />
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-400">Loading interview...</div>
      </div>
    }>
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Interview Session</h1>
            <p className="text-neutral-400">Take your time and answer thoughtfully</p>
          </div>

          {/* Main Content Card */}
          <div className="bg-[#0f0f0f]/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 border border-white/[0.06] p-8 md:p-10">
            {!isInterviewStarted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl text-white font-semibold mb-6 text-center">
                  Prepare for Your Interview
                </h2>

                {/* Tips Card */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-amber-300 font-semibold text-lg mb-3">
                        Important Tips
                      </h3>
                      <ul className="text-neutral-300 space-y-2 list-none">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>Find a quiet place with good lighting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>Test your camera and microphone below</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>Speak clearly and maintain good posture</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>You&apos;ll answer {questions.length} questions one at a time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>You can review each recording before moving forward</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Device Selector */}
                <div className="mb-6">
                  <DeviceSelector
                    selectedVideoDeviceId={selectedVideoDeviceId}
                    selectedAudioDeviceId={selectedAudioDeviceId}
                    onVideoDeviceChange={handleVideoDeviceChange}
                    onAudioDeviceChange={handleAudioDeviceChange}
                  />
                </div>

                {/* Camera Preview */}
                <div className="mb-6">
                  <VideoPreview
                    stream={streamRef.current}
                    recordedUrl={signedUrl}
                    isLoading={cameraLoading}
                    error={cameraError}
                  />
                  {streamRef.current && !cameraError && !cameraLoading && (
                    <div className="mt-4">
                      <AudioLevelMeter stream={streamRef.current} />
                    </div>
                  )}
                </div>

                {/* Begin Interview Button */}
                {(!hasConfirmedFinish && !isInterviewFinished) && (
                  <motion.button
                    onClick={startInterview}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-lg font-semibold rounded-2xl transition-all shadow-lg shadow-amber-500/25"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Begin Interview
                    </span>
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isQuestionsLoading ? (
                  <div className="text-neutral-400 text-center py-12">
                    <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
                    Loading questions...
                  </div>
                ) : (
                  <>
                    {/* Question Header */}
                    <div className="mb-8">
                      {usedPersonalized && (
                        <div className="mb-4 flex items-center justify-center gap-2 text-emerald-400 text-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Questions personalized based on your resume
                        </div>
                      )}
                      
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-400">Progress</span>
                          <span className="text-sm font-medium text-amber-400">
                            {currentQuestionIndex + 1} of {questions.length}
                          </span>
                        </div>
                        <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Question Card */}
                      <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/[0.04]">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                            <span className="text-amber-400 font-bold text-lg">
                              Q{currentQuestionIndex + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl text-white font-semibold leading-relaxed">
                              {questions[currentQuestionIndex]}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Camera Preview Toggle */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-neutral-400">Camera Preview</span>
                        <button
                          className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.06] transition-all"
                          onClick={() => setShowCameraDuringInterview((prev) => !prev)}
                        >
                          {showCameraDuringInterview ? "Hide Camera" : "Show Camera"}
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {showCameraDuringInterview && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <VideoPreview
                              stream={streamRef.current}
                              recordedUrl={null}
                              isLoading={cameraLoading}
                              error={cameraError}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Recording Controls */}
                    {(!hasConfirmedFinish && !isInterviewFinished) && (
                      <RecordingControls
                        isRecording={isRecording}
                        recordingTime={recordingTime}
                        isUploading={isUploading}
                        uploadProgress={uploadProgress}
                        onStartRecording={startRecording}
                        onStopRecording={handleStopAnswerRecording}
                        onGoBack={() => router.push("/candidates")}
                      />
                    )}

                    {/* Next/Finish Buttons */}
                    {isAnswerRecorded && !isRecording && !isUploading && !hasConfirmedFinish && !isInterviewFinished && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end mt-8 gap-3"
                      >
                        {currentQuestionIndex < questions.length - 1 ? (
                          <motion.button
                            onClick={handleNextQuestion}
                            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/25 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="flex items-center gap-2">
                              Next Question
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={handleFinishClick}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Finish Interview
                            </span>
                          </motion.button>
                        )}
                      </motion.div>
                    )}

                    {/* Processing Status */}
                    {(hasConfirmedFinish || isInterviewFinished) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 text-center"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                          <p className="text-amber-400 font-medium">
                            {processingStatus || "Processing your interview. Please wait..."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Confirm Finish Modal */}
        <AnimatePresence>
          {showConfirmFinishModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: "spring", bounce: 0.25 }}
                className="bg-[#0f0f0f]/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 max-w-md w-full mx-auto overflow-hidden border border-white/[0.06]"
              >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-white/[0.04] bg-gradient-to-r from-emerald-500/10 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      Finish Interview?
                    </h3>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <p className="text-neutral-300 leading-relaxed mb-6">
                    Are you sure you want to finish and submit your interview? You won&apos;t be able to make changes after this.
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleConfirmFinish}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-center text-sm font-medium rounded-xl transition-all shadow-lg shadow-emerald-500/25"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Yes, Submit
                    </motion.button>

                    <motion.button
                      onClick={handleCancelFinish}
                      className="flex-1 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white text-center text-sm font-medium rounded-xl border border-white/[0.06] transition-all"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Suspense>
  );
}
