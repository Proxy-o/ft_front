"use client";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Home, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STYLES: readonly [ string ] = [
    "hover:text-secondary-foreground hover:scale-105 transition duration-1000 ease-out"
]

const PublicNav: React.FC<{path: string}> = ({ path }) => {
    const { theme, setTheme } = useTheme();

    return (
    <div className="flex flex-row justify-between w-full">
        <div>
            {   
                path !== "/" &&
                <Link key={0} href="/" className={cn(buttonVariants({variant: "link"}), STYLES[0])}>
                    <Home size={24} strokeWidth={1.5} />
                </Link>
            }
        </div>
        <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="link"
            className={STYLES[0]}
        >
            {theme === "dark" ? (
                <Sun className="size-6" />
            ) : (
                <Moon className="size-6" />
            )}
        </Button>
    </div>
    );
};

export default PublicNav;
