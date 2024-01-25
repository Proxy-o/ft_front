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
      document.cookie = "access=" + access + expires + "; path=/";
      document.cookie = "refresh=" + refresh + expires + "; path=/";

      return true;
    } catch (error) {
      // Handle token refresh error (e.g., logout the user)
      return false;
    }
  },
};

export default authService;
