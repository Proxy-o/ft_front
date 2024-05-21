"use client";

import useGetUser from "@/app/profile/hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CheckLogin = () => {
  const user_id = getCookie("user_id") || "";
  const { data: user, isSuccess } = useGetUser(user_id || "0");
  const router = useRouter();

  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  return <></>;
};

export default CheckLogin;
