"use client";
import React, { use, useContext, useEffect, useRef } from "react";
import UserInfo from "./userInfo";
import GamesTable from "./gamesTable";
import States from "./states";
import Friends from "./friends";
import { useRouter } from "next/navigation";
import { UserContext } from "@/lib/providers/UserContext";
import useGetUser from "../hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import { Button } from "@/components/ui/button";
import LoginForm from "@/app/login/components/LoginForm";

export default function Profile() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { mutate: getUser, isError, isPending, isSuccess, data } = useGetUser();
  const didRunOnce = useRef(false);

  const token = getCookie("access") || "";
  const id = getCookie("user_id") || "0";

  useEffect(() => {
    if (!currentUser && !isSuccess) {
      getUser({ id });
    }
  }, [currentUser, getUser, isSuccess, id, token]);

  useEffect(() => {
    if (isSuccess && !didRunOnce.current) {
      setCurrentUser(data);
      didRunOnce.current = true;
    }
  }, [data, isSuccess, setCurrentUser, currentUser]);

  return (
    <div className="lg:flex justify-center gap-4 p-4 ">
      {currentUser ? (
        <div className="flex flex-col gap-4 mb-4 sm:min-w-[40rem]">
          <UserInfo currentUser={currentUser} />
          <GamesTable />
        </div>
      ) : (
        !isPending && (
          <div className="w-full">
            <LoginForm />
          </div>
        )
      )}
      {currentUser && (
        <div className="flex flex-col gap-4">
          <States />
          <Friends />
        </div>
      )}
    </div>
  );
}
