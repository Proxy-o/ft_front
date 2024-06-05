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

export default function TournamentTable({ userid }: { userid: string }) {
  const { data: tournaments, isSuccess } = useGetTournaments(userid);
  console.log(tournaments);
  return (
    isSuccess && (
      <div className="w-full">
        <div className="p-4 relative font-semibold">Tournaments</div>
        <Accordion type="single" collapsible className="no-underline">
          {tournaments.map((tournament: any, index: number) => (
            <AccordionItem
              value={tournament.id}
              key={index}
              className="no-underline"
            >
              <AccordionTrigger className="">
                <div className="flex justify-between items-center border rounded-sm w-full no-underline">
                  <div className="flex items-center justify-center  gap-4 no-underline">
                    Creator :
                    <div className="flex flex-col justify-center items-center no-underline border p-2">
                      <Avatar className=" size-8">
                        <AvatarImage
                          src={tournament.creator.avatar}
                          alt="profile image"
                          className="rounded-full size-8"
                        />
                        <AvatarFallback className="rounded-sm size-4 text-xs">
                          R
                        </AvatarFallback>
                      </Avatar>
                      <h1>{tournament.creator.username}</h1>
                    </div>
                  </div>
                  {!tournament.winner?.avatar && (
                    <div className="flex items-center justify-center gap-4">
                      Winner :
                      <Avatar className=" mr-2 size-8">
                        <AvatarImage
                          src={tournament.winner?.avatar}
                          alt="profile image"
                          className="rounded-full size-8"
                        />
                        <AvatarFallback className="rounded-sm size-4 text-xs">
                          R
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <TournamentBoard tournament={tournament} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  );
}
