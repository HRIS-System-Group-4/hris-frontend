import axiosInstance from "@/lib/axios";

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
