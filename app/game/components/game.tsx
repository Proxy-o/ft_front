const Game = () => {
    let canvas:HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;
    let ctx:CanvasRenderingContext2D;    
    if (canvas !== null) {
            ctx = canvas.getContext("2d")!;

        // Ball
        const ballRadius = 10;
        let x:number = canvas.width / 2;
        let y = canvas.height / 2;
        let angle = Math.random() + 2 * (Math.random() < 0.5 ? -1 : 1);
        let dx = (Math.random() < 0.5 ? -2 : 2);
        let dy = -angle;

        // Paddle
        const paddleHeight = 75;
        const paddleWidth = 10;
        let paddleRightY = (canvas.height - paddleHeight) / 2;
        let PaddleLeftY = (canvas.height - paddleHeight) / 2;


        let upPressed = false;
        let downPressed = false;
        let zPressed = false;
        let sPressed = false;

        
        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                upPressed = true;
            } else if (e.key === "ArrowDown") {
                downPressed = true;
            } else if (e.key === "z") {
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
            } else if (e.key === "z") {
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
            ctx.rect(0, PaddleLeftY, paddleWidth, paddleHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawRightPaddle();
            drawLeftPaddle();


            if (upPressed && paddleRightY > 0) {
                paddleRightY -= 7;
            } else if (downPressed && paddleRightY < canvas.height - paddleHeight) {
                paddleRightY += 7;
            }

            if (zPressed && PaddleLeftY > 0) {
                PaddleLeftY -= 7;
            } else if (sPressed && PaddleLeftY < canvas.height - paddleHeight) {
                PaddleLeftY += 7;
            }

            if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
                dy = -dy;
            }
            if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                if ((y > paddleRightY && y < paddleRightY + paddleHeight) || (y > PaddleLeftY && y < PaddleLeftY + paddleHeight)) {
                    dx = -dx;
                }
                else {
                    // alert("GAME OVER");
                    // document.location.reload();
                    clearInterval(interval);
                }
            }

            x += dx;
            y += dy;
        }
        const interval = setInterval(draw, 10);
    }
    return (
        <div
            className="w-full h-full  flex justify-center items-center text-white"
        >
            <h1 className="text-4xl">Ping Pong</h1><br/>
            {/* <canvas id="myCanvas" width="480" height="320"></canvas> */}
            
        </div>
    );
}

export default Game;