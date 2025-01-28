import { useEffect, useRef } from 'react';

interface VideoPreviewProps {
  stream?: MediaStream | null;
  recordedUrl?: string | null;
  isLoading?: boolean;
  error?: string | null;
}

export const VideoPreview = ({ stream, recordedUrl, isLoading, error }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

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
