// const bugs = new Bugs();

function startAI(canvas) {
  const bugs = new Bugs();
  const brainStr = localStorage.getItem("brain");

  const brainFromStorage = brainStr && JSON.parse(brainStr);
  if (brainStr) {
    console.log("Loaded");
  }

  const randomTest = Math.floor(INITCULEBRIYAS / 3);
  const culebriyas = new Array(INITCULEBRIYAS)
    .fill(0)
    .map(
      (c, i) => new Culebriya([...bugs], i > randomTest && brainFromStorage)
    );

  animateAI({ canvas, ctx: canvas.getContext("2d"), culebriyas });
}

function startUser(canvas) {
  const bugs = new Bugs();
  const culebriya = new Culebriya([...bugs], null, true);

  canvas.focus();
  let lastDownTarget = canvas;

  document.addEventListener(
    "keydown",
    function (event) {
      if (lastDownTarget == canvas) {
        switch (event.code) {
          case "ArrowUp":
            culebriya.order = "up";
            break;
          case "ArrowDown":
            culebriya.order = "down";
            break;
          case "ArrowLeft":
            culebriya.order = "left";
            break;
          case "ArrowRight":
            culebriya.order = "right";
            break;
        }
      }
    },
    false
  );

  animateUser({ canvas, ctx: canvas.getContext("2d"), culebriya });
}
