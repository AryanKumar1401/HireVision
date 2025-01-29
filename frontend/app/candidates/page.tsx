"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/auth';
import {ProfileForm} from '@/components/ProfileForm';
import {VideoPreview} from '@/components/VideoPreview';
// Supabase client configuration
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );
const supabase = createClient();

type MediaRecorderRef = MediaRecorder & {
  pause: () => void;
  resume: () => void;
};

interface ProfileFormData {
  full_name: string;
  phone: string;
  experience: string;
  linkedin: string;
  email: string;
  video_url?: string;
}

export default function Candidates() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  // const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorderRef | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null);

  const recordedChunksRef = useRef<Blob[]>([]);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(true);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUserEmail(session?.user?.email ?? null)
    }
    getSession()
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile.full_name) {
          console.log('Profile already exists:', profile.full_name);
          setProfileData(profile);
          setShowProfileForm(false);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initializeWebcam = async () => {
    try {
      setIsLoading(true);
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setCameraError(err instanceof Error ? err.message : 'Failed to access camera');
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
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const fileName = `${userId}_${Date.now()}.mp4`;
      setIsUploading(true);
      setUploadProgress(0);

      // Generate a unique filename
      const timestamp = new Date().getTime();
      const filename = `${userId}_${Date.now()}.mp4`;

      // Convert blob to File object
      const videoFile = new File([videoBlob], filename, { type: 'video/webm' });

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('videos') 
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
        .createSignedUrl(filePath, 36000); // 1 hour expiry

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
              
              // Update the user's profile with the video URL
              const { data: { user } } = await supabase.auth.getUser();
              console.log('Current user:', user);
              if (user) {
                await supabase
                  .from('profiles')
                  .update({ 
                    video_url: filename,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', user.id);
              }
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

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const profileData = {
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string,
        experience: formData.get('experience') as string,
        linkedin: formData.get('linkedin') as string,
        email: user.email, // Add email from auth user
      };
  
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString(),
        });
  
      if (!error) {
        setProfileData(profileData);
        setShowProfileForm(false);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (showProfileForm) {
    return <ProfileForm onSubmit={handleProfileSubmit} profileData={profileData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {userEmail && (
          <div className="absolute top-4 right-4 flex items-center gap-4">
            <span className="text-white/70">Logged in as {userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 text-white/90 tracking-tight"
        >
          Record Your Interview
        </motion.h1>

        <div className="w-full max-w-[1400px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900/50 backdrop-blur-sm p-6">
          <VideoPreview
            stream={streamRef.current}
            recordedUrl={signedUrl}
            isLoading={isLoading}
            error={cameraError}
          />
          
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