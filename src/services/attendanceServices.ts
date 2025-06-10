import { AttendanceRecord } from "@/components/table/attendance/employee/schema";
import axiosInstance from "@/lib/axios";

export const attendanceService = {
  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get("/api/check-clocks/records", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Array.isArray(response.data.data)
      ? response.data.data
      : [response.data.data];
  },

  async getAttendanceById(id: string, token: string): Promise<AttendanceRecord | null> {
    try {
      const response = await axiosInstance.get(`/api/detail-check-clock?date=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Attendance by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance by ID:", error);
      return null;
    }
  }
};
