/**
 * Prompt Engineering Subagent
 * 
 * Translates narrative story steps and user concepts into locked diffusion
 * and vector prompts suitable for SDXL, Flux, Midjourney v6, and SVG vectorizers.
 * Enforces single focal point subjects, chunky line-art weights, and copyright archetypes.
 */

import {
  sanitizeCopyrightText,
  LOCKED_NEGATIVE_PROMPT
} from "../engine/systemPrompts.js";

export class PromptAgent {
  constructor() {
    this.agentName = "Prompt Engineering Subagent";
    this.version = "2.0";
  }

  /**
   * Synthesize locked positive & negative prompts for a coloring book page
   */
  generatePagePrompts(pageData, bookOptions = {}) {
    const rawAction = pageData.actionPrompt || pageData.title;
    const { sanitizedText: cleanAction, replacedIPs } = sanitizeCopyrightText(rawAction);
    
    const targetAge = bookOptions.targetAge || "4-9 years";
    const artStyle = bookOptions.artStyle || "Bold Line Art";
    const isCommercial = bookOptions.purpose === "commercial";

    let styleMod = "thick black contour lines, crisp white background, chunky vector styling, zero shading";
    if (artStyle === "Chunky Outline") {
      styleMod = "ultra-thick 8px black outlines, minimal simple shapes, preschool toddler coloring page, bold clean silhouettes, no fine lines";
    } else if (artStyle === "Kawaii Chibi") {
      styleMod = "kawaii chibi aesthetic, cute round proportions, big expressive eyes, adorable clean line art, charming sticker book look";
    } else if (artStyle === "Steampunk Blueprint") {
      styleMod = "technical line-art blueprint, vintage clockwork gears, clean mechanical schematics, black binary line art";
    } else if (artStyle === "Detailed Vector") {
      styleMod = "intricate clean vector line art, mindful coloring book, fine balanced contours, crisp botanical or geometric details";
    }

    const ageModifier = targetAge.includes("3-5")
      ? "calibrated for toddlers ages 3-5, large coloring areas, simple bold shapes"
      : "calibrated for children ages 4-9, single prominent focal character, bold enclosed outlines";

    const commercialTag = isCommercial
      ? "Amazon KDP coloring book interior page, 8.5x11 aspect ratio, clean white margins, print-on-demand 300 DPI ready"
      : "personalized children's coloring page, high contrast, clean printable line art";

    const positivePrompt = [
      `Clean children's coloring book page of ${cleanAction}`,
      styleMod,
      `bold thick black outlines`,
      `clean line art`,
      `pure white background`,
      `kid-friendly cartoon illustration`,
      `wide open coloring areas`,
      `no shading`,
      `no color`,
      `no gradients`,
      `high contrast`,
      commercialTag
    ].join(", ");

    const negativePrompt = LOCKED_NEGATIVE_PROMPT;

    return {
      positivePrompt,
      negativePrompt,
      cleanAction,
      replacedIPs,
      overlayDirective: `Embed ${pageData.hiddenCount || 3} subtle stamped '${pageData.hiddenShape || "Star of Hope"}' shapes seamlessly into background lines.`
    };
  }

  /**
   * Generates a direct AI diffusion image URL using Flux / SDXL for instant browser rendering
   */
  buildDiffusionImageUrl(positivePrompt, seed = 42) {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(positivePrompt)}?width=600&height=800&nologo=true&seed=${seed}`;
  }
}
