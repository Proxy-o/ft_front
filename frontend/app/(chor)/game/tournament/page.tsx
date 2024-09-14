"use client";

import getCookie from "@/lib/functions/getCookie";
import TournamentTable from "../../profile/components/tournamentTable";
import useGetTournament from "../hooks/useGetTournament";
import { useRouter } from "next/navigation";
import useCreateTournament from "../hooks/useCreateTournament";

export default function Page() {
  const user_id = getCookie("user_id") || "";
  const {tournament} = useGetTournament();
  const { mutate: createTournament } = useCreateTournament(user_id);
  const router = useRouter();
  return (
    <>
      {tournament.data?.tournament ?(
        <div
          className="flex justify-center items-center w-full h-20 bg-primary text-white"
                    onClick={() => {
                      if (tournament.isSuccess) {
                        router.push(`/game/tournament/${tournament.data.tournament.id}`);
                      }
                    }}
                  >
                    go to tournament
                  </div>
                ) : (
                  <div
                    className="flex justify-center items-center w-full h-20 bg-primary text-white"
                    onClick={() => {
                      createTournament(user_id);
                    }}
                  >
                    Create Tournament
                  </div>
                )
                }
                <TournamentTable userid={user_id} />
              </>
            );
          }
