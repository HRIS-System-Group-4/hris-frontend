import { AttendanceDetailClient } from "./_components/AttendanceDetailClient";

export default async function DetailAttendancePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const checkClock = resolvedSearchParams.checkClock
    ? Boolean(String(resolvedSearchParams.checkClock))
    : false;

  return <AttendanceDetailClient id={resolvedParams.id} checkClock={checkClock} />
}