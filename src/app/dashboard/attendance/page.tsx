
import { Metadata } from "next"
import fs from "fs"
import path from "path"
import { columns } from "../../../components/table/attendance/admin/columns"
import { DataTable } from "../../../components/table/attendance/admin/data-table"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"

export const metadata: Metadata = {
  title: "Attendance",
  description: "A Expense tracker build using Tanstack Table."
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
  console.log("data", data);

  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Attendance Management</CustomPageTitle>
          <CustomPageSubtitle>Manage and organize all your attendance' data</CustomPageSubtitle>
        </CustomPageTitleContainer>
      </CustomPageHeader>
      <DataTable data={data} columns={columns} />
      {/* <h2 className="text-lg font-medium mb-4">Employee Management</h2> */}
    </CustomPage>
  );
}
