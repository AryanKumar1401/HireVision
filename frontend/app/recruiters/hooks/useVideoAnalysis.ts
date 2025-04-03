import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Video, Analysis } from '../types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useVideoAnalysis = () => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    [key: string]: Analysis;
  }>({});

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

      // Try to get analysis from Supabase
      const { data: analysisData, error } = await supabase
        .from("analysis_results")
        .select("*")
        .eq("id", selectedVideo.id)
        .single();
        
      if (!error && analysisData) {
        // Convert stored JSON strings back to objects if needed
        const processedData = processAnalysisData(analysisData);
        setAnalysisResults((prev) => ({
          ...prev,
          [selectedVideo.id]: processedData,
        }));
        setAnalysis(processedData);
        setIsAnalyzing(false);
        return;
      }

      // If not found in Supabase, call the API (fallback)
      console.log("Not found in Supabase. Calling API (fallback)...");
      const response = await fetch("http://localhost:8000/analyze-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_url: selectedVideo.url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === "Duplicate") {
          // If duplicate error, use existing analysis
          const existingAnalysis = analysisResults[selectedVideo.id];
          if (existingAnalysis) {
            setAnalysis(existingAnalysis);
            return;
          }
        }
        throw new Error(errorData.detail || "Analysis failed");
      }

      const data = await response.json();
      setAnalysisResults((prev) => ({
        ...prev,
        [selectedVideo.id]: data,
      }));
      setAnalysis(data);
      
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

  // Helper function to process analysis data
  const processAnalysisData = (data: any): Analysis => {
    return {
      ...data,
      behavioral_scores:
        typeof data.behavioral_scores === "string"
          ? JSON.parse(data.behavioral_scores)
          : data.behavioral_scores,
      communication_analysis:
        typeof data.communication_analysis === "string"
          ? JSON.parse(data.communication_analysis)
          : data.communication_analysis,
      emotion_results:
        typeof data.emotion_results === "string"
          ? JSON.parse(data.emotion_results)
          : data.emotion_results,
    };
  };

  return { analysis, isAnalyzing, analyzeVideo };
};
