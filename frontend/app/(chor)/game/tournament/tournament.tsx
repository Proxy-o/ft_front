"use client";

import getCookie from "@/lib/functions/getCookie";
import useCreateTournament from "../hooks/useCreateTournament";
import TournamentBoard from "../components/tournamentBoard";
import { Button } from "@/components/ui/button";
import useGetTournament from "../hooks/useGetTournament";
import InviteFriends from "../components/inviteFriend";
import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import useGetTournamentGame from "../hooks/useGetGameTournament";
import Two from "../oneVone/oneVone";
import Invitations from "../components/invitations";
import useLeavetournament from "../hooks/useLeaveTournament";
import useDeleteTournament from "../hooks/useDeleteTournament";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useEffect, useRef } from "react";
import NoGame from "../components/noGame";
import { Card } from "@/components/ui/card";

const Tournament = () => {
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const { mutate: createTournament } = useCreateTournament(user_id);
  const { mutate: leavetournament } = useLeavetournament();
  const { newNotif } = useInvitationSocket();
  const { onGoingGame } = useGetTournamentGame(user_id || "0");
  const tournament = useGetTournament(user_id);
  const { mutate: deleteTournament } = useDeleteTournament();
  const stateRef = useRef<string>("tournament");
  const {
    data,
    isSuccess,
    isLoading,
    refetch: refetchTournament,
  } = tournament.tournament;
  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      console.log(parsedMessage.message);
      if (message[0] === "/refetchTournament") {
        refetchTournament();
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);
  if (isLoading) return "loading...";
  // if (isSuccess && !data.tournament) return "no tournament found";
  return (
    <div className="flex flex-col p-4 lg:flex-row w-full h-full lg:justify-center items-center lg:items-start gap-2">
      <Card className="w-11/12 max-w-[900px] h-fit flex flex-col justify-center items-start gap-4 p-4">
        <div className="w-full h-fit">
          <Two type="tournament" />
        </div>
      </Card>
      <div className="flex flex-col gap-4 w-full min-w-80 lg:max-w-[350px] lg:mr-auto">
        {isSuccess && data.tournament && (
          <>
            <Button
              onClick={() => {
                leavetournament(data.tournament.id);
              }}
            >
              Leave Tournament
            </Button>
            {data.tournament.creator?.username === user.username && (
              <Button
                onMouseDown={() => {
                  deleteTournament(data.tournament.id);
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
