import axiosInstance from "@/lib/axios";
import Cookies from 'js-cookie'

export async function getCsrfCookie() {
    await axiosInstance.get('/sanctum/csrf-cookie');
}

export async function loginAdmin(login: string, password: string) {
    console.log("Payload yang dikirim:", { login, password });
    getCsrfCookie();
    const response = await axiosInstance.post('/api/admin/login', {
        login,
        password,
    }, {
    });
    console.log("response", response);
    return response.data;
}

export async function loginEmployee(company: string, employee_id: string, password: string) {
    getCsrfCookie();
    const response = await axiosInstance.post('/api/employee/login', {
        company,
        employee_id,
        password,
    }, {
        withCredentials: true, // ini penting untuk Sanctum!
    });
    return response.data;
}

export async function fetchUser() {
    await getCsrfCookie();

    const response = await axiosInstance.get('/api/user', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
    });
    return response.data;
}

export async function logoutUser() {
    const xsrfToken = Cookies.get('XSRF-TOKEN');
    const response = await axiosInstance.post('/api/logout',
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                // 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken || ''),
            },
            withCredentials: true,
        });
    return response.data;
}