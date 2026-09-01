/**
 * VirtueTech AI - Coloring Book Generator Engine
 * 
 * Generates 12-page child-friendly technical skill coloring books with
 * Christian virtue integration, copyright sanitization, seek-and-find directives,
 * interactive line-art puzzles/mazes, hands-on STEM projects, and cumulative 12-issue master project clues.
 */

import {
  sanitizeCopyrightText,
  VIRTUES_MATRIX,
  ANNUAL_MASTER_PROJECT,
  SEEK_AND_FIND_OBJECTS,
  buildImageGenerationPrompt
} from "./systemPrompts.js";

/**
 * Generate a complete 12-page coloring book issue for a specified topic, issue number (1-12), and age group (4-9)
 */
export function generateColoringBook(rawTopic = "How to Build a Robot", issueNumber = 1, targetAge = "4-9 years", customVirtue = "") {
  // 1. Copyright Sanitization
  const { sanitizedText: cleanTopic, replacedIPs } = sanitizeCopyrightText(rawTopic);
  const safeIssueNum = Math.min(12, Math.max(1, parseInt(issueNumber) || 1));

  // 2. Fetch Cumulative Master Arc Component for this Issue
  const masterArcModule = ANNUAL_MASTER_PROJECT.issues[safeIssueNum - 1] || ANNUAL_MASTER_PROJECT.issues[0];

  // 3. Define 10 Story/Skill Steps (Pages 1-10)
  const skillSteps = [
    { title: "Planning & Design", skill: "System Architecture", defaultVirtue: "Patience", concept: "drawing blueprints and planning at a workbench" },
    { title: "Safety & Gear", skill: "Safety Engineering", defaultVirtue: "Self-Control", concept: "putting on protective goggles and preparing tools" },
    { title: "Core Component Assembly", skill: "Hardware Integration", defaultVirtue: "Gentleness", concept: "carefully fitting structural pieces together" },
    { title: "Power Supply Setup", skill: "Energy Flow & Circuits", defaultVirtue: "Faithfulness", concept: "connecting safe battery cables and voltage terminals" },
    { title: "Sensors & Inputs", skill: "Data Signal Sensing", defaultVirtue: "Goodness", concept: "wiring up temperature and motion sensors" },
    { title: "Logic & Programming", skill: "Block Code Logic", defaultVirtue: "Patience", concept: "snapping block code pieces together on a screen" },
    { title: "Teamwork & Collaboration", skill: "Cooperative Engineering", defaultVirtue: "Love", concept: "working alongside a mentor to assemble final parts" },
    { title: "Troubleshooting & Tuning", skill: "Diagnostic Testing", defaultVirtue: "Peace", concept: "calmly inspecting wire connections with a magnifying glass" },
    { title: "Helping Others", skill: "Community Impact", defaultVirtue: "Kindness", concept: "using the invention to deliver fresh water and help neighbors" },
    { title: "Celebration & Gratitude", skill: "Project Completion", defaultVirtue: "Joy", concept: "demonstrating the working build to family and friends" }
  ];

  const pages = [];

  // Generate Pages 1 through 10 (Story & Skill Steps)
  skillSteps.forEach((step, idx) => {
    const pageNum = idx + 1;
    const virtueObj = VIRTUES_MATRIX.find(v => v.name === (customVirtue || step.defaultVirtue)) || VIRTUES_MATRIX[idx % VIRTUES_MATRIX.length];
    const hiddenShapeObj = SEEK_AND_FIND_OBJECTS[idx % SEEK_AND_FIND_OBJECTS.length];
    
    const pageTitle = `Page ${pageNum}: ${step.title}`;
    const sceneConcept = `A child engaged in ${step.concept} for ${cleanTopic}`;
    const locationContext = "background elements, clouds, plants, and tool outlines";

    pages.push({
      pageNumber: pageNum,
      type: "story",
      title: pageTitle,
      technicalSkill: step.skill,
      virtue: virtueObj.name,
      narrative: `A visual scene teaching ${step.skill} while demonstrating ${virtueObj.name}.`,
      hiddenShape: hiddenShapeObj.name,
      hiddenCount: 3 + (pageNum % 3),
      locationContext,
      prompt: buildImageGenerationPrompt({
        sceneConcept,
        virtueName: virtueObj.name,
        hiddenShape: hiddenShapeObj.name,
        hiddenCount: 3 + (pageNum % 3),
        locationContext,
        ageRange: targetAge
      })
    });
  });

  // Page 11: Interactive Line-Art Maze / Puzzle Challenge
  const puzzleVirtue = VIRTUES_MATRIX[safeIssueNum % VIRTUES_MATRIX.length].name;
  const mazeHiddenShape = SEEK_AND_FIND_OBJECTS[(safeIssueNum + 1) % SEEK_AND_FIND_OBJECTS.length].name;
  pages.push({
    pageNumber: 11,
    type: "puzzle",
    title: `Page 11: Circuit Pathfinder Maze`,
    technicalSkill: "Logic Pathfinder & Algorithm Navigation",
    virtue: puzzleVirtue,
    narrative: `Help the young engineer guide the power signal through the circuit maze to activate the ${cleanTopic} central unit!`,
    hiddenShape: mazeHiddenShape,
    hiddenCount: 4,
    locationContext: "the maze wall turns and gear obstacles",
    prompt: buildImageGenerationPrompt({
      sceneConcept: `Interactive line art maze challenge guiding a power cable from Start to Finish for ${cleanTopic}`,
      virtueName: puzzleVirtue,
      hiddenShape: mazeHiddenShape,
      hiddenCount: 4,
      locationContext: "maze corner walls and gear icons",
      isMaze: true,
      ageRange: targetAge
    })
  });

  // Page 12: Hands-On Household STEM Project & Cumulative Master Blueprint Clue
  pages.push({
    pageNumber: 12,
    type: "stem-project",
    title: `Page 12: STEM Project & Master Blueprint Clue #${safeIssueNum}`,
    technicalSkill: `Hands-On Build: ${masterArcModule.stemProject}`,
    virtue: "Love",
    stemProjectDetails: {
      projectName: masterArcModule.stemProject,
      materials: ["Cardboard or craft sticks", "Aluminum foil", "Tape & scissors", "1.5V AA Battery & LED (optional)", "Paper cups"],
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
    narrative: `Build your hands-on household STEM project! Collect component #${safeIssueNum} of 12 for ${ANNUAL_MASTER_PROJECT.title}.`,
    hiddenShape: "Star of Hope",
    hiddenCount: 5,
    locationContext: "the project blueprint border and craft tools",
    prompt: buildImageGenerationPrompt({
      sceneConcept: `Child building hands-on STEM project '${masterArcModule.stemProject}' at desk with blueprint clue #${safeIssueNum} floating in background`,
      virtueName: "Love",
      hiddenShape: "Star of Hope",
      hiddenCount: 5,
      locationContext: "blueprint border and tool rack",
      ageRange: targetAge
    })
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
