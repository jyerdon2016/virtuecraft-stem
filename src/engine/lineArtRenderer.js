/**
 * VirtueCraft STEM - Dynamic Vector Line-Art Renderer & Interactive Engine
 * 
 * Generates 100% crisp black & white SVG line art illustrations matching the exact
 * 5-sentence scene descriptions for all 12 pages of Year 1 Issue #1.
 */

export function renderPageSVG(pageData, width = 600, height = 750) {
  const { title, virtue, hiddenShape, hiddenCount = 3, pageNumber, type } = pageData;

  // Deterministic hidden shape positions matching scene context
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
    sceneGraphics = renderDetailedStoryScene(pageNumber);
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="coloring-page-svg">
      <defs>
        <style>
          .outline { stroke: #1a1a1a; stroke-width: 3.5; fill: #ffffff; stroke-linecap: round; stroke-linejoin: round; }
          .bold-outline { stroke: #000000; stroke-width: 5; fill: #ffffff; stroke-linecap: round; stroke-linejoin: round; }
          .detail-line { stroke: #2c3e50; stroke-width: 2; fill: none; stroke-linecap: round; }
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

      <!-- Outer Page Canvas Border -->
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="16" class="bold-outline" />

      <!-- Page Header Callout -->
      <rect x="30" y="30" width="${width - 60}" height="70" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
      <text x="50" y="60" class="page-text" font-size="19" font-weight="700" fill="#1e40af">${escapeXml(title)}</text>
      <text x="50" y="85" class="page-text" font-size="13" fill="#64748b">Virtue Focus: <tspan font-weight="bold" fill="#0d9488">${escapeXml(virtue)}</tspan> | Technical Skill: <tspan font-weight="bold">${escapeXml(pageData.technicalSkill || "Engineering")}</tspan></text>

      <!-- Central Scene Line Art Illustration -->
      ${sceneGraphics}

      <!-- Embedded Seek-and-Find Layer -->
      <g id="seek-and-find-layer">
        ${hiddenPositions.map(pos => `
          <g class="hidden-shape" data-id="${pos.id}" transform="translate(${pos.x}, ${pos.y}) scale(${pos.scale}) rotate(${pos.rot})">
            <use href="#${getShapeSvgId(pos.type)}" />
          </g>
        `).join("")}
      </g>

      <!-- Bottom Seek-and-Find Challenge Bar -->
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

/* Page 11: Circuit Pathfinder Vector Maze */
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

/* Page 12: Household STEM Project & Master Blueprint Clue #1 */
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

/* 10 Handcrafted Rich Vector SVG Scenes Matching Every Detail of the 5-Sentence Descriptions */
function renderDetailedStoryScene(pageNumber) {
  const scenes = {
    // Page 1: Child at Sunlit Workbench Sketching Robot Blueprint (Patience)
    1: `
      <g transform="translate(60, 110)">
        <!-- Sunlit Window with Sunbeams -->
        <rect x="30" y="20" width="160" height="180" rx="8" class="bold-outline" />
        <path d="M 110,20 L 110,200 M 30,110 L 190,110" class="outline" />
        <path d="M 190,30 L 320,160 M 190,90 L 380,240 M 190,150 L 440,300" stroke="#fde047" stroke-width="3" stroke-dasharray="8,8" fill="none" />
        
        <!-- Shelf with Toy Helper Bot -->
        <path d="M 330,80 L 450,80 M 330,95 L 450,95" class="bold-outline" />
        <g transform="translate(360, 20)">
          <rect x="10" y="10" width="40" height="35" rx="6" class="outline" /> <!-- Bot Head -->
          <circle cx="22" cy="24" r="3" fill="#000" /> <circle cx="38" cy="24" r="3" fill="#000" />
          <rect x="5" y="45" width="50" height="30" rx="4" class="outline" /> <!-- Bot Body -->
        </g>

        <!-- Workbench Table -->
        <rect x="20" y="250" width="440" height="230" rx="8" class="bold-outline" />
        <path d="M 40,480 L 40,530 M 440,480 L 440,530" class="bold-outline" />

        <!-- 7-Year-Old Child Figure -->
        <g transform="translate(80, 160)">
          <circle cx="50" cy="35" r="28" class="bold-outline" /> <!-- Head -->
          <circle cx="42" cy="30" r="3" fill="#000" /> <circle cx="58" cy="30" r="3" fill="#000" />
          <path d="M 42,46 Q 50,54 58,46" stroke="#000" stroke-width="3" fill="none" /> <!-- Focused Smile -->
          <path d="M 50,63 L 50,150 M 50,90 L 120,120 M 50,90 L 20,130" class="bold-outline" /> <!-- Arms -->
          <!-- Pencil & Plastic Ruler -->
          <rect x="110" y="115" width="40" height="8" rx="2" class="outline" /> <!-- Ruler -->
          <path d="M 120,110 L 140,125" stroke="#000" stroke-width="4" stroke-linecap="round" /> <!-- Pencil -->
        </g>

        <!-- Blueprint Sheet with Robot Drawing -->
        <rect x="210" y="275" width="210" height="150" rx="6" class="bold-outline" />
        <text x="230" y="300" font-family="'Outfit', sans-serif" font-weight="800" font-size="14" fill="#1e40af">ROBOT BLUEPRINT v1.0</text>
        <rect x="280" y="315" width="70" height="80" rx="6" stroke="#0284c7" stroke-width="2.5" fill="none" stroke-dasharray="4,4" />
        <circle cx="315" cy="340" r="12" stroke="#0284c7" stroke-width="2" fill="none" />

        <!-- Crumpled Paper & Pencil Jar -->
        <circle cx="410" cy="290" r="14" class="outline" />
        <rect x="230" y="390" width="30" height="30" rx="4" class="outline" />
        <path d="M 235,390 L 235,375 M 245,390 L 245,370 M 255,390 L 255,378" stroke="#000" stroke-width="3" />
      </g>
    `,
    // Page 2: Oversized Friendly ESP32 Microcontroller Character (Goodness)
    2: `
      <g transform="translate(60, 110)">
        <!-- Wall Art & Circuit Traces in Background -->
        <path d="M 20,50 L 120,50 L 120,120 M 360,50 L 460,50 L 460,150" stroke="#0284c7" stroke-width="3" stroke-dasharray="6,4" fill="none" />
        <circle cx="120" cy="120" r="10" stroke="#0284c7" stroke-width="2" fill="none" />

        <!-- Oversized Friendly ESP32 Micro-Brain Character -->
        <g transform="translate(110, 100)">
          <rect x="40" y="40" width="180" height="260" rx="20" class="bold-outline" />
          <text x="75" y="85" font-family="'Outfit', sans-serif" font-weight="800" font-size="18" fill="#1e40af">ESP32 BRAIN</text>
          
          <!-- Friendly Facial Features -->
          <circle cx="90" cy="140" r="16" fill="#000" /> <circle cx="170" cy="140" r="16" fill="#000" />
          <circle cx="94" cy="134" r="5" fill="#fff" /> <circle cx="174" cy="134" r="5" fill="#fff" />
          <path d="M 85,190 Q 130,230 175,190" stroke="#000" stroke-width="5" fill="none" stroke-linecap="round" />

          <!-- Cheerful Metallic Pin Legs -->
          <path d="M 15,70 L 40,70 M 15,110 L 40,110 M 15,150 L 40,150 M 15,190 L 40,190 M 15,230 L 40,230" class="bold-outline" />
          <path d="M 220,70 L 245,70 M 220,110 L 245,110 M 220,150 L 245,150 M 220,190 L 245,190 M 220,230 L 245,230" class="bold-outline" />
        </g>

        <!-- Child Gazing in Awe -->
        <g transform="translate(30, 320)">
          <circle cx="40" cy="40" r="24" class="bold-outline" />
          <circle cx="48" cy="36" r="3" fill="#000" />
          <path d="M 42,52 Q 48,58 54,52" stroke="#000" stroke-width="3" fill="none" />
          <path d="M 40,64 L 40,140 M 40,90 L 80,110" class="bold-outline" />
        </g>

        <!-- Floating Logic Thought Bubbles -->
        <g transform="translate(340, 260)">
          <circle cx="40" cy="40" r="35" fill="#f0f9ff" stroke="#0284c7" stroke-width="2" />
          <text x="18" y="46" font-family="'Outfit', sans-serif" font-weight="800" font-size="14" fill="#0369a1">010101</text>
        </g>
      </g>
    `,
    // Page 3: Child Gently Pressing Sensor into Breadboard (Gentleness)
    3: `
      <g transform="translate(60, 110)">
        <!-- Sunny Window with Foliage & Birds -->
        <rect x="280" y="20" width="160" height="180" rx="8" class="bold-outline" />
        <path d="M 360,20 L 360,200 M 280,110 L 440,110" class="outline" />
        <path d="M 300,50 Q 320,30 340,50 M 380,60 Q 400,40 420,60" stroke="#000" stroke-width="2.5" fill="none" /> <!-- Birds -->

        <!-- Workbench Desk -->
        <rect x="20" y="270" width="440" height="210" rx="8" class="bold-outline" />

        <!-- Breadboard Grid -->
        <rect x="60" y="310" width="340" height="130" rx="10" class="bold-outline" />
        <path d="M 80,340 L 380,340 M 80,370 L 380,370 M 80,400 L 380,400" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="6,6" fill="none" />

        <!-- Blue DHT11 Sensor being gently plugged in -->
        <rect x="190" y="230" width="80" height="80" rx="6" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3" />
        <text x="202" y="275" font-family="'Outfit', sans-serif" font-weight="800" font-size="15" fill="#ffffff">DHT11</text>

        <!-- Child's Gentle Hands Holding Sensor -->
        <path d="M 150,210 C 170,230 185,240 190,260 M 310,210 C 290,230 275,240 270,260" stroke="#000" stroke-width="5" stroke-linecap="round" fill="none" />

        <!-- Flexible Jumper Wires -->
        <path d="M 100,370 C 100,280 150,260 190,300" stroke="#ef4444" stroke-width="4" fill="none" />
        <path d="M 360,370 C 360,280 310,260 270,300" stroke="#10b981" stroke-width="4" fill="none" />
      </g>
    `,
    // Page 4: PAM8403 Amplifier & Speaker with Soundwaves (Joy)
    4: `
      <g transform="translate(60, 110)">
        <!-- Circular Speaker -->
        <g transform="translate(240, 200)">
          <circle cx="0" cy="0" r="90" class="bold-outline" />
          <circle cx="0" cy="0" r="50" class="outline" />
          <circle cx="0" cy="0" r="20" fill="#000" />
        </g>

        <!-- PAM8403 Amplifier Board -->
        <rect x="60" y="320" width="110" height="90" rx="8" class="bold-outline" />
        <text x="72" y="370" font-family="'Outfit', sans-serif" font-weight="800" font-size="14" fill="#1e40af">PAM8403</text>
        <path d="M 170,360 L 210,360 C 220,360 230,300 240,290" stroke="#000" stroke-width="4" fill="none" />

        <!-- Musical Soundwave Bubbles -->
        <path d="M 350,150 C 390,130 410,170 450,150 M 360,210 C 410,190 420,240 460,210 M 350,270 C 390,250 410,290 450,270" stroke="#0d9488" stroke-width="5" stroke-linecap="round" fill="none" />

        <g transform="translate(390, 100)">
          <circle cx="20" cy="20" r="16" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" />
          <text x="14" y="26" font-family="'Outfit', sans-serif" font-weight="800" font-size="16" fill="#16a34a">♪</text>
        </g>
        <g transform="translate(420, 230)">
          <circle cx="20" cy="20" r="22" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" />
          <text x="13" y="28" font-family="'Outfit', sans-serif" font-weight="800" font-size="18" fill="#16a34a">♫</text>
        </g>

        <!-- Child Clapping with Joy -->
        <g transform="translate(60, 140)">
          <circle cx="40" cy="40" r="26" class="bold-outline" />
          <path d="M 32,36 Q 40,46 48,36" stroke="#000" stroke-width="3" fill="none" />
          <path d="M 40,66 L 40,140 M 40,90 L 70,75 M 40,90 L 70,85" class="bold-outline" />
        </g>
      </g>
    `,
    // Page 5: Child & Mentor Soldering Together with Safety Glasses (Love)
    5: `
      <g transform="translate(60, 110)">
        <!-- Soldering Station Desk -->
        <rect x="20" y="270" width="440" height="210" rx="8" class="bold-outline" />

        <!-- Mentor (Left) & Child (Right) -->
        <g transform="translate(60, 120)">
          <circle cx="50" cy="40" r="32" class="bold-outline" /> <!-- Mentor Head -->
          <rect x="35" y="32" width="30" height="14" rx="4" fill="#000" /> <!-- Goggles -->
          <path d="M 50,72 L 50,170 M 50,110 L 140,140" class="bold-outline" fill="none" />
        </g>

        <g transform="translate(290, 140)">
          <circle cx="50" cy="35" r="26" class="bold-outline" /> <!-- Child Head -->
          <rect x="37" y="28" width="26" height="12" rx="4" fill="#000" /> <!-- Goggles -->
          <path d="M 50,61 L 50,150 M 50,95 L -90,120" class="bold-outline" fill="none" />
        </g>

        <!-- Soldering Iron Joining Wires -->
        <g transform="translate(190, 240)">
          <path d="M 10,20 L 50,50" stroke="#000" stroke-width="8" stroke-linecap="round" />
          <path d="M 50,50 L 70,65" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
          <!-- Solder Smoke Wisps -->
          <path d="M 70,65 C 65,40 85,30 75,10 M 80,65 C 75,45 95,35 85,15" stroke="#cbd5e1" stroke-width="3.5" fill="none" stroke-linecap="round" />
        </g>

        <!-- Tool Rack Frame -->
        <path d="M 380,100 L 460,100 M 380,170 L 460,170" stroke="#000" stroke-width="4" />
        <rect x="400" y="110" width="15" height="45" rx="3" class="outline" />
        <rect x="430" y="110" width="15" height="45" rx="3" class="outline" />
      </g>
    `,
    // Page 6: Servo Motor Arm with 0-180 Degree Angle Arch (Self-Control)
    6: `
      <g transform="translate(60, 110)">
        <!-- Main Robot Shoulder Frame -->
        <rect x="40" y="160" width="180" height="240" rx="14" class="bold-outline" />
        <text x="65" y="200" font-family="'Outfit', sans-serif" font-weight="800" font-size="16" fill="#1e40af">ROBOT SHOULDER</text>

        <!-- Servo Motor Module -->
        <rect x="220" y="200" width="150" height="130" rx="10" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3.5" />
        <text x="245" y="270" font-family="'Outfit', sans-serif" font-weight="800" font-size="16" fill="#ffffff">SERVO MOTOR</text>

        <!-- Servo Horn & Arm -->
        <circle cx="295" cy="200" r="25" class="bold-outline" />
        <path d="M 295,175 L 420,100" stroke="#000" stroke-width="9" stroke-linecap="round" />
        <circle cx="420" cy="100" r="12" class="bold-outline" />

        <!-- 0° to 180° Degree Angle Arch -->
        <path d="M 220,100 A 130,130 0 0,1 420,200" stroke="#0d9488" stroke-width="3.5" stroke-dasharray="6,6" fill="none" />
        <text x="210" y="85" font-family="'Outfit', sans-serif" font-weight="800" font-size="14" fill="#0d9488">0°</text>
        <text x="310" y="60" font-family="'Outfit', sans-serif" font-weight="800" font-size="14" fill="#0d9488">90°</text>
        <text x="435" y="210" font-family="'Outfit', sans-serif" font-weight="800" font-size="14" fill="#0d9488">180°</text>

        <!-- Precision Screwdriver in Child's Hand -->
        <path d="M 180,300 L 230,240" stroke="#000" stroke-width="6" stroke-linecap="round" />
      </g>
    `,
    // Page 7: Clean Battery Power Module with Sparkles & Starry Sky (Faithfulness)
    7: `
      <g transform="translate(60, 110)">
        <!-- Starry Night Sky Window View -->
        <rect x="40" y="30" width="160" height="180" rx="8" class="bold-outline" />
        <path d="M 120,30 L 120,210 M 40,120 L 200,120" class="outline" />
        <polygon points="80,60 83,68 91,68 85,73 87,81 80,76 73,81 75,73 69,68 77,68" fill="#f59e0b" />
        <polygon points="160,150 162,156 168,156 163,160 165,166 160,162 155,166 157,160 152,156 158,156" fill="#f59e0b" />

        <!-- Rechargeable Battery Power Cell -->
        <g transform="translate(240, 140)">
          <rect x="0" y="0" width="150" height="260" rx="14" class="bold-outline" />
          <rect x="45" y="-20" width="60" height="20" rx="5" fill="#000" />
          
          <text x="50" y="80" font-family="'Outfit', sans-serif" font-weight="800" font-size="42" fill="#22c55e">+</text>
          <text x="54" y="200" font-family="'Outfit', sans-serif" font-weight="800" font-size="42" fill="#ef4444">-</text>
          
          <rect x="25" y="105" width="100" height="50" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" />
          <text x="40" y="136" font-family="'Outfit', sans-serif" font-weight="800" font-size="16" fill="#16a34a">12V DC</text>
        </g>

        <!-- Insulated Red & Black Cables with Energy Sparkles -->
        <path d="M 285,120 C 230,80 180,260 120,320" stroke="#ef4444" stroke-width="5" fill="none" />
        <path d="M 345,120 C 390,80 440,260 400,340" stroke="#000" stroke-width="5" fill="none" />
        
        <!-- Energy Sparkles -->
        <path d="M 180,180 L 190,170 M 180,170 L 190,180 M 350,260 L 360,250 M 350,250 L 360,260" stroke="#f59e0b" stroke-width="3.5" />
      </g>
    `,
    // Page 8: Child Snapping Block-Code Puzzle Pieces on Screen (Patience)
    8: `
      <g transform="translate(60, 110)">
        <!-- Ergonomic Desk & Laptop Screen -->
        <rect x="60" y="100" width="360" height="250" rx="14" class="bold-outline" /> <!-- Screen -->
        <rect x="20" y="350" width="440" height="25" rx="5" class="bold-outline" /> <!-- Keyboard Base -->

        <!-- Block Code Puzzle Pieces on Screen -->
        <g transform="translate(90, 130)">
          <rect x="0" y="0" width="220" height="45" rx="8" fill="#dbeafe" stroke="#1e40af" stroke-width="2.5" />
          <text x="20" y="28" font-family="'Outfit', sans-serif" font-weight="800" font-size="15" fill="#1e40af">WHEN (START_CLICKED)</text>

          <rect x="25" y="55" width="220" height="45" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2.5" />
          <text x="45" y="83" font-family="'Outfit', sans-serif" font-weight="800" font-size="15" fill="#92400e">IF (DISTANCE &lt; 10cm)</text>

          <rect x="50" y="110" width="220" height="45" rx="8" fill="#ccfbf1" stroke="#0d9488" stroke-width="2.5" />
          <text x="70" y="138" font-family="'Outfit', sans-serif" font-weight="800" font-size="15" fill="#0f766e">SPEAK("Hello Friend!")</text>
        </g>

        <!-- Cute Miniature Helper Bot beside Laptop -->
        <g transform="translate(390, 240)">
          <rect x="0" y="0" width="40" height="35" rx="6" class="outline" />
          <circle cx="12" cy="15" r="3" fill="#000" /> <circle cx="28" cy="15" r="3" fill="#000" />
          <rect x="-5" y="35" width="50" height="40" rx="5" class="outline" />
        </g>
      </g>
    `,
    // Page 9: Peaceful Multimeter Debugging & Loose Wire Inspection (Peace)
    9: `
      <g transform="translate(60, 110)">
        <!-- Workshop Window with Peaceful Soft Clouds -->
        <rect x="40" y="30" width="180" height="160" rx="8" class="bold-outline" />
        <path d="M 130,30 L 130,190 M 40,110 L 220,110" class="outline" />
        <path d="M 60,80 C 80,60 120,60 140,80 C 160,80 180,100 160,120" stroke="#cbd5e1" stroke-width="3" fill="none" />

        <!-- Multimeter & Magnifying Glass -->
        <rect x="260" y="220" width="110" height="180" rx="10" class="bold-outline" />
        <rect x="280" y="245" width="70" height="45" rx="4" fill="#f8fafc" stroke="#000" stroke-width="2" />
        <text x="290" y="275" font-family="'Outfit', sans-serif" font-weight="800" font-size="16" fill="#16a34a">5.00V</text>
        <circle cx="315" cy="330" r="20" class="outline" />

        <!-- Child's Peaceful Hand Holding Magnifying Glass -->
        <g transform="translate(130, 280)">
          <circle cx="50" cy="50" r="45" stroke="#000" stroke-width="5" fill="none" />
          <path d="M 20,80 L -20,120" stroke="#000" stroke-width="9" stroke-linecap="round" />
          <path d="M 35,50 L 65,50" stroke="#ef4444" stroke-width="3" /> <!-- Magnified Wire Pin -->
        </g>

        <!-- Loose Jumper Wire Being Re-inserted -->
        <path d="M 120,400 C 150,380 180,390 220,380" stroke="#3b82f6" stroke-width="4" stroke-dasharray="4,4" fill="none" />
      </g>
    `,
    // Page 10: Helper Bot Delivering Water & Flower to Neighbor (Kindness)
    10: `
      <g transform="translate(60, 100)">
        <!-- Blooming Neighborhood Garden Background -->
        <path d="M 20,220 Q 120,180 240,220 T 460,220" stroke="#16a34a" stroke-width="4" fill="none" />
        <!-- Flowers -->
        <g transform="translate(40, 160)">
          <circle cx="0" cy="0" r="14" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
          <path d="M 0,14 L 0,60" stroke="#16a34a" stroke-width="4" />
        </g>

        <!-- Rolling Helper Bot -->
        <g transform="translate(140, 200)">
          <rect x="40" y="30" width="120" height="110" rx="16" class="bold-outline" />
          <circle cx="70" cy="70" r="10" fill="#000" /> <circle cx="130" cy="70" r="10" fill="#000" />
          <path d="M 75,100 Q 100,120 125,100" stroke="#000" stroke-width="3.5" fill="none" />
          
          <!-- Wheels -->
          <circle cx="60" cy="150" r="20" class="bold-outline" />
          <circle cx="140" cy="150" r="20" class="bold-outline" />

          <!-- Serving Tray holding Water & Flower -->
          <path d="M -10,120 L 210,120 M 0,120 L 0,140 M 200,120 L 200,140" class="bold-outline" />
          
          <!-- Water Glass -->
          <rect x="20" y="80" width="30" height="40" rx="4" class="outline" />
          <path d="M 22,95 L 48,95" stroke="#0284c7" stroke-width="2" />
          
          <!-- Bright Yellow Flower -->
          <circle cx="160" cy="80" r="12" fill="#fde047" stroke="#ca8a04" stroke-width="2" />
        </g>

        <!-- Elderly Neighbor Smiling Warmly -->
        <g transform="translate(340, 180)">
          <circle cx="40" cy="35" r="26" class="bold-outline" />
          <path d="M 32,32 Q 40,42 48,32" stroke="#000" stroke-width="3" fill="none" />
          <path d="M 40,61 L 40,160 M 40,90 L 0,120" class="bold-outline" />
        </g>
      </g>
    `
  };

  return scenes[pageNumber] || scenes[1];
}

function escapeXml(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
