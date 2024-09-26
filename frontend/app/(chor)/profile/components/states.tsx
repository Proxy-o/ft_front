import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FrownIcon, LineChart, PlusSquare, SwordsIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import useGetGames from "../hooks/useGetGames";
import useGetTwoGames from "../hooks/useGetTwoGames";
import useGetTournaments from "../hooks/useGetTournaments";
import useGetStates from "../hooks/useGateState";

export default function States({ id }: { id: string }) {
const {data: states , isSuccess} = useGetStates(id);



  return (
   isSuccess &&  <Card className="p-4   h-[22rem]  flex justify-center lg:w-74">
      <Tabs defaultValue="Classic" className="w-full">
        <TabsList className="flex justify-around overflow-x-auto no-scrollbar px-1">
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
              {states.oneVoneWins}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <FrownIcon className="text-red-600 mr-2" size={24} />
            Defeats
            <div className="flex justify-end  w-full ">
              {states.oneVoneLoses}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <PlusSquare className="text-yellow-400 mr-2" size={24} />
            Total
            <div className="flex justify-end  w-full ">
              {states.oneVoneLoses + states.oneVoneWins}
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
              {states.tournamentWins}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <FrownIcon className="text-red-600 mr-2" size={24} />
            Defeats
            <div className="flex justify-end  w-full ">
              {states.tournamentLoses}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <PlusSquare className="text-yellow-400 mr-2" size={24} />
            Total
            <div className="flex justify-end  w-full ">
              {states.tournamentLoses + states.tournamentWins}
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
              {states.twoVtwoWins}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <FrownIcon className="text-red-600 mr-2" size={24} />
            Defeats
            <div className="flex justify-end  w-full ">
              {states.twoVtwoLoses}
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <PlusSquare className="text-yellow-400 mr-2" size={24} />
            Total
            <div className="flex justify-end  w-full ">
              {states.twoVtwoLoses + states.twoVtwoWins}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
