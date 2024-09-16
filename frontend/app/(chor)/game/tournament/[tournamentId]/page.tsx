"use client";
import { Card } from "@/components/ui/card";
import Game from "../../oneVone/game";
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
import TournamentBoard from "../../components/tournamentBoard";
import Invitations from "../../components/invitations";

export default function Page({ params }: { params: { tournamentId: string } }) {
  const tournamentId = params.tournamentId;
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const { mutate: createTournament } = useCreateTournament(user_id);
  const { mutate: leavetournament } = useLeavetournament();
  const { newNotif, handleRefetchTournament } = useInvitationSocket();
  const { onGoingGame } = useGetGame(
    user_id || "0",
    "tournament",
    tournamentId
  );
  const { mutate: deleteTournament } = useDeletetournament();
  const stateRef = useRef<string>("tournament");
  const { tournament } = useGetTournament(tournamentId);
  const { isSuccess, data, refetch: refetchTournament } = tournament;
  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      console.log(parsedMessage.message);
      if (
        message[0] === "/refetchTournament" ||
        message[0] === "/refetchPlayers"
      ) {
        refetchTournament();
        // onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);
  return (
    <div className={`flex flex-col w-full h-full justify-center items-center`}>
      <div className="flex flex-col p-4 lg:flex-row w-full h-full lg:justify-center items-center lg:items-start gap-2">
        <Card className="w-11/12 max-w-[900px] h-fit flex flex-col justify-center items-start gap-4 p-4">
          <div className="w-full h-fit">
            <Game
              type="tournament"
              onGoingGame={onGoingGame}
              tournamentId={tournamentId}
            />
          </div>
        </Card>
        <div className="flex flex-col gap-4 w-full min-w-80 lg:max-w-[350px] lg:mr-auto">
          {isSuccess && data.tournament && (
            <>
              <Button
                onClick={() => {
                  leavetournament(tournamentId);
                }}
              >
                Leave Tournament
              </Button>
              {data.tournament && (
                <Button
                  onMouseDown={() => {
                    deleteTournament(tournamentId);
                  }}
                >
                  Delete Tournament
                </Button>
              )}
            </>
          )}
          {isSuccess && data.tournament && (
            <TournamentBoard tournament={data.tournament} />
          )}
        </div>
      </div>
    </div>
  );
}
