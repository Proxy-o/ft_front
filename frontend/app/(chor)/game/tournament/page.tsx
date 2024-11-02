"use client";

import TournamentTable from "../../profile/components/tournamentTable";
import { useRouter } from "next/navigation";
import useCreateTournament from "../hooks/tournament/useCreateTournament";
import Invitations from "../components/invitations/invitations";
import InviteFriends from "../components/invitations/inviteFriend";
import { Button } from "@/components/ui/button";
import useInvitationSocket from "../hooks/sockets/useInvitationSocket";
import { useEffect } from "react";
import useStartTournament from "../hooks/tournament/useStartTournament";
import useGetOnGoingTournament from "../hooks/tournament/useGetOnGoingTournament";
import useAborttournament from "../hooks/tournament/useAbortTournament";
import { Participants } from "./components/participants";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DoorOpen, Plus } from "lucide-react";
import useGetUser from "../../profile/hooks/useGetUser";

export default function Page() {
  const { data: user } = useGetUser("0");
  const user_id = user?.id;
  const { data, isSuccess, refetch } = useGetOnGoingTournament();
  const tournament = data?.tournament;
  const { newNotif } = useInvitationSocket();
  const { mutate: createTournament } = useCreateTournament(user_id);
  const { mutate: startTournament } = useStartTournament(tournament?.id);
  const { mutate: abortTournament } = useAborttournament();
  const router = useRouter();

  useEffect(() => {
    if (tournament?.started) {
      if (
        (tournament?.user1.id === user_id && !tournament?.user1_left) ||
        (tournament?.user2.id === user_id && !tournament?.user2_left) ||
        (tournament?.user3.id === user_id && !tournament?.user3_left) ||
        (tournament?.user4.id === user_id && !tournament?.user4_left)
      ) {
        const id = setTimeout(() => {
          router.push(`/game/tournament/${tournament.id}`);
        }, 20 * 1000);
        return () => clearTimeout(id);
      }
    }
  }, [tournament]);

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      // console.log(parsedMessage.message);
      if (message[0] === "/acceptTournament") {
        refetch();
      } else if (message[0] === "/startTournament") {
        refetch();
        router.push(`/game/tournament/${tournament?.id}`);
      } else if (
        message[0] === "/refetchTournament" ||
        message[0] === "/refetchPlayers"
      ) {
        refetch();
      }
    }
  }, [newNotif()?.data]);

  return (
    <div className="flex flex-col w-11/12 max-w-[800px] h-full justify-start items-center mx-auto">
      <div className="w-full flex flex-col justify-center items-center gap-4 relative">
        <h1 className="text-3xl md:text-7xl mt-5">Tournament</h1>
        <div className="text-sm font-light mb-8 text-center">
          Create and invite three friends to play and determine who is the best!
        </div>
        {!tournament && (
          <TooltipProvider delayDuration={0}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    createTournament(user_id);
                  }}
                  className="w-10 h-10 p-0 rounded-md absolute top-6 md:top-12 right-3"
                >
                  <Plus size={25} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create Tournament</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="w-full h-fit flex flex-col justify-center items-center gap-4 mt-5">
        {tournament && (
          <>
            <Card className="w-full h-fit flex flex-col justify-center items-center gap-4 px-10 py-2">
              <Participants tournament={tournament} />
              <div className="w-full h-10 flex flex-row justify-center items-center gap-4">
                <div className="flex w-1/3"></div>
                <div className="flex w-1/3">
                  {isSuccess &&
                    tournament &&
                    tournament?.user1 &&
                    tournament?.user2 &&
                    tournament?.user3 &&
                    tournament?.user4 &&
                    user_id == tournament?.creator.id &&
                    !tournament.started && (
                      <Button
                        className="w-fit h-full bg-green-500/40"
                        onClick={() => {
                          if (isSuccess) {
                            startTournament(tournament?.id);
                          }
                        }}
                      >
                        Start Tournament
                      </Button>
                    )}

                  {tournament.started && (
                    <Button
                      className="w-fit h-full bg-green-500/40"
                      onClick={() => {
                        if (isSuccess) {
                          router.push(`/game/tournament/${tournament.id}`);
                        }
                      }}
                    >
                      Go to Tournament
                    </Button>
                  )}
                </div>
                <div className="w-1/3 flex flex-row justify-end items-center gap-4">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            if (isSuccess) {
                              abortTournament(tournament?.id);
                            }
                          }}
                          className="h-full w-fit bg-red-600/40 ml-auto"
                        >
                          <DoorOpen size={25} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Abort Tournament</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          </>
        )}
        {tournament && !tournament.started && (
          <>
            {isSuccess &&
              tournament &&
              (!tournament?.user1 ||
                !tournament?.user2 ||
                !tournament?.user3 ||
                !tournament?.user4) && <InviteFriends gameType="tournament" />}
          </>
        )}
        {isSuccess && !tournament && <Invitations mode="tournament" />}

        {tournament && <TournamentTable userid={user_id} />}
      </div>
    </div>
  );
}
