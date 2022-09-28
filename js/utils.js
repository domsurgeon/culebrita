const culebritaStart = [
  { x: 9, y: 15 },
];

const drawPiece = (ctx, {x, y}, color) => {
  const size = PIECE
  // ctx.beginPath();
  ctx.fillStyle = color || "#FF0000";
  ctx.fillRect(x*size,y*size, size, size);
};

let terminate = false;

let PIECE = 1
