import { Metadata } from "next";
// import { columns as columnsEmployee } from "../../../components/table/attendance/employee/columns";
import {
  CustomPage,
  CustomPageHeader,
  CustomPageSubtitle,
  CustomPageTitle,
  CustomPageTitleButtons,
  CustomPageTitleContainer,
} from "@/components/ui/custom-page";
import { AttendanceModal } from "@/components/attendance/AttendanceModal"; // modal client component
import { AttendanceTableClient } from "../../../components/table/attendance/employee/AttendanceTableClient"; // client component fetch data
// import { AttendanceTableClient } from "../../../components/table/attendance/employee/AttendanceTableClient";
import { employeeColumns as columnsEmployee } from "../../../components/table/attendance/employee/columns";
import AttendanceSection from "@/components/attendance/AttendanceSection";

export const metadata: Metadata = {
  title: "Attendance",
  description: "An Expense tracker build using Tanstack Table.",
};

export default function Page() {
  return (
    <AttendanceSection/>
  );
}