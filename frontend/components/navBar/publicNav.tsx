"use client";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PublicNav: React.FC<{path: string}> = ({ path }) => {
    const { theme, setTheme } = useTheme();
    const links = [
        { name: "Home", href: "/" },
        { name: "Game", href: "/game/local" },
        { name: "Login", href: "/login" },
        { name: "Register", href: "/register" },
    ]
    return (
    <div className="flex flex-row justify-between w-full">
        <div>
            { path != "/" && links.filter(l => l.href != path).map((l, k) =>  (
                <Link key={k} href={l.href} className={cn(buttonVariants({variant: "link"}), "hover:text-secondary-foreground")}>
                    {l.name}
                </Link>
            ))}
        </div>
        <Button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        variant="ghost"
        className="text-primary hover:text-secondary-foreground rounded-full mx-4"
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