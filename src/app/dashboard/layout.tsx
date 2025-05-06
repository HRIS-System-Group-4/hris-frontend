"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NavUser } from "@/components/nav-user"
import { toTitleCase } from "@/lib/strings"
import { useBreadcrumbSegments } from "@/hooks/use-breadcrumbs"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const pathSegments = pathname.split("/").filter(Boolean)

    const data = {
        user: {
            name: "taufiq hidayatulloh",
            level: "admin",
            avatar: "/avatars/shadcn.jpg",
        },
    }

    const segments = useBreadcrumbSegments()

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-auto h-screen scrollbar-none">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
                    <div className="flex items-center gap-2 px-4 flex-1">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {/* <CustomBreadcrumb></CustomBreadcrumb> */}
                        <Breadcrumb>
                            <BreadcrumbList>
                                {segments.map(({ label, href, isLast }) => (
                                    <div key={href} className="flex items-center gap-1">
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage>{label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={href}>{label}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {!isLast && <BreadcrumbSeparator />}
                                    </div>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>

                    </div>
                    <div className="w-fit">
                        <NavUser user={data.user} />
                    </div>
                </header>
                <div className="p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}