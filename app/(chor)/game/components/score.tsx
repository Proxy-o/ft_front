import { on } from "events";
import React, { useEffect, useState } from "react";
import useGetGame from "../hooks/useGetGames";
import getCookie from "@/lib/functions/getCookie";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { User } from "@/lib/types";
import useGetUser from "@/app/profile/hooks/useGetUser";
import useGetFourGame from "../hooks/useGetFourGame";

export default function Score({ type }: { type: string }) {
  const [leftPlayerScore, setLeftPlayerScore] = useState(0);
  const [rightPlayerScore, setRightPlayerScore] = useState(0);
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const username = user?.username || "";
  let onGoingGame;

  if (type === "two") {
    const { onGoingGame } = useGetGame(user_id || "0", type);
  } else {
    const { onGoingGame } = useGetFourGame(user_id || "0");
  }
  const leftUser: User | undefined =
    onGoingGame?.data?.game?.user1?.username === username
      ? onGoingGame?.data?.game?.user1
      : onGoingGame?.data?.game?.user2;
  const rightUser: User | undefined =
    onGoingGame?.data?.game?.user1?.username === username
      ? onGoingGame?.data?.game?.user2
      : onGoingGame?.data?.game?.user1;

  const { newNotif } = useGameSocket();

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      // toast.info(parsedMessage?.message);
      const message = parsedMessage?.message.split(" ");
      if (message[0] === "/score") {
        message[1] === leftUser?.username
          ? setLeftPlayerScore(parseInt(message[2]))
          : setRightPlayerScore(parseInt(message[2]));
        message[3] === leftUser?.username
          ? setLeftPlayerScore(parseInt(message[4]))
          : setRightPlayerScore(parseInt(message[4]));
      } else if (message[0] === "/end") {
        setLeftPlayerScore(0);
        setRightPlayerScore(0);
      }
    }
  }, [newNotif]);

  if (!leftUser || !rightUser) {
    return <></>;
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center w-5/6 h-16 max-w-[800px] mx-auto">
        <div className="flex flex-row justify-start items-center w-1/2">
          <div className="w-6 h-6 bg-white rounded-full flex justify-center items-center text-black font-bold">
            {leftPlayerScore}
          </div>
          <div className="text-white ml-2">{leftUser?.username}</div>
        </div>
        <div className="flex flex-row justify-end items-center w-1/2">
          <div className="text-white mr-2">{rightUser?.username}</div>
          <div className="w-6 h-6 bg-white rounded-full flex justify-center items-center text-black font-bold">
            {rightPlayerScore}
          </div>
        </div>
      </div>
    </>
  );
}
