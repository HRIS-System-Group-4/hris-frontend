import { AttendanceDetailClient } from "./_components/AttendanceDetailClient";

export default function DetailAttendancePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {

  const checkClock = searchParams.checkClock
    ? Boolean(String(searchParams.checkClock))
    : false;

  return <AttendanceDetailClient id={params.id} checkClock={checkClock} />
}
