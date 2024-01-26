import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import React, { useContext, useEffect, useState } from "react";
import useEditAvatar from "../hooks/useEditAvatar";
import { User } from "@/lib/types";

export default function ProfileAvatar({ currentUser }: { currentUser: User }) {
  const { setCurrentUser } = useContext(UserContext);

  const { mutate: editAvatar, isSuccess } = useEditAvatar();
  const [data, setData] = useState({
    id: currentUser!.id,
    avatar: "",
  });

  const handleImageChange = (e: any) => {
    let newData = { ...data };
    newData["avatar"] = e.target.files[0];
    setData(newData);
  };

  const doSubmit = async (e: any) => {
    e.preventDefault();
    let form_data = new FormData();
    if (data.avatar) form_data.append("avatar", data.avatar);
    editAvatar(data);
  };

  return (
    currentUser && (
      <form>
        <Avatar className="rounded-sm w-full h-full">
          <AvatarImage src={currentUser.avatar} alt="@shadcn" />
          <AvatarFallback className="rounded-sm">AV</AvatarFallback>
        </Avatar>
        <input
          type="file"
          name="image_url"
          accept="image/jpeg,image/png,image/gif"
          onChange={(e) => {
            handleImageChange(e);
          }}
        ></input>
        <Button variant="default" type="submit" onClick={(e) => doSubmit(e)}>
          submite
        </Button>
      </form>
    )
  );
}
