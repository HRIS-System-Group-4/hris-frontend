import { getLocalAttendanceById } from "@/lib/getAttendanceLocal"
// import AttendanceDetailsPage from "./_components/AttendanceAdminDetailPage"
import AttendanceDetailsPage from "./_components/AttendanceEmployeeDetailPage"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getLocalAttendanceById(id)
  if (!data) return { title: "Not Found" }
  return {
    title: `Attendance: ${id}`,
    description: "Detailed view of employee attendance",
  }
}

export default async function DetailAttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // const data = await getLocalAttendanceById(id)
  // if (!data) return notFound()
  return (
    // <AttendanceDetailsPage data={data} />
    <div>
      {id}
    </div>

  )
}