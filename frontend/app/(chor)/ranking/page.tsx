"use client";
import React from "react";
import useGetUser from "../profile/hooks/useGetUser";
import ResCard from "@/components/ui/resCard";
import Link from "next/link";
import { Medal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import useGetGlobalState from "./hooks/useGetGlobalState";

type GllobalState = {
  id: string;
  username: string;
  avatar: string;
  wins: number;
  losses: number;
  score: number;
};

export default function Page() {
  const { data: user } = useGetUser("0");
  const { data: globalState, isSuccess: globalStateIsSuccess } = useGetGlobalState();
  return (
    user && (
      <ResCard>
        <Table className="relative -mx-1 sm:mx-0">
          <TableHeader className="sticky top-0 bg-secondary">
            <TableRow>
              <TableHead className="w-fit">Rank</TableHead>
              <TableHead className="max-w-full">Player</TableHead>
              <TableHead className="w-fit">Wins</TableHead>
              <TableHead className="w-fit">Losses</TableHead>
              <TableHead className="w-fit">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {globalStateIsSuccess && 
              globalState?.map((u: GllobalState, i: number) => (
                <TableRow
                  className={`${i % 2 === 0 && "bg-secondary/50"}`}
                  key={i}
                >
                  <TableCell
                    className={`flex items-center justify-center gap-1 h-16 ${
                      i === 0
                      ? "bg-yellow-500/50 text-4xl"
                      : i === 1
                      ? "bg-slate-400/50 text-3xl"
                      : i === 2
                      ? "bg-amber-600/50 text-2xl" : ""
                    }`}
                  >
                    {i + 1}
                    {i < 3 ? <Medal /> : " #"}
                  </TableCell>
                  <TableCell
                    className={`${u.id === user.id && "bg-primary/40"}`}
                  >
                    <Link
                      className="flex justify-center sm:justify-start items-center gap-2"
                      href={`profile/${u.id}`}
                    >
                      <Avatar className="rounded-full size-8">
                        <AvatarImage
                          src={u.avatar}
                          alt="profile image"
                          className="rounded-full"
                        />
                        <AvatarFallback className="rounded-full">
                          PF
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-zinc-700 hidden sm:block dark:text-zinc-50 text-ellipsis whitespace-nowrap	overflow-hidden">
                        {u.username}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    {u.wins}
                  </TableCell>
                  <TableCell className="text-center text-red-600">
                    {u.losses}
                  </TableCell>
                  <TableCell className="text-center text-yellow-600">
                    {u.score}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {!globalState?.length && <TableCaption className="text-center mx-auto">No Records yet!</TableCaption>}
        </Table>
      </ResCard>
    )
  );
}
