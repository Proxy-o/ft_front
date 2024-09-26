"use client";
import React from "react";
import useToggleOTP from "./hooks/useToggleOTP";
import useGetUser from "../hooks/useGetUser";
import EditProfileForm from "../components/editProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QrCode } from 'lucide-react';

export default function Page() {
  const { data: user, isSuccess } = useGetUser("0");
  const { mutate: toggleOTP, isSuccess: switched } = useToggleOTP( "0");
  
  return (
    <Card className="gap-4 h-[calc(100vh-7.8rem)] max-w-[60rem] flex flex-col items-center p-4 mx-2 overflow-auto md:scrollbar scrollbar-thumb-primary/10 scrollbar-w-2 no-scrollbar">
      <Card className="flex justify-between items-center max-h-[200px] min-h-[64px] max-w-lg w-full px-4 overflow-x-auto no-scrollbar">
        <div className="flex justify-start space-x-2">
          <p>One Time Passsword</p>
          {isSuccess && user && user.otp_active && (
            
            <Dialog defaultOpen={switched}>
                <DialogTrigger className="flex items-center space-x-2 ">
                  <QrCode className="min-h-2 min-w-2 hover:bg-primary"></QrCode>
                </DialogTrigger>
              <DialogContent className="size-fit overflow-hidden">
                <DialogHeader className="m-auto">
                  Scan the QRCode
                </DialogHeader>
                <Avatar className="m-auto size-36 sm:size-48 md:size-64">
                  <AvatarImage
                    src={user?.qr_code}
                    alt="QR Code"
                    className="rounded-sm size-36 sm:size-48 md:size-64"
                  />
                  <AvatarFallback className="rounded-sm size-4 text-xs">QR</AvatarFallback>
                </Avatar>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <Switch
          defaultChecked={user?.otp_active}
          onCheckedChange={(checked: boolean) => toggleOTP(checked ? "enable" : "disable")}
        />
      </Card>
      {isSuccess && <EditProfileForm user={user} />}
    </Card>
  );
}
