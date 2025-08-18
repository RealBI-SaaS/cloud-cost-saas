import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CostOverTime = ({ data }) => {
  // data = [
  //   { date: "2025-07-01", cost: 120.5 },
  //   { date: "2025-07-02", cost: 99.3 },
  //   // ...
  // ];

  return (
    <Card className="w-full h-fit  border border-border !bg-none !mr-3">
      <CardHeader>
        <CardTitle className="text-lg font-semibold ">Cost Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-sm fill-muted-foreground"
              />
              <YAxis
                stroke="currentColor"
                className="text-sm fill-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostOverTime;
