/**
 * VirtueCraft STEM - System Prompt Layer & Rule Definitions
 * 
 * Provides system instructions, copyright sanitization mappings,
 * Christian virtue integration taxonomy, seek-and-find directives,
 * locked diffusion prompt formulas, and two-layer overlay specifications.
 */

// 1. Core System Prompt Instructions for Backend LLM & Diffusion Models
export const SYSTEM_PROMPT_LAYER = `
You are VirtueCraft STEM AI, an expert children's educational content creator and line-art prompt engineer.
Your mission is to generate 12-page sequential coloring books for ages 4-9 that teach real technical skills (STEM, mechanics, electronics, software, craft), instill core Christian virtues, enforce strict copyright protection through archetype translation, embed seek-and-find directives, include interactive line-art puzzles/mazes, and feature a hands-on household STEM project.

### LOCKED DIFFUSION PROMPT FORMULA (SDXL / FLUX / MIDJOURNEY v6)

Positive Prompt Template:
"Clean children's coloring book page of [Subject doing Action], bold thick black outlines, simple vector line art, pure white background, kid-friendly cartoon illustration, low detail, closed contours, wide open coloring areas, no shading, no color, no gradients, high contrast --ar 8.5:11"

Negative Prompt:
"shading, grayscale, gradients, photorealistic, cross-hatching, sketchy lines, thin lines, messy background, text, watermarks, clutter, complex background"

### SINGLE FOCAL POINT & CHUNKY GEOMETRY (AGES 4-9)
1. Single Main Subject: Keep ONE central oversized, smiling character per page (e.g., an oversized smiling ESP32 chip character holding one large jumper wire) rather than a dense, cluttered workbench.
2. Chunky Contours: Use wide, rounded geometry with closed contours so small hands can easily color within the lines.
3. Two-Layer Seek-and-Find: Generate the clean coloring page first, then digitally stamp the vector seek-and-find symbols into open background spaces via SVG overlay layer.
`;

export const LOCKED_PROMPT_TEMPLATE = "Clean children's coloring book page of {SUBJECT}, bold thick black outlines, simple vector line art, pure white background, kid-friendly cartoon illustration, low detail, closed contours, wide open coloring areas, no shading, no color, no gradients, high contrast --ar 8.5:11";
export const LOCKED_NEGATIVE_PROMPT = "shading, grayscale, gradients, photorealistic, cross-hatching, sketchy lines, thin lines, messy background, text, watermarks, clutter, complex background";

// 2. Copyright Sanitizer Dictionary & Converter
export const COPYRIGHT_DICTIONARY = [
  { original: "Paw Patrol", generic: "Mighty Rescue Pigs", category: "Animation" },
  { original: "My Little Pony", generic: "Magical Forest Elves", category: "Animation" },
  { original: "Transformers", generic: "Shape-Shifting Helper Bots", category: "Toys" },
  { original: "Iron Man", generic: "Armored Tech Knight", category: "Comics" },
  { original: "Batman", generic: "Shadow Guardian", category: "Comics" },
  { original: "Spider-Man", generic: "Web-Weaving Hero", category: "Comics" },
  { original: "Pokemon", generic: "Pocket Elemental Companions", category: "Games" },
  { original: "Minecraft", generic: "Voxel Block Builder World", category: "Games" },
  { original: "Lego", generic: "Interlocking Toy Bricks", category: "Toys" },
  { original: "Disney Princess", generic: "Fairytale Kingdom Heroine", category: "Animation" },
  { original: "Squirrel Girl", generic: "Super Squirrel: Forest Guardian", category: "Comics" },
  { original: "Star Wars", generic: "Galactic Starlight Knights", category: "Sci-Fi" }
];

export function sanitizeCopyrightText(input) {
  let sanitized = input;
  let matches = [];

  COPYRIGHT_DICTIONARY.forEach(({ original, generic }) => {
    const regex = new RegExp(`\\b${original}\\b`, "gi");
    if (regex.test(sanitized)) {
      matches.push({ from: original, to: generic });
      sanitized = sanitized.replace(regex, generic);
    }
  });

  return { sanitizedText: sanitized, replacedIPs: matches };
}

// 3. Christian Virtues Matrix
export const VIRTUES_MATRIX = [
  { name: "Love", verse: "1 Corinthians 13:4-7", description: "Caring deeply for others, sharing knowledge, and helping friends." },
  { name: "Joy", verse: "Nehemiah 8:10", description: "Delighting in learning, celebrating small breakthroughs, and smiling." },
  { name: "Peace", verse: "Philippians 4:7", description: "Staying calm during difficult troubleshooting or confusing code." },
  { name: "Patience", verse: "Galatians 5:22", description: "Taking time to sketch blueprints, carefully strip wires, and measure twice." },
  { name: "Kindness", verse: "Ephesians 4:32", description: "Speaking encouraging words, offering help, and putting others first." },
  { name: "Goodness", verse: "Psalm 23:6", description: "Choosing to build tools that help people, clean nature, or solve real problems." },
  { name: "Faithfulness", verse: "Proverbs 3:3", description: "Persisting through challenges and keeping promises to finish a build." },
  { name: "Gentleness", verse: "Colossians 3:12", description: "Handling delicate microchips, glass sensors, and fragile wires with care." },
  { name: "Self-Control", verse: "2 Timothy 1:7", description: "Following safety instructions, wearing gloves/goggles, and avoiding rush." },
  { name: "Forgiveness", verse: "Colossians 3:13", description: "Rebuilding together without anger when a mistake or drop happens." }
];

