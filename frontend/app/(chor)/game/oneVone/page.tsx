import Two from "./oneVone";
import { Card } from "@/components/ui/card";
import Invitations from "../components/invitations";
import InviteFriends from "../components/inviteFriend";

export default function Page() {
  return (
    <>
      <div className="flex flex-col p-4 lg:flex-row w-full h-full lg:justify-center items-center lg:items-start gap-2">
        <Card className="w-11/12 max-w-[900px] h-fit flex flex-col justify-center items-start gap-4 p-4">
          <div className="w-full h-fit">
            <Two type="two" />
          </div>
        </Card>
        <div className="w-11/12 lg:w-4/12 lg:max-w-96 h-fit flex flex-col justify-start items-start gap-2">
          <div className="w-full h-full flex flex-col justify-start items-start">
            <Invitations mode="two" />
          </div>
          <div className="w-full h-full mb-8">
            <InviteFriends gameType="two" />
          </div>
        </div>
      </div>
    </>
  );
}
