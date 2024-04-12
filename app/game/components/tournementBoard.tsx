import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Crown } from "lucide-react";

const TourenementBoard = () => {
  return (
    <Card className="p-4 h-fit w-fit flex flex-col justify-center">
      <div className="mx-auto">Board</div>
      <Separator className="w-full h-[2px] my-4" />
      <div className="flex flex-row ">
        <div className="flex flex-col justify-start items-start gap-4">
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
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
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
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
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 my-auto mx-4 py-4">
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
          <Crown size={24} className="text-yellow-500" />
          <div className="w-8 h-8"></div>
        </div>
        <div className="flex flex-col justify-start items-start my-auto">
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
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
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
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
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
          <Avatar className="">
            <AvatarImage
              //   src={topLeft.avatar}
              alt="profile image"
              className="rounded-xl h-8 w-8"
            />
            <AvatarFallback className="rounded-xl">user</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Card>
  );
};

export default TourenementBoard;
