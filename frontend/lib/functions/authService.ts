import { redirect } from "next/navigation";
import axiosInstance from "./axiosInstance";
import getCookie from "./getCookie";

const authService = {
  refreshToken: async () => {
    try {
      const refreshToken = getCookie("refresh");
      const response = await axiosInstance.post("refresh", {
        refresh: refreshToken,
      });
      const { access, refresh } = response.data;

      var date = new Date();
      date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      var expires = "; expires=" + date.toUTCString();
      document.cookie = "refresh=" + refresh + expires + "; path=/";

      return true;
    } catch (error) {
      // Handle token refresh error (e.g., logout the user)
      document.cookie =
        "access=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure;";
      document.cookie =
        "refresh=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=None; Secure;";
      document.cookie =
        "logged_in=no;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=None; Secure;";
      document.cookie =
        "user_id=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=None; Secure;";
      redirect("/login");
      return false;
    }
  },
};

export default authService;
