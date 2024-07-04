"use client";

import OneOffline from "./oneOffline";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import { Card } from "@/components/ui/card";

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
    <Card className="w-11/12 max-w-[900px] h-fit flex flex-col justify-center items-start pb-8 mx-auto mt-12 gap-2 p-4">
      <h1 className="text-4xl m-auto">Ping Pong</h1>
      <OneOffline />
    </Card>
  );
}
