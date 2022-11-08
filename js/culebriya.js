function Culebriya(bugs, brain, isUser) {
  this.brain = !isUser && (brain || new NeuralNetwork(LAYERS));
  this.bugs = [...bugs];
  this.alpha = isUser ? 1 : alpha;
  reset(this);

  this.recharge = (newBrain, bugis) => {
    reset(this);
    this.brain = newBrain || new NeuralNetwork(LAYERS);
    this.bugs = [...bugis];
  };

  this.reload = () => {
    reset(this);
    this.bugs = [...bugs];
  };

  function reset(cule) {
    cule.lost = false;
    cule.win = false;
    cule.score = 0;
    cule.reSpawns = 0;
    cule.snakePieces = [...culebriyaStart];
    cule.snakeDirection = "up";
    cule.order = "up";
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
      this.score += 1;
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
      this.win = true;
      console.log(this.reSpawns);
    }
  };

  this.getVectorsView = () => {
    const head = this.snakePieces[0];
    const vectors = new Array(outputLen).fill(0);

    for (let o = 0; o < outputLen; o++) {
      let nothing = true;
      let p = 1;

      while (nothing) {
        let v;

        switch (this.snakeDirection) {
          case "up":
            v = {
              y: head.y + (o === 1 ? -p : 0),
              x: head.x + (o === 1 ? 0 : (o === 0 ? -1 : 1) * p),
            };
            break;
          case "down":
            v = {
              y: head.y + (o === 1 ? p : 0),
              x: head.x + (o === 1 ? 0 : (o === 0 ? 1 : -1) * p),
            };
            break;
          case "left":
            v = {
              y: head.y + (o === 1 ? 0 : (o === 0 ? 1 : -1) * p),
              x: head.x + (o === 1 ? -p : 0),
            };
            break;
          case "right":
            v = {
              y: head.y + (o === 1 ? 0 : (o === 0 ? -1 : 1) * p),
              x: head.x + (o === 1 ? p : 0),
            };
            break;
        }

        const [hasAny, val] = this.getPointContent(v);

        if (hasAny) {
          const vector = (val * VaVAMLTP) / p;
          vectors[o] = vector;
          nothing = false;
        }
        p++;
      }
    }

    return vectors;
  };

  this.predict = () => {
    NeuralNetwork.mutate({ amount: Math.random(), network: this.brain }); // amount decrease ?

    const inputs = this.getVectorsView();
    const outputs = NeuralNetwork.feedForward({
      inputs,
      network: this.brain,
    });

    const randDec = Math.random() >= 0;
    this.order = this.orderFromOutput(randDec ? inputs : outputs);
  };

  this.getPointContent = (v) => {
    const hasBug = this.bugs.find((b) => b.x === v.x && b.y === v.y);
    const hasWall =
      v.x < 0 || v.x > BOARDCOLUMNS - 1 || v.y < 0 || v.y > BOARDCOLUMNS - 1;
    const hasSnake = this.snakePieces
      .slice(1)
      .find((p) => p.x === v.x && p.y === v.y);

    return [
      hasBug || hasWall || hasSnake || false,
      hasBug ? 1 : hasWall || hasSnake ? -1 : 0,
    ];
  };

  this.orderFromOutput = (allOutputs) => {
    const maxi = Math.max(...allOutputs);
    const mini = Math.min(...allOutputs);
    // const outputBestOrder = allOutputs.indexOf(maxi);

    const outputBestOrder =
      maxi > 0
        ? allOutputs.indexOf(maxi)
        : mini !== -1
        ? allOutputs.indexOf(mini)
        : allOutputs.indexOf(maxi);

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
    // this.score -= 10;

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
