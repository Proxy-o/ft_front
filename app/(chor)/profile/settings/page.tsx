"use client";
import React from "react";
import useToggleOTP from "./hooks/useToggleOTP";
import useGetUser from "../hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import EditProfileForm from "../components/editProfileForm";

export default function Page() {
  const userId = getCookie("user_id");
  const { mutate: toggleOTP } = useToggleOTP(userId || "0");
  const { data: user, isSuccess } = useGetUser(userId ?? "0");
  return (
    <div className="gap-4 w-full h-full flex flex-col justify-center items-center">
      {isSuccess && user.otp_active && (
        <div>
          <Image
            src={user?.qr_code ?? ""}
            alt="avatar"
            width={230}
            height={230}
          />
        </div>
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
