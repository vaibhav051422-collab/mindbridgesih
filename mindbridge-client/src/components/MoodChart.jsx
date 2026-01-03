import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const MoodChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" tick={{ fill: "#4b5563", fontSize: 12 }} />
        <YAxis
          domain={[0, 10]}
          tick={{ fill: "#4b5563", fontSize: 12 }}
          allowDecimals={false}
          label={{ value: "Mood Intensity", angle: -90, position: "insideLeft", fill: "#6b7280" }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}
          formatter={(value) => [`Intensity: ${value}`, '']}
        />
        <Line
          type="monotone"
          dataKey="intensity"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ r: 5, stroke: "#1d4ed8", strokeWidth: 2, fill: "#3b82f6" }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MoodChart;
