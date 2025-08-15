import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

const UsageByServiceChart: React.FC<Props> = ({ data }) => {
  // Step 1: Convert flat data into a format where each day is a row,
  // and each service is a key with total_usage value.
  // Example:
  // [
  //   { day: "2025-04-07", "Amazon VPC": 24, "Amazon EC2": 20 },
  //   { day: "2025-04-08", "Amazon VPC": 22, "Amazon EC2": 18 },
  // ]

  // Get unique days sorted ascending
  const days = Array.from(new Set(data.map((d) => d.day.slice(0, 10)))).sort();

  // Get unique services
  const services = Array.from(new Set(data.map((d) => d.service_name)));

  // Build data structure
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
    <div>
      <h2 className="text-xl font-semibold mb-4 dark:text-foreground">
        Cost By Service Per Day
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          {services.map((service, index) => (
            <Line
              key={service}
              type="monotone"
              dataKey={service}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageByServiceChart;
