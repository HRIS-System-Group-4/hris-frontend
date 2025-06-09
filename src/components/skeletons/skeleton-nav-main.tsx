"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "../ui/skeleton"

interface NavMainProps extends React.HTMLAttributes<HTMLDivElement> {
}

export function SkeletonNavMain({ className, ...props }: NavMainProps) {

  return (
    <SidebarGroup className={className} {...props}>
      <SidebarGroupLabel><Skeleton className="h-5 w-20 bg-neutral-200" /></SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton disabled>
                <Skeleton className="size-5 bg-neutral-200" />
                <Skeleton className="h-5 w-20 bg-neutral-200" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
