"use client";
import { useEffect, useRef } from "react";

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
      <div className="aspect-video rounded-xl bg-gray-800/50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-white/70 text-lg">Initializing camera...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video rounded-xl bg-gray-800/50 flex items-center justify-center">
        <div className="text-red-400 text-center px-4">
          <p className="text-lg font-medium">Camera Error</p>
          <p className="text-sm opacity-75 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (recordedUrl) {
    return (
      <video
        src={recordedUrl}
        controls
        className="w-full aspect-video rounded-xl bg-gray-800/50 object-cover"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full aspect-video rounded-xl bg-gray-800/50 object-cover"
    />
  );
};
