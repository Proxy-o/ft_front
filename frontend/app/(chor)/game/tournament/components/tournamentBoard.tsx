import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Crown } from "lucide-react";
import { useRef } from "react";

const TournamentBoard = ({ tournament }: { tournament: any }) => {
  const semi1 = useRef<any>(null);
  const semi2 = useRef<any>(null);
  const final = useRef<any>(null);
  if (tournament) {
    semi1.current = tournament.semi1;
    semi2.current = tournament.semi2;
    final.current = tournament.final;
  }
  return (
    <Card className="p-4 h-fit w-full flex flex-col justify-center">
      <div className="mx-auto">Board</div>
      <Separator className="w-full h-[2px] my-4" />
      <div className="flex flex-row ">
        <div className="flex flex-col justify-start items-start gap-16 my-auto">
          <div>
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={semi1.current?.user1?.avatar}
                alt="profile image"
                className="rounded-xl h-12 w-12"
              />
              <AvatarFallback className="rounded-xl">
                {semi1.current?.user1?.username || "user"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={semi1.current?.user2?.avatar}
                alt="profile image"
                className="rounded-xl h-12 w-12"
              />
              <AvatarFallback className="rounded-xl">
                {semi1.current?.user2?.username || "user"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-[116px] my-auto py-4 w-full">
          <Separator className="w-full h-[2px] bg-green-400 " />
          <Separator className="w-full h-[2px] bg-green-400" />
        </div>
        <div className="m-auto flex flex-col justify-start items-start gap-14">
          <Separator className="h-[120px] w-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start gap-[118px] my-auto w-full">
          <Separator className="w-full h-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start my-auto">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={semi1.current?.winner?.avatar}
              alt="profile image"
              className="rounded-xl h-12 w-12"
            />
            <AvatarFallback className="rounded-xl">
              {semi1.current?.winner?.username || "user"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 my-auto mx-4 py-4">
          <Avatar className="shadow-lg shadow-yellow-500 rounded-xl w-12 h-12">
            <AvatarImage
              src={final.current?.winner?.avatar}
              alt="profile image"
              className="rounded-xl h-12 w-12"
            />
            <AvatarFallback className="rounded-xl">
              {final.current?.winner?.username || "user"}
            </AvatarFallback>
          </Avatar>
          <Crown size={24} className="text-yellow-500" />
          <div className="w-8 h-8"></div>
        </div>
        <div className="flex flex-col justify-start items-start my-auto">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={semi2.current?.winner?.avatar}
              alt="profile image"
              className="rounded-xl h-12 w-12"
            />
            <AvatarFallback className="rounded-xl">
              {semi2.current?.winner?.username || "user"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-start items-start gap-[118px] my-auto w-full">
          <Separator className="w-full h-[2px] bg-green-400" />
        </div>
        <div className="m-auto flex flex-col justify-start items-start gap-14">
          <Separator className="h-[120px] w-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start gap-[116px] my-auto py-4 w-full">
          <Separator className="w-full h-[2px] bg-green-400 " />
          <Separator className="w-full h-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start gap-16 my-auto">
          <div>
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={semi2.current?.user1?.avatar}
                alt="profile image"
                className="rounded-xl h-12 w-12"
              />
              <AvatarFallback className="rounded-xl">
                {semi2.current?.user1?.username || "user"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={semi2.current?.user2?.avatar}
                alt="profile image"
                className="rounded-xl h-12 w-12"
              />
              <AvatarFallback className="rounded-xl">
                {semi2.current?.user2?.username || "user"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TournamentBoard;
