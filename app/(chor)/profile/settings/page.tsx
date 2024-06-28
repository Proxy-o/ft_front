"use client";
import React from "react";
import useToggleOTP from "./hooks/useToggleOTP";
import useGetUser from "../hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import { Button } from "@/components/ui/button";
import EditProfileForm from "../components/editProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Page() {
  const userId = getCookie("user_id");
  const { mutate: toggleOTP } = useToggleOTP(userId || "0");
  const { data: user, isSuccess } = useGetUser(userId ?? "0");
  return (
    <div className="gap-4 w-full h-full flex flex-col justify-center items-center">
      {isSuccess && user.otp_active && (

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
        <Button disabled={user?.otp_active} onClick={() => toggleOTP("enable")}>
          Enable OTP
        </Button>
        <Button
          disabled={!user?.otp_active}
          onClick={() => toggleOTP("disable")}
        >
          Disable OTP
        </Button>
      </div>
      {isSuccess && <EditProfileForm user={user} />}
    </div>
  );
}
