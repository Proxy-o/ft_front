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

export default function Page() {
  const user_id = getCookie("user_id") || "";
  const queryClient = useQueryClient();
  const { data, isLoading, isSuccess, refetch } = useGetOnGoingTournament();
  const { newNotif } = useInvitationSocket();
  const { mutate: createTournament } = useCreateTournament(user_id);
  const { mutate: startTournament } = useStartTournament(data?.tournament?.id);
  const router = useRouter();

  console.log(data);

  useEffect(() => {
    if (
      !(
        (data?.tournament?.user1?.id === user_id &&
          data?.tournament?.user1_left) ||
        (data?.tournament?.user2?.id === user_id &&
          data?.tournament?.user2_left) ||
        (data?.tournament?.user3?.id === user_id &&
          data?.tournament?.user3_left) ||
        (data?.tournament?.user4?.id === user_id &&
          data?.tournament?.user4_left
        ) &&
          data?.tournament?.started &&
          isSuccess &&
          !data?.tournament?.winner)
    ) {
      // router.push(`/game/tournament/${data?.tournament?.id}`);
    }
  }, [isSuccess, isLoading]);
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
        router.push(`/game/tournament/${data?.tournament?.id}`);
      }
    }
  }, [newNotif()?.data]);

  return (
    <div className="flex flex-col w-full h-fit justify-center items-center">
      {data?.tournament ? (
        <>
          <TournamentBoard tournament={data?.tournament} />
          <Button
            className="w-1/2"
            onClick={() => {
              if (isSuccess) {
                startTournament(data?.tournament?.id);
              }
            }}
          >
            go to tournament
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
        data?.tournament &&
        (!data?.tournament?.user1 ||
          !data?.tournament?.user2 ||
          !data?.tournament?.user3 ||
          !data?.tournament?.user4) && <InviteFriends gameType="tournament" />}
      <TournamentTable userid={user_id} />
    </div>
  );
}
