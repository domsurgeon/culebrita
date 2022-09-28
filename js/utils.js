const culebritaStart = [
  { x: 9, y: 15 },
];

const drawPiece = (ctx, {x, y}, color) => {
  const size = PIECE
  // ctx.beginPath();
  ctx.fillStyle = color || "#FF0000";
  ctx.fillRect(x*size,y*size, size, size);
};

let PIECE = 1

const lerp = (a, b, interpolation) => a + (b - a) * interpolation

// eslint-disable-next-line no-unused-vars
const relu = x => Math.max(0, x)

// eslint-disable-next-line no-unused-vars
// const sigmoid = x => 1 / (1 + Math.exp(-x))

// eslint-disable-next-line no-unused-vars
const softmax = X => {
  const max = Math.max(...X)
  const scores = X.map(x => Math.exp(x - max))
  const divisor = scores.reduce((a, b) => a + b)
  return scores.map(score => score / divisor)
}

const alpha = 0.2

const canvasSize = 20

const culeNum = 50

const BOARDCOLUMNS = 20

let partialBestBrain = {score: -100}
