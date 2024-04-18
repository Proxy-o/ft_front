import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Crown } from "lucide-react";
import useGetTournament from "../hooks/useGetTournament";
import getCookie from "@/lib/functions/getCookie";
import { useEffect, useState } from "react";

const TournamentBoard = () => {
  const user_id = getCookie("user_id") || "";
  const [participants, setParticipants] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const { tournament } = useGetTournament(user_id);
  if (tournament.isLoading) return "looking for tournament...";
  if (
    (tournament.isSuccess && !tournament.data.tournament) ||
    tournament.data === undefined
  )
    return "no tournament found";
  useEffect(() => {
    console.log(tournament);
    if (tournament.isSuccess && tournament.data.tournament) {
      setParticipants(tournament.data.tournament?.participants || []);
      setGames(tournament.data.tournament.games || []);
    }
  }, [tournament.isSuccess, tournament.data.tournament]);

  return (
    <Card className="p-4 h-fit w-fit flex flex-col justify-center">
      <div className="mx-auto">Board</div>
      <Separator className="w-full h-[2px] my-4" />
      <div className="flex flex-row ">
        <div className="flex flex-col justify-start items-start gap-4">
          <Avatar className="">
            <AvatarImage
              src={participants[0]?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {participants[0]?.username || "user"}
            </AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              src={participants[1]?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {participants[1]?.username || "user"}
            </AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              src={participants[2]?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {participants[2]?.username || "user"}
            </AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              src={participants[3]?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {participants[3]?.username || "user"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-start items-start gap-14 my-auto py-4">
          <Separator className="w-6 h-[2px] bg-green-400 " />
          <Separator className="w-6 h-[2px] bg-green-400" />
          <Separator className="w-6 h-[2px] bg-green-400" />
          <Separator className="w-6 h-[2px] bg-green-400" />
        </div>
        <div className="w-[1px] m-auto flex flex-col justify-start items-start gap-14">
          <Separator className="h-[60px] w-[2px] bg-green-400" />
          <Separator className="h-[60px] w-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start gap-[118px] my-auto">
          <Separator className="w-6 h-[2px] bg-green-400" />
          <Separator className="w-6 h-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start gap-20 my-auto">
          <Avatar className="">
            <AvatarImage
              src={games[0]?.winner?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {games[0]?.winner?.username || "user"}
            </AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              src={games[1]?.winner?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {games[1]?.winner?.username || "user"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-start items-start gap-[116px] my-auto py-4">
          <Separator className="w-6 h-[2px] bg-green-400 " />
          <Separator className="w-6 h-[2px] bg-green-400" />
        </div>
        <div className="m-auto flex flex-col justify-start items-start gap-14">
          <Separator className="h-[120px] w-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start gap-[118px] my-auto">
          <Separator className="w-6 h-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start my-auto">
          <Avatar className="">
            <AvatarImage
              src={games[4]?.winner?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {games[4]?.winner?.username || "user"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 my-auto mx-4 py-4">
          <Avatar className="shadow-lg shadow-yellow-500 rounded-xl">
            <AvatarImage
              src={games[6]?.winner?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {games[6]?.winner?.username || "user"}
            </AvatarFallback>
          </Avatar>
          <Crown size={24} className="text-yellow-500" />
          <div className="w-8 h-8"></div>
        </div>
        <div className="flex flex-col justify-start items-start my-auto">
          <Avatar className="">
            <AvatarImage
              src={games[5]?.winner?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {games[5]?.winner?.username || "user"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-start items-start gap-[118px] my-auto">
          <Separator className="w-6 h-[2px] bg-green-400" />
        </div>
        <div className="m-auto flex flex-col justify-start items-start gap-14">
          <Separator className="h-[120px] w-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start gap-[116px] my-auto py-4">
          <Separator className="w-6 h-[2px] bg-green-400 " />
          <Separator className="w-6 h-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start gap-20 my-auto">
          <Avatar className="">
            <AvatarImage
              src={games[2]?.winner?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {games[2]?.winner?.username || "user"}
            </AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              src={games[3]?.winner?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {games[3]?.winner?.username || "user"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-start items-start gap-[118px] my-auto">
          <Separator className="w-6 h-[2px] bg-green-400" />
          <Separator className="w-6 h-[2px] bg-green-400" />
        </div>
        <div className="w-[1px] m-auto flex flex-col justify-start items-start gap-14">
          <Separator className="h-[60px] w-[2px] bg-green-400" />
          <Separator className="h-[60px] w-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start gap-14 my-auto py-4">
          <Separator className="w-6 h-[2px] bg-green-400 " />
          <Separator className="w-6 h-[2px] bg-green-400" />
          <Separator className="w-6 h-[2px] bg-green-400" />
          <Separator className="w-6 h-[2px] bg-green-400" />
        </div>
        <div className="flex flex-col justify-start items-start gap-4">
          <Avatar className="">
            <AvatarImage
              src={participants[4]?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {participants[4]?.username || "user"}
            </AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              src={participants[5]?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {participants[5]?.username || "user"}
            </AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              src={participants[6]?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {participants[6]?.username || "user"}
            </AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              src={participants[7]?.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">
              {participants[7]?.username || "user"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Card>
  );
};

export default TournamentBoard;
