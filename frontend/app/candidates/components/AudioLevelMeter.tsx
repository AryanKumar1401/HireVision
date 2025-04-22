'use client';
import { useEffect, useRef, useState } from "react";

interface AudioLevelMeterProps {
  stream: MediaStream | null;
}

export const AudioLevelMeter = ({ stream }: AudioLevelMeterProps) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    audioSource.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const updateAudioLevel = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Calculate average volume level from frequency data
      const average =
        dataArrayRef.current.reduce((acc, val) => acc + val, 0) /
        dataArrayRef.current.length;

      // Normalize to 0-100 range
      const normalizedLevel = Math.min(100, Math.max(0, average * 1.5));
      setAudioLevel(normalizedLevel);

      animationRef.current = requestAnimationFrame(updateAudioLevel);
    };

    animationRef.current = requestAnimationFrame(updateAudioLevel);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContext.state !== "closed") {
        audioSource.disconnect();
        audioContext.close();
      }
    };
  }, [stream]);

  // Get color based on audio level
  const getColor = () => {
    if (audioLevel < 30) return "bg-green-500";
    if (audioLevel < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-4 mb-2">
      <div className="text-white/90 mb-1">Microphone Input</div>
      <div className="w-full h-10 bg-gray-800/80 rounded-md overflow-hidden flex items-end">
        <div
          className={`h-full transition-all duration-150 ${getColor()}`}
          style={{ width: `${audioLevel}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-white/60 mt-1">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
};
