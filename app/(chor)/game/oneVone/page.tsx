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
        <Card className="w-11/12 max-w-[900px] h-fit flex flex-col justify-center items-start pb-8 mx-auto mt-12 gap-2 p-2">
          <div className="w-full">
            <Two type="two" />
          </div>
        </Card>
        <div className="w-11/12 h-fit max-w-[900px] flex flex-col md:flex-row justify-start items-start gap-2 mt-4">
          <div className="w-full md:w-1/2 h-full flex flex-col justify-start items-start">
            <Invitations mode="two" />
          </div>
          <div className="w-full md:w-1/2 h-full mb-8">
            <InviteFriends gameType="two" />
          </div>
        </div>
      </div>
    </>
  );
}
