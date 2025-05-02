"use client"

import { EmployeeStats } from "./employee-stats"
import { ChartWorkHoursTrend } from "./chart-work-hours-trend"
import { ChartWorkHoursSummary } from "./chart-work-hours-summary"
import { ChartTimeOffTypes } from "./chart-time-off"

export default function DashboardEmployee() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <EmployeeStats />
            <ChartWorkHoursTrend />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <ChartWorkHoursSummary />
                </div>
                <div className="col-span-1">
                    <ChartTimeOffTypes/>
                </div>
            </div>
        </div>
    )
}