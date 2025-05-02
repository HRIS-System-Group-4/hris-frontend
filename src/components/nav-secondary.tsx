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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import SubsOverview from "./subs-overview"

interface NavSecondaryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string
    url: string
    icon: React.ComponentType<any>
  }[]
}

export function NavSecondary({ items, className, ...props }: NavSecondaryProps) {
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
                <a href={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SubsOverview />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
