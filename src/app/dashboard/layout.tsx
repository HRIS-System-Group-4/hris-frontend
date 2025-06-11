import type React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import { Providers } from "../provider";
import { Toaster } from "@/components/ui/toaster";
import "../globals.css"; // penting agar style global tetap ada

export default function DashboardLayout({
  children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="overflow-auto h-screen scrollbar-none">
                    <DashboardHeader />
                    <div className="p-4">{children}</div>
                </SidebarInset>
            </SidebarProvider>
            <Toaster />
        </Providers>
    );
}

