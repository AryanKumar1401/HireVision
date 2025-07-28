import React, { useState } from "react";
import { Video, Analysis, InterviewAnswer } from "../types";

interface VideoAnalysisProps {
  video: Video;
  candidateAnswers?: InterviewAnswer[]; // All answers for this candidate
  analysis: Analysis | null;
  isAnalyzing: boolean;
  onClose: () => void;
  onAnswerSelect: (answer: InterviewAnswer) => void; // Callback for when an answer is selected
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({
  video,
  candidateAnswers = [],
  analysis,
  isAnalyzing,
  onClose,
  onAnswerSelect,
}) => {
  // State to track the currently selected answer index
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0);

  // Determine if we have multiple answers to navigate between
  const hasMultipleAnswers = candidateAnswers.length > 1;

  // Get the currently selected answer
  const currentAnswer = candidateAnswers[selectedAnswerIndex];

  // Handle switching to a different answer
  const handleAnswerChange = (index: number) => {
    setSelectedAnswerIndex(index);
    onAnswerSelect(candidateAnswers[index]);
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen bg-gray-900 p-8 relative overflow-hidden">
      <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-8 w-full max-w-7xl shadow-2xl">
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

        {/* Question navigation tabs - only show if multiple answers exist */}
        {hasMultipleAnswers && (
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-5 tracking-wide text-center">
              Interview Questions
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidateAnswers.map((answer, index) => (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerChange(index)}
                  className={`px-4 py-2 rounded-full text-md transition-all font-semibold ${index === selectedAnswerIndex
                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
                    : "bg-white bg-opacity-10 text-gray-300 hover:bg-white hover:bg-opacity-20"
                    }`}
                >
                  Question {answer.question_index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main content grid - 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Video and Key Metrics */}
          <CandidateInfoColumn video={video} currentAnswer={currentAnswer} />

          {/* Column 2: Feedback Summary */}
          <div className="space-y-6">
            <InterviewSummary
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              questionText={currentAnswer?.question_text}
            />
          </div>

          {/* Column 3: Behavioral Analysis and Communication Skills */}
          <AnalysisColumn analysis={analysis} isAnalyzing={isAnalyzing} />
        </div>
      </div>
    </main>
  );
};

// Sub-components
const CandidateInfoColumn: React.FC<{
  video: Video;
  currentAnswer?: InterviewAnswer;
}> = ({ video, currentAnswer }) => {
  // Use the current answer's video URL if available, otherwise fall back to the main video URL
  const videoUrl = currentAnswer?.video_url || video.url;

  return (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-10 rounded-2xl p-5 shadow-md hover:scale-[1.01] transition-transform">
        <h3 className="text-2xl font-bold text-white mb-5 tracking-wide text-center">
          Video Interview
        </h3>
        <video
          src={videoUrl}
          controls
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      <div className="bg-gradient-to-br from-green-600 to-yellow-600 bg-opacity-10 rounded-2xl p-5 shadow-md hover:scale-[1.01] transition-transform">
        <h3 className="text-2xl font-bold text-white mb-5 tracking-wide text-center">
          Candidate Information
        </h3>
        {video.candidate_details ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className=" text-lg font-bold text-white-400">Full Name:</div>
              <div className="text-lg font-bold text-white-400">
                {video.candidate_details.full_name}
              </div>

              <div className="text-lg font-bold text-white-400">Email:</div>
              <div className="text-md font-bold text-white-400">{video.candidate_details.email}</div>

              <div className="text-lg font-bold text-white-400">Phone:</div>
              <div className="text-lg font-bold text-white-400">{video.candidate_details.phone}</div>

              <div className="text-lg font-bold text-white-400">Experience:</div>
              <div className="text-lg font-bold text-white-400">
                {video.candidate_details.experience}
              </div>

              <div className="text-lg font-bold text-white-400">LinkedIn:</div>
              <div className="text-lg font-bold text-white-400">
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

      {/* <div className="bg-white bg-opacity-10 rounded-2xl p-5 shadow-md hover:scale-[1.01] transition-transform">
        <h3 className="text-2xl font-bold text-white mb-5 tracking-wide text-center">
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
      </div> */}
    </div>
  );
};

const InterviewSummary: React.FC<{
  analysis: Analysis | null;
  isAnalyzing: boolean;
  questionText?: string;
}> = ({ analysis, isAnalyzing, questionText }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 bg-opacity-10 rounded-2xl p-5 shadow-md hover:scale-[1.01] transition-transform">
      <h3 className="text-2xl font-bold text-white mb-5 tracking-wide text-center">
        Interview Summary
      </h3>

      {/* Display the question text if available */}
      {questionText && (
        <div className="bg-white bg-opacity-10 rounded-2xl p-4 shadow-sm hover:scale-105 transition-transform">
          <h4 className="text-white font-medium mb-1">Question</h4>
          <div className="text-gray-300 italic">{questionText}</div>
        </div>
      )}

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
      {/* <EmotionalAnalysis analysis={analysis} isAnalyzing={isAnalyzing} /> */}
    </div>
  );
};

const BehavioralAnalysis: React.FC<{ analysis: Analysis | null }> = ({
  analysis,
}) => {
  const insights = analysis?.behavioral_insights?.insights || [];
  console.log("Behavioral analsys:", analysis);
  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-6 tracking-wide text-center">
        🌟 Behavioral Analysis 🌟
      </h3>
      <div className="space-y-4">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <div key={index} className="bg-white bg-opacity-20 p-4 rounded-xl text-center hover:scale-105 transition-transform">
              <div className="text-lg font-semibold text-gray-200">{insight}</div>
            </div>
          ))
        ) : (
          <div className="bg-white bg-opacity-20 p-5 rounded-2xl text-center">
            <div className="text-lg font-semibold text-gray-400">No behavioral insights available.</div>
          </div>
        )}
      </div>
    </div>
  );
};

