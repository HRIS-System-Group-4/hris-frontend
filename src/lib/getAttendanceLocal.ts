import { AttendanceAdmin } from "@/components/table/attendance/admin/schema"
import fs from "fs"
import path from "path"


export async function getLocalAttendanceById(id: string): Promise<AttendanceAdmin | null> {
   const filePath = path.join(process.cwd(), "src/app/dashboard/attendance/data.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const data: AttendanceAdmin[] = JSON.parse(rawData);
  return data.find(item => item.id === id) ?? null;
}