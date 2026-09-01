/**
 * VirtueCraft STEM - Dynamic Vector Line-Art Renderer & Two-Layer Overlay Engine
 * 
 * Includes:
 *   1. Click-to-Color Interactive Target Classes (.colorable-region)
 *   2. Single Focal Point & Chunky Geometry for Ages 4-9
 *   3. Two-Layer Architecture (Layer 1: Line Art, Layer 2: Digital Overlay)
 *   4. 300 DPI High-Contrast Binary Line Styling
 */

export function renderPageSVG(pageData, width = 600, height = 750) {
  const { title, virtue, hiddenShape, hiddenCount = 3, pageNumber, type } = pageData;

  const hiddenPositions = [];
  const coords = [
    { x: 100, y: 150, scale: 0.85, rot: 10 },
    { x: 490, y: 160, scale: 0.8, rot: -15 },
    { x: 500, y: 560, scale: 0.9, rot: 35 },
    { x: 90, y: 590, scale: 0.8, rot: -10 },
    { x: 280, y: 680, scale: 0.85, rot: 25 }
  ];

  for (let i = 0; i < Math.min(hiddenCount, coords.length); i++) {
    hiddenPositions.push({
      id: `hidden-obj-${pageNumber}-${i}`,
      ...coords[(i + pageNumber) % coords.length],
      type: hiddenShape || "Cross-my-heart"
    });
  }

  let cleanLineArt = "";
  if (type === "puzzle" || pageNumber === 11) {
    cleanLineArt = renderChunkyMaze();
  } else if (type === "stem-project" || pageNumber === 12) {
    cleanLineArt = renderChunkyStemBlueprint(pageData);
  } else {
    cleanLineArt = renderSingleFocalPointSubject(pageNumber);
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="coloring-page-svg interactive-svg" id="interactive-coloring-canvas">
      <defs>
        <style>
          .colorable-region { cursor: pointer; transition: fill 0.2s ease, stroke-width 0.2s ease; }
          .colorable-region:hover { stroke: #e11d48 !important; stroke-width: 6 !important; }
          .chunky-stroke { stroke: #000000; stroke-width: 6; fill: #ffffff; stroke-linecap: round; stroke-linejoin: round; }
          .bold-outline { stroke: #000000; stroke-width: 8; fill: #ffffff; stroke-linecap: round; stroke-linejoin: round; }
          .maze-wall { stroke: #000000; stroke-width: 8; fill: none; stroke-linecap: round; }
          
          .digital-overlay-symbol { stroke: #000000; stroke-width: 3.5; fill: #ffffff; cursor: pointer; transition: all 0.3s ease; }
          .digital-overlay-symbol:hover { stroke: #e11d48; stroke-width: 5; fill: #fff1f2; }
          .digital-overlay-symbol.found { stroke: #0d9488; stroke-width: 5; fill: #ccfbf1; }
          .page-text { font-family: 'Outfit', 'Inter', sans-serif; fill: #0f172a; pointer-events: none; }
        </style>

        <g id="shape-cross-heart">
          <path class="colorable-region" d="M 0,-14 C -10,-26 -24,-14 -24,0 C -24,14 0,26 0,26 C 0,26 24,14 24,0 C 24,-14 10,-26 0,-14 Z" />
          <path d="M 0,-10 L 0,12 M -8,-2 L 8,-2" stroke="#000000" stroke-width="3" />
        </g>

        <g id="shape-star">
          <polygon class="colorable-region" points="0,-20 6,-6 20,-5 9,6 12,20 0,11 -12,20 -9,6 -20,-5 -6,-6" />
        </g>

        <g id="shape-anchor">
          <circle class="colorable-region" cx="0" cy="-14" r="5" stroke="#000000" stroke-width="3" />
          <path d="M 0,-9 L 0,14 M -14,5 C -14,18 14,18 14,5" stroke="#000000" stroke-width="3.5" fill="none" />
        </g>

        <g id="shape-fish">
          <path class="colorable-region" d="M -18,0 C -6,-14 14,0 18,0 C 14,0 -6,14 -18,0 Z M 14,0 L 22,-9 L 22,9 Z" />
          <circle cx="-6" cy="-3" r="2" fill="#000000" />
        </g>
      </defs>

      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="18" class="bold-outline colorable-region" fill="#ffffff" />

      <rect x="30" y="30" width="${width - 60}" height="70" rx="10" fill="#ffffff" stroke="#000000" stroke-width="3" />
      <text x="50" y="60" class="page-text" font-size="19" font-weight="800" fill="#1e40af">${escapeXml(title)}</text>
      <text x="50" y="85" class="page-text" font-size="13" fill="#0f172a">Virtue Focus: <tspan font-weight="bold" fill="#0d9488">${escapeXml(virtue)}</tspan> | 🎨 Click Any Shape to Color!</text>

      <g id="layer-1-clean-lineart">
        ${cleanLineArt}
      </g>

      <g id="layer-2-digital-overlay">
        ${hiddenPositions.map(pos => `
          <g class="digital-overlay-symbol" data-id="${pos.id}" transform="translate(${pos.x}, ${pos.y}) scale(${pos.scale}) rotate(${pos.rot})">
            <use href="#${getShapeSvgId(pos.type)}" />
          </g>
        `).join("")}
      </g>

      <rect x="30" y="650" width="${width - 60}" height="70" rx="10" fill="#ffffff" stroke="#000000" stroke-width="3" />
      <text x="50" y="678" class="page-text" font-size="14" font-weight="800" fill="#92400e">🔍 Seek-and-Find Overlay Challenge:</text>
      <text x="50" y="702" class="page-text" font-size="13" fill="#0f172a">Find ${hiddenCount} stamped <tspan font-weight="bold" fill="#e11d48">'${hiddenShape}'</tspan> vector shapes in the open areas! Click when found.</text>
    </svg>
  `;

  return { svgHtml: svgContent, hiddenPositions };
}

function getShapeSvgId(shapeName = "") {
  if (shapeName.includes("Star")) return "shape-star";
  if (shapeName.includes("Anchor")) return "shape-anchor";
  if (shapeName.includes("Fish") || shapeName.includes("Ichthys")) return "shape-fish";
  return "shape-cross-heart";
}

function renderSingleFocalPointSubject(pageNumber) {
  const subjects = {
    1: `
      <g transform="translate(130, 130)">
        <circle cx="170" cy="120" r="85" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="140" cy="110" r="10" fill="#000" /> <circle cx="200" cy="110" r="10" fill="#000" />
        <path d="M 135,145 Q 170,180 205,145" stroke="#000" stroke-width="6" fill="none" stroke-linecap="round" />
        <path d="M 170,205 L 170,390" class="bold-outline colorable-region" fill="#ffffff" />
        <g transform="translate(210, 210)">
          <rect x="0" y="0" width="100" height="150" rx="12" class="chunky-stroke colorable-region" fill="#ffffff" />
          <path d="M 20,30 L 80,30 M 20,60 L 80,60 M 20,90 L 80,90" stroke="#000" stroke-width="4" stroke-linecap="round" />
          <text x="25" y="125" class="page-text" font-weight="800" font-size="14" fill="#000">PLAN</text>
        </g>
      </g>
    `,
    2: `
      <g transform="translate(140, 140)">
        <rect x="30" y="30" width="260" height="340" rx="28" class="bold-outline colorable-region" fill="#ffffff" />
        <text x="75" y="85" class="page-text" font-weight="800" font-size="22" fill="#000">ESP32 BRAIN</text>
        <circle cx="110" cy="170" r="22" fill="#000" /> <circle cx="210" cy="170" r="22" fill="#000" />
        <path d="M 100,230 Q 160,285 220,230" stroke="#000" stroke-width="7" fill="none" stroke-linecap="round" />
        <path d="M -10,90 L 30,90 M -10,160 L 30,160 M -10,230 L 30,230 M -10,300 L 30,300" class="bold-outline" />
        <path d="M 290,90 L 330,90 M 290,160 L 330,160 M 290,230 L 330,230 M 290,300 L 330,300" class="bold-outline" />
      </g>
    `,
    3: `
      <g transform="translate(150, 150)">
        <rect x="40" y="40" width="240" height="240" rx="24" class="bold-outline colorable-region" fill="#ffffff" />
        <text x="100" y="100" class="page-text" font-weight="800" font-size="22" fill="#000">DHT11</text>
        <circle cx="110" cy="160" r="16" fill="#000" /> <circle cx="210" cy="160" r="16" fill="#000" />
        <path d="M 120,205 Q 160,235 200,205" stroke="#000" stroke-width="6" fill="none" stroke-linecap="round" />
        <path d="M 160,280 C 160,370 280,390 280,450" class="colorable-region" stroke="#000" stroke-width="12" stroke-linecap="round" fill="none" />
      </g>
    `,
    4: `
      <g transform="translate(160, 150)">
        <circle cx="140" cy="170" r="130" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="140" cy="170" r="70" class="chunky-stroke colorable-region" fill="#ffffff" />
        <circle cx="110" cy="150" r="12" fill="#000" /> <circle cx="170" cy="150" r="12" fill="#000" />
        <path d="M 115,185 Q 140,210 165,185" stroke="#000" stroke-width="5" fill="none" stroke-linecap="round" />
        <g transform="translate(290, 80)">
          <circle cx="20" cy="20" r="28" class="chunky-stroke colorable-region" fill="#ffffff" />
          <text x="10" y="30" class="page-text" font-weight="800" font-size="28" fill="#000">♪</text>
        </g>
      </g>
    `,
    5: `
      <g transform="translate(160, 140)">
        <circle cx="140" cy="130" r="90" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="80" y="105" width="55" height="40" rx="10" class="bold-outline colorable-region" fill="#000" />
        <rect x="145" y="105" width="55" height="40" rx="10" class="bold-outline colorable-region" fill="#000" />
        <path d="M 110,185 Q 140,215 170,185" stroke="#000" stroke-width="6" fill="none" stroke-linecap="round" />
        <path d="M 60,250 C 140,320 220,320 220,250" class="colorable-region" stroke="#000" stroke-width="10" stroke-linecap="round" fill="none" />
      </g>
    `,
    6: `
      <g transform="translate(140, 150)">
        <rect x="30" y="100" width="260" height="220" rx="20" class="bold-outline colorable-region" fill="#ffffff" />
        <text x="75" y="160" class="page-text" font-weight="800" font-size="20" fill="#000">SERVO ARM</text>
        <circle cx="160" cy="100" r="40" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 160,60 L 320,10" class="colorable-region" stroke="#000" stroke-width="14" stroke-linecap="round" />
        <circle cx="320" cy="10" r="16" class="bold-outline colorable-region" fill="#ffffff" />
      </g>
    `,
    7: `
      <g transform="translate(170, 140)">
        <rect x="20" y="30" width="180" height="340" rx="24" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="75" y="-5" width="70" height="35" rx="8" fill="#000" />
        <text x="80" y="110" class="page-text" font-weight="800" font-size="54" fill="#000">+</text>
        <text x="85" y="290" class="page-text" font-weight="800" font-size="54" fill="#000">-</text>
        <circle cx="80" cy="180" r="14" fill="#000" /> <circle cx="140" cy="180" r="14" fill="#000" />
        <path d="M 85,215 Q 110,235 135,215" stroke="#000" stroke-width="5" fill="none" />
      </g>
    `,
    8: `
      <g transform="translate(130, 160)">
        <rect x="20" y="30" width="280" height="110" rx="16" class="bold-outline colorable-region" fill="#ffffff" />
        <text x="50" y="95" class="page-text" font-weight="800" font-size="24" fill="#000">IF (START_CLICKED)</text>

        <rect x="50" y="160" width="280" height="110" rx="16" class="bold-outline colorable-region" fill="#ffffff" />
        <text x="80" y="225" class="page-text" font-weight="800" font-size="24" fill="#000">THEN (ROBOT_MOVE)</text>
      </g>
    `,
    9: `
      <g transform="translate(160, 140)">
        <circle cx="140" cy="140" r="110" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="140" cy="140" r="70" class="chunky-stroke colorable-region" fill="#ffffff" />
        <path d="M 70,230 L 15,310" class="colorable-region" stroke="#000" stroke-width="16" stroke-linecap="round" />
        <text x="100" y="148" class="page-text" font-weight="800" font-size="22" fill="#000">DEBUG</text>
      </g>
    `,
    10: `
      <g transform="translate(160, 140)">
        <rect x="30" y="30" width="200" height="180" rx="24" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="90" cy="90" r="16" fill="#000" /> <circle cx="170" cy="90" r="16" fill="#000" />
        <path d="M 95,140 Q 130,175 165,140" stroke="#000" stroke-width="6" fill="none" stroke-linecap="round" />

        <circle cx="70" cy="270" r="35" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="190" cy="270" r="35" class="bold-outline colorable-region" fill="#ffffff" />

        <g transform="translate(250, 100)">
          <circle cx="0" cy="0" r="22" class="bold-outline colorable-region" fill="#ffffff" />
          <path d="M 0,22 L 0,100" stroke="#000" stroke-width="8" stroke-linecap="round" />
        </g>
      </g>
    `
  };

  return subjects[pageNumber] || subjects[1];
}

function renderChunkyMaze() {
  return `
    <g id="maze-container" transform="translate(60, 130)">
      <rect x="0" y="0" width="480" height="500" rx="16" class="bold-outline colorable-region" fill="#ffffff" />

      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="90" height="45" rx="8" fill="#000000" />
        <text x="14" y="30" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="18">START</text>
      </g>

      <g transform="translate(370, 435)">
        <rect x="0" y="0" width="90" height="45" rx="8" fill="#000000" />
        <text x="12" y="30" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="18">FINISH</text>
      </g>

      <path d="M 120,0 L 120,140 M 220,70 L 360,70 M 360,0 L 360,140" class="maze-wall" />
      <path d="M 0,140 L 220,140 M 290,140 L 480,140" class="maze-wall" />
      <path d="M 80,210 L 80,340 M 160,280 L 320,280 M 400,210 L 400,340" class="maze-wall" />
      <path d="M 0,340 L 160,340 M 240,340 L 480,340" class="maze-wall" />
      <path d="M 120,410 L 240,410 M 320,410 L 480,410" class="maze-wall" />
    </g>
  `;
}

function renderChunkyStemBlueprint(pageData) {
  const masterArc = pageData.masterArcClue || { issueNumber: 1, componentName: "Base Foundation & Power Grid Traces", grandProjectTitle: "The Solar Smart Eco-Citadel" };

  return `
    <g id="stem-blueprint-container" transform="translate(40, 120)">
      <rect x="0" y="0" width="520" height="510" rx="16" fill="#ffffff" stroke="#000000" stroke-width="4" />
      
      <rect x="30" y="30" width="460" height="90" rx="10" fill="#ffffff" stroke="#000000" stroke-width="3" />
      <text x="50" y="70" fill="#000000" font-family="'Outfit', sans-serif" font-weight="800" font-size="20">🔨 STEM BUILD: Cardboard Circuit Baseplate</text>
      <text x="50" y="100" fill="#0f172a" font-family="'Inter', sans-serif" font-size="14">Materials: Cardboard base, aluminum foil strips, tape, LED</text>

      <g transform="translate(130, 150)">
        <rect x="0" y="0" width="260" height="150" rx="14" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="130" cy="75" r="35" class="chunky-stroke colorable-region" fill="#ffffff" />
        <text x="110" y="84" class="page-text" font-weight="800" font-size="22" fill="#000">LED</text>
      </g>

      <rect x="30" y="330" width="460" height="150" rx="10" fill="#ffffff" stroke="#000000" stroke-width="3" />
      <text x="50" y="370" fill="#000000" font-family="'Outfit', sans-serif" font-weight="800" font-size="18">🏆 MASTER BLUEPRINT CLUE (#1 of 12)</text>
      <text x="50" y="405" fill="#000000" font-family="'Outfit', sans-serif" font-weight="800" font-size="16">🧩 Component #1: ${escapeXml(masterArc.componentName)}</text>
      <text x="50" y="445" fill="#475569" font-family="'Inter', sans-serif" font-style="italic" font-size="13">"Hint: ${escapeXml(masterArc.hintText)}"</text>
    </g>
  `;
}

function escapeXml(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
