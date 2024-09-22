import React from "react";
import { Skeleton } from "../ui/skeleton";

function TableColumn() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="flex flex-col gap-4 border rounded-sm h-10  w-40 bg-secondary " />
      <Skeleton className="flex flex-col gap-4 border rounded-sm h-10  w-40 bg-secondary " />
      <Skeleton className="flex flex-col gap-4 border rounded-sm h-10  w-40 bg-secondary " />
      <Skeleton className="flex flex-col gap-4 border rounded-sm h-10  w-40 bg-secondary " />
    </div>
  );
}

export default function ProfileSkel() {
  return (
    <div className="space-y-2 h-screen m-auto w-full">
      <div className="flex flex-col gap-2 justify-center w-full p-8">
        <div className="flex space-x-2">
          <Skeleton className="flex flex-col gap-4 border rounded-sm h-40  w-40 bg-secondary " />
          <div className="space-y-2">
            <Skeleton className="flex flex-col gap-4 border rounded-sm h-10  w-80 bg-secondary " />
            <Skeleton className="flex flex-col gap-4 border rounded-sm h-10  w-40 bg-secondary " />
          </div>
        </div>
        <Skeleton className="flex flex-col gap-4 border rounded-sm w-full h-20 bg-secondary " />
      </div>
      <div className="flex flex-col gap-2 justify-center w-full p-8">
        {/* states table skel */}
        <Skeleton className="flex flex-col gap-4 border rounded-sm w-full h-20 bg-secondary " />
        <div className="flex space-x-2">
          {
            // table columns 4 times
            [1, 2, 3].map((i) => (
              <TableColumn key={i} />
            ))
          }
        </div>
      </div>
    </div>
  );
}
