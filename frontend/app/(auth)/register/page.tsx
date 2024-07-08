"use client";
import getCookie from "@/lib/functions/getCookie";
import RegisterForm from "./components/RegisterForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const logedIn = getCookie("logged_in");
  const router = useRouter();

  if (logedIn) {
    router.push("/");
  }
  return <RegisterForm />;
}