const CommunicationAssessment: React.FC<{
  analysis: Analysis | null;
  isAnalyzing: boolean;
}> = ({ analysis, isAnalyzing }) => {
  return (
    <div className="bg-gradient-to-br from-orange-600 to-purple-600 bg-opacity-10 rounded-2xl p-5 shadow-md hover:scale-[1.01] transition-transform">
      <h3 className="text-2xl font-bold text-white mb-5 tracking-wide text-center">
        Communication Assessment
      </h3>
      <div className="space-y-3">
        <div className="bg-gray-600 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">Key Strengths</h4>
          {isAnalyzing ? (
            <div className="animate-pulse h-20 bg-gray-500 rounded" />
          ) : (
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {analysis?.communication_analysis?.strengths?.map(
                (strength, idx) => <li key={idx}>{strength}</li>
              ) || <li>No strengths data available</li>}
            </ul>
          )}
        </div>
        <div className="bg-gray-600 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-2">Areas for Improvement</h4>
          {isAnalyzing ? (
            <div className="animate-pulse h-12 bg-gray-500 rounded" />
          ) : (
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {analysis?.communication_analysis?.improvements?.map(
                (improvement, idx) => <li key={idx}>{improvement}</li>
              ) || <li>No improvements data available</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// const EmotionalAnalysis: React.FC<{
//   analysis: Analysis | null;
//   isAnalyzing: boolean;
// }> = ({ analysis, isAnalyzing }) => {
//   return (
//     <div className="bg-white bg-opacity-10 rounded-2xl p-5 shadow-md hover:scale-[1.01] transition-transform">
//       <h3 className="text-2xl font-bold text-white mb-5 tracking-wide text-center">
//         Emotional Analysis
//       </h3>
//       {isAnalyzing ? (
//         <div className="animate-pulse h-20 bg-gray-500 rounded" />
//       ) : analysis?.emotion_results ? (
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gray-600 p-3 rounded-lg">
//               <div className="text-gray-300">Dominant Emotion</div>
//               <div className="text-xl font-bold text-white capitalize">
//                 {analysis.emotion_results?.summary?.dominant_emotion ||
//                   "Unknown"}
//               </div>
//               <div className="text-sm text-gray-400">
//                 {analysis.emotion_results?.summary?.dominant_emotion_confidence
//                   ? (
//                       analysis.emotion_results.summary
//                         .dominant_emotion_confidence * 100
//                     ).toFixed(1) + "% confidence"
//                   : "No confidence data"}
//               </div>
//             </div>
//             <div className="bg-gray-600 p-3 rounded-lg">
//               <div className="text-gray-300">Frames Analyzed</div>
//               <div className="text-xl font-bold text-white">
//                 {analysis.emotion_results?.summary?.total_frames_analyzed ||
//                   "N/A"}
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-600 p-4 rounded-lg">
//             <h4 className="text-white font-medium mb-3">Emotion Timeline</h4>
//             {analysis.emotion_results?.detailed_results ? (
//               <EmotionTimeline
//                 frames={analysis.emotion_results.detailed_results}
//               />
//             ) : (
//               <div className="text-gray-400">No timeline data available</div>
//             )}
//           </div>

//           <div className="bg-gray-600 p-4 rounded-lg">
//             <h4 className="text-white font-medium mb-3">
//               Emotion Distribution
//             </h4>
//             {analysis.emotion_results?.summary?.average_emotions ? (
//               <div className="space-y-2">
//                 {Object.entries(
//                   analysis.emotion_results.summary.average_emotions
//                 ).map(([emotion, value]) => (
//                   <div key={emotion} className="flex items-center">
//                     <div className="w-24 text-gray-300 capitalize">
//                       {emotion}
//                     </div>
//                     <div className="flex-1">
//                       <div className="h-2 bg-gray-700 rounded-full">
//                         <div
//                           className="h-full bg-blue-500 rounded-full"
//                           style={{ width: `${value * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                     <div className="w-16 text-right text-gray-300">
//                       {(value * 100).toFixed(1)}%
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-gray-400">
//                 No emotion distribution data available
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="text-gray-400">No emotional analysis available</div>
//       )}
//     </div>
//   );
// };

export default VideoAnalysis;
