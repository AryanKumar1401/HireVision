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
  company_number: string;
  company: string;
  job_title: string;
  email: string;
  phone?: string;
  linkedin?: string;
  hiring_for?: string[];
}

// Legacy Video interface - kept for backward compatibility
export interface Video {
  id: string;
  title: string;
  url: string;
  created_at?: string;
  candidate_details?: CandidateDetails;
}

// New interface for interview answers
export interface InterviewAnswer {
  id: string;
  user_id: string;
  question_index: number;
  question_text: string;
  video_url: string; // Changed from answer_video_url to match DB column
  summary: string; // Added to match DB column
  transcript?: string; // Added to match DB column
  behavioral_scores?: any; // Using any for jsonb type
  communication_analysis?: any; // Using any for jsonb type
  behavioral_insights?: any; // Using any for jsonb type
  emotion_results?: any; // Using any for jsonb type
  created_at: string;
  analysis?: Analysis | null; // Virtual property computed from the above fields
}

// New interface for candidate interviews
export interface CandidateInterview {
  candidate_id: string;
  candidate_details: CandidateDetails;
  answers: InterviewAnswer[];
  created_at: string;
  latest_answer_date: string;
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
  behavioral_insights?: {
    insights: string[];
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

export interface FilterOptions {
  experienceLevel: string[];
  searchQuery: string;
  ratingMin: number;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export type FilterChangeHandler = (
  filterType: keyof FilterOptions,
  value: any
) => void;
