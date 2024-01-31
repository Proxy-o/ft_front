"use client";
import React, { use, useContext, useEffect, useRef } from "react";
import UserInfo from "./userInfo";
import GamesTable from "./gamesTable";
import States from "./states";
import { UserContext } from "@/lib/providers/UserContext";
import useGetUser from "../hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import LoginForm from "@/app/login/components/LoginForm";
import FriendList from "@/app/friends/components/friendList";

export default function Profile({ id }: { id: string }) {
  const { isPending, data, isSuccess } = useGetUser(id);

  const id_cookie = getCookie("user_id");

  const canEdit =
    getCookie("logged_in") === "yes" && id === id_cookie ? true : false;
  return (
    <div className="lg:flex justify-center gap-4 p-4 ">
      {isSuccess && (
        <>
          <div className="flex flex-col gap-4 mb-4 sm:min-w-[40rem]">
            <UserInfo currentUser={data} canEdit={canEdit} userId={id} />
            <GamesTable />
          </div>
          <div className="flex flex-col gap-4">
            <States />
            <FriendList />
          </div>
        </>
      )}
    </div>
  );
}
