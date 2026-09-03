/**
 * VirtueCraft STEM - Coloring Book Generator Engine
 * 
 * Generates 12-page child-friendly technical skill coloring books with
 * locked diffusion prompt formulas, negative prompts, single focal point subjects,
 * Christian virtue integration, seek-and-find overlay directives, and STEM projects.
 */

import {
  sanitizeCopyrightText,
  VIRTUES_MATRIX,
  ANNUAL_MASTER_PROJECT,
  SEEK_AND_FIND_OBJECTS,
  buildImageGenerationPrompt,
  LOCKED_NEGATIVE_PROMPT
} from "./systemPrompts.js";

// Rich 5-Sentence Scene Description Paragraphs for Year 1 Issue #1 ("How to Build a Robot")
export const ISSUE1_ROBOTICS_NARRATIVES = {
  1: "A curious seven-year-old child sits focused at a sunlit wooden workbench, carefully sketching the initial robot blueprint with a pencil and clear plastic ruler. Crumpled paper ideas dot the desk alongside colorful markers, showing that good engineering takes steady practice and careful planning. Soft morning light streams through the window, highlighting three hidden 'Cross-my-heart' shapes disguised seamlessly among the blueprint cloud bubbles and pencil jar patterns. The child smiles thoughtfully while measuring each arm component, demonstrating the virtue of Patience by taking time to plan before building. Resting on the corner shelf, a cheerful toy helper bot stands ready, inspiring the young builder to turn dreams into real mechanical designs.",
  2: "An oversized, friendly ESP32 microcontroller character with glowing eyes and a wide, welcoming smile stands at the center of the workbench to explain how robot brains think. Tiny metallic pins extend from its sides like cheerful little legs, showing how data signals travel back and forth to control lights and motors. Intricate circuit board traces wind through the background, hiding four distinct 'Star of Hope' shapes tucked inside the corner power gears and leafy wall art. The child gazes in awe as the micro-brain glows softly, learning that technology should always be designed with Goodness to serve and protect people. Floating thought-bubbles around the microchip illustrate logic rules, showing young minds how simple computer code brings ideas to life.",
  3: "With soft, careful hands, the child gently presses a blue DHT11 temperature sensor and a motion detector module into the tiny grid holes of a white breadboard. Flexible jumper wires curve gracefully across the desk like colorful vines, connecting the sensors to the robot's main circuit. Tucked into the window foliage outside and the wire loops on the table, three hidden 'Cross-my-heart' shapes wait to be discovered by keen young eyes. The scene teaches the virtue of Gentleness, demonstrating how delicate microchips and fragile pins require calm, careful handling to prevent bending. Outside the sunny window, birds chirp peacefully as the child tests how the sensor detects warm temperature changes in the room.",
  4: "A small PAM8403 audio amplifier board and mini circular speaker spring to life, sending cheerful musical soundwave bubbles floating through the air. The young engineer claps with delight as the robot utters its very first spoken words of encouragement and friendly greeting. Five hidden 'Ichthys Fish' symbols swim through the floating soundwave patterns and background wall decor, adding a fun seek-and-find challenge to the scene. This heartwarming moment celebrates the virtue of Joy, showing how technical discovery brings happiness when we use our voices to speak kind words. Glowing LED lights flicker rhythmically with each sound note, transforming the quiet workshop into a celebration of music and code.",
  5: "Wearing protective safety goggles, the child works side-by-side with a caring parent or mentor at a brightly lit soldering station. Thin wisps of solder smoke curl gracefully into the air as they safely hold the soldering iron together to join copper wire connections. Three hidden 'Cross-my-heart' shapes lie disguised within the rising smoke currents and tool rack outlines in the background. The scene captures the deep virtue of Love, showing how passing down technical skills and practicing safety creates cherished family memories. An organized rack of pliers, wire strippers, and safety gear frames the workbench, reinforcing the importance of safety equipment.",
  6: "The child carefully attaches compact blue servo motors to the robot's shoulder joints using small brass screws and a precision screwdriver. Clear angle markings from zero to one hundred eighty degrees arch around the motor arm, showing how smooth gear rotations provide exact physical motion. Embedded within the mechanical gear teeth and background wall tiles, three hidden 'Anchor of Peace' shapes await discovery. The scene illustrates Self-Control, teaching young builders that powerful mechanical arms must be programmed to move calmly, smoothly, and safely. The child double-checks every screw alignment, feeling proud of how precise engineering creates smooth, controlled robotic movement.",
  7: "A neat rechargeable battery power module connects securely to the main power bus, displaying bright positive and negative terminal symbols. Sparkles of clean electric energy glow around the insulated red and black leads, showing how reliable power keeps the robot running smoothly. Four hidden 'Star of Hope' shapes shimmer inside the energy spark bubbles and starry window view outside. The page highlights the virtue of Faithfulness, explaining that just as circuits require steady current flow, staying faithful to our goals keeps our work strong. The child double-checks wire polarities with confidence, ensuring the robot receives safe, steady voltage.",
  8: "Sitting comfortably in an ergonomic chair, the child snaps colorful block-code puzzle pieces together on a laptop screen to write the robot's operational program. Code blocks labeled IF, THEN, and SENSE click into place seamlessly, translating human commands into digital machine instructions. Disguised within the floating code block shadows and background indoor house plants, three hidden 'Cross-my-heart' shapes are cleverly tucked away. The scene reinforces Patience, demonstrating that writing and organizing computer code requires calm focus and logical step-by-step thinking. A cute miniature helper bot sits beside the laptop screen, eagerly waiting for its new code program to upload.",
  9: "When a motor doesn't turn on immediately, the child remains completely calm, using a handheld digital multimeter and magnifying glass to check connection paths. Rather than feeling frustrated, the young engineer smiles serenely, knowing that finding loose wires is a normal, rewarding part of the building process. Three hidden 'Anchor of Peace' shapes float peacefully inside the soft clouds visible through the workshop window. The page teaches the virtue of Peace, showing that maintaining a tranquil mind helps us solve complex problems with clarity. Sunshine fills the quiet room as the magnifying glass reveals a simple loose jumper pin that is easily plugged back in.",
  10: "Out in a blooming neighborhood garden, the finished rolling helper bot gently carries a tray with a fresh glass of water and a bright yellow flower to an elderly neighbor. Smiling family members and friends watch with warm hearts as the robot uses its arm to serve others with gentle care. Four hidden 'Cross-my-heart' shapes are woven into the garden flower petals and fluffy background clouds. The scene embodies the virtue of Kindness, showing that the ultimate purpose of acquiring STEM skills is to love and serve our community. Sunbeams illuminate the colorful garden path as children cheer for their working creation.",
  11: "An interactive vector line-art maze challenges young minds to guide a glowing power line from the green START terminal through complex circuit corridors to the red FINISH node. Thick, bold black walls create clean paths for ages 4-9 to trace with crayons or markers while dodging gear obstacles. Four hidden 'Ichthys Fish' symbols are cleverly integrated into the corridor turns and capacitor symbols along the way. The puzzle page reinforces logical pathfinding and spatial reasoning while teaching children to persevere through winding paths. Upon reaching the end, a glowing victory icon confirms that the circuit is complete and fully powered!",
  12: "The final page presents a step-by-step hands-on craft project where kids build a real 'Cardboard Baseplate & Foil Circuit Trace' using household materials like foil, tape, and paper cups. A prominent golden blueprint badge highlights 'Mystery Master Clue #1' of 12 for the grand annual project, The Solar Smart Eco-Citadel. Five hidden 'Star of Hope' shapes decorate the blueprint border grid and craft tool rack. The page instills Generosity & Vision, encouraging children to save their completed baseplate module in their collector box as they look forward to assembling all 12 monthly pieces into one working master citadel!"
};

