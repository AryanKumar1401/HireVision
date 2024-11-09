"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 text-white/90 tracking-tight"
        >
          Record Your Interview
        </motion.h1>

        <div className="w-full max-w-[1400px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-6">
          {isLoading ? (
            <div className="aspect-video rounded-xl bg-gray-800/50 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-white/70 text-lg">Initializing...</p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video rounded-xl bg-gray-800/50 object-cover"
            />
          )}

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
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 ${
                  isRecording 
                    ? 'bg-red-500/20 text-red-500 border-2 border-red-500/50 hover:bg-red-500/30'
                    : 'bg-blue-500/20 text-blue-500 border-2 border-blue-500/50 hover:bg-blue-500/30'
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/')}
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
        </div>

        {signedUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 w-full max-w-[1400px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-6"
          >
            <h2 className="text-xl font-medium text-white/90 mb-4">Recording Preview</h2>
            <video
              src={signedUrl}
              controls
              className="w-full aspect-video rounded-xl bg-gray-800/50"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}