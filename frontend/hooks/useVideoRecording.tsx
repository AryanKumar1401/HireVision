import { useState, useRef, useEffect } from "react";

export function useVideoRecording(
  autoInitialize = true,
  videoDeviceId?: string,
  audioDeviceId?: string
) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(autoInitialize);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initializeCamera = async () => {
    setIsLoading(true);

    // Stop any existing stream before creating a new one
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
      });

      streamRef.current = stream;
      console.log("Audio tracks:", stream.getAudioTracks());
      if (stream.getAudioTracks().length === 0) {
        setCameraError(
          "No audio track found. Please check your microphone settings."
        );
        return;
      }
      setIsLoading(false);
      setCameraError(null);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setCameraError(
        error instanceof Error ? error.message : "Failed to access camera"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoInitialize) {
      initializeCamera();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Clean up media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [autoInitialize, videoDeviceId, audioDeviceId]);

  const startRecording = () => {
    if (!streamRef.current) {
      setCameraError("Camera is not initialized");
      return;
    }

    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setCameraError(
        error instanceof Error ? error.message : "Failed to start recording"
      );
    }
  };

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || !isRecording) {
        reject(new Error("Not currently recording"));
        return;
      }

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setIsRecording(false);
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
    });
  };

  return {
    isRecording,
    recordingTime,
    isLoading,
    cameraError,
    streamRef,
    startRecording,
    stopRecording,
    initializeCamera,
  };
}
