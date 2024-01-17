import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Circle, FrownIcon, LineChart, SwordsIcon } from "lucide-react";
import React from "react";

export default function States() {
  return (
    <Card className="p-4 max-w-md">
      <Tabs defaultValue="Classic" className="w-[400px]">
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
            defeats
            <div className="flex justify-end  w-full ">3</div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <Circle className="text-yellow-400 mr-2" size={24} />
            Total
            <div className="flex justify-end  w-full ">3</div>
          </div>
          <Separator className="my-6" />
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
            <div className="flex justify-end  w-full ">56</div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <FrownIcon className="text-red-600 mr-2" size={24} />
            defeats
            <div className="flex justify-end  w-full ">3</div>
          </div>
          <Separator className="my-6" />
          <div className="flex w-full ">
            <Circle className="text-yellow-400 mr-2" size={24} />
            Total
            <div className="flex justify-end  w-full ">3</div>
          </div>
          <Separator className="my-6" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
