"use client";
import React, { use, useContext, useEffect, useRef } from "react";
import UserInfo from "./userInfo";
import GamesTable from "./gamesTable";
import States from "./states";
import Friends from "./friends";
import { UserContext } from "@/lib/providers/UserContext";
import useGetUser from "../hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import LoginForm from "@/app/login/components/LoginForm";

export default function Profile({ id }: { id: string }) {
  const { currentUser } = useContext(UserContext);
  const { mutate: getUser, isPending } = useGetUser();

  const isLogedin = getCookie("logged_in") || false;
  const id_cookie = getCookie("user_id");

  useEffect(() => {
    if (isLogedin && !currentUser) {
      getUser({ id });
    }
  }, [currentUser, getUser, id, isLogedin]);
  const canEdit =
    getCookie("logged_in") === "yes" && id === id_cookie ? true : false;
  return (
    <div className="lg:flex justify-center gap-4 p-4 ">
      {currentUser ? (
        <div className="flex flex-col gap-4 mb-4 sm:min-w-[40rem]">
          <UserInfo currentUser={currentUser} canEdit={canEdit} />
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
