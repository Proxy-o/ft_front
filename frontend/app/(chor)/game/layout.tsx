import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-primary/10 to-background/20  ">
      {children}
    </div>
  );
}
