import axios from "axios";

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
      document.cookie =
        "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=lax;";
      document.cookie =
        "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=lax;";
      document.cookie =
        "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=lax;";
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
