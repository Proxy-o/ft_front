"use client";
import React, { use, useContext, useEffect, useRef } from "react";
import UserInfo from "./userInfo";
import GamesTable from "./gamesTable";
import States from "./states";
import useGetUser from "../hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import FriendList from "@/app/friends/components/friendList";
import useGetBlocked from "@/app/friends/hooks/useGetBlocked";

export default function Profile({ id }: { id: string }) {
  const { data, isSuccess } = useGetUser(id);
  const { data: blocked } = useGetBlocked();
  const isBlocked = blocked?.some((user: any) => user.id == id);
  const blocked_by_current_user = blocked?.some((user: any) => {
    if (user.id == id && user.blocked_by_user == true) return true;
  });

  const id_cookie = getCookie("user_id");
  const logged_in = getCookie("logged_in");

  const canEdit = logged_in === "yes" && id === id_cookie ? true : false;
  return (
    <div className="lg:flex justify-center gap-4 p-4 ">
      {isSuccess && (
        <>
          <div className="flex flex-col gap-4 mb-4 sm:min-w-[40rem]">
            <UserInfo
              user={data}
              canEdit={canEdit}
              current_user_id={id_cookie || "0"}
              isBlocked={isBlocked}
              blocked_by_current_user={blocked_by_current_user}
            />

            {!isBlocked && <GamesTable />}
          </div>
          {!isBlocked && (
            <div className="flex flex-col gap-4">
              <States />
              <FriendList />
            </div>
          )}
        </>
      )}
    </div>
  );
}
