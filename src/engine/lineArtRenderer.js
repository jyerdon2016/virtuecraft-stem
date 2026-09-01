/**
 * VirtueCraft STEM - Dynamic Vector Line-Art Renderer & Interactive Engine
 * 
 * Generates 100% crisp black & white SVG line art illustrations for all 12 pages:
 *   - Pages 1-10: Detailed story & technical skill scenes
 *   - Page 11: Interactive vector line-art circuit maze
 *   - Page 12: Household STEM project blueprint & Year 1 Master Clue #1
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
    sceneGraphics = renderVectorMaze();
  } else if (type === "stem-project" || pageNumber === 12) {
    sceneGraphics = renderStemProjectBlueprint(pageData);
  } else {
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
          .hidden-shape:hover { stroke: #e11d48; stroke-width: 4; fill: #fff1f2; }
          .hidden-shape.found { stroke: #0d9488; stroke-width: 4; fill: #ccfbf1; }
          .page-text { font-family: 'Outfit', 'Inter', sans-serif; fill: #0f172a; }
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
      <rect x="30" y="30" width="${width - 60}" height="70" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
      <text x="50" y="60" class="page-text" font-size="19" font-weight="700" fill="#1e40af">${escapeXml(title)}</text>
      <text x="50" y="85" class="page-text" font-size="13" fill="#64748b">Virtue Focus: <tspan font-weight="bold" fill="#0d9488">${escapeXml(virtue)}</tspan> | Skill: <tspan font-weight="bold">${escapeXml(pageData.technicalSkill || "Engineering")}</tspan></text>

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
      <rect x="30" y="650" width="${width - 60}" height="70" rx="10" fill="#fffbebe" stroke="#f59e0b" stroke-width="2" />
      <text x="50" y="678" class="page-text" font-size="14" font-weight="700" fill="#92400e">🔍 Seek-and-Find Challenge:</text>
      <text x="50" y="702" class="page-text" font-size="13" fill="#475569">Find ${hiddenCount} hidden <tspan font-weight="bold" fill="#e11d48">'${hiddenShape}'</tspan> shapes in the line art above! Color them when found.</text>
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

/* Page 11: Vector Circuit Pathfinder Maze */
function renderVectorMaze() {
  return `
    <g id="maze-container" transform="translate(60, 130)">
      <rect x="0" y="0" width="480" height="500" rx="12" class="bold-outline" />

      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="80" height="40" rx="6" fill="#22c55e" stroke="#15803d" stroke-width="2" />
        <text x="14" y="26" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="16">START</text>
      </g>

      <g transform="translate(380, 440)">
        <rect x="0" y="0" width="80" height="40" rx="6" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
        <text x="12" y="26" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="16">FINISH</text>
      </g>

      <path d="M 100,0 L 100,120 M 180,60 L 320,60 M 320,0 L 320,120 M 400,60 L 480,60" class="maze-wall" />
      <path d="M 0,120 L 180,120 M 240,120 L 400,120" class="maze-wall" />
      <path d="M 60,180 L 60,300 M 120,240 L 240,240 M 300,180 L 420,180 M 420,120 L 420,240" class="maze-wall" />
      <path d="M 0,300 L 120,300 M 180,300 L 360,300 M 360,240 L 480,240" class="maze-wall" />
      <path d="M 60,360 L 60,440 M 120,360 L 240,360 M 300,360 L 300,480 M 420,360 L 420,440" class="maze-wall" />
      <path d="M 180,420 L 240,420 M 360,420 L 480,420" class="maze-wall" />

      <circle cx="210" cy="180" r="16" class="outline" />
      <path d="M 202,180 L 218,180 M 210,172 L 210,188" stroke="#000" stroke-width="2" />
      <text x="130" y="475" class="page-text" font-size="14" font-weight="700" fill="#1e40af">⚡ Trace the path from START to FINISH!</text>
    </g>
  `;
}

