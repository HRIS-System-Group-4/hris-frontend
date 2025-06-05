"use client"

import { SkeletonStats } from "./skeleton-stats"

export default function SkeletonDashboard() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <SkeletonStats />
            {/* <ChartWorkHoursTrend /> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <ChartWorkHoursSummary />
                </div>
                <div className="col-span-1">
                    <ChartTimeOffTypes/>
                </div>
            </div> */}
        </div>
    )
}