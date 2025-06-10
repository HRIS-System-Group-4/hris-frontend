import { AttendanceDetailClient } from "./_components/AttendanceDetailClient";

export default function DetailAttendancePage({ params }: { params: { id: string } }) {
  return <AttendanceDetailClient id={params.id} />;
}
