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
import { usePathname } from "next/navigation"
import { useBreadcrumbSegments } from "@/hooks/use-breadcrumbs"
import { SidebarTrigger } from "../ui/sidebar"
import Link from "next/link"
import { PreviewNavUser } from "./preview-nav-user"



export default function PreviewDashboardHeader() {
    const pathname = usePathname()

    const segments = useBreadcrumbSegments()

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
            <div className="flex items-center gap-2 px-4 flex-1">
                <SidebarTrigger className="-ml-1" disabled/>
                <Separator orientation="vertical" className="mr-2 h-4" />
                {/* <CustomBreadcrumb></CustomBreadcrumb> */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <div key={"#"} className="flex items-center gap-1">
                            <BreadcrumbItem>

                                <BreadcrumbLink asChild>
                                    <Link href={"#"}>Dashboard</Link>
                                </BreadcrumbLink>

                            </BreadcrumbItem>
                        </div>
                    </BreadcrumbList>
                </Breadcrumb>

            </div>
            <div className="w-fit">
                <PreviewNavUser />
            </div>
        </header>
    )
}