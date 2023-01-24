const outputLen = 9;
const UNI = 20;
const reward = 20
const penalty = 1

const BOARDCOLUMNS = UNI;
const STARTPOSITION = [{ x: Math.floor(BOARDCOLUMNS / 2), y: Math.floor(BOARDCOLUMNS / 2) }];

const CANVASSIZE = UNI;
const INITBUGS = UNI;

const drawPiece = ({ x, y }, color) => {
  const ctx = window.display.ctx;

  const size = CANVASSIZE / BOARDCOLUMNS;
  // ctx.beginPath();
  ctx.fillStyle = color || "#FF0000";
  ctx.fillRect(x * size, y * size, size, size);
};


const coordsEqual = (a, b) => a.x === b.x && a.y === b.y;
const clearCanvas = () => {
  window.display.ctx.clearRect(0, 0, window.display.canvas.width, window.display.canvas.height);
}

const Bugs = () => {
  let bugsCount = INITBUGS;
  let bugs = [];
  let positions = new Array(BOARDCOLUMNS * BOARDCOLUMNS).fill(0);
  positions = positions.map((p, i) => ({
    x: i % BOARDCOLUMNS,
    y: Math.floor(i / BOARDCOLUMNS) % BOARDCOLUMNS,
  }));

  positions = positions.filter((b) => !coordsEqual(b, STARTPOSITION[0]));

  while (bugsCount--) {
    const random = Math.floor(Math.random() * positions.length);
    const randomBug = positions.splice(random, 1);

    bugs.push(randomBug[0]);
  }

  return bugs;
}
