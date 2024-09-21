import { Card } from "@/components/ui/card";
import Invitations from "../components/invitations";
import InviteFriends from "../components/inviteFriend";
import Game from "./components/game";

export default function Page() {
  return (
    <>
      <div className="flex flex-col w-11/12  h-full justify-start items-center max-w-[900px] mx-auto gap-4">
        <h1 className="text-2xl md:text-4xl mx-auto text-purple-600 font-extrabold">
          Four Players Game
        </h1>
        <Card className="w-full h-fit flex flex-col justify-center items-start mx-auto gap-2">
          <div className="w-full h-[400px] lg:h-[500px]">
            <Game />
          </div>
        </Card>
        <div className="w-full h-full flex flex-col md:flex-row justify-start items-start gap-4">
          <div className="w-full md:w-1/2 h-full flex flex-col justify-start items-start gap-2">
            <Invitations mode="four" />
          </div>
          <div className="w-full md:w-1/2 h-full gap-2">
            <InviteFriends gameType="four" />
          </div>
        </div>
      </div>
    </>
  );
}
