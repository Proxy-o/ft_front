"use client";

import getCookie from "@/lib/functions/getCookie";
import useCreateTournament from "../../hooks/useCreateTournament";
import TournamentBoard from "../../components/tournamentBoard";
import { Button } from "@/components/ui/button";
import useGetTournament from "../../hooks/useGetTournament";
import InviteFriends from "../../components/inviteFriend";
import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import Invitations from "../../components/invitations";
import useLeavetournament from "../../hooks/useLeaveTournament";
import useDeleteTournament from "../../hooks/useDeleteTournament";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useEffect, useRef } from "react";
import NoGame from "../../components/noGame";
import { Card } from "@/components/ui/card";
import Game from "../../oneVone/game";
import useGetGame from "../../hooks/useGetGames";

const Tournament = ({ tournamentId }: { tournamentId: string }) => {
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const { mutate: createTournament } = useCreateTournament(user_id);
  const { mutate: leavetournament } = useLeavetournament();
  const { newNotif, handleRefetchTournament } = useInvitationSocket();
  const { onGoingGame } = useGetGame(user_id || "0", "tournament");
  const { mutate: deleteTournament } = useDeleteTournament();
  const stateRef = useRef<string>("tournament");
  const { tournament } = useGetTournament(tournamentId);
  const { isSuccess, data } = tournament;
  console.log("toutnzmr", tournament?.data);
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
        // refetchTournament();
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);
  // console.log(tournament);
  // return <>{tournament}</>;
  return (
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
            {data.tournament?.creator === user_id && (
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
        {isSuccess && (
          <>
            <Invitations mode="tournament" />
          </>
        )}

        {isSuccess && data.tournament && (
          <InviteFriends gameType="tournament" />
        )}
        {isSuccess && !data.tournament && (
          <>
            <Button
              onClick={() => {
                createTournament(user_id);
              }}
            >
              Create Tournament
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Tournament;
