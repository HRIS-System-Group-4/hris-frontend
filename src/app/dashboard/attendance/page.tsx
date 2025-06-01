import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { columns as columnsEmployee } from "../../../components/table/attendance/employee/columns";
import { DataTableAttendanceEmployee } from "@/components/table/attendance/employee/data-table";
import {
  CustomPage,
  CustomPageHeader,
  CustomPageSubtitle,
  CustomPageTitle,
  CustomPageTitleButtons,
  CustomPageTitleContainer,
} from "@/components/ui/custom-page";
import { AttendanceModal } from "@/components/attendance/AttendanceModal"; // import modal client component

export const metadata: Metadata = {
  title: "Attendance",
  description: "An Expense tracker build using Tanstack Table.",
};

async function getData() {
  const filePath = path.join(
    process.cwd(),
    "src/app/dashboard/attendance",
    "data.json"
  );
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

export default async function Page() {
  const data = await getData();

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
          <AttendanceModal /> {/* tombol & modal langsung di sini */}
        </CustomPageTitleButtons>
      </CustomPageHeader>

      <DataTableAttendanceEmployee data={data} columns={columnsEmployee} />
    </CustomPage>
  );
}
