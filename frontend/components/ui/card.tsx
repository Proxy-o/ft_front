import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "rounded-lg  border text-card-foreground bg-gray-300 dark:bg-black dark:bg-opacity-50 overflow-auto",
      className
    )}
    ref={ref}
    style={{
      borderBottom: "2px solid transparent",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderImage:
        "linear-gradient(to right, rgba(0,0,0, 0),rgba(0,0,0, 0),rgba(6,182,212),rgba(6,182,212),rgba(6,182,212),rgba(168,85,247),rgba(168,85,247) ,rgba(168,85,247) ,rgba(0,0,0, 0),rgba(0,0,0, 0))",
      borderImageSlice: "1",
    }}
    {...props}
  >
    {/* <div className="fixed bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 rounded-t-lg"></div> */}
    {/* <div className="absolute top-0 left-0 w-[1px] h-full bg-cyan-500"></div>
    <div className="absolute top-0 right-0 w-[1px] h-full bg-purple-500"></div> */}
    {props.children}
  </div>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
