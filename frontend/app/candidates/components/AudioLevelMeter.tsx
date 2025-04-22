"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioLevelMeterProps {
  stream: MediaStream | null;
}

export const AudioLevelMeter = ({ stream }: AudioLevelMeterProps) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const inactiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

      // Check if microphone is active (above threshold)
      if (normalizedLevel > 5) {
        setIsMicActive(true);

        // Reset the inactive timeout
        if (inactiveTimeoutRef.current) {
          clearTimeout(inactiveTimeoutRef.current);
        }

        // Set a timeout to mark as inactive if no sound is detected for a while
        inactiveTimeoutRef.current = setTimeout(() => {
          setIsMicActive(false);
        }, 1000);
      }

      animationRef.current = requestAnimationFrame(updateAudioLevel);
    };

    animationRef.current = requestAnimationFrame(updateAudioLevel);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (inactiveTimeoutRef.current) {
        clearTimeout(inactiveTimeoutRef.current);
      }
      if (audioContext.state !== "closed") {
        audioSource.disconnect();
        audioContext.close();
      }
    };
  }, [stream]);

  // Get color based on audio level
  const getColor = () => {
    if (audioLevel < 30) return "from-green-500 to-green-400";
    if (audioLevel < 80) return "from-yellow-500 to-yellow-400";
    return "from-red-500 to-red-400";
  };

  // Create bars for visualization
  const bars = Array.from({ length: 16 }, (_, i) => {
    const threshold = (i / 16) * 100;
    const isActive = audioLevel >= threshold;
    return { id: i, isActive, threshold };
  });

  return (
    <div className="mt-6 mb-4 p-4 bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/90 font-medium flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          Microphone Input
        </div>
        <div className="flex items-center">
          <motion.div
            animate={{
              opacity: isMicActive ? 1 : 0.5,
              scale: isMicActive ? 1 : 0.95,
            }}
            className={`h-2 w-2 rounded-full mr-2 ${
              isMicActive ? "bg-green-500" : "bg-gray-500"
            }`}
          />
          <span className="text-xs text-white/70">
            {isMicActive ? "Sound detected" : "Silent"}
          </span>
        </div>
      </div>

      {/* Modern visualization with individual bars */}
      <div className="w-full h-12 bg-gray-900/60 rounded-lg overflow-hidden flex items-end p-1">
        {bars.map((bar) => (
          <motion.div
            key={bar.id}
            className={`mx-px h-full rounded-sm ${
              bar.isActive
                ? `bg-gradient-to-t ${getColor()} opacity-90`
                : "bg-gray-700/30"
            }`}
            initial={{ height: "10%" }}
            animate={{
              height: bar.isActive
                ? `${Math.max(10, (audioLevel - bar.threshold) * 1.8 + 10)}%`
                : "10%",
              opacity: bar.isActive ? 0.9 : 0.2,
            }}
            transition={{ duration: 0.1 }}
            style={{ width: `${100 / 16}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between text-xs text-white/60 mt-2">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>

      {/* Tips for microphone usage */}
      <AnimatePresence>
        {!isMicActive && audioLevel < 5 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-xs text-yellow-400/90 bg-yellow-400/10 p-2 rounded border border-yellow-400/20 text-center"
          >
            Try speaking to test your microphone. The bars should move when you
            talk.
          </motion.div>
        )}
        {/* {audioLevel > 90 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-xs text-red-400/90 bg-red-400/10 p-2 rounded border border-red-400/20 text-center"
          >
            Your microphone input is very loud. Try moving further from the mic or speaking more softly.
          </motion.div>
        )} */}
      </AnimatePresence>
    </div>
  );
};
