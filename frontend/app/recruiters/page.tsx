"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Recruiters() {
  const router = useRouter();
  interface Video {
    id: string;
    title: string;
    url: string;
  }

  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    // Fetch videos from Supabase Storage bucket
    const fetchVideos = async () => {
      const { data, error } = await supabase.storage.from('videos').list('');
      if (error) {
        console.error('Error fetching videos:', error.message);
      } else {
        const videoData = await Promise.all(data.map(async (file, index) => {
          const { data: signedData, error: signedError } = await supabase.storage.from('videos').createSignedUrl(file.name, 3600);
          if (signedError || !signedData) {
            console.error('Error creating signed URL:', signedError ? signedError.message : 'No data returned');
            return null;
          }
          return {
            id: file.id,
            title: `Application ${index + 1}`,
            url: signedData.signedUrl
          };
        }));
        setVideos(videoData.filter(video => video !== null));
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      console.log('Selected video:', selectedVideo);
    }
  }, [selectedVideo]);

  if (selectedVideo) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-black p-8 relative overflow-hidden">
        <div className="relative bg-gray-800 rounded-lg p-4 w-full max-w-4xl">
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-2 right-2 text-white"
          >
            Close
          </button>
          <video
            src={selectedVideo.url}
            controls
            className="w-full h-auto rounded-lg"
          />
        </div>
        <button
          onClick={() => setSelectedVideo(null)}
          className="mt-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold text-lg"
        >
          Go Back
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-gray-900 via-black to-gray-800 p-8 relative overflow-hidden">
      {/* Background accents */}
      <div
        className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-blue-500 opacity-20 blur-3xl rounded-full animate-pulse"
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500 opacity-20 blur-3xl rounded-full animate-pulse"
      />

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg tracking-tight">
        Recruiters Page
      </h1>

      {/* Left-aligned "Your Applications" title with underline effect */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-3xl font-bold text-white relative inline-block after:absolute after:content-[''] after:w-full after:h-1 after:bg-gradient-to-r from-purple-500 to-blue-500 after:bottom-0 after:left-0 after:rounded-full">
          Your Applications
        </h2>
      </div>

      {/* Application Links Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl w-full">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => {
              console.log('Button clicked:', video);
              setSelectedVideo(video);
            }}
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 active:scale-95"
          >
            {video.title}
          </button>
        ))}
      </div>

      {/* "Go Back" button with glowing effect */}
      <button
        onClick={() => router.push('/')}
        className="mt-16 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold text-lg relative hover:scale-105 active:scale-95"
      >
        Go Back
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
      </button>
    </main>
  );
}
