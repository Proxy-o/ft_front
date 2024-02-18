"use client";

import Profile from "./components/Profile";
import { useContext, useEffect } from "react";
import getCookie from "@/lib/functions/getCookie";
import useGetUser from "./hooks/useGetUser";
import { useRouter } from "next/navigation";

export default function Page() {
  const user_id = getCookie("userç_id");
  const router = useRouter();
  const { data: user, error, isSuccess } = useGetUser(user_id || "0");

  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  return user && <Profile id={user_id || "0"} />;
}