/* Page 12: STEM Project & Master Blueprint Clue #1 */
function renderStemProjectBlueprint(pageData) {
  const masterArc = pageData.masterArcClue || { issueNumber: 1, componentName: "Base Foundation & Power Grid Traces", grandProjectTitle: "The Solar Smart Eco-Citadel" };
  const stem = pageData.stemProjectDetails || { projectName: "Cardboard Baseplate & Foil Circuit Traces", materials: ["Cardboard", "Foil", "Tape"] };

  return `
    <g id="stem-blueprint-container" transform="translate(40, 120)">
      <rect x="0" y="0" width="520" height="510" rx="12" fill="#f0f9ff" stroke="#0284c7" stroke-width="3" />
      <path d="M 0,50 L 520,50 M 0,100 L 520,100 M 0,150 L 520,150 M 0,200 L 520,200 M 0,250 L 520,250 M 0,300 L 520,300 M 0,350 L 520,350 M 0,400 L 520,400 M 0,450 L 520,450" stroke="#bae6fd" stroke-width="1.5" fill="none" />
      <path d="M 50,0 L 50,510 M 100,0 L 100,510 M 150,0 L 150,510 M 200,0 L 200,510 M 250,0 L 250,510 M 300,0 L 300,510 M 350,0 L 350,510 M 400,0 L 400,510 M 450,0 L 450,510" stroke="#bae6fd" stroke-width="1.5" fill="none" />

      <rect x="20" y="20" width="480" height="80" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2" />
      <text x="35" y="52" fill="#0369a1" font-family="'Outfit', sans-serif" font-weight="800" font-size="17">🔨 YEAR 1 ISSUE #1 BUILD: ${escapeXml(stem.projectName)}</text>
      <text x="35" y="78" fill="#334155" font-family="'Inter', sans-serif" font-size="13">Materials needed: ${escapeXml(stem.materials.join(", "))}</text>

      <g transform="translate(140, 120)">
        <rect x="0" y="0" width="240" height="150" rx="10" class="bold-outline" />
        <path d="M 20,30 L 220,30 M 20,70 L 220,70 M 20,110 L 220,110" stroke="#0284c7" stroke-width="3" stroke-dasharray="6,4" fill="none" />
        <circle cx="120" cy="75" r="30" fill="#fef08a" stroke="#ca8a04" stroke-width="3" />
        <text x="105" y="82" font-family="'Outfit', sans-serif" font-weight="800" font-size="18" fill="#854d0e">LED</text>
      </g>

      <rect x="20" y="300" width="480" height="180" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="3" />
      <text x="40" y="335" fill="#92400e" font-family="'Outfit', sans-serif" font-weight="800" font-size="17">🏆 YEAR 1 MASTER BLUEPRINT CLUE (#1 of 12)</text>
      <text x="40" y="365" fill="#78350f" font-family="'Inter', sans-serif" font-weight="700" font-size="14">Master Project: ${escapeXml(masterArc.grandProjectTitle)}</text>
      <rect x="40" y="380" width="440" height="50" rx="6" fill="#ffffff" stroke="#f59e0b" stroke-width="2" />
      <text x="55" y="412" fill="#b45309" font-family="'Outfit', sans-serif" font-weight="800" font-size="15">🧩 Component #1: ${escapeXml(masterArc.componentName)}</text>
      <text x="40" y="458" fill="#92400e" font-family="'Inter', sans-serif" font-style="italic" font-size="13">"Hint: ${escapeXml(masterArc.hintText)}"</text>
    </g>
  `;
}

