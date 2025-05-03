"use client"

import { AdminStats } from "./admin-stats"
import { ChartEmployementTypes } from "./chart-employement-types"
import { ChartTeamComposition } from "./chart-team-composition"
import { ChartWorkLocation } from "./chart-work-location"

export default function DashboardAdmin() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <AdminStats />
            <ChartTeamComposition />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <ChartEmployementTypes />
                </div>
                <div className="col-span-1">
                    <ChartWorkLocation />
                </div>
            </div>
        </div>
    )
}