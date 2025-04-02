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

  return (
    <div className="mt-8 flex flex-col items-center space-y-6">
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center space-x-3"
          >
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white/90 text-xl font-medium">
              {formatTime(recordingTime)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 ${
            isRecording
              ? "bg-red-500/20 text-red-500 border-2 border-red-500/50 hover:bg-red-500/30"
              : "bg-blue-500/20 text-blue-500 border-2 border-blue-500/50 hover:bg-blue-500/30"
          }`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGoBack}
          className="px-8 py-3 rounded-lg font-medium text-lg bg-white/5 text-white/70 border-2 border-white/10 hover:bg-white/10 transition-all duration-200"
        >
          Go Back
        </motion.button>
      </div>

      {isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              className="h-full bg-blue-500/50 rounded-full"
            />
          </div>
          <p className="text-white/50 text-sm text-center mt-2">
            Uploading: {uploadProgress}%
          </p>
        </motion.div>
      )}
    </div>
  );
};
