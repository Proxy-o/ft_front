import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

const GameNav = ({ setTab, tab }: { setTab: Dispatch<SetStateAction<string>>, tab: string }) => {
    return (
        <>
            <nav className="mx-auto mt-2 w-fit h-fit flex flex-row justify-start items-start dark:text-white gap-2">
                <Button className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "justify-start mb-2 hover:bg-primary",
                    tab === 'online' ? 'bg-primary' : 'bg-black'
                    )}
                    onClick={() => setTab("online")}>
                    
                    Play Online
                </Button>

                <Button className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "justify-start mb-2 hover:bg-primary",
                    tab === 'local' ? 'bg-primary' : 'bg-black'
                    )}
                    onClick={() => setTab("local")}>
                        Play Local
                </Button>
                <Button className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "justify-start mb-2 hover:bg-primary",
                    tab === 'four' ? 'bg-primary' : 'bg-black'
                    )}
                    onClick={() => setTab("four")}>
                        Four Players
                </Button>
                <Button className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "justify-start mb-2 hover:bg-primary",
                    tab === 'tournament' ? 'bg-primary' : 'bg-black'
                    )}
                    onClick={() => setTab("tournament")}>
                        Tournament
                </Button>
            </nav>
            <Separator className="w-full" />
        </>
    );
}

export default GameNav;