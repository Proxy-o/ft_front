"use client";
import Tournament from "./tournament";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";

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
      {/* <Tournament /> */}
    </div>
  );
}
