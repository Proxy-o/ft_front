import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OneVoneTable from "./oneVoneTable";
import TournamentTable from "./tournamentTable";
import TwoVtwoTable from "./twoVtwoTable";

export default function TabStates({ id }: { id: string }) {
  return (
    <Tabs defaultValue="Classic" className="w-full mb-2">
      <TabsList className="flex justify-around overflow-auto no-scrollbar">
        <TabsTrigger value="Classic" className="w-full">
          Classic
        </TabsTrigger>
        <TabsTrigger value="2v2" className="w-full">
          2v2
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Classic">
        <OneVoneTable id={id} />
      </TabsContent>
      <TabsContent value="2v2">
        <TwoVtwoTable id={id} />
      </TabsContent>
    </Tabs>
  );
}
