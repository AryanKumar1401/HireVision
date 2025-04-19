import { useState } from 'react';
import { createClient } from '@/utils/auth';
import { Video, Analysis, InterviewAnswer } from '../types';

const supabase = createClient();

export const useVideoAnalysis = () => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    [key: string]: Analysis;
  }>({});
  
  // Helper function to safely parse JSON fields if they're stored as strings
  const safeParseJSON = (data: any) => {
    if (!data) return null;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        return null;
      }
    }
    return data; // Already an object
  };

  const analyzeVideo = async (selectedVideo: Video | null) => {
    if (!selectedVideo) return;
    
    try {
      setIsAnalyzing(true);

      // Check if we already have analysis for this video in the cache
      if (analysisResults[selectedVideo.id]) {
        setAnalysis(analysisResults[selectedVideo.id]);
        setIsAnalyzing(false);
        return;
      }

      // Get user_id from the selected video
      const userId = selectedVideo.id; // Since video.id is now the candidate's user_id
      console.log(`Analyzing video for user_id: ${userId}, url: ${selectedVideo.url}`);

      // Fetch all interview answers for this user
      const { data: answers, error } = await supabase
        .from("interview_answers")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error(`Error fetching interview answers: ${error.message}`);
        throw new Error(`Error fetching interview answers: ${error.message}`);
      }

      if (!answers || answers.length === 0) {
        console.log(`No interview answers found for user_id: ${userId}`);
        setAnalysis({ summary: "No interview analysis found for this candidate." });
        setIsAnalyzing(false);
        return;
      }

      console.log(`Found ${answers.length} answers for user_id: ${userId}`);
      
      // Find the specific answer that matches the video URL if possible
      let relevantAnswer = answers.find(answer => answer.video_url === selectedVideo.url);
      
      // If no match is found, use the first (most recent) answer
      if (!relevantAnswer) {
        console.log(`No exact video URL match found, using most recent answer`);
        relevantAnswer = answers[0];
      } else {
        console.log(`Found matching answer with question_index: ${relevantAnswer.question_index}`);
      }
      
      // Debug the data types we're getting from the database
      console.log("Raw answer data:", relevantAnswer);
      console.log("Retrieved answer data types:", {
        summary: typeof relevantAnswer.summary,
        behavioral_scores: typeof relevantAnswer.behavioral_scores,
        communication_analysis: typeof relevantAnswer.communication_analysis,
        emotion_results: typeof relevantAnswer.emotion_results
      });
      
      // Ensure JSON fields are properly parsed
      const behavioralScores = safeParseJSON(relevantAnswer.behavioral_scores);
      const communicationAnalysis = safeParseJSON(relevantAnswer.communication_analysis);
      const emotionResults = safeParseJSON(relevantAnswer.emotion_results);
      
      console.log("Parsed behavioral_scores:", behavioralScores);
      console.log("Parsed communication_analysis:", communicationAnalysis);
      console.log("Parsed emotion_results:", emotionResults);
        
      // Create Analysis object from the answer data
      const analysisData: Analysis = {
        summary: relevantAnswer.summary || "No summary available",
        behavioral_scores: behavioralScores,
        communication_analysis: communicationAnalysis,
        emotion_results: emotionResults
      };
      
      // Add to cache
      setAnalysisResults(prev => ({
        ...prev,
        [selectedVideo.id]: analysisData
      }));
      
      setAnalysis(analysisData);
      console.log("Analysis data set successfully:", analysisData);
    } catch (error) {
      console.error("Error analyzing video:", error);
      // Show error to user
      if (error instanceof Error) {
        setAnalysis({ summary: `Error: ${error.message}` });
      } else {
        setAnalysis({ summary: "An unknown error occurred" });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Method to analyze a specific interview answer
  const analyzeAnswer = async (answer: InterviewAnswer | null) => {
    if (!answer) return;
    
    try {
      setIsAnalyzing(true);

      // Generate a unique cache key for this specific answer
      const cacheKey = `${answer.user_id}_${answer.question_index}`;
      console.log(`Analyzing specific answer: user_id=${answer.user_id}, question_index=${answer.question_index}`);
      
      // Check if we already have analysis for this answer in the cache
      if (analysisResults[cacheKey]) {
        console.log("Using cached analysis data");
        setAnalysis(analysisResults[cacheKey]);
        setIsAnalyzing(false);
        return;
      }
      
      // Debug the data types
      console.log("Raw answer data for specific answer:", answer);
      console.log("Answer data types:", {
        summary: typeof answer.summary,
        behavioral_scores: typeof answer.behavioral_scores,
        communication_analysis: typeof answer.communication_analysis,
        emotion_results: typeof answer.emotion_results
      });
      
      // Ensure JSON fields are properly parsed
      const behavioralScores = safeParseJSON(answer.behavioral_scores);
      const communicationAnalysis = safeParseJSON(answer.communication_analysis);
      const emotionResults = safeParseJSON(answer.emotion_results);

      // Use the data from the answer directly since it already contains all analysis information
      const analysisData: Analysis = {
        summary: answer.summary || "No summary available",
        behavioral_scores: behavioralScores,
        communication_analysis: communicationAnalysis,
        emotion_results: emotionResults
      };
      
      // Add to cache
      setAnalysisResults(prev => ({
        ...prev,
        [cacheKey]: analysisData
      }));
      
      setAnalysis(analysisData);
      console.log("Analysis data for specific answer set successfully:", analysisData);
    } catch (error) {
      console.error("Error analyzing answer:", error);
      if (error instanceof Error) {
        setAnalysis({ summary: `Error: ${error.message}` });
      } else {
        setAnalysis({ summary: "An unknown error occurred" });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analysis, isAnalyzing, analyzeVideo, analyzeAnswer };
};