// Rich 5-Sentence Scene Description Paragraphs for "Super Squirrel: Forest Guardian & Acorn Tech (My ADHD Superpower!)"
export const SUPER_SQUIRREL_NARRATIVES = {
  1: "At the peak of the Great Forest Oak Tree, Sammy the Super Squirrel bounces with joyful excitement on a mossy branch, his fast-thinking ADHD brain buzzing with ten brilliant ideas all at once! He unrolls an ancient woodland tree-map, using his wooden ruler and deep breaths to channel his lightning-fast thoughts into a clear flight plan. His superhero cape ripples in the morning breeze while the golden acorn emblem on his chest shines brightly in the rising sunlight. In the soft clouds drifting past and the oak leaf veins below, three hidden 'Cross-my-heart' shapes are cleverly woven into the scene. Sammy smiles with deep Patience, proving that when an energetic hero takes time to organize big ideas, boundless curiosity becomes a world-changing superpower.",
  2: "Inside his hollow-trunk workshop, Sammy channels his bustling physical energy by organizing his flight gear, clicking the sturdy buckles of his Acorn Glider harness securely into place. Pinned to the cedar wall, a colorful visual checklist with bright pictures helps his ADHD mind remember every single pre-flight step without getting distracted. Tucked into the wooden tool pegs and hanging pinecone lamps in the background, four hidden 'Star of Hope' shapes shimmer in the cozy workshop light. Demonstrating the virtue of Self-Control, Sammy spins his favorite acorn fidget-gyro in his paw to calm his racing excitement before takeoff. Outside the tree window, a gentle morning dew confirms optimal weather conditions for testing his new aerial gear.",
  3: "With an exhilarating leap from the highest bough, Super Squirrel’s boundless energy transforms into pure aerial magic as he glides across the wide open sky! His active mind tracks wind currents, singing birds, and tree branches in a split second, reacting faster than any ordinary squirrel. Three hidden 'Cross-my-heart' shapes drift peacefully within the wispy cloud ribbons and swirling leaf trails behind him. This exhilarating flight celebrates the virtue of Joy, demonstrating that what some call hyperactivity is actually Sammy’s secret rocket-fuel when soaring in the direction of his dreams. Down below in the green forest clearings, friendly rabbits and blue jays gaze upward in delight as Sammy executes a graceful loop-de-loop.",
  4: "Perched high in an ancient elm, Super Squirrel activates his handheld Acorn Radar Scanner, his hyper-observant eyes noticing faint paw tracks that everyone else walked right past. The gentle scanner waves detect fallen oak acorns that got buried beneath autumn leaves, ensuring no woodland creature goes hungry this season. Four distinct 'Ichthys Fish' symbols are cleverly tucked within the scanner wave ripples and distant branch textures. Super Squirrel exercises Goodness by dedicating his advanced tracking technology to caring for the forest ecosystem and protecting nature's bounty. A friendly chipmunk watches eagerly from a nearby twig, learning how sound pulses bounce back to find buried treasures.",
  5: "Working alongside his robotic woodland helper, Super Squirrel installs a glistening miniature solar leaf panel atop the sunny lookout tower. His energetic paws move with enthusiastic speed, carefully connecting bright red and black insulated wires from the clean solar collector to an acorn battery pack that will power the forest emergency beacons all night. Four hidden 'Star of Hope' shapes twinkle among the sunbeams and solar panel grid facets. The moment highlights the virtue of Faithfulness, reminding builders that clean solar energy stays faithful every time the morning sun shines down. Super Squirrel tightens each brass terminal screw with care, smiling as a warm green indicator LED lights up.",
  6: "Hearing a quiet rustling down on the forest floor, Super Squirrel swoops down gently to discover a timid baby hedgehog trapped beneath a heavy fallen pine branch. Using his biomechanical acorn lever and calm, measured power, Super Squirrel gently lifts the heavy bark without scaring the little critter. Three hidden 'Anchor of Peace' shapes are carved gracefully into the tree bark grooves and forest moss. The scene exemplifies the virtue of Kindness and Gentleness, teaching young heroes that great strength and big energy should always be used to protect and comfort those in need. The little hedgehog wiggles out safely, nose twitching with gratitude as Sammy offers a comforting high-five.",
  7: "Back at his tree-hollow lab desk, Super Squirrel enters his legendary 'Hyper-Focus Zone,' completely engrossed in programming an automated acorn-sorting machine. When a project captures his heart, his ADHD brain locks in with superhuman concentration that can build complex inventions in record time! Bright wooden block code commands labeled IF SENSE NUT, THEN ROLL BASKET click smoothly into place, turning smart ideas into working robotic machinery. Tucked among the floating logic arrows and hanging vine coils, three hidden 'Cross-my-heart' shapes wait to be discovered. Sammy shows that hyper-focus is an extraordinary gift when harnessed with Wisdom to bless the entire woodland community.",
  8: "In the center of the sunny woodland meadow, Super Squirrel arrives with a rolling cedar cart piled high with fresh, nutritious acorns and sweet berries. Smiling deer, hedgehogs, birds, and badgers gather around as Sammy shares his bountiful harvest with every family in the forest. Four hidden 'Cross-my-heart' shapes bloom among the meadow wildflowers and picnic basket weaves. This heartwarming feast embodies the virtue of Love and Generosity, showing that true heroism is found in giving freely and lifting up our neighbors. Laughter fills the forest air as woodland friends enjoy a delicious autumn feast together.",
  9: "When a sudden thunderstorm gust stops the treetop windmill from spinning, Super Squirrel climbs calmly up the mast with his wooden wrench and oil dropper. Instead of feeling overwhelmed by the whistling wind, he takes three mindful breaths, methodically inspects the cedar gear teeth, and applies a drop of pine resin lubricant to restore smooth rotation. Three hidden 'Anchor of Peace' shapes float quietly inside the clearing sky clouds and windmill blades. The scene inspires Peace, showing that remaining calm under pressure allows young inventors to diagnose mechanical problems with clarity and poise. With a satisfying click, the gear slips into proper alignment and the windmill spins merrily once again.",
  10: "In an open sunlit forest glade, the Woodland Council gathers to present Super Squirrel with a hand-carved Golden Oak Leaf Medal of Honor for his unstoppable enthusiasm and service. Whistling birds drop flower petals from above while squirrels, rabbits, and bears cheer enthusiastically for their neurodivergent hero who showed them that being different is a superpower. Five hidden 'Star of Hope' shapes sparkle in the golden medal reflections and festive banner ribbons. The scene celebrates Joy and Gratitude, reminding children that developing technical talents and virtues brings genuine blessing to our world. Super Squirrel places his paw over his heart in humble thanks, eager for tomorrow's next exciting adventure.",
  11: "An interactive vector line-art maze challenges young rangers to guide Super Squirrel from the green START branch through winding oak tree corridors, leafy bridges, and acorn obstacles to the Golden Oak Acorn at the FINISH nest. Thick, bold black branch walls create clean paths for ages 4-9 to trace with crayons or markers without getting confused. Four hidden 'Ichthys Fish' symbols are cleverly integrated into the branch knots and acorn caps along the trail. The canopy maze reinforces spatial navigation, motor control, and determination as kids help Super Squirrel find the safest route home. Reaching the finish line unlocks a proud Super Squirrel flight badge!",
  12: "The final page features a safe, hands-on household craft project where kids build a real 'Super Squirrel Acorn Catapult & Glider Launcher' using popsicle sticks, rubber bands, and a cardboard cup. A prominent golden blueprint badge displays 'Mystery Master Clue #1' for the grand annual project, connecting forest ecology with clean renewable engineering. Five hidden 'Star of Hope' shapes decorate the craft blueprint border and tool tray. The page inspires Ingenuity and Stewardship, encouraging kids to test flight trajectories across the room and save their launcher module in their Master Citadel Collector Box!"
};

