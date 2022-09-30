let rounds = 0
let partialBestBrain = {score: -100}

const BOARDCOLUMNS = 20 // cols
const canvasSize = 20 // px
const canvasUserSize = 60 // px

const INITBUGS = 25
const INITCULEBRITAS = 500

const viewLength = 3;

const rowsView = viewLength + 1;
const colsView = viewLength + rowsView;

const USERSPEED = 60
const alpha = 0.2

const culebritaStart = [
  { x: Math.floor(BOARDCOLUMNS / 2), y: Math.floor(3 * BOARDCOLUMNS / 4) },
];

const drawPiece = (ctx, {x, y}, color, isUser) => {
  const size = (isUser? canvasUserSize : canvasSize) / BOARDCOLUMNS
  // ctx.beginPath();
  ctx.fillStyle = color || "#FF0000";
  ctx.fillRect(x*size,y*size, size, size);
};

const INPlen = rowsView * colsView
// const INPlen = canvasSize * canvasSize // for all pixels
const INPhalf = Math.floor(INPlen/2)
const INPquar = Math.floor(INPlen/4)
const outputLen = 3 // l c r

const LAYERS = [INPlen, INPlen, outputLen]

const lerp = (a, b, interpolation) => a + (b - a) * interpolation

// eslint-disable-next-line no-unused-vars
const relu = x => Math.max(0, x)

// eslint-disable-next-line no-unused-vars
const sigmoid = x => 1 / (1 + Math.exp(-x))

// eslint-disable-next-line no-unused-vars
const softmax = X => {
  const max = Math.max(...X)
  const scores = X.map(x => Math.exp(x - max))
  // const scores = X.map(sigmoid)

  const divisor = scores.reduce((a, b) => a + b)
  return scores.map(score => score / divisor)
}
