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
  if (pageData.isSuperSquirrel) {
    if (type === "puzzle" || pageNumber === 11) {
      cleanLineArt = renderSuperSquirrelMaze();
    } else if (type === "stem-project" || pageNumber === 12) {
      cleanLineArt = renderSuperSquirrelStemProject(pageData);
    } else {
      cleanLineArt = renderSuperSquirrelSubject(pageNumber);
    }
  } else {
    if (type === "puzzle" || pageNumber === 11) {
      cleanLineArt = renderChunkyMaze();
    } else if (type === "stem-project" || pageNumber === 12) {
      cleanLineArt = renderChunkyStemBlueprint(pageData);
    } else {
      cleanLineArt = renderSingleFocalPointSubject(pageNumber);
    }
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

export function renderSuperSquirrelSubject(pageNumber) {
  const subjects = {
    // Page 1: Flight Planning (Hero on branch with map)
    1: `
      <g id="sq-page-1" transform="translate(60, 110)">
        <!-- Sun & Cloud -->
        <circle cx="410" cy="50" r="35" class="chunky-stroke colorable-region" fill="#ffffff" />
        <path d="M 40,50 Q 65,30 90,48 Q 115,30 140,50 Q 155,70 135,88 Q 45,88 40,50 Z" class="chunky-stroke colorable-region" fill="#ffffff" />
        
        <!-- Large Oak Branch -->
        <path d="M 0,390 Q 230,360 480,395 L 480,450 L 0,450 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <ellipse cx="400" cy="380" rx="35" ry="18" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="445" cy="390" r="14" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Fluffy Curled Rudder Tail -->
        <path d="M 235,280 C 360,240 395,70 305,45 C 240,25 210,95 235,160 C 245,195 235,245 220,275 Z" class="bold-outline colorable-region" fill="#ffffff" />
        
        <!-- Superhero Cape -->
        <path d="M 125,160 C 45,170 30,270 45,350 C 90,325 125,345 145,300 Z" class="bold-outline colorable-region" fill="#ffffff" />

        <!-- Super Squirrel Body & Belt -->
        <ellipse cx="175" cy="225" rx="55" ry="68" class="bold-outline colorable-region" fill="#ffffff" />
        <!-- Acorn Chest Emblem -->
        <path d="M 157,192 Q 175,182 193,192 L 193,200 L 157,200 Z" class="chunky-stroke colorable-region" fill="#ffffff" />
        <path d="M 157,200 C 157,222 193,222 193,200 Z" class="chunky-stroke colorable-region" fill="#ffffff" />
        <polygon points="175,203 170,212 176,212 172,220 180,210 174,210" fill="#000000" />
        <rect x="135" y="272" width="80" height="16" rx="6" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Legs & Hero Boots -->
        <rect x="140" y="288" width="28" height="58" rx="10" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="180" y="288" width="28" height="58" rx="10" class="bold-outline colorable-region" fill="#ffffff" />
        <ellipse cx="154" cy="350" rx="20" ry="12" class="chunky-stroke colorable-region" fill="#ffffff" />
        <ellipse cx="194" cy="350" rx="20" ry="12" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Head, Ears, Mask & Cheerful Face -->
        <circle cx="175" cy="115" r="50" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 135,90 Q 120,25 145,55 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 135,80 Q 128,45 142,60 Z" class="chunky-stroke colorable-region" fill="#ffffff" />
        <path d="M 200,85 Q 230,25 205,55 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 203,75 Q 220,45 205,60 Z" class="chunky-stroke colorable-region" fill="#ffffff" />

        <path d="M 135,110 C 150,95 165,115 175,105 C 185,115 200,95 215,110 C 205,125 185,120 175,115 C 165,120 145,125 135,110 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="155" cy="110" r="7" fill="#000" /><circle cx="195" cy="110" r="7" fill="#000" />
        <circle cx="157" cy="108" r="2.5" fill="#fff" /><circle cx="197" cy="108" r="2.5" fill="#fff" />
        <polygon points="171,128 179,128 175,135" fill="#000" />
        <path d="M 165,140 Q 175,152 185,140" stroke="#000" stroke-width="4" fill="none" stroke-linecap="round" />

        <!-- Unrolled Map in Paws -->
        <rect x="45" y="215" width="115" height="80" rx="10" class="bold-outline colorable-region" fill="#ffffff" />
        <text x="55" y="240" font-family="'Outfit', sans-serif" font-weight="800" font-size="12" fill="#000">OAK FOREST MAP</text>
        <path d="M 55,258 Q 85,248 110,268 T 150,260" stroke="#000" stroke-width="3" fill="none" />
        <circle cx="140" cy="235" r="7" class="chunky-stroke colorable-region" fill="#ffffff" />
      </g>
    `,

    // Page 2: Safety & Gear (Goggles & Acorn Flight Harness)
    2: `
      <g id="sq-page-2" transform="translate(60, 110)">
        <!-- Workshop Shelf & Checklist -->
        <rect x="310" y="80" width="140" height="170" rx="14" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="350" y="68" width="60" height="20" rx="6" fill="#000" />
        <text x="330" y="115" font-family="'Outfit', sans-serif" font-weight="800" font-size="16" fill="#000">SAFETY CHECK</text>
        <text x="330" y="148" font-family="'Inter', sans-serif" font-weight="700" font-size="14" fill="#000">☑ AVIATOR GOGGLES</text>
        <text x="330" y="178" font-family="'Inter', sans-serif" font-weight="700" font-size="14" fill="#000">☑ ACORN HARNESS</text>
        <text x="330" y="208" font-family="'Inter', sans-serif" font-weight="700" font-size="14" fill="#000">☑ GLIDER WINGS</text>
        <text x="330" y="235" font-family="'Inter', sans-serif" font-weight="800" font-size="14" fill="#16a34a">★ READY TO FLY!</text>

        <!-- Tail -->
        <path d="M 230,280 C 350,240 380,80 300,50 C 240,30 215,95 235,160 Z" class="bold-outline colorable-region" fill="#ffffff" />

        <!-- Acorn Jetpack Thrusters -->
        <rect x="80" y="180" width="36" height="85" rx="12" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="235" y="180" width="36" height="85" rx="12" class="bold-outline colorable-region" fill="#ffffff" />
        <ellipse cx="98" cy="265" rx="18" ry="8" class="chunky-stroke colorable-region" fill="#ffffff" />
        <ellipse cx="253" cy="265" rx="18" ry="8" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Body & Crossed Harness Straps -->
        <ellipse cx="175" cy="235" rx="55" ry="68" class="bold-outline colorable-region" fill="#ffffff" />
        <line x1="125" y1="185" x2="225" y2="275" stroke="#000" stroke-width="9" stroke-linecap="round" />
        <line x1="225" y1="185" x2="125" y2="275" stroke="#000" stroke-width="9" stroke-linecap="round" />
        
        <!-- Central Golden Lock -->
        <circle cx="175" cy="230" r="22" class="bold-outline colorable-region" fill="#ffffff" />
        <polygon points="175,215 180,225 192,225 182,233 186,245 175,238 164,245 168,233 158,225 170,225" fill="#000" />

        <!-- Legs & Boots -->
        <rect x="140" y="298" width="28" height="58" rx="10" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="180" y="298" width="28" height="58" rx="10" class="bold-outline colorable-region" fill="#ffffff" />
        <ellipse cx="154" cy="360" rx="20" ry="12" class="chunky-stroke colorable-region" fill="#ffffff" />
        <ellipse cx="194" cy="360" rx="20" ry="12" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Head, Ears, Goggles on Forehead -->
        <circle cx="175" cy="120" r="50" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 135,90 Q 120,25 145,55 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 200,85 Q 230,25 205,55 Z" class="bold-outline colorable-region" fill="#ffffff" />
        
        <!-- Chunky Aviator Goggles -->
        <rect x="120" y="85" width="46" height="34" rx="8" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="182" y="85" width="46" height="34" rx="8" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="166" y="96" width="16" height="12" class="chunky-stroke colorable-region" fill="#ffffff" />
        <path d="M 120,102 L 95,110 M 228,102 L 253,110" stroke="#000" stroke-width="8" stroke-linecap="round" />

        <circle cx="155" cy="135" r="7" fill="#000" /><circle cx="195" cy="135" r="7" fill="#000" />
        <polygon points="171,148 179,148 175,155" fill="#000" />
        <path d="M 165,158 Q 175,170 185,158" stroke="#000" stroke-width="4" fill="none" stroke-linecap="round" />
      </g>
    `,

    // Page 3: Gliding Physics (Soaring in Sky)
    3: `
      <g id="sq-page-3" transform="translate(40, 110)">
        <!-- Streamlines -->
        <path d="M 20,100 Q 80,80 140,90 M 10,210 Q 70,200 130,220 M 240,60 Q 300,40 370,55" stroke="#000" stroke-width="5" stroke-dasharray="14,10" fill="none" stroke-linecap="round" />
        
        <!-- Forest Treetops Below -->
        <path d="M 20,410 Q 80,360 140,410 Q 200,350 260,410 Q 330,350 400,410 Q 450,370 480,410 L 480,450 L 20,450 Z" class="bold-outline colorable-region" fill="#ffffff" />

        <!-- Outstretched Wing Flaps -->
        <path d="M 160,180 Q 230,120 310,150 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 170,285 Q 240,340 320,290 Z" class="bold-outline colorable-region" fill="#ffffff" />

        <!-- Giant Rudder Tail -->
        <path d="M 290,250 C 420,280 470,140 400,80 C 340,30 320,120 310,220 Z" class="bold-outline colorable-region" fill="#ffffff" />

        <!-- Flowing Superhero Cape -->
        <path d="M 200,200 Q 260,310 330,330 Q 270,260 240,210 Z" class="bold-outline colorable-region" fill="#ffffff" />

        <!-- Tilted Flying Body -->
        <ellipse cx="230" cy="235" rx="75" ry="48" transform="rotate(-15 230 235)" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="215" cy="225" r="16" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Flying Arms Outstretched -->
        <ellipse cx="140" cy="175" rx="24" ry="14" class="chunky-stroke colorable-region" fill="#ffffff" />
        <ellipse cx="325" cy="145" rx="24" ry="14" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Head, Mask & Aviator Goggles Looking Forward -->
        <circle cx="125" cy="195" r="44" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 105,160 Q 90,110 115,135 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 145,155 Q 165,110 145,135 Z" class="bold-outline colorable-region" fill="#ffffff" />
        
        <rect x="95" y="180" width="30" height="24" rx="6" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="130" y="180" width="30" height="24" rx="6" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="110" cy="192" r="5" fill="#000" /><circle cx="145" cy="192" r="5" fill="#000" />
        <path d="M 115,215 Q 125,225 135,215" stroke="#000" stroke-width="3.5" fill="none" stroke-linecap="round" />
      </g>
    `,

    // Page 4: Acorn Radar & Sonar
    4: `
      <g id="sq-page-4" transform="translate(50, 110)">
        <!-- Giant Tree Hollow with Discovered Acorns -->
        <path d="M 400,60 L 400,430 M 460,60 L 460,430" stroke="#000" stroke-width="10" />
        <ellipse cx="410" cy="220" rx="36" ry="70" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="410" cy="180" r="16" class="chunky-stroke colorable-region" fill="#ffffff" />
        <circle cx="410" cy="220" r="16" class="chunky-stroke colorable-region" fill="#ffffff" />
        <circle cx="410" cy="260" r="16" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Radar Pulse Waves -->
        <path d="M 335,175 A 50 50 0 0 1 335,245" stroke="#000" stroke-width="6" fill="none" stroke-linecap="round" />
        <path d="M 365,155 A 80 80 0 0 1 365,265" stroke="#000" stroke-width="6" fill="none" stroke-linecap="round" />

        <!-- Super Squirrel with Radar -->
        <path d="M 180,270 C 270,240 290,90 220,60 C 180,40 160,100 180,160 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <ellipse cx="135" cy="235" rx="50" ry="65" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="135" cy="125" r="46" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 100,100 Q 85,45 110,70 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 155,95 Q 180,45 160,70 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="120" cy="120" r="6" fill="#000" /><circle cx="150" cy="120" r="6" fill="#000" />

        <!-- Handheld Radar Device -->
        <line x1="170" y1="210" x2="250" y2="210" stroke="#000" stroke-width="12" stroke-linecap="round" />
        <circle cx="270" cy="210" r="46" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="270" cy="210" r="34" class="chunky-stroke colorable-region" fill="#ffffff" />
        <line x1="236" y1="210" x2="304" y2="210" stroke="#000" stroke-width="3" />
        <line x1="270" y1="176" x2="270" y2="244" stroke="#000" stroke-width="3" />
        <circle cx="282" cy="198" r="6" fill="#000" /><circle cx="258" cy="226" r="5" fill="#000" />
        <line x1="270" y1="164" x2="270" y2="135" stroke="#000" stroke-width="6" stroke-linecap="round" />
        <circle cx="270" cy="130" r="8" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Cape & Boots -->
        <path d="M 90,170 C 40,180 30,270 45,340 C 75,315 100,335 115,290 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="110" y="295" width="24" height="55" rx="8" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="145" y="295" width="24" height="55" rx="8" class="bold-outline colorable-region" fill="#ffffff" />
      </g>
    `,

    // Page 5: Solar Treehouse Generator
    5: `
      <g id="sq-page-5" transform="translate(50, 110)">
        <!-- Radiant Sun -->
        <circle cx="390" cy="50" r="34" class="chunky-stroke colorable-region" fill="#ffffff" />
        
        <!-- Solar Leaf Panel Array -->
        <polygon points="260,110 410,90 390,220 240,240" class="bold-outline colorable-region" fill="#ffffff" />
        <line x1="335" y1="100" x2="315" y2="230" stroke="#000" stroke-width="4" />
        <line x1="250" y1="175" x2="400" y2="155" stroke="#000" stroke-width="4" />
        <line x1="315" y1="230" x2="315" y2="350" stroke="#000" stroke-width="12" stroke-linecap="round" />

        <!-- Power Cables -->
        <path d="M 250,240 C 240,300 200,310 180,310" stroke="#000" stroke-width="8" fill="none" stroke-linecap="round" />

        <!-- Giant Acorn Battery -->
        <rect x="80" y="280" width="115" height="130" rx="18" class="bold-outline colorable-region" fill="#ffffff" />
        <rect x="105" y="260" width="22" height="20" rx="4" fill="#000" />
        <rect x="150" y="260" width="22" height="20" rx="4" fill="#000" />
        <text x="108" y="325" font-size="34" font-weight="900" fill="#000">+</text>
        <text x="155" y="325" font-size="34" font-weight="900" fill="#000">-</text>
        <polygon points="140,340 130,365 142,365 135,390 155,360 142,360" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Super Squirrel Connecting Wire -->
        <path d="M 180,210 C 230,170 250,90 200,60 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="130" cy="140" r="40" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="120" cy="135" r="5" fill="#000" /><circle cx="140" cy="135" r="5" fill="#000" />
        <path d="M 125,150 Q 130,158 135,150" stroke="#000" stroke-width="3" fill="none" />
      </g>
    `,

    // Page 6: Gentle Rescue Mission (Rescuing Baby Hedgehog)
    6: `
      <g id="sq-page-6" transform="translate(40, 110)">
        <!-- Heavy Fallen Log -->
        <rect x="170" y="290" width="240" height="55" rx="16" class="bold-outline colorable-region" fill="#ffffff" />
        <ellipse cx="410" cy="317" rx="14" ry="27" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Fulcrum Rock & Wooden Lever Pole -->
        <polygon points="175,395 205,340 235,395" class="bold-outline colorable-region" fill="#ffffff" />
        <line x1="70" y1="375" x2="310" y2="305" stroke="#000" stroke-width="14" stroke-linecap="round" />

        <!-- Cute Baby Hedgehog Safe on Ground -->
        <ellipse cx="280" cy="375" rx="36" ry="25" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 255,355 L 250,338 L 265,348 L 270,332 L 285,348 L 295,332 L 305,352" stroke="#000" stroke-width="5" stroke-linejoin="round" />
        <circle cx="310" cy="375" r="14" class="chunky-stroke colorable-region" fill="#ffffff" />
        <circle cx="316" cy="373" r="4" fill="#000" />
        <path d="M 310,382 Q 315,388 320,382" stroke="#000" stroke-width="3" fill="none" />

        <!-- Super Squirrel using Lever -->
        <ellipse cx="110" cy="245" rx="45" ry="60" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="110" cy="145" r="44" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 80,120 Q 65,70 90,95 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 130,115 Q 155,70 135,95 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="98" cy="140" r="6" fill="#000" /><circle cx="122" cy="140" r="6" fill="#000" />
        <path d="M 105,158 Q 110,166 115,158" stroke="#000" stroke-width="3" fill="none" />
        <path d="M 80,180 C 40,190 30,280 40,340 C 65,315 90,335 100,290 Z" class="bold-outline colorable-region" fill="#ffffff" />
        <ellipse cx="95" cy="360" rx="16" ry="10" class="chunky-stroke colorable-region" fill="#ffffff" />
        <ellipse cx="125" cy="360" rx="16" ry="10" class="chunky-stroke colorable-region" fill="#ffffff" />
      </g>
    `,

    // Page 7: Automated Acorn Logic
    7: `
      <g id="sq-page-7" transform="translate(40, 110)">
        <!-- Tree-Slab Workbench Desk -->
        <rect x="40" y="210" width="390" height="200" rx="20" class="bold-outline colorable-region" fill="#ffffff" />

        <!-- Oversized Logic Code Blocks -->
        <rect x="70" y="235" width="290" height="65" rx="14" class="bold-outline colorable-region" fill="#ffffff" />
        <text x="90" y="275" font-family="'Outfit', sans-serif" font-weight="800" font-size="20" fill="#000">IF (SENSE_ACORN)</text>

        <rect x="110" y="320" width="290" height="65" rx="14" class="bold-outline colorable-region" fill="#ffffff" />
        <text x="130" y="360" font-family="'Outfit', sans-serif" font-weight="800" font-size="20" fill="#000">THEN (ROLL_BASKET)</text>

        <!-- Acorn Sorting Chute on Right -->
        <path d="M 380,110 L 415,190 L 450,190" stroke="#000" stroke-width="8" fill="none" />
        <circle cx="400" cy="140" r="16" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Super Squirrel at Computer/Desk -->
        <ellipse cx="140" cy="140" rx="45" ry="50" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="125" cy="135" r="5" fill="#000" /><circle cx="155" cy="135" r="5" fill="#000" />
        <path d="M 130,150 Q 140,160 150,150" stroke="#000" stroke-width="3" fill="none" />
      </g>
    `,

    // Page 8: Meadow Harvest Sharing
    8: `
      <g id="sq-page-8" transform="translate(40, 110)">
        <!-- Harvest Cart -->
        <rect x="160" y="250" width="190" height="95" rx="14" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="195" cy="360" r="32" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="315" cy="360" r="32" class="bold-outline colorable-region" fill="#ffffff" />

        <!-- Acorns Piled in Cart -->
        <circle cx="190" cy="230" r="22" class="chunky-stroke colorable-region" fill="#ffffff" />
        <circle cx="230" cy="220" r="24" class="chunky-stroke colorable-region" fill="#ffffff" />
        <circle cx="270" cy="225" r="22" class="chunky-stroke colorable-region" fill="#ffffff" />
        <circle cx="310" cy="235" r="20" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Friendly Bunny Receiving Acorn -->
        <ellipse cx="410" cy="320" rx="25" ry="35" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 400,285 L 395,235 M 420,285 L 425,235" stroke="#000" stroke-width="7" stroke-linecap="round" />
        <circle cx="405" cy="315" r="4" fill="#000" />

        <!-- Super Squirrel Pushing Cart -->
        <line x1="120" y1="280" x2="160" y2="290" stroke="#000" stroke-width="8" stroke-linecap="round" />
        <ellipse cx="90" cy="250" rx="40" ry="55" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="90" cy="155" r="40" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="80" cy="150" r="5" fill="#000" /><circle cx="100" cy="150" r="5" fill="#000" />
        <path d="M 85,165 Q 90,172 95,165" stroke="#000" stroke-width="3" fill="none" />
      </g>
    `,

    // Page 9: Windmill Troubleshooting
    9: `
      <g id="sq-page-9" transform="translate(40, 110)">
        <!-- Windmill Tower -->
        <polygon points="250,390 275,170 315,170 340,390" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="295" cy="170" r="24" class="bold-outline colorable-region" fill="#ffffff" />
        <ellipse cx="295" cy="90" rx="18" ry="48" class="chunky-stroke colorable-region" fill="#ffffff" />
        <ellipse cx="295" cy="250" rx="18" ry="48" class="chunky-stroke colorable-region" fill="#ffffff" />
        <ellipse cx="215" cy="170" rx="48" ry="18" class="chunky-stroke colorable-region" fill="#ffffff" />
        <ellipse cx="375" cy="170" rx="48" ry="18" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Ladder & Super Squirrel with Wrench -->
        <line x1="160" y1="190" x2="160" y2="400" stroke="#000" stroke-width="8" />
        <line x1="200" y1="190" x2="200" y2="400" stroke="#000" stroke-width="8" />
        <line x1="160" y1="230" x2="200" y2="230" stroke="#000" stroke-width="6" />
        <line x1="160" y1="280" x2="200" y2="280" stroke="#000" stroke-width="6" />
        <line x1="160" y1="330" x2="200" y2="330" stroke="#000" stroke-width="6" />
        
        <circle cx="180" cy="220" r="22" class="chunky-stroke colorable-region" fill="#ffffff" />
        <path d="M 195,225 L 225,200" stroke="#000" stroke-width="8" stroke-linecap="round" />
      </g>
    `,

    // Page 10: Woodland Honor Celebration
    10: `
      <g id="sq-page-10" transform="translate(40, 110)">
        <!-- 1st Place Victory Podium -->
        <polygon points="130,390 150,280 290,280 310,390" class="bold-outline colorable-region" fill="#ffffff" />
        <text x="205" y="348" font-family="'Outfit', sans-serif" font-weight="900" font-size="44" fill="#000">1</text>

        <!-- Golden Oak Leaf Medal on Ribbon -->
        <path d="M 190,180 L 215,220 M 240,180 L 215,220" stroke="#000" stroke-width="8" />
        <circle cx="215" cy="245" r="26" class="bold-outline colorable-region" fill="#ffffff" />
        <path d="M 215,228 Q 205,245 215,260 Q 225,245 215,228 Z" class="chunky-stroke colorable-region" fill="#ffffff" />

        <!-- Super Squirrel on Podium -->
        <ellipse cx="215" cy="210" rx="45" ry="60" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="215" cy="115" r="46" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="200" cy="110" r="6" fill="#000" /><circle cx="230" cy="110" r="6" fill="#000" />
        <path d="M 205,130 Q 215,142 225,130" stroke="#000" stroke-width="3.5" fill="none" />

        <!-- Cheering Friends in Foreground -->
        <ellipse cx="70" cy="380" rx="30" ry="40" class="chunky-stroke colorable-region" fill="#ffffff" />
        <ellipse cx="370" cy="380" rx="30" ry="40" class="chunky-stroke colorable-region" fill="#ffffff" />
        <!-- Floating Stars -->
        <polygon points="70,110 75,125 90,125 78,135 82,150 70,140 58,150 62,135 50,125 65,125" class="chunky-stroke colorable-region" fill="#ffffff" />
        <polygon points="360,100 365,115 380,115 368,125 372,140 360,130 348,140 352,125 340,115 355,115" class="chunky-stroke colorable-region" fill="#ffffff" />
      </g>
    `
  };

  return subjects[pageNumber] || subjects[1];
}

export function renderSuperSquirrelMaze() {
  return `
    <g id="super-squirrel-maze-container" transform="translate(60, 130)">
      <rect x="0" y="0" width="480" height="500" rx="18" class="bold-outline colorable-region" fill="#ffffff" />

      <!-- START: Treetop Branch -->
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="110" height="48" rx="10" fill="#000000" />
        <text x="12" y="32" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="16">🐿️ START</text>
      </g>

      <!-- FINISH: Golden Acorn Nest -->
      <g transform="translate(340, 432)">
        <rect x="0" y="0" width="120" height="48" rx="10" fill="#000000" />
        <text x="10" y="32" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="16">🌰 FINISH</text>
      </g>

      <!-- Maze Branch Paths -->
      <path d="M 130,0 L 130,130 M 230,70 L 370,70 M 370,0 L 370,140" class="maze-wall" />
      <path d="M 0,140 L 230,140 M 300,140 L 480,140" class="maze-wall" />
      <path d="M 70,210 L 70,350 M 150,280 L 310,280 M 390,210 L 390,350" class="maze-wall" />
      <path d="M 0,350 L 150,350 M 230,350 L 480,350" class="maze-wall" />
      <path d="M 120,420 L 230,420 M 310,420 L 480,420" class="maze-wall" />

      <!-- Oak Leaf & Acorn Vector Obstacles in Dead Ends -->
      <circle cx="180" cy="105" r="16" class="chunky-stroke colorable-region" fill="#ffffff" />
      <circle cx="430" cy="245" r="16" class="chunky-stroke colorable-region" fill="#ffffff" />
      <circle cx="40" cy="275" r="16" class="chunky-stroke colorable-region" fill="#ffffff" />
      <circle cx="270" cy="385" r="16" class="chunky-stroke colorable-region" fill="#ffffff" />
    </g>
  `;
}

export function renderSuperSquirrelStemProject(pageData) {
  const masterArc = pageData.masterArcClue || { issueNumber: 1, componentName: "Eco-Aerodynamic Acorn Launch Module", grandProjectTitle: "The Solar Smart Eco-Citadel", hintText: "Harnessing spring elasticity and kinetic launch angles to deliver forest supplies." };

  return `
    <g id="super-squirrel-stem-blueprint" transform="translate(40, 120)">
      <rect x="0" y="0" width="520" height="510" rx="16" fill="#ffffff" stroke="#000000" stroke-width="4" />
      
      <!-- Header Banner -->
      <rect x="30" y="25" width="460" height="90" rx="10" fill="#ffffff" stroke="#000000" stroke-width="3" />
      <text x="45" y="60" fill="#000000" font-family="'Outfit', sans-serif" font-weight="800" font-size="18">🔨 STEM BUILD: Acorn Catapult &amp; Glider Launcher</text>
      <text x="45" y="90" fill="#0f172a" font-family="'Inter', sans-serif" font-size="13">Materials: 6 Craft sticks, rubber bands, plastic bottle cap, pom-pom acorn</text>

      <!-- Craft Catapult Diagram -->
      <g transform="translate(90, 135)">
        <!-- Stack of 5 sticks base -->
        <rect x="80" y="90" width="180" height="40" rx="8" class="bold-outline colorable-region" fill="#ffffff" />
        <line x1="100" y1="90" x2="100" y2="130" stroke="#000" stroke-width="6" />
        <line x1="240" y1="90" x2="240" y2="130" stroke="#000" stroke-width="6" />
        <text x="115" y="115" font-family="'Outfit', sans-serif" font-weight="700" font-size="12" fill="#000">5-STICK BASE STACK</text>

        <!-- Tilting Launch Lever Stick -->
        <line x1="40" y1="120" x2="290" y2="30" stroke="#000" stroke-width="16" stroke-linecap="round" />
        <rect x="260" y="5" width="45" height="30" rx="6" class="bold-outline colorable-region" fill="#ffffff" />
        <circle cx="282" cy="12" r="14" class="chunky-stroke colorable-region" fill="#ffffff" />
        <text x="270" y="48" font-family="'Outfit', sans-serif" font-weight="800" font-size="11" fill="#000">ACORN</text>

        <!-- Trajectory Launch Arc -->
        <path d="M 285,5 Q 330,-30 380,20" stroke="#e11d48" stroke-width="5" stroke-dasharray="8,6" fill="none" />
        <polygon points="380,20 370,12 378,5" fill="#e11d48" />
        <text x="320" y="-15" font-family="'Outfit', sans-serif" font-weight="800" font-size="12" fill="#e11d48">FLIGHT PATH</text>
      </g>

      <!-- Master Blueprint Clue Card -->
      <rect x="30" y="330" width="460" height="150" rx="10" fill="#ffffff" stroke="#000000" stroke-width="3" />
      <text x="50" y="365" fill="#000000" font-family="'Outfit', sans-serif" font-weight="800" font-size="18">🏆 MASTER BLUEPRINT CLUE: Eco-Citadel Series</text>
      <text x="50" y="400" fill="#000000" font-family="'Outfit', sans-serif" font-weight="800" font-size="15">🧩 Component: ${escapeXml(masterArc.componentName)}</text>
      <text x="50" y="440" fill="#475569" font-family="'Inter', sans-serif" font-style="italic" font-size="13">"Hint: ${escapeXml(masterArc.hintText)}"</text>
    </g>
  `;
}
