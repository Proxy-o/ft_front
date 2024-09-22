"use client";

import getCookie from "@/lib/functions/getCookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CheckLogin = () => {
  const path = usePathname()
  const is_logged = getCookie("logged_in") === "yes";
  const router = useRouter();

  useEffect(() => {
    if (is_logged && ["/", "/login", "/register"].includes(path)) {
      router.push("/game")
    } else if (is_logged) {
      router.push("/")
    }
  }, [is_logged, path, router])

  return <></>;
};

export default CheckLogin;
