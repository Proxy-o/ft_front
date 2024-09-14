"use client";

import getCookie from "@/lib/functions/getCookie";
import TournamentTable from "../../profile/components/tournamentTable";

export default function Page() {
  4;
  const user_id = getCookie("user_id") || "";

  return (
    <>
      <TournamentTable userid={user_id} />
    </>
  );
}
