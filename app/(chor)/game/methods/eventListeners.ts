import { User } from "@/lib/types";
import { canvasParams } from "../types";

const clickListeners = (
  canvasParams: canvasParams,
  clickedRef: React.MutableRefObject<boolean>,
  rightUser: React.MutableRefObject<User | undefined>,
  leftUser: React.MutableRefObject<User | undefined>,
  handleStartGame: (
    leftUser: string,
    rightUser: string,
    gameId: string
  ) => void,
  handleSurrender: (
    leftUser: string,
    rightUser: string,
    gameId: string
  ) => void,
  surrenderGame: () => void,
  leaveGame: () => void,
  gameIdRef: React.MutableRefObject<string>,
  gameStartedRef: React.MutableRefObject<boolean>,
  ctx: CanvasRenderingContext2D
) => {
  const { canvas } = canvasParams;
  if (canvas === null) return;
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if the click was inside the button
    const startClicked = () => {
      if (
        x > canvas.width - 150 &&
        x < canvas.width &&
        y > canvas.height - 50 &&
        y < canvas.height &&
        !clickedRef.current &&
        rightUser.current?.username !== undefined &&
        gameStartedRef.current === false
      ) {
        console.log("clicked");
        // show a message to the user for 3 seconds
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        handleStartGame(
          leftUser.current?.username || "",
          rightUser.current?.username || "",
          gameIdRef.current
        );
        clickedRef.current = true;
      }
    };
    const surrenderClicked = () => {
      if (
        x > canvas.width - 150 &&
        x < canvas.width &&
        y > canvas.height - 50 &&
        y < canvas.height &&
        !clickedRef.current &&
        gameStartedRef.current === true
      ) {
        console.log("clicked");
        // show a message to the user for 3 seconds
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        surrenderGame();
        handleSurrender(
          leftUser.current?.username || "",
          rightUser.current?.username || "",
          gameIdRef.current
        );
        clickedRef.current = true;
      }
    };
    const leaveClicked = () => {
      if (
        x > 50 &&
        x < 150 &&
        y > canvas.height - 50 &&
        y < canvas.height &&
        !clickedRef.current &&
        gameStartedRef.current === false
      ) {
        console.log("clicked");
        // show a message to the user for 3 seconds
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        leaveGame();
        handleSurrender(
          leftUser.current?.username || "",
          rightUser.current?.username || "",
          gameIdRef.current
        );
      }
    };

    surrenderClicked();
    leaveClicked();
    startClicked();
  });

  canvas.addEventListener("mouseup", (e) => {
    console.log("mouseup");
    clickedRef.current = false;
  });
};

export default clickListeners;
