function Bugs() {
  let bugsCount = INITBUGS
  let bugs = [];
  let positions = new Array(BOARDCOLUMNS * BOARDCOLUMNS).fill(0);
  positions = positions.map((p, i) => ({
    x: i % BOARDCOLUMNS,
    y: Math.floor(i / BOARDCOLUMNS) % BOARDCOLUMNS,
  }));

  positions = positions.filter(
    (b) => !(b.x === culebritaStart[0].x && b.y === culebritaStart[0].y)
  );

  while (bugsCount--) {
    const random = Math.floor(Math.random() * positions.length);
    const randomBug = positions.splice(random, 1);

    bugs.push(randomBug[0]);
  }

  return bugs;
}
