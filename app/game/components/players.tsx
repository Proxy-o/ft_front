import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { Plus } from "lucide-react";
import useSendInvitation from "../hooks/useSendInvitation";
import { useState } from "react";
import InviteFriends from "./inviteFriend";

export default function Players(props: {
  topLeft: User;
  topRight: User;
  bottomLeft: User;
  bottomRight: User;
  username: string;
}) {
  const { mutate: invite } = useSendInvitation();
  const { topLeft, topRight, bottomLeft, bottomRight } = props;
  const [showInvite, setShowInvite] = useState(true);

  return (
    <>
      <div className="flex flex-row justify-between items-center w-5/6 h-fit max-w-[800px] mx-auto">
        <div className="w-full flex flex-row justify-between items-center">
          <div className="flex flex-col justify-start items-start">
            <div>
              <Avatar className=" mr-2 ml-auto">
                {topLeft.avatar === "none" ? (
                  <div className="rounded-xl h-8 w-8 bg-primary/20 flex justify-center items-center">
                    <Plus size={24} />
                  </div>
                ) : (
                  <>
                    <AvatarImage
                      src={topLeft.avatar}
                      alt="profile image"
                      className="rounded-xl h-8 w-8"
                    />
                    <AvatarFallback className="rounded-xl">
                      {topLeft.username}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            </div>
            <Avatar className=" mr-2 ml-auto">
              {topRight.avatar === "none" ? (
                <div className="rounded-xl h-8 w-8 bg-primary/20 flex justify-center items-center">
                  <Plus size={24} />
                </div>
              ) : (
                <>
                  <AvatarImage
                    src={topRight.avatar}
                    alt="profile image"
                    className="rounded-xl h-8 w-8"
                  />
                  <AvatarFallback className="rounded-xl">
                    {topRight.username}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </div>
          <div className="flex flex-col justify-start items-start">
            <Avatar className=" mr-2 ml-auto">
              {bottomLeft.avatar === "none" ? (
                <div className="rounded-xl h-8 w-8 bg-primary/20 flex justify-center items-center">
                  <Plus size={24} />
                </div>
              ) : (
                <>
                  <AvatarImage
                    src={bottomLeft.avatar}
                    alt="profile image"
                    className="rounded-xl h-8 w-8"
                  />
                  <AvatarFallback className="rounded-xl">
                    {bottomLeft.username}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <Avatar className=" mr-2 ml-auto">
              {bottomRight.avatar === "none" ? (
                <div className="rounded-xl h-8 w-8 bg-primary/20 flex justify-center items-center">
                  <Plus size={24} />
                </div>
              ) : (
                <>
                  <AvatarImage
                    src={bottomRight.avatar}
                    alt="profile image"
                    className="rounded-xl h-8 w-8"
                  />
                  <AvatarFallback className="rounded-xl">
                    {bottomRight.username}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </div>
        </div>
      </div>
    </>
  );
}
