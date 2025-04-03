import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Video } from "../types";
import {
  COLORS,
  skillsData,
  experienceData,
  scoresTrend,
  jobDescription,
  aggregateMetrics,
} from "../constants";

interface DashboardProps {
  videos: Video[];
  topApplicants: string[];
  onVideoSelect: (video: Video) => void;
  onBackClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  videos,
  topApplicants,
  onVideoSelect,
  onBackClick,
}) => {
  // Calculate dynamic metrics
  const dynamicMetrics = {
    ...aggregateMetrics,
    totalApplicants: videos.length,
    applicantsInProgress: Math.floor(videos.length * 0.6),
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-8">
        Recruitment Dashboard
      </h1>

      {/* Grid Layout */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Job Description */}
        <JobDescriptionCard />

        {/* Charts Container */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkillsChart />
          <ScoreTrendsChart />
          <ExperienceDistributionChart />
        </div>
      </div>

      {/* Metrics Dashboard */}
      <MetricsPanel metrics={dynamicMetrics} />

      {/* Applications Section */}
      <ApplicationsList
        videos={videos}
        topApplicants={topApplicants}
        onVideoSelect={onVideoSelect}
      />

      {/* Back Button */}
      <button
        onClick={onBackClick}
        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
      >
        Back to Home
      </button>
    </div>
  );
};

// Sub-components
const JobDescriptionCard = () => (
  <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6 border border-gray-700">
    <h2 className="text-2xl font-bold text-white mb-4">
      {jobDescription.title}
    </h2>
    <h3 className="text-xl text-gray-300 mb-4">{jobDescription.company}</h3>
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
        <h4 className="text-lg font-semibold text-white mb-2">
          Responsibilities
        </h4>
        <ul className="list-disc list-inside text-gray-300">
          {jobDescription.responsibilities.map((resp, i) => (
            <li key={i}>{resp}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const SkillsChart = () => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-4">
      Skills Distribution
    </h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={skillsData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip contentStyle={{ background: "#1f2937" }} />
        <Bar dataKey="score" fill="#8884d8">
          {skillsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const ScoreTrendsChart = () => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-4">Score Trends</h3>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={scoresTrend}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="month" stroke="#fff" />
        <YAxis stroke="#fff" domain={[0, 10]} />
        <Tooltip contentStyle={{ background: "#1f2937" }} />
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
);

const ExperienceDistributionChart = () => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 lg:col-start-1 lg:col-end-3">
    <h3 className="text-lg font-semibold text-white mb-4">
      Experience Distribution
    </h3>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={experienceData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
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
        <Tooltip contentStyle={{ background: "#ffffff" }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const MetricsPanel = ({ metrics }) => (
  <div className="w-full max-w-4xl mx-auto mb-8 grid grid-cols-3 gap-6">
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
      <div className="text-3xl font-bold text-blue-400">
        {metrics.totalApplicants}
      </div>
      <div className="text-gray-300">Total Applicants</div>
    </div>
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
      <div className="text-3xl font-bold text-green-400">
        {metrics.averageTechnicalScore}
      </div>
      <div className="text-gray-300">Avg Technical Score</div>
    </div>
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
      <div className="text-3xl font-bold text-purple-400">
        {metrics.averageCommunicationScore}
      </div>
      <div className="text-gray-300">Avg Communication Score</div>
    </div>
  </div>
);

const ApplicationsList = ({ videos, topApplicants, onVideoSelect }) => (
  <div className="w-full max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-700">
      Applications
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
      {videos.map((video) => (
        <button
          key={video.id}
          onClick={() => onVideoSelect(video)}
          className={`${
            topApplicants.includes(video.title) ? "bg-blue-600" : "bg-gray-700"
          } text-white font-medium px-6 py-4 rounded-lg border border-gray-600 hover:bg-opacity-90 transition-colors`}
        >
          <span>{video.title}</span>
          {video.candidate_details && (
            <div className="text-xs mt-2 space-y-1">
              <p>{video.candidate_details.full_name}</p>
              <p>{video.candidate_details.experience} years exp.</p>
            </div>
          )}
          {topApplicants.includes(video.title) && (
            <span className="block text-xs mt-1 text-green-200">
              Top Candidate
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
);

export default Dashboard;
