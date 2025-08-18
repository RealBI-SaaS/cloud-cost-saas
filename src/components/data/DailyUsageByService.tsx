"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface UsageRecord {
  service_name: string;
  day: string; // ISO string date
  total_usage: number;
}

interface Props {
  data: UsageRecord[];
}

const COLORS = [
  "#4F46E5", // Indigo
  "#E11D48", // Red
  "#2563EB", // Blue
  "#16A34A", // Green
  "#D97706", // Amber
];

const UsageByServiceAreaChart: React.FC<Props> = ({ data }) => {
  // Unique days sorted
  const days = Array.from(new Set(data.map((d) => d.day.slice(0, 10)))).sort();

  // Unique services
  const services = Array.from(new Set(data.map((d) => d.service_name)));

  // Transform data for chart
  const chartData = days.map((day) => {
    const dayData: Record<string, any> = { day };
    services.forEach((service) => {
      const record = data.find(
        (d) => d.day.startsWith(day) && d.service_name === service,
      );
      dayData[service] = record ? record.total_usage : 0;
    });
    return dayData;
  });

  return (
    <div className="rounded-lg p-6 shadow-md border border-border mx-3">
      <h2 className="text-xl font-semibold text-foreground">
        Cost By Service Over Time
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {services.map((service, index) => (
              <linearGradient
                key={service}
                id={`color${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={COLORS[index % COLORS.length]}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS[index % COLORS.length]}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="day"
            // tick={{ fill: "currentColor" }}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            // axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            tick={{ fill: "currentColor" }}
            tickLine={false}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              color: "#fff",
            }}
          />
          <Legend verticalAlign="top" height={36} />
          {services.map((service, index) => (
            <Area
              key={service}
              type="monotone"
              dataKey={service}
              stroke={COLORS[index % COLORS.length]}
              fill={`url(#color${index})`}
              stackId="1"
              strokeWidth={2}
              dot={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageByServiceAreaChart;
