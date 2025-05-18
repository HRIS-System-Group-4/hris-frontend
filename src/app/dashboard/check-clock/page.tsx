import { Metadata } from "next"
import path from "path"
import fs from "fs"
import { DataTableCheckClock } from "@/components/table/check-clock/admin/data-table";
import { TableCheckClock } from "@/components/table/table-check-clock";
import { Button } from "@/components/ui/button";
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "@/components/table/check-clock/admin/columns";

export const metadata: Metadata = {
  title: "Check Clock",
  description: "A Expense tracker build using Tanstack Table."
};

async function getData() {
  const filePath = path.join(
    process.cwd(),
    "src/app/dashboard/check-clock",
    "data.json"
  );
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

export default async function CheckClockPage() {
  const data = await getData();
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
  