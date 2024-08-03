import axios from "axios";
import getCookie from "./getCookie";
import authService from "./authService";
import { redirect } from "next/navigation";

// credentials: "include"
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api",
  withCredentials: true,

});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = getCookie("access");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 
    ) {
    //  remove logged_in cookie
      document.cookie = "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=lax;";
      document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=lax;";
      document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=lax;";
    
    }


    return Promise.reject(error);
  }
);
export default axiosInstance;
