import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { formatMonthLabel } from "@/utils/data/date_format";
import { DollarSign } from "lucide-react";

export default function MonthlyServiceCostChart({ data }) {
  // Collect raw months from backend
  const rawMonths = [
    ...new Set(data.flatMap((s) => s.monthly.map((m) => m.month))),
  ].sort();

  // Format them once and use everywhere
  const months = rawMonths.map((m) => formatMonthLabel(m));

  // Prepare rows: each row is a service with monthly costs
  const tableRows = data.map((service) => {
    const row: Record<string, any> = { service_name: service.service_name };
    rawMonths.forEach((rawMonth, i) => {
      const label = months[i]; // use formatted label
      const monthData = service.monthly.find((m) => m.month === rawMonth);
      row[label] = monthData ? monthData.total_cost : 0;
    });
    return row;
  });

  // Calculate totals for each month
  const monthTotals: Record<string, number> = {};
  months.forEach((label) => {
    monthTotals[label] = tableRows.reduce((sum, row) => sum + row[label], 0);
  });

  return (
    <Card className="w-full overflow-auto bg-none bg-background border-border m-0 mt-3">
      <CardHeader className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-500" />
        <CardTitle className="text-lg">Monthly Service Costs</CardTitle>
      </CardHeader>
      <CardContent className="px-3 overflow-scroll border-border rounded-md">
        <table className="min-w-full table-auto border !border-border rounded-md text-sm">
          <thead className="sticky top-0 bg-primary/70">
            <tr>
              <th className="border px-3 py-2 text-left">Service Name</th>
              {months.map((label) => (
                <th key={label} className="border px-3 py-2 text-right">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((service) => (
              <tr key={service.service_name} className="hover:bg-foreground/20">
                <td className="border px-3 py-1">{service.service_name}</td>
                {months.map((label) => (
                  <td
                    key={label}
                    className="border px-3 py-1 text-right font-mono"
                  >
                    {service[label].toFixed(3)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="font-semibold bg-primary/60">
            <tr>
              <td className="border px-3 py-2">Total</td>
              {months.map((label) => (
                <td
                  key={label}
                  className="border px-3 py-2 text-right font-mono"
                >
                  {monthTotals[label].toFixed(3)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </CardContent>
    </Card>
  );
}