export const SUPER_SQUIRREL_SKILL_STEPS = [
  { title: "Treetop Flight Planning", skill: "Aeronautical Navigation", defaultVirtue: "Patience", subjectAction: "a heroic Super Squirrel wearing a cape standing on an oak tree branch holding an aerial map" },
  { title: "Acorn Flight Suit Safety", skill: "Protective Engineering", defaultVirtue: "Self-Control", subjectAction: "Super Squirrel adjusting oversized aviator goggles and buckling an acorn flight harness" },
  { title: "Canopy Gliding Physics", skill: "Aerodynamics & Lift", defaultVirtue: "Joy", subjectAction: "Super Squirrel soaring high in the air with outstretched gliding flaps and fluffy bushy tail" },
  { title: "Acorn Radar & Sonar", skill: "Sensor Systems & Tracking", defaultVirtue: "Goodness", subjectAction: "Super Squirrel holding a handheld acorn radar scanner device emitting gentle sound waves" },
  { title: "Solar Treehouse Generator", skill: "Clean Solar Energy", defaultVirtue: "Faithfulness", subjectAction: "Super Squirrel connecting miniature solar leaf panels to a glowing acorn battery pack" },
  { title: "Gentle Rescue Mission", skill: "Mechanical Leverage & Care", defaultVirtue: "Kindness", subjectAction: "Super Squirrel using a wooden lever to gently lift a fallen branch and rescue a baby hedgehog" },
  { title: "Automated Acorn Logic", skill: "Algorithm & Block Coding", defaultVirtue: "Patience", subjectAction: "Super Squirrel assembling wooden logic code puzzle blocks on a tree-slab workbench" },
  { title: "Meadow Harvest Sharing", skill: "Resource Distribution", defaultVirtue: "Love", subjectAction: "Super Squirrel sharing baskets of golden acorns and sweet berries with woodland forest animals" },
  { title: "Windmill Troubleshooting", skill: "Mechanical Diagnostics", defaultVirtue: "Peace", subjectAction: "Super Squirrel holding a wooden wrench to carefully adjust a miniature treetop windmill gear" },
  { title: "Woodland Honor Celebration", skill: "Leadership & Community", defaultVirtue: "Joy", subjectAction: "Super Squirrel wearing a golden oak leaf medal surrounded by cheering forest friends" }
];

