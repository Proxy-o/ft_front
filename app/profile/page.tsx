"use client";

import { UserContext } from "@/lib/providers/UserContext";
import Profile from "./compononts/Profile";
import { useContext, useEffect } from "react";
import getCookie from "@/lib/functions/getCookie";
import useGetUser from "./hooks/useGetUser";
import { useRouter } from "next/navigation";
import LoginForm from "../login/components/LoginForm";

export default function Page() {
  const user_id = getCookie("user_id");
  const { data: user, error, isSuccess } = useGetUser(user_id || "0");

  if (!user && isSuccess) return <LoginForm />;

  return isSuccess && <Profile id={user_id || "0"} />;
}
