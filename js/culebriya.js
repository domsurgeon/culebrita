function Culebriya(bugs, brain, isUser) {
  this.brain = !isUser && (brain || new NeuralNetwork(LAYERS));
  this.lost = false;
  this.win = false;
  this.score = 0;
  this.reSpawns = 0
  this.bugs = [...bugs];
  this.snakePieces = [...culebriyaStart];
  this.snakeDirection = "up";
  this.order = "up";
  this.alpha = isUser ? 1 : alpha;

  this.recharge = (newBrain, bugis) => {
    this.brain = newBrain || new NeuralNetwork(LAYERS);
    this.lost = false
    this.win = false
    this.score = 0
    this.reSpawns = 0
    this.bugs = [...bugis];
    this.snakePieces = [...culebriyaStart];
    this.snakeDirection = "up";
    this.order = "up";
  }

  this.reload = (bestBrain) => {
    this.brain = bestBrain
    this.lost = false
    this.win = false
    this.score = 0
    this.reSpawns = 0
    this.bugs = [...bugs];
    this.snakePieces = [...culebriyaStart];
    this.snakeDirection = "up";
    this.order = "up";
  }

  this.movePieces = () => {
    this.settleOrder();

    let newPosition = this.pieceFromDirection();
    this.eatFrom(newPosition);
    this.snakePieces.unshift(newPosition);
    // this.score -= 0.02;
    this.newState();
  };

  this.eatFrom = (newPosition) => {
    let eaten = this.bugs.find(
      (bug) => bug.x === newPosition.x && bug.y === newPosition.y
    );

    if (!eaten) {
      this.snakePieces.pop();
    } else {
      // this.score += bugs.length - this.bugs.length; // incremental
      this.score += 10;
      this.bugs = this.bugs.filter(
        (bug) => !(bug.x === eaten.x && bug.y === eaten.y)
      );
    }
  };

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

  this.newState = () => {
    const head = this.snakePieces[0];
    if (
      head.x < 0 ||
      head.x > BOARDCOLUMNS - 1 ||
      head.y < 0 ||
      head.y > BOARDCOLUMNS - 1
    ) {
      this.die(":::CRASHED:::");
    }

    const eatenItself = !!this.snakePieces
      .slice(1)
      .find((p) => p.x === head.x && p.y === head.y);

    if (eatenItself) {
      this.die(":::CANNIBAL:::");
    }

    if (this.bugs.length === 0) {
      this.win = true
      console.log(this.reSpawns)
    }
  };

  this.getViewPoints = (content) => {
    // all board positions
    // this.snakeViewPoints = new Array(BOARDCOLUMNS * BOARDCOLUMNS).fill(0).map((v,i) => {
    //   const x = i % BOARDCOLUMNS
    //   const y = Math.floor(i / BOARDCOLUMNS) % BOARDCOLUMNS
    //   return {
    //     x, y
    //   }
    // });

    const head = this.snakePieces[0];
    this.snakeViewPoints = new Array(rowsView * colsView).fill(0); // 180 deg x viewLength

    this.snakeViewPoints = this.snakeViewPoints.map((p, i) => {
      let viu;

      switch (this.snakeDirection) {
        case "up":
          viu = {
            x: head.x - viewLength + (i % colsView),
            y: head.y - viewLength + (Math.floor(i / colsView) % rowsView),
          };
          break;

        case "down":
          viu = {
            x: head.x + viewLength - (i % colsView),
            y: head.y + viewLength - (Math.floor(i / colsView) % rowsView),
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

    return this.snakeViewPoints.map((v) => this.getPointContent(v, content));
  };

  this.predict = () => {
    NeuralNetwork.mutate({ amount: Math.random(), network: this.brain });

    const rewardPoints = this.getViewPoints('rewards');
    const dangerPoints = this.getViewPoints('danger');
    const inputs = [ ... rewardPoints, ...dangerPoints ]

    const outputs = NeuralNetwork.feedForward({
      inputs,
      network: this.brain,
    });

    this.order = this.orderFromOutput(outputs);
  };

  this.getPointContent = (v, contentFilter) => {
    const hasBug = this.bugs.find((b) => b.x === v.x && b.y === v.y);
    const hasWall =
      v.x < 0 || v.x > BOARDCOLUMNS - 1 || v.y < 0 || v.y > BOARDCOLUMNS - 1;
    const hasSnake = this.snakePieces
      .slice(1)
      .find((p) => p.x === v.x && p.y === v.y);

    let content = 0;
    content = contentFilter === 'rewards' && hasBug ? 1 : content;
    content = contentFilter === 'dangers' && (hasSnake || hasWall) ? 1 : content;

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
    if (!isUser) {
      // this.snakeViewPoints.forEach((v) => {
      //   drawPiece(ctx, v, `rgba(0,100,100,${this.alpha})`, isUser);
      // });
    }
    this.snakePieces.forEach((piece) => {
      drawPiece(ctx, piece, `rgba(0,190,0,${this.alpha})`, isUser);
    });
  };

  this.die = (msg) => {
    if (!isUser && this.bugs.length > 0) {
      // this.snakePieces = [...culebriyaStart];
      // this.reSpawns++
      // this.score -= this.reSpawns
      // return;
    }
    this.score -= 10

    this.lost = true;
  };

  this.update = ({ ctx }) => {
    if (!isUser) {
      this.predict();
    }
    this.movePieces(); // move on allpos input
    this.drawBugs(ctx);
    this.drawPieces(ctx);
  };

  return this;
}
