import getCookie from "@/lib/functions/getCookie";
import useCreateTournement from "../hooks/useCreateTournement";
import TourenementBoard from "./tournementBoard";
import { Button } from "@/components/ui/button";
import useGetTournement from "../hooks/useGetTournement";
import InviteFriends from "./inviteFriend";

const Tourenement = () => {
  const user_id = getCookie("user_id") || "";
  const { mutate: createTournement } = useCreateTournement(user_id);
  const tournament = useGetTournement(user_id);
  const { data, isSuccess, isLoading } = tournament.tournement;
  if (isLoading) return "loading...";
  if (isSuccess && !data.tournement) return "no tournement found";

  return (
    <div className="flex flex-col gap-4">
      {isSuccess && data.tournement && (
        <>
          <TourenementBoard />
          <div className=" w-fit h-fit">
            <InviteFriends gameType="tournament" />
          </div>
        </>
      )}
      {isSuccess && !data.tournement && (
        <Button
          onClick={() => {
            createTournement(user_id);
          }}
        >
          Create Tournement
        </Button>
      )}
    </div>
  );
};

export default Tourenement;
