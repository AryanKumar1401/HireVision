import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { EmotionFrame } from "../types";

interface EmotionTimelineProps {
  frames: EmotionFrame[];
}

const EmotionTimeline: React.FC<EmotionTimelineProps> = ({ frames }) => {
  // Process frames into a format suitable for Recharts
  const timelineData = frames.map((frame) => ({
    timestamp: frame.timestamp.toFixed(1),
    ...frame.emotions,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={timelineData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis
          dataKey="timestamp"
          stroke="#fff"
          label={{
            value: "Time (s)",
            position: "insideBottom",
            fill: "#fff",
          }}
        />
        <YAxis stroke="#fff" domain={[0, 1]} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
          labelStyle={{ color: "#fff" }}
        />
        <Legend />
        <Line type="monotone" dataKey="happy" stroke="#10B981" dot={false} />
        <Line type="monotone" dataKey="sad" stroke="#6366F1" dot={false} />
        <Line type="monotone" dataKey="angry" stroke="#EF4444" dot={false} />
        <Line type="monotone" dataKey="neutral" stroke="#9CA3AF" dot={false} />
        <Line type="monotone" dataKey="surprise" stroke="#F59E0B" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EmotionTimeline;
