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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { buttonVariants } from "./ui/button";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

interface linksProps {
  title: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
}

export default function Nav() {
  const links: linksProps[] = [
    {
      title: "login",
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
  const isCollapsed = useMediaQuery("(max-width: 768px)");
  const path = usePathname();

  // remove the first slash

  const activeLink = links.findIndex((link) => link.title === path.slice(1));
  // set the variant of the active link to default
  links[activeLink] = {
    ...links[activeLink],
    variant: "default",
  };
  const { theme, setTheme } = useTheme();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 h-screen shadow-lg md:w-[8.5rem]"
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
                      "h-10 w-10 mb-2 "
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

                "justify-start mb-2"
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
                    "h-9 w-9 mb-2"
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
                    "h-9 w-9 mb-2"
                  )}
                >
                  <LogOut className="h-6 w-6" />
                  <span className="sr-only ">Logout</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                Logout
              </TooltipContent>
            </Tooltip>
            <TooltipProvider delayDuration={0}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "h-9 w-9 mb-2"
                    )}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-6 w-6" />
                    ) : (
                      <Moon className="h-6 w-6" />
                    )}
                    <span className="sr-only">
                      {theme === "dark" ? "Light" : "Dark"}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {theme === "dark" ? "Light" : "Dark"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TooltipProvider>
        </div>
      ) : (
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
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "justify-start mb-2"
            )}
          >
            <LogOut className="mr-2 h-6 w-6 " />
            logout
          </Link>
          {/* add shose them them */}
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
      )}
    </div>
  );
}
