import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CostOverTime = ({ data }) => {
  // data = [
  //   { date: "2025-07-01", cost: 120.5 },
  //   { date: "2025-07-02", cost: 99.3 },
  //   // ...
  // ];

  return (
    <div className="flex flex-col ">
      <h2 className="text-xl font-semibold mb-4">Cost Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#4F46E5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostOverTime;
