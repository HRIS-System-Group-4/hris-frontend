"use client"

import type * as React from "react"
import {
  IconCamera,
  IconHome,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconClock,
  IconCalendarEvent,
  IconBuildings,
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { SkeletonNavMain } from "./skeletons/skeleton-nav-main"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
      onlyAdmin: false,
    },
    {
      title: "Employee",
      url: "/dashboard/employee",
      icon: IconUsers,
      onlyAdmin: true,
    },
    {
      title: "Check Clock",
      url: "/dashboard/check-clock",
      icon: IconClock,
      onlyAdmin: true,
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: IconCalendarEvent,
      onlyAdmin: false,
    },
    {
      title: "Branch",
      url: "/dashboard/branch",
      icon: IconBuildings,
      onlyAdmin: true,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
      onlyAdmin: false,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/dashboard/data-library",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "/dashboard/word-assistant",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href={"/dashboard/"} className="w-fit">
                <Image src="/logo/Logo HRIS-1.png" alt="Logo" height={0} width={52} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {!user ? (
          <SkeletonNavMain />
        ) : (
          <>
            <NavMain items={data.navMain} />
            {
              user.is_admin &&
              <NavSecondary items={data.navSecondary} className="mt-auto" />
            }
          </>
        )}
      </SidebarContent>
    </Sidebar >
  )
}
