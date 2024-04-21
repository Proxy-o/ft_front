import getCookie from "@/lib/functions/getCookie";
import useCreateTournament from "../hooks/useCreateTournament";
import TournamentBoard from "./tournamentBoard";
import { Button } from "@/components/ui/button";
import useGetTournament from "../hooks/useGetTournament";
import InviteFriends from "./inviteFriend";
import useStartTournament from "../hooks/useStartTournament";
import useGetUser from "@/app/profile/hooks/useGetUser";
import useGetTournamentGame from "../hooks/useGetGameTournament";
import OneOnline from "./oneOnline";

const Tournament = () => {
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const { mutate: createTournament } = useCreateTournament(user_id);
  const { mutate: startTournament } = useStartTournament(user_id);
  const { onGoingGame } = useGetTournamentGame(user_id || "0");

  const tournament = useGetTournament(user_id);
  const { data, isSuccess, isLoading } = tournament.tournament;
  if (isLoading) return "loading...";

  // if (isSuccess && !data.tournament) return "no tournament found";
  return (
    <div className="flex flex-col gap-4">
      {isSuccess && data.tournament && (
        <>
          {onGoingGame && onGoingGame.isSuccess && onGoingGame.data && (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Game on going</h1>
              <OneOnline type="tournament"/>
            </div>
          )}
          <TournamentBoard />
          <div className=" w-fit h-fit">
            {data.tournament.creator?.username === user.username &&
              !data.tournament.started && (
                <Button
                  onClick={() => {
                    startTournament(data.tournament.id);
                  }}
                >
                  Start Tournament
                </Button>
              )}
            <InviteFriends gameType="tournament" />
          </div>
        </>
      )}
      {isSuccess && !data.tournament && (
        <Button
          onClick={() => {
            createTournament(user_id);
          }}
        >
          Create Tournament
        </Button>
      )}
    </div>
  );
};

export default Tournament;
