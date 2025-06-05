"use client"
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
import { usePathname } from "next/navigation"
import { useBreadcrumbSegments } from "@/hooks/use-breadcrumbs"
import { SidebarTrigger } from "./ui/sidebar"
import Link from "next/link"



export default function DashboardHeader() {
    const pathname = usePathname()
    const pathSegments = pathname.split("/").filter(Boolean)

    const segments = useBreadcrumbSegments()
    
    return (
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
                <NavUser />
            </div>
        </header>
    )
}