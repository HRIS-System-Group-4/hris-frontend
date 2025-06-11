"use client";

import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { getAdminDashboardStats } from "@/services/dashboardService";

const chartConfig = {
  branches: {
    label: "Branches",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartWorkLocation() {
  const [totalBranches, setTotalBranches] = useState(0);
  const [chartData, setChartData] = useState<{ name: string; value: number; fill: string }[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getAdminDashboardStats();

        const branches = data.total_branches ?? 0;
        setTotalBranches(branches);

        // Data pie chart: hanya 1 slice yang menunjukkan jumlah branch
        setChartData([
          {
            name: "Branches",
            value: branches,
            fill: "var(--color-chart-1)",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Work Location</CardTitle>
        <CardDescription>
          {totalBranches} Branch{totalBranches !== 1 ? "es" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px] px-0">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              labelLine={false}
              label={({ payload, ...props }) => (
                <text
                  x={props.x}
                  y={props.y}
                  textAnchor={props.textAnchor}
                  dominantBaseline={props.dominantBaseline}
                  fill="hsla(var(--foreground))"
                  fontSize={12}
                >
                  {payload.value}
                </text>
              )}
              nameKey="name"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
