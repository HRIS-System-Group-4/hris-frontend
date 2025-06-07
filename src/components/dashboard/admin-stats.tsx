"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AdminStats() {
  const [stats, setStats] = useState({
    total_employees: 0,
    percentage_clocked_in: 0,
    total_leave_and_absent: 0,
    total_branches: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    console.log("Fetching stats with token:", token);
    const fetchStats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/index", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch stats", res.status);
          return;
        }

        const data = await res.json();
        setStats({
          total_employees: data.total_employees || 0,
          percentage_clocked_in: data.percentage_clocked_in || 0,
          total_leave_and_absent: data["total_leave_&_absent"] || 0,
          total_branches: data.total_branches || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Employees</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.total_employees}
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Attendance Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.percentage_clocked_in}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Leave & Absent Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.total_leave_and_absent}
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Total Branches</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {stats.total_branches}
          </CardTitle>
        </CardHeader>
        <CardFooter className="border-t">
          <p className="text-xs text-neutral-400">Update: {today}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
