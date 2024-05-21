import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Flame, MinusSquare, PlusSquare } from "lucide-react";
import useGetGames from "../hooks/useGetGames";
import { Game } from "../types";
import useIsWinner from "../hooks/useIsWinner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

export default function GamesTable({ id }: { id: string }) {
  const { data: games, isSuccess } = useGetGames(id);
  const isWinner = useIsWinner();

  return (
    isSuccess && (
      <>
        <div className="p-4 relative">Completed games</div>
        <Card className="w-full">
          <Table>
            <TableHeader className="bg-secondary ">
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.length > 0 ? (
                games.map((game: Game, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      <Flame
                        className={cn(
                          game.winner?.id == id
                            ? "text-yellow-500"
                            : "text-red-500"
                        )}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex gap-2  items-center">
                        <div className=" flex items-center   ">
                          <Link
                            className="flex"
                            href={`/profile/${game.user1.id}`}
                          >
                            <Avatar className="  size-4">
                              <AvatarImage
                                src={game.user1.avatar}
                                alt="profile image"
                                className="rounded-full size-1"
                              />
                              <AvatarFallback className="rounded-sm size-4 text-xs bg-primary">
                                {game.user1.username.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <h1
                              className={cn(
                                game.user1.id == id &&
                                  (game.winner?.id == id
                                    ? "text-yellow-300 "
                                    : "text-red-300 "),
                                "w-fit"
                              )}
                            >
                              {game.user1.username}
                            </h1>
                          </Link>
                          <Link
                            className="flex"
                            href={`/profile/${game.user3?.id}`}
                          >
                            <Avatar className="  size-4">
                              <AvatarImage
                                src={game.user3?.avatar}
                                alt="profile image"
                                className="rounded-full size-1"
                              />
                              <AvatarFallback className="rounded-sm size-4 text-xs bg-primary">
                                {game.user3?.username.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <h1
                              className={cn(
                                game.user3?.id == id &&
                                  (game.winner?.id == id
                                    ? "text-yellow-300 "
                                    : "text-red-300 ")
                              )}
                            >
                              {game.user3?.username}
                            </h1>
                          </Link>
                        </div>
                        <h1 className="mr-3">VS</h1>
                        <div className=" flex items-center gap-1">
                          <Link
                            className="flex"
                            href={`/profile/${game.user2.id}`}
                          >
                            <Avatar className="  size-4">
                              <AvatarImage
                                src={game.user2.avatar}
                                alt="profile image"
                                className="rounded-full size-1"
                              />
                              <AvatarFallback className="rounded-sm size-4 text-xs bg-primary">
                                {game.user2.username.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <h1
                              className={cn(
                                game.user2.id == id &&
                                  (game.winner?.id == id
                                    ? "text-yellow-300 "
                                    : "text-red-300 ")
                              )}
                            >
                              {game.user2.username}
                            </h1>
                          </Link>
                          <Link
                            className="flex"
                            href={`/profile/${game.user4?.id}`}
                          >
                            <Avatar className="  size-4">
                              <AvatarImage
                                src={game.user4?.avatar}
                                alt="profile image"
                                className="rounded-full size-1"
                              />
                              <AvatarFallback className="rounded-sm size-4 text-xs bg-primary">
                                {game.user4?.username.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <h1
                              className={cn(
                                game.user4?.id == id &&
                                  (game.winner?.id == id
                                    ? "text-yellow-300 "
                                    : "text-red-300 ")
                              )}
                            >
                              {game.user4?.username}
                            </h1>
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center">
                      <div className="mr-2">
                        <div>{game.user1_score}</div>
                        <div>{game.user2_score}</div>
                      </div>
                      {isWinner(game, id) ? (
                        <PlusSquare className="text-green-500" />
                      ) : (
                        <MinusSquare className="text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(game.timestamp).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center  text-xl">
                    No games man 😢
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </>
    )
  );
}
