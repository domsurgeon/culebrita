function Bugs(n, boardSize) {
  let bugs = [];
  let positions = new Array(boardSize * boardSize).fill(0);
  positions = positions.map((p, i) => ({
    x: i % boardSize,
    y: Math.floor(i / boardSize) % boardSize,
  }));

  positions = positions.filter(
    (b) => !(b.x === culebritaStart[0].x && b.y === culebritaStart[0].y)
  );

  while (n--) {
    const random = Math.floor(Math.random() * positions.length);
    const randomBug = positions.splice(random, 1);

    bugs.push(randomBug[0]);
  }

  return bugs;
}