export const ROBOTICS_SKILL_STEPS = [
  { title: "Planning & Design", skill: "System Architecture", defaultVirtue: "Patience", subjectAction: "a happy 7-year-old child character holding a giant robot blueprint roll at a desk" },
  { title: "Safety & Gear", skill: "Safety Engineering", defaultVirtue: "Self-Control", subjectAction: "a heroic character wearing oversized chunky safety goggles holding a solder wire" },
  { title: "Core Component Assembly", skill: "Hardware Integration", defaultVirtue: "Gentleness", subjectAction: "an oversized blue sensor character plugging in one large jumper wire" },
  { title: "Power Supply Setup", skill: "Energy Flow & Circuits", defaultVirtue: "Faithfulness", subjectAction: "a giant power cell character with big plus and minus terminal signs" },
  { title: "Sensors & Inputs", skill: "Data Signal Sensing", defaultVirtue: "Goodness", subjectAction: "an oversized smiling ESP32 micro-brain character with metallic pin legs" },
  { title: "Logic & Programming", skill: "Block Code Logic", defaultVirtue: "Patience", subjectAction: "a giant block-code puzzle piece with IF and THEN blocks" },
  { title: "Teamwork & Collaboration", skill: "Cooperative Engineering", defaultVirtue: "Love", subjectAction: "a friendly child character holding hands with a robot helper" },
  { title: "Troubleshooting & Tuning", skill: "Diagnostic Testing", defaultVirtue: "Peace", subjectAction: "a giant magnifying glass character inspecting a circuit pin" },
  { title: "Helping Others", skill: "Community Impact", defaultVirtue: "Kindness", subjectAction: "a single smiling helper bot character carrying a yellow flower" },
  { title: "Celebration & Gratitude", skill: "Project Completion", defaultVirtue: "Joy", subjectAction: "an oversized smiling speaker character singing musical notes" }
];

