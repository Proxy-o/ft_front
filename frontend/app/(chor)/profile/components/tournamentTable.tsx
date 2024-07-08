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
  return (
    isSuccess && (
      <div className="w-full">
        <div className="p-4 relative font-semibold">Tournaments</div>
        <Accordion type="single" collapsible>
          {tournaments.map((tournament: any, index: number) => (
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
                  {!tournament.winner?.avatar && (
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
          ))}
        </Accordion>
      </div>
    )
  );
}
