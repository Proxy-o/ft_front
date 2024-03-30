import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import useSurrenderGame from "../hooks/useSurrender";
import useGameSocket from '@/lib/hooks/useGameSocket'; // Make sure this is the correct path
import getCookie from '@/lib/functions/getCookie';
import { toast } from 'sonner';
import useGetUser from '@/app/profile/hooks/useGetUser';
import CountDown from './contDown';
import { User } from '@/lib/types';

const Game = ({ gameStarted, setGameStarted, gameType, onGoingGame }: { gameStarted: boolean, setGameStarted: (value: boolean) => void, gameType: string, onGoingGame: any }) => {
    const user_id = getCookie("user_id") || "";
    const { data: user } = useGetUser(user_id || "0");
    const username = user?.username || "";
    const [startCountdown, setStartCountdown] = useState(false);
    const PaddleRightYRef = useRef(0); // Use a ref to store the current state
    const PaddleRightYRefTwo = useRef(0); // Use a ref to store the current state
    const newBallPositionRef = useRef({ x: 0, y: 0 }); // Use a ref to store the current state
    const newAngleRef = useRef(0); // Use a ref to store the current state
    const leftPaddleOldY = useRef(0);
    const rightPaddleOldY = useRef(0);
    const { mutate: surrenderGame } = useSurrenderGame();
    const { newNotif, handleStartGame, handleSurrender, handleMovePaddle, handleChangeBallDirection } = useGameSocket();
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
        let ballInRightPaddle = false;

        let x = canvas.width / 2;
        let y = canvas.height / 2;
        newAngleRef.current = Math.random() * Math.PI * (Math.random() > 0.5 ? 1 : -1);
        newBallPositionRef.current = { x, y }; // Initialize the ref
        if (leftUser?.username === onGoingGame.data?.game?.user1?.username) {
            while ((newAngleRef.current > Math.PI * 1 / 4 && newAngleRef.current < Math.PI * 3 / 4)
                || (newAngleRef.current > Math.PI * 5 / 4 && newAngleRef.current < Math.PI * 7 / 4)) {
                newAngleRef.current = Math.random() * Math.PI * (Math.random() > 0.5 ? 1 : -1);
            }
            handleChangeBallDirection(x, y, Math.PI - newAngleRef.current, rightUser?.username || "");
        }
        let ballRadius = 5;

        const paddleHeight = 40;
        const paddleWidth = 10;
        let paddleRightY = (canvas.height - paddleHeight) / 4;
        let paddleRightYTwo = (canvas.height - paddleHeight) * 3 / 4;
        let paddleLeftY = (canvas.height - paddleHeight) / 4;
        let paddleLeftYTwo = (canvas.height - paddleHeight) * 3 / 4;
        
        PaddleRightYRef.current = paddleRightY; // Initialize the ref
        PaddleRightYRefTwo.current = paddleRightYTwo; // Initialize the ref
        leftPaddleOldY.current = paddleLeftY;
        rightPaddleOldY.current = paddleRightY;
        let upPressed = false;
        let offPressed = false;
        let downPressed = false;
        let lPressed = false;
        let wPressed = false;
        let tPressed = false;
        let sPressed = false;
        let gPressed = false;

        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                upPressed = true;
            } else if (e.key === "ArrowDown") {
                downPressed = true;
            } else if (e.key === "w") {
                wPressed = true;
            } else if (e.key === "s") {
                sPressed = true;
            } else if (e.key === "t") {
                tPressed = true;
            } else if (e.key === "g") {
                gPressed = true;
            } else if (e.key === "o") {
                offPressed = true;
            } else if (e.key === "l") {
                lPressed = true;
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
            ctx.rect(canvas.width - paddleWidth, PaddleRightYRef.current, paddleWidth, paddleHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        };

        const drawLeftPaddle = () => {
            ctx.beginPath();
            ctx.rect(0, paddleLeftY, paddleWidth, paddleHeight);
            ctx.fillStyle = "#ee95DD";
            ctx.fill();
            ctx.closePath();
        };

        const drawLeftPaddleTwo = () => {
            ctx.beginPath();
            ctx.rect(0, paddleLeftYTwo, paddleWidth, paddleHeight);
            ctx.fillStyle = "#ee95DD";
            ctx.fill();
            ctx.closePath();
        };

        const drawRightPaddleTwo = () => {
            ctx.beginPath();
            ctx.rect(canvas.width - paddleWidth, PaddleRightYRefTwo.current, paddleWidth, paddleHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        };
        
        function checkCollisionWithHorizontalWalls() {
            if (canvas === null) return;
            if (newBallPositionRef.current.y > canvas.height - ballRadius 
                || newBallPositionRef.current.y < ballRadius) {
                newAngleRef.current = -newAngleRef.current;
            }
        }

        function moveBall() {
            if (user?.username === leftUser?.username)
                newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 3;
            else
                newBallPositionRef.current.x -= Math.cos(newAngleRef.current) * 3;
            newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 3;
        }

        // 1 vs 1 online -------------------------------------------------------------------------------------
        function changeBallDirectionOnline() {
            if (canvas === null) return;
            if (newBallPositionRef.current.x < paddleWidth + ballRadius 
                && newBallPositionRef.current.y > paddleLeftY 
                && newBallPositionRef.current.y < paddleLeftY + paddleHeight) {
                    if (!ballInLeftPaddle) {
                        let ballPositionOnPaddle = newBallPositionRef.current.y - paddleLeftY;
                        let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
                        if (newBallPositionRef.current.y < paddleLeftY + paddleHeight / 2) {
                            newAngleRef.current = -Math.PI * 5 / 6 * (0.5 - ballPercentageOnPaddle);
                        } else {
                            newAngleRef.current = Math.PI * 5 / 6 * (ballPercentageOnPaddle - 0.5);
                        }
                        let enemyX = canvas.width - newBallPositionRef.current.x;
                        let enemyY = newBallPositionRef.current.y;
                        let enemyAngle = Math.PI - newAngleRef.current;
                        handleChangeBallDirection(enemyX, enemyY, enemyAngle, rightUser?.username || "");
                        ballInLeftPaddle = true;
                    }
            } else {
                ballInLeftPaddle = false;
            }
        }
        
        function movePaddlesOnline() {
            if (canvas === null) return;
            if (upPressed && paddleLeftY > 0) {
                if (paddleLeftY - 20 < 0) {
                    paddleLeftY = 0;
                }
                else {
                    paddleLeftY -= 20;
                }
                handleMovePaddle(paddleLeftY, rightUser?.username || "");
            } else if (downPressed && paddleLeftY < canvas.height - paddleHeight) {
                if (paddleLeftY + 20 > canvas.height - paddleHeight) {
                    paddleLeftY = canvas.height - paddleHeight;
                }
                else {
                    paddleLeftY += 20;
                }
                handleMovePaddle(paddleLeftY, rightUser?.username || "");
            }
            upPressed = false;
            downPressed = false;
        }

        const drawOnlineOne = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawRightPaddle();
            drawLeftPaddle();

            // move paddles
            movePaddlesOnline();
            
            // Check for collision with left paddle
            changeBallDirectionOnline();

            // Check for collision with the horizontal walls            
            checkCollisionWithHorizontalWalls();

            // Move the ball
            moveBall();
        };

        // 1 vs 1 offline -------------------------------------------------------------------------------------
        function changeBallDirectionOffline() {
            if (canvas === null) return;
            if (newBallPositionRef.current.x < paddleWidth + ballRadius 
                && newBallPositionRef.current.y > paddleLeftY 
                && newBallPositionRef.current.y < paddleLeftY + paddleHeight) {
                    if (!ballInLeftPaddle) {
                        let ballPositionOnPaddle = newBallPositionRef.current.y - paddleLeftY;
                        let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
                        if (newBallPositionRef.current.y < paddleLeftY + paddleHeight / 2) {
                            newAngleRef.current = -Math.PI + Math.PI * 2 / 6 * (0.5 - ballPercentageOnPaddle);
                        }
                        else {
                            newAngleRef.current = Math.PI - Math.PI * 2 / 6 * (ballPercentageOnPaddle - 0.5);
                        }
                        ballInLeftPaddle = true;
                    }
                } else {
                    ballInLeftPaddle = false;
                }
                
                if (newBallPositionRef.current.x > canvas.width - paddleWidth - ballRadius
                    && newBallPositionRef.current.y > PaddleRightYRef.current
                    && newBallPositionRef.current.y < PaddleRightYRef.current + paddleHeight) {
                        if (!ballInRightPaddle) {
                            let ballPositionOnPaddle = newBallPositionRef.current.y - PaddleRightYRef.current;
                            let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
                            if (newBallPositionRef.current.y < PaddleRightYRef.current + paddleHeight / 2) {
                                newAngleRef.current = -Math.PI * 2 / 6 * (0.5 - ballPercentageOnPaddle);
                            } else {
                                newAngleRef.current = Math.PI * 2 / 6 * (ballPercentageOnPaddle - 0.5);
                            }
                        ballInRightPaddle = true;
                    }
            } else {
                ballInRightPaddle = false;
            }
        }

        function movePaddlesOffline() {
            if (canvas === null) return;
            if (upPressed && PaddleRightYRef.current > 0) {
                if (PaddleRightYRef.current - 20 < 0) {
                    PaddleRightYRef.current = 0;
                }
                else {
                    PaddleRightYRef.current -= 20;
                }
            } else if (downPressed && PaddleRightYRef.current < canvas.height - paddleHeight) {
                if (PaddleRightYRef.current + 20 > canvas.height - paddleHeight) {
                    PaddleRightYRef.current = canvas.height - paddleHeight;
                }
                else {
                    PaddleRightYRef.current += 20;
                }
            } else
            if (wPressed && paddleLeftY > 0) {
                if (paddleLeftY - 20 < 0) {
                    paddleLeftY = 0;
                }
                else {
                    paddleLeftY -= 20;
                }
            } else
            if (sPressed && paddleLeftY < canvas.height - paddleHeight) {
                if (paddleLeftY + 20 > canvas.height - paddleHeight) {
                    paddleLeftY = canvas.height - paddleHeight;
                }
                else {
                    paddleLeftY += 20;
                }
            }
            wPressed = false;
            sPressed = false;
            downPressed = false;
            upPressed = false;
        }

        const drawOfflineOne = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawRightPaddle();
            drawLeftPaddle();

            //move paddles
            movePaddlesOffline();

            // Check for collision with left paddle
            changeBallDirectionOffline();

            // Check for collision with the horizontal walls
            checkCollisionWithHorizontalWalls();

            // Move the ball
            moveBall();
        }


        // 2 vs 2 online -------------------------------------------------------------------------------------
        function movePaddlesOfflineTwo() {
            if (canvas === null) return;
            if (wPressed && paddleLeftY > 0) {
                if (paddleLeftY - 20 < 0) {
                    paddleLeftY = 0;
                }
                else {
                    paddleLeftY -= 20;
                }
            } else if (sPressed && paddleLeftY < canvas.height / 2 - paddleHeight) {
                if (paddleLeftY + 20 > canvas.height / 2 - paddleHeight) {
                    paddleLeftY = canvas.height - paddleHeight;
                }
                else {
                    paddleLeftY += 20;
                }
            } else if (tPressed && paddleLeftYTwo > canvas.height / 2) {
                if (paddleLeftYTwo - 20 < canvas.height / 2) {
                    paddleLeftYTwo = canvas.height / 2;
                }
                else {
                    paddleLeftYTwo -= 20;
                }
            } else if (gPressed && paddleLeftYTwo < canvas.height - paddleHeight) {
                if (paddleLeftYTwo + 20 > canvas.height - paddleHeight) {
                    paddleLeftYTwo = canvas.height - paddleHeight;
                }
                else {
                    paddleLeftYTwo += 20;
                }
            } else if (upPressed && PaddleRightYRef.current > 0) {
                if (PaddleRightYRef.current - 20 < 0) {
                    PaddleRightYRef.current = 0;
                }
                else {
                    PaddleRightYRef.current -= 20;
                }
            } else if (downPressed && PaddleRightYRef.current < canvas.height / 2 - paddleHeight) {
                if (PaddleRightYRef.current + 20 > canvas.height / 2 - paddleHeight) {
                    PaddleRightYRef.current = canvas.height / 2 - paddleHeight;
                }
                else {
                    PaddleRightYRef.current += 20;
                }
            } else if (offPressed && PaddleRightYRefTwo.current > canvas.height / 2) {
                if (PaddleRightYRefTwo.current - 20 < canvas.height / 2) {
                    PaddleRightYRefTwo.current = canvas.height / 2;
                }
                else {
                    PaddleRightYRefTwo.current -= 20;
                }
            } else if (lPressed && PaddleRightYRefTwo.current < canvas.height - paddleHeight) {
                if (PaddleRightYRefTwo.current + 20 > canvas.height - paddleHeight) {
                    PaddleRightYRefTwo.current = canvas.height - paddleHeight;
                }
                else {
                    PaddleRightYRefTwo.current += 20;
                }
            }
            wPressed = false;
            sPressed = false;
            tPressed = false;
            gPressed = false;
            upPressed = false;
            downPressed = false;
            lPressed = false;
            offPressed = false;
        }

        function changeBallDirectionOfflineTwo() {
            if (canvas === null) return;
            if (newBallPositionRef.current.x < paddleWidth + ballRadius 
                && newBallPositionRef.current.y > paddleLeftY 
                && newBallPositionRef.current.y < paddleLeftY + paddleHeight) {
                    if (!ballInLeftPaddle) {
                        let ballPositionOnPaddle = newBallPositionRef.current.y - paddleLeftY;
                        let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
                        if (newBallPositionRef.current.y < paddleLeftY + paddleHeight / 2) {
                            newAngleRef.current = -Math.PI + Math.PI * 2 / 6 * (0.5 - ballPercentageOnPaddle);
                        }
                        else {
                            newAngleRef.current = Math.PI - Math.PI * 2 / 6 * (ballPercentageOnPaddle - 0.5);
                        }
                        ballInLeftPaddle = true;
                    }
                } else {
                    ballInLeftPaddle = false;
                }
            if (newBallPositionRef.current.x < paddleWidth + ballRadius
                && newBallPositionRef.current.y > paddleLeftYTwo
                && newBallPositionRef.current.y < paddleLeftYTwo + paddleHeight) {
                    if (!ballInLeftPaddle) {
                        let ballPositionOnPaddle = newBallPositionRef.current.y - paddleLeftYTwo;
                        let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
                        if (newBallPositionRef.current.y < paddleLeftYTwo + paddleHeight / 2) {
                            newAngleRef.current = -Math.PI + Math.PI * 2 / 6 * (0.5 - ballPercentageOnPaddle);
                        }
                        else {
                            newAngleRef.current = Math.PI - Math.PI * 2 / 6 * (ballPercentageOnPaddle - 0.5);
                        }
                        ballInLeftPaddle = true;
                    }
                }
                
                if (newBallPositionRef.current.x > canvas.width - paddleWidth - ballRadius
                    && newBallPositionRef.current.y > PaddleRightYRef.current
                    && newBallPositionRef.current.y < PaddleRightYRef.current + paddleHeight) {
                        if (!ballInRightPaddle) {
                            let ballPositionOnPaddle = newBallPositionRef.current.y - PaddleRightYRef.current;
                            let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
                            if (newBallPositionRef.current.y < PaddleRightYRef.current + paddleHeight / 2) {
                                newAngleRef.current = -Math.PI * 2 / 6 * (0.5 - ballPercentageOnPaddle);
                            } else {
                                newAngleRef.current = Math.PI * 2 / 6 * (ballPercentageOnPaddle - 0.5);
                            }
                        ballInRightPaddle = true;
                    }
            } else {
                ballInRightPaddle = false;
            }

            if (newBallPositionRef.current.x > canvas.width - paddleWidth - ballRadius
                && newBallPositionRef.current.y > PaddleRightYRefTwo.current
                && newBallPositionRef.current.y < PaddleRightYRefTwo.current + paddleHeight) {
                    if (!ballInRightPaddle) {
                        let ballPositionOnPaddle = newBallPositionRef.current.y - PaddleRightYRefTwo.current;
                        let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
                        if (newBallPositionRef.current.y < PaddleRightYRefTwo.current + paddleHeight / 2) {
                            newAngleRef.current = -Math.PI * 2 / 6 * (0.5 - ballPercentageOnPaddle);
                        } else {
                            newAngleRef.current = Math.PI * 2 / 6 * (ballPercentageOnPaddle - 0.5);
                        }
                    ballInRightPaddle = true;
                }
            }
            else {
                ballInRightPaddle = false;
            }
        }

        const drawOfflineTwo = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawRightPaddle();
            drawLeftPaddle();
            drawRightPaddleTwo();
            drawLeftPaddleTwo();


            //move paddles
            movePaddlesOfflineTwo();

            // Check for collision with left paddle
            changeBallDirectionOfflineTwo();

            // Check for collision with the horizontal walls
            checkCollisionWithHorizontalWalls();

            // Move the ball
            moveBall();
        }

        const animate = () => {
            if (canvas === null) return;
            // drawOnlineOne();
            drawOfflineOne();
            // drawOfflineTwo();
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [gameStarted]);

    useEffect(() => {
        const notif = newNotif();
        if (notif && gameType === "online") {
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
                PaddleRightYRef.current = parseInt(message.message.split(" ")[1]); // Update the ref
            } else if (message.message?.split(" ")[0] === "/ballDirection") {
                newBallPositionRef.current = { x: parseInt(message.message.split(" ")[1]), y: parseInt(message.message.split(" ")[2]) }; // Update the ref
                newAngleRef.current = parseFloat(message.message.split(" ")[3]); // Update the ref
            }
        }
    }, [newNotif()?.data]);


    return (
        <div className="w-fit h-fit flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl">Ping Pong</h1><br/>
            {startCountdown ? 
            (
                (gameStarted) ? (
                    <div className="border-2 border-white w-fit h-fit">
                        <canvas ref={canvasRef} width="512" height="400"></canvas>
                    </div>
                ) : (
                    <CountDown setGameStarted={setGameStarted} setStartCountdown={setStartCountdown} />
                )
            ) : (
                <Button
                onClick={() => {
                    if (gameType === "online") {
                        handleStartGame(onGoingGame.data?.game?.user1.username || "", onGoingGame.data?.game?.user2.username || "");
                    } else {
                        setStartCountdown(true);
                    }
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
