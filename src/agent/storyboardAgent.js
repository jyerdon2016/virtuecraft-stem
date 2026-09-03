/**
 * Storyboard & Narrative Subagent
 * 
 * Takes custom prompt textboxes or random ideas and generates a cohesive
 * 12-page storyline, educational/moral takeaways, and page scene descriptions
 * tailored for either personal use ("For My Kids") or commercial use ("To Sell on Amazon KDP/Etsy").
 */

import { VIRTUES_MATRIX, SEEK_AND_FIND_OBJECTS } from "../engine/systemPrompts.js";

// Real High-Resolution AI Diffusion Coloring Pages for Super Squirrel
export const SUPER_SQUIRREL_REAL_IMAGES = {
  1: "./images/super_squirrel/page1_flight_planning.jpg",
  2: "./images/super_squirrel/page2_safety_suit.jpg",
  3: "./images/super_squirrel/page3_canopy_gliding.jpg",
  4: "./images/super_squirrel/page4_acorn_radar.jpg", // The exact image in user's screenshot
  5: "./images/super_squirrel/page5_solar_treehouse.jpg",
  6: "./images/super_squirrel/page6_gentle_rescue.jpg",
  7: "./images/super_squirrel/page7_automated_logic.jpg",
  8: "./images/super_squirrel/page4_acorn_radar.jpg", // fallback if generating
  9: "./images/super_squirrel/page5_solar_treehouse.jpg",
  10: "./images/super_squirrel/page6_gentle_rescue.jpg",
  11: "./images/super_squirrel/page11_canopy_maze.jpg",
  12: "./images/super_squirrel/page12_stem_catapult.jpg",
  frontCover: "./images/super_squirrel/front_cover_color.jpg",
  backCover: "./images/super_squirrel/back_cover_color.jpg",
  lineArtCover: "./images/super_squirrel/cover_line_art.jpg"
};

