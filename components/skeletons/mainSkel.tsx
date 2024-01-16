import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function MainSkel() {
  return (
    <div className="flex flex-col gap-2 justify-center w-full p-8">
      <Skeleton className="flex flex-col gap-4 border rounded-full h-20  w-20 bg-secondary " />
      <div className="flex gap-2 justify-center">
        <Skeleton className="flex flex-col gap-4 border h-20  w-80 bg-secondary" />
        <Skeleton className="flex flex-col gap-4 border h-20  w-80 bg-secondary" />
        <Skeleton className="flex flex-col gap-4 border h-20  w-80 bg-secondary" />
      </div>
      <Skeleton className="flex flex-col gap-4 border h-96  w-full bg-secondary" />
      <Skeleton className="flex flex-col gap-4 border h-32  w-full bg-secondary" />
      <Skeleton className="flex flex-col gap-4 border h-96  w-full bg-secondary" />
      <Skeleton className="flex flex-col gap-4 border h-12  w-full bg-secondary" />
    </div>
  );
}
