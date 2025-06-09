// app/dashboard/branch/[id]/page.tsx
import { CustomPage } from "@/components/ui/custom-page"
import BranchDetailClient from "./_components/BranchDetailClient"

export default function BranchDetailPage() {
  return (
    <CustomPage>
      <BranchDetailClient />
    </CustomPage>
  )
}
