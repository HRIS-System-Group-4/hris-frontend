"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Cookies from "js-cookie" // ⬅️ ini ditambah

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
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "@/lib/axios"
import { login } from "@/lib/features/authSlice"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        function loadUser() {
            // const res = await axiosInstance.get('/user');
            const userCookie = Cookies.get('user')
            if (userCookie) {
                try {
                    const userObj = JSON.parse(userCookie)
                    dispatch(login(userObj))
                } catch (error) {
                    console.error('Failed to parse user cookie', error)
                }
            }
        }

        if (!user) {
            loadUser();
        }

    }, [user])

    const pathname = usePathname()
    const pathSegments = pathname.split("/").filter(Boolean)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
                    <div className="flex items-center gap-2 px-4 flex-1">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {pathSegments.map((segment, index) => {
                                    const isLast = index === pathSegments.length - 1
                                    const href = "/" + pathSegments.slice(0, index + 1).join("/")

                                    const isDashboard = segment === "dashboard"
                                    const shouldSkipDashboard = isDashboard && pathSegments.length > 1

                                    if (shouldSkipDashboard && index === 0) return null

                                    return (
                                        <div key={href} className="flex items-center gap-1">
                                            <BreadcrumbItem>
                                                {isLast ? (
                                                    <BreadcrumbPage>{toTitleCase(segment)}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink asChild>
                                                        <Link href={href}>{toTitleCase(segment)}</Link>
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                            {!isLast && <BreadcrumbSeparator />}
                                        </div>
                                    )
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="w-fit">
                        {user && <NavUser user={user} />}
                    </div>
                </header>
                <div className="p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}
