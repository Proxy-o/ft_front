import { useEffect } from "react";
import useGameSocket from "../hooks/useGameSocket";
import useInvitationSocket from "../hooks/useInvitationSocket";
import { User } from "@/lib/types";

const Sockets = (
    { 
        canvasRef,
        PaddleRightYRef,
        newBallPositionRef,
        newAngleRef,
        isFirstTime,
        ballInLeftPaddle,
        upPressedRef,
        downPressedRef,
        paddleRightDirectionRef,
        leftScoreRef,
        rightScoreRef,
        enemyLeftGameRef,
        leftUser,
        rightUser,
        gameIdRef,
        gameStartedRef,
        state,
        changeTime,
        onGoingGame,
        username,
        setCanvas,
        bgImage,
    } : {
        canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
        PaddleRightYRef: React.MutableRefObject<number>,
        newBallPositionRef: React.MutableRefObject<{x: number, y: number}>,
        newAngleRef: React.MutableRefObject<number>,
        isFirstTime: React.MutableRefObject<boolean>,
        ballInLeftPaddle: React.MutableRefObject<boolean>,
        paddleRightDirectionRef: React.MutableRefObject<string>,
        upPressedRef: React.MutableRefObject<boolean>,
        downPressedRef: React.MutableRefObject<boolean>,
        leftScoreRef: React.MutableRefObject<number>,
        rightScoreRef: React.MutableRefObject<number>,
        enemyLeftGameRef: React.MutableRefObject<boolean>,
        leftUser: React.MutableRefObject<User | undefined>,
        rightUser: React.MutableRefObject<User | undefined>,
        gameIdRef: React.MutableRefObject<string>,
        changeTime: (time: number) => void,
        gameStartedRef: React.MutableRefObject<boolean>,
        state: React.MutableRefObject<string>,
        onGoingGame: any,
        username: string,
        setCanvas: React.Dispatch<React.SetStateAction<HTMLCanvasElement | null>>,
        bgImage: React.MutableRefObject<HTMLImageElement | null>,
    }
) => {


  


  return (
    <></>
  );
}

export default Sockets;