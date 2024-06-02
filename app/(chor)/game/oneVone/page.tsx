import Two from "./oneVone";
import { Card } from "@/components/ui/card";
import Invitations from "../components/invitations";
import InviteFriends from "../components/inviteFriend";
import CheckLogin from "@/components/checkLogin";

export default function Page() {
  return (
    <>
      <CheckLogin />
      <div className={`flex flex-col w-full h-full justify-start items-center`}>
        <Card className="w-11/12 max-w-[900px] h-fit flex flex-col justify-center items-start p-2 pb-8 mx-auto mt-12 gap-2">
          <div className="w-full">
            <Two type="two" />
          </div>
          <div className="w-full h-full flex flex-col md:flex-row justify-start items-start p-2 gap-4">
            <div className="w-full md:w-1/2 h-full flex flex-col justify-start items-start gap-2">
              <Invitations mode="two" />
            </div>
            <div className="w-full md:w-1/2 h-full gap-2">
              <InviteFriends gameType="two" />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