/* 10 Unique Handcrafted Vector Scenes for Story Pages 1 through 10 */
function renderStorySceneIllustration(pageNumber) {
  const scenes = {
    // Page 1: Blueprint & Planning
    1: `
      <g transform="translate(140, 260)">
        <rect x="40" y="100" width="240" height="150" rx="8" class="bold-outline" /> <!-- Desk -->
        <circle cx="120" cy="50" r="32" class="bold-outline" /> <!-- Child Head -->
        <path d="M 120,82 L 120,150 M 120,105 L 70,140 M 120,105 L 170,140" class="bold-outline" />
        <rect x="180" y="120" width="80" height="60" rx="4" class="outline" /> <!-- Blueprint -->
        <path d="M 190,135 L 250,135 M 190,150 L 230,150" stroke="#000" stroke-width="2" />
        <circle cx="110" cy="45" r="4" fill="#000" /> <circle cx="130" cy="45" r="4" fill="#000" />
        <path d="M 110,60 Q 120,68 130,60" stroke="#000" stroke-width="3" fill="none" />
      </g>
    `,
    // Page 2: Microcontroller (The Brain)
    2: `
      <g transform="translate(180, 270)">
        <rect x="40" y="40" width="160" height="200" rx="16" class="bold-outline" />
        <circle cx="90" cy="110" r="12" fill="#000" /> <circle cx="150" cy="110" r="12" fill="#000" />
        <path d="M 80,150 Q 120,180 160,150" stroke="#000" stroke-width="4" fill="none" />
        <text x="65" y="80" class="page-text" font-size="16" font-weight="700" fill="#1e40af">ESP32 BRAIN</text>
        <path d="M 20,60 L 40,60 M 20,90 L 40,90 M 20,120 L 40,120 M 20,150 L 40,150 M 20,180 L 40,180" class="bold-outline" />
        <path d="M 200,60 L 220,60 M 200,90 L 220,90 M 200,120 L 220,120 M 200,150 L 220,150 M 200,180 L 220,180" class="bold-outline" />
      </g>
    `,
    // Page 3: Sensors (The Senses)
    3: `
      <g transform="translate(150, 300)">
        <rect x="20" y="80" width="260" height="110" rx="8" class="bold-outline" />
        <path d="M 40,100 L 260,100 M 40,120 L 260,120 M 40,140 L 260,140" stroke="#000" stroke-width="2" stroke-dasharray="4,4" fill="none" />
        <rect x="110" y="20" width="70" height="60" rx="4" class="outline" />
        <text x="118" y="55" class="page-text" font-size="13" font-weight="700">DHT11</text>
        <path d="M 125,80 C 100,120 90,130 70,110 M 165,80 C 190,120 200,130 220,110" class="bold-outline" fill="none" />
      </g>
    `,
    // Page 4: Audio Speaker (The Voice)
    4: `
      <g transform="translate(170, 280)">
        <circle cx="130" cy="110" r="60" class="bold-outline" />
        <circle cx="130" cy="110" r="30" class="outline" />
        <path d="M 210,80 C 230,95 230,125 210,140 M 230,60 C 260,85 260,135 230,160" stroke="#1e40af" stroke-width="4" fill="none" stroke-linecap="round" />
        <text x="95" y="195" class="page-text" font-size="15" font-weight="700" fill="#0d9488">PAM8403 SOUND</text>
      </g>
    `,
    // Page 5: Soldering Safety & Teamwork
    5: `
      <g transform="translate(150, 270)">
        <circle cx="80" cy="50" r="28" class="bold-outline" />
        <circle cx="200" cy="50" r="28" class="bold-outline" />
        <!-- Safety Goggles -->
        <rect x="65" y="42" width="30" height="14" rx="4" fill="#000" />
        <rect x="185" y="42" width="30" height="14" rx="4" fill="#000" />
        <path d="M 80,78 L 80,160 M 200,78 L 200,160 M 80,110 L 140,130 M 200,110 L 140,130" class="bold-outline" fill="none" />
        <!-- Soldering Iron -->
        <path d="M 140,130 L 110,180" stroke="#000" stroke-width="6" stroke-linecap="round" />
        <!-- Smoke Wisps -->
        <path d="M 140,120 C 135,100 145,90 140,70" stroke="#cbd5e1" stroke-width="3" fill="none" />
      </g>
    `,
    // Page 6: Servo Motors (The Muscles)
    6: `
      <g transform="translate(170, 280)">
        <rect x="50" y="60" width="140" height="120" rx="8" class="bold-outline" />
        <circle cx="120" cy="60" r="20" class="outline" />
        <path d="M 120,40 L 180,20" class="bold-outline" />
        <circle cx="180" cy="20" r="8" fill="#000" />
        <text x="75" y="130" class="page-text" font-size="14" font-weight="700">SERVO ARM</text>
      </g>
    `,
    // Page 7: Clean Battery Power (The Energy)
    7: `
      <g transform="translate(180, 270)">
        <rect x="50" y="50" width="120" height="180" rx="10" class="bold-outline" />
        <rect x="90" y="30" width="40" height="20" rx="4" fill="#000" />
        <text x="80" y="100" class="page-text" font-size="32" font-weight="800" fill="#22c55e">+</text>
        <text x="82" y="180" class="page-text" font-size="32" font-weight="800" fill="#ef4444">-</text>
        <text x="65" y="215" class="page-text" font-size="13" font-weight="700">POWER CELL</text>
      </g>
    `,
    // Page 8: Block Code Instructions
    8: `
      <g transform="translate(140, 260)">
        <rect x="30" y="40" width="260" height="160" rx="10" class="bold-outline" />
        <!-- Code Puzzle Blocks -->
        <rect x="50" y="60" width="140" height="35" rx="6" fill="#eff6ff" stroke="#1e40af" stroke-width="2" />
        <text x="65" y="83" font-family="'Outfit', sans-serif" font-weight="700" font-size="14" fill="#1e40af">IF (SENSOR == HIGH)</text>
        
        <rect x="70" y="105" width="140" height="35" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" />
        <text x="85" y="128" font-family="'Outfit', sans-serif" font-weight="700" font-size="14" fill="#16a34a">MOVE_ARM(90°)</text>
      </g>
    `,
    // Page 9: Peaceful Troubleshooting
    9: `
      <g transform="translate(160, 270)">
        <circle cx="120" cy="60" r="30" class="bold-outline" />
        <path d="M 120,90 L 120,170 M 120,120 L 70,150" class="bold-outline" fill="none" />
        <!-- Magnifying Glass -->
        <circle cx="65" cy="155" r="22" stroke="#000" stroke-width="4" fill="none" />
        <path d="M 50,170 L 30,195" stroke="#000" stroke-width="6" stroke-linecap="round" />
        <text x="75" y="210" class="page-text" font-size="14" font-weight="700" fill="#0d9488">DEBUGGING</text>
      </g>
    `,
    // Page 10: Helper Bot Serving Neighbors
    10: `
      <g transform="translate(150, 260)">
        <!-- Friendly Helper Bot -->
        <rect x="60" y="50" width="120" height="100" rx="14" class="bold-outline" />
        <circle cx="90" cy="85" r="10" fill="#000" /> <circle cx="150" cy="85" r="10" fill="#000" />
        <path d="M 95,115 Q 120,135 145,115" stroke="#000" stroke-width="3" fill="none" />
        <!-- Serving Tray -->
        <path d="M 30,160 L 210,160 M 40,160 L 40,180 M 200,160 L 200,180" class="bold-outline" />
        <rect x="100" y="125" width="40" height="35" rx="4" class="outline" /> <!-- Glass of Water -->
      </g>
    `
  };

  return scenes[pageNumber] || scenes[1];
}

function escapeXml(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
