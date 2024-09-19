"use client";
import React from "react";
import useToggleOTP from "./hooks/useToggleOTP";
import useGetUser from "../hooks/useGetUser";
import { Button } from "@/components/ui/button";
import EditProfileForm from "../components/editProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function Page() {
  const { data: user, isSuccess } = useGetUser("0");
  const { mutate: toggleOTP } = useToggleOTP( "0");
  
  return (
    <Card className="gap-4 w-full h-full flex flex-col justify-center items-center p-4 ">
      <Card className="flex flex-col gap-2 justify-center items-center h-full  p-4 max-w-lg w-full ">

      {isSuccess && user && user.otp_active && (

              <Avatar className=" mr-2 size-48">
              <AvatarImage
                src={user?.qr_code}
                alt="QR Code"
                className="rounded-sm size-48"
              />
              <AvatarFallback className="rounded-sm size-4 text-xs">QR</AvatarFallback>
            </Avatar>
      )}
      <div className="space-x-3">
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
