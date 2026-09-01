/**
 * VirtueTech AI - Coloring Book Generator Engine
 * 
 * Generates 10-12 page child-friendly technical skill coloring books with
 * Christian virtue integration, copyright sanitization, seek-and-find directives,
 * and line art image generator prompts.
 */

import {
  sanitizeCopyrightText,
  VIRTUES_MATRIX,
  SEEK_AND_FIND_OBJECTS,
  buildImageGenerationPrompt
} from "./systemPrompts.js";

// Pre-packaged curated narrative blueprints for immediate high-quality generation
export const CURATED_BOOKS = {
  "robotics": {
    topic: "How to Build a Robot",
    subtitle: "A Kid's Guide to Circuits, Sensors, and Kindness",
    targetAge: "6-12 years",
    archetype: "Heroic Helper Bot",
    pages: [
      {
        pageNumber: 1,
        title: "Page 1: The Blueprint (Planning)",
        technicalSkill: "Engineering Design & Blueprints",
        virtue: "Patience",
        narrative: "A young child carefully sketching circuit diagrams and robot dimensions at a tidy workbench.",
        hiddenShape: "Cross-my-heart",
        hiddenCount: 3,
        locationContext: "the crumpled paper, pencil holder, and cloud-shaped blueprint bubbles",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "A child carefully drawing a robot blueprint at a workbench with ruler, pencils, and paper",
          archetype: "Heroic Helper Bot on the drawing sheet",
          virtueName: "Patience",
          hiddenShape: "Cross-my-heart",
          hiddenCount: 3,
          locationContext: "crumpled paper and blueprint clouds"
        })
      },
      {
        pageNumber: 2,
        title: "Page 2: The Brain (ESP32 Microcontroller)",
        technicalSkill: "Microcontrollers & Processing",
        virtue: "Goodness",
        narrative: "An oversized, friendly ESP32 microchip character with a big smile, showing pins for thinking and logic.",
        hiddenShape: "Star of Hope",
        hiddenCount: 4,
        locationContext: "the background circuit traces and corner power gears",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "An oversized, friendly ESP32 microcontroller with a happy face, explaining how robots process thoughts",
          archetype: "Heroic Helper Bot brain",
          virtueName: "Goodness",
          hiddenShape: "Star of Hope",
          hiddenCount: 4,
          locationContext: "circuit board traces and background gears"
        })
      },
      {
        pageNumber: 3,
        title: "Page 3: The Senses (Sensors & Feedback)",
        technicalSkill: "Temperature & Motion Sensing",
        virtue: "Gentleness",
        narrative: "Gently plugging a DHT11 temperature sensor and motion sensor into a breadboard.",
        hiddenShape: "Cross-my-heart",
        hiddenCount: 3,
        locationContext: "leaves outside the window and wire loops",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "Wiring up a simple DHT11 temperature sensor and motion sensor into a breadboard with soft hands",
          archetype: "Friendly Helper Bot",
          virtueName: "Gentleness",
          hiddenShape: "Cross-my-heart",
          hiddenCount: 3,
          locationContext: "window leaves and jumper wire loops"
        })
      },
      {
        pageNumber: 4,
        title: "Page 4: The Voice (Audio Speaker)",
        technicalSkill: "Audio Amplification (PAM8403)",
        virtue: "Joy",
        narrative: "Connecting a PAM8403 amplifier and small speaker so the robot can speak cheerful words.",
        hiddenShape: "Ichthys Fish",
        hiddenCount: 5,
        locationContext: "soundwave bubbles floating in the air",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "Connecting a small audio amplifier PAM8403 and speaker, showing musical notes and cheerful speech bubbles",
          archetype: "Smiling Helper Bot",
          virtueName: "Joy",
          hiddenShape: "Ichthys Fish",
          hiddenCount: 5,
          locationContext: "soundwaves and background wall art"
        })
      },
      {
        pageNumber: 5,
        title: "Page 5: Teamwork & Safety (Soldering)",
        technicalSkill: "Safe Soldering & Tool Safety",
        virtue: "Love",
        narrative: "A child wearing safety goggles soldering a joint side-by-side with a caring parent or mentor.",
        hiddenShape: "Cross-my-heart",
        hiddenCount: 3,
        locationContext: "the wisps of solder smoke and tool rack",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "A child and mentor wearing safety glasses soldering wires together safely at a lighted desk",
          archetype: "Mighty Rescue Pig toy on the shelf",
          virtueName: "Love",
          hiddenShape: "Cross-my-heart",
          hiddenCount: 3,
          locationContext: "smoke wisps and background tools"
        })
      },
      {
        pageNumber: 6,
        title: "Page 6: The Muscles (Servo Motors)",
        technicalSkill: "Electromechanics & Actuators",
        virtue: "Self-Control",
        narrative: "Mounting small servo motors to control robot arms with controlled, precise movements.",
        hiddenShape: "Anchor of Peace",
        hiddenCount: 3,
        locationContext: "the mechanical gears and motor casing",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "Installing small servo motors onto a robot frame to allow smooth, controlled arm movements",
          archetype: "Heroic Helper Bot",
          virtueName: "Self-Control",
          hiddenShape: "Anchor of Peace",
          hiddenCount: 3,
          locationContext: "gears and workbench background"
        })
      },
      {
        pageNumber: 7,
        title: "Page 7: The Energy (Clean Battery Power)",
        technicalSkill: "DC Voltage & Power Management",
        virtue: "Faithfulness",
        narrative: "Connecting a rechargeable battery pack with clear positive and negative wire markings.",
        hiddenShape: "Star of Hope",
        hiddenCount: 4,
        locationContext: "energy spark bubbles and battery label patterns",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "Connecting a battery power supply with + and - signs glowing softly, teaching reliable energy flow",
          archetype: "Helper Bot",
          virtueName: "Faithfulness",
          hiddenShape: "Star of Hope",
          hiddenCount: 4,
          locationContext: "sparkles and cable curls"
        })
      },
      {
        pageNumber: 8,
        title: "Page 8: The Instructions (Coding Logic)",
        technicalSkill: "Block Coding & Algorithms",
        virtue: "Patience",
        narrative: "Typing simple IF-THEN code blocks on a laptop screen to give the robot commands.",
        hiddenShape: "Cross-my-heart",
        hiddenCount: 3,
        locationContext: "code block shapes floating above the screen",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "A child snapping block-code puzzle pieces together on a computer screen to send commands to a robot",
          archetype: "Helper Bot",
          virtueName: "Patience",
          hiddenShape: "Cross-my-heart",
          hiddenCount: 3,
          locationContext: "code block bubbles and desk plants"
        })
      },
      {
        pageNumber: 9,
        title: "Page 9: Troubleshooting (Grace under Pressure)",
        technicalSkill: "Debugging & Fault Testing",
        virtue: "Peace",
        narrative: "Checking a loose wire calmly when the motor doesn't spin at first, smiling with confidence.",
        hiddenShape: "Anchor of Peace",
        hiddenCount: 3,
        locationContext: "the peaceful window clouds outside",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "A child calmly examining a circuit wire with a magnifying glass, remaining peaceful during testing",
          archetype: "Helper Bot",
          virtueName: "Peace",
          hiddenShape: "Anchor of Peace",
          hiddenCount: 3,
          locationContext: "window clouds and wallpaper patterns"
        })
      },
      {
        pageNumber: 10,
        title: "Page 10: The Helping Hand (Serving Others)",
        technicalSkill: "Practical Application & Robotics Use",
        virtue: "Kindness",
        narrative: "The finished robot delivering a glass of water or carrying heavy books for an elderly neighbor.",
        hiddenShape: "Cross-my-heart",
        hiddenCount: 4,
        locationContext: "flower pots and garden bushes",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "A friendly rolling robot gently bringing a flower and water tray to an elderly person in a garden",
          archetype: "Heroic Helper Bot",
          virtueName: "Kindness",
          hiddenShape: "Cross-my-heart",
          hiddenCount: 4,
          locationContext: "garden leaves and cloud formations"
        })
      },
      {
        pageNumber: 11,
        title: "Page 11: Rebuilding Together (Forgiveness)",
        technicalSkill: "Maintenance & Structural Repair",
        virtue: "Forgiveness",
        narrative: "Two kids smiling and high-fiving after accidentally bumping the robot, working together to fix a joint.",
        hiddenShape: "Ichthys Fish",
        hiddenCount: 4,
        locationContext: "carpet patterns and sunbeams",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "Two children high-fiving and smiling as they re-attach a robot arm together after dropping it",
          archetype: "Magical Forest Elf doll nearby",
          virtueName: "Forgiveness",
          hiddenShape: "Ichthys Fish",
          hiddenCount: 4,
          locationContext: "sunbeams and rug details"
        })
      },
      {
        pageNumber: 12,
        title: "Page 12: Celebration & Giving Thanks",
        technicalSkill: "Project Completion & Presentation",
        virtue: "Joy",
        narrative: "The whole family and community clapping as the robot displays its friendly heart LED lights.",
        hiddenShape: "Star of Hope",
        hiddenCount: 5,
        locationContext: "confetti streamers and light beams",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "A happy child demonstrating their completed working robot to cheering family and friends with lit LEDs",
          archetype: "Heroic Helper Bot",
          virtueName: "Joy",
          hiddenShape: "Star of Hope",
          hiddenCount: 5,
          locationContext: "celebration streamers and background banners"
        })
      }
    ]
  },
  "solar": {
    topic: "How Solar Power Works",
    subtitle: "Harnessing God's Sunbeams with Photovoltaic Energy",
    targetAge: "6-12 years",
    archetype: "Sunbeam Explorer",
    pages: [
      {
        pageNumber: 1,
        title: "Page 1: The Light Source",
        technicalSkill: "Solar Radiation & Photons",
        virtue: "Joy",
        narrative: "Sunlight shining down brightly over a green meadow, illustrating photon energy.",
        hiddenShape: "Cross-my-heart",
        hiddenCount: 3,
        locationContext: "fluffy sunlit clouds",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "Sunbeams beaming warmly down onto green hills and flowers, depicting solar photons",
          virtueName: "Joy",
          hiddenShape: "Cross-my-heart",
          hiddenCount: 3,
          locationContext: "clouds and flower petals"
        })
      },
      {
        pageNumber: 2,
        title: "Page 2: Silicon Crystals (The Cell)",
        technicalSkill: "Photovoltaic Silicon Wafers",
        virtue: "Patience",
        narrative: "Examining a grid of dark silicon solar cells with silver conductor lines.",
        hiddenShape: "Star of Hope",
        hiddenCount: 3,
        locationContext: "grid intersections and leaves",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "A child looking closely through a magnifying glass at a shiny solar panel silicon wafer grid",
          virtueName: "Patience",
          hiddenShape: "Star of Hope",
          hiddenCount: 3,
          locationContext: "panel grid lines and tree branches"
        })
      },
      {
        pageNumber: 3,
        title: "Page 3: Electron Flow (Clean Electricity)",
        technicalSkill: "Direct Current (DC) Electricity",
        virtue: "Goodness",
        narrative: "Happy little electron characters marching through copper wires when sunlight hits.",
        hiddenShape: "Cross-my-heart",
        hiddenCount: 4,
        locationContext: "wire loops and background grass",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "Friendly simplified electron characters holding hands and moving along copper wire paths",
          virtueName: "Goodness",
          hiddenShape: "Cross-my-heart",
          hiddenCount: 4,
          locationContext: "wire insulation curves and leaves"
        })
      },
      {
        pageNumber: 4,
        title: "Page 4: The Charge Controller",
        technicalSkill: "Voltage Regulation & Protection",
        virtue: "Self-Control",
        narrative: "A charge controller keeping battery voltage steady and safe from overcharging.",
        hiddenShape: "Anchor of Peace",
        hiddenCount: 3,
        locationContext: "meter dials and equipment housing",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "A cheerful digital meter display showing safe green voltage levels on a solar charge controller",
          virtueName: "Self-Control",
          hiddenShape: "Anchor of Peace",
          hiddenCount: 3,
          locationContext: "dial markings and wall tiles"
        })
      },
      {
        pageNumber: 5,
        title: "Page 5: Storing Light (Battery Bank)",
        technicalSkill: "Chemical Energy Storage",
        virtue: "Faithfulness",
        narrative: "Storing extra solar power in rechargeable batteries for night-time lighting.",
        hiddenShape: "Star of Hope",
        hiddenCount: 4,
        locationContext: "battery terminals and background stars",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "Stacking neat solar storage battery packs in a clean workshop ready for evening light",
          virtueName: "Faithfulness",
          hiddenShape: "Star of Hope",
          hiddenCount: 4,
          locationContext: "night sky stars through the window"
        })
      },
      {
        pageNumber: 6,
        title: "Page 6: The Inverter (DC to AC)",
        technicalSkill: "Alternating Current Conversion",
        virtue: "Peace",
        narrative: "Converting DC battery power into AC electricity for household lamps.",
        hiddenShape: "Cross-my-heart",
        hiddenCount: 3,
        locationContext: "sine wave graphics on screen",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "An inverter box smoothly converting direct current into alternating current sine waves",
          virtueName: "Peace",
          hiddenShape: "Cross-my-heart",
          hiddenCount: 3,
          locationContext: "waveforms and wallpaper line patterns"
        })
      },
      {
        pageNumber: 7,
        title: "Page 7: Lighting the Home",
        technicalSkill: "Efficient LED Illumination",
        virtue: "Kindness",
        narrative: "A solar-powered lamp illuminating a cozy living room where family reads books together.",
        hiddenShape: "Ichthys Fish",
        hiddenCount: 4,
        locationContext: "lamp light rays and bookshelf shadows",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "A warm solar light fixture glowing gently over a family reading stories on a couch",
          virtueName: "Kindness",
          hiddenShape: "Ichthys Fish",
          hiddenCount: 4,
          locationContext: "light rays and book spine art"
        })
      },
      {
        pageNumber: 8,
        title: "Page 8: Pumping Fresh Water",
        technicalSkill: "Solar Motor Water Pumps",
        virtue: "Love",
        narrative: "Solar power running a water pump to irrigate community crops and give animals water.",
        hiddenShape: "Cross-my-heart",
        hiddenCount: 3,
        locationContext: "water splashes and tree leaves",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "A solar panel powering a water pump that fills a trough for sheep and waters garden vegetables",
          virtueName: "Love",
          hiddenShape: "Cross-my-heart",
          hiddenCount: 3,
          locationContext: "water droplet splashes and foliage"
        })
      },
      {
        pageNumber: 9,
        title: "Page 9: Caring for Creation",
        technicalSkill: "Renewable Clean Energy Impacts",
        virtue: "Gentleness",
        narrative: "Birds and butterflies flying peacefully near rooftop solar panels without smoke.",
        hiddenShape: "Star of Hope",
        hiddenCount: 4,
        locationContext: "cloud edges and rooftop tiles",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "Clean blue sky with swallows and butterflies flying around a solar panel roof, zero pollution",
          virtueName: "Gentleness",
          hiddenShape: "Star of Hope",
          hiddenCount: 4,
          locationContext: "clouds and roof tile patterns"
        })
      },
      {
        pageNumber: 10,
        title: "Page 10: Sharing Power (Community Grid)",
        technicalSkill: "Microgrid Energy Distribution",
        virtue: "Generosity",
        narrative: "Neighbors connecting simple power lines to share excess solar power with a school.",
        hiddenShape: "Anchor of Peace",
        hiddenCount: 3,
        locationContext: "power line poles and hill slopes",
        prompt: buildImageGenerationPrompt({
          sceneConcept: "Kids and villagers installing simple solar lighting posts at a community schoolyard",
          virtueName: "Kindness",
          hiddenShape: "Anchor of Peace",
          hiddenCount: 3,
          locationContext: "utility posts and distant hills"
        })
      }
    ]
  }
};

