import React from "react";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-[calc(100vh-7.8rem)] md:h-full mx-2 overflow-auto md:scrollbar scrollbar-thumb-primary/10 scrollbar-w-2 no-scrollbar">
      {children}
    </div>
  );
}
