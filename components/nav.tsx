import Link from "next/link";
import { LogOut, LucideIcon, UserRoundCog } from "lucide-react";
import {
  Archive,
  ArchiveX,
  User,
  Home,
  GamepadIcon,
  Send,
  Trash2,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { buttonVariants } from "./ui/button";
import { useEffect, useState } from "react";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { usePathname } from "next/navigation";

interface linksProps {
  title: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
}

export default function Nav() {
  const links: linksProps[] = [
    {
      title: "home",
      icon: Home,
      variant: "ghost",
    },
    {
      title: "Play",
      icon: GamepadIcon,
      variant: "ghost",
    },
    {
      title: "Sent",
      icon: Send,
      variant: "ghost",
    },
    {
      title: "Profile",
      icon: User,
      variant: "ghost",
    },
    {
      title: "Archive",
      icon: Archive,
      variant: "ghost",
    },
    {
      title: "Friends",
      icon: Users,
      variant: "ghost",
    },
  ];
  const isCollapsed = useMediaQuery("(max-width: 822px)");
  const path = usePathname();

  // remove the first slash

  const activeLink = links.findIndex((link) => link.title === path.slice(1));
  // set the variant of the active link to default
  links[activeLink] = {
    ...links[activeLink],
    variant: "default",
  };
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 h-screen shadow-lg "
    >
      <nav className="flex flex-col gap-1 px-2 h-full ">
        {links.map((link, index) =>
          isCollapsed ? (
            <TooltipProvider key={index} delayDuration={0}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.title}
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-10 w-10 ",
                      link.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <link.icon className="h-6 w-6" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              <link.icon className="mr-2 h-6 w-6 " />
              {link.title}
            </Link>
          )
        )}
      </nav>
      {isCollapsed ? (
        <div className="flex flex-col gap-1 px-2  ">
          <TooltipProvider delayDuration={0}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-9 w-9"
                  )}
                >
                  <UserRoundCog className="h-6 w-6" />
                  <span className="sr-only">Sittings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                Sittings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-9 w-9"
                  )}
                >
                  <LogOut className="h-6 w-6" />
                  <span className="sr-only">Logout</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                Logout
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <div className="flex flex-col">
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),

              "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              "justify-start"
            )}
          >
            <UserRoundCog className="mr-2 h-6 w-6 " />
            Sittings
          </Link>
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),

              "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              "justify-start"
            )}
          >
            <LogOut className="mr-2 h-6 w-6 " />
            logout
          </Link>
        </div>
      )}
    </div>
  );
}
