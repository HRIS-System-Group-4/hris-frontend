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
import { attendanceService, getClockRequest } from "@/services/attendanceService";
import { toast } from "sonner";
import { DataTableAttendanceEmployee } from "../table/attendance/employee/data-table";

export default function AttendanceSection() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<any[]>([])

    async function fetchData() {
        try {
            if (user?.is_admin) {
                const response = await getClockRequest()
                const data = response?.data
                setData(data)
            } else {
                const attendanceData = await attendanceService.getAttendanceRecords();

                // Jika API mengembalikan array langsung, pakai langsung
                // Jika hanya satu record, bungkus jadi array
                const formattedData = Array.isArray(attendanceData) ? attendanceData : [attendanceData];
                setData(formattedData);
            }
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
                <DataTableAttendanceAdmin columns={columnsAdmin} data={data} isLoading={false} skeletonRowCount={5} onRefresh={refreshData} />
            ) : (
                // <div></div>
                <DataTableAttendanceEmployee columns={employeeColumns} data={data} isLoading={false} skeletonRowCount={5} onRefresh={refreshData}/>
            )}

        </CustomPage>
    )
}