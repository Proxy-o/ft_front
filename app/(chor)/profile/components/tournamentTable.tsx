import React from "react";
import useGetTournaments from "../hooks/useGetTournaments";
import TournamentBoard from "../../game/components/tournamentBoard";

export default function TournamentTable({ userid }: { userid: string }) {
  const { data: tournaments, isSuccess } = useGetTournaments(userid);
  console.log(tournaments);
  return (
    isSuccess && (
      <div className="w-full">
        <div className="p-4 relative font-semibold">Tournaments</div>
        <div className="w-full">
          {isSuccess && tournaments.length > 0 ? (
            tournaments.map((tournament: any, index: number) => (
              <div key={index} className="flex justify-between p-4">
                <div>
                  <div className="font-semibold">{tournament.name}</div>
                  <div>{tournament.date}</div>
                </div>
                <div>
                  <div className="font-semibold">Position</div>
                  <div>
                    <TournamentBoard tournament={tournament} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4">No tournaments played</div>
          )}
        </div>
      </div>
    )
  );
}
