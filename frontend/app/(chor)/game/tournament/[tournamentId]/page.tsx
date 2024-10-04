"use client";
import { Card } from "@/components/ui/card";
import Game from "../../oneVone/components/game";
import getCookie from "@/lib/functions/getCookie";
import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import useCreateTournament from "../../hooks/useCreateTournament";
import useLeavetournament from "../../hooks/useLeaveTournament";
import useInvitationSocket from "../../hooks/sockets/useInvitationSocket";
import useDeletetournament from "../../hooks/useDeleteTournament";
import useGetGame from "../../hooks/useGetGames";
import { useEffect, useRef } from "react";
import useGetTournament from "../../hooks/useGetTournament";
import { Button } from "@/components/ui/button";
import TournamentBoard from "../components/tournamentBoard";
import Invitations from "../../components/invitations";
import { routeModule } from "next/dist/build/templates/app-page";
import { useRouter } from "next/navigation";
import useGameSocket from "../../hooks/sockets/useGameSocket";

export default function Page({ params }: { params: { tournamentId: string } }) {
  const tournamentId = params.tournamentId;
  const user_id = getCookie("user_id") || "";
  const { mutate: leavetournament } = useLeavetournament();
  const { newNotif } = useInvitationSocket();
  const { handleSurrender } = useGameSocket();
  const { onGoingGame } = useGetGame(
    user_id || "0",
    "tournament",
    tournamentId
  );
  const router = useRouter();
  const { mutate: deleteTournament } = useDeletetournament();
  const {
    data,
    isSuccess,
    isLoading,
    refetch: refetchTournament,
  } = useGetTournament(tournamentId);

  // useEffect(() => {
  //   if (!data?.tournament?.started && isSuccess) {
  //     router.push(`/game/tournament`);
  //   }
  // }, [isSuccess, isLoading]);

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      // console.log(parsedMessage.message);
      if (
        message[0] === "/refetchTournament" ||
        message[0] === "/refetchPlayers"
      ) {
        refetchTournament();
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);
  return (
    <div className={`flex flex-col w-full h-full justify-center items-center`}>
      <h1 className="text-3xl md:text-7xl mt-5">Tournament</h1>
      <div className="text-sm font-light mb-8 text-center">
        Create and invite three friends to play and determine who is the best!
      </div>
      <div className="flex flex-col p-4 w-full h-full lg:justify-center items-center lg:items-start gap-2">
        <Game
          type="tournament"
          onGoingGame={onGoingGame}
          tournamentId={tournamentId}
        />
        <div className="flex flex-col gap-4 w-full min-w-80 lg:mr-auto items-center">
          {isSuccess && data.tournament && (
            <>
              <Button
                className="w-1/3"
                onClick={() => {
                  leavetournament(tournamentId);
                  handleSurrender(onGoingGame.data?.game?.id || "0");
                }}
              >
                Leave Tournament
              </Button>
            </>
          )}
          {isSuccess && data.tournament && (
            <TournamentBoard tournament={data.tournament} />
          )}
        </div>
      </div>
      {isSuccess && data.tournament && (
        <Button
          onMouseDown={() => {
            deleteTournament(tournamentId);
          }}
        >
          Delete Tournament
        </Button>
      )}
    </div>
  );
}
