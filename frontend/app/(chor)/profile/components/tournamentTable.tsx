import React from "react";
import useGetTournaments from "../hooks/useGetTournaments";
import TournamentBoard from "../../game/components/tournamentBoard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TournamentTable({ userid }: { userid: string }) {
  const { data, isSuccess, fetchNextPage } = useGetTournaments(userid);
  const games = data?.pages.map((page) => page.results).flat();
  const [haseMore, setHasMore] = React.useState(true);
  React.useEffect(() => {
    if (data) {
      setHasMore(data.pages[data.pages.length - 1].next ? true : false);
    }
  }, [data]);

  return (
    isSuccess && (
      <Card className="w-full">
        <Accordion type="single" collapsible>
          {games?.length ? (
            games.map((tournament: any, index: number) => (
              <AccordionItem value={tournament.id} key={index}>
                <AccordionTrigger className="p-2">
                  <div className="flex justify-between items-center border rounded-lg w-full p-1 gap-1">
                    <div className="flex items-center justify-center  gap-4 w-1/2 bg-primary/10 rounded-md relative">
                      <h1 className="w-full  text-center absolute text-5xl opacity-35 hover:scale-110 transition duration-300 ease-in-out blur-sm">
                        Creator
                      </h1>
                      <div className="flex flex-col justify-center items-center p-2 hover:scale-110 transition duration-300 ease-in-out ">
                        <Avatar className=" size-10">
                          <AvatarImage
                            src={tournament.creator.avatar}
                            alt="profile image"
                            className="rounded-full size-10"
                          />
                          <AvatarFallback className="rounded-sm size-4 text-xs">
                            R
                          </AvatarFallback>
                        </Avatar>
                        <h1>{tournament.creator.username}</h1>
                      </div>
                    </div>
                    {tournament.winner?.avatar && (
                      <div className="flex items-center justify-center  gap-4 w-1/2 bg-green-600/10 rounded-md relative">
                        <h1 className="w-full absolute text-5xl opacity-35 hover:scale-110 transition duration-300 ease-in-out blur-sm">
                          Winner
                        </h1>
                        <div className="flex flex-col justify-center items-center p-2 hover:scale-110 transition duration-300 ease-in-out">
                          <Avatar className=" size-10 ">
                            <AvatarImage
                              src={tournament.creator.avatar}
                              alt="profile image"
                              className="rounded-full size-10"
                            />
                            <AvatarFallback className="rounded-sm size-4 text-xs">
                              R
                            </AvatarFallback>
                          </Avatar>
                          <h1>{tournament.creator.username}</h1>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className=" flex justify-center items-center">
                  <TournamentBoard tournament={tournament} />
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <div className="w-full text-center m-4">No tournaments</div>
          )}
        </Accordion>
        <div className="w-full flex justify-center items-center p-2 border-t">
          {games?.length ? (
            <Button
              size={"sm"}
              variant="ghost"
              disabled={!haseMore}
              className="mt-4 border"
              onClick={() => fetchNextPage()}
            >
              {haseMore ? "Show more" : "No more games"}
            </Button>
          ) : (
            <></>
          )}
        </div>
      </Card>
    )
  );
}
