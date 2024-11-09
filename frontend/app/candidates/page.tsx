"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorderRef | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const recordedChunksRef = useRef<Blob[]>([]);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

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
      recordedChunksRef.current = [];
      setRecordingTime(0);
      if (!streamRef.current) {
        await initializeWebcam();
      }
      const mediaRecorder = new MediaRecorder(streamRef.current!, {
        mimeType: 'video/webm'
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
      console.error('Error starting recording:', err);
    }
  };

  const uploadToSupabase = async (videoBlob: Blob): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Generate a unique filename
      const timestamp = new Date().getTime();
      const filename = `video_${timestamp}.webm`;

      // Convert blob to File object
      const videoFile = new File([videoBlob], filename, { type: 'video/webm' });

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('videos') // Make sure this bucket exists in your Supabase project
        .upload(filename, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get the public URL of the uploaded video
      const { data: { publicUrl } } = supabase
        .storage
        .from('videos')
        .getPublicUrl(filename);

      setUploadProgress(100);
      return publicUrl;

    } catch (error) {
      console.error('Error uploading to Supabase:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const getSignedUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('videos') // replace with your bucket name
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) {
        console.error('Error getting signed URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (err) {
      console.error('Error in getSignedUrl:', err);
      return null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);

      mediaRecorderRef.current.onstop = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));

          const videoBlob = new Blob(recordedChunksRef.current, {
            type: 'video/webm'
          });
          console.log('Created video blob:', {
            size: videoBlob.size,
            type: videoBlob.type
          });

          const videoPreviewUrl = URL.createObjectURL(videoBlob);

          setVideoUrl(videoPreviewUrl);

          // Upload to Supabase
          const publicUrl = await uploadToSupabase(videoBlob);
          console.log('Video successfully uploaded to Supabase:', publicUrl);
          
          // Extract filename from publicUrl
          const filename = publicUrl ? publicUrl.split('/').pop() : '';
          var signedVideoUrl = null;
          if (filename) {
            // Get signed URL
            const signedVideoUrl = await getSignedUrl(filename);
            if (signedVideoUrl) {
              setSignedUrl(signedVideoUrl);
              console.log('Signed URL generated:', signedVideoUrl);
            }
          } else {
            console.error('Filename could not be determined from publicUrl');
          }
          if (signedVideoUrl) {
            setSignedUrl(signedVideoUrl);
            console.log('Signed URL generated:', signedVideoUrl);
          }
          
        } catch (err) {
          console.error('Error processing/uploading video:', err);
        }
      };

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
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
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-white text-center mt-2">Uploading: {uploadProgress}%</p>
          </div>
        )}
        {signedUrl && (
          <div className="mt-8">
            <h2 className="text-white text-2xl mb-4">Recording Preview from Supabase</h2>
            <video
              src={signedUrl}
              controls
              className="w-full max-w-[1400px] aspect-video bg-gray-800 rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}