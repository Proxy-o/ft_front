"use client";

import OneOffline from "./oneOffline";
import { Card } from "@/components/ui/card";

export default function Page() {
  return (
    <Card className="w-11/12 max-w-[900px] flex flex-col justify-center items-start pb-8 mx-auto mt-12 gap-2 p-4">
      <h1 className="text-4xl m-auto">Ping Pong</h1>
      <OneOffline />
    </Card>
  );
}
