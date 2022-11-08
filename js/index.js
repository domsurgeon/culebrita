document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const canvasuser = document.getElementById("canvasuser");

  canvas.height = canvasSize;
  canvas.width = canvasSize;
  canvasuser.height = canvasUserSize;
  canvasuser.width = canvasUserSize;

  startAI(canvas);
  startUser(canvasuser)
});


// setInterval(() => {
//   console.log(FRAMES, FRAMES * INITCULEBRIYAS)
//   FRAMES = 0
// }, 1000)
