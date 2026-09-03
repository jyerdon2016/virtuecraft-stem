/**
 * Vector Art & Interactive SVG Subagent
 * 
 * Procedurally generates high-contrast binary line-art vector SVGs for any topic,
 * fully instrumented with .colorable-region classes for click-to-color flood fills,
 * single focal point characters, two-layer seek-and-find overlays, mazes, and blueprints.
 */

export class VectorArtAgent {
  constructor() {
    this.agentName = "Vector Art & Line Renderer Subagent";
    this.version = "2.0";
  }

  /**
   * Render an interactive vector SVG coloring page
   */
  renderPageSVG(pageData, bookContext = {}, width = 600, height = 750) {
    const { title, virtue, hiddenShape, hiddenCount = 3, pageNumber, type, skill } = pageData;
    const topic = bookContext.topic || "Adventure";
    const authorOrChild = bookContext.recipientOrAuthor || "Creator";
    const isCommercial = bookContext.purpose === "commercial";

    // 1. Generate Hidden Object Positions
    const hiddenPositions = [];
    const coords = [
      { x: 95, y: 145, scale: 0.85, rot: 12 },
      { x: 495, y: 155, scale: 0.8, rot: -15 },
      { x: 505, y: 560, scale: 0.9, rot: 30 },
      { x: 85, y: 585, scale: 0.8, rot: -10 },
      { x: 290, y: 685, scale: 0.85, rot: 20 }
    ];

    for (let i = 0; i < Math.min(hiddenCount, coords.length); i++) {
      hiddenPositions.push({
        id: `hidden-obj-${pageNumber}-${i}`,
        ...coords[(i + pageNumber) % coords.length],
        type: hiddenShape || "Star of Hope"
      });
    }

    // 2. Determine Subject Rendering Strategy
    let focalArtwork = "";
    if (type === "puzzle" || pageNumber === 11) {
      focalArtwork = this.renderChunkyMaze(pageNumber, topic);
    } else if (type === "stem-project" || pageNumber === 12) {
      focalArtwork = this.renderCraftBlueprint(pageData, topic);
    } else {
      focalArtwork = this.renderDynamicTopicArt(topic, pageNumber, skill);
    }

    // 3. Assemble Complete SVG Structure
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="coloring-page-svg interactive-svg" id="interactive-canvas-page-${pageNumber}">
        <defs>
          <style>
            .colorable-region { cursor: pointer; transition: fill 0.15s ease, stroke 0.15s ease; fill: #ffffff; }
            .colorable-region:hover { stroke: #2563eb !important; stroke-width: 6 !important; }
            .chunky-stroke { stroke: #000000; stroke-width: 5; fill: #ffffff; stroke-linecap: round; stroke-linejoin: round; }
            .bold-outline { stroke: #000000; stroke-width: 7; fill: #ffffff; stroke-linecap: round; stroke-linejoin: round; }
            .maze-wall { stroke: #000000; stroke-width: 8; fill: none; stroke-linecap: round; }
            .fine-detail { stroke: #000000; stroke-width: 3.5; fill: none; stroke-linecap: round; }
            
            .digital-overlay-symbol { stroke: #000000; stroke-width: 3.5; fill: #ffffff; cursor: pointer; transition: all 0.25s ease; }
            .digital-overlay-symbol:hover { stroke: #e11d48; stroke-width: 5; fill: #fff1f2; transform: scale(1.15); }
            .digital-overlay-symbol.found { stroke: #0d9488 !important; stroke-width: 5 !important; fill: #a7f3d0 !important; }
            .page-text { font-family: 'Outfit', 'Inter', -apple-system, sans-serif; fill: #0f172a; pointer-events: none; }
          </style>

          <!-- Hidden Shape Stencil Symbols -->
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

        <!-- Outer Printable Margin & Border (KDP 8.5x11 Clean Line) -->
        <rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="16" class="bold-outline colorable-region" fill="#ffffff" />

        <!-- Header Banner -->
        <rect x="28" y="26" width="${width - 56}" height="68" rx="10" fill="#ffffff" stroke="#000000" stroke-width="3" />
        <text x="44" y="54" class="page-text" font-size="18" font-weight="800" fill="#1e40af">${this.escapeXml(title)}</text>
        <text x="44" y="78" class="page-text" font-size="12" fill="#475569">
          Skill: <tspan font-weight="bold" fill="#0d9488">${this.escapeXml(skill || "Creation")}</tspan> 
          | Virtue: <tspan font-weight="bold" fill="#e11d48">${this.escapeXml(virtue || "Kindness")}</tspan> 
          | ${isCommercial ? "Amazon KDP Ready" : `For: ${this.escapeXml(authorOrChild)}`}
        </text>

        <!-- Layer 1: Clean Line Art Focal Subject -->
        <g id="layer-1-focal-art">
          ${focalArtwork}
        </g>

        <!-- Layer 2: Seek-and-Find Overlay -->
        <g id="layer-2-seek-and-find">
          ${hiddenPositions.map(pos => `
            <g class="digital-overlay-symbol" data-id="${pos.id}" transform="translate(${pos.x}, ${pos.y}) scale(${pos.scale}) rotate(${pos.rot})">
              <use href="#${this.getShapeSvgId(pos.type)}" />
            </g>
          `).join("")}
        </g>

        <!-- Footer Banner & Seek-and-Find Challenge -->
        <rect x="28" y="654" width="${width - 56}" height="66" rx="10" fill="#ffffff" stroke="#000000" stroke-width="3" />
        <text x="44" y="678" class="page-text" font-size="13" font-weight="800" fill="#92400e">🔍 Seek-and-Find Challenge:</text>
        <text x="44" y="702" class="page-text" font-size="12" fill="#1e293b">Spot and click all <tspan font-weight="bold" fill="#e11d48">${hiddenCount} '${hiddenShape || "Star of Hope"}'</tspan> shapes! Click any outline to fill with color.</text>
      </svg>
    `;

    return { svgHtml: svgContent, hiddenPositions };
  }

  getShapeSvgId(shapeName = "") {
    if (shapeName.includes("Star")) return "shape-star";
    if (shapeName.includes("Anchor")) return "shape-anchor";
    if (shapeName.includes("Fish") || shapeName.includes("Ichthys")) return "shape-fish";
    return "shape-cross-heart";
  }

  /**
   * Renders procedural high-quality line-art characters depending on topic keywords
   */
  renderDynamicTopicArt(topic = "", pageNumber = 1, skill = "") {
    const t = topic.toLowerCase();

    // Space & Rocket & Planets
    if (t.includes("space") || t.includes("rocket") || t.includes("mars") || t.includes("planet") || t.includes("astronaut")) {
      return this.renderSpaceArt(pageNumber);
    }
    // Animals & Bunny & Forest
    if (t.includes("bunny") || t.includes("rabbit") || t.includes("animal") || t.includes("fox") || t.includes("cat") || t.includes("dog") || t.includes("squirrel")) {
      return this.renderAnimalArt(pageNumber);
    }
    // Dinosaurs
    if (t.includes("dino") || t.includes("stegosaurus") || t.includes("t-rex") || t.includes("fossil")) {
      return this.renderDinoArt(pageNumber);
    }
    // Ocean & Submarine & Sea
    if (t.includes("ocean") || t.includes("sea") || t.includes("submarine") || t.includes("fish") || t.includes("coral") || t.includes("water")) {
      return this.renderOceanArt(pageNumber);
    }
    // Castle & Knights & Fantasy
    if (t.includes("knight") || t.includes("castle") || t.includes("dragon") || t.includes("magic") || t.includes("armor") || t.includes("royal")) {
      return this.renderCastleArt(pageNumber);
    }
    // Nature, Greenhouse, Gardens
    if (t.includes("garden") || t.includes("greenhouse") || t.includes("plant") || t.includes("treehouse") || t.includes("flower")) {
      return this.renderGardenArt(pageNumber);
    }
    // Vehicles, Racecars, Flight
    if (t.includes("car") || t.includes("race") || t.includes("speed") || t.includes("plane") || t.includes("airship")) {
      return this.renderVehicleArt(pageNumber);
    }

    // Default: Robots & Tech Inventions
    return this.renderRoboticsArt(pageNumber);
  }

  renderRoboticsArt(step) {
    const variants = {
      1: `
        <g transform="translate(130, 130)">
          <!-- Workbench with Blueprint -->
          <rect x="0" y="270" width="340" height="110" rx="12" class="bold-outline colorable-region" />
          <!-- Robot Blueprint Character -->
          <circle cx="170" cy="110" r="75" class="bold-outline colorable-region" />
          <circle cx="145" cy="105" r="9" fill="#000" /> <circle cx="195" cy="105" r="9" fill="#000" />
          <path d="M 140,135 Q 170,165 200,135" stroke="#000" stroke-width="5" fill="none" stroke-linecap="round" />
          <path d="M 170,185 L 170,270" class="bold-outline" />
          <!-- Blueprint Scroll -->
          <g transform="translate(70, 200)">
            <rect x="0" y="0" width="200" height="90" rx="8" class="chunky-stroke colorable-region" />
            <path d="M 20,25 L 180,25 M 20,45 L 180,45 M 20,65 L 120,65" stroke="#000" stroke-width="3" stroke-linecap="round" />
            <text x="135" y="70" class="page-text" font-weight="800" font-size="14">IDEA</text>
          </g>
        </g>
      `,
      2: `
        <g transform="translate(130, 120)">
          <!-- Friendly Micro-Brain ESP32 -->
          <rect x="40" y="40" width="260" height="320" rx="28" class="bold-outline colorable-region" />
          <text x="80" y="95" class="page-text" font-weight="800" font-size="20">AI CONTROLLER</text>
          <circle cx="120" cy="170" r="20" fill="#000" /> <circle cx="220" cy="170" r="20" fill="#000" />
          <path d="M 115,225 Q 170,275 225,225" stroke="#000" stroke-width="7" fill="none" stroke-linecap="round" />
          <!-- Pins -->
          <path d="M 0,90 L 40,90 M 0,160 L 40,160 M 0,230 L 40,230 M 0,300 L 40,300" class="bold-outline" />
          <path d="M 300,90 L 340,90 M 300,160 L 340,160 M 300,230 L 340,230 M 300,300 L 340,300" class="bold-outline" />
        </g>
      `,
      3: `
        <g transform="translate(140, 130)">
          <!-- Sensor & Breadboard -->
          <rect x="20" y="40" width="280" height="260" rx="24" class="bold-outline colorable-region" />
          <text x="95" y="95" class="page-text" font-weight="800" font-size="22">SENSOR HUB</text>
          <circle cx="100" cy="160" r="18" fill="#000" /> <circle cx="220" cy="160" r="18" fill="#000" />
          <path d="M 110,210 Q 160,245 210,210" stroke="#000" stroke-width="6" fill="none" stroke-linecap="round" />
          <path d="M 160,300 C 160,380 260,400 260,460" class="colorable-region" stroke="#000" stroke-width="12" stroke-linecap="round" fill="none" />
        </g>
      `
    };
    return variants[step] || variants[1];
  }

  renderSpaceArt(step) {
    return `
      <g transform="translate(120, 120)">
        <!-- Rocket Ship Body -->
        <path d="M 180,20 C 120,80 100,220 100,340 L 260,340 C 260,220 240,80 180,20 Z" class="bold-outline colorable-region" />
        <!-- Rocket Fin Left & Right -->
        <path d="M 100,260 L 30,360 L 100,340 Z" class="bold-outline colorable-region" />
        <path d="M 260,260 L 330,360 L 260,340 Z" class="bold-outline colorable-region" />
        <!-- Porthole Window with Smiling Character -->
        <circle cx="180" cy="160" r="50" class="bold-outline colorable-region" />
        <circle cx="180" cy="160" r="38" class="chunky-stroke colorable-region" />
        <circle cx="168" cy="155" r="6" fill="#000" /> <circle cx="192" cy="155" r="6" fill="#000" />
        <path d="M 170,172 Q 180,185 190,172" stroke="#000" stroke-width="4" fill="none" />
        <!-- Thruster Blast Plume -->
        <path d="M 120,340 L 180,450 L 240,340 Z" class="bold-outline colorable-region" />
        <!-- Stars & Planet in Background -->
        <circle cx="45" cy="50" r="25" class="chunky-stroke colorable-region" />
        <path d="M 15,50 Q 45,35 75,50" class="fine-detail" />
        <polygon points="320,50 326,62 340,64 330,74 332,88 320,80 308,88 310,74 300,64 314,62" class="chunky-stroke colorable-region" />
      </g>
    `;
  }

  renderAnimalArt(step) {
    return `
      <g transform="translate(140, 130)">
        <!-- Head & Cute Cheeks -->
        <circle cx="160" cy="170" r="85" class="bold-outline colorable-region" />
        <!-- Bunny / Fox Long Ears -->
        <path d="M 115,105 C 100,10 135,-20 145,100 Z" class="bold-outline colorable-region" />
        <path d="M 122,95 C 110,25 130,0 138,90 Z" class="chunky-stroke colorable-region" />
        <path d="M 205,105 C 220,10 185,-20 175,100 Z" class="bold-outline colorable-region" />
        <path d="M 198,95 C 210,25 190,0 182,90 Z" class="chunky-stroke colorable-region" />
        <!-- Big Sparkle Eyes -->
        <circle cx="125" cy="165" r="16" fill="#000" />
        <circle cx="120" cy="160" r="5" fill="#fff" />
        <circle cx="195" cy="165" r="16" fill="#000" />
        <circle cx="190" cy="160" r="5" fill="#fff" />
        <!-- Button Nose & Smile -->
        <polygon points="160,185 152,175 168,175" fill="#000" />
        <path d="M 160,185 L 160,195 M 150,198 Q 160,208 170,198" stroke="#000" stroke-width="4.5" fill="none" stroke-linecap="round" />
        <!-- Cozy Scarf / Tool Collar -->
        <rect x="95" y="240" width="130" height="40" rx="14" class="bold-outline colorable-region" />
        <!-- Little Paws Holding Acorn / Gadget -->
        <circle cx="160" cy="330" r="45" class="bold-outline colorable-region" />
        <circle cx="110" cy="300" r="22" class="chunky-stroke colorable-region" />
        <circle cx="210" cy="300" r="22" class="chunky-stroke colorable-region" />
      </g>
    `;
  }

  renderDinoArt(step) {
    return `
      <g transform="translate(110, 140)">
        <!-- Friendly Dino Body -->
        <path d="M 100,280 C 80,180 180,120 280,180 C 350,220 370,320 290,360 L 120,360 Z" class="bold-outline colorable-region" />
        <!-- Head & Big Friendly Snout -->
        <circle cx="100" cy="180" r="55" class="bold-outline colorable-region" />
        <circle cx="85" cy="165" r="10" fill="#000" />
        <circle cx="82" cy="162" r="3" fill="#fff" />
        <path d="M 65,195 Q 90,215 115,195" stroke="#000" stroke-width="4.5" fill="none" stroke-linecap="round" />
        <!-- Stego Back Plates -->
        <polygon points="150,130 170,80 190,130" class="bold-outline colorable-region" />
        <polygon points="210,135 235,75 260,135" class="bold-outline colorable-region" />
        <polygon points="275,155 300,95 320,165" class="bold-outline colorable-region" />
        <!-- Chunky Legs -->
        <rect x="130" y="340" width="45" height="70" rx="14" class="bold-outline colorable-region" />
        <rect x="230" y="340" width="45" height="70" rx="14" class="bold-outline colorable-region" />
        <!-- Little Prehistoric Flower -->
        <g transform="translate(310, 340)">
          <circle cx="20" cy="20" r="16" class="chunky-stroke colorable-region" />
          <circle cx="20" cy="20" r="8" fill="#000" />
          <path d="M 20,36 L 20,70" stroke="#000" stroke-width="6" />
        </g>
      </g>
    `;
  }

  renderOceanArt(step) {
    return `
      <g transform="translate(120, 130)">
        <!-- Yellow Research Submarine Body -->
        <ellipse cx="180" cy="220" rx="150" ry="90" class="bold-outline colorable-region" />
        <!-- Conning Tower / Cockpit -->
        <rect x="140" y="90" width="80" height="50" rx="12" class="bold-outline colorable-region" />
        <path d="M 180,90 L 180,45 L 210,45" stroke="#000" stroke-width="8" stroke-linecap="round" fill="none" />
        <!-- Big Round Porthole with Friendly Face -->
        <circle cx="150" cy="220" r="45" class="bold-outline colorable-region" />
        <circle cx="150" cy="220" r="32" class="chunky-stroke colorable-region" />
        <circle cx="140" cy="215" r="6" fill="#000" /> <circle cx="160" cy="215" r="6" fill="#000" />
        <path d="M 142,230 Q 150,240 158,230" stroke="#000" stroke-width="3.5" fill="none" />
        <!-- Rear Propeller -->
        <polygon points="325,185 365,160 355,220" class="bold-outline colorable-region" />
        <polygon points="325,255 365,280 355,220" class="bold-outline colorable-region" />
        <!-- Water Bubbles -->
        <circle cx="60" cy="140" r="18" class="chunky-stroke colorable-region" />
        <circle cx="90" cy="90" r="12" class="chunky-stroke colorable-region" />
        <!-- Sea Floor Coral & Seaweed -->
        <path d="M 40,420 Q 70,350 40,280" stroke="#000" stroke-width="8" stroke-linecap="round" fill="none" />
        <path d="M 65,420 Q 95,360 70,300" stroke="#000" stroke-width="7" stroke-linecap="round" fill="none" />
      </g>
    `;
  }

  renderCastleArt(step) {
    return `
      <g transform="translate(130, 130)">
        <!-- Castle Center Keep -->
        <rect x="70" y="140" width="180" height="240" rx="8" class="bold-outline colorable-region" />
        <!-- Turrets Left & Right -->
        <rect x="20" y="80" width="60" height="300" rx="8" class="bold-outline colorable-region" />
        <polygon points="10,80 50,15 90,80" class="bold-outline colorable-region" />
        <rect x="240" y="80" width="60" height="300" rx="8" class="bold-outline colorable-region" />
        <polygon points="230,80 270,15 310,80" class="bold-outline colorable-region" />
        <!-- Friendly Castle Gate Arch -->
        <path d="M 120,380 L 120,280 Q 160,230 200,280 L 200,380 Z" class="bold-outline colorable-region" />
        <!-- Royal Banner Flag -->
        <path d="M 50,15 L 50,-15 L 10,-5 Z" class="chunky-stroke colorable-region" />
      </g>
    `;
  }

  renderGardenArt(step) {
    return `
      <g transform="translate(130, 130)">
        <!-- Greenhouse Glass Frame -->
        <path d="M 40,160 L 160,40 L 280,160 L 280,380 L 40,380 Z" class="bold-outline colorable-region" />
        <path d="M 160,40 L 160,380 M 40,260 L 280,260 M 40,160 L 280,160" class="chunky-stroke" />
        <!-- Cute Watering Can -->
        <g transform="translate(80, 240)">
          <rect x="30" y="40" width="100" height="70" rx="16" class="bold-outline colorable-region" />
          <path d="M 130,55 L 170,25" stroke="#000" stroke-width="12" stroke-linecap="round" />
          <path d="M 30,50 C 0,50 0,100 30,100" stroke="#000" stroke-width="9" fill="none" />
        </g>
      </g>
    `;
  }

  renderVehicleArt(step) {
    return `
      <g transform="translate(120, 140)">
        <!-- Race Car Sleek Body -->
        <path d="M 40,260 C 90,260 140,180 240,180 L 280,220 L 330,260 L 330,300 L 40,300 Z" class="bold-outline colorable-region" />
        <!-- Cockpit & Driver Helmet -->
        <circle cx="180" cy="160" r="25" class="bold-outline colorable-region" />
        <rect x="175" y="152" width="22" height="12" rx="4" fill="#000" />
        <!-- Front & Rear Giant Wheels -->
        <circle cx="100" cy="300" r="42" class="bold-outline colorable-region" />
        <circle cx="100" cy="300" r="22" class="chunky-stroke colorable-region" />
        <circle cx="270" cy="300" r="42" class="bold-outline colorable-region" />
        <circle cx="270" cy="300" r="22" class="chunky-stroke colorable-region" />
        <!-- Racing Number 7 -->
        <text x="185" y="260" class="page-text" font-weight="900" font-size="34">#7</text>
      </g>
    `;
  }

  renderChunkyMaze(pageNumber, topic) {
    return `
      <g id="maze-container" transform="translate(50, 115)">
        <rect x="0" y="0" width="500" height="520" rx="16" class="bold-outline colorable-region" fill="#ffffff" />

        <!-- START Badge -->
        <g transform="translate(25, 20)">
          <rect x="0" y="0" width="100" height="46" rx="8" fill="#000000" />
          <text x="18" y="31" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="18">START</text>
        </g>

        <!-- FINISH Badge -->
        <g transform="translate(375, 455)">
          <rect x="0" y="0" width="100" height="46" rx="8" fill="#000000" />
          <text x="16" y="31" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="800" font-size="18">FINISH</text>
        </g>

        <!-- Maze Corridor Walls -->
        <path d="M 135,0 L 135,150 M 240,75 L 380,75 M 380,0 L 380,150" class="maze-wall" />
        <path d="M 0,150 L 240,150 M 310,150 L 500,150" class="maze-wall" />
        <path d="M 90,225 L 90,360 M 170,300 L 340,300 M 420,225 L 420,360" class="maze-wall" />
        <path d="M 0,360 L 170,360 M 255,360 L 500,360" class="maze-wall" />
        <path d="M 130,435 L 255,435 M 340,435 L 500,435" class="maze-wall" />
      </g>
    `;
  }

  renderCraftBlueprint(pageData, topic) {
    return `
      <g id="craft-blueprint-container" transform="translate(40, 115)">
        <rect x="0" y="0" width="520" height="520" rx="16" fill="#ffffff" stroke="#000000" stroke-width="4" />
        
        <rect x="30" y="25" width="460" height="85" rx="10" fill="#ffffff" stroke="#000000" stroke-width="3" />
        <text x="50" y="60" fill="#000000" font-family="'Outfit', sans-serif" font-weight="800" font-size="18">🔨 HANDS-ON KEEPSAKE BLUEPRINT</text>
        <text x="50" y="90" fill="#0f172a" font-family="'Inter', sans-serif" font-size="13">Materials: Paper, safe glue/tape, craft sticks, coloring markers</text>

        <g transform="translate(110, 130)">
          <!-- Craft Assembly Diagram -->
          <rect x="0" y="0" width="300" height="170" rx="14" class="bold-outline colorable-region" fill="#ffffff" />
          <circle cx="150" cy="85" r="45" class="chunky-stroke colorable-region" fill="#ffffff" />
          <text x="110" y="94" class="page-text" font-weight="800" font-size="20">KEEPSAKE</text>
        </g>

        <rect x="30" y="325" width="460" height="165" rx="10" fill="#ffffff" stroke="#000000" stroke-width="3" />
        <text x="50" y="360" fill="#000000" font-family="'Outfit', sans-serif" font-weight="800" font-size="17">🏆 COLLECTOR'S CERTIFICATE OF COMPLETION</text>
        <text x="50" y="395" fill="#000000" font-family="'Outfit', sans-serif" font-weight="800" font-size="14">Master Build Module for: ${this.escapeXml(topic)}</text>
        <text x="50" y="430" fill="#475569" font-family="'Inter', sans-serif" font-style="italic" font-size="13">"Assemble your module, stamp your secret shape, and sign your name below!"</text>
        <line x1="50" y1="465" x2="300" y2="465" stroke="#000000" stroke-width="2" stroke-dasharray="4,4" />
        <text x="50" y="480" font-family="'Inter', sans-serif" font-size="11" fill="#64748b">Builder's Signature & Date</text>
      </g>
    `;
  }

  escapeXml(str = "") {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
}
