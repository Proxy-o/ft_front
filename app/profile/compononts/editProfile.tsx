import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SquarePen } from "lucide-react";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function EditProfile() {
  return (
    <Dialog>
      <DialogTrigger className="absolute top-3 right-3 z-50 flex items-center hover:bg-secondary p-2 rounded-md text-zinc-400 hover:text-zinc-200">
        Edit
        <SquarePen className="ml-2" size={15} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Edit profile</DialogTitle>
          <DialogDescription className="text-center">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-none w-full max-w-lg">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Enter your first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Enter your last name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" type="email" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">Save</Button>
          </CardFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
