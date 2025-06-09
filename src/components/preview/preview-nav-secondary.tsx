"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import { Progress } from "@/components/ui/progress"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import SubsOverview from "../subs-overview"
import PreviewSubsOverview from "./preview-subs-overview"

interface NavSecondaryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string
    url: string
    icon: React.ComponentType<any>
    onlyAdmin: boolean
  }[]
}

export function PreviewNavSecondary({ items, className, ...props }: NavSecondaryProps) {
  const pathname = usePathname()

  return (
    <SidebarGroup className={className} {...props}>
      <SidebarGroupContent>
        <SidebarMenu >
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                // Check if the current path starts with the item URL or is exactly the item URL
                isActive={pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url))}
              >
                <div>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <PreviewSubsOverview />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