/**
 * Generate a complete 12-page coloring book issue for a specified topic, issue number (1-12), and age group (4-9)
 */
export function generateColoringBook(rawTopic = "How to Build a Robot", issueNumber = 1, targetAge = "4-9 years", customVirtue = "") {
  const { sanitizedText: cleanTopic, replacedIPs } = sanitizeCopyrightText(rawTopic);
  const safeIssueNum = Math.min(12, Math.max(1, parseInt(issueNumber) || 1));
  const masterArcModule = ANNUAL_MASTER_PROJECT.issues[safeIssueNum - 1] || ANNUAL_MASTER_PROJECT.issues[0];

  const isSuperSquirrel = cleanTopic.toLowerCase().includes("squirrel");
  const skillSteps = isSuperSquirrel ? SUPER_SQUIRREL_SKILL_STEPS : ROBOTICS_SKILL_STEPS;
  const narrativesDict = isSuperSquirrel ? SUPER_SQUIRREL_NARRATIVES : ISSUE1_ROBOTICS_NARRATIVES;

  const pages = [];

  // Generate Pages 1 through 10 (Story & Skill Steps)
  skillSteps.forEach((step, idx) => {
    const pageNum = idx + 1;
    const virtueObj = VIRTUES_MATRIX.find(v => v.name === (customVirtue || step.defaultVirtue)) || VIRTUES_MATRIX[idx % VIRTUES_MATRIX.length];
    const hiddenShapeObj = SEEK_AND_FIND_OBJECTS[idx % SEEK_AND_FIND_OBJECTS.length];
    
    const pageTitle = `Page ${pageNum}: ${step.title}`;
    const narrativeParagraph = narrativesDict[pageNum] || `A rich visual scene teaching ${step.skill} while demonstrating ${virtueObj.name}.`;

    const promptObj = buildImageGenerationPrompt({
      sceneSubjectAction: step.subjectAction,
      virtueName: virtueObj.name,
      hiddenShape: hiddenShapeObj.name,
      hiddenCount: 3 + (pageNum % 3)
    });

    pages.push({
      pageNumber: pageNum,
      isSuperSquirrel,
      type: "story",
      title: pageTitle,
      technicalSkill: step.skill,
      virtue: virtueObj.name,
      narrative: narrativeParagraph,
      hiddenShape: hiddenShapeObj.name,
      hiddenCount: 3 + (pageNum % 3),
      prompt: promptObj.positivePrompt,
      negativePrompt: promptObj.negativePrompt,
      overlayDirective: promptObj.overlayDirective
    });
  });

  // Page 11: Interactive Line-Art Maze / Puzzle Challenge
  const puzzleVirtue = VIRTUES_MATRIX[safeIssueNum % VIRTUES_MATRIX.length].name;
  const mazeHiddenShape = SEEK_AND_FIND_OBJECTS[(safeIssueNum + 1) % SEEK_AND_FIND_OBJECTS.length].name;
  const mazePromptObj = buildImageGenerationPrompt({
    sceneSubjectAction: isSuperSquirrel 
      ? "interactive vector forest treetop canopy maze with Super Squirrel, acorns, and oak branches"
      : "interactive vector circuit maze puzzle",
    virtueName: puzzleVirtue,
    hiddenShape: mazeHiddenShape,
    hiddenCount: 4,
    isMaze: true
  });

  pages.push({
    pageNumber: 11,
    isSuperSquirrel,
    type: "puzzle",
    title: isSuperSquirrel ? `Page 11: Super Squirrel Canopy Treetop Maze` : `Page 11: Circuit Pathfinder Maze`,
    technicalSkill: isSuperSquirrel ? "Canopy Navigation & Spatial Reasoning" : "Logic Pathfinder & Algorithm Navigation",
    virtue: puzzleVirtue,
    narrative: narrativesDict[11],
    hiddenShape: mazeHiddenShape,
    hiddenCount: 4,
    prompt: mazePromptObj.positivePrompt,
    negativePrompt: mazePromptObj.negativePrompt,
    overlayDirective: mazePromptObj.overlayDirective
  });

  // Page 12: Hands-On Household STEM Project & Cumulative Master Blueprint Clue
  const stemPromptObj = buildImageGenerationPrompt({
    sceneSubjectAction: isSuperSquirrel
      ? `hands-on popsicle stick acorn catapult and glider launcher project with blueprint clue #${safeIssueNum}`
      : `hands-on cardboard circuit baseplate project with blueprint clue #${safeIssueNum}`,
    virtueName: "Love",
    hiddenShape: "Star of Hope",
    hiddenCount: 5
  });

  const stemProjectDetails = isSuperSquirrel
    ? {
        projectName: "Super Squirrel Acorn Catapult & Glider Launcher",
        materials: ["Jumbo craft sticks (popsicle sticks)", "Rubber bands", "Plastic bottle cap or mini cup", "Paper cutout squirrel glider", "Tape"],
        instructions: [
          "Stack 5 craft sticks together and bind both ends tightly with rubber bands.",
          "Insert a single launch stick through the base stack to form a fulcrum lever.",
          "Tape a bottle cap basket onto the top of the launcher arm.",
          "Load a soft pom-pom acorn or paper glider and test different launch angles to explore trajectory physics!"
        ]
      }
    : {
        projectName: masterArcModule.stemProject,
        materials: ["Cardboard baseplate", "Aluminum foil strips", "Tape & scissors", "1.5V AA Battery & LED (optional)", "Paper cups"],
        instructions: [
          "Gather safe household craft items.",
          `Assemble the ${masterArcModule.componentName} following the step-by-step layout.`,
          "Save this completed piece in your Master Citadel Collector Box!"
        ]
      };

  pages.push({
    pageNumber: 12,
    isSuperSquirrel,
    type: "stem-project",
    title: isSuperSquirrel ? `Page 12: Super Squirrel STEM Project — Acorn Catapult & Glider` : `Page 12: STEM Project & Master Blueprint Clue #${safeIssueNum}`,
    technicalSkill: isSuperSquirrel ? "Hands-On Build: Acorn Catapult & Glider Launcher" : `Hands-On Build: ${masterArcModule.stemProject}`,
    virtue: "Love",
    stemProjectDetails,
    masterArcClue: {
      issueNumber: safeIssueNum,
      grandProjectTitle: ANNUAL_MASTER_PROJECT.title,
      componentName: isSuperSquirrel ? "Eco-Aerodynamic Acorn Launch Module" : masterArcModule.componentName,
      hintText: isSuperSquirrel ? "Harnessing spring elasticity and kinetic launch angles to deliver forest supplies." : masterArcModule.hint
    },
    narrative: narrativesDict[12],
    hiddenShape: "Star of Hope",
    hiddenCount: 5,
    prompt: stemPromptObj.positivePrompt,
    negativePrompt: stemPromptObj.negativePrompt,
    overlayDirective: stemPromptObj.overlayDirective
  });

  return {
    issueNumber: safeIssueNum,
    isSuperSquirrel,
    topic: cleanTopic,
    subtitle: isSuperSquirrel 
      ? `Issue #${safeIssueNum}: The High-Flying Adventures of Super Squirrel (Ages 4-9)` 
      : `Issue #${safeIssueNum}: A Children's Guide to ${cleanTopic} (Ages 4-9)`,
    targetAge,
    replacedIPs,
    masterArcModule,
    pages
  };
}
