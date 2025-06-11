"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CustomPage,
  CustomPageHeader,
  CustomPageSubtitle,
  CustomPageTitle,
  CustomPageTitleButtons,
  CustomPageTitleContainer,
} from "@/components/ui/custom-page";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTableEmployee } from "@/components/table/employee/admin/data-table";
import { columns } from "@/components/table/employee/admin/columns";
import axios from "axios";

export default function EmployeePage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  // const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
  currentPage: 1,
  lastPage: 1,
});

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



  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const token = localStorage.getItem("authToken");
  //       const res = await fetch(`http://localhost:8000/api/employees?page=${pagination.currentPage}&per_page=${pageSize}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: "application/json",
  //         },
  //         cache: "no-store",
  //       });

  //       const result = await res.json();
  //       console.log("Pagination meta:", result.meta);

  //       const formatted = result.data.map((item: Employee, index: number) => {
  //         const [firstName, ...lastParts] = item.name.split(" ");
  //         const lastName = lastParts.join(" ");
  //         return {
  //           // id: (pagination.currentPage - 1) * 10 + index + 1,
  //           // id: (pagination.currentPage - 1) * pageSize + index + 1,
  //           id: item.employee_id || item.id,
  //           firstName: firstName ?? "-",
  //           lastName: lastName || "-",
  //           email: item.email ?? "unknown@example.com",
  //           avatar: null, 
  //           jobTitle: item.job_title ?? "Not assigned",
  //           grade: item.grade ?? "-",
  //           branch: item.branch ?? "-",
  //           status: "active", 
  //         };
  //       });

  //       setData(formatted);
  //       setPagination({
  //         currentPage: result.meta.current_page,
  //         lastPage: result.meta.last_page,
  //       });
  //       setTotal(result.meta.total);
  //     } catch (err) {
  //       console.error("Failed to fetch employees:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchEmployees();
  // }, [pagination.currentPage, pageSize]); 
      useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8000/api/employees`,
          {
            params: {
              page: pagination.currentPage,
              per_page: pageSize,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

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
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [pagination.currentPage, pageSize]);

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
      {!loading && data.length > 0 ? (
        // <DataTableEmployee data={data} columns={columns} />
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
      ) : (
        <p className="text-center text-muted-foreground">No data available</p>
      )}
    </CustomPage>
  );
}
