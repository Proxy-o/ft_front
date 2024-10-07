import axios from "axios";
import { deleteCookie } from "@/lib/functions/getCookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      deleteCookie("logged_in");
      deleteCookie("access");
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
