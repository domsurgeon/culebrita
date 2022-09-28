function animate({ canvas, ctx, frame, culebritas }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.focus();
  culebritas.forEach((culebrita) => {
    culebrita.update({ canvas, ctx, frame });
  });
  const notLost = culebritas.filter((c) => !c.lost);

  if (notLost.length) {
    // setTimeout(() => {
    window.requestAnimationFrame(() =>
      animate({ canvas, ctx, frame: ++frame, culebritas: notLost })
    );
    // }, 100);
  } else {
    const sortedBest = culebritas.sort((a, b) =>
      a.score === b.score ? 0 : a.score < b.score ? 1 : -1
    )[0];

    partialBestBrain = partialBestBrain.score > sortedBest.score ? partialBestBrain : sortedBest

    const brain = partialBestBrain.brain;

    document.getElementById('best-score').innerHTML = Math.floor(partialBestBrain.score * 100) / 100
    startGames(brain);
  }
}

function startGames(brain) {
  const boardSize = canvasSize / PIECE;
  const bugs = new Bugs(BUGSSIZE, boardSize);

  const randomTest = Math.floor(culeNum / 3)
  const culebritas = new Array(culeNum)
    .fill(0)
    .map((c,i) => new Culebrita([...bugs], i > randomTest && brain));
  animate({ canvas, ctx: canvas.getContext("2d"), culebritas });
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  let lastDownTarget = canvas;
  canvas.height = canvasSize;
  canvas.width = canvasSize;
  PIECE = canvasSize / BOARDCOLUMNS;

  startGames();

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
});
