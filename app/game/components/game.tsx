import React, { useRef, useEffect, useState, use } from 'react';
import { Button } from "@/components/ui/button";
import useSurrenderGame from "../hooks/useSurrender";
import useGameSocket from '@/lib/hooks/useGameSocket';
import useGetGame from '../hooks/useGetGames';
import getCookie from '@/lib/functions/getCookie';

const Game = () => {
    const user_id = getCookie("user_id") || "";
    const [gameStarted, setGameStarted] = useState(false);
    const { mutate: surrenderGame } = useSurrenderGame();
    const {handelSendInvitation, newNotif, handleAcceptInvitation, handleStartGame} = useGameSocket();
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

        let countdown = 3;
        const startCountdown = () => {
            if (countdown === 0) return;
            ctx.font = "30px Arial";
            ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
            countdown--;
        };
        
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setTimeout(startCountdown, 1000);
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
                alert("Game Over");
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
            setGameStarted(true)
            // onGoingGame.refetch();
        }
    }
    , [newNotif()]);
    return (
        <div className="w-full h-full flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl">Ping Pong</h1><br/>

            {gameStarted ? (
                <div className="border-2 border-white w-fit h-fit">
                    <canvas ref={canvasRef} width="480" height="320"></canvas>
                </div>
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
