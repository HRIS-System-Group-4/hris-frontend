"use client"

import { PreviewAppSidebar } from "./preview-app-sidebar"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import PreviewDashboardHeader from "./preview-dashboard-header"
import { cn } from "@/lib/utils"

export default function PreviewDashboard(
    { className, children }: { className?: string, children?: React.ReactNode }

) {
    return (
        <div className={cn(className, "")}>
            <SidebarProvider className="w-[1440px] h-[1024px] outline outline-neutral-200 rounded-2xl overflow-hidden">
                <PreviewAppSidebar className="absolute overflow-hidden -z-10 h-full" />
                <SidebarInset className="overflow-auto h-full scrollbar-none">
                    <PreviewDashboardHeader />
                    <div className="p-4">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}