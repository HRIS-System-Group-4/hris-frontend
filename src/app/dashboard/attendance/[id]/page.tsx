import { AttendanceDetailClient } from "./_components/AttendanceDetailClient";

export default function DetailAttendancePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {

  console.log("Search params:", searchParams.checkClock);

  return <AttendanceDetailClient id={params.id} checkClock={searchParams.checkClock ? Boolean(searchParams.checkClock) : false} />
}
