export const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export const monthlyApplicants = [
  { month: 'Jan', count: 45 },
  { month: 'Feb', count: 52 },
  { month: 'Mar', count: 61 },
  { month: 'Apr', count: 58 },
  { month: 'May', count: 71 },
  { month: 'Jun', count: 68 },
];

export const scoresTrend = [
  { month: 'Jan', technical: 7.2, communication: 7.8 },
  { month: 'Feb', technical: 7.5, communication: 8.0 },
  { month: 'Mar', technical: 7.8, communication: 8.1 },
  { month: 'Apr', technical: 7.9, communication: 8.3 },
  { month: 'May', technical: 8.2, communication: 8.4 },
  { month: 'Jun', technical: 8.4, communication: 8.6 },
];

export const animationConfig = {
  animate: true,
  duration: 800,
  easing: "ease-in-out",
} as const;

export const skillsData = [
  { name: "React", score: 85 },
  { name: "TypeScript", score: 78 },
  { name: "Node.js", score: 72 },
  { name: "AWS", score: 65 },
  { name: "System Design", score: 80 },
] as const;

export const experienceData = [
  { name: "0-2 years", value: 30 },
  { name: "3-5 years", value: 45 },
  { name: "5+ years", value: 25 },
] as const;

export const performanceData = [
  { date: "Week 1", applications: 12 },
  { date: "Week 2", applications: 19 },
  { date: "Week 3", applications: 25 },
  { date: "Week 4", applications: 31 },
] as const;

export const aggregateMetrics = {
  totalApplicants: 0, // This will be computed from videos.length
  averageTechnicalScore: 7.8,
  averageCommunicationScore: 8.2,
  highestTechnicalScore: 9.5,
  averageYearsExperience: 4.5,
  applicantsInProgress: 0, // This will be computed from videos.length * 0.6
} as const;

// Constants for filtering
export const EXPERIENCE_LEVELS = [
  { label: "All Experience", value: "all" },
  { label: "0-2 years", value: "0-2" },
  { label: "3-5 years", value: "3-5" },
  { label: "5+ years", value: "5+" },
];

export const RATING_OPTIONS = [
  { label: "All Ratings", value: 0 },
  { label: "4.0+", value: 4.0 },
  { label: "4.5+", value: 4.5 },
  { label: "5.0", value: 5.0 },
];
