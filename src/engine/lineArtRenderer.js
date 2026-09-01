/**
 * VirtueTech AI - Dynamic Vector Line-Art Renderer & Interactive Seek-and-Find Engine
 * 
 * Generates crisp black & white SVG line art illustrations with embedded clickable
 * seek-and-find shapes for interactive coloring and hidden-object gameplay.
 */

export function renderPageSVG(pageData, width = 600, height = 750) {
  const { title, virtue, hiddenShape, hiddenCount = 3, pageNumber } = pageData;

  // Generate deterministic hidden shape positions based on page number
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

  // Draw background elements (clouds, gears, circuit traces, plants)
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="coloring-page-svg">
      <defs>
        <style>
          .outline { stroke: #1a1a1a; stroke-width: 3.5; fill: #ffffff; stroke-linecap: round; stroke-linejoin: round; }
          .bold-outline { stroke: #000000; stroke-width: 5; fill: #ffffff; stroke-linecap: round; stroke-linejoin: round; }
          .detail-line { stroke: #2c3e50; stroke-width: 2; fill: none; stroke-dasharray: none; }
          .hidden-shape { stroke: #1a1a1a; stroke-width: 2.5; fill: #ffffff; cursor: pointer; transition: all 0.3s ease; }
          .hidden-shape:hover { stroke: #e74c3c; stroke-width: 4; fill: #fff5f5; }
          .hidden-shape.found { stroke: #27ae60; stroke-width: 4; fill: #e8f8f5; }
          .page-text { font-family: 'Outfit', 'Inter', sans-serif; fill: #2c3e50; }
        </style>

        <!-- Hidden Shape Definitions -->
        <g id="shape-cross-heart">
          <path d="M 0,-12 C -8,-22 -20,-12 -20,0 C -20,12 0,22 0,22 C 0,22 20,12 20,0 C 20,-12 8,-22 0,-12 Z" class="hidden-shape-path" />
          <path d="M 0,-8 L 0,10 M -6,-2 L 6,-2" stroke="#1a1a1a" stroke-width="2" />
        </g>
        
        <g id="shape-star">
          <polygon points="0,-18 5,-5 18,-4 8,5 11,18 0,10 -11,18 -8,5 -18,-4 -5,-5" class="hidden-shape-path" />
        </g>

        <g id="shape-anchor">
          <circle cx="0" cy="-12" r="4" stroke="#1a1a1a" stroke-width="2" fill="none" />
          <path d="M 0,-8 L 0,12 M -12,4 C -12,16 12,16 12,4" stroke="#1a1a1a" stroke-width="3" fill="none" />
        </g>

        <g id="shape-fish">
          <path d="M -15,0 C -5,-12 12,0 15,0 C 12,0 -5,12 -15,0 Z M 12,0 L 20,-8 L 20,8 Z" class="hidden-shape-path" />
          <circle cx="-5" cy="-2" r="1.5" fill="#1a1a1a" />
        </g>
      </defs>

      <!-- Page Canvas Border -->
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="16" class="bold-outline" />

      <!-- Header Section -->
      <rect x="30" y="30" width="${width - 60}" height="70" rx="10" fill="#f8f9fa" stroke="#dcdfe6" stroke-width="2" />
      <text x="50" y="60" class="page-text" font-size="20" font-weight="700">${escapeXml(title)}</text>
      <text x="50" y="85" class="page-text" font-size="14" fill="#666">Virtue Focus: <tspan font-weight="bold" fill="#2b6cb0">${escapeXml(virtue)}</tspan> | Technical Skill: <tspan font-weight="bold">${escapeXml(pageData.technicalSkill || "Engineering")}</tspan></text>

      <!-- Background Line Art Elements -->
      <g id="background-decorations">
        <!-- Cloud 1 -->
        <path d="M 50,160 C 50,140 80,130 100,140 C 110,120 140,120 150,140 C 170,130 190,150 180,170 C 190,190 170,200 150,190 C 130,200 100,200 90,180 C 70,190 50,180 50,160 Z" class="outline" />
        <!-- Cloud 2 -->
        <path d="M 400,160 C 400,145 425,135 440,145 C 450,130 475,130 485,145 C 500,135 520,150 510,165 C 520,180 505,195 485,185 C 470,195 445,195 435,180 C 415,185 400,175 400,160 Z" class="outline" />

        <!-- Gears in background -->
        <g transform="translate(510, 300)">
          <circle cx="0" cy="0" r="35" class="outline" />
          <circle cx="0" cy="0" r="12" class="outline" />
          <path d="M 0,-40 L 0,-30 M 0,30 L 0,40 M -40,0 L -30,0 M 30,0 L 40,0 M -28,-28 L -20,-20 M 20,20 L 28,28 M -28,28 L -20,20 M 20,-20 L 28,-28" class="outline" />
        </g>
        
        <g transform="translate(80, 320)">
          <circle cx="0" cy="0" r="25" class="outline" />
          <circle cx="0" cy="0" r="8" class="outline" />
        </g>

        <!-- Workbench Table -->
        <path d="M 40,520 L 560,520 L 560,545 L 40,545 Z" class="bold-outline" />
        <path d="M 60,545 L 60,690 M 100,545 L 100,690 M 500,545 L 500,690 M 540,545 L 540,690" class="outline" />

        <!-- Central Character / Equipment Frame -->
        ${renderSceneIllustration(pageNumber)}
      </g>

      <!-- Embedded Seek-and-Find Hidden Shapes -->
      <g id="seek-and-find-layer">
        ${hiddenPositions.map(pos => `
          <g class="hidden-shape" data-id="${pos.id}" transform="translate(${pos.x}, ${pos.y}) scale(${pos.scale}) rotate(${pos.rot})">
            <use href="#${getShapeSvgId(pos.type)}" />
          </g>
        `).join("")}
      </g>

      <!-- Bottom Banner & Seek-and-Find Instructions -->
      <rect x="30" y="650" width="${width - 60}" height="70" rx="10" fill="#fffaf0" stroke="#ecc94b" stroke-width="2" />
      <text x="50" y="678" class="page-text" font-size="15" font-weight="700" fill="#742a2a">🔍 Seek-and-Find Challenge:</text>
      <text x="50" y="702" class="page-text" font-size="13" fill="#4a5568">Can you spot ${hiddenCount} hidden <tspan font-weight="bold" fill="#c53030">'${hiddenShape}'</tspan> shapes in the line art? Click them when you find them!</text>
    </svg>
  `;

  return { svgHtml: svgContent, hiddenPositions };
}

function getShapeSvgId(shapeName) {
  if (shapeName.includes("Star")) return "shape-star";
  if (shapeName.includes("Anchor")) return "shape-anchor";
  if (shapeName.includes("Fish") || shapeName.includes("Ichthys")) return "shape-fish";
  return "shape-cross-heart";
}

function renderSceneIllustration(pageNumber) {
  // Generates unique line art drawings depending on page theme step
  const scenes = [
    // Scene 1: Child drawing at workbench
    `
      <g transform="translate(180, 330)">
        <!-- Child figure line art -->
        <circle cx="60" cy="40" r="30" class="bold-outline" /> <!-- Head -->
        <path d="M 60,70 L 60,150 M 60,100 L 10,140 M 60,100 L 110,140" class="bold-outline" /> <!-- Body & Arms -->
        <path d="M 60,150 L 30,190 M 60,150 L 90,190" class="bold-outline" /> <!-- Legs -->
        <circle cx="50" cy="35" r="4" fill="#000" /> <circle cx="70" cy="35" r="4" fill="#000" /> <!-- Eyes -->
        <path d="M 48,50 Q 60,60 72,50" stroke="#000" stroke-width="3" fill="none" /> <!-- Smile -->

        <!-- Blueprint on desk -->
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
        <text x="70" y="80" class="page-text" font-size="16" font-weight="700">ESP32 BRAIN</text>
        
        <!-- Pins -->
        <path d="M 20,60 L 40,60 M 20,90 L 40,90 M 20,120 L 40,120 M 20,150 L 40,150 M 20,180 L 40,180" class="bold-outline" />
        <path d="M 200,60 L 220,60 M 200,90 L 220,90 M 200,120 L 220,120 M 200,150 L 220,150 M 200,180 L 220,180" class="bold-outline" />
      </g>
    `,
    // Scene 3: Sensor & Breadboard Wiring
    `
      <g transform="translate(150, 310)">
        <!-- Breadboard -->
        <rect x="20" y="80" width="260" height="110" rx="8" class="bold-outline" />
        <path d="M 40,100 L 260,100 M 40,120 L 260,120 M 40,140 L 260,140 M 40,160 L 260,160" class="detail-line" stroke-dasharray="4,4" />
        
        <!-- Sensor Module -->
        <rect x="110" y="30" width="70" height="60" rx="4" class="outline" />
        <text x="120" y="65" class="page-text" font-size="12" font-weight="700">DHT11</text>
        <!-- Wires -->
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
