"use client"

import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "../ui/custom-page";
import { AttendanceTableClient } from "../table/attendance/employee/AttendanceTableClient";
import SkeletonDashboardTable from "../skeletons/skeleton-dashboard-table";
import { employeeColumns } from "../table/attendance/employee/columns";
import { DataTableAttendanceAdmin } from "../table/attendance/admin/data-table";
import { useEffect, useState } from "react";
import { getClockRequest } from "@/services/attendanceService";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { columns } from "@/components/table/employee/admin/columns";
import { DataTableEmployee } from "../table/employee/admin/data-table";
import { getEmployees } from "@/services/employeeService";

interface Employee {
    id: string;
    employee_id: string;
    nik: number;
    name: string;
    email?: string;
    job_title?: string;
    grade?: string;
    branch?: string;
    ck_settings_id?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
    jobTitle?: string;
    status?: string;
}

export default function EmployeeSection() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isLoading, setIsLoading] = useState(true)
    const [total, setTotal] = useState(0);
    const [data, setData] = useState<any[]>([])
    const [pageSize, setPageSize] = useState(10);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    async function fetchData() {
        try {

            const token = localStorage.getItem("authToken");
            const res = await getEmployees();

            const result = res.data;

            const formatted = result.data.map((item: Employee, index: number) => {
                const [firstName, ...lastParts] = item.name.split(" ");
                const lastName = lastParts.join(" ");
                return {
                    id: item.employee_id || item.id,
                    firstName: firstName ?? "-",
                    lastName: lastName || "-",
                    email: item.email ?? "unknown@example.com",
                    avatar: null,
                    jobTitle: item.job_title ?? "Not assigned",
                    grade: item.grade ?? "-",
                    branch: item.branch ?? "-",
                    status: "active",
                };
            });

            setData(formatted);
            setPagination({
                currentPage: result.meta.current_page,
                lastPage: result.meta.last_page,
            });
            setTotal(result.meta.total);
        } catch (err) {
            console.error("Failed to fetch employees:", err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchData()
        }

    }, [user, pagination.currentPage, pageSize])

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
                    <CustomPageTitle>Employee Management</CustomPageTitle>
                    <CustomPageSubtitle>
                        Manage and organize all your employees' data
                    </CustomPageSubtitle>
                </CustomPageTitleContainer>
                <CustomPageTitleButtons>
                    <Button variant="outline" size="lg">
                        Import
                    </Button>
                    <Button variant="outline" size="lg">
                        Export
                    </Button>
                    <Link href={"/dashboard/employee/add"}>
                        <Button variant="default" size="lg">
                            <Plus />
                            Add Employee
                        </Button>
                    </Link>
                </CustomPageTitleButtons>
            </CustomPageHeader>
            <DataTableEmployee
                columns={columns}
                data={data}
                pageCount={pagination.lastPage}
                pageSize={pageSize}
                total={total}
                currentPage={pagination.currentPage}
                // onPageSizeChange={setPageSize}
                onPageSizeChange={(newPageSize) => {
                    setPageSize(newPageSize);
                    setPagination(prev => ({ ...prev, currentPage: 1 })); // reset ke halaman 1 setiap ganti size
                }}
                onPageChange={(page) =>
                    setPagination((prev) => ({ ...prev, currentPage: page }))
                }
            />
        </CustomPage>
    )
}