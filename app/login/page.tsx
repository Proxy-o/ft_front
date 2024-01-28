"use client";
import { useRouter } from "next/navigation";
import LoginForm from "./components/LoginForm";
import getCookie from "@/lib/functions/getCookie";

export default function Page() {
  const logedIn = getCookie("logged_in");
  const router = useRouter();

  if (logedIn) {
    router.push("/");
  }

  return <LoginForm />;
}
