import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { Plus } from "lucide-react";
import React from "react";

export default function Players(props: {
  topLeft: React.MutableRefObject<User>;
  topRight: React.MutableRefObject<User>;
  bottomLeft: React.MutableRefObject<User>;
  bottomRight: React.MutableRefObject<User>;
  username: string;
}) {
  const { topLeft, topRight, bottomLeft, bottomRight } = props;

  return (
    <>
      <div className="flex flex-row justify-between items-center w-5/6 h-fit max-w-[800px] mx-auto">
        <div className="w-full flex flex-row justify-between items-center">
          <div className="flex flex-col justify-start items-start">
            <div>
              <Avatar className=" mr-2 ml-auto">
                {topLeft.current.avatar === "none" ? (
                  <div className="rounded-xl h-8 w-8 bg-primary/20 flex justify-center items-center">
                    <Plus size={24} />
                  </div>
                ) : (
                  <>
                    <AvatarImage
                      src={topLeft.current.avatar}
                      alt="profile image"
                      className="rounded-xl h-8 w-8"
                    />
                    <AvatarFallback className="rounded-xl">
                      {topLeft.current.username}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            </div>
            <Avatar className=" mr-2 ml-auto">
              {topRight.current.avatar === "none" ? (
                <div className="rounded-xl h-8 w-8 bg-primary/20 flex justify-center items-center">
                  <Plus size={24} />
                </div>
              ) : (
                <>
                  <AvatarImage
                    src={topRight.current.avatar}
                    alt="profile image"
                    className="rounded-xl h-8 w-8"
                  />
                  <AvatarFallback className="rounded-xl">
                    {topRight.current.username}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </div>
          <div className="flex flex-col justify-start items-start">
            <Avatar className=" mr-2 ml-auto">
              {bottomLeft.current.avatar === "none" ? (
                <div className="rounded-xl h-8 w-8 bg-primary/20 flex justify-center items-center">
                  <Plus size={24} />
                </div>
              ) : (
                <>
                  <AvatarImage
                    src={bottomLeft.current.avatar}
                    alt="profile image"
                    className="rounded-xl h-8 w-8"
                  />
                  <AvatarFallback className="rounded-xl">
                    {bottomLeft.current.username}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <Avatar className=" mr-2 ml-auto">
              {bottomRight.current.avatar === "none" ? (
                <div className="rounded-xl h-8 w-8 bg-primary/20 flex justify-center items-center">
                  <Plus size={24} />
                </div>
              ) : (
                <>
                  <AvatarImage
                    src={bottomRight.current.avatar}
                    alt="profile image"
                    className="rounded-xl h-8 w-8"
                  />
                  <AvatarFallback className="rounded-xl">
                    {bottomRight.current.username}
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
