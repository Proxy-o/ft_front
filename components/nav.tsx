import Link from "next/link";
import { LogOut, LucideIcon, UserRoundCog } from "lucide-react";
import {
  Archive,
  User,
  Home,
  GamepadIcon,
  Send,
  Users,
  Sun,
  Moon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "./ui/button";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import useLogout from "@/app/login/hooks/useLogout";
import { useEffect, useState } from "react";
import getCookie from "@/lib/functions/getCookie";
import useWebSocket from "react-use-websocket";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { toast } from "sonner";
import useGetUser from "@/app/profile/hooks/useGetUser";

interface linksProps {
  title: string;
  link: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
}

let lastInvitation: MessageEvent<any> | null = null;
export default function Nav() {
  const { mutate: logout } = useLogout();
  const { theme, setTheme } = useTheme();
  const { newNotif } = useGameSocket();
  const [notification, setNotification] = useState(false);
  const isCollapsed = useMediaQuery("(max-width: 768px)");
  const path = usePathname();

  const links: linksProps[] = [
    {
      title: "login",
      link: "/login",
      icon: Home,
      variant: "ghost",
    },
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
      icon: User,
      variant: "ghost",
    },
    {
      title: "Archive",
      link: "/archive",
      icon: Archive,
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
  };

  const token = getCookie("refresh");
  const id = getCookie("user_id");
  const socketUrl = process.env.NEXT_PUBLIC_CHAT_URL + "2/?refresh=" + token;
  const { lastMessage } = useWebSocket(socketUrl);
  const { data: user, isSuccess } = useGetUser(id ? id : "0");

  useEffect(() => {
    if (newNotif()) {
      setNotification(true);
      const notif = newNotif();
      const message = (notif && JSON.parse(notif?.data)) || "";
      if (message && message.message?.split(" ")[0] === "/notif") {
        toast.info("you have a new invitation");
        lastInvitation = newNotif();
      }
    }
  }, [newNotif()?.data]);

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
            {link.title === "chat" && isSuccess && user.unread_messages ? (
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
