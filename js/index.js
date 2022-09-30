document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const canvasuser = document.getElementById("canvasuser");

  canvas.height = canvasSize;
  canvas.width = canvasSize;
  canvasuser.height = canvasUserSize;
  canvasuser.width = canvasUserSize;

  const brainStr = localStorage.getItem("brain");
  localStorage.clear()
  const brain = brainStr && JSON.parse(brainStr);
  if (brainStr) {
    console.log("Loaded brain from LS");
  }
  startAI(brain, canvas);
  startUser(canvasuser)
});
