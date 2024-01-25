"use client";
import React, { use, useContext, useEffect } from "react";
import UserInfo from "./userInfo";
import GamesTable from "./gamesTable";
import States from "./states";
import Friends from "./friends";
import { useRouter } from "next/navigation";
import { UserContext } from "@/lib/providers/UserContext";
import useGetUser from "../hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";

export default function Profile() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const { mutate: getUser, isError, isPending, isSuccess, data } = useGetUser();

  const token = getCookie("access") || "";
  const id = getCookie("user_id") || "0";

  useEffect(() => {
    // If there is no current user, fetch user information using useGetUser
    if (!currentUser && !isSuccess) {
      // setCurrentUser({ tmp: "tmp" });
      getUser({ id });
    }
  }, [currentUser, getUser, isSuccess, id, token]);

  useEffect(() => {
    // If there is no current user, fetch user information using useGetUser
    if (isSuccess) {
      setCurrentUser(data);
    }
  }, [data, isSuccess, setCurrentUser]);

  return (
    <div className="lg:flex justify-center gap-4 p-4 ">
      {currentUser ? (
        // If there is a current user, display user information
        <div className="flex flex-col gap-4 mb-4 sm:min-w-[40rem]">
          <UserInfo currentUser={currentUser} />
          <GamesTable />
        </div>
      ) : (
        // If there is no current user, you may want to show a loading state or handle it accordingly
        <div>Loading...</div>
      )}
      {currentUser && (
        // If there is a current user, display additional content
        <div className="flex flex-col gap-4">
          <States />
          <Friends />
        </div>
      )}
    </div>
  );
}
