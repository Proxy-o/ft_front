import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Flame, MinusSquare, PlusSquare } from "lucide-react";
import { Game } from "../types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import useIsWinner from "../hooks/useIsWinner";

export default function GamesState({
  games,
  user_id,
}: {
  games: any;
  user_id: string;
}) {
  const isWinner = useIsWinner();

  return (
    <div className="w-full feedRight">
        <Table>
          <TableHeader className="bg-secondary ">
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-center">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games && games.length > 0 ? (
              games.map((game: Game, index: number) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    <Flame
                      className={cn(
                        game.winner?.id == user_id
                          ? "text-yellow-500"
                          : "text-red-500"
                      )}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex gap-2  items-center">
                      <div className=" flex items-center flex-col ">
                        <Link
                          className="flex"
                          href={`/profile/${game.user1.id}`}
                        >
                          <Avatar className=" mr-1 size-4 ">
                            <AvatarImage
                              src={game.user1.avatar}
                              alt="profile image"
                              className="rounded-full size-4 hover:scale-110"
                            />
                            <AvatarFallback className="rounded-sm size-4 text-xs bg-primary">
                              {game.user1.username.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <h1
                            className="w-fit"
                          >
                            {game.user1.username}
                          </h1>
                        </Link>
                        {game.user3 && (
                          <Link
                            className="flex"
                            href={`/profile/${game.user3?.id}`}
                          >
                            <Avatar className=" mr-1 size-4">
                              <AvatarImage
                                src={game.user3?.avatar}
                                alt="profile image"
                                className="rounded-full size-4 hover:scale-110 mr-2"
                              />
                              <AvatarFallback className="rounded-sm size-4 text-xs bg-primary">
                                {game.user3?.username.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <h1
                              
                            >
                              {game.user3?.username}
                            </h1>
                          </Link>
                        )}
                      </div>
                      <h1 className="mx-3">VS</h1>
                      <div className=" flex items-center flex-col ">
                        <Link
                          className="flex"
                          href={`/profile/${game.user2.id}`}
                        >
                          <Avatar className=" mr-1 size-4">
                            <AvatarImage
                              src={game.user2.avatar}
                              alt="profile image"
                              className="rounded-full size-4 hover:scale-110 mr-2"
                            />
                            <AvatarFallback className="rounded-sm size-4 text-xs bg-primary">
                              {game.user2.username.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <h1
                          >
                            {game.user2.username}
                          </h1>
                        </Link>
                        {game.user4 && (
                          <Link
                            className="flex"
                            href={`/profile/${game.user4?.id}`}
                          >
                            <Avatar className=" mr-1 size-4">
                              <AvatarImage
                                src={game.user4?.avatar}
                                alt="profile image"
                                className="rounded-full size-4 hover:scale-110 mr-2"
                              />
                              <AvatarFallback className="rounded-sm size-4 text-xs bg-primary">
                                {game.user4?.username.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <h1
                            
                            >
                              {game.user4?.username}
                            </h1>
                          </Link>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center">
                    <div className="mr-2">
                      <div>{game.user1_score}</div>
                      <div>{game.user2_score}</div>
                    </div>
                    {isWinner(game, user_id) ? (
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
    </div>
  );
}
