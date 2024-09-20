"use client";

import getCookie from "@/lib/functions/getCookie";
import TournamentTable from "../../profile/components/tournamentTable";
import useGetTournament from "../hooks/useGetTournament";
import { useRouter } from "next/navigation";
import useCreateTournament from "../hooks/useCreateTournament";
import Invitations from "../components/invitations";
import InviteFriends from "../components/inviteFriend";
import TournamentBoard from "../components/tournamentBoard";
import { Button } from "@/components/ui/button";
import useInvitationSocket from "../hooks/sockets/useInvitationSocket";
import { useEffect } from "react";
import useStartTournament from "../hooks/useStartTournament";
import { useQueryClient } from "@tanstack/react-query";
import useGetOnGoingTournament from "../hooks/useGetOnGoingTournament";
import useAborttournament from "../hooks/useAbortTournament";

export default function Page() {
  const user_id = getCookie("user_id") || "";
  const queryClient = useQueryClient();
  const { data, isLoading, isSuccess, refetch } = useGetOnGoingTournament();
  const tournament = data?.tournament;
  const { newNotif } = useInvitationSocket();
  const { mutate: createTournament } = useCreateTournament(user_id);
  const { mutate: startTournament } = useStartTournament(tournament?.id);
  const { mutate: abortTournament } = useAborttournament();
  const router = useRouter();

  if (tournament?.started) {
    if (
      (tournament?.user1.id === user_id && !tournament?.user1_left) ||
      (tournament?.user2.id === user_id && !tournament?.user2_left) ||
      (tournament?.user3.id === user_id && !tournament?.user3_left) ||
      (tournament?.user4.id === user_id && !tournament?.user4_left)
    ) {
      router.push(`/game/tournament/${tournament.id}`);
    }
  }

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      console.log(parsedMessage.message);
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
    <div className="flex flex-col w-full h-fit justify-center items-center">
      {tournament ? (
        <>
          <TournamentBoard tournament={tournament} />
          {tournament.started ? (
            <Button
              className="w-1/2"
              onClick={() => {
                if (isSuccess) {
                  router.push(`/game/tournament/${tournament.id}`);
                }
              }}
            >
              Go to Tournament
            </Button>
          ) : (
            user_id == tournament?.creator.id && (
              <Button
                className="w-1/2"
                onClick={() => {
                  if (isSuccess) {
                    startTournament(tournament?.id);
                  }
                }}
              >
                Start Tournament
              </Button>
            )
          )}
          <Button
            className="w-1/2"
            onClick={() => {
              if (isSuccess) {
                abortTournament(tournament?.id);
              }
            }}
          >
            Abort Tournament
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            createTournament(user_id);
          }}
          className="w-1/2"
        >
          Create Tournament
        </Button>
      )}
      {isSuccess && <Invitations mode="tournament" />}

      {isSuccess &&
        tournament &&
        (!tournament?.user1 ||
          !tournament?.user2 ||
          !tournament?.user3 ||
          !tournament?.user4) && <InviteFriends gameType="tournament" />}
      <TournamentTable userid={user_id} />
    </div>
  );
}
