import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL, // atau base URL kamu
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // withCredentials: true, // ini penting kalau backend pakai cookie/session
  });

// Interceptor: secara otomatis attach token ke request
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
