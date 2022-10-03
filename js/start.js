const bugs = new Bugs();

function startAI(brain, canvas) {
  // const bugs = new Bugs();

  const randomTest = Math.floor(INITCULEBRITAS / 3);
  const culebritas = new Array(INITCULEBRITAS)
    .fill(0)
    .map((c, i) => new Culebrita([...bugs], i > randomTest && brain));

  animateAI({ canvas, ctx: canvas.getContext("2d"), culebritas });
}

function startUser(canvas) {
  // const bugs = new Bugs();
  const culebrita = new Culebrita([...bugs], null, true);

  canvas.focus();
  let lastDownTarget = canvas;

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

  animateUser({ canvas, ctx: canvas.getContext("2d"), culebrita });
}