// Curated library of high-converting, popular creative themes for random generation
export const RANDOM_PROMPT_IDEAS = [
  // Super Squirrel Featured Bestseller
  {
    topic: "Super Squirrel: Forest Guardian & Acorn Tech",
    title: "Sammy the Super Squirrel: Hyper-Focus Hero",
    category: "Superhero & Action",
    audience: "Amazon KDP Bestseller",
    style: "Bold Line Art",
    characters: "Sammy the Super Squirrel & Pip the Chipmunk",
    hook: "Sammy uses his superhero cape, walkie-talkie sonar, and fast-thinking ADHD brain to protect the Great Forest."
  },
  // STEM & Inventions
  {
    topic: "Friendly Robot Building a Treehouse",
    title: "The Workshop in the Sky",
    category: "STEM & Inventions",
    audience: "Kids & Classroom",
    style: "Bold Line Art",
    characters: "Rusty the Robot & Mia the Builder",
    hook: "Follow Rusty the gentle helper bot as he gathers sustainable wood and solar panels to build the highest treehouse in town."
  },
  {
    topic: "Deep Sea Ocean Submersible Exploration",
    title: "Secrets of the Luminous Abyss",
    category: "STEM & Inventions",
    audience: "Kids & Classroom",
    style: "Detailed Vector",
    characters: "Captain Noah & Pip the Submarine Drone",
    hook: "Dive deep beneath glowing coral reefs and discover hydrothermal vents with a friendly yellow research submarine."
  },
  {
    topic: "Solar Powered Race Car Championship",
    title: "Sun-Powered Speedsters",
    category: "STEM & Inventions",
    audience: "Kids & Classroom",
    style: "Bold Line Art",
    characters: "Leo the Mechanic & Ray the Solar Racer",
    hook: "Design, tune, and race a photon-powered race car that teaches green energy and aerodynamic engineering."
  },
  
  // Animal Adventures
  {
    topic: "Astronaut Bunny Exploring Mars",
    title: "Carrot Rocket to the Red Planet",
    category: "Animal Adventures",
    audience: "Amazon KDP Bestseller",
    style: "Kawaii Chibi",
    characters: "Barnaby the Space Bunny",
    hook: "Put on your puffy space suit and bounce across red dunes planting cosmic carrots and meeting Martian crystals."
  },
  {
    topic: "Little Mechanical Fox Repairing Forest Toys",
    title: "The Clockwork Forest Workshop",
    category: "Animal Adventures",
    audience: "Amazon KDP Bestseller",
    style: "Steampunk Blueprint",
    characters: "Flick the Fox Engineer",
    hook: "Flick uses tiny gears, brass springs, and patience to fix broken toys for his woodland animal friends."
  },
  {
    topic: "Baby Dinosaur Finding Ancient Constellations",
    title: "Starlight Stegosaurus",
    category: "Animal Adventures",
    audience: "Kids & Bedtime",
    style: "Chunky Outline",
    characters: "Pip the Baby Stegosaurus",
    hook: "A gentle bedtime adventure tracing celestial shapes in the night sky above lush prehistoric fern valleys."
  },

  // Fantasy & Quests
  {
    topic: "The Enchanted Floating Island Bakery",
    title: "Clouds & Cinnamon Buns",
    category: "Fantasy & Quests",
    audience: "Etsy Printable",
    style: "Kawaii Chibi",
    characters: "Baker Bella & Whisk the Winged Kitten",
    hook: "Fly between pastel sugar clouds baking magical pastries that spread peace and happiness to kingdom villages."
  },
  {
    topic: "Kingdom of Kindness & Royal Knights of Grace",
    title: "Armor of Light & Truth",
    category: "Biblical Virtues & Faith",
    audience: "Homeschool & Faith",
    style: "Bold Line Art",
    characters: "Sir Caleb the Valiant & Lady Grace",
    hook: "Journey through castle courtyards where true strength comes from honesty, humility, peace, and serving others."
  },
  {
    topic: "Cozy Garden Greenhouse & Friendly Micro-Critters",
    title: "The Sprout Sanctuary",
    category: "Nature & Mindful",
    audience: "Adults & Teens Mindfulness",
    style: "Detailed Vector",
    characters: "Botanist Hazel & Beatrice the Bumblebee",
    hook: "Calming botanical drawings of terrariums, potted succulents, watering cans, and fluttering pollinators."
  }
];

export class StoryboardAgent {
  constructor() {
    this.agentName = "Storyboard & Narrative Architect Subagent";
    this.version = "2.0";
  }

  getRandomIdea() {
    const idx = Math.floor(Math.random() * RANDOM_PROMPT_IDEAS.length);
    return RANDOM_PROMPT_IDEAS[idx];
  }

