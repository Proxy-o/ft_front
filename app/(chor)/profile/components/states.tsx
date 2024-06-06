import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FrownIcon, LineChart, PlusSquare, SwordsIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import useGetGames from "../hooks/useGetGames";
import useGetTwoGames from "../hooks/useGetTwoGames";
import useGetTournaments from "../hooks/useGetTournaments";

export default function States({ id }: { id: string }) {
  const { data: oneGames, isSuccess: oneIsSuccess } = useGetGames(id);
  const { data: twoGames, isSuccess: twoIsSuccess } = useGetTwoGames(id);
  const { data: tournament, isSuccess: tourIsSuccess } = useGetTournaments(id);
  const [states, setStates] = useState({
    classic: {
      wins: 0,
      defeats: 0,
      total: 0,
    },
    tournament: {
      wins: 0,
      defeats: 0,
      total: 0,
    },
    twoVtwo: {
      wins: 0,
      defeats: 0,
      total: 0,
    },
  });

  useEffect(() => {
    if (oneIsSuccess && oneGames) {
      console.log(oneGames.length);
      setStates((prev) => ({
        ...prev,
        classic: {
          wins: oneGames?.filter((game: any) => game.winner.id === Number(id))
            .length,
          total: oneGames.length,
          get defeats() {
            return this.total - this.wins;
          },
        },
      }));
    }

    if (twoIsSuccess && twoGames) {
      setStates((prev) => ({
        ...prev,
        twoVtwo: {
          wins: twoGames?.filter((game: any) => game.winner.id === Number(id))
            .length,
          total: twoGames.length,
          get defeats() {
            return this.total - this.wins;
          },
        },
      }));
    }

    if (tourIsSuccess && tournament) {
      console.log(tournament);
      setStates((prev) => ({
        ...prev,
        tournament: {
          wins: tournament?.filter(
            (game: any) => game.winner?.id === Number(id)
          ).length,
          total: tournament.length,
          get defeats() {
            return this.total - this.wins;
          },
        },
      }));
    }
  }, [
    oneIsSuccess,
    id,
    oneGames,
    twoGames,
    tournament,
    tourIsSuccess,
    twoIsSuccess,
  ]);

  return (
    <Card className="p-4   h-[22rem]  flex justify-center lg:w-72">
      <Tabs defaultValue="Classic" className="w-full">
        <TabsList className="flex ">
          <TabsTrigger value="Classic" className="w-full">
            Classic
          </TabsTrigger>
          <TabsTrigger value="2 Vs 2" className="w-full">
            2 VS 2
          </TabsTrigger>
          <TabsTrigger value="Tournament" className="w-full">
            Tournament
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Classic">
          <div className="flex w-full items-center justify-center mt-5 ">
            <div className=" w-full">Global Stats</div>
            <div className="flex justify-end  w-full ">
              <LineChart size={24} />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <SwordsIcon className="text-green-500 mr-2" size={24} />
            Wins
            <div className="flex justify-end  w-full ">
              {states.classic.wins}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <FrownIcon className="text-red-600 mr-2" size={24} />
            Defeats
            <div className="flex justify-end  w-full ">
              {states.classic.defeats}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <PlusSquare className="text-yellow-400 mr-2" size={24} />
            Total
            <div className="flex justify-end  w-full ">
              {states.classic.total}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="Tournament">
          <div className="flex w-full items-center justify-center mt-5 ">
            <div className=" w-full">Global Stats</div>

            <div className="flex justify-end  w-full ">
              <LineChart size={24} />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <SwordsIcon className="text-green-500 mr-2" size={24} />
            Wins
            <div className="flex justify-end  w-full ">
              {states.tournament.wins}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <FrownIcon className="text-red-600 mr-2" size={24} />
            Defeats
            <div className="flex justify-end  w-full ">
              {states.tournament.defeats}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <PlusSquare className="text-yellow-400 mr-2" size={24} />
            Total
            <div className="flex justify-end  w-full ">
              {states.tournament.total}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="2 Vs 2">
          <div className="flex w-full items-center justify-center mt-5 ">
            <div className=" w-full">Global Stats</div>

            <div className="flex justify-end  w-full ">
              <LineChart size={24} />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <SwordsIcon className="text-green-500 mr-2" size={24} />
            Wins
            <div className="flex justify-end  w-full ">
              {states.twoVtwo.wins}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <FrownIcon className="text-red-600 mr-2" size={24} />
            Defeats
            <div className="flex justify-end  w-full ">
              {states.twoVtwo.defeats}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <PlusSquare className="text-yellow-400 mr-2" size={24} />
            Total
            <div className="flex justify-end  w-full ">
              {states.twoVtwo.total}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
