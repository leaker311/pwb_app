const LINES = [
  "----+----1----+----2----+",
  "",
  "SOULS- - - - ",
  "",
  "COL A     COL B     COL C",
  "111       222       333",
  "",
  "IF COLUMNS LINE UP, GOOD",
];

document.getElementById("screen").textContent = LINES.join("\n");

// --- CALIBRATION (delete when done) ---
const cdu = document.querySelector(".cdu");
const cal = document.getElementById("cal");
let pts = [];

cdu.addEventListener("click", (e) => {
  const r = cdu.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * 100;
  const y = ((e.clientY - r.top) / r.height) * 100;
  pts.push([x, y]);
  if (pts.length > 2) pts.shift();

  if (pts.length === 2) {
    const [a, b] = pts;
    cal.textContent =
      `top:${a[1].toFixed(1)}%; left:${a[0].toFixed(1)}%; ` +
      `width:${(b[0] - a[0]).toFixed(1)}%; height:${(b[1] - a[1]).toFixed(1)}%;`;
  } else {
    cal.textContent = `corner 1 set — now click the opposite corner`;
  }
});