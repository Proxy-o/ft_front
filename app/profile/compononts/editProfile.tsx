import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SquarePen } from "lucide-react";

import { CardContent, CardFooter, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import useEditUser from "../hooks/useEditUser";
import { User } from "@/lib/types";
import { UserContext } from "@/lib/providers/UserContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function EditProfile({ user }: { user: User }) {
  const [userInfo, setUserInfo] = useState<User>(user);
  const { mutate: editUser } = useEditUser();

  const handleSubmit = () => {
    editUser(userInfo);
  };

  return (
    user && (
      <Dialog>
        <DialogTrigger className="absolute top-3 right-3 z-50 flex items-center hover:bg-secondary p-2 rounded-md text-zinc-400 hover:text-zinc-200">
          Edit
          <SquarePen className="ml-2" size={15} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center mb-4">Edit profile</DialogTitle>
          </DialogHeader>
          <div className="bg-none w-full max-w-lg">
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
            </CardContent>
            <CardFooter>
              <DialogClose
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "ml-auto"
                )}
                onClick={handleSubmit}
              >
                Save
              </DialogClose>
            </CardFooter>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
