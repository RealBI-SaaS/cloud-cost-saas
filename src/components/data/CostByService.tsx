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
  return (
    <div className=" h-full  rounded-2xl shadow-lg border border-border p-3 ">
      {/* <div className="h-full p-3 border border-white "> */}
      <h2 className="text-lg font-semibold  dark:text-foreground text-white">
        Cost by Service
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total_cost"
            nameKey="service_name"
            cx="45%"
            cy="50%"
            innerRadius="40%"
            outerRadius="70%"
            paddingAngle={3}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              backgroundColor: "#1e293b",
              color: "white",
              border: "none",
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            wrapperStyle={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "white",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* </div> */}
    </div>
  );
}
