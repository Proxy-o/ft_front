"use client";
import React, { useContext } from "react";
import UserInfo from "./userInfo";
import GamesTable from "./gamesTable";
import States from "./states";
import Friends from "./friends";
import { useRouter } from "next/navigation";
import { UserContext } from "@/lib/providers/UserContext";
import axios from "axios";

export default function Profile() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  if (localStorage.getItem("logged_in") !== "yes") router.push("/login");
  else {
    if (!currentUser) {
      console.log("fetching user");
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("user_id");
      if (token && id) {
        axios
          .get(process.env.NEXT_PUBLIC_API_URL + `/user/${id}`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          .then((res) => {
            console.log(res);
            const user = {
              token,
              id: res.data.id,
              username: res.data.username,
              email: res.data.email,
              avatar: res.data.avatar,
            };
            console.log(user);
            setCurrentUser(user);
          });
      }
    }
  }

  return currentUser ? (
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
  ) : (
    router.push("/login")
  );
}
