function Culebrita(bugs, AI, brain) {
  this.brain = brain || new NeuralNetwork([15, 3]);

  // for input all positions
  // this.brain = brain || new NeuralNetwork([400, 3]);

  this.lost = false
  this.score = 0
  this.bugs = bugs;
  this.drawBugs = (ctx) => {
    this.bugs.forEach((bug) => {
      drawPiece(ctx, bug, `rgba(200,200,200,${alpha})`);
    });
  };

  this.pieces = [...culebritaStart];
  this.direction = "up";
  this.order = "up";

  this.movePieces = () => {
    this.settleOrder();

    let newPiece = this.pieceFromDirection();
    let eaten = !!this.bugs.find(
      (bug) => bug.x === newPiece.x && bug.y === newPiece.y
    );

    if (!eaten) {
      this.pieces.pop();
    } else {
      this.score += 1
      this.bugs = this.bugs.filter(
        (bug) => !(bug.x === newPiece.x && bug.y === newPiece.y)
      );
    }

    this.pieces.unshift(newPiece);
    this.checkCrashOrWin();
  };

  this.settleOrder = () => {
    if (
      (this.order === "up" &&
        (this.direction === "down" || this.direction === "up")) ||
      (this.order === "down" &&
        (this.direction === "up" || this.direction === "down")) ||
      (this.order === "left" &&
        (this.direction === "right" || this.direction === "left")) ||
      (this.order === "right" &&
        (this.direction === "left" || this.direction === "right"))
    ) {
      this.order = this.direction;
    } else {
      this.direction = this.order;
    }
  };

  this.pieceFromDirection = () => {
    const head = this.pieces[0];

    switch (this.direction) {
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
    const head = this.pieces[0];
    if (
      head.x < 0 ||
      head.x > BOARDCOLUMNS - 1 ||
      head.y < 0 ||
      head.y > BOARDCOLUMNS - 1
    ) {
      this.score -= 5
      this.gameOver(':::CRASHED:::')
    }

    const eatenItself = !!this.pieces
      .slice(1)
      .find((p) => p.x === head.x && p.y === head.y);

    if (eatenItself) {
      this.score -= 5
      this.gameOver(':::CANNIBAL:::')
    }

    if (this.bugs.length === 0) {
      this.score += 50
      this.gameOver(':::YOU-WON:::')
    }
  };

  this.predict = () => {
    if (AI) {
      NeuralNetwork.mutate({ amount: Math.random(), network: this.brain });

      const viewLength = 2;
      const rowsView = viewLength + 1;
      const colsView = viewLength + viewLength + 1;

      const head = this.pieces[0];
      let views = new Array(rowsView * colsView).fill(0); // 180 deg x viewLength

      views = views.map((p, i) => {
        let viu;

        switch (this.direction) {
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

      // input all positions
      // let views = new Array(BOARDCOLUMNS * BOARDCOLUMNS).fill(0).map((v,i) => {
      //   const x = i % BOARDCOLUMNS
      //   const y = Math.floor(i / BOARDCOLUMNS) % BOARDCOLUMNS
      //   return {
      //     x, y
      //   }
      // });

      const inputs = views.map((v) => {
        const hasBug = this.bugs.find((b) => b.x === v.x && b.y === v.y);
        const hasWall =
          v.x < 0 ||
          v.x > BOARDCOLUMNS - 1 ||
          v.y < 0 ||
          v.y > BOARDCOLUMNS - 1;
        const hasHead = head.x === v.x && head.y === v.y;
        const hasSnake = this.pieces.find((p) => p.x === v.x && p.y === v.y);

        let content = hasBug ? 4 : hasWall ? 3 : hasSnake ? 2 : hasHead ? 1 : 0;

        return content;
      });

      const outputs = NeuralNetwork.feedForward({
        inputs,
        network: this.brain,
      });
      const maxi = Math.max(...outputs);
      const outputOrder = outputs.indexOf(maxi);

      const order = this.orderFromOutput(outputOrder);

      this.order = order;
    }
  };

  this.orderFromOutput = (oup) => {
    let order;

    switch (this.direction) {
      case "up":
        order = oup === 0 ? "left" : oup === 2 ? "right" : this.direction;
        break;
      case "down":
        order = oup === 0 ? "right" : oup === 2 ? "left" : this.direction;
        break;
      case "left":
        order = oup === 0 ? "down" : oup === 2 ? "up" : this.direction;
        break;
      case "right":
        order = oup === 0 ? "up" : oup === 2 ? "down" : this.direction;
        break;
    }
    return order
  };

  this.gameOver = (msg) => {
    // console.log(msg)
    // console.log('score: ', this.score)
    this.lost = true
  }

  this.drawPieces = (ctx) => {
    this.pieces.forEach((piece) => {
      drawPiece(ctx, piece, `rgba(0,190,0,${alpha})`);
    });
  }

  this.update = ({ canvas, ctx, frame }) => {
    this.predict()
    this.movePieces();
    this.drawBugs(ctx);
    this.drawPieces(ctx)
  };

  return this;
}
