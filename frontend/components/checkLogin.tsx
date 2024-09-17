"use client";

import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CheckLogin = () => {
  const { data: user, isSuccess } = useGetUser( "0");
  const router = useRouter();

  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  return <></>;
};

export default CheckLogin;