  generate12PageStoryboard(options = {}) {
    const topic = options.topic || "Super Squirrel: Forest Guardian & Acorn Tech";
    const customTitle = options.title || `The Adventures of ${topic}`;
    const authorOrChild = options.recipientName || "Young Adventurer";
    const purpose = options.purpose || "kids";
    const targetAge = options.targetAge || "4-9 years";
    const artStyle = options.artStyle || "Bold Line Art";

    const isCommercial = purpose === "commercial";
    const isSuperSquirrel = topic.toLowerCase().includes("squirrel");

    const storyMilestones = isSuperSquirrel ? [
      { step: 1, title: "Flight Planning & Compass Navigation", skill: "System Architecture", virtue: "Patience", action: "Sammy the Super Squirrel drafting aerial maps of the great oak forest at sunrise with a pencil and acorn compass" },
      { step: 2, title: "Flight Suit Safety & Aviator Goggles", skill: "Safety Engineering", virtue: "Self-Control", action: "Sammy testing his flowing superhero cape and strapping on oversized aviator goggles before soaring" },
      { step: 3, title: "Canopy Gliding & Aerodynamics", skill: "Aerodynamic Flight", virtue: "Joy", action: "Sammy gliding joyfully between tall oak branches with arms outstretched and cape billowing" },
      { step: 4, title: "Acorn Radar & Sonar Walkie-Talkie", skill: "Acoustic Sensing", virtue: "Goodness", action: "Sammy holding an acorn walkie-talkie emitting soundwaves to locate winter nuts, sitting on an oak branch with a cute chipmunk friend" },
      { step: 5, title: "Solar Treehouse Recharge Station", skill: "Clean Energy Circuits", virtue: "Faithfulness", action: "Sammy and a mini robot helper mounting a miniature solar panel atop the treehouse roof" },
      { step: 6, title: "Gentle Rescue with a Wooden Lever", skill: "Mechanical Advantage", virtue: "Kindness", action: "Sammy gently lifting a fallen pine branch with a stick lever to rescue a smiling baby hedgehog" },
      { step: 7, title: "Automated Acorn Logic Coding", skill: "Algorithm Coding", virtue: "Wisdom", action: "Sammy assembling oversized wooden code blocks labeled IF, THEN, SENSE with a conveyor belt sorting machine" },
      { step: 8, title: "Meadow Harvest Sharing Wagon", skill: "Resource Logistics", virtue: "Love", action: "Sammy pushing a wooden wagon overflowing with acorns and berries to share with meadow animals" },
      { step: 9, title: "Treehouse Windmill Diagnostics", skill: "Mechanical Diagnostics", virtue: "Peace", action: "Sammy calmly tightening gears on the treehouse wind turbine with a small wrench" },
      { step: 10, title: "Woodland Honor Celebration", skill: "Community Leadership", virtue: "Joy", action: "Sammy standing proudly wearing a golden oak leaf medal while woodland animal friends cheer" }
    ] : [
      { step: 1, title: "The Blueprint & Inspiration", skill: "Planning & Vision", virtue: "Patience", action: `drafting creative blueprints and sketches of ${topic} on a sunlit studio desk with rulers, pencils, and rolled parchment maps` },
      { step: 2, title: "Gathering Gear & Preparation", skill: "Organization & Safety", virtue: "Self-Control", action: `carefully organizing essential tools, protective equipment, and gear prepared for the journey into ${topic}` },
      { step: 3, title: "First Steps into the World", skill: "Exploration & Courage", virtue: "Faithfulness", action: `venturing into the scenic landscape of ${topic}, encountering lush plants, winding paths, and friendly companions` },
      { step: 4, title: "The Hidden Wonder Discovery", skill: "Perception & Joy", virtue: "Joy", action: `discovering a marvelous magical habitat or creature related to ${topic}, smiling with wonder surrounded by glowing sparkles` },
      { step: 5, title: "The Workshop & Invention", skill: "Applied Engineering", virtue: "Gentleness", action: `working together in a cozy workshop to build and align mechanical parts, gears, and gadgets for ${topic}` },
      { step: 6, title: "Logic & Creative Crafting", skill: "Algorithm Design", virtue: "Goodness", action: `solving an intricate puzzle or assembling colorful building blocks to bring ${topic} fully to life` },
      { step: 7, title: "Overcoming a Great Challenge", skill: "Diagnostic Reasoning", virtue: "Peace", action: `patiently solving a tricky problem with calm focus, using a magnifying glass to check details in ${topic}` },
      { step: 8, title: "Cooperative Teamwork", skill: "Collaboration", virtue: "Love", action: `a cheerful circle of friends working hand-in-hand to complete a grand project in the realm of ${topic}` },
      { step: 9, title: "Helping Others & Generosity", skill: "Benevolence & Purpose", virtue: "Kindness", action: `sharing kindness and helping a small friendly creature who needed assistance in the setting of ${topic}` },
      { step: 10, title: "The Grand Celebration", skill: "Achievement & Joy", virtue: "Joy", action: `a joyous victory celebration with confetti, banners, and cheers celebrating the triumph of ${topic}` }
    ];

    const pages = [];

    // Pages 1 to 10
    storyMilestones.forEach((m, idx) => {
      const virtue = m.virtue;
      const hiddenShape = SEEK_AND_FIND_OBJECTS[idx % SEEK_AND_FIND_OBJECTS.length].name;
      const pageTitle = `Page ${m.step}: ${m.title}`;

      const realImg = isSuperSquirrel ? SUPER_SQUIRREL_REAL_IMAGES[m.step] : null;

      const narrative = isCommercial
        ? `In this captivating scene, creators explore ${m.skill} through bold, print-ready line art. Character focuses on ${m.action}, reinforcing the core value of ${virtue}. Perfectly calibrated for Amazon KDP interior printing with bold lines and bleed margins.`
        : `A joyful story page created especially for ${authorOrChild}! Here we explore ${m.skill} while discovering the beauty of ${virtue}. Notice how calm focus and steady effort bring ${topic} to life step by step!`;

      pages.push({
        pageNumber: m.step,
        type: "story",
        title: pageTitle,
        skill: m.skill,
        virtue: virtue,
        actionPrompt: m.action,
        narrative: narrative,
        hiddenShape: hiddenShape,
        hiddenCount: 3 + (idx % 3),
        artStyle: artStyle,
        isCommercial: isCommercial,
        realImageUrl: realImg
      });
    });

    // Page 11: Interactive Maze
    pages.push({
      pageNumber: 11,
      type: "puzzle",
      title: isSuperSquirrel ? "Page 11: Treetop Canopy Maze Challenge" : "Page 11: The Pathfinder Maze Challenge",
      skill: "Spatial Logic & Route Navigation",
      virtue: "Perseverance",
      actionPrompt: isSuperSquirrel ? "a winding oak branch maze through the forest canopy leading to the golden oak acorn" : `an intricate vector labyrinth guiding the path through ${topic} corridors`,
      narrative: `Engage young problem solvers with a bold-line pathfinder maze! Guide the hero through the tree branch corridors past tricky hollows to the celebration arch.`,
      hiddenShape: "Star of Hope",
      hiddenCount: 4,
      artStyle: artStyle,
      isCommercial: isCommercial,
      realImageUrl: isSuperSquirrel ? SUPER_SQUIRREL_REAL_IMAGES[11] : null
    });

    // Page 12: Hands-On STEM Project
    pages.push({
      pageNumber: 12,
      type: "stem-project",
      title: isSuperSquirrel ? "Page 12: Hands-On STEM Acorn Catapult" : "Page 12: Hands-On Craft & Collector Blueprint",
      skill: "Applied Making & Household Engineering",
      virtue: "Generosity",
      actionPrompt: isSuperSquirrel ? "a step-by-step craft catapult diagram using popsicle sticks, rubber bands, and a bottle cap" : `a step-by-step physical craft blueprint diagram using simple household materials`,
      narrative: `Bring the story into the real world! Follow simple step-by-step instructions using craft sticks, rubber bands, and paper to launch clean seeds and acorns across your yard!`,
      hiddenShape: "Cross-my-heart",
      hiddenCount: 5,
      artStyle: artStyle,
      isCommercial: isCommercial,
      realImageUrl: isSuperSquirrel ? SUPER_SQUIRREL_REAL_IMAGES[12] : null
    });

    return {
      topic: topic,
      title: customTitle,
      subtitle: isCommercial ? `A High-Quality Commercial Coloring Book for Amazon KDP & Print-on-Demand` : `A Personalized Adventure Coloring Book for ${authorOrChild}`,
      recipientOrAuthor: authorOrChild,
      purpose: purpose,
      targetAge: targetAge,
      artStyle: artStyle,
      totalPages: 12,
      isSuperSquirrel: isSuperSquirrel,
      coverImages: isSuperSquirrel ? {
        front: SUPER_SQUIRREL_REAL_IMAGES.frontCover,
        back: SUPER_SQUIRREL_REAL_IMAGES.backCover,
        lineArt: SUPER_SQUIRREL_REAL_IMAGES.lineArtCover
      } : null,
      pages: pages
    };
  }
}
