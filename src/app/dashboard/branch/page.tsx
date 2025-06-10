import { Metadata } from "next"
import { CustomPage, CustomPageHeader, CustomPageSubtitle, CustomPageTitle, CustomPageTitleButtons, CustomPageTitleContainer } from "@/components/ui/custom-page"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import BranchClientComponent from "./_components/branch-client-component"
import BranchSection from "./_components/BranchSection"

export const metadata: Metadata = {
  title: "Branch",
  description: "A Expense tracker built using Tanstack Table."
}

export default function BranchPage() {
  return (
    <BranchSection />
  )
}
