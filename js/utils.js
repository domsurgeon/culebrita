// let rounds = 0
// let partialBestBrain = {score: -100}
const UNI = 20

const BOARDCOLUMNS = UNI; // cols
const canvasSize = UNI; // px
const canvasUserSize = 400; // px

const INITBUGS = UNI;
const INITCULEBRIYAS = 200;

const viewLength = 1;

const rowsView = viewLength + 1;
const colsView = viewLength + rowsView;

const USERSPEED = 60;
const alpha = 1;

const culebriyaStart = [
  // { x: Math.floor(BOARDCOLUMNS / 2), y: Math.floor(3 * BOARDCOLUMNS / 4) },
  { x: Math.floor(BOARDCOLUMNS / 2), y: Math.floor(BOARDCOLUMNS / 2) },
];

const drawPiece = (ctx, { x, y }, color, isUser) => {
  const size = (isUser ? canvasUserSize : canvasSize) / BOARDCOLUMNS;
  // ctx.beginPath();
  ctx.fillStyle = color || "#FF0000";
  ctx.fillRect(x * size, y * size, size, size);
};

const outputLen = 3; // l c r
const INPlen = rowsView * colsView * 2;
// const INPlen = canvasSize * canvasSize // for all pixels

const LAYERS = [INPlen, INPlen * 2, 4, outputLen];

const lerp = (a, b, interpolation) => a + (b - a) * interpolation;

// eslint-disable-next-line no-unused-vars
const relu = (x) => Math.max(0, x);

// eslint-disable-next-line no-unused-vars
const sigmoid = (x) => 1 / (1 + Math.exp(-x));

// eslint-disable-next-line no-unused-vars
const softmax = (X) => {
  const max = Math.max(...X);
  const scores = X.map((x) => Math.exp(x - max));
  // const scores = X.map(sigmoid)

  const divisor = scores.reduce((a, b) => a + b);
  return scores.map((score) => score / divisor);
};

const save = (winner) => {
  const brainStr = JSON.stringify(winner.brain);
  localStorage.setItem("brain", brainStr);
  localStorage.setItem("best-score", winner.score);

  console.log("Saved", winner.score);
};
