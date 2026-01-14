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
}

export interface JobDescription {
  job_description: string;
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

// Emotion analysis types
export interface EmotionScores {
  happy: number;
  sad: number;
  angry: number;
  neutral: number;
  surprise: number;
  fear?: number;
  disgust?: number;
}

export interface EmotionFrame {
  timestamp: number;
  emotions: EmotionScores;
}
