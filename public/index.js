/* eslint-disable no-undef */

const settings = {
  BOARDCOLUMNS,
  STARTPOSITION,
  outputLen,
  reward,
  penalty,
  size: { height: UNI, width: UNI },
  targetMeanScore: 1000, // 0 runs forever
};

const scores = [];

const animate = async ({ action = 1, frame = 0, game, state } = {}) => {
  try {
    if (frame === 0) {
      if (game) {
        const chart = window.chart;
        if (chart) {
          scores.push(game.score);
          const batch = scores.slice(-100);
          chart.data.datasets[0].data.push(batch.reduce((mean, score) => mean + score, 0) / batch.length);
          while (chart.data.datasets[0].data.length > batch.length) {
            chart.data.datasets[0].data.shift();
            chart.data.labels.shift();
          }
          chart.data.datasets[1].data = batch;
          chart.data.labels.push(scores.length);
          chart.update();
        }
      }
      game = new Game({ settings });
    }
    if (!state) {
      state = [...game.getInputState()];
    }
    const reward_ = game.update({ action });
    const newState = [...game.getInputState()];
    const terminal = game.lost;
    const { data: nextAction } = await axios.post("http://localhost:5000/frame", { action, newState, reward: reward_, state, terminal });

    if (settings.targetMeanScore > 0 && chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] >= settings.targetMeanScore) {
      document.getElementById("message").innerHTML = `Target mean score ${settings.targetMeanScore} reached after ${scores.length} game${scores.length > 1 ? "s" : ""}`;
      document.getElementById("message").style.visibility = "visible";
    } else {
      window.requestAnimationFrame(() => animate({ action: parseInt(nextAction, 10), frame: terminal ? 0 : ++frame, game, state: newState }));
    }
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const canvasChart = document.getElementById("chart");
  canvasChart.height = 400;
  canvasChart.width = 400;
  const canvasGame = document.getElementById("game");
  canvasGame.height = settings.size.height;
  canvasGame.width = settings.size.width;
  window.chart = new Chart(canvasChart, {
    data: {
      datasets: [
        {
          borderColor: "#4020d0",
          borderWidth: 1,
          data: [],
          label: "Mean",
        },
        {
          borderColor: "pink",
          borderWidth: 1,
          label: "Score",
        },
      ],
      labels: [],
    },
    type: "line",
  });
  window.display = { canvas: canvasGame, ctx: canvasGame.getContext("2d") };
  animate();
});
