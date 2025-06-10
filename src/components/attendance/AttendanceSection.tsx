"use client"

import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "../ui/custom-page";
import { AttendanceModal } from "./AttendanceModal";
import { AttendanceTableClient } from "../table/attendance/employee/AttendanceTableClient";
import SkeletonDashboardTable from "../skeletons/skeleton-dashboard-table";
import { employeeColumns } from "../table/attendance/employee/columns";
import { DataTableAttendanceAdmin } from "../table/attendance/admin/data-table";
import { columns as columnsAdmin } from "../table/attendance/admin/columns";
import { useEffect, useState } from "react";
import { getClockRequest } from "@/services/attendanceService";
import { toast } from "sonner";

export default function AttendanceSection() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<any[]>([])

    async function fetchData() {
        try {
            console.log("Fetching data...", user);
            const response = user?.is_admin ? await getClockRequest() : null
            const data = response?.data
            console.log("Data", data)
            setData(data)
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

    if (!user) {
        return <SkeletonDashboardTable />
    }

    return (
        <CustomPage>
            <CustomPageHeader>
                <CustomPageTitleContainer>
                    <CustomPageTitle>Attendance Management</CustomPageTitle>
                    <CustomPageSubtitle>
                        Manage and organize all your attendance data
                    </CustomPageSubtitle>
                </CustomPageTitleContainer>
                <CustomPageTitleButtons>
                    {!user.is_admin && <AttendanceModal />}
                </CustomPageTitleButtons>
            </CustomPageHeader>


            {/* Komponen client yang akan fetch data dan render tabel */}

            {user.is_admin ? (
                <DataTableAttendanceAdmin columns={columnsAdmin} data={data} isLoading={false} skeletonRowCount={5} onRefresh={refreshData}/>
            ) : (
                <AttendanceTableClient columns={employeeColumns} />
            )}

        </CustomPage>
    )
}