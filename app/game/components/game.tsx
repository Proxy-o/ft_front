import React, { useRef, useEffect, useState, use } from 'react';
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
    const newBallPositionRef = useRef({ x: 0, y: 0 }); // Use a ref to store the current state
    const newAngleRef = useRef(0); // Use a ref to store the current state
    const { mutate: surrenderGame } = useSurrenderGame();
    const { newNotif, handleStartGame, handleSurrender, handleMovePaddle, handleChangeBallDirection } = useGameSocket();
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
        
        let ballInLeftPaddle = false;

        let x = canvas.width / 2;
        let y = canvas.height / 2;
        newBallPositionRef.current = { x, y }; // Initialize the ref
        let angle = Math.random() * Math.PI * 2 * (Math.random() > 0.5 ? 1 : -1);
        newAngleRef.current = angle; // Initialize the ref
        if (leftUser?.username !== onGoingGame.data?.game?.user1?.username) {
            newAngleRef.current = Math.PI - angle;
        }
        let ballRadius = 10;
        
        const paddleHeight = 75;
        const paddleWidth = 10;
        let paddleRightY = (canvas.height - paddleHeight) / 2;
        let paddleLeftY = (canvas.height - paddleHeight) / 2;
        
        newPaddleRightYRef.current = paddleRightY; // Initialize the ref

        let upPressed = false;
        let downPressed = false;

        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                upPressed = true;
            } else if (e.key === "ArrowDown") {
                downPressed = true;
            }
        };

        document.addEventListener("keydown", keyDownHandler, false);

        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(newBallPositionRef.current.x, newBallPositionRef.current.y, ballRadius, 0, Math.PI * 2);
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
                upPressed = false;
            } else if (downPressed && paddleLeftY < canvas.height - paddleHeight) {
                paddleLeftY += 14;
                handleMovePaddle(paddleLeftY, rightUser?.username || "");
                downPressed = false;
            }
            
            // Check for collision with left paddle
            if (newBallPositionRef.current.x < paddleWidth + ballRadius 
                && newBallPositionRef.current.y > paddleLeftY 
                && newBallPositionRef.current.y < paddleLeftY + paddleHeight) {
                    // dx = -dx;
                    if (!ballInLeftPaddle) {
                        newAngleRef.current = Math.PI - newAngleRef.current;
                        let enemyX = canvas.width - newBallPositionRef.current.x;
                        let enemyY = newBallPositionRef.current.y;
                        let enemyAngle = Math.PI - newAngleRef.current;
                        handleChangeBallDirection(enemyX, enemyY, enemyAngle, rightUser?.username || "");
                        ballInLeftPaddle = true;
                    }
            } else {
                ballInLeftPaddle = false;
            }

            // Check for collision with the horizontal walls            
            if (newBallPositionRef.current.y > canvas.height - ballRadius 
                || newBallPositionRef.current.y < ballRadius) {
                newAngleRef.current = -newAngleRef.current;
            }

            // Move the ball
            if (user?.username === leftUser?.username)
                newBallPositionRef.current.x += Math.cos(newAngleRef.current);
            else
                newBallPositionRef.current.x -= Math.cos(newAngleRef.current);
            newBallPositionRef.current.y += Math.sin(newAngleRef.current);
        };

        const animate = () => {
            draw(); // Call draw without passing newPaddleRightY
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
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
            } else if (message.message?.split(" ")[0] === "/ballDirection") {
                newBallPositionRef.current = { x: parseInt(message.message.split(" ")[1]), y: parseInt(message.message.split(" ")[2]) }; // Update the ref
                newAngleRef.current = parseFloat(message.message.split(" ")[3]); // Update the ref
            }
        }
    }, [newNotif()?.data]);


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
