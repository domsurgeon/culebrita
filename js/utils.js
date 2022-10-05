// let rounds = 0
// let partialBestBrain = {score: -100}
const UNI = 20

const BOARDCOLUMNS = UNI; // cols
const canvasSize = UNI; // px
const canvasUserSize = 400; // px

const INITBUGS = UNI;
const INITCULEBRIYAS = 500;

const viewLength = 3;

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

const INPlen = rowsView * colsView;
// const INPlen = canvasSize * canvasSize // for all pixels

const INPhalf = Math.floor(INPlen / 2);
const INPquar = Math.floor(INPlen / 4);
const outputLen = 3; // l c r

const LAYERS = [INPlen, outputLen];

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

  console.log("Saved brain on LS");
};
