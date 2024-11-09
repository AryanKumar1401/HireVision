"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type MediaRecorderRef = MediaRecorder & {
  pause: () => void;
  resume: () => void;
};

export default function Candidates() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorderRef | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // New state for video preview URL

  const initializeWebcam = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
    } catch (err) {
      console.error('Error accessing webcam:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeWebcam();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [streamRef.current]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const startRecording = async () => {
    try {
      setRecordingTime(0); // Reset timer when starting new recording
      if (!streamRef.current) {
        await initializeWebcam();
      }
      const mediaRecorder = new MediaRecorder(streamRef.current!);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);
      startTimer(); // Start the timer when recording starts

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Handle the recorded video data here
          const videoUrl = URL.createObjectURL(event.data);
          console.log('Recording finished:', videoUrl);
          setVideoUrl(videoUrl);
        }
      };
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-4xl font-bold mb-8 text-white">Candidates Page</h1>
      {isLoading ? (
        <div className="w-full max-w-[1400px] aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
          <p className="text-white text-xl">Initializing webcam and mic...</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-[1400px] aspect-video bg-gray-800 rounded-lg mb-4"
        />
      )}
      <div className="space-y-4">
        <div className="text-white text-2xl mb-4">
          {formatTime(recordingTime)}
        </div>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            className="px-8 py-4 bg-red-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
          >
            Go Back
          </motion.button>
        </div>
        {videoUrl && (
          <div className="mt-8">
            <h2 className="text-white text-2xl mb-4">Recording Preview</h2>
            <video
              src={videoUrl}
              controls
              className="w-full max-w-[1400px] aspect-video bg-gray-800 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}