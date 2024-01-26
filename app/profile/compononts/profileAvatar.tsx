import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import useEditAvatar from "../hooks/useEditAvatar";
import { User } from "@/lib/types";
import { PenBox } from "lucide-react";

export default function ProfileAvatar({ currentUser }: { currentUser: User }) {
  const { mutate: editAvatar } = useEditAvatar();

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // if image is changed

    const formData = new FormData();
    if (!file) return;
    formData.append("avatar", file);

    editAvatar({ avatar: file, id: currentUser.id });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleButtonClick = () => {
    inputFileRef.current?.click();
  };

  return (
    currentUser && (
      <form onSubmit={handleSubmit} className="relative">
        <Avatar className="rounded-sm w-full h-full">
          <AvatarImage src={currentUser.avatar} alt="@shadcn" />
          <AvatarFallback className="rounded-sm">AV</AvatarFallback>
        </Avatar>
        <input
          ref={inputFileRef}
          type="file"
          name="image_url"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleImageChange}
          style={{ display: "none" }} // Hide the input element
        />
        <PenBox
          onClick={handleButtonClick}
          className="absolute top-0  left-0 hover:cursor-pointer shadow-2xl rounded-full bg-secondary p-1 m-1"
        >
          Choose Avatar
        </PenBox>
      </form>
    )
  );
}
