"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import useEditUser from "../hooks/useEditUser";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { QrCode } from 'lucide-react';
import useToggleOTP from "../settings/hooks/useToggleOTP";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EditProfileForm({ user }: { user: User }) {
  const [userInfo, setUserInfo] = useState<User>(user);
  const { mutate: editUser } = useEditUser();
  const { mutate: toggleOTP, isSuccess: switched } = useToggleOTP("0");

  return (
    <Dialog>
      <Card className="bg-none w-full">
        <CardHeader className="text-center">Edit profile</CardHeader>
        <br />
        <CardContent className="flex flex-col  justify-center gap-3  w-full">
          <div className="flex flex-wrap md:flex-nowrap gap-3">
            <div className="space-y-2 w-full">
              <Label htmlFor="first-name">First name</Label>
              <Input
                defaultValue={user.first_name}
                id="first-name"
                placeholder="Enter your first name"
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    first_name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                defaultValue={user.last_name}
                id="last-name"
                placeholder="Enter your last name"
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    last_name: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-3">
            <div className="space-y-2 w-full">
                <Label htmlFor="username">Username</Label>
                <Input
                  defaultValue={user.username}
                  id="username"
                  placeholder="Enter your username"
                  onChange={(e) =>
                    setUserInfo({
                      ...userInfo,
                      username: e.target.value,
                    })
                  }
                />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Input
                defaultValue={user.email}
                id="email"
                placeholder="Enter your email"
                type="email"
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-3">
            <div className="space-y-2 w-full">
              <Label htmlFor="email">password</Label>
              <Input
                defaultValue={user.password}
                id="password"
                placeholder="Enter Your New Password"
                type="password"
                onChange={(e) =>
                  setUserInfo({
                    ...userInfo,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="email">One Time Passsword</Label>
              <div className="flex justify-between items-center w-full h-10 px-2 rounded-lg border">
                <div className="flex space-x-2">
                  <p>{user.otp_active ? "Enabled" : "Disabled"}</p>
                  {user && user.otp_active && (
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
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
        <DialogClose
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "ml-auto w-32"
            )}
            onClick={() => editUser(userInfo)}
          >
            Save
        </DialogClose>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
