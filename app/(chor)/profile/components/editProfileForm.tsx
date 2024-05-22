"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import useEditUser from "../hooks/useEditUser";

export default function EditProfileForm({ user }: { user: User }) {
  const [userInfo, setUserInfo] = useState<User>(user);
  const { mutate: editUser } = useEditUser();
  return (
    <Dialog>
      <Card className="bg-none w-full max-w-lg border p-2">
        <CardHeader className="text-center">Edit profile</CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
          <div className="space-y-2">
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
          <div className="space-y-2">
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
          <div className="space-y-2">
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
          <div className="space-y-2">
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
        </CardContent>
        <CardFooter>
          <DialogClose
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "ml-auto"
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
