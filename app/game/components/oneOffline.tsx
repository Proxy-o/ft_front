import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import CountDown from './contDown';
import Score from './score';

const OneOffline = () => {
    const [startCountdown, setStartCountdown] = useState(false);
    const newBallPositionRef = useRef({ x: 0, y: 0 }); // Use a ref to store the current state
    const newAngleRef = useRef(0); // Use a ref to store the current state
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [leftScore, setLeftScore] = useState(0);
    const leftScoreRef = useRef(0);
    const [rightScore, setRightScore] = useState(0);
    const rightScoreRef = useRef(0);
    const animationFrameId = useRef(0); // To keep track of the animation frame ID
    const isAnimating = useRef(false); 
    useEffect(() => {
        if (!gameStarted) return; // Exit if game is not started
        const canvas = canvasRef.current;
        if (!canvas) return; // Exit if canvas is not available
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return; // Exit if context is not available
        
        rightScoreRef.current = 0;
        leftScoreRef.current = 0;
        setLeftScore(0);
        setRightScore(0);

        let ballInLeftPaddle = false;
        let ballInRightPaddle = false;

        let x = canvas.width / 2;
        let y = canvas.height - canvas.height * Math.random();
        newBallPositionRef.current = { x, y }; // Initialize the ref
        newAngleRef.current = Math.PI;
        
        let ballRadius = 10;

        const paddleHeight = 60;
        const paddleWidth = 10;
        let paddleRightY = (canvas.height - paddleHeight) / 4;
        let paddleLeftY = (canvas.height - paddleHeight) / 4;
        
        let upPressed = false;
        let downPressed = false;
        let wPressed = false;
        let sPressed = false;

        const handleKeyEvent = (e: KeyboardEvent) => {
            if (e.type === 'keydown') {
                if (e.key === "ArrowUp") {
                    upPressed = true;
                } else if (e.key === "ArrowDown") {
                    downPressed = true;
                } else if (e.key === "w") {
                    wPressed = true;
                } else if (e.key === "s") {
                    sPressed = true;
                }
            } else if (e.type === 'keyup') {
                if (e.key === "ArrowUp") {
                    upPressed = false;
                } else if (e.key === "ArrowDown") {
                    downPressed = false;
                } else if (e.key === "w") {
                    wPressed = false;
                } else if (e.key === "s") {
                    sPressed = false;
                }
            }
        };
        
        // Add the event listener for both keydown and keyup events
        document.addEventListener("keydown", handleKeyEvent, false);
        document.addEventListener("keyup", handleKeyEvent, false);


        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(newBallPositionRef.current.x, newBallPositionRef.current.y, ballRadius, 0, Math.PI * 2);
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
            ctx.fillStyle = "#ee95DD";
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
            newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 5;
            newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 5;
        }

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
                            newAngleRef.current = -Math.PI * 2 / 6 * (0.5 - ballPercentageOnPaddle);
                        }
                        else {
                            newAngleRef.current = Math.PI * 2 / 6 * (ballPercentageOnPaddle - 0.5);
                        }
                        ballInLeftPaddle = true;
                    }
                } else {
                    ballInLeftPaddle = false;
                }
                
                if (newBallPositionRef.current.x > canvas.width - paddleWidth - ballRadius
                    && newBallPositionRef.current.y > paddleRightY
                    && newBallPositionRef.current.y < paddleRightY + paddleHeight) {
                        if (!ballInRightPaddle) {
                            let ballPositionOnPaddle = newBallPositionRef.current.y - paddleRightY;
                            let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
                            if (newBallPositionRef.current.y < paddleRightY + paddleHeight / 2) {
                                newAngleRef.current = -Math.PI + Math.PI * 2 / 6 * (0.5 - ballPercentageOnPaddle);
                            } else {
                                newAngleRef.current = Math.PI - Math.PI * 2 / 6 * (ballPercentageOnPaddle - 0.5);
                            }
                        ballInRightPaddle = true;
                    }
            } else {
                ballInRightPaddle = false;
            }
        }

        function movePaddlesOffline() {
            if (canvas === null) return;
            if (upPressed && paddleRightY > 0) {
                paddleRightY -= 7; // Move right paddle up
            }
            if (downPressed && paddleRightY < canvas.height - paddleHeight) {
                paddleRightY += 7; // Move right paddle down
            }
            if (wPressed && paddleLeftY > 0) {
                paddleLeftY -= 7; // Move left paddle down
            }
            if (sPressed && paddleLeftY < canvas.height - paddleHeight) {
                paddleLeftY += 7; // Move left paddle up
            }
        }

        function changeScoreOffline() {
            if (canvas === null) return;
            if (newBallPositionRef.current.x < paddleWidth) {
                rightScoreRef.current = rightScoreRef.current + 1;
                setRightScore(rightScoreRef.current);
                x = canvas.width / 2;
                y = canvas.height / 2;
                newBallPositionRef.current = { x, y };
                newAngleRef.current = Math.random() * Math.PI * (Math.random() > 0.5 ? 1 : -1);
            } else if (newBallPositionRef.current.x > canvas.width - paddleWidth) {
                leftScoreRef.current = leftScoreRef.current + 1;
                setLeftScore(leftScoreRef.current);
                x = canvas.width / 2;
                y = canvas.height / 2;
                newBallPositionRef.current = { x, y };
                newAngleRef.current = Math.random() * Math.PI * (Math.random() > 0.5 ? 1 : -1);
            }
        }
        function checkLoseConditionOffline() {
            if (canvas === null) return;
            if (leftScoreRef.current === 3 || rightScoreRef.current === 3)
            {
                rightScoreRef.current = 0;
                leftScoreRef.current = 0;
                setGameStarted(false);
                setStartCountdown(false);
                if (leftScoreRef.current === 3) {
                    // alert("Left player wins!");
                } else if (rightScoreRef.current === 3) {
                    // alert("Right player wins!");
                }
            }
        }

        const drawOfflineOne = () => {
            if (canvas === null) return;
            if (!gameStarted) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawRightPaddle();
            drawLeftPaddle();

            // Move paddles
            movePaddlesOffline();

            // Check for collision with left paddle
            changeBallDirectionOffline();

            // Check for score
            checkLoseConditionOffline();

            // Change score
            changeScoreOffline();

            // Check for collision with the horizontal walls
            checkCollisionWithHorizontalWalls();

            // Move the ball
            moveBall();
        }


        const animate = () => {
            if (canvas === null) return;
            if (!gameStarted) return; // Exit if game is not started

            drawOfflineOne();
            animationFrameId.current = requestAnimationFrame(animate);
        };

        if (!isAnimating.current) {
            isAnimating.current = true;
            animate();
        }


        return () => {
            // Cleanup function to remove the event listeners and stop the animation loop
            document.removeEventListener("keydown", handleKeyEvent, false);
            document.removeEventListener("keyup", handleKeyEvent, false);

            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            isAnimating.current = false;
        };
    }, [gameStarted]);

    return (
        <div className="w-full h-fit flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl">Ping Pong</h1><br/>
            <Score leftPlayerScore={leftScore} rightPlayerScore={rightScore} />

            {startCountdown ? 
            (
                (gameStarted) ? (
                    <>
                        <div className="border-2 border-white w-fit h-fit">
                            <canvas ref={canvasRef} width="512" height="400"></canvas>
                        </div>
                    </>
                ) : (
                    <CountDown setGameStarted={setGameStarted} setStartCountdown={setStartCountdown} />
                )
            ) : (
                <Button
                onClick={() => {
                    setStartCountdown(true);
                }}
                    className="w-1/2 mt-4"
                >
                    Start Game
                </Button>
            )}
        </div>
    );
};

export default OneOffline;
