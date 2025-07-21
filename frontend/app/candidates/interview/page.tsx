"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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
    // Optionally, clean up camera on unmount
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
      // Stop all tracks to turn off the camera
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
    return <div>Missing interview ID in URL.</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <ProfileForm onSubmit={updateProfile} profileData={profileData || undefined} />
    );
  }

  return (
    <Suspense fallback={<div>Loading interview...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-gray-900/80 rounded-2xl shadow-2xl p-8">
          {!isInterviewStarted ? (
            <div>
              <h2 className="text-2xl text-white/90 font-medium mb-4 text-center">
                You're about to start your interview
              </h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
                <h3 className="text-blue-300 font-medium flex items-center text-lg mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Important Tips:
                </h3>
                <ul className="text-white/70 space-y-2 pl-7 list-disc">
                  <li>Find a quiet place with good lighting.</li>
                  <li>Test your camera and microphone.</li>
                  <li>Speak clearly and maintain good posture.</li>
                  <li>You'll answer {questions.length} questions one at a time.</li>
                  <li>You can review each recording before moving to the next question.</li>
                </ul>
              </div>
              {/* Device/camera/mic check only before interview starts */}
              <div className="mb-6">
                <DeviceSelector
                  selectedVideoDeviceId={selectedVideoDeviceId}
                  selectedAudioDeviceId={selectedAudioDeviceId}
                  onVideoDeviceChange={handleVideoDeviceChange}
                  onAudioDeviceChange={handleAudioDeviceChange}
                />
              </div>
              <div className="mb-6">
                <VideoPreview
                  stream={streamRef.current}
                  recordedUrl={signedUrl}
                  isLoading={cameraLoading}
                  error={cameraError}
                />
                {streamRef.current && !cameraError && !cameraLoading && (
                  <AudioLevelMeter stream={streamRef.current} />
                )}
              </div>
              {/* Only show Begin Interview button if not finished/confirmed */}
              {(!hasConfirmedFinish && !isInterviewFinished) && (
                <button
                  onClick={startInterview}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Begin Interview
                </button>
              )}
            </div>
          ) : (
            <div>
              {isQuestionsLoading ? (
                <div className="text-gray-400 text-center py-8">Loading questions...</div>
              ) : (
                <div className="mb-6">
                  {usedPersonalized && (
                    <div className="mb-2 text-green-400 text-sm text-center">These questions are personalized based on your resume.</div>
                  )}
                  <div className="text-lg font-semibold text-white mb-2">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <div className="text-xl text-blue-300 font-bold mb-4">
                    {questions[currentQuestionIndex]}
                  </div>
                </div>
              )}
              {/* Camera preview and toggle during interview */}
              <div className="mb-4 flex flex-col items-end">
                {showCameraDuringInterview && (
                  <VideoPreview
                    stream={streamRef.current}
                    recordedUrl={null}
                    isLoading={cameraLoading}
                    error={cameraError}
                  />
                )}
                <button
                  className="mt-2 px-4 py-1 text-xs rounded bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
                  onClick={() => setShowCameraDuringInterview((prev) => !prev)}
                >
                  {showCameraDuringInterview ? "Hide Camera" : "Show Camera"}
                </button>
              </div>
              {/* Only show RecordingControls and Back button if not finished/confirmed */}
              {(!hasConfirmedFinish && !isInterviewFinished) && (
                <>
                  <RecordingControls
                    isRecording={isRecording}
                    recordingTime={recordingTime}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    onStartRecording={startRecording}
                    onStopRecording={handleStopAnswerRecording}
                    onGoBack={() => router.push("/candidates")}
                  />
                </>
              )}
              {isAnswerRecorded && !isRecording && !isUploading && !hasConfirmedFinish && !isInterviewFinished && (
                <div className="flex justify-end mt-6">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishClick}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-all"
                    >
                      Finish Interview
                    </button>
                  )}
                </div>
              )}
              {showConfirmFinishModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                  <div className="bg-gray-900 rounded-xl p-8 shadow-xl text-center">
                    <div className="text-white text-lg mb-4">Are you sure you want to finish and submit your interview? You won't be able to make changes after this.</div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleConfirmFinish}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-all"
                      >
                        Yes, Submit
                      </button>
                      <button
                        onClick={handleCancelFinish}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold shadow hover:bg-gray-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {(hasConfirmedFinish || isInterviewFinished) && (
                <div className="mt-8 text-center text-blue-300 font-medium animate-pulse">
                  {processingStatus || "Processing your interview. Please wait..."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
} 