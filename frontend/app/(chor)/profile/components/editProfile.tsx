import React from "react";
import {
  Dialog,
  DialogContent,
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
        <DialogContent className="p-0 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-7.8rem)] overflow-auto md:scrollbar scrollbar-thumb-primary/20 scrollbar-w-2 no-scrollbar rounded-md">
          <EditProfileForm user={user} />
        </DialogContent>
      </Dialog>
    )
  );
}
