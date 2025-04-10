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
  recruiterName?: string;
  recruiterEmail?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  videos,
  topApplicants,
  onVideoSelect,
  onBackClick,
  recruiterName,
  recruiterEmail,
}) => {
  // Calculate dynamic metrics
  const dynamicMetrics = {
    ...aggregateMetrics,
    totalApplicants: videos.length,
    applicantsInProgress: Math.floor(videos.length * 0.6),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 md:p-8">
      {/* Header with title */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Recruitment Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          {recruiterName && recruiterEmail && (
            <div className="text-right">
              <div className="text-white font-semibold">{recruiterName}</div>
              <div className="text-gray-400 text-sm">{recruiterEmail}</div>
            </div>
          )}
          <button
            onClick={onBackClick}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mb-10">
        {/* Key Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            value={dynamicMetrics.totalApplicants}
            label="Total Applicants"
            color="blue"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
          <MetricCard
            value={dynamicMetrics.averageTechnicalScore}
            label="Avg Technical Score"
            color="green"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            }
          />
          <MetricCard
            value={dynamicMetrics.averageCommunicationScore}
            label="Avg Communication Score"
            color="purple"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            }
          />
          <MetricCard
            value={dynamicMetrics.applicantsInProgress}
            label="In Progress"
            color="amber"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Job Description */}
          <div className="lg:col-span-1 space-y-6">
            <JobDescriptionCard />

            {/* New addition: Quick Stats Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Positions Open</span>
                  <span className="text-white font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Interviews This Week</span>
                  <span className="text-white font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Avg. Time to Hire</span>
                  <span className="text-white font-semibold">18 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Offer Acceptance Rate</span>
                  <span className="text-white font-semibold">86%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Charts Container */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillsChart />
              <ScoreTrendsChart />
            </div>
            <ExperienceDistributionChart />
          </div>
        </div>

        {/* Applications Section */}
        <section className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            Applications
            <span className="ml-3 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
              {videos.length}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <ApplicationCard
                key={video.id}
                video={video}
                isTopApplicant={topApplicants.includes(video.title)}
                onSelect={() => onVideoSelect(video)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Enhanced Sub-components
const MetricCard = ({ value, label, color, icon }) => {
  const colorClasses = {
    blue: "text-blue-400",
    green: "text-green-400",
    purple: "text-purple-400",
    amber: "text-amber-400",
  };

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 shadow-lg transition-all hover:shadow-xl hover:border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl font-bold ${colorClasses[color]}`}>
            {value}
          </div>
          <div className="text-sm text-gray-400 mt-1">{label}</div>
        </div>
        <div className={`p-3 rounded-full bg-gray-700 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const JobDescriptionCard = () => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
    <div className="flex items-center mb-5">
      <div className="p-2 bg-blue-400 bg-opacity-20 rounded-lg mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">{jobDescription.title}</h2>
        <h3 className="text-gray-400">{jobDescription.company}</h3>
      </div>
    </div>

    <div className="space-y-5">
      <div>
        <h4 className="text-md font-semibold text-white mb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Requirements
        </h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {jobDescription.requirements.map((req, i) => (
            <li key={i} className="text-sm">
              {req}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-md font-semibold text-white mb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Responsibilities
        </h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {jobDescription.responsibilities.map((resp, i) => (
            <li key={i} className="text-sm">
              {resp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const SkillsChart = () => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg h-full">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-blue-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
          clipRule="evenodd"
        />
      </svg>
      Skills Distribution
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={skillsData}
        barSize={30}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
        <XAxis
          dataKey="name"
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
          itemStyle={{ color: "#fff" }}
          labelStyle={{
            color: "#9ca3af",
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        />
        <Bar dataKey="score" fill="#8884d8" radius={[4, 4, 0, 0]}>
          {skillsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const ScoreTrendsChart = () => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg h-full">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-blue-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
      Score Trends
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        data={scoresTrend}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis
          dataKey="month"
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#9ca3af"
          fontSize={12}
          domain={[0, 10]}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          }}
          itemStyle={{ color: "#fff" }}
          labelStyle={{
            color: "#9ca3af",
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ paddingTop: 10, fontSize: 12, color: "#9ca3af" }}
        />
        <Line
          type="monotone"
          dataKey="technical"
          stroke="#8884d8"
          strokeWidth={3}
          dot={{ r: 4, fill: "#8884d8", strokeWidth: 2, stroke: "#1f2937" }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="communication"
          stroke="#82ca9d"
          strokeWidth={3}
          dot={{ r: 4, fill: "#82ca9d", strokeWidth: 2, stroke: "#1f2937" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const ExperienceDistributionChart = () => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-blue-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      Experience Distribution
    </h3>
    <div className="flex flex-col md:flex-row items-center">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={experienceData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={80}
            innerRadius={40}
            paddingAngle={2}
            dataKey="value"
          >
            {experienceData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#1f2937"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} candidates`, name]}
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: 12, color: "#9ca3af" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ApplicationCard = ({ video, isTopApplicant, onSelect }) => (
  <button
    onClick={onSelect}
    className={`
      w-full text-left rounded-xl overflow-hidden transition-all duration-200
      ${
        isTopApplicant
          ? "bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl"
          : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
      }
    `}
  >
    <div className="p-4">
      {/* Video preview thumbnail (placeholder) */}
      {isTopApplicant && (
        <div className="flex justify-end -mt-2 -mr-2 mb-1">
          <div className="bg-green-400 text-xs font-medium text-gray-900 rounded-full px-2 py-0.5 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Top Candidate
          </div>
        </div>
      )}

      <div className="font-medium text-white mb-1">{video.title}</div>

      {video.candidate_details && (
        <div className="space-y-1 mt-2">
          <div className="flex items-center text-sm text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {video.candidate_details.full_name}
          </div>

          <div className="flex items-center text-sm text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {video.candidate_details.experience} years exp.
          </div>
        </div>
      )}

      <div className="mt-3 text-xs font-medium">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 ${
            isTopApplicant
              ? "bg-blue-800 text-blue-200"
              : "bg-gray-600 text-gray-300"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          View Details
        </span>
      </div>
    </div>
  </button>
);

export default Dashboard;
