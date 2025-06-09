"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import Link from "next/link"

interface NavMainProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string
    url: string
    icon: React.ComponentType<any>
    onlyAdmin: boolean
  }[]
}

export function NavMain({ items, className, ...props }: NavMainProps) {
  const pathname = usePathname()
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <SidebarGroup className={className} {...props}>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.filter(item => user?.is_admin ? true : !item.onlyAdmin).map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                // Check if the current path starts with the item URL or is exactly the item URL
                isActive={pathname === item.url}
              >
                <Link href={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
