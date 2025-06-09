import { AttendanceRecord } from "@/components/table/attendance/employee/schema";
import axiosInstance from "@/lib/axios";

export const attendanceService = {
  async getAttendanceRecords(): Promise<AttendanceRecord> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/api/check-clocks/records", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data; // data adalah objek single AttendanceRecord
  },
};
