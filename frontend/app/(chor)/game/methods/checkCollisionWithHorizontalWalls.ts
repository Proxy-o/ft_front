function checkCollisionWithHorizontalWalls(
  canvas: HTMLCanvasElement | null,
  ballRadius: number,
  newBallPositionRef: React.MutableRefObject<{ x: number; y: number }>,
  newAngleRef: React.MutableRefObject<number>
) {
  if (canvas === null) return;
  if (
    newBallPositionRef.current.y > canvas.height - ballRadius / 2 ||
    newBallPositionRef.current.y < ballRadius / 2
  ) {
    newAngleRef.current = -newAngleRef.current;
  }
}

export default checkCollisionWithHorizontalWalls;
