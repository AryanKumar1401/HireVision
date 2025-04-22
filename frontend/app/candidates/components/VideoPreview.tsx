"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface VideoPreviewProps {
  stream?: MediaStream | null;
  recordedUrl?: string | null;
  isLoading?: boolean;
  error?: string | null;
}

export const VideoPreview = ({
  stream,
  recordedUrl,
  isLoading,
  error,
}: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playAttemptTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to safely play the video with retry logic
  const safelyPlayVideo = () => {
    if (!videoRef.current) return;

    // Clear any existing timeout to avoid race conditions
    if (playAttemptTimeoutRef.current) {
      clearTimeout(playAttemptTimeoutRef.current);
    }

    // Add a small delay before attempting to play
    playAttemptTimeoutRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.warn("Video play was interrupted, will retry once:", err);
          // One retry after a short delay
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current
                .play()
                .catch((e) =>
                  console.error("Final attempt to play video failed:", e)
                );
            }
          }, 300);
        });
      }
    }, 100);
  };

  useEffect(() => {
    // Only attach stream if no recorded URL is being shown
    if (videoRef.current && stream && !recordedUrl) {
      videoRef.current.srcObject = stream;
      safelyPlayVideo();
    }

    // Cleanup on unmount
    return () => {
      if (playAttemptTimeoutRef.current) {
        clearTimeout(playAttemptTimeoutRef.current);
      }
    };
  }, [stream, recordedUrl]);

  // If recorded URL is removed, reattach the stream
  useEffect(() => {
    if (!recordedUrl && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      safelyPlayVideo();
    }
  }, [recordedUrl, stream]);

  if (isLoading) {
    return (
      <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 flex items-center justify-center overflow-hidden relative shadow-lg border border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 animate-pulse"></div>
        <div className="flex flex-col items-center space-y-4 z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
          />
          <p className="text-white/80 text-lg font-medium">
            Initializing camera...
          </p>
          <p className="text-white/60 text-sm max-w-xs text-center">
            This may take a moment. Please allow camera access when prompted.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 flex items-center justify-center shadow-lg border border-gray-700/50">
        <div className="text-center px-8 py-10 bg-red-500/10 border border-red-500/30 rounded-lg max-w-md backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-red-400 mb-3">
              Camera Error
            </h3>
            <p className="text-white/80 mb-4">{error}</p>
            <p className="text-sm text-white/60 bg-black/20 p-3 rounded-lg">
              Try refreshing the page or check your browser settings to ensure
              camera access is enabled.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (recordedUrl) {
    return (
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        className="rounded-xl overflow-hidden shadow-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
      >
        <div className="p-3 bg-gradient-to-r from-blue-600/30 to-purple-600/30 flex items-center">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-glow-green"></span>
              <span className="text-green-400 text-sm font-medium">
                Recording Preview
              </span>
            </div>
          </div>
          <div className="text-white/70 text-sm bg-black/20 px-2 py-0.5 rounded-full">
            Review before continuing
          </div>
        </div>
        <div className="p-1 bg-black/40">
          <video
            src={recordedUrl}
            controls
            className="w-full aspect-video bg-black object-contain rounded"
          />
        </div>
        <div className="p-3 bg-black/20 text-center text-white/70 text-sm">
          <p>
            You can play back your recording to ensure you're satisfied with
            your answer
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      className="rounded-xl overflow-hidden shadow-lg bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
    >
      <div className="p-3 bg-gradient-to-r from-blue-600/30 to-purple-600/30 flex items-center justify-between">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2 shadow-glow-red"></span>
          <span className="text-white/90 text-sm font-medium">Live Camera</span>
        </div>
        <div className="text-white/70 text-sm bg-black/20 px-2 py-0.5 rounded-full flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Position yourself in frame
        </div>
      </div>
      <div className="p-1 bg-black/40">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-video bg-black object-cover rounded"
        />
      </div>
      <div className="p-3 bg-black/20 text-center text-white/70 text-sm flex items-center justify-center">
        <svg
          className="w-4 h-4 mr-1 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>Ensure good lighting and a quiet environment for best results</p>
      </div>
    </motion.div>
  );
};
