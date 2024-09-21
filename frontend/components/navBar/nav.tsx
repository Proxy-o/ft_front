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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
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
import useGetInvitations from "@/app/(chor)/game/hooks/useGetInvitations";
import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import useChatSocket from "@/app/(chor)/game/hooks/sockets/useChatSocket";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";

export default function Nav() {
  const { mutate: logout } = useLogout();
  const { theme, setTheme } = useTheme();
  const path = usePathname();
  const router = useRouter();

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

  const logged_in = getCookie("logged_in");

  useEffect(() => {
    if (
      logged_in != "yes" &&
      path != "/login" &&
      path != "/register" &&
      path != "/game/local"
    ) {
      return logout();
    }
  }, [logged_in, router, logout, path]);
  const { data: user, isSuccess } = useGetUser("0");

  const {
    lastJsonMessage,
    readyState,
  }: {
    lastJsonMessage: LastMessage;
    readyState: number;
  } = useChatSocket();

  useEffect(() => {
    if (readyState === 3 && isSuccess) {
      logout();
    }
  }, [lastJsonMessage, readyState, logout, isSuccess]);

  const { lastJsonMessage: invitationLastMessage }: { lastJsonMessage: any } =
    useInvitationSocket();

  const [showNotif, setShowNotif] = useState(false);
  const [reqNotif, setReqNotif] = useState(false);
  const { data: friends, isSuccess: isSuccessFriends } = useGetFriends(
    user?.id
  );
  const { data: requests, isSuccess: isSuccessReq } = useGetFrdReq();
  const queryClient = useQueryClient();
  const [gameNotif, setGameNotif] = useState(false);
  const { data: invitations, isSuccess: isSuccessInvit } = useGetInvitations(
    user?.id
  );

  useEffect(() => {
    setGameNotif(false);
    const parsedMessage = invitationLastMessage?.message;
    const sender = invitationLastMessage?.user;

    if (parsedMessage) {
      const message = parsedMessage.split(" ");
      if (message[0] === "/notif") {
        if (!path.startsWith("/game")) {
          toast(`${sender} Has invite you to play`, {
            icon: <GamepadIcon className="mr-2" />,
            action: {
              label: `Play`,
              onClick: () => router.push(`/game`),
            },
          });
        }
      }
      queryClient.invalidateQueries({
        queryKey: ["invitations", user?.id],
      });
      invitationLastMessage.message = "";
    }
    if (isSuccessInvit && invitations) {
      invitations.forEach((invitation: any) => {
        if (invitation.receiver.id.toString() == user?.id) setGameNotif(true);
      });
    }
  }, [
    invitations,
    user?.id,
    isSuccessInvit,
    queryClient,
    router,
    path,
    invitationLastMessage,
  ]);

  useEffect(() => {
    if (lastJsonMessage?.type === "friendUpdate") {
      queryClient.invalidateQueries({
        queryKey: ["friends", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["invitations", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["blocked"],
      });

      lastJsonMessage.type = "null";
    }
  }, [lastJsonMessage, queryClient, router, user?.id]);

  useEffect(() => {
    setReqNotif(false);
    if (lastJsonMessage?.type === "request") {
      let id = lastJsonMessage.id;
      if (path != "/friend_requests") {
        toast(`New friend request from ${lastJsonMessage.user}`, {
          icon: <UserPlus2 className="mr-2" />,
          action: {
            label: `View`,
            onClick: () => router.push(`/profile/${id}`),
          },
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["friends", user?.id],
      });
      // queryClient.invalidateQueries({
      //   queryKey: [""]
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      lastJsonMessage.type = "null";
    }
    if (isSuccessReq && requests) {
      requests.forEach((request: any) => {
        if (request.to_user.id.toString() == user?.id) setReqNotif(true);
      });
    }
  }, [
    isSuccessReq,
    requests,
    user?.id,
    lastJsonMessage,
    queryClient,
    router,
    path,
  ]);

  useEffect(() => {
    if (lastJsonMessage?.type === "private_message") {
      queryClient.invalidateQueries({
        queryKey: ["friends", user?.id],
      });
      if (!path.startsWith("/chat"))
        toast(`New message from ${lastJsonMessage.user}`, {
          icon: <MessageCircle className="mr-2" />,
          action: {
            label: "Messages",
            onClick: () => router.push(`/chat/${lastJsonMessage.id}`),
          },
        });

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
  }, [
    path,
    isSuccessFriends,
    friends,
    lastJsonMessage,
    queryClient,
    user?.id,
    showNotif,
    router,
  ]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className=" group flex flex-col gap-4 py-2 h-screen shadow-lg md:w-[8.5rem] ">
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
                <span className="h-1 w-1 bg-red-600 rounded-full absolute top-1 right-1 animate-ping"></span>
              </div>
            ) : link.title === "Requests" && reqNotif ? (
              <div className="relative">
                <link.icon className=" h-6 w-6 " />
                <span className="h-3 w-3 bg-white rounded-full absolute top-0 right-0 "></span>
                <span className="h-1 w-1 bg-red-600  rounded-full absolute top-1 right-1 animate-ping"></span>
              </div>
            ) : link.title === "Play" && gameNotif ? (
              <div className="relative">
                <link.icon className=" h-6 w-6 " />
                <span className="h-3 w-3 bg-white rounded-full absolute top-0 right-0 "></span>
                <span className="h-1 w-1 bg-red-600  rounded-full absolute top-1 right-1 animate-ping"></span>
              </div>
            ) : (
              <link.icon className=" mr-2 h-6 w-6 " />
            )}
            {link.title}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col px-2">
        <div>
          <Link
            href="/profile/settings"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "justify-start mb-2"
            )}
          >
            <UserRoundCog className="mr-2 h-6 w-6 " />
            Settings
          </Link>
          <Button
            variant={"ghost"}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "justify-start mb-2"
            )}
            onClick={() => handleLogout()}
          >
            <LogOut className="mr-2 h-6 w-6" />
            logout
          </Button>
        </div>
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
