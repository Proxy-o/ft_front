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
import { Flame, MinusSquare, PlusSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import useGetGames from "../hooks/useGetGames";
import { Game } from "../types";

export default function GamesTable({ id }: { id: string }) {
  const username = "othmane ait taleb";
  const { data: games, isSuccess } = useGetGames(id);

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
              {games.map((game: Game, index: number) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    <Flame className="text-yellow-400" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div className=" flex items-center">
                        {game.user1.username}
                      </div>
                      <div className=" flex items-center">
                        {game.user3?.username}
                      </div>
                    </div>
                    <div>
                      <div className=" flex items-center">
                        {game.user2?.username}
                      </div>
                      <div className=" flex items-center">
                        {game.user4?.username}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center">
                    <div className="mr-2">
                      <div>{game.user1_score}</div>
                      <div>{game.user2_score}</div>
                    </div>
                    {game.winner?.id === id && game.play === "win" ? (
                      <PlusSquare className="text-green-500" />
                    ) : (
                      <MinusSquare className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(game.timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </>
    )
  );
}
