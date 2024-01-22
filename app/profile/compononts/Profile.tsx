"use client";
import React, { use, useContext, useEffect } from "react";
import UserInfo from "./userInfo";
import GamesTable from "./gamesTable";
import States from "./states";
import Friends from "./friends";
import { useRouter } from "next/navigation";
import { UserContext } from "@/lib/providers/UserContext";
import axios from "axios";
import useGetClient from "../hooks/useGetClient";

export default function Profile() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const {
    mutate: getClient,
    isError,
    isPending,
    isSuccess,
    data,
  } = useGetClient();

  useEffect(() => {
    if (!currentUser && !isPending) {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("user_id");
      if (token && id && !isPending && !isSuccess) {
        getClient({ id: id.toString(), token });
      }
    }
    if (isSuccess && data && !currentUser) {
      setCurrentUser(data);
    } else if (isError) {
      router.push("/login");
    }
  }, [
    isSuccess,
    data,
    setCurrentUser,
    currentUser,
    isPending,
    getClient,
    isError,
    router,
  ]);

  if (localStorage.getItem("logged_in") !== "yes") router.push("/login");

  return (
    currentUser && (
      <div className="lg:flex justify-center gap-4 p-4">
        <div className="flex flex-col gap-4 mb-4">
          <UserInfo currentUser={currentUser} />
          <GamesTable />
        </div>
        <div className="flex flex-col gap-4">
          <States />
          <Friends />
        </div>
      </div>
    )
  );
  // : (
  //   <div>Loading ..</div>
  // );
}
