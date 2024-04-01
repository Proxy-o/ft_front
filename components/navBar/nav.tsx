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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import useLogout from "@/app/login/hooks/useLogout";
import { useEffect, useRef, useState } from "react";
import getCookie from "@/lib/functions/getCookie";
import useWebSocket from "react-use-websocket";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { toast } from "sonner";
import useGetUser from "@/app/profile/hooks/useGetUser";
import { linksProps } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/lib/types";
import useGetFriends from "@/app/chat/hooks/useGetFriends";
import { LastMessage } from "@/app/chat/types";

export default function Nav() {
  const { mutate: logout } = useLogout();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [notification, setNotification] = useState(false);
  const isCollapsed = useMediaQuery("(max-width: 768px)");
  const path = usePathname();

  const links: linksProps[] = [
    {
      title: "Play",
      link: "/game",
      icon: GamepadIcon,
      variant: "ghost",
    },
    {
      title: "chat",
      link: "/chat",
      icon: Send,
      variant: "ghost",
    },
    {
      title: "Profile",
      link: "/profile",
      icon: UserIcon,
      variant: "ghost",
    },

    {
      title: "Friends",
      link: "/friends",
      icon: Users,
      variant: "ghost",
    },
  ];
  const activeLink = links.findIndex((link) => link.link === path);
  links[activeLink] = {
    ...links[activeLink],
    variant: "default",
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const token = getCookie("refresh");
  const id = getCookie("user_id");
  const socketUrl = process.env.NEXT_PUBLIC_CHAT_URL + "2/?refresh=" + token;
  const { lastJsonMessage }: { lastJsonMessage: LastMessage } =
    useWebSocket(socketUrl);
  const [showNotif, setShowNotif] = useState(false);
  const { data: friends, isSuccess: isSuccessFriends } = useGetFriends(
    id ? id : "0"
  );

  const queryClient = useQueryClient();
  useEffect(() => {
    if (lastJsonMessage) {
      queryClient.invalidateQueries({
        queryKey: ["friends", id],
      });
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

  if (token)
    return (
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 h-screen shadow-lg md:w-[8.5rem] "
      >
        <nav className="flex flex-col gap-1 px-2 h-full ">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.link}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),

                "justify-start mb-2"
              )}
            >
              {link.title === "chat" && showNotif ? (
                <div className="relative">
                  <link.icon className=" h-6 w-6 " />
                  <span className="h-3 w-3 bg-white rounded-full absolute top-0 right-0 "></span>
                  <span className="h-1 w-1 bg-primary rounded-full absolute top-1 right-1 "></span>
                </div>
              ) : link.title === "Play" && notification ? (
                <div className="relative">
                  <link.icon className=" h-6 w-6 " />
                  <span className="h-3 w-3 bg-white rounded-full absolute top-0 right-0 "></span>
                  <span className="h-1 w-1 bg-primary rounded-full absolute top-1 right-1 "></span>
                </div>
              ) : (
                <link.icon className=" mr-2 h-6 w-6 " />
              )}
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col px-2">
          <Link
            href="#"
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
      </div>
    );
}
