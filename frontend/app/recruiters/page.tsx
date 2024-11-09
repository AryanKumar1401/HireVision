"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const skillsData = [
  { name: 'React', score: 85 },
  { name: 'TypeScript', score: 78 },
  { name: 'Node.js', score: 72 },
  { name: 'AWS', score: 65 },
  { name: 'System Design', score: 80 },
];

const experienceData = [
  { name: '0-2 years', value: 30 },
  { name: '3-5 years', value: 45 },
  { name: '5+ years', value: 25 },
];

const performanceData = [
  { date: 'Week 1', applications: 12 },
  { date: 'Week 2', applications: 19 },
  { date: 'Week 3', applications: 25 },
  { date: 'Week 4', applications: 31 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const monthlyApplicants = [
  { month: 'Jan', count: 45 },
  { month: 'Feb', count: 52 },
  { month: 'Mar', count: 61 },
  { month: 'Apr', count: 58 },
  { month: 'May', count: 71 },
  { month: 'Jun', count: 68 },
];

const scoresTrend = [
  { month: 'Jan', technical: 7.2, communication: 7.8 },
  { month: 'Feb', technical: 7.5, communication: 8.0 },
  { month: 'Mar', technical: 7.8, communication: 8.1 },
  { month: 'Apr', technical: 7.9, communication: 8.3 },
  { month: 'May', technical: 8.2, communication: 8.4 },
  { month: 'Jun', technical: 8.4, communication: 8.6 },
];

const animationConfig = {
  animate: true,
  duration: 800,
  easing: "ease-in-out",
};

interface JobDescription {
  title: string;
  company: string;
  requirements: string[];
  responsibilities: string[];
}

export default function Recruiters() {
  const router = useRouter();
  interface Video {
    id: string;
    title: string;
    url: string;
  }

  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [topApplicants] = useState<string[]>(['Application 1', 'Application 3', 'Application 4']);
  interface Analysis {
    summary: string;
  }

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{ [key: string]: Analysis }>({});

  const jobDescription: JobDescription = {
    title: "Junior Full Stack Developer",
    company: "TechCorp Inc.",
    requirements: [
      "20+ years experience with React/Next.js",
      "Strong knowledge of TypeScript",
      "Experience with cloud platforms (AWS/GCP)",
      "Computer Science degree or equivalent"
    ],
    responsibilities: [
      "Lead development of core platform features",
      "Mentor junior developers",
      "Architect scalable solutions",
      "Collaborate with product teams"
    ]
  };

  const aggregateMetrics = {
    totalApplicants: videos.length,
    averageTechnicalScore: 7.8,
    averageCommunicationScore: 8.2,
    highestTechnicalScore: 9.5,
    averageYearsExperience: 4.5,
    applicantsInProgress: Math.floor(videos.length * 0.6)
  };

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

  const analyzeVideo = async (videoUrl: string) => {
    try {
      setIsAnalyzing(true);

      // Check if we already have analysis for this video
      if (selectedVideo && analysisResults[selectedVideo.id]) {
        setAnalysis(analysisResults[selectedVideo.id]);
        setIsAnalyzing(false);
        return;
      }

      const response = await fetch('http://localhost:8000/analyze-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_url: videoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Duplicate' && selectedVideo) {
          // If duplicate error, use existing analysis
          const existingAnalysis = analysisResults[selectedVideo.id];
          if (existingAnalysis) {
            setAnalysis(existingAnalysis);
            return;
          }
        }
        throw new Error(errorData.detail || 'Analysis failed');
      }

      const data = await response.json();
      if (selectedVideo) {
        setAnalysisResults(prev => ({
          ...prev,
          [selectedVideo.id]: data
        }));
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Error analyzing video:', error);
      // Show error to user
      if (error instanceof Error) {
        setAnalysis({ summary: `Error: ${error.message}` });
      } else {
        setAnalysis({ summary: 'An unknown error occurred' });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (selectedVideo) {
      analyzeVideo(selectedVideo.url);
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (selectedVideo) {
      console.log('Selected video:', selectedVideo);
    }
  }, [selectedVideo]);

  if (selectedVideo) {
    return (
      <main className="flex flex-col items-center justify-between min-h-screen bg-gray-900 p-8 relative overflow-hidden">
        <div className="relative bg-gray-800 rounded-xl p-6 w-full max-w-7xl">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{selectedVideo.title} Analysis</h2>
            <button
              onClick={() => setSelectedVideo(null)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close Dashboard
            </button>
          </div>

          {/* Main content grid - Now with 3 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Video and Key Metrics */}
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Video Interview</h3>
                <video
                  src={selectedVideo.url}
                  controls
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Key Performance Indicators</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-600 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400">92%</div>
                    <div className="text-sm text-gray-300">Overall Score</div>
                  </div>
                  <div className="bg-gray-600 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-400">4.8/5</div>
                    <div className="text-sm text-gray-300">Interview Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Feedback Summary (unchanged) and Technical Assessment */}
            <div className="space-y-6">
              {/* Existing Feedback Summary */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Interview Summary</h3>
                <div className="space-y-4">
                  {isAnalyzing ? (
                    <div className="text-white">Analyzing video...</div>
                  ) : analysis ? (
                    <div className="bg-gray-600 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Key Points</h4>
                      <div className="text-gray-300 whitespace-pre-line">
                        {analysis.summary}
                      </div>
                    </div>
                  ) : (
                    <div className="text-white">No analysis available</div>
                  )}
                </div>
              </div>


            </div>

            {/* Column 3: Behavioral Analysis and Communication Skills */}
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Behavioral Analysis</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-600 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-yellow-400">95%</div>
                      <div className="text-sm text-gray-300">Confidence</div>
                    </div>
                    <div className="bg-gray-600 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-pink-400">88%</div>
                      <div className="text-sm text-gray-300">Enthusiasm</div>
                    </div>
                    <div className="bg-gray-600 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-cyan-400">92%</div>
                      <div className="text-sm text-gray-300">Clarity</div>
                    </div>
                    <div className="bg-gray-600 p-3 rounded-lg text-center">
                      <div className="text-xl font-bold text-orange-400">85%</div>
                      <div className="text-sm text-gray-300">Leadership</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Communication Assessment</h3>
                <div className="space-y-3">
                  <div className="bg-gray-600 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Key Strengths</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Clear articulation of ideas</li>
                      <li>Excellent active listening</li>
                      <li>Professional demeanor</li>
                      <li>Structured responses</li>
                    </ul>
                  </div>
                  <div className="bg-gray-600 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Areas for Improvement</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Technical terminology usage</li>
                      <li>Conciseness in responses</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-bl from-gray-900 via-black to-gray-800 p-8 relative overflow-hidden">
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

      {/* Enhanced Grid Layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        {/* Job Description - Takes full width on small screens, 1/3 on large */}
        <div className="lg:col-span-1 bg-gray-800/80 rounded-xl p-6 backdrop-blur-sm flex h-full flex-col justify-between">
          <h2 className="text-2xl font-bold text-white mb-4">{jobDescription.title}</h2>
          <h3 className="text-3xl text-blue-600 mb-4 text-center">{jobDescription.company}</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Requirements</h4>
              <ul className="list-disc list-inside text-gray-300">
                {jobDescription.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Responsibilities</h4>
              <ul className="list-disc list-inside text-gray-300">
                {jobDescription.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Charts Container - Takes full width on small screens, 2/3 on large */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Technical Skills Distribution */}
          <div className="bg-gray-800/80 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Skills Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={skillsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ background: '#1f2937' }} />
                <Bar dataKey="score" fill="#8884d8">
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Applicants Trend */}

          {/* Score Trends */}
          <div className="bg-gray-800/80 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Score Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoresTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" domain={[0, 10]} />
                <Tooltip contentStyle={{ background: '#1f2937' }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="technical"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="communication"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Experience Distribution */}
          <div className="bg-gray-800/80 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Experience Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={experienceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {experienceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Aggregate Metrics Dashboard */}
      <div className="w-full max-w-4xl mb-10 grid grid-cols-3 gap-4">
        <div className="bg-gray-800/80 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{aggregateMetrics.totalApplicants}</div>
          <div className="text-gray-300">Total Applicants</div>
        </div>
        <div className="bg-gray-800/80 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{aggregateMetrics.averageTechnicalScore}</div>
          <div className="text-gray-300">Avg Technical Score</div>
        </div>
        <div className="bg-gray-800/80 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">{aggregateMetrics.averageCommunicationScore}</div>
          <div className="text-gray-300">Avg Communication Score</div>
        </div>
      </div>

      {/* Left-aligned "Your Applications" title with underline effect */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-3xl font-bold text-white relative inline-block after:absolute after:content-[''] after:w-full after:h-1 after:bg-gradient-to-r from-purple-500 to-blue-500 after:bottom-0 after:left-0 after:rounded-full">
          Applications
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
            className={`${topApplicants.includes(video.title)
                ? 'bg-gradient-to-br from-green-500 to-blue-500'
                : 'bg-gradient-to-br from-blue-500 to-purple-500'
              } text-white font-medium px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95`}
          >
            <span>{video.title}</span>
            {topApplicants.includes(video.title) && (
              <span className="block text-xs mt-1 text-green-200">Top Candidate</span>
            )}
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
    </div>
  );
}
