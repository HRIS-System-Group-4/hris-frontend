"use client"

import { PreviewAdminStats } from "./preview-admin-stats"
import { PreviewChartEmployementTypes } from "./preview-chart-employement-types"
import { PreviewChartTeamComposition } from "./preview-chart-team-composition"
import { PreviewChartWorkLocation } from "./preview-chart-work-location"

export default function PreviewDashboardAdmin() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <PreviewAdminStats />
            <PreviewChartTeamComposition />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                    <PreviewChartEmployementTypes />
                </div>
                <div className="col-span-1">
                    <PreviewChartWorkLocation />
                </div>
            </div>
        </div>
    )
}