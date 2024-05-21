"use client";
import { useRouter } from "next/navigation";
import LoginForm from "./components/LoginForm";
import getCookie from "@/lib/functions/getCookie";
import { useEffect } from "react";

export default function Page() {
  const loggedIn = getCookie("logged_in");
  const router = useRouter();

  useEffect(() => {
    if (loggedIn === "yes") {
      router.push("/");
    }
  }, [loggedIn, router]);

  return <LoginForm />;
}
