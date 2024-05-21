"use client";
import React from "react";
import useToggleOTP from "./hooks/useToggleOTP";
import useGetUser from "../hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Page() {
  const userId = getCookie("user_id");
  const { mutate: toggleOTP } = useToggleOTP(userId || "0");
  const { data: user, isSuccess } = useGetUser(userId ?? "0");
  return (
    <div>
      {isSuccess && user.otp_active && (
        <div>
          <Image
            src={user?.qr_code ?? ""}
            alt="avatar"
            width={200}
            height={200}
          />
        </div>
      )}

      <Button disabled={user?.otp_active} onClick={() => toggleOTP("enable")}>
        Enable OTP
      </Button>
      <Button disabled={!user?.otp_active} onClick={() => toggleOTP("disable")}>
        Disable OTP
      </Button>
    </div>
  );
}
