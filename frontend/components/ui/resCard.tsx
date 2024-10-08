import React from "react";
import { Card } from "./card";

export default function ResCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="h-[calc(100vh-7.8rem)] md:h-[calc(100vh-4.5rem)] overflow-auto  w-full flex flex-col ]  feedBot no-scrollbar">
      {children}
    </Card>
  );
}
