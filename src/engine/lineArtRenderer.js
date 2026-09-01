/**
 * VirtueTech AI - Dynamic Vector Line-Art Renderer & Interactive Seek-and-Find Engine
 * 
 * Generates crisp black & white SVG line art illustrations, interactive vector mazes (Page 11),
 * hands-on STEM project blueprints (Page 12), and embedded seek-and-find shapes.
 */

export function renderPageSVG(pageData, width = 600, height = 750) {
  const { title, virtue, hiddenShape, hiddenCount = 3, pageNumber, type } = pageData;

  // Deterministic hidden shape positions
  const hiddenPositions = [];
  const coords = [
    { x: 120, y: 150, scale: 0.8, rot: 15 },
    { x: 450, y: 180, scale: 0.7, rot: -20 },
    { x: 500, y: 550, scale: 0.9, rot: 45 },
    { x: 100, y: 600, scale: 0.75, rot: -10 },
    { x: 280, y: 680, scale: 0.85, rot: 30 }
  ];

  for (let i = 0; i < Math.min(hiddenCount, coords.length); i++) {
    hiddenPositions.push({
      id: `hidden-obj-${pageNumber}-${i}`,
      ...coords[(i + pageNumber) % coords.length],
      type: hiddenShape || "Cross-my-heart"
    });
  }

  let sceneGraphics = "";

  if (type === "puzzle" || pageNumber === 11) {
    // Render Page 11 Interactive Maze
    sceneGraphics = renderVectorMaze();
  } else if (type === "stem-project" || pageNumber === 12) {
    // Render Page 12 STEM Project & Blueprint Clue
    sceneGraphics = renderStemProjectBlueprint(pageData);
  } else {
    // Render Story Line Art Scenes
    sceneGraphics = renderStorySceneIllustration(pageNumber);
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="coloring-page-svg">
      <defs>
        <style>
          .outline { stroke: #1a1a1a; stroke-width: 3.5; fill: #ffffff; stroke-linecap: round; stroke-linejoin: round; }
          .bold-outline { stroke: #000000; stroke-width: 5; fill: #ffffff; stroke-linecap: round; stroke-linejoin: round; }
          .detail-line { stroke: #2c3e50; stroke-width: 2; fill: none; }
          .maze-wall { stroke: #1a1a1a; stroke-width: 6; fill: none; stroke-linecap: round; }
          .hidden-shape { stroke: #1a1a1a; stroke-width: 2.5; fill: #ffffff; cursor: pointer; transition: all 0.3s ease; }
          .hidden-shape:hover { stroke: #e74c3c; stroke-width: 4; fill: #fff5f5; }
          .hidden-shape.found { stroke: #27ae60; stroke-width: 4; fill: #e8f8f5; }
          .page-text { font-family: 'Outfit', 'Inter', sans-serif; fill: #2c3e50; }
        </style>

        <!-- Hidden Shape Definitions -->
        <g id="shape-cross-heart">
          <path d="M 0,-12 C -8,-22 -20,-12 -20,0 C -20,12 0,22 0,22 C 0,22 20,12 20,0 C 20,-12 8,-22 0,-12 Z" />
          <path d="M 0,-8 L 0,10 M -6,-2 L 6,-2" stroke="#1a1a1a" stroke-width="2" />
        </g>

        <g id="shape-star">
          <polygon points="0,-18 5,-5 18,-4 8,5 11,18 0,10 -11,18 -8,5 -18,-4 -5,-5" />
        </g>

        <g id="shape-anchor">
          <circle cx="0" cy="-12" r="4" stroke="#1a1a1a" stroke-width="2" fill="none" />
          <path d="M 0,-8 L 0,12 M -12,4 C -12,16 12,16 12,4" stroke="#1a1a1a" stroke-width="3" fill="none" />
        </g>

        <g id="shape-fish">
          <path d="M -15,0 C -5,-12 12,0 15,0 C 12,0 -5,12 -15,0 Z M 12,0 L 20,-8 L 20,8 Z" />
          <circle cx="-5" cy="-2" r="1.5" fill="#1a1a1a" />
        </g>
      </defs>

      <!-- Page Canvas Border -->
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="16" class="bold-outline" />

      <!-- Header Section -->
      <rect x="30" y="30" width="${width - 60}" height="70" rx="10" fill="#f8f9fa" stroke="#dcdfe6" stroke-width="2" />
      <text x="50" y="60" class="page-text" font-size="19" font-weight="700">${escapeXml(title)}</text>
      <text x="50" y="85" class="page-text" font-size="13" fill="#666">Virtue Focus: <tspan font-weight="bold" fill="#2b6cb0">${escapeXml(virtue)}</tspan> | Skill: <tspan font-weight="bold">${escapeXml(pageData.technicalSkill || "STEM Engineering")}</tspan></text>

      <!-- Central Scene Graphics -->
      ${sceneGraphics}

      <!-- Embedded Seek-and-Find Layer -->
      <g id="seek-and-find-layer">
        ${hiddenPositions.map(pos => `
          <g class="hidden-shape" data-id="${pos.id}" transform="translate(${pos.x}, ${pos.y}) scale(${pos.scale}) rotate(${pos.rot})">
            <use href="#${getShapeSvgId(pos.type)}" />
          </g>
        `).join("")}
      </g>

      <!-- Bottom Banner & Instructions -->
      <rect x="30" y="650" width="${width - 60}" height="70" rx="10" fill="#fffaf0" stroke="#ecc94b" stroke-width="2" />
      <text x="50" y="678" class="page-text" font-size="14" font-weight="700" fill="#742a2a">🔍 Seek-and-Find Challenge:</text>
      <text x="50" y="702" class="page-text" font-size="13" fill="#4a5568">Find ${hiddenCount} hidden <tspan font-weight="bold" fill="#c53030">'${hiddenShape}'</tspan> shapes in the line art above! Click when found.</text>
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

/* Page 11: Render Vector Circuit Pathfinder Maze */
function renderVectorMaze() {
  return `
    <g id="maze-container" transform="translate(60, 130)">
      <!-- Maze Frame -->
      <rect x="0" y="0" width="480" height="500" rx="12" class="bold-outline" />

      <!-- START & FINISH Nodes -->
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="80" height="40" rx="6" fill="#22c55e" stroke="#15803d" stroke-width="2" />
        <text x="14" y="26" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="16">START</text>
      </g>

      <g transform="translate(380, 440)">
        <rect x="0" y="0" width="80" height="40" rx="6" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
        <text x="12" y="26" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="16">FINISH</text>
      </g>

      <!-- Vector Maze Outer & Inner Walls -->
      <path d="M 100,0 L 100,120 M 180,60 L 320,60 M 320,0 L 320,120 M 400,60 L 480,60" class="maze-wall" />
      <path d="M 0,120 L 180,120 M 240,120 L 400,120" class="maze-wall" />
      <path d="M 60,180 L 60,300 M 120,240 L 240,240 M 300,180 L 420,180 M 420,120 L 420,240" class="maze-wall" />
      <path d="M 0,300 L 120,300 M 180,300 L 360,300 M 360,240 L 480,240" class="maze-wall" />
      <path d="M 60,360 L 60,440 M 120,360 L 240,360 M 300,360 L 300,480 M 420,360 L 420,440" class="maze-wall" />
      <path d="M 180,420 L 240,420 M 360,420 L 480,420" class="maze-wall" />

      <!-- Circuit Decor Icons in Corridors -->
      <circle cx="210" cy="180" r="16" class="outline" />
      <path d="M 202,180 L 218,180 M 210,172 L 210,188" stroke="#000" stroke-width="2" />
      <text x="145" y="475" class="page-text" font-size="14" font-weight="700" fill="#2563eb">⚡ Trace the path from START to FINISH!</text>
    </g>
  `;
}

/* Page 12: Render STEM Project Blueprint Schematic */
function renderStemProjectBlueprint(pageData) {
  const masterArc = pageData.masterArcClue || { issueNumber: 1, componentName: "Base Foundation", grandProjectTitle: "The Solar Smart Eco-Citadel" };
  const stem = pageData.stemProjectDetails || { projectName: "Foil & Cardboard Circuit", materials: ["Cardboard", "Foil", "Tape"] };

  return `
    <g id="stem-blueprint-container" transform="translate(40, 120)">
      <!-- Blueprint Grid Background -->
      <rect x="0" y="0" width="520" height="510" rx="12" fill="#f0f9ff" stroke="#0284c7" stroke-width="3" />
      <path d="M 0,50 L 520,50 M 0,100 L 520,100 M 0,150 L 520,150 M 0,200 L 520,200 M 0,250 L 520,250 M 0,300 L 520,300 M 0,350 L 520,350 M 0,400 L 520,400 M 0,450 L 520,450" stroke="#bae6fd" stroke-width="1.5" fill="none" />
      <path d="M 50,0 L 50,510 M 100,0 L 100,510 M 150,0 L 150,510 M 200,0 L 200,510 M 250,0 L 250,510 M 300,0 L 300,510 M 350,0 L 350,510 M 400,0 L 400,510 M 450,0 L 450,510" stroke="#bae6fd" stroke-width="1.5" fill="none" />

      <!-- STEM Project Header -->
      <rect x="20" y="20" width="480" height="80" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2" />
      <text x="35" y="52" fill="#0369a1" font-family="'Outfit', sans-serif" font-weight="800" font-size="18">🔨 HANDS-ON BUILD: ${escapeXml(stem.projectName)}</text>
      <text x="35" y="78" fill="#334155" font-family="'Inter', sans-serif" font-size="13">Materials needed: ${escapeXml(stem.materials.join(", "))}</text>

      <!-- Assembly Illustration -->
      <g transform="translate(140, 120)">
        <rect x="0" y="0" width="240" height="150" rx="10" class="bold-outline" />
        <path d="M 20,30 L 220,30 M 20,70 L 220,70 M 20,110 L 220,110" stroke="#0284c7" stroke-width="3" stroke-dasharray="6,4" fill="none" />
        <circle cx="120" cy="75" r="30" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />
        <text x="105" y="82" font-family="'Outfit', sans-serif" font-weight="800" font-size="20" fill="#854d0e">LED</text>
      </g>

      <!-- Cumulative Master Arc Badge -->
      <rect x="20" y="300" width="480" height="180" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="3" />
      <text x="40" y="335" fill="#92400e" font-family="'Outfit', sans-serif" font-weight="800" font-size="18">🏆 CUMULATIVE MASTER BLUEPRINT arc (Issue #${masterArc.issueNumber} of 12)</text>
      <text x="40" y="365" fill="#78350f" font-family="'Inter', sans-serif" font-weight="700" font-size="15">Master Project: ${escapeXml(masterArc.grandProjectTitle)}</text>
      <rect x="40" y="380" width="440" height="50" rx="6" fill="#ffffff" stroke="#f59e0b" stroke-width="2" />
      <text x="55" y="412" fill="#b45309" font-family="'Outfit', sans-serif" font-weight="800" font-size="16">🧩 Collected Component #${masterArc.issueNumber}: ${escapeXml(masterArc.componentName)}</text>
      <text x="40" y="458" fill="#92400e" font-family="'Inter', sans-serif" font-style="italic" font-size="13">"Hint: ${escapeXml(masterArc.hintText)}"</text>
    </g>
  `;
}

/* Render Story Line Art Scenes for Pages 1-10 */
function renderStorySceneIllustration(pageNumber) {
  const scenes = [
    // Scene 1: Child drawing at workbench
    `
      <g transform="translate(180, 330)">
        <circle cx="60" cy="40" r="30" class="bold-outline" />
        <path d="M 60,70 L 60,150 M 60,100 L 10,140 M 60,100 L 110,140" class="bold-outline" />
        <path d="M 60,150 L 30,190 M 60,150 L 90,190" class="bold-outline" />
        <circle cx="50" cy="35" r="4" fill="#000" /> <circle cx="70" cy="35" r="4" fill="#000" />
        <path d="M 48,50 Q 60,60 72,50" stroke="#000" stroke-width="3" fill="none" />
        <rect x="140" y="140" width="120" height="80" rx="4" class="outline" />
        <path d="M 150,160 L 240,160 M 150,180 L 210,180 M 150,200 L 230,200" class="detail-line" />
      </g>
    `,
    // Scene 2: ESP32 Microcontroller Character
    `
      <g transform="translate(180, 280)">
        <rect x="40" y="40" width="160" height="200" rx="16" class="bold-outline" />
        <circle cx="90" cy="110" r="12" fill="#000" /> <circle cx="150" cy="110" r="12" fill="#000" />
        <path d="M 80,150 Q 120,180 160,150" stroke="#000" stroke-width="4" fill="none" />
        <text x="70" y="80" class="page-text" font-size="16" font-weight="700">MICRO-BRAIN</text>
        <path d="M 20,60 L 40,60 M 20,90 L 40,90 M 20,120 L 40,120 M 20,150 L 40,150" class="bold-outline" />
        <path d="M 200,60 L 220,60 M 200,90 L 220,90 M 200,120 L 220,120 M 200,150 L 220,150" class="bold-outline" />
      </g>
    `,
    // Scene 3: Sensor & Breadboard Wiring
    `
      <g transform="translate(150, 310)">
        <rect x="20" y="80" width="260" height="110" rx="8" class="bold-outline" />
        <path d="M 40,100 L 260,100 M 40,120 L 260,120 M 40,140 L 260,140 M 40,160 L 260,160" class="detail-line" stroke-dasharray="4,4" />
        <rect x="110" y="30" width="70" height="60" rx="4" class="outline" />
        <text x="120" y="65" class="page-text" font-size="12" font-weight="700">SENSOR</text>
        <path d="M 125,90 C 100,130 90,140 70,120" class="bold-outline" fill="none" />
        <path d="M 165,90 C 190,130 200,140 220,120" class="bold-outline" fill="none" />
      </g>
    `
  ];

  return scenes[(pageNumber - 1) % scenes.length];
}

function escapeXml(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
