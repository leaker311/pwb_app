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
];

let page = 0;

function render() {
  const p = PAGES[page];
  const counter = `${page + 1}/${PAGES.length}`;

  const rows = [
    ["w", pad(p.title, counter + " \u2192")],
    ["w", p.subtitle],
    ...p.lines,
  ];

  // pad the page out so the footer always sits at the bottom
  while (rows.length < 12) rows.push(["g", ""]);
  rows.push(...FOOTER);

  document.getElementById("screen").innerHTML = rows
    .map(([c, t]) => `<span class="${c}">${t || " "}</span>`)
    .join("\n");
}

document.querySelectorAll("[data-key]").forEach((el) => {
  el.addEventListener("click", () => {
    if (el.dataset.key === "next") page = (page + 1) % PAGES.length;
    if (el.dataset.key === "prev") page = (page - 1 + PAGES.length) % PAGES.length;
    render();
  });
});

render();