"use client";
import { motion, AnimatePresence } from "framer-motion";

interface RecordingControlsProps {
  isRecording: boolean;
  recordingTime: number;
  isUploading: boolean;
  uploadProgress: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onGoBack: () => void;
}

export const RecordingControls = ({
  isRecording,
  recordingTime,
  isUploading,
  uploadProgress,
  onStartRecording,
  onStopRecording,
  onGoBack,
}: RecordingControlsProps) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to determine countdown color
  const getTimeColor = () => {
    if (recordingTime < 30) return "text-white";
    if (recordingTime < 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="mt-8 flex flex-col items-center space-y-6">
      {/* Recording time display with animated pulse */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center space-x-4 bg-gray-900/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-red-500/30 shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(239, 68, 68, 0.5)",
                    "0 0 0 8px rgba(239, 68, 68, 0)",
                    "0 0 0 0 rgba(239, 68, 68, 0)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-4 h-4 rounded-full bg-red-500"
              />
              <span className="text-red-400 font-semibold tracking-wide">
                RECORDING
              </span>
            </div>
            <span
              className={`text-xl font-medium tracking-wider ${getTimeColor()}`}
            >
              {formatTime(recordingTime)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording instructions */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-white/70 text-sm bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 max-w-md text-center"
          >
            <p>
              Speak clearly and at a normal pace. Look at the camera as if you
              were speaking to an interviewer.
            </p>
            <p className="mt-1 text-xs text-white/60">
              Click "Stop Recording" when you've finished your answer.
            </p>
          </motion.div>
        )}

        {!isRecording && !isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white/70 text-sm bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 max-w-md text-center"
          >
            <p>
              Take your time to read the question and prepare your thoughts.
            </p>
            <p className="mt-1 text-xs text-white/60">
              When you're ready, click "Start Recording" to begin your answer.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main recording controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        {!isUploading && (
          <>
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={isRecording ? onStopRecording : onStartRecording}
              className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 shadow-lg ${
                isRecording
                  ? "bg-red-500/90 text-white hover:bg-red-600 border border-red-400/50"
                  : "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white hover:from-blue-600 hover:to-purple-600 border border-blue-500/30"
              }`}
            >
              {isRecording ? (
                <>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <rect
                      x="6"
                      y="6"
                      width="12"
                      height="12"
                      rx="1"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                  <span>Start Recording</span>
                </>
              )}
            </motion.button>

            {!isRecording && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onGoBack}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-lg bg-gray-800/70 text-white/80 hover:bg-gray-700/90 transition-all duration-300 border border-gray-700/50"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                <span>Go Back</span>
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* Upload progress indicator */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm rounded-lg p-5 border border-blue-500/30 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-white/90 font-medium text-lg">
                  Processing response
                </span>
              </div>
              <span className="text-blue-400 font-medium text-lg">
                {uploadProgress}%
              </span>
            </div>
            <div className="h-3 w-full bg-gray-800/80 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-white/70 text-sm">
                Please wait while we upload your response. This may take a
                moment depending on your internet connection.
              </p>
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-3 text-xs text-blue-400/80"
              >
                Processing...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
