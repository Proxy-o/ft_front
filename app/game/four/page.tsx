"use client";

import getCookie from "@/lib/functions/getCookie";
import Four from "./four";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useGetUser from "@/app/profile/hooks/useGetUser";

export default function Page() {
  const user_id = getCookie("user_id") || "";
  const { data: user, isSuccess } = useGetUser(user_id || "0");
  const router = useRouter();

  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  return (
    <div className={`flex flex-col w-full h-full justify-start items-center`}>
      <Four />
    </div>
  );
}
