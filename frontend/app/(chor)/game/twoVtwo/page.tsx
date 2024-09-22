import { Card } from "@/components/ui/card";
import Invitations from "../components/invitations";
import InviteFriends from "../components/inviteFriend";
import Game from "./components/game";

export default function Page() {
  return (
    <>
      <div className="flex flex-col w-11/12  h-full justify-start items-center max-w-[900px] mx-auto gap-4">
        <h1 className="text-2xl md:text-4xl mx-auto font-extrabold">
          Four Players Game
        </h1>
        <Game />
        <div className="w-full h-fit flex flex-col md:flex-row justify-start items-start gap-4">
          <div className="w-full md:w-1/2 h-fit flex flex-col justify-start items-start gap-2">
            <Invitations mode="four" />
          </div>
          <div className="w-full md:w-1/2 h-fit gap-2">
            <InviteFriends gameType="four" />
          </div>
        </div>
      </div>
    </>
  );
}
