import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function NavSkel() {
  return (
    <div className="group flex flex-col gap-4 py-2 h-screen  w-32 mr-2">
      <Skeleton className="flex flex-col gap-4 border h-8 bg-slate-300" />
      <Skeleton className="flex flex-col gap-4 border h-8 bg-slate-300" />
      <Skeleton className="flex flex-col gap-4 border h-8 bg-slate-300" />
      <Skeleton className="flex flex-col gap-4 border h-8 bg-slate-300" />
      <Skeleton className="flex flex-col gap-4 border h-8 bg-slate-300" />
      <Skeleton className="flex flex-col gap-4 border h-8 bg-slate-300" />
    </div>
  );
}
