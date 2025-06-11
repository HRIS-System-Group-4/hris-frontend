"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEmployeeDashboardStats } from "@/services/dashboardService";

export function EmployeeStats() {
  const [stats, setStats] = useState({
    total_working_days: 0,
    total_overtime_hours: 0,
    average_daily_working_hours: 0,
    total_annual_leave_days: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getEmployeeDashboardStats();
        setStats({
          total_working_days: data.total_working_days || 0,
          total_overtime_hours: data.total_overtime_hours || 0,
          average_daily_working_hours: data.average_daily_working_hours || 0,
          total_annual_leave_days: data.total_annual_leave_days || 0,
        });
      } catch (error) {
        console.error("Failed to fetch employee stats:", error);
      }
    };

    fetchStats();
  }, []);

  const formatHours = (value: number) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Days Worked</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.total_working_days} Days
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Annual Leave Remaining</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.total_annual_leave_days} Days Left
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Overtime Logged This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.total_overtime_hours} Hours
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Avg. Daily Working Time</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatHours(stats.average_daily_working_hours)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
