function startGames(brain) {
  const bugs = new Bugs();

  const randomTest = Math.floor(INITCULEBRITAS / 3)
  const culebritas = new Array(INITCULEBRITAS)
    .fill(0)
    .map((c,i) => new Culebrita([...bugs], i > randomTest && brain));
  animate({ canvas, ctx: canvas.getContext("2d"), culebritas });
}

function animate({ canvas, ctx, culebritas }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.focus();
  culebritas.forEach((culebrita) => {
    culebrita.update({ ctx });
  });
  const notLost = culebritas.filter((c) => !c.lost);

  if (notLost.length) {
    // setTimeout(() => {
    window.requestAnimationFrame(() =>
      animate({ canvas, ctx, culebritas: notLost })
    );
    // }, 100);
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
    startGames(brain);
  }
}
