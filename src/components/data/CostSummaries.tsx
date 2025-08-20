"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, CalendarDays } from "lucide-react";

interface BillingSummaryProps {
  cloudAccountId: string;
}

interface SummaryData {
  today: number;
  month: number;
}

export default function CostSummaries({ data }) {
  // const [data, setData] = useState<SummaryData>({ today: 0, month: 0 });
  const [loading, setLoading] = useState(false);

  if (loading) return <p>Loading billing summary...</p>;

  return (
    <div className="flex gap-4  justify-center items-center align-middle   rounded-md w-full  max-h-fit">
      <Card className=" w-full max-h-fit border-border bg-background">
        <CardHeader className="flex flex-row items-center space-x-2">
          <CalendarDays className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.total_month.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card className=" w-full max-h-fit border-border bg-background ">
        <CardHeader className="flex flex-row items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <CardTitle className="text-sm font-medium">Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${data.total_today.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
