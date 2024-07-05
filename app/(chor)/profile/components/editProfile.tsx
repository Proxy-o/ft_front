import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SquarePen } from "lucide-react";
import { User } from "@/lib/types";
import EditProfileForm from "./editProfileForm";

export default function EditProfile({ user }: { user: User }) {
  return (
    user && (
      <Dialog>
        <DialogTrigger className="absolute top-3 right-3 z-40 flex items-center bg-secondary p-2 rounded-md  ">
          Edit
          <SquarePen className="ml-2" size={15} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center mb-4">Edit profile</DialogTitle>
          </DialogHeader>
          <EditProfileForm user={user} />
        </DialogContent>
      </Dialog>
    )
  );
}
