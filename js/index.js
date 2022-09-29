document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  let lastDownTarget = canvas;
  canvas.height = canvasSize;
  canvas.width = canvasSize;

  const brainStr = localStorage.getItem("brain");
  const brain = brainStr && JSON.parse(brainStr);
  if (brainStr) {
    console.log("Loaded brain from LS");
  }
  startGames(brain);
});


// const culebrita = userCulebrita // human game
// document.addEventListener(
//   "keydown",
//   function (event) {
//     if (lastDownTarget == canvas) {
//       switch (event.code) {
//         case "ArrowUp":
//           culebrita.order = "up";
//           break;
//         case "ArrowDown":
//           culebrita.order = "down";
//           break;
//         case "ArrowLeft":
//           culebrita.order = "left";
//           break;
//         case "ArrowRight":
//           culebrita.order = "right";
//           break;
//       }
//     }
//   },
//   false
// );
