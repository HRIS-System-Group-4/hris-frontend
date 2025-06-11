import { Metadata } from "next"
import path from "path"
import fs from "fs"
import { Button } from "@/components/ui/button"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"
import { Plus, Table } from "lucide-react"
import Link from "next/link"
import { columns } from "@/components/table/branch/admin/columns"
import { DataTableBranch } from "@/components/table/branch/admin/data-table"

export const metadata: Metadata = {
  title: "Branch",
  description: "A Expense tracker build using Tanstack Table."
};

async function getData() {
  const filePath = path.join(
    process.cwd(),
    "src/app/dashboard/branch",
    "data.json"
  );
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}


export default async function BranchPage() {
  const data = await getData();
  console.log("data", data);

  return (
    <CustomPage>
      <CustomPageHeader>
        <CustomPageTitleContainer>
          <CustomPageTitle>Branch Management</CustomPageTitle>
          <CustomPageSubtitle>Manage and organize all your branch offices</CustomPageSubtitle>
        </CustomPageTitleContainer>
        <CustomPageTitleButtons>
          <Link href={'/dashboard/branch/add'}>
            <Button variant="default" size={"lg"}>
              <Plus />
              Add Branch</Button>
          </Link>
        </CustomPageTitleButtons>
      </CustomPageHeader>
      <DataTableBranch data={data} columns={columns} />
      {/* <h2 className="text-lg font-medium mb-4">Employee Management</h2> */}
    </CustomPage>
  )
}
