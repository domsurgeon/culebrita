function startAI(brain, canvas) {
  const bugs = new Bugs();

  const randomTest = Math.floor(INITCULEBRITAS / 3)
  const culebritas = new Array(INITCULEBRITAS)
    .fill(0)
    .map((c,i) => new Culebrita([...bugs], i > randomTest && brain));


  animateAI({ canvas, ctx: canvas.getContext("2d"), culebritas });
}

function animateAI({ canvas, ctx, culebritas }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  culebritas.forEach((culebrita) => {
    culebrita.update({ ctx });
  });
  const notLost = culebritas.filter((c) => !c.lost);

  if (notLost.length) {
    window.requestAnimationFrame(() =>
      animateAI({ canvas, ctx, culebritas: notLost })
    );
  } else {
    const sortedBest = culebritas.sort((a, b) =>
      a.score === b.score ? 0 : a.score < b.score ? 1 : -1
    )[0];

    partialBestBrain = partialBestBrain.score > sortedBest.score ? partialBestBrain : sortedBest

    const brain = partialBestBrain.brain;

    rounds += INITCULEBRITAS

    const brainStr = JSON.stringify(brain)
    localStorage.setItem('brain', brainStr)
    console.log('Saved brain on LS')

    document.getElementById('best-score').innerHTML = Math.floor(partialBestBrain.score * 100) / 100
    document.getElementById('rounds').innerHTML = rounds
    startAI(brain, canvas);
  }
}

function animateUser ({ canvas, ctx, culebrita }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  culebrita.update({ ctx });

  document.getElementById('user-score').innerHTML = Math.floor(culebrita.score * 100) / 100

  if(!culebrita.lost) {
    setTimeout(() => animateUser({ canvas, ctx, culebrita }), USERSPEED );
  }
}

function startUser(canvas) {
  const bugs = new Bugs();
  const culebrita = new Culebrita([...bugs], null, true )

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
