function Culebrita(bugs, AI) {
  this.bugs = bugs;
  this.drawBugs = (ctx) => {
    this.bugs.forEach((bug) => {
      drawPiece(ctx, bug, "#ddd");
    });
  };

  this.boardSize = 0;
  this.pieceSize = 1;
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
      head.x > this.boardSize / PIECE - 1 ||
      head.y < 0 ||
      head.y > this.boardSize / PIECE - 1
    ) {
      console.log(":::CRASHED:::");
      console.log(head);
      terminate = true;
    }

    const eatenItself = !!this.pieces.slice(1).find( p => p.x === head.x && p.y === head.y )

    if(eatenItself) {
      console.log(":::CANNIBAL:::");
      terminate = true;
    }

    if (this.bugs.length === 0) {
      console.log(":::YOU-WON:::");
      terminate = true;
    }
  };

  this.predict = () => {
    const head = this.pieces[0];
    const closestBugs = this.bugs.sort(closest);
    // debugger

    function closest(a, b) {
      const diffXA = Math.abs(head.x - a.x);
      const diffYA = Math.abs(head.y - a.y);
      const diffA = diffXA + diffYA;

      const diffXB = Math.abs(head.x - b.x);
      const diffYB = Math.abs(head.y - b.y);
      const diffB = diffXB + diffYB;

      if (diffA === diffYB) {
        return 0;
      }

      return diffA > diffB;
    }
  };

  this.update = ({ canvas, ctx, frame }) => {
    this.boardSize = canvas.height / this.pieceSize;
    // if(AI){
    //   this.order = this.predict()
    // }
    this.movePieces();
    this.drawBugs(ctx);
    this.pieces.forEach((piece, index) => {
      drawPiece(ctx, piece);
    });
  };

  return this;
}
