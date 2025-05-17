
import { getLocalAttendanceById } from "@/lib/getAttendanceLocal"
import AttendanceDetailsPage from "./_components/AttendanceAdminDetailPage"
import { notFound } from "next/navigation"


export async function generateMetadata({ params }: { params: { id: string } }) {
  const data = await getLocalAttendanceById(params.id)
  if (!data) return { title: "Not Found" }
  return {
    title: `Attendance: ${data.employee.firstName}`,
    description: "Detailed view of employee attendance",
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const data = await getLocalAttendanceById(params.id)
  if (!data) return notFound()
  return <AttendanceDetailsPage data={data} />
}
