import axios from "axios";
import getCookie from "./getCookie";
import authService from "./authService";
import { redirect } from "next/navigation";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("access");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 
    ) {
      originalRequest._retry = true;
      const isRefreshSuccessful = await authService.refreshToken();
      if (isRefreshSuccessful) {
        return axiosInstance(originalRequest);
      }
    }


    return Promise.reject(error);
  }
);
export default axiosInstance;