/**
 * Generate a dynamic 10-12 page coloring book for any given topic
 */
export function generateColoringBook(rawTopic, targetAge = "6-12 years", customVirtue = "") {
  // 1. Sanitize Topic & input prompt for copyright violations
  const { sanitizedText: cleanTopic, replacedIPs } = sanitizeCopyrightText(rawTopic);

  // Check if we have a curated exact match
  const lowerKey = cleanTopic.toLowerCase();
  if (lowerKey.includes("robot")) {
    return { ...CURATED_BOOKS.robotics, replacedIPs };
  } else if (lowerKey.includes("solar") || lowerKey.includes("sun")) {
    return { ...CURATED_BOOKS.solar, replacedIPs };
  }

  // Generate dynamic 10-page book structure
  const pages = [];
  const skillSteps = [
    { title: "Planning & Design", skill: "System Architecture", defaultVirtue: "Patience", concept: "drawing plans and setting clear goals at a organized desk" },
    { title: "Safety & Gear", skill: "Personal Protection Equipment", defaultVirtue: "Self-Control", concept: "putting on protective goggles and gathering tools neatly" },
    { title: "Core Component Assembly", skill: "Hardware Integration", defaultVirtue: "Gentleness", concept: "carefully fitting the main structural pieces together" },
    { title: "Power Supply Setup", skill: "Energy Flow & Circuits", defaultVirtue: "Faithfulness", concept: "connecting safe power cables and checking positive/negative terminals" },
    { title: "Sensors & Inputs", skill: "Data Signal Acquisition", defaultVirtue: "Goodness", concept: "wiring up inputs to let the system observe its environment" },
    { title: "Logic & Programming", skill: "Algorithmic Rules", defaultVirtue: "Patience", concept: "writing clear step-by-step logic rules on a screen" },
    { title: "Teamwork & Collaboration", skill: "Cooperative Engineering", defaultVirtue: "Love", concept: "working alongside a friend or mentor to assemble final parts" },
    { title: "Troubleshooting & Calibration", skill: "Diagnostic Testing", defaultVirtue: "Peace", concept: "calmly testing connections and adjusting dials until smooth" },
    { title: "Helping Others", skill: "Practical Benefit", defaultVirtue: "Kindness", concept: "using the completed invention to help people and care for nature" },
    { title: "Celebration & Community", skill: "Completion & Sharing", defaultVirtue: "Joy", concept: "demonstrating the working build to smiling family and friends" }
  ];

  skillSteps.forEach((step, idx) => {
    const pageNum = idx + 1;
    const virtueObj = VIRTUES_MATRIX.find(v => v.name === (customVirtue || step.defaultVirtue)) || VIRTUES_MATRIX[idx % VIRTUES_MATRIX.length];
    const hiddenShapeObj = SEEK_AND_FIND_OBJECTS[idx % SEEK_AND_FIND_OBJECTS.length];
    
    const pageTitle = `Page ${pageNum}: ${step.title}`;
    const sceneConcept = `A child engaged in ${step.concept} for ${cleanTopic}`;
    const locationContext = "background elements, clouds, plants, and tool outlines";

    pages.push({
      pageNumber: pageNum,
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
        locationContext
      })
    });
  });

  return {
    topic: cleanTopic,
    subtitle: `A Children's Technical Guide to ${cleanTopic}`,
    targetAge,
    replacedIPs,
    pages
  };
}
