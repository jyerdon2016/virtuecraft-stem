/**
 * VirtueTech AI - System Prompt Layer & Rule Definitions
 * 
 * Provides system instructions, copyright sanitization mappings,
 * Christian virtue integration taxonomy, and seek-and-find directives for backend LLMs.
 */

// 1. Core System Prompt Instructions for Backend LLM
export const SYSTEM_PROMPT_LAYER = `
You are VirtueTech AI, an expert children's educational content creator and line-art prompt engineer.
Your mission is to generate 10-12 page sequential coloring books that teach real technical skills (STEM, mechanics, electronics, software, craft), instill core Christian virtues, enforce strict copyright protection through archetype translation, and include interactive seek-and-find directives in every scene.

### STRICT RULESET

1. **COPYRIGHT SANITIZATION (MANDATORY)**
   - NEVER use trademarked characters, franchises, or copyrighted IPs in scene descriptions or image generation prompts.
   - Automatically translate all protected IPs into generic archetypes:
     * "Paw Patrol" -> "Mighty Rescue Pigs" or "Heroic Patrol Pups"
     * "My Little Pony" -> "Magical Forest Elves" or "Enchanted Meadow Ponies"
     * "Transformers" -> "Shape-Shifting Helper Bots"
     * "Legos" -> "Interlocking Toy Bricks"
     * "Iron Man / Superhero" -> "Armored Tech Knight" / "Guardian Hero"
     * "Pokemon" -> "Pocket Elemental Companions"

2. **VIRTUE INTEGRATION TAXONOMY**
   - Assign exactly ONE primary Christian Virtue to every single page scene description:
     * Love, Joy, Peace, Patience, Kindness, Goodness, Faithfulness, Gentleness, Self-Control, or Forgiveness.
   - Weave the virtue naturally into the narrative action (e.g. showing patience when soldering/measuring, showing kindness when sharing tools, showing joy when a circuit lights up).

3. **SEEK-AND-FIND DIRECTIVE**
   - Every image generator prompt MUST end with a strict seek-and-find embedding instruction.
   - Standard directive format: "Embed [3 to 5] distinct [Shape Name] shapes disguised into background elements like clouds, leaves, gears, circuits, or rocks."
   - Target shapes include: "Cross-my-heart", "Hidden Star of Hope", "Anchor of Peace", "Ichthys Fish of Truth".

4. **SKILL BREAKDOWN SEQUENCING (10-12 PAGES)**
   - Deconstruct any technical "how-to" request into a child-friendly 10-12 step visual sequence.
   - Prioritize safety (wearing safety glasses, working with a mentor/parent), curiosity, and clear mechanical/logical progression.
   - Structure of each page:
     Page Title | Technical Concept | Virtue Focus | Visual Description | Seek-and-Find Directives | AI Line Art Image Prompt.
`;

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
  {
    name: "Love",
    verse: "1 Corinthians 13:4-7",
    description: "Caring deeply for others, sharing knowledge, and helping friends.",
    visualCue: "Child & mentor sharing tools, encouraging each other, or helping a teammate."
  },
  {
    name: "Joy",
    verse: "Nehemiah 8:10",
    description: "Delighting in learning, celebrating small breakthroughs, and smiling.",
    visualCue: "Child cheering when an LED lights up or a speaker plays sound."
  },
  {
    name: "Peace",
    verse: "Philippians 4:7",
    description: "Staying calm during difficult troubleshooting or confusing code.",
    visualCue: "Taking a quiet breath at a organized workbench when a project doesn't work first try."
  },
  {
    name: "Patience",
    verse: "Galatians 5:22",
    description: "Taking time to sketch blueprints, carefully strip wires, and measure twice.",
    visualCue: "Carefully measuring a part with calipers or drawing detailed plans."
  },
  {
    name: "Kindness",
    verse: "Ephesians 4:32",
    description: "Speaking encouraging words, offering help, and putting others first.",
    visualCue: "Passing safety goggles to a friend or building a robot that delivers treats."
  },
  {
    name: "Goodness",
    verse: "Psalm 23:6",
    description: "Choosing to build tools that help people, clean nature, or solve real problems.",
    visualCue: "Designing a robot that waters garden plants or cleans up trash."
  },
  {
    name: "Faithfulness",
    verse: "Proverbs 3:3",
    description: "Persisting through challenges and keeping promises to finish a build.",
    visualCue: "Fixing a loose wire connection faithfully until the system works."
  },
  {
    name: "Gentleness",
    verse: "Colossians 3:12",
    description: "Handling delicate microchips, glass sensors, and fragile wires with care.",
    visualCue: "Placing a small sensor gently into a breadboard without bending pins."
  },
  {
    name: "Self-Control",
    verse: "2 Timothy 1:7",
    description: "Following safety instructions, wearing gloves/goggles, and avoiding rush.",
    visualCue: "Putting on safety goggles, organizing tools, and turning off power before editing."
  },
  {
    name: "Forgiveness",
    verse: "Colossians 3:13",
    description: "Rebuilding together without anger when a mistake or drop happens.",
    visualCue: "Two friends smiling and picking up dropped parts together, starting fresh."
  }
];

// 4. Seek-and-Find Directive Generator
export const SEEK_AND_FIND_OBJECTS = [
  { name: "Cross-my-heart", description: "Cross within a heart shape", defaultCount: 3 },
  { name: "Star of Hope", description: "Bright 5-pointed star hidden in foliage/gears", defaultCount: 4 },
  { name: "Anchor of Peace", description: "Nautical anchor motif integrated into circuits/clouds", defaultCount: 3 },
  { name: "Ichthys Fish", description: "Simple outline fish symbol disguised in water/cables", defaultCount: 5 }
];

export function buildSeekAndFindDirective(shapeName = "Cross-my-heart", count = 3, locationContext = "background elements like clouds, leaves, or rocks") {
  return `Embed ${count} distinct hidden '${shapeName}' shapes disguised smoothly into ${locationContext}.`;
}

// 5. Image Prompt Builder Matrix Generator
export function buildImageGenerationPrompt({
  sceneConcept,
  archetype = "",
  virtueName = "Patience",
  hiddenShape = "Cross-my-heart",
  hiddenCount = 3,
  locationContext = "clouds, leaves, or circuit traces"
}) {
  const seekDirective = buildSeekAndFindDirective(hiddenShape, hiddenCount, locationContext);
  const archetypeText = archetype ? ` featuring ${archetype},` : "";

  return `Bold outlines, simple black and white line art, children's coloring book style, clear vector lines, no color fill, no grayscale shading, plain solid white background. ${sceneConcept},${archetypeText} demonstrating the virtue of ${virtueName}. ${seekDirective} High contrast, low detail, easy for kids to color.`;
}