// 4. Cumulative 12-Issue Master Arc Taxonomy (Grand Project: The Solar Smart Eco-Citadel)
export const ANNUAL_MASTER_PROJECT = {
  title: "The Solar Smart Eco-Citadel",
  description: "A futuristic, clean-energy community center featuring solar power, hydroponic gardens, automated rescue bots, clean water towers, and wind power.",
  issues: [
    { issue: 1, componentName: "Base Foundation & Power Grid Traces", stemProject: "Cardboard Baseplate & Foil Circuit Traces", hint: "Laying a strong, stable foundation built on truth and teamwork." },
    { issue: 2, componentName: "Solar Canopy Array", stemProject: "Papercraft Solar Panel & Light Reflector", hint: "Catching rays of sun energy to power the citadel's lights." },
    { issue: 3, componentName: "Rainwater Harvest & Filtration Tower", stemProject: "Sand & Charcoal Plastic Bottle Filter", hint: "Purifying water to refresh plants and neighbors." },
    { issue: 4, componentName: "Micro-Brain Command Center", stemProject: "Cardboard Console with LED Switch", hint: "Setting up the central control computer to process inputs." },
    { issue: 5, componentName: "Wind Turbine Energy Mast", stemProject: "Pinwheel Paper Turbine & Motor Mount", hint: "Harnessing gentle breezes for extra evening power." },
    { issue: 6, componentName: "Robotic Helper Docking Bay", stemProject: "Craft Stick Elevator & Ramp", hint: "Creating a safe home base for helper bots to charge." },
    { issue: 7, componentName: "Hydroponic Greenhouse Roof", stemProject: "Sprout Tray & Foil Greenhouse Cover", hint: "Growing fresh food in clean water with kindness." },
    { issue: 8, componentName: "Audio Broadcast Beacon", stemProject: "Cup & String Sound Amplifier", hint: "Sharing messages of joy and encouragement across the city." },
    { issue: 9, componentName: "Safety Barrier & Emergency Gate", stemProject: "Popsicle Stick Hydraulic Gate", hint: "Protecting the community with self-control and safety." },
    { issue: 10, componentName: "Automated Waste Sorting Chute", stemProject: "Gravity Marble & Magnet Sorter", hint: "Keeping God's creation clean and recycling resources." },
    { issue: 11, componentName: "Communication Satellite Dish", stemProject: "Foil Parabolic Sound Dish", hint: "Reaching out to far-away friends with good news." },
    { issue: 12, componentName: "Grand Assembly & Power-On", stemProject: "Connecting All 11 Modules into The Master Citadel", hint: "Connecting every module together into one magnificent working citadel!" }
  ]
};

// 5. Seek-and-Find Directive Generator (Digital Overlay)
export const SEEK_AND_FIND_OBJECTS = [
  { name: "Cross-my-heart", description: "Cross within a heart shape", defaultCount: 3 },
  { name: "Star of Hope", description: "Bright 5-pointed star", defaultCount: 4 },
  { name: "Anchor of Peace", description: "Nautical anchor motif", defaultCount: 3 },
  { name: "Ichthys Fish", description: "Simple outline fish symbol", defaultCount: 5 }
];

export function buildSeekAndFindDirective(shapeName = "Cross-my-heart", count = 3) {
  return `Digital Overlay Layer: Stamp ${count} distinct '${shapeName}' vector symbols into open background canvas areas.`;
}

// 6. Locked Image Prompt Builder Matrix Generator
export function buildImageGenerationPrompt({
  sceneSubjectAction,
  virtueName = "Patience",
  hiddenShape = "Cross-my-heart",
  hiddenCount = 3,
  isMaze = false
}) {
  const seekDirective = buildSeekAndFindDirective(hiddenShape, hiddenCount);
  
  if (isMaze) {
    return {
      positivePrompt: `Clean children's coloring book page of an interactive vector circuit maze puzzle, bold thick black outlines, simple pathfinder, start and finish icons, pure white background, low detail, no shading, no color, no gradients, high contrast --ar 8.5:11`,
      negativePrompt: LOCKED_NEGATIVE_PROMPT,
      overlayDirective: seekDirective
    };
  }

  const positivePrompt = LOCKED_PROMPT_TEMPLATE.replace(
    "{SUBJECT}",
    `${sceneSubjectAction}, demonstrating the Christian virtue of ${virtueName}`
  );

  return {
    positivePrompt,
    negativePrompt: LOCKED_NEGATIVE_PROMPT,
    overlayDirective: seekDirective
  };
}
