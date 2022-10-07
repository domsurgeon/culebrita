function animateAI({ canvas, ctx, culebriyas }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  culebriyas.forEach((culebriya) => {
    culebriya.update({ ctx });
  });

  const handleScore = (wins) => {
    const maxScore = Math.max(...wins.map((w) => w.score));
    const winner = wins.filter((w) => w.score === maxScore)[0];
    let bestScore = (localStorage.getItem("best-score") || "-100") * 1;

    if (maxScore > bestScore) {
      save(winner);

      bestBrain = winner.brain;
      bestScore = maxScore;
    }

    document.getElementById("best-score").innerHTML =
      Math.floor(bestScore * 100) / 100;
  };

  const wins = culebriyas.filter((c) => c.win);
  const lost = culebriyas.filter((c) => c.lost);

  const brainStr = localStorage.getItem("brain");
  let bestBrain = brainStr && JSON.parse(brainStr);

  if (wins.length > 0) {
    handleScore(wins);
    const randomTest = Math.floor(INITCULEBRIYAS / 3);
    const bugs = new Bugs();
    culebriyas.forEach((c, i) => c.recharge(i > randomTest && bestBrain, bugs));
  } else {
    if (lost.length) {
      handleScore(lost);
      lost.forEach((c) => c.reload(bestBrain));
    }
  }

  window.requestAnimationFrame(() => animateAI({ canvas, ctx, culebriyas }));
}

function animateUser({ canvas, ctx, culebriya }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  culebriya.update({ ctx });

  document.getElementById("user-score").innerHTML =
    Math.floor(culebriya.score * 100) / 100;

  if (!culebriya.lost) {
    setTimeout(() => animateUser({ canvas, ctx, culebriya }), USERSPEED);
  }
}
