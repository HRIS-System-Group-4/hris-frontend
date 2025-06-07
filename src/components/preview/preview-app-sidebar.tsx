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
import { PreviewNavMain } from "./preview-nav-main"
import { PreviewNavSecondary } from "./preview-nav-secondary"

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

export function PreviewAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <PreviewNavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <PreviewNavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
