function Culebrita(bugs, brain, isUser) {
  // for input all positions
  // this.brain = brain || new NeuralNetwork([400, 3]);
  this.brain = !isUser && (brain || new NeuralNetwork(LAYERS));
  this.lost = false;
  this.score = 0;
  this.bugs = [...bugs];
  this.snakePieces = [...culebritaStart];
  this.snakeDirection = "up";
  this.order = "up";
  this.alpha = isUser ? 1 : alpha;

  this.movePieces = () => {
    this.settleOrder();

    let newPosition = this.pieceFromDirection();
    this.eatFrom(newPosition)
    this.snakePieces.unshift(newPosition);
    this.score += 0.02;
    this.checkCrashOrWin();
  };

  this.eatFrom = (newPosition) => {
    let eaten = this.bugs.find(
      (bug) => bug.x === newPosition.x && bug.y === newPosition.y
    );

    if (!eaten) {
      this.snakePieces.pop();
    } else {
      this.score += bugs.length - this.bugs.length; // incremental
      this.bugs = this.bugs.filter(
        (bug) => !(bug.x === eaten.x && bug.y === eaten.y)
      );
    }
  }

  this.settleOrder = () => {
    if (
      (this.order === "up" &&
        (this.snakeDirection === "down" || this.snakeDirection === "up")) ||
      (this.order === "down" &&
        (this.snakeDirection === "up" || this.snakeDirection === "down")) ||
      (this.order === "left" &&
        (this.snakeDirection === "right" || this.snakeDirection === "left")) ||
      (this.order === "right" &&
        (this.snakeDirection === "left" || this.snakeDirection === "right"))
    ) {
      this.order = this.snakeDirection;
    } else {
      // valid new order
      this.snakeDirection = this.order;
    }
  };

  this.pieceFromDirection = () => {
    const head = this.snakePieces[0];

    switch (this.snakeDirection) {
      case "up":
        return { x: head.x, y: head.y - 1 };
      case "down":
        return { x: head.x, y: head.y + 1 };
      case "right":
        return { x: head.x + 1, y: head.y };
      case "left":
        return { x: head.x - 1, y: head.y };
    }
  };

  this.checkCrashOrWin = () => {
    const head = this.snakePieces[0];
    if (
      head.x < 0 ||
      head.x > BOARDCOLUMNS - 1 ||
      head.y < 0 ||
      head.y > BOARDCOLUMNS - 1
    ) {
      // this.score -= 5
      this.gameOver(":::CRASHED:::");
    }

    const eatenItself = !!this.snakePieces
      .slice(1)
      .find((p) => p.x === head.x && p.y === head.y);

    if (eatenItself) {
      // this.score -= 5
      this.gameOver(":::CANNIBAL:::");
    }

    if (this.bugs.length === 0) {
      this.score += 50;
      this.gameOver(":::YOU-WON:::");
    }
  };

  this.getViewPoints = () => {
    // all board positions
    // let snakeViewPoints = new Array(BOARDCOLUMNS * BOARDCOLUMNS).fill(0).map((v,i) => {
    //   const x = i % BOARDCOLUMNS
    //   const y = Math.floor(i / BOARDCOLUMNS) % BOARDCOLUMNS
    //   return {
    //     x, y
    //   }
    // });
    const head = this.snakePieces[0];
    let snakeViewPoints = new Array(rowsView * colsView).fill(0); // 180 deg x viewLength

    snakeViewPoints = snakeViewPoints.map((p, i) => {
      let viu;

      switch (this.snakeDirection) {
        case "up":
          viu = {
            x: head.x - viewLength + (i % colsView),
            y: head.y + viewLength - (Math.floor(i / colsView) % rowsView),
          };
          break;

        case "down":
          viu = {
            x: head.x + viewLength - (i % colsView),
            y: head.y - viewLength + (Math.floor(i / colsView) % rowsView),
          };
          break;

        case "left":
          viu = {
            x: head.x - viewLength + (Math.floor(i / colsView) % rowsView),
            y: head.y + viewLength - (i % colsView),
          };
          break;

        case "right":
          viu = {
            x: head.x + viewLength - (Math.floor(i / colsView) % rowsView),
            y: head.y - viewLength + (i % colsView),
          };
          break;
      }

      return viu;
    });

    return snakeViewPoints.map(this.getPointContent);
  };

  this.predict = () => {
    NeuralNetwork.mutate({ amount: Math.random(), network: this.brain });

    const inputs = this.getViewPoints();
    const outputs = NeuralNetwork.feedForward({
      inputs,
      network: this.brain,
    });

    this.order = this.orderFromOutput(outputs);
  };

  this.getPointContent = (v) => {
    const head = this.snakePieces[0];
    const hasBug = this.bugs.find((b) => b.x === v.x && b.y === v.y);
    const hasWall =
      v.x < 0 || v.x > BOARDCOLUMNS - 1 || v.y < 0 || v.y > BOARDCOLUMNS - 1;
    const hasSnake = this.snakePieces.slice(1).find((p) => p.x === v.x && p.y === v.y);
    const hasHead = head.x === v.x && head.y === v.y;

    let content = hasBug ? 1 : hasWall ? -1 : hasSnake ? -1 : hasHead ? 0 : 0;

    return content;
  };

  this.orderFromOutput = (allOutputs) => {
    const maxi = Math.max(...allOutputs);
    const outputBestOrder = allOutputs.indexOf(maxi);

    switch (this.snakeDirection) {
      case "up":
        return outputBestOrder === 0
          ? "left"
          : outputBestOrder === 2
          ? "right"
          : this.snakeDirection;
      case "down":
        return outputBestOrder === 0
          ? "right"
          : outputBestOrder === 2
          ? "left"
          : this.snakeDirection;
      case "left":
        return outputBestOrder === 0
          ? "down"
          : outputBestOrder === 2
          ? "up"
          : this.snakeDirection;
      case "right":
        return outputBestOrder === 0
          ? "up"
          : outputBestOrder === 2
          ? "down"
          : this.snakeDirection;
    }
  };

  this.drawBugs = (ctx) => {
    this.bugs.forEach((bug) => {
      drawPiece(ctx, bug, `rgba(200,200,200,${this.alpha})`, isUser);
    });
  };

  this.drawPieces = (ctx) => {
    this.snakePieces.forEach((piece) => {
      drawPiece(ctx, piece, `rgba(0,190,0,${this.alpha})`, isUser);
    });
  };

  this.gameOver = (msg) => {
    this.lost = true;
  };

  this.update = ({ ctx }) => {
    if (!isUser) {
      this.predict();
    }
    this.movePieces();
    this.drawBugs(ctx);
    this.drawPieces(ctx);
  };

  return this;
}
