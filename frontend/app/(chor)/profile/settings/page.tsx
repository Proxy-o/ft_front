"use client";
import React from "react";
import useToggleOTP from "./hooks/useToggleOTP";
import useGetUser from "../hooks/useGetUser";
import EditProfileForm from "../components/editProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function Page() {
  const { data: user, isSuccess } = useGetUser("0");
  const { mutate: toggleOTP } = useToggleOTP( "0");
  
  return (
    <Card className="gap-4 h-[calc(100vh-7.8rem)] max-w-[60rem] flex flex-col items-center p-4 mx-2 overflow-auto md:scrollbar scrollbar-thumb-primary/10 scrollbar-w-2 no-scrollbar">
      <Card className="flex flex-col gap-2 justify-center items-center h-fit  p-4 max-w-lg w-full ">
          {isSuccess && user && user.otp_active && (
            <Avatar className="flex flex-col mr-2 size-fit">
            <p>Scan the QRCode</p>
            <AvatarImage
              src={user?.qr_code}
              alt="QR Code"
              className="rounded-sm size-48"
            />
            <AvatarFallback className="rounded-sm size-4 text-xs">QR</AvatarFallback>
          </Avatar>
        )}
          <div className="flex flex-row items-center space-x-3">
            <p>Enable One Time Passsword</p>
            <Switch
              defaultChecked={user?.otp_active}
              onCheckedChange={(checked: boolean) => toggleOTP(checked ? "enable" : "disable")}
            />
          </div>
      </Card>
      
      {isSuccess && <EditProfileForm user={user} />}
    </Card>
  );
}
