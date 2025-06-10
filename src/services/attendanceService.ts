import axiosInstance from "@/lib/axios";
import { AttendanceRecord } from "@/components/table/attendance/employee/schema";

export async function getAttendanceEmployee() {
    const response = await axiosInstance.get('/api/check-clocks/records', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
    console.log("response", response);
    return response.data;
}

export async function clockInEmployee(data: any) {
    console.log("Payload yang dikirim:", data);
    const response = await axiosInstance.post('/api/clock-in', data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // 'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    console.log("response", response);
    return response.data;
}


export async function getClockRequest() {
    const response = await axiosInstance.get('/api/clock-requests', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
    console.log("response", response);
    return response.data;
}

export async function approveClockRequest(id: string) {
    const response = await axiosInstance.post(`/api/clock-requests/${id}/approve`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    console.log("response", response);
    return response;
}

export async function rejectClockRequest(id: string) {
    const response = await axiosInstance.post(`/api/clock-requests/${id}/decline`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    console.log("response", response);
    return response;
}

export async function getAttendanceDetail(id: string) {
    const response = await axiosInstance.get(`/api/clock-requests/${id}/detail`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
    console.log("response", response);
    return response.data;
}

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