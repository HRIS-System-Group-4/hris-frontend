import { Metadata } from "next"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import BranchClientComponent from "./_components/branch-client-component"

export const metadata: Metadata = {
  title: "Branch",
  description: "A Expense tracker built using Tanstack Table."
}

export default function BranchPage() {
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
              Add Branch
            </Button>
          </Link>
        </CustomPageTitleButtons>
      </CustomPageHeader>

      {/* Client-side data fetching handled here */}
      <BranchClientComponent />
    </CustomPage>
  )
}
