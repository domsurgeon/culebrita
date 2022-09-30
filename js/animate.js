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
    const maxScore = Math.max(...culebritas.map(a=>a.score))
    const sortedBest = culebritas.filter( c => c.score === maxScore )[0]

    // const sortedBest = culebritas.sort((a, b) =>
    //   a.score === b.score ? 0 : a.score < b.score ? 1 : -1
    // )[0];

    partialBestBrain =
      partialBestBrain.score > sortedBest.score ? partialBestBrain : sortedBest;

    const brain = partialBestBrain.brain;

    rounds += INITCULEBRITAS;

    const brainStr = JSON.stringify(brain);
    localStorage.setItem("brain", brainStr);
    console.log("Saved brain on LS");

    document.getElementById("best-score").innerHTML =
      Math.floor(partialBestBrain.score * 100) / 100;
    document.getElementById("rounds").innerHTML = rounds;
    startAI(brain, canvas);
  }
}

function animateUser({ canvas, ctx, culebrita }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  culebrita.update({ ctx });

  document.getElementById("user-score").innerHTML =
    Math.floor(culebrita.score * 100) / 100;

  if (!culebrita.lost) {
    setTimeout(() => animateUser({ canvas, ctx, culebrita }), USERSPEED);
  }
}
