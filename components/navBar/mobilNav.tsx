"use client";
import Link from "next/link";
import {
  LogOut,
  UserRoundCog,
  Sun,
  Moon,
  User as UserIcon,
  GamepadIcon,
  Send,
  Users,
  UserPlus2,
  MessageCircle,
  AlignRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import useLogout from "@/app/(auth)/login/hooks/useLogout";
import { useEffect, useState } from "react";
import getCookie from "@/lib/functions/getCookie";
import useWebSocket from "react-use-websocket";
import { linksProps } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/lib/types";
import useGetFriends from "@/app/(chor)/chat/hooks/useGetFriends";
import { LastMessage } from "@/app/(chor)/chat/types";
import useGetFrdReq from "@/app/(chor)/friends/hooks/useGetFrReq";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MobilNav() {
  const [popOverOpen, setPopOverOpen] = useState(false);
  const { mutate: logout } = useLogout();
  const { theme, setTheme } = useTheme();
  const [notification, setNotification] = useState(false);
  const path = usePathname();

  const links: linksProps[] = [
    {
      title: "Play",
      link: "/game",
      icon: GamepadIcon,
      variant: "ghost",
    },
    {
      title: "Profile",
      link: "/profile",
      icon: UserIcon,
      variant: "ghost",
    },
    {
      title: "chat",
      link: "/chat",
      icon: Send,
      variant: "ghost",
    },

    {
      title: "Friends",
      link: "/friends",
      icon: Users,
      variant: "ghost",
    },
    {
      title: "Requests",
      link: "/friend_requests",
      icon: UserPlus2,
      variant: "ghost",
    },
  ];
  const activeLink = links.findIndex((link) => link.link === path);
  links[activeLink] = {
    ...links[activeLink],
    variant: "default",
  };

  const token = getCookie("refresh");
  const id = getCookie("user_id");
  const socketUrl = process.env.NEXT_PUBLIC_CHAT_URL + "2/?refresh=" + token;

  const { lastJsonMessage }: { lastJsonMessage: LastMessage } =
    useWebSocket(socketUrl);
  const [showNotif, setShowNotif] = useState(false);
  const [reqNotif, setReqNotif] = useState(false);
  const { data: friends, isSuccess: isSuccessFriends } = useGetFriends(
    id ? id : "0"
  );
  const { data: requests, isSuccess: isSuccessReq } = useGetFrdReq();
  const queryClient = useQueryClient();

  useEffect(() => {
    setReqNotif(false);
    if (lastJsonMessage?.type === "request") {
      let id = lastJsonMessage.id;
      toast(
        <Link className="w-full text-center" href={`/profile/${id}`}>
          {"You have a new friend request from " + lastJsonMessage.user}
        </Link>
      );
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      lastJsonMessage.type = "null";
    }
    if (isSuccessReq && requests) {
      requests.forEach((request: any) => {
        if (request.to_user.id.toString() === id) setReqNotif(true);
      });
    }
  }, [isSuccessReq, requests, id, lastJsonMessage, queryClient]);

  useEffect(() => {
    if (lastJsonMessage?.type === "private_message") {
      queryClient.invalidateQueries({
        queryKey: ["friends", id],
      });
      if (path !== "/chat")
        toast(
          <Link
            href={`/profile/${lastJsonMessage.id}`}
            className="w-full justify-between flex gap-2 text-lg"
          >
            {"New message from " + lastJsonMessage.user}
            <MessageCircle className="h-6 w-6 text-green-400" />
          </Link>
        );
      lastJsonMessage.type = "null";
    }
    if (isSuccessFriends && friends) {
      setShowNotif(false);
      friends.forEach((friend: User) => {
        if (friend.has_unread_messages) {
          setShowNotif(true);
          return;
        }
      });
    }
  }, [isSuccessFriends, friends, lastJsonMessage, queryClient, id, showNotif]);

  const handleLogout = () => {
    logout();
  };
  if (token)
    return (
      <div className=" bottom-0  w-full overflow-auto h-18 ">
        <nav className=" h-full  flex justify-center w-full items-center gap-2 p-2 border-t-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.link}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),

                "justify-start "
              )}
            >
              {link.title === "chat" && showNotif ? (
                <div className="relative">
                  <link.icon className=" size-5 " />
                  <span className="h-3 w-3 bg-white rounded-full absolute top-0 right-0 "></span>
                  <span className="h-1 w-1 bg-primary rounded-full absolute top-1 right-1 animate-ping"></span>
                </div>
              ) : link.title === "Play" && notification ? (
                <div className="relative">
                  <link.icon className=" size-5 " />
                  <span className="h-3 w-3 bg-white rounded-full absolute top-0 right-0 "></span>
                  <span className="h-1 w-1 bg-primary rounded-full absolute top-1 right-1 animate-ping "></span>
                </div>
              ) : link.title === "Requests" && reqNotif ? (
                <div className="relative">
                  <link.icon className=" size-5 " />
                  <span className="h-3 w-3 bg-white rounded-full absolute top-0 right-0 "></span>
                  <span className="h-1 w-1 bg-primary rounded-full absolute top-1 right-1 animate-ping"></span>
                </div>
              ) : (
                <link.icon
                  className={cn(
                    " mr-2 size-5 hover:scale-150",
                    link.variant === "default" ? "scale-125" : ""
                  )}
                />
              )}
            </Link>
          ))}
          <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
            <PopoverTrigger>
              <AlignRight />
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div
                className="flex flex-col px-2"
                onClick={() => setPopOverOpen(false)}
              >
                <Link
                  href="/profile/settings"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "justify-start mb-2"
                  )}
                >
                  <UserRoundCog className="mr-2 h-6 w-6 " />
                  Sittings
                </Link>
                <Button
                  variant={"ghost"}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "justify-start mb-2"
                  )}
                  onClick={() => handleLogout()}
                >
                  <LogOut className="mr-2 h-6 w-6 " />
                  logout
                </Button>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "justify-start text-primary mb-2"
                  )}
                >
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-6 w-6 " />
                  ) : (
                    <Moon className="mr-2 h-6 w-6 " />
                  )}
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </nav>
      </div>
    );
}