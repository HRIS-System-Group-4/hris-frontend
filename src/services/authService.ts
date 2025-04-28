import axiosInstance from "@/lib/axios";
import Cookies from 'js-cookie';

export async function loginAdmin(email: string, password: string, rememberMe: boolean) {
    const res = await axiosInstance.post('/login/admin', {
        login: email,
        password: password,
      });

    return res.data;
}

export async function logout() {
    const res = await axiosInstance.post('/logout'); 

    return res;
}