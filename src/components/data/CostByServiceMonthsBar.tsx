import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, Filter, Download } from "lucide-react";
import { formatMonthLabel } from "@/utils/data/date_format";

type MonthlyPoint = {
  month: string; // ISO date string, e.g. "2025-01-01T00:00:00Z"
  total_usage: number;
  total_cost: number;
};

type ServiceSeries = {
  service_name: string;
  monthly: MonthlyPoint[];
};

type Props = {
  data: ServiceSeries[]; // the array you showed
  currency?: string; // default "USD"
  title?: string; // default "Monthly Cost by Service"
  onExportCSV?: (csv: string) => void; // optional export handler
};

// caused timezone issues (showing dec-jul for a data of jan-aug)
// const formatMonthLabel = (isoDate: string) => {
//   const d = new Date(isoDate);
//   // Example: Jan ’25
//   return d
//     .toLocaleDateString(undefined, { month: "short", year: "2-digit" })
//     .replace(" ", " ");
// };

// const formatMonthLabel = (isoDate: string) => {
//   const [year, month] = isoDate.split("-");
//   return `${month}-${year.slice(-2)}`; // e.g. "01-25"
// };
//
const currencyFormatter = (currency = "USD") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });

const EmptyState: React.FC<{ message?: string }> = ({
  message = "No data to display",
}) => (
  <div className="flex h-72 items-center justify-center rounded-xl border border-dashed">
    <div className="text-center">
      <BarChart3 className="mx-auto mb-2 h-8 w-8 opacity-60" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);

const CustomTooltip: React.FC<any> = ({
  active,
  payload,
  label,
  currency = "USD",
}) => {
  if (!active || !payload?.length) return null;
  const fmt = currencyFormatter(currency);
  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded-lg border bg-background/95 p-2 shadow-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{fmt.format(value)}</div>
    </div>
  );
};

const ServiceCostBarChart: React.FC<Props> = ({
  data,
  currency = "USD",
  title = "Monthly Cost by Service",
  onExportCSV,
}) => {
  const services = React.useMemo(() => data.map((d) => d.service_name), [data]);
  const [selectedService, setSelectedService] = React.useState<string>(
    services[0] ?? "",
  );

  React.useEffect(() => {
    // Keep selection valid if data changes
    if (!services.includes(selectedService)) {
      setSelectedService(services[0] ?? "");
    }
  }, [services, selectedService]);

  const currentSeries = React.useMemo(
    () => data.find((d) => d.service_name === selectedService),
    [data, selectedService],
  );

  const chartData = React.useMemo(
    () =>
      (currentSeries?.monthly ?? []).map((m) => ({
        month: formatMonthLabel(m.month),
        total_cost: Number(m.total_cost || 0),
      })),
    [currentSeries],
  );

  const fmt = React.useMemo(() => currencyFormatter(currency), [currency]);

  function getCssVariable(name: string) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  const strokeColor = getCssVariable("--foreground"); // reads Tailwind var
  const gridColor = getCssVariable("--muted"); // example
  const barColor = getCssVariable("--primary");

  return (
    <Card className="w-full bg-background border-border h-full ">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={selectedService}
              onValueChange={(v) => setSelectedService(v)}
            >
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* <Button */}
          {/*   variant="outline" */}
          {/*   size="icon" */}
          {/*   onClick={handleExport} */}
          {/*   title="Export CSV" */}
          {/* > */}
          {/*   <Download className="h-4 w-4" /> */}
          {/* </Button> */}
        </div>
      </CardHeader>

      <CardContent>
        {!chartData.length ? (
          <EmptyState message="No monthly cost data for the selected service." />
        ) : (
          <div className="h-80 w-full p-0 m-0">
            <ResponsiveContainer width="100%" height="100%">
              <RBarChart
                data={chartData}
                margin={{ top: 10, right: 24, left: 8, bottom: 8 }}
              >
                <defs>
                  {/* subtle gradient using theme primary */}
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--foreground))"
                      stopOpacity={0.9}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.5}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: strokeColor, fontSize: 12, fontWeight: 500 }} // size in px
                />
                <YAxis
                  tickFormatter={(v) => fmt.format(v as number)}
                  width={80}
                  tickLine={false}
                  axisLine={false}
                  stroke={strokeColor}
                />
                <Tooltip
                  content={<CustomTooltip currency={currency} />}
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                />
                <Bar
                  dataKey="total_cost"
                  name="Total Cost"
                  fill={barColor}
                  opacity="0.8"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={56}
                />
              </RBarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCostBarChart;
