import Invitations from "../components/invitations";
import InviteFriends from "../components/inviteFriend";
import Game from "./components/game";

export default function Page() {
  return (
    <>
      <div className="flex flex-col w-11/12  h-full justify-start items-center max-w-[900px] mx-auto gap-4">
      <h1 className="text-3xl text-white md:text-6xl mt-5"><span className="text-cyan-500">Two</span> Vs <span className="text-purple-500">Two</span></h1>

        <div className="text-sm font-light mb-5 text-center">
          Pong can be a team sport too! Invite a friend to play a game of ping
        </div>
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
