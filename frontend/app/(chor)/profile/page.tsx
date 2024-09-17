"use client";

import Profile from "./components/Profile";
import { useEffect } from "react";
import useGetUser from "./hooks/useGetUser";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data: user, isSuccess } = useGetUser("0");

  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  return user && <Profile id={user.id} />;
}
