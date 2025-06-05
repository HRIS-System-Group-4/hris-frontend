"use client"

import {
    IconChevronDown,
} from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,

} from "@/components/ui/sidebar"
import { Skeleton } from "../ui/skeleton"

export function SkeletonNavUser({
}: {
    }) {


    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <div className="grid flex-1 text-left text-sm leading-tight pr-4">
                                <Skeleton className="h-6 w-16 rounded-lg" />
                                <Skeleton className="h-4 w-10 rounded-lg" />
                            </div>
                            <IconChevronDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
