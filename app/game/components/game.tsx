import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import useSurrenderGame from "../hooks/useSurrender";
import useGameSocket from '@/lib/hooks/useGameSocket';
import useGetGame from '../hooks/useGetGames';
import getCookie from '@/lib/functions/getCookie';
import { toast } from 'sonner';
import useGetUser from '@/app/profile/hooks/useGetUser';
import CountDown from './contDown';

const Game = () => {
    let username = "";
    const user_id = getCookie("user_id") || "";
    const { data: user, isSuccess } = useGetUser(user_id || "0");
    if ( isSuccess && user) {
        username = user.username || "";
    }
    const [gameStarted, setGameStarted] = useState(false);
    const [startCountdown, setStartCountdown] = useState(false);
    const { mutate: surrenderGame } = useSurrenderGame();
    const { newNotif, handleStartGame, handleSurrender } = useGameSocket();
    const { onGoingGame } = useGetGame(user_id || "0");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!gameStarted) return; // Exit if game is not started

        const canvas = canvasRef.current;
        if (!canvas) return; // Exit if canvas is not available

        const ctx = canvas.getContext('2d');
        if (!ctx) return; // Exit if context is not available

        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let dx = 2;
        let dy = -2;
        let ballRadius = 10;

        // Paddle
        const paddleHeight = 75;
        const paddleWidth = 10;
        let paddleRightY = (canvas.height - paddleHeight) / 2;
        let paddleLeftY = (canvas.height - paddleHeight) / 2;

        let upPressed = false;
        let downPressed = false;
        let zPressed = false;
        let sPressed = false;

        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                upPressed = true;
            } else if (e.key === "ArrowDown") {
                downPressed = true;
            } else if (e.key === "w") {
                zPressed = true;
            } else if (e.key === "s") {
                sPressed = true;
            }
        };

        const keyUpHandler = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                upPressed = false;
            } else if (e.key === "ArrowDown") {
                downPressed = false;
            } else if (e.key === "w") {
                zPressed = false;
            } else if (e.key === "s") {
                sPressed = false;
            }
        };

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        };

        const drawRightPaddle = () => {
            ctx.beginPath();
            ctx.rect(canvas.width - paddleWidth, paddleRightY, paddleWidth, paddleHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        };

        const drawLeftPaddle = () => {
            ctx.beginPath();
            ctx.rect(0, paddleLeftY, paddleWidth, paddleHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        };

        // const startCountdown = () => {
        //     let countdown = 3;
        //     while (countdown > 0) {
        //         ctx.font = "30px Arial";
        //         ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
        //         setTimeout(() => {
        //             ctx.clearRect(0, 0, canvas.width, canvas.height);
        //         }
        //         , 1000);
        //         countdown--;
        //     }
        // };
        
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // startCountdown();
            // sleep for 3 seconds
            // setTimeout(() => {
            //     ctx.clearRect(0, 0, canvas.width, canvas.height);
            // }
            // , 3000);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawRightPaddle();
            drawLeftPaddle();

            if (upPressed && paddleRightY > 0) {
                paddleRightY -= 7;
            } else if (downPressed && paddleRightY < canvas.height - paddleHeight) {
                paddleRightY += 7;
            }

            if (zPressed && paddleLeftY > 0) {
                paddleLeftY -= 7;
            } else if (sPressed && paddleLeftY < canvas.height - paddleHeight) {
                paddleLeftY += 7;
            }

            // Check for collision with right paddle
            if (x + dx > canvas.width - ballRadius - paddleWidth && y > paddleRightY && y < paddleRightY + paddleHeight) {
                dx = -dx;
            }

            // Check for collision with left paddle
            if (x + dx < ballRadius + paddleWidth && y > paddleLeftY && y < paddleLeftY + paddleHeight) {
                dx = -dx;
            }

            if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
                dy = -dy;
            }

            x += dx;
            y += dy;

            // Game over condition if ball touches either vertical edge
            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                clearInterval(interval);
                // alert("Game Over");
                // Optionally, reset the game state here
                return;
            }
        };

        const interval = setInterval(draw, 10);

        // Cleanup function to remove event listeners and clear interval
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
            clearInterval(interval);
        };
    }, [gameStarted]); // Depend on gameStarted to re-run effect when game starts

    useEffect(() => {
        const notif = newNotif();
        const message = notif && JSON.parse(notif?.data) || "";
        if (message && message.message?.split(" ")[0] === "/show") {
            // invitaionsData.refetch();
            setStartCountdown(true)
            // onGoingGame.refetch();
        } else if (message && message.message?.split(" ")[0] === "/end") { // end surrenderer winner
            // invitaionsData.refetch();
            setGameStarted(false)
            onGoingGame.refetch();
            if (message.message?.split(" ")[1] === username) {
                toast.success("You have won the game");
            }
            if (message.message?.split(" ")[2] === username) {
                toast.error("You have lost the game");
            }
                // onGoingGame.refetch();
        }
        console.log("notif", notif);
    }
    , [newNotif()]);
    return (
        <div className="w-full h-full flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl">Ping Pong</h1><br/>
            {startCountdown ? 
            (
                (gameStarted) ? (
                    <div className="border-2 border-white w-fit h-fit">
                        <canvas ref={canvasRef} width="480" height="320"></canvas>
                    </div>
                ) : (
                    <CountDown setGameStarted={setGameStarted} setStartCountdown={setStartCountdown} />
                )
            ) : (
                <Button
                    onClick={() => {
                        handleStartGame(onGoingGame.data?.game?.user1.username || "", onGoingGame.data?.game?.user2.username || "");
                    }}
                    className="w-1/2 mt-4"
                >
                    Start Game
                </Button>
            )}
            <Button
                onClick={() => {
                    surrenderGame();
                    handleSurrender(onGoingGame.data?.game?.user1.username || "", onGoingGame.data?.game?.user2.username || "");
                    onGoingGame.refetch();
                    setGameStarted(false);
                }}
                className="w-1/2 mt-4"
            >
                Surrender
            </Button>
        </div>
    );
};

export default Game;
