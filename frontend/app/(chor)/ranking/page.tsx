"use client";
import React from "react";
import useGetUser from "../profile/hooks/useGetUser";
import ResCard from "@/components/ui/resCard";
import Link from "next/link";
import { Medal } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import  useGetGlobalState  from "./hooks/useGetGlobalState";


type GllobalState = {
  id: string;
  username: string;
  avatar: string;
  wins: number;
  losses: number;
  score: number;
}

export default function Page() {
  const { data: user } = useGetUser("0");
  const { data: globalState, isSuccess: globalStateIsSuccess } = useGetGlobalState();
  return (
    user && (
      <ResCard>
        <Table className="relative max-w-full -mx-1 md:mx-0">
          <TableHeader className="sticky top-0 bg-secondary">
            <TableRow>
              <TableHead className="w-fit">Rank</TableHead>
              <TableHead className="w-full">Name</TableHead>
              <TableHead className="w-fit">Wins</TableHead>
              <TableHead className="w-fit">Losses</TableHead>
              <TableHead className="w-fit">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {globalStateIsSuccess && globalState?.map((u: GllobalState, i: number) => (
              <TableRow className={`${i % 2 === 0 && "bg-secondary/50"} `} key={i}>
                <TableCell className={cn(
                  "flex items-center justify-center gap-1",
                  i === 0 ? "text-yellow-500 text-3xl" : i === 1 ? "text-slate-400 text-2xl" : i === 2 ? "text-amber-600 text-xl" : ""
                )}>{i + 1}<Medal className="size-4"/></TableCell>
                <TableCell >
                  <Link
                      className="flex items-center gap-2"
                      href={`profile/${u.id}`}
                    >
                      <Avatar className="rounded-full size-8">
                        <AvatarImage
                          src={u.avatar}
                          alt="profile image"
                          className="rounded-full"
                        />
                        <AvatarFallback className="rounded-full">PF</AvatarFallback>
                      </Avatar>
                      <p className="text-zinc-700 dark:text-zinc-50">
                        {u.username}
                      </p>
                    </Link>
                  </TableCell>
                <TableCell className="text-center text-green-600">{u.wins}</TableCell>
                <TableCell className="text-center text-red-600">{u.losses}</TableCell>
                <TableCell className="text-center text-yellow-600">{u.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ResCard>
    )
  );
}
