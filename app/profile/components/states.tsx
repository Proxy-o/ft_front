import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FrownIcon,
  LineChart,
  PlusSquare,
  SwordsIcon,
} from "lucide-react";
import React from "react";

export default function States() {
  return (
    <Card className="p-4   h-[22rem]  flex justify-center lg:w-72">
      <Tabs defaultValue="Classic" className="w-full">
        <TabsList className="flex ">
          <TabsTrigger value="Classic" className="w-full">
            Classic
          </TabsTrigger>
          <TabsTrigger value="Tournament" className="w-full">
            Tournament
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Classic">
          <div className="flex w-full items-center justify-center mt-5 ">
            <div className=" w-full">1Vs1 Stats</div>
            <div className="flex justify-end  w-full ">
              <LineChart size={24} />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <SwordsIcon className="text-green-500 mr-2" size={24} />
            Wins
            <div className="flex justify-end  w-full ">56</div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <FrownIcon className="text-red-600 mr-2" size={24} />
            Defeats
            <div className="flex justify-end  w-full ">3</div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <PlusSquare className="text-yellow-400 mr-2" size={24} />
            Total
            <div className="flex justify-end  w-full ">3</div>
          </div>
        </TabsContent>
        <TabsContent value="Tournament">
          <div className="flex w-full items-center justify-center mt-5 ">
            Stats
            <div className="flex justify-end  w-full ">
              <LineChart size={24} />
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <SwordsIcon className="text-green-500 mr-2" size={24} />
            Wins
            <div className="flex justify-end  w-full ">3</div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <FrownIcon className="text-red-600 mr-2" size={24} />
            Defeats
            <div className="flex justify-end  w-full ">7</div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <PlusSquare className="text-yellow-400 mr-2" size={24} />
            Total
            <div className="flex justify-end  w-full ">98</div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
