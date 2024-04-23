function checkCollisionWithHorizontalWalls(
  canvas: HTMLCanvasElement | null,
  ballRadius: number,
  newBallPositionRef: React.MutableRefObject<{ x: number; y: number }>,
  newAngleRef: React.MutableRefObject<number>
) {
  if (canvas === null) return;
  if (
    newBallPositionRef.current.y > canvas.height - ballRadius ||
    newBallPositionRef.current.y < ballRadius
  ) {
    newAngleRef.current = -newAngleRef.current;
  }
}

export default checkCollisionWithHorizontalWalls;
