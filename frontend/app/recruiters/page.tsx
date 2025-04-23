"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/auth";
import { useRecruiterProfile } from "./hooks/useRecruiterProfile";
import { RecruiterProfileForm } from "./components/RecruiterProfileForm";
import Dashboard from "./components/Dashboard";
import VideoAnalysis from "./components/VideoAnalysis";
import InterviewQuestions from "./components/InterviewQuestions";
import {
  Video,
  CandidateInterview,
  InterviewAnswer,
  CandidateDetails,
  Analysis,
} from "./types";
import { useVideoAnalysis } from "./hooks/useVideoAnalysis";

const supabase = createClient();

export default function RecruitersPage() {
  const router = useRouter();
  const { isLoading, showProfileForm, profileData, userEmail, updateProfile } =
    useRecruiterProfile();
  const [candidateInterviews, setCandidateInterviews] = useState<
    CandidateInterview[]
  >([]);
  const [legacyVideos, setLegacyVideos] = useState<Video[]>([]); // For backward compatibility
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<InterviewAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<InterviewAnswer | null>(
    null
  );
  const { analysis, isAnalyzing, analyzeVideo, analyzeAnswer } =
    useVideoAnalysis();
  const INVITE_API = "http://localhost:8000/invite";

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteMessage(null);
    try {
      const res = await fetch(INVITE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.replace(/[\r\n]/g, '').trim() }),
      });

      if (!res.ok) {
        const { detail } = await res.json();
        throw new Error(detail || "Failed to send invite");
      }

      const data = await res.json();
      
      if (data.success) {
        setInviteMessage(data.message || "Invite sent successfully! 🎉");
        setInviteEmail("");
      } else {
        throw new Error(data.message || "Failed to send invite");
      }
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

    // Find all answers for this candidate in the candidateInterviews array
    const candidateId = video.id;
    const candidateInterview = candidateInterviews.find(
      (interview) => interview.candidate_id === candidateId
    );

    if (candidateInterview && candidateInterview.answers.length > 0) {
      // We have interview answers for this candidate
      setSelectedAnswers(candidateInterview.answers);

      // Set the first answer as the selected one and analyze it
      const firstAnswer = candidateInterview.answers[0];
      setSelectedAnswer(firstAnswer);
      await analyzeAnswer(firstAnswer);
    } else {
      // Fall back to the legacy behavior - analyze the video directly
      setSelectedAnswers([]);
      setSelectedAnswer(null);
      await analyzeVideo(video);
    }
  };

  // New function to handle selection of specific answer
  const handleAnswerSelect = async (answer: InterviewAnswer) => {
    setSelectedAnswer(answer);
    await analyzeAnswer(answer);
  };

  const handleCloseAnalysis = () => {
    setSelectedVideo(null);
    setSelectedAnswers([]);
    setSelectedAnswer(null);
  };

  useEffect(() => {
    const fetchCandidateInterviews = async () => {
      try {
        console.log("Fetching interview data from Supabase...");

        // First check the connection to Supabase
        try {
          const { data: connectionTest, error: connectionError } =
            await supabase.from("profiles").select("count").limit(1);

          if (connectionError) {
            console.error("Supabase connection test failed:", connectionError);
            console.log(
              "Connection to Supabase failed, falling back to legacy method"
            );
            fetchLegacyVideos();
            return;
          }

          console.log("Supabase connection test successful:", connectionTest);
        } catch (connErr) {
          console.error("Supabase connection error:", connErr);
          fetchLegacyVideos();
          return;
        }

        // Now attempt to get interview_answers
        const { data: allAnswers, error: answersError } = await supabase
          .from("interview_answers")
          .select("*")
          .limit(1);

        if (answersError) {
          console.error(
            "Error checking interview_answers table:",
            answersError
          );
          console.log("Falling back to legacy method due to table error");
          fetchLegacyVideos();
          return;
        }

        // Log the raw response
        console.log("Raw response from interview_answers table:", allAnswers);

        if (!allAnswers || allAnswers.length === 0) {
          console.log(
            "No interview answers found, falling back to legacy method"
          );
          fetchLegacyVideos();
          return;
        }

        console.log("Successfully found interview answers table with data");

        // Fetch all distinct user_ids who have interview answers
        const { data: userIdData, error: userIdError } = await supabase
          .from("interview_answers")
          .select("user_id")
          .limit(100);

        if (userIdError) {
          console.error("Error fetching user IDs:", userIdError);
          fetchLegacyVideos();
          return;
        }

        // Get unique user IDs using Set
        const uniqueUserIds = [
          ...new Set(userIdData.map((item) => item.user_id)),
        ];
        console.log(
          `Found ${uniqueUserIds.length} unique candidates with interviews`
        );

        if (uniqueUserIds.length === 0) {
          console.log(
            "No unique candidate IDs found, falling back to legacy method"
          );
          fetchLegacyVideos();
          return;
        }

        // Fetch candidate profiles for these users
        const { data: candidates, error: candidatesError } = await supabase
          .from("profiles")
          .select("*")
          .in("id", uniqueUserIds);

        if (candidatesError || !candidates || candidates.length === 0) {
          console.error("Error fetching candidate profiles:", candidatesError);
          console.log("Falling back to legacy method due to profiles error");
          fetchLegacyVideos();
          return;
        }

        console.log(`Found ${candidates.length} candidate profiles`);

        // For each candidate, fetch their interview answers
        const candidateInterviewsData: CandidateInterview[] = [];
        const videoObjects: Video[] = [];

        for (const candidate of candidates) {
          const { data: answers, error: answersError } = await supabase
            .from("interview_answers")
            .select("*")
            .eq("user_id", candidate.id)
            .order("created_at", { ascending: false });

          if (answersError || !answers || answers.length === 0) {
            console.log(
              `No answers found for candidate ${candidate.id}, skipping`
            );
            continue;
          }

          console.log(
            `Found ${answers.length} answers for candidate ${candidate.id}`
          );

          // Process the answers
          const candidateDetails: CandidateDetails = {
            id: candidate.id,
            full_name: candidate.full_name || "Unknown Candidate",
            email: candidate.email || "",
            phone: candidate.phone || "",
            experience: candidate.experience || "",
            linkedin: candidate.linkedin || "",
          };

          const processedAnswers: InterviewAnswer[] = answers.map((answer) => {
            // Prepare analysis object from the answer data
            const analysis: Analysis = {
              summary: answer.summary || "",
              behavioral_scores: answer.behavioral_scores,
              communication_analysis: answer.communication_analysis,
              emotion_results: answer.emotion_results,
            };

            return {
              id: answer.id,
              user_id: answer.user_id,
              question_index: answer.question_index,
              question_text:
                answer.question_text || `Question ${answer.question_index + 1}`,
              video_url: answer.video_url,
              summary: answer.summary || "",
              transcript: answer.transcript,
              behavioral_scores: answer.behavioral_scores,
              communication_analysis: answer.communication_analysis,
              emotion_results: answer.emotion_results,
              created_at: answer.created_at,
              analysis: analysis,
            };
          });

          // Add candidate interview data
          candidateInterviewsData.push({
            candidate_id: candidate.id,
            candidate_details: candidateDetails,
            answers: processedAnswers,
            created_at: answers[0].created_at,
            latest_answer_date: answers[0].created_at,
          });

          // Create a legacy Video object for the candidate (using the first answer's video)
          // This is needed for compatibility with the existing Dashboard component
          videoObjects.push({
            id: candidate.id,
            title: `${candidateDetails.full_name}'s Interview`,
            url: answers[0].video_url,
            created_at: answers[0].created_at,
            candidate_details: candidateDetails,
          });
        }

        if (candidateInterviewsData.length === 0) {
          console.log(
            "No complete candidate interviews found, falling back to legacy method"
          );
          fetchLegacyVideos();
          return;
        }

        console.log(
          `Successfully processed ${candidateInterviewsData.length} candidate interviews`
        );
        setCandidateInterviews(candidateInterviewsData);
        setLegacyVideos(videoObjects);
      } catch (error) {
        console.error("Error in fetchCandidateInterviews:", error);
        console.log("Falling back to legacy method due to error");
        fetchLegacyVideos();
      }
    };

    // Legacy method - for backward compatibility
    const fetchLegacyVideos = async () => {
      try {
        console.log("Fetching legacy video data from profiles...");
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .not("video_url", "is", null);

        if (error) {
          console.error("Error fetching profiles:", error);
          return;
        }

        console.log(`Found ${profiles.length} profiles with video_url`);

        // Transform profiles into Video objects
        const videoData: Video[] = profiles.map((profile) => ({
          id: profile.id,
          title: `${profile.full_name}'s Interview`,
          url: profile.video_url || "",
          created_at: profile.created_at,
          candidate_details: {
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            phone: profile.phone || "",
            experience: profile.experience || "",
            linkedin: profile.linkedin || "",
          },
        }));

        setLegacyVideos(videoData);
      } catch (error) {
        console.error("Error in fetchLegacyVideos:", error);
      }
    };

    fetchCandidateInterviews();
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

  // Define top applicants based on most recent interviews
  const topApplicants =
    candidateInterviews.length > 0
      ? candidateInterviews
          .slice(0, 2)
          .map((interview) => interview.candidate_details.full_name)
      : legacyVideos
          .slice(0, 2)
          .map((video) => video.candidate_details?.full_name || "Unknown");

  // Choose which videos array to use based on whether we have new format data
  const videosToUse = legacyVideos; // Always use legacy format for Dashboard component compatibility

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

            {
              <p className="mt-2 text-sm text-center text-gray-300">
                {inviteMessage}
              </p>
            }

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
          candidateAnswers={selectedAnswers}
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          onClose={handleCloseAnalysis}
          onAnswerSelect={handleAnswerSelect}
        />
      ) : (
        <>
          <Dashboard
            videos={videosToUse}
            topApplicants={topApplicants}
            onVideoSelect={handleVideoSelect}
            onOpenInvite={() => setInviteOpen(true)}
            onBackClick={() => router.push("/")}
            recruiterName={profileData?.full_name}
            recruiterEmail={userEmail || undefined}
          />
          <div className="mt-8 max-w-7xl mx-auto px-4">
            {profileData?.company_number ? (
              <InterviewQuestions company_number={profileData.company_number} />
            ) : (
              <div className="text-center text-white">
                Please update your profile with your Company ID to manage
                interview questions.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
