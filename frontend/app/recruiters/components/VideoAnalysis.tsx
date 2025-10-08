import React, { useState } from "react";

// Mock types for demonstration
interface Video {
  title: string;
  url: string;
  candidate_details?: {
    full_name: string;
    email: string;
    phone: string;
    experience: string;
    linkedin: string;
  };
}

interface InterviewAnswer {
  id: string;
  question_index: number;
  question_text: string;
  video_url?: string;
}

interface Analysis {
  summary: string;
  behavioral_insights?: {
    insights: string[];
  };
  communication_analysis?: {
    strengths: string[];
    improvements: string[];
  };
}

interface VideoAnalysisProps {
  video: Video;
  candidateAnswers?: InterviewAnswer[];
  analysis: Analysis | null;
  isAnalyzing: boolean;
  onClose: () => void;
  onAnswerSelect: (answer: InterviewAnswer) => void;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({
  video,
  candidateAnswers = [],
  analysis,
  isAnalyzing,
  onClose,
  onAnswerSelect,
}) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0);
  const hasMultipleAnswers = candidateAnswers.length > 1;
  const currentAnswer = candidateAnswers[selectedAnswerIndex];

  const handleAnswerChange = (index: number) => {
    setSelectedAnswerIndex(index);
    onAnswerSelect(candidateAnswers[index]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Elegant Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight">
                  {video.title}
                </h1>
              </div>
              <p className="text-slate-400 text-sm ml-15">
                Comprehensive interview analysis and candidate assessment
              </p>
            </div>
            <button
              onClick={onClose}
              className="group relative px-6 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </span>
            </button>
          </div>
        </div>

        {/* Question Navigation - Redesigned as pills */}
        {hasMultipleAnswers && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Interview Questions
              </h3>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
                {candidateAnswers.length} responses
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {candidateAnswers.map((answer, index) => (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerChange(index)}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    index === selectedAnswerIndex
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                      : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 hover:scale-105"
                  }`}
                >
                  Question {answer.question_index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Video & Candidate Info */}
          <div className="lg:col-span-4 space-y-6">
            <CandidateInfoColumn video={video} currentAnswer={currentAnswer} />
          </div>

          {/* Middle Column - Summary */}
          <div className="lg:col-span-4 space-y-6">
            <InterviewSummary
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              questionText={currentAnswer?.question_text}
            />
          </div>

          {/* Right Column - Analysis */}
          <div className="lg:col-span-4 space-y-6">
            <AnalysisColumn analysis={analysis} isAnalyzing={isAnalyzing} />
          </div>
        </div>
      </div>
    </main>
  );
};

const CandidateInfoColumn: React.FC<{
  video: Video;
  currentAnswer?: InterviewAnswer;
}> = ({ video, currentAnswer }) => {
  const videoUrl = currentAnswer?.video_url || video.url;

  return (
    <>
      {/* Video Player */}
      <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h3 className="text-sm font-medium text-white">Live Interview Recording</h3>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <video
              src={videoUrl}
              controls
              className="w-full rounded-xl bg-black"
            />
          </div>
        </div>
      </div>

      {/* Candidate Information Card */}
      <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-sm font-medium text-white">Candidate Profile</h3>
          </div>
          {video.candidate_details ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <InfoRow icon="user" label="Full Name" value={video.candidate_details.full_name} />
                <InfoRow icon="mail" label="Email" value={video.candidate_details.email} />
                <InfoRow icon="phone" label="Phone" value={video.candidate_details.phone} />
                <InfoRow icon="briefcase" label="Experience" value={video.candidate_details.experience} />
                <div className="flex items-start gap-3 pt-3 border-t border-slate-700/50">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-400 mb-1">LinkedIn</div>
                    <a
                      href={video.candidate_details.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors truncate block"
                    >
                      View Profile →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 text-center py-8">
              No candidate information available
            </div>
          )}
        </div>
      </div>
    </>
  );
};

type IconKey = "user" | "mail" | "phone" | "briefcase";
const InfoRow: React.FC<{ icon: IconKey; label: string; value: string }> = ({ icon, label, value }) => {
  const icons = {
    user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    briefcase: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  };

  return (
    <div className="flex items-start gap-3">
      <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icons[icon]}
      </svg>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-400 mb-1">{label}</div>
        <div className="text-sm text-slate-200 font-medium truncate">{value}</div>
      </div>
    </div>
  );
};

const InterviewSummary: React.FC<{
  analysis: Analysis | null;
  isAnalyzing: boolean;
  questionText?: string;
}> = ({ analysis, isAnalyzing, questionText }) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-sm font-medium text-white">Interview Summary</h3>
        </div>

        {questionText && (
          <div className="mb-5 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-start gap-2 mb-2">
              <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-slate-300">Question</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed italic pl-6">{questionText}</p>
          </div>
        )}

        {isAnalyzing ? (
          <div className="space-y-3">
            <div className="h-4 bg-slate-700/30 rounded-full animate-pulse"></div>
            <div className="h-4 bg-slate-700/30 rounded-full animate-pulse w-5/6"></div>
            <div className="h-4 bg-slate-700/30 rounded-full animate-pulse w-4/6"></div>
          </div>
        ) : analysis ? (
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
            <div className="flex items-start gap-2 mb-3">
              <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-xs font-medium text-slate-300">Key Points</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line pl-6">{analysis.summary}</p>
          </div>
        ) : (
          <div className="text-sm text-slate-400 text-center py-8">
            No analysis available
          </div>
        )}
      </div>
    </div>
  );
};

const AnalysisColumn: React.FC<{
  analysis: Analysis | null;
  isAnalyzing: boolean;
}> = ({ analysis, isAnalyzing }) => {
  return (
    <>
      <BehavioralAnalysis analysis={analysis} />
      <CommunicationAssessment analysis={analysis} isAnalyzing={isAnalyzing} />
    </>
  );
};

const BehavioralAnalysis: React.FC<{ analysis: Analysis | null }> = ({ analysis }) => {
  const insights = analysis?.behavioral_insights?.insights || [];
  
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="text-sm font-medium text-white">Behavioral Analysis</h3>
        </div>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div key={index} className="group/item p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 hover:border-slate-600/50 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-orange-400">{index + 1}</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed flex-1">{insight}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-400 text-center py-8">
              No behavioral insights available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommunicationAssessment: React.FC<{
  analysis: Analysis | null;
  isAnalyzing: boolean;
}> = ({ analysis, isAnalyzing }) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="text-sm font-medium text-white">Communication Assessment</h3>
        </div>
        <div className="space-y-4">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h4 className="text-xs font-medium text-emerald-300">Key Strengths</h4>
            </div>
            {isAnalyzing ? (
              <div className="space-y-2">
                <div className="h-3 bg-slate-700/30 rounded-full animate-pulse"></div>
                <div className="h-3 bg-slate-700/30 rounded-full animate-pulse w-4/5"></div>
              </div>
            ) : (
              <ul className="space-y-2">
                {analysis?.communication_analysis?.strengths?.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-200">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span className="flex-1">{strength}</span>
                  </li>
                )) || <li className="text-sm text-slate-400">No strengths data available</li>}
              </ul>
            )}
          </div>

          {/* Improvements */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h4 className="text-xs font-medium text-amber-300">Areas for Improvement</h4>
            </div>
            {isAnalyzing ? (
              <div className="space-y-2">
                <div className="h-3 bg-slate-700/30 rounded-full animate-pulse"></div>
                <div className="h-3 bg-slate-700/30 rounded-full animate-pulse w-3/5"></div>
              </div>
            ) : (
              <ul className="space-y-2">
                {analysis?.communication_analysis?.improvements?.map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-200">
                    <span className="text-amber-400 mt-1">•</span>
                    <span className="flex-1">{improvement}</span>
                  </li>
                )) || <li className="text-sm text-slate-400">No improvements data available</li>}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Component
export default function App() {
  const mockVideo: Video = {
    title: "Senior Software Engineer Interview",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    candidate_details: {
      full_name: "Sarah Anderson",
      email: "sarah.anderson@email.com",
      phone: "+1 (555) 123-4567",
      experience: "8 years",
      linkedin: "https://linkedin.com/in/sarahanderson"
    }
  };

  const mockAnswers: InterviewAnswer[] = [
    {
      id: "1",
      question_index: 0,
      question_text: "Tell me about a challenging project you worked on and how you overcame obstacles.",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
      id: "2",
      question_index: 1,
      question_text: "Describe your approach to mentoring junior developers.",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      id: "3",
      question_index: 2,
      question_text: "How do you handle technical disagreements with team members?",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    }
  ];

  const mockAnalysis: Analysis = {
    summary: "The candidate demonstrated strong technical knowledge and excellent problem-solving skills. They provided concrete examples from past experiences and showed a deep understanding of software engineering principles. Their communication was clear and structured throughout the interview.",
    behavioral_insights: {
      insights: [
        "Shows strong leadership qualities and takes initiative in challenging situations",
        "Demonstrates excellent collaboration skills and values team input",
        "Exhibits growth mindset with focus on continuous learning and improvement",
        "Handles pressure well and maintains composure during technical discussions"
      ]
    },
    communication_analysis: {
      strengths: [
        "Clear and concise explanations of technical concepts",
        "Active listening and thoughtful responses to questions",
        "Good use of examples to illustrate points",
        "Professional demeanor and confident body language"
      ],
      improvements: [
        "Could provide more specific metrics when discussing achievements",
        "Occasionally rushes through complex explanations"
      ]
    }
  };

  return (
    <VideoAnalysis
      video={mockVideo}
      candidateAnswers={mockAnswers}
      analysis={mockAnalysis}
      isAnalyzing={false}
      onClose={() => console.log("Close clicked")}
      onAnswerSelect={(answer) => console.log("Answer selected:", answer)}
    />
  );
}