"use client";

import { UserContext } from "@/lib/providers/UserContext";
import Profile from "./compononts/Profile";
import { useContext, useEffect } from "react";
import getCookie from "@/lib/functions/getCookie";
import useGetUser from "./hooks/useGetUser";
import { useRouter } from "next/navigation";

export default function Page() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { mutate: getUser, isError, isPending, isSuccess, data } = useGetUser();
  const router = useRouter();

  const isLogedin = getCookie("logged_in") || false;
  const id = getCookie("user_id");

  useEffect(() => {
    if (isLogedin && !currentUser) {
      if (!id) {
        router.push("/login");
      } else {
        getUser({ id });
      }
    }
  }, [currentUser, getUser, isLogedin, router, id]);
  if (id) return <Profile id={id} />;
  else router.push("/login");
}
