// ---------- configuration ----------
const COLS = 24;                 // characters across
const ROWS = 14;                 // lines down
const LETTER_SPACING_EM = 0.32;  // must match styles.css
const FIT_MARGIN = 0.97;         // shrink factor; lower = smaller text
const CALIBRATE = true;          // set false when done positioning

// ---------- helpers ----------
function pad(left, right = "") {
  const gap = COLS - left.length - right.length;
  return left + " ".repeat(Math.max(gap, 1)) + right;
}

// ---------- content ----------
// Each line is [color, text, size?]
//   color: "w" white, "g" green, "c" cyan
//   size:  "sm" for small label lines, omit for normal
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
  {
    title: "ACARS MSG DISPLAY",
    subtitle: "PAGE TWO TEST",
    lines: [],
  },
];

// ---------- rendering ----------
let page = 0;
const screenEl = document.getElementById("screen");

function fitText() {
  const cs = getComputedStyle(screenEl);
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
  screenEl.style.fontSize = (100 * (screenEl.clientWidth / w) * FIT_MARGIN) + "px";
}

function render() {
  const p = PAGES[page];
  const counter = `${page + 1}/${PAGES.length}`;

  const rows = [
    ["w", pad(p.title, counter + " \u2192")],
    ["w", p.subtitle],
    ...p.lines,
  ];

  while (rows.length < ROWS - FOOTER.length) rows.push(["g", ""]);
  rows.push(...FOOTER);
  rows.length = ROWS;   // hard guarantee: never more than ROWS

  screenEl.innerHTML = rows
    .map(([c, t, size]) => `<span class="${c} ${size || ""}">${t || " "}</span>`)
    .join("");

  fitText();
}

// ---------- keys ----------
document.querySelectorAll("[data-key]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    const k = el.dataset.key;
    if (k === "next") page = (page + 1) % PAGES.length;
    if (k === "prev") page = (page - 1 + PAGES.length) % PAGES.length;
    render();
  });
});

window.addEventListener("resize", fitText);

// ---------- calibration ----------
const cal = document.getElementById("cal");
if (CALIBRATE) {
  const cdu = document.querySelector(".cdu");
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
} else {
  cal.style.display = "none";
}

render();