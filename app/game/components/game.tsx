import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import useSurrenderGame from "../hooks/useSurrender";
import useGameSocket from '@/lib/hooks/useGameSocket'; // Make sure this is the correct path
import useGetGame from '../hooks/useGetGames';
import getCookie from '@/lib/functions/getCookie';
import { toast } from 'sonner';
import useGetUser from '@/app/profile/hooks/useGetUser';
import CountDown from './contDown';
import { User } from '@/lib/types';

const Game = () => {
    const user_id = getCookie("user_id") || "";
    const { data: user, isSuccess } = useGetUser(user_id || "0");
    const username = user?.username || "";
    const [gameStarted, setGameStarted] = useState(false);
    const [startCountdown, setStartCountdown] = useState(false);
    const newPaddleRightYRef = useRef(0); // Use a ref to store the current state
    
    const { mutate: surrenderGame } = useSurrenderGame();
    const { newNotif, handleStartGame, handleSurrender, handleMovePaddle } = useGameSocket();
    const { onGoingGame } = useGetGame(user_id || "0");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rightUser: User | undefined = (onGoingGame.data?.game?.user1?.username === username) ? onGoingGame.data?.game?.user2 : onGoingGame.data?.game?.user1;
    const leftUser: User | undefined = (onGoingGame.data?.game?.user1?.username === username) ? onGoingGame.data?.game?.user1 : onGoingGame.data?.game?.user2;

    useEffect(() => {
        if (!gameStarted) return; // Exit if game is not started
        const canvas = canvasRef.current;
        if (!canvas) return; // Exit if canvas is not available
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return; // Exit if context is not available
        
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let dx: number;
        if (leftUser?.username === onGoingGame.data?.game?.user1?.username) {
            dx = 2;
        } else {
            dx = -2;
        }
        let dy = -2;
        let ballRadius = 10;
        
        const paddleHeight = 75;
        const paddleWidth = 10;
        let paddleRightY = (canvas.height - paddleHeight) / 2;
        let paddleLeftY = (canvas.height - paddleHeight) / 2;
        
        newPaddleRightYRef.current = paddleRightY; // Initialize the ref

        let upPressed = false;
        let downPressed = false;
//      let zPressed = false;
//         let sPressed = false;

        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                upPressed = true;
            } else if (e.key === "ArrowDown") {
                downPressed = true;
            // } else if (e.key === "w") {
            //     zPressed = true;
            // } else if (e.key === "s") {
            //     sPressed = true;
            }
        };

        const keyUpHandler = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                upPressed = false;
            } else if (e.key === "ArrowDown") {
                downPressed = false;
            // } else if (e.key === "w") {
            //     zPressed = false;
            // } else if (e.key === "s") {
            //     sPressed = false;
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
            ctx.rect(canvas.width - paddleWidth, newPaddleRightYRef.current, paddleWidth, paddleHeight);
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

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawRightPaddle();
            drawLeftPaddle();

            if (upPressed && paddleLeftY > 0) {
                paddleLeftY -= 14;
                handleMovePaddle(paddleLeftY, rightUser?.username || "");
            } else if (downPressed && paddleLeftY < canvas.height - paddleHeight) {
                paddleLeftY += 14;
                handleMovePaddle(paddleLeftY, rightUser?.username || "");
            }

            // Check for collision with right paddle
            if (x + dx > canvas.width - ballRadius - paddleWidth && y > newPaddleRightYRef.current && y < newPaddleRightYRef.current + paddleHeight) {
                dx = -dx;
            }

            // Check for collision with left paddle
            if (x + dx < ballRadius + paddleWidth && y > paddleLeftY && y < paddleLeftY + paddleHeight) {
                dx = -dx;
            }

            if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
                dy = -dy;
            }

            if (x > canvas.width / 2) {
                x += dx;
                y += dy;
            }

            // Update the ball's position on the server
        };
        
        let notif; 
        const animate = () => {
            notif = newNotif();
            if (notif) {
                const message = JSON.parse(notif.data);
                if (message.message?.split(" ")[0] === "/move") {
                    newPaddleRightYRef.current = parseInt(message.message.split(" ")[1]); // Update the ref
                }
            }
            draw(); // Call draw without passing newPaddleRightY
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
        };
    }, [gameStarted]);

    useEffect(() => {
        const notif = newNotif();
        if (notif) {
            const message = JSON.parse(notif.data);
            if (message.message?.split(" ")[0] === "/show") {
                setStartCountdown(true);
            } else if (message.message?.split(" ")[0] === "/end") {
                setGameStarted(false);
                onGoingGame.refetch();
                if (message.message?.split(" ")[1] === username) {
                    toast.success("You have won the game");
                }
                if (message.message?.split(" ")[2] === username) {
                    toast.error("You have lost the game");
                }
            } else if (message.message?.split(" ")[0] === "/move") {
                newPaddleRightYRef.current = parseInt(message.message.split(" ")[1]); // Update the ref
            }
        }
    }, [newNotif]);


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
