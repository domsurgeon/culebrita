class Game {
  constructor({ settings }) {
    this.reward = settings.reward
    this.penalty = settings.penalty
    this.BOARDCOLUMNS = settings.BOARDCOLUMNS;
    this.STARTPOSITION = settings.STARTPOSITION;
    this.outputLen = settings.outputLen;
    this.bugs = Bugs();
    this.lost = false;
    this.win = false;
    this.score = this.reward;
    this.hasEaten = false;
    this.snakePieces = [...this.STARTPOSITION];
    this.draw();
  }

  update = ({ action }) => {
    clearCanvas();

    this.moveSnake(action);
    this.draw();

    return this.getReward();
  };

  moveSnake = (action) => {
    const { x, y } = this.snakePieces[0];

    const a = ["up", "right", "down", "left"][action];
    const hy = y + (a === "up" ? -1 : a === "down" ? 1 : 0);
    const hX = x + (a === "left" ? -1 : a === "right" ? 1 : 0);
    const nHead = {
      x: hX,
      y: hy,
    };

    this.snakePieces.unshift(nHead);
    this.eatOrNot();
  };

  eatOrNot = () => {
    const head = this.snakePieces[0];
    const bugs = this.bugs;

    let eaten = bugs.find((bug) => coordsEqual(bug, head));

    if (!eaten) {
      this.snakePieces.pop();
    } else {
      this.hasEaten = true;
      this.bugs = bugs.filter((bug) => !coordsEqual(bug, eaten));
    }
  };

  getReward = () => {
    const head = this.snakePieces[0];
    const movePenalty = this.penalty;
    let reward = -movePenalty;

    const touchedBorder = head.x < 0 || head.x > this.BOARDCOLUMNS - 1 || head.y < 0 || head.y > this.BOARDCOLUMNS - 1;
    const eatenItself = !!this.snakePieces.slice(1).find((p) => coordsEqual(p, head));
    const noBugs = this.bugs.length === 0;
    const starved = this.score <= 0;

    if (touchedBorder) {
      reward -= this.reward;
      this.gameOver(":::CRASHED:::");
    } else if (eatenItself) {
      reward -= this.reward;
      this.gameOver(":::CANNIBAL:::");
    } else if (this.hasEaten) {
      reward += this.reward;
      this.hasEaten = false;
    } else if (noBugs) {
      this.gameOver(":::WON:::");
    } else if (starved) {
      this.gameOver(":::STARVED:::");
    }

    this.score += reward;

    return reward;
  };

  gameOver = (msg) => {
    console.log(msg);
    this.lost = true;
  };

  draw = () => {
    this.drawBugs();
    this.drawPieces();
  };

  drawBugs = () => {
    this.bugs.forEach((bug) => {
      drawPiece(bug, `rgba(200,200,200,1)`);
    });
  };

  drawPieces = () => {
    this.snakePieces.forEach((piece) => {
      drawPiece(piece, `rgba(0,190,0,1)`);
    });
  };

  getCellContent = (v) => {
    const hasBug = this.bugs.find((b) => coordsEqual(b, v));
    const hasSnake = this.snakePieces.slice(1).find((p) => coordsEqual(p, v));
    const offBounds = v.x < 0 || v.x > this.BOARDCOLUMNS - 1 || v.y < 0 || v.y > this.BOARDCOLUMNS - 1;

    return hasBug ? 1 : hasSnake || offBounds ? -1 : 0;
  };

  getInputState = () => {
    const { x, y } = this.snakePieces[0];
    const cols = Math.sqrt(this.outputLen);
    const offset = Math.floor(cols / 2);
    const ix = x - offset;
    const iy = y - offset;

    const positions = new Array(this.outputLen).fill(0).map((p, i) => {
      const px = ix + (i % cols);
      const py = iy + (Math.floor(i / cols) % cols);

      return this.getCellContent({ x: px, y: py });
    });

    return positions;
  };
}
