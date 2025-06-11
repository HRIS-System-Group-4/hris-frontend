import axiosInstance from "@/lib/axios";

export async function getEmployees() {
    const response = await axiosInstance.get('/api/employees', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
    console.log("response", response);
    return response;
}

export async function getEmployeeById(id: string) {
    const response = await axiosInstance.get(`/api/employees/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
    console.log("response", response.data);
    return response;
}

export async function addEmployee(payload: any) {
    console.log("Payload Add", payload)
    const response = await axiosInstance.post(`/api/add-employees`, payload,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
        });
    console.log("response", response.data);
    return response;

}

export async function updateEmployee(id: string, payload: any) {
    console.log("Payload Update", payload)
    const response = await axiosInstance.put(`/api/employees/${id}`, payload, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
    console.log("response", response.data);
    return response;
}   