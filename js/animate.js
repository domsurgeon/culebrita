function animate ({ canvas, ctx, frame, culebrita, bugs }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.focus()
  culebrita.update({ canvas, ctx, frame, bugs });

  if (!terminate) {
    setTimeout(() => {
      // window.requestAnimationFrame(() =>
      animate(
        { canvas, ctx, frame: ++frame, culebrita }
        // )
      );
    }, 150);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  let lastDownTarget = canvas;
  canvas.height = "100"
  canvas.width = "100"
  PIECE = canvas.height / 20
  const boardSize = canvas.height / PIECE;

  const bugs = new Bugs(10, boardSize);
  const AI = true
  const culebrita = new Culebrita(bugs, AI);

  document.addEventListener(
    "keydown",
    function (event) {
      if (lastDownTarget == canvas) {
        switch (event.code) {
          case "ArrowUp":
            culebrita.order = "up";
            break;
          case "ArrowDown":
            culebrita.order = "down";
            break;
          case "ArrowLeft":
            culebrita.order = "left";
            break;
          case "ArrowRight":
            culebrita.order = "right";
            break;
        }
      }
    },
    false
  );

  animate({ canvas, ctx: canvas.getContext("2d"), culebrita });
});
