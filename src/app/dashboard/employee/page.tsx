import { Metadata } from "next"
import path from "path"
import fs from "fs"
import { Button } from "@/components/ui/button"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DataTableEmployee } from "@/components/table/employee/admin/data-table"
import { columns } from "@/components/table/employee/admin/columns"

export const metadata: Metadata = {
  title: "Employee",
  description: "A Expense tracker build using Tanstack Table."
};

async function getData() {
  const filePath = path.join(
    process.cwd(),
    "src/app/dashboard/employee",
    "data.json"
  );
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}


export default async function EmployeePage() {
  const data = await getData();

  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Employee Management</CustomPageTitle>
          <CustomPageSubtitle>Manage and organize all your employees' data</CustomPageSubtitle>
        </CustomPageTitleContainer>
        <CustomPageTitleButtons>
          <Button variant="outline" size={"lg"}>Import</Button>
          <Button variant="outline" size={"lg"}>Export</Button>
          <Link href={'/dashboard/employee/add'}>
            <Button variant="default" size={"lg"}>
              <Plus />
              Add Employee</Button>
          </Link>
        </CustomPageTitleButtons>
      </CustomPageHeader>
      <DataTableEmployee data={data} columns={columns} />
      {/* <h2 className="text-lg font-medium mb-4">Employee Management</h2> */}
    </CustomPage>
  )
}
