import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function MainSkel() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="flex flex-col gap-4 border rounded-full h-20  w-20 bg-slate-300 " />
      <div className="flex gap-2 ">
        <Skeleton className="flex flex-col gap-4 border h-20  w-80 bg-slate-300" />
        <Skeleton className="flex flex-col gap-4 border h-20  w-80 bg-slate-300" />
        <Skeleton className="flex flex-col gap-4 border h-20  w-80 bg-slate-300" />
      </div>
      <Skeleton className="flex flex-col gap-4 border h-96  w-full bg-slate-300" />
      <Skeleton className="flex flex-col gap-4 border h-32  w-full bg-slate-300" />
      <Skeleton className="flex flex-col gap-4 border h-96  w-full bg-slate-300" />
      <Skeleton className="flex flex-col gap-4 border h-12  w-full bg-slate-300" />
    </div>
  );
}
