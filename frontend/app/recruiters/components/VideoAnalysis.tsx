import React from "react";
import { Video, Analysis } from "../types";
import EmotionTimeline from "./EmotionTimeline";

interface VideoAnalysisProps {
  video: Video;
  analysis: Analysis | null;
  isAnalyzing: boolean;
  onClose: () => void;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({
  video,
  analysis,
  isAnalyzing,
  onClose,
}) => {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen bg-gray-900 p-8 relative overflow-hidden">
      <div className="relative bg-gray-800 rounded-xl p-6 w-full max-w-7xl">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {video.title} Analysis
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close Dashboard
          </button>
        </div>

        {/* Main content grid - 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Video and Key Metrics */}
          <CandidateInfoColumn video={video} />

          {/* Column 2: Feedback Summary */}
          <div className="space-y-6">
            <InterviewSummary analysis={analysis} isAnalyzing={isAnalyzing} />
          </div>

          {/* Column 3: Behavioral Analysis and Communication Skills */}
          <AnalysisColumn analysis={analysis} isAnalyzing={isAnalyzing} />
        </div>
      </div>
    </main>
  );
};

// Sub-components
const CandidateInfoColumn: React.FC<{ video: Video }> = ({ video }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">
          Video Interview
        </h3>
        <video
          src={video.url}
          controls
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">
          Candidate Information
        </h3>
        {video.candidate_details ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-400">Full Name:</div>
              <div className="text-white">
                {video.candidate_details.full_name}
              </div>

              <div className="text-gray-400">Email:</div>
              <div className="text-white">{video.candidate_details.email}</div>

              <div className="text-gray-400">Phone:</div>
              <div className="text-white">{video.candidate_details.phone}</div>

              <div className="text-gray-400">Experience:</div>
              <div className="text-white">
                {video.candidate_details.experience}
              </div>

              <div className="text-gray-400">LinkedIn:</div>
              <div className="text-white">
                <a
                  href={video.candidate_details.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View Profile
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">
            No candidate information available
          </div>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-600 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">92%</div>
            <div className="text-sm text-gray-300">Overall Score</div>
          </div>
          <div className="bg-gray-600 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">4.8/5</div>
            <div className="text-sm text-gray-300">Interview Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InterviewSummary: React.FC<{
  analysis: Analysis | null;
  isAnalyzing: boolean;
}> = ({ analysis, isAnalyzing }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">
        Interview Summary
      </h3>
      <div className="space-y-4">
        {isAnalyzing ? (
          <div className="text-white">Analyzing video...</div>
        ) : analysis ? (
          <div className="bg-gray-600 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Key Points</h4>
            <div className="text-gray-300 whitespace-pre-line">
              {analysis.summary}
            </div>
          </div>
        ) : (
          <div className="text-white">No analysis available</div>
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
    <div className="space-y-6">
      <BehavioralAnalysis analysis={analysis} />
      <CommunicationAssessment analysis={analysis} isAnalyzing={isAnalyzing} />
      <EmotionalAnalysis analysis={analysis} isAnalyzing={isAnalyzing} />
    </div>
  );
};

const BehavioralAnalysis: React.FC<{ analysis: Analysis | null }> = ({
  analysis,
}) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">
        Behavioral Analysis
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-600 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-yellow-400">
              {analysis?.behavioral_scores?.confidence.score}%
            </div>
            <div className="text-sm text-gray-300">Confidence</div>
          </div>
          <div className="bg-gray-600 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-pink-400">
              {analysis?.behavioral_scores?.enthusiasm.score}%
            </div>
            <div className="text-sm text-gray-300">Enthusiasm</div>
          </div>
          <div className="bg-gray-600 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-cyan-400">
              {analysis?.behavioral_scores?.clarity.score}%
            </div>
            <div className="text-sm text-gray-300">Clarity</div>
          </div>
          <div className="bg-gray-600 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-orange-400">
              {analysis?.behavioral_scores?.leadership.score}%
            </div>
            <div className="text-sm text-gray-300">Leadership</div>
          </div>
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
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">
        Communication Assessment
      </h3>
      <div className="space-y-3">
        <div className="bg-gray-600 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">Key Strengths</h4>
          {isAnalyzing ? (
            <div className="animate-pulse h-20 bg-gray-500 rounded" />
          ) : (
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {analysis?.communication_analysis?.strengths.map(
                (strength, idx) => (
                  <li key={idx}>{strength}</li>
                )
              )}
            </ul>
          )}
        </div>
        <div className="bg-gray-600 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">Areas for Improvement</h4>
          {isAnalyzing ? (
            <div className="animate-pulse h-12 bg-gray-500 rounded" />
          ) : (
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {analysis?.communication_analysis?.improvements.map(
                (improvement, idx) => (
                  <li key={idx}>{improvement}</li>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const EmotionalAnalysis: React.FC<{
  analysis: Analysis | null;
  isAnalyzing: boolean;
}> = ({ analysis, isAnalyzing }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">
        Emotional Analysis
      </h3>
      {isAnalyzing ? (
        <div className="animate-pulse h-20 bg-gray-500 rounded" />
      ) : analysis?.emotion_results ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-600 p-3 rounded-lg">
              <div className="text-gray-300">Dominant Emotion</div>
              <div className="text-xl font-bold text-white capitalize">
                {analysis.emotion_results.summary.dominant_emotion}
              </div>
              <div className="text-sm text-gray-400">
                {(
                  analysis.emotion_results.summary.dominant_emotion_confidence *
                  100
                ).toFixed(1)}
                % confidence
              </div>
            </div>
            <div className="bg-gray-600 p-3 rounded-lg">
              <div className="text-gray-300">Frames Analyzed</div>
              <div className="text-xl font-bold text-white">
                {analysis.emotion_results.summary.total_frames_analyzed}
              </div>
            </div>
          </div>

          <div className="bg-gray-600 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3">Emotion Timeline</h4>
            <EmotionTimeline
              frames={analysis.emotion_results.detailed_results}
            />
          </div>

          <div className="bg-gray-600 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-3">
              Emotion Distribution
            </h4>
            <div className="space-y-2">
              {Object.entries(
                analysis.emotion_results.summary.average_emotions
              ).map(([emotion, value]) => (
                <div key={emotion} className="flex items-center">
                  <div className="w-24 text-gray-300 capitalize">{emotion}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-gray-300">
                    {(value * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-400">No emotional analysis available</div>
      )}
    </div>
  );
};

export default VideoAnalysis;
