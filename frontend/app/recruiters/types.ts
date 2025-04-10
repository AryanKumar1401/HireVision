export interface CandidateDetails {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  experience: string;
  linkedin: string;
  video_url?: string;
}

export interface RecruiterProfile {
  id: string;
  full_name: string;
  company: string;
  job_title: string;
  email: string;
  phone?: string;
  linkedin?: string;
  hiring_for?: string[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
    candidate_details?: CandidateDetails;
}

export interface EmotionSummary {
  total_frames_analyzed: number;
  dominant_emotion: string;
  dominant_emotion_confidence: number;
  average_emotions: {
    angry: number;
    disgust: number;
    fear: number;
    happy: number;
    sad: number;
    surprise: number;
    neutral: number;
  };
}

export interface EmotionFrame {
  frame: number;
  timestamp: number;
  emotions: {
    angry: number;
    disgust: number;
    fear: number;
    happy: number;
    sad: number;
    surprise: number;
    neutral: number;
  };
  box: number[];
}

export interface Analysis {
  summary: string;
  behavioral_scores?: {
    confidence: { score: number; explanation: string };
    clarity: { score: number; explanation: string };
    enthusiasm: { score: number; explanation: string };
    leadership: { score: number; explanation: string };
  };
  communication_analysis?: {
    strengths: string[];
    improvements: string[];
  };
emotional_analysis?: {
    summary: EmotionSummary;
  };
  emotion_results?: {
    summary: EmotionSummary;
    detailed_results: EmotionFrame[];
  };
}

export interface JobDescription {
  title: string;
  company: string;
  requirements: string[];
  responsibilities: string[];
}
