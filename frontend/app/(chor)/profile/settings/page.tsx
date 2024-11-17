"use client";
import React from "react";
import useGetUser from "../hooks/useGetUser";
import EditProfileForm from "../components/editProfileForm";
import { usePathname } from "next/navigation";

export default function Page() {
  const { data: user, isSuccess } = useGetUser("0");
  const patth = usePathname();
  
  return (
    <div className="gap-4 max-h-[calc(100vh-7.8rem)] w-full flex flex-col items-center p-4 mx-2 overflow-auto md:scrollbar scrollbar-thumb-primary/20 scrollbar-w-2 no-scrollbar">
      {isSuccess && <EditProfileForm user={user} path={patth}/>}

      
    </div>
  );
}
