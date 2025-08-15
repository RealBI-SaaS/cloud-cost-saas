import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// const data = [
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     total_cost: 0.005,
//   },
//   {
//     service_name: "EC2 - Other",
//     total_cost: 0.0002,
//   },
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     total_cost: 0.0,
//   },
// ];

// Helper to avoid log(0) issues: shift zero-cost slightly
const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function CostByServicePieChart({ data }) {
  console.log(data);

  return (
    <div className="w-full h-[400px] p-4  ">
      <h2 className="text-xl font-semibold mb-4 dark:text-foreground">
        Cost by Service
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total_cost"
            nameKey="service_name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
