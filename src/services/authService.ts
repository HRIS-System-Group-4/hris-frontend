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
export async function registerAdmin(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}) {
    await getCsrfCookie(); // Pastikan CSRF Cookie aktif

    const employeeId = `${data.firstName}${data.lastName}`.toLowerCase();

    const response = await axiosInstance.post("/api/admin/register", {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        employee_id: employeeId,
    }, {
        withCredentials: true,
        headers: {
            Accept: "application/json",
        }
    });

    return response.data;
}

export async function setupCompany(data: {
    company_name: string;
    company_username: string;
    latitude: number;
    longitude: number;
    location_radius: number;
}) {
    const token = localStorage.getItem("token");

    const response = await axiosInstance.post("/api/company", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });

    return response.data;
}
