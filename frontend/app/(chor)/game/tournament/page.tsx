"use client";

import getCookie from "@/lib/functions/getCookie";
import TournamentTable from "../../profile/components/tournamentTable";
import useGetTournament from "../hooks/useGetTournament";
import { useRouter } from "next/navigation";
import useCreateTournament from "../hooks/useCreateTournament";
import Invitations from "../components/invitations";
import InviteFriends from "../components/inviteFriend";
import TournamentBoard from "../components/tournamentBoard";

export default function Page() {
  const user_id = getCookie("user_id") || "";
  const { tournament } = useGetTournament();
  const { mutate: createTournament } = useCreateTournament(user_id);
  const router = useRouter();
  const { isSuccess, data } = tournament;
  return (
    <div className="flex flex-col w-full h-fit justify-center items-center">
      {data?.tournament ? (
        <>
          <TournamentBoard tournament={data?.tournament} />
          <div
            className="flex justify-center items-center w-full h-fit bg-primary text-white"
            onClick={() => {
              if (tournament.isSuccess) {
                router.push(
                  `/game/tournament/${tournament.data.tournament.id}`
                );
              }
            }}
          >
            go to tournament
          </div>
        </>
      ) : (
        <div
          className="flex justify-center items-center w-full h-20 bg-primary text-white"
          onClick={() => {
            createTournament(user_id);
          }}
        >
          Create Tournament
        </div>
      )}
      {isSuccess && <Invitations mode="tournament" />}

      {isSuccess && data?.tournament && (!data?.tournament?.user1 || !data?.tournament?.user2 || !data?.tournament?.user3 || !data?.tournament?.user4) &&
      <InviteFriends gameType="tournament" />}
      <TournamentTable userid={user_id} />
    </div>
  );
}
