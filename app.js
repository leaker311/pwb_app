const COLS = 24;

// pad: build one line with left text and right text, right-aligned to COLS
function pad(left, right = "") {
  const gap = COLS - left.length - right.length;
  return left + " ".repeat(Math.max(gap, 1)) + right;
}

// Each line is [color, text].  w = white, g = green, c = cyan
const FOOTER = [
  ["w", "RETURN TO"],
  ["w", pad("<REC MSGS", "PRINT>")],
];

const PAGES = [
  {
    title: "ACARS MSG DISPLAY",
    subtitle: "KMCO TAKEOFF DATA",
    lines: [
      ["g", pad("FLT-2597", "WB RPT---")],
      ["g", pad("1345Z", "PLAN #-584824")],
      ["g", pad("SOULS----", "FWDWT------")],
      ["g", pad("PAX----", "AFTWT------")],
      ["g", pad("CREW--", "ZONE1----")],
      ["g", "OBS/CJS--/-"],
      ["g", "CHD/INF---/--"],
      ["g", "-".repeat(COLS)],
    ],
  },
  { title: "ACARS MSG DISPLAY", subtitle: "PAGE TWO TEST", lines: [] },
];

let page = 0;

const ROWS = 14;

function render() {
  const p = PAGES[page];
  const counter = `${page + 1}/${PAGES.length}`;

  const rows = [
    ["w", pad(p.title, counter + " \u2192")],
    ["w", p.subtitle],
    ["g", pad("SOULS----", "FWDWT------"), "sm"],
    ...p.lines,
  ];

  while (rows.length < ROWS - FOOTER.length) rows.push(["g", ""]);
  rows.push(...FOOTER);

  document.getElementById("screen").innerHTML = rows
    .map(([c, t, size]) =>
      `<span class="${c} ${size || ""}">${t || " "}</span>`)
    .join("");

  fitText();
}

document.querySelectorAll("[data-key]").forEach((el) => {
  el.addEventListener("click", () => {
    if (el.dataset.key === "next") page = (page + 1) % PAGES.length;
    if (el.dataset.key === "prev") page = (page - 1 + PAGES.length) % PAGES.length;
    render();
  });
});

const LETTER_SPACING_EM = 0.32;

function fitText() {
  const screen = document.getElementById("screen");
  const cs = getComputedStyle(screen);
  const probe = document.createElement("span");
  probe.style.cssText =
    "visibility:hidden; position:absolute; white-space:pre;" +
    "font-family:" + cs.fontFamily + ";" +
    "font-weight:" + cs.fontWeight + ";" +
    "letter-spacing:" + LETTER_SPACING_EM + "em;" +
    "font-size:100px;";
  probe.textContent = "0".repeat(COLS);
  document.body.appendChild(probe);

  const w = probe.getBoundingClientRect().width;
  probe.remove();

  screen.style.fontSize = (100 * (screen.clientWidth / w) * 0.97) + "px";
}

window.addEventListener("resize", fitText);
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
    cal.textContent = "corner 1 set — now click the opposite corner";
  }
});

render();

