const culebritaStart = [
  { x: 9, y: 15 },
];

const drawPiece = (ctx, {x, y}, color) => {
  const size = canvasSize / BOARDCOLUMNS
  // ctx.beginPath();
  ctx.fillStyle = color || "#FF0000";
  ctx.fillRect(x*size,y*size, size, size);
};

const alpha = 0.2

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

const canvasSize = 20 // px
const BOARDCOLUMNS = 20 // cols

const INITBUGS = 25
const INITCULEBRITAS = 500

const useAI = true

let partialBestBrain = {score: -100}

let rounds = 0

const viewLength = 2;
const outputLen = 3 // l c r

const rowsView = viewLength + 1;
const colsView = viewLength + rowsView;
const INPlen = rowsView * colsView
// const INPlen = canvasSize * canvasSize // for all pixels
const INPhalf = Math.floor(INPlen/2)
const LAYERS = [INPlen, INPlen * 2, INPhalf, outputLen]
