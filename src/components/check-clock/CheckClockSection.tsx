"use client"

import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "../ui/custom-page";
import { AttendanceTableClient } from "../table/attendance/employee/AttendanceTableClient";
import SkeletonDashboardTable from "../skeletons/skeleton-dashboard-table";
import { employeeColumns } from "../table/attendance/employee/columns";
import { DataTableAttendanceAdmin } from "../table/attendance/admin/data-table";
import { columns } from "@/components/table/check-clock/admin/columns";
import { useEffect, useState } from "react";
import { getClockRequest } from "@/services/attendanceService";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { DataTableCheckClock } from "../table/check-clock/admin/data-table";
import { getCheckClockSettings } from "@/services/checkClockService";

export default function CheckClockSection() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<any[]>([])

    async function fetchData() {
        try {
            console.log("Fetching data...", user);
            const data = await getCheckClockSettings()
            console.log("Data", data)
            setData(data.data)
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchData()
        }

    }, [user])

    const refreshData = () => {
        setIsLoading(true)
        fetchData()
    }

    if (!user || isLoading) {
        return <SkeletonDashboardTable />
    }

    return (
        <CustomPage>
            <CustomPageHeader>
                <CustomPageTitleContainer>
                    <CustomPageTitle>Check Clock Management</CustomPageTitle>
                    <CustomPageSubtitle>Manage and organize all your check clock setting</CustomPageSubtitle>
                </CustomPageTitleContainer>
                <CustomPageTitleButtons>
                    <Link href={'/dashboard/check-clock/add'}>
                        <Button variant="default" size={"lg"}>
                            <Plus />
                            Add Check Clock</Button>
                    </Link>
                </CustomPageTitleButtons>
            </CustomPageHeader>
            <DataTableCheckClock data={data} columns={columns} />
        </CustomPage>
    )
}