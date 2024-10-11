"use client";
import React from "react"
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeButton: React.FC = () => {

    const {theme, setTheme} = useTheme();
    return (
        <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="ghost"
            className="absolute m-0 right-3 top-1 text-primary hover:text-primary-foreground rounded-full"
        >
            {theme === "dark" ? (
                <Sun className="size-6" />
            ) : (
                <Moon className="size-6" />
            )}
        </Button>
    )
}

export default ThemeButton;