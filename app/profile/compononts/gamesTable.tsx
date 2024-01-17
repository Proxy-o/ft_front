import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Games } from "../types";
import {
  Flame,
  MinusSquare,
  Plus,
  PlusCircle,
  PlusSquare,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";

const games: Games[] = [
  {
    player1: {
      name: "othmane ait taleb",
      score: "3",
      status: "win",
    },
    player2: {
      name: "zbiba hassan",
      score: "2",
      status: "lose",
    },
    date: "2021-10-10",
  },
  {
    player1: {
      name: "othmane ait taleb",
      score: "3",
      status: "lose",
    },
    player2: {
      name: "zbiba hassan",
      score: "5",
      status: "win",
    },
    date: "2021-10-10",
  },
  {
    player1: {
      name: "othmane ait taleb",
      score: "6",
      status: "lose",
    },
    player2: {
      name: "zbiba hassan",
      score: "7",
      status: "win",
    },
    date: "2021-10-10",
  },
  {
    player1: {
      name: "othmane ait taleb",
      score: "3",
      status: "win",
    },
    player2: {
      name: "zbiba hassan",
      score: "2",
      status: "lose",
    },
    date: "2021-10-10",
  },
  {
    player1: {
      name: "othmane ait taleb",
      score: "3",
      status: "lose",
    },
    player2: {
      name: "zbiba hassan",
      score: "4",
      status: "win",
    },
    date: "2021-10-10",
  },
];
export default function GamesTable() {
  const username = "othmane ait taleb";
  return (
    <Card className=" overflow-hidden ">
      <div className="p-4">Completed games</div>
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Players</TableHead>
            <TableHead>Result</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">
                <Flame className="text-yellow-400" />
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <div className=" flex items-center">
                    <Square
                      className={cn(
                        game.player1.status === "win" &&
                          "border  border-green-500",
                        "mr-1"
                      )}
                      size={12}
                    />
                    {game.player1.name}
                  </div>
                  <div className=" flex items-center">
                    <Square
                      className={cn(
                        game.player2.status === "win" &&
                          "border  border-green-500",
                        "mr-1 "
                      )}
                      size={12}
                    />
                    {game.player2.name}
                  </div>
                </div>
              </TableCell>
              <TableCell className="flex items-center">
                <div className="mr-2">
                  <div>{game.player1.score}</div>
                  <div>{game.player2.score}</div>
                </div>
                {game.player1.name === username &&
                game.player1.status === "win" ? (
                  <PlusSquare className="text-green-500" />
                ) : (
                  <MinusSquare className="text-red-500" />
                )}
              </TableCell>
              <TableCell className="text-right">{game.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
