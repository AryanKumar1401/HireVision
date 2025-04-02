import { useState, useRef, useEffect } from 'react';

type MediaRecorderRef = MediaRecorder & {
  pause: () => void;
  resume: () => void;
};

export const useVideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorderRef | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const initializeWebcam = async () => {
    try {
      setIsLoading(true);
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setCameraError(
        err instanceof Error ? err.message : "Failed to access camera"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];
      setRecordingTime(0);
      if (!streamRef.current) {
        await initializeWebcam();
      }
      const mediaRecorder = new MediaRecorder(streamRef.current!, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start(1000);
      setIsRecording(true);
      startTimer();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);

        mediaRecorderRef.current.onstop = async () => {
          const videoBlob = new Blob(recordedChunksRef.current, {
            type: "video/webm",
          });
          resolve(videoBlob);
        };
      }
    });
  };

  useEffect(() => {
    initializeWebcam();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    recordingTime,
    isLoading,
    cameraError,
    streamRef,
    startRecording,
    stopRecording,
  };
};
