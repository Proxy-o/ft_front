"use client";

import getCookie from "@/lib/functions/getCookie";
import useCreateTournament from "../hooks/useCreateTournament";
import TournamentBoard from "../components/tournamentBoard";
import { Button } from "@/components/ui/button";
import useGetTournament from "../hooks/useGetTournament";
import InviteFriends from "../components/inviteFriend";
import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import useGetTournamentGame from "../hooks/useGetGameTournament";
import Two from "../oneVone/two";
import Invitations from "../components/invitations";
import useLeavetournament from "../hooks/useLeaveTournament";
import useDeleteTournament from "../hooks/useDeleteTournament";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useEffect } from "react";

const Tournament = () => {
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const { mutate: createTournament } = useCreateTournament(user_id);
  const { mutate: leavetournament } = useLeavetournament();
  const { newNotif } = useInvitationSocket();
  const { onGoingGame } = useGetTournamentGame(user_id || "0");
  const tournament = useGetTournament(user_id);
  const { mutate: deleteTournament } = useDeleteTournament();
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
    <div className="flex flex-col gap-4">
      {isSuccess && data.tournament && (
        <>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Game on going</h1>
            <Two type="tournament" />
          </div>
          {console.log("fetching tournament")}
          <TournamentBoard />
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
      {isSuccess && (
        <>
          <InviteFriends gameType="tournament" />
          <Invitations mode="tournament" />
        </>
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
  );
};

export default Tournament;
