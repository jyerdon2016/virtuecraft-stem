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

/**
 * Generate a complete 12-page coloring book issue for a specified topic, issue number (1-12), and age group (4-9)
 */
export function generateColoringBook(rawTopic = "How to Build a Robot", issueNumber = 1, targetAge = "4-9 years", customVirtue = "") {
  const { sanitizedText: cleanTopic, replacedIPs } = sanitizeCopyrightText(rawTopic);
  const safeIssueNum = Math.min(12, Math.max(1, parseInt(issueNumber) || 1));
  const masterArcModule = ANNUAL_MASTER_PROJECT.issues[safeIssueNum - 1] || ANNUAL_MASTER_PROJECT.issues[0];

  const skillSteps = [
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

  const pages = [];

  // Generate Pages 1 through 10 (Story & Skill Steps)
  skillSteps.forEach((step, idx) => {
    const pageNum = idx + 1;
    const virtueObj = VIRTUES_MATRIX.find(v => v.name === (customVirtue || step.defaultVirtue)) || VIRTUES_MATRIX[idx % VIRTUES_MATRIX.length];
    const hiddenShapeObj = SEEK_AND_FIND_OBJECTS[idx % SEEK_AND_FIND_OBJECTS.length];
    
    const pageTitle = `Page ${pageNum}: ${step.title}`;
    const narrativeParagraph = ISSUE1_ROBOTICS_NARRATIVES[pageNum] || `A rich visual scene teaching ${step.skill} while demonstrating ${virtueObj.name}.`;

    const promptObj = buildImageGenerationPrompt({
      sceneSubjectAction: step.subjectAction,
      virtueName: virtueObj.name,
      hiddenShape: hiddenShapeObj.name,
      hiddenCount: 3 + (pageNum % 3)
    });

    pages.push({
      pageNumber: pageNum,
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
    sceneSubjectAction: "interactive vector circuit maze puzzle",
    virtueName: puzzleVirtue,
    hiddenShape: mazeHiddenShape,
    hiddenCount: 4,
    isMaze: true
  });

  pages.push({
    pageNumber: 11,
    type: "puzzle",
    title: `Page 11: Circuit Pathfinder Maze`,
    technicalSkill: "Logic Pathfinder & Algorithm Navigation",
    virtue: puzzleVirtue,
    narrative: ISSUE1_ROBOTICS_NARRATIVES[11],
    hiddenShape: mazeHiddenShape,
    hiddenCount: 4,
    prompt: mazePromptObj.positivePrompt,
    negativePrompt: mazePromptObj.negativePrompt,
    overlayDirective: mazePromptObj.overlayDirective
  });

  // Page 12: Hands-On Household STEM Project & Cumulative Master Blueprint Clue
  const stemPromptObj = buildImageGenerationPrompt({
    sceneSubjectAction: `hands-on cardboard circuit baseplate project with blueprint clue #${safeIssueNum}`,
    virtueName: "Love",
    hiddenShape: "Star of Hope",
    hiddenCount: 5
  });

  pages.push({
    pageNumber: 12,
    type: "stem-project",
    title: `Page 12: STEM Project & Master Blueprint Clue #${safeIssueNum}`,
    technicalSkill: `Hands-On Build: ${masterArcModule.stemProject}`,
    virtue: "Love",
    stemProjectDetails: {
      projectName: masterArcModule.stemProject,
      materials: ["Cardboard baseplate", "Aluminum foil strips", "Tape & scissors", "1.5V AA Battery & LED (optional)", "Paper cups"],
      instructions: [
        "Gather safe household craft items.",
        `Assemble the ${masterArcModule.componentName} following the step-by-step layout.`,
        "Save this completed piece in your Master Citadel Collector Box!"
      ]
    },
    masterArcClue: {
      issueNumber: safeIssueNum,
      grandProjectTitle: ANNUAL_MASTER_PROJECT.title,
      componentName: masterArcModule.componentName,
      hintText: masterArcModule.hint
    },
    narrative: ISSUE1_ROBOTICS_NARRATIVES[12],
    hiddenShape: "Star of Hope",
    hiddenCount: 5,
    prompt: stemPromptObj.positivePrompt,
    negativePrompt: stemPromptObj.negativePrompt,
    overlayDirective: stemPromptObj.overlayDirective
  });

  return {
    issueNumber: safeIssueNum,
    topic: cleanTopic,
    subtitle: `Issue #${safeIssueNum}: A Children's Guide to ${cleanTopic} (Ages 4-9)`,
    targetAge,
    replacedIPs,
    masterArcModule,
    pages
  };
}
