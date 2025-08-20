import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

// const rawData = [
//   {
//     service_name: "Amazon Elastic Compute Cloud - Compute",
//     monthly: [
//       {
//         month: "2025-01-01T00:00:00Z",
//         total_usage: 744.881819,
//         total_cost: 0.0,
//       },
//       {
//         month: "2025-02-01T00:00:00Z",
//         total_usage: 674.140464,
//         total_cost: 0.0,
//       },
//       {
//         month: "2025-03-01T00:00:00Z",
//         total_usage: 747.922061,
//         total_cost: 0.0,
//       },
//       {
//         month: "2025-04-01T00:00:00Z",
//         total_usage: 719.676971,
//         total_cost: 0.0,
//       },
//       {
//         month: "2025-05-01T00:00:00Z",
//         total_usage: 480.728511,
//         total_cost: 0.0,
//       },
//     ],
//   },
//   {
//     service_name: "Amazon Virtual Private Cloud",
//     monthly: [
//       {
//         month: "2025-01-01T00:00:00Z",
//         total_usage: 744.0,
//         total_cost: 0.0,
//       },
//       {
//         month: "2025-02-01T00:00:00Z",
//         total_usage: 672.0,
//         total_cost: 0.0,
//       },
//       {
//         month: "2025-03-01T00:00:00Z",
//         total_usage: 744.0,
//         total_cost: 0.0,
//       },
//       {
//         month: "2025-04-01T00:00:00Z",
//         total_usage: 720.0,
//         total_cost: 0.005,
//       },
//       {
//         month: "2025-05-01T00:00:00Z",
//         total_usage: 480.0,
//         total_cost: 0.0,
//       },
//     ],
//   },
//   {
//     service_name: "EC2 - Other",
//     monthly: [
//       {
//         month: "2025-01-01T00:00:00Z",
//         total_usage: 16.408161,
//         total_cost: 0.0002,
//       },
//       {
//         month: "2025-02-01T00:00:00Z",
//         total_usage: 16.421852,
//         total_cost: 0.0,
//       },
//       {
//         month: "2025-03-01T00:00:00Z",
//         total_usage: 16.769117,
//         total_cost: 0.0,
//       },
//       {
//         month: "2025-04-01T00:00:00Z",
//         total_usage: 16.781967,
//         total_cost: 0.0,
//       },
//       {
//         month: "2025-05-01T00:00:00Z",
//         total_usage: 10.835381,
//         total_cost: 0.0002,
//       },
//     ],
//   },
// ];
//

//
const colors = ["#4ade80", "#60a5fa", "#facc15"]; // green, blue, yellow

export default function MonthlyServiceCostChart({ data }) {
  const months = [
    ...new Set(data.flatMap((s) => s.monthly.map((m) => m.month))),
  ].sort();

  // Prepare rows: each row is a service with monthly costs
  const tableRows = data.map((service) => {
    const row = { service_name: service.service_name };
    months.forEach((month) => {
      const monthData = service.monthly.find((m) => m.month === month);
      row[month] = monthData ? monthData.total_cost : 0;
    });
    return row;
  });

  // Calculate totals for each month
  const monthTotals = {};
  months.forEach((month) => {
    monthTotals[month] = tableRows.reduce((sum, row) => sum + row[month], 0);
  });

  return (
    <Card className="w-full   overflow-auto bg-none bg-background   border-border m-0 mt-3 ">
      <CardHeader className="flex items-center gap-2 ">
        <DollarSign className="w-5 h-5 text-green-500" />
        <CardTitle className="text-lg">Monthly Service Costs</CardTitle>
      </CardHeader>
      <CardContent className="px-3 overflow-scroll border-border rounded-md ">
        <table className="min-w-full table-auto border !border-border  rounded-md text-sm">
          <thead className=" sticky top-0 bg-primary/70 ">
            <tr>
              <th className="border px-3 py-2 text-left">Service Name</th>
              {months.map((month) => (
                <th key={month} className="border px-3 py-2 text-right">
                  {new Date(month).toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((service) => (
              <tr
                key={service.service_name}
                className="hover:bg-foreground/20 "
              >
                <td className="border px-3 py-1">{service.service_name}</td>
                {months.map((month) => (
                  <td
                    key={month}
                    className="border px-3 py-1 text-right font-mono"
                  >
                    {service[month].toFixed(3)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className=" font-semibold bg-primary/60">
            <tr>
              <td className="border px-3 py-2">Total</td>
              {months.map((month) => (
                <td
                  key={month}
                  className="border px-3 py-2 text-right font-mono"
                >
                  {monthTotals[month].toFixed(3)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </CardContent>
    </Card>
  );
}
