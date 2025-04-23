import { SectionCards } from "@/components/section-cards";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <SectionCards />
      <div className="aspect-video rounded-xl bg-muted/50" />
    </div>
  )
}