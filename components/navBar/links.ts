import { LucideIcon } from "lucide-react";
import { User, GamepadIcon, Send, Users } from "lucide-react";

interface linksProps {
  title: string;
  link: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
}
export const links: linksProps[] = [
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
    title: "Friends",
    link: "/friends",
    icon: Users,
    variant: "ghost",
  },
];
