/**
 * VirtueTech AI - Multi-Agent Orchestrator (Manager Agent)
 * 
 * Delegating specialized tasks to subagents:
 *   1. Storyboard & Narrative Architect Subagent (storyboardAgent.js)
 *   2. Prompt Engineering Subagent (promptAgent.js)
 *   3. Vector Art & Interactive SVG Subagent (vectorArtAgent.js)
 *   4. Ad Monetization & Revenue Subagent (monetizationAgent.js)
 *   5. Commercial KDP & Print Packaging Subagent (packagingAgent.js)
 */

import { StoryboardAgent, RANDOM_PROMPT_IDEAS } from "./storyboardAgent.js";
import { PromptAgent } from "./promptAgent.js";
import { VectorArtAgent } from "./vectorArtAgent.js";
import { MonetizationAgent } from "./monetizationAgent.js";
import { PackagingAgent } from "./packagingAgent.js";

export const DEFAULT_TOPIC_QUEUE = [
  "Friendly Robot Building a Treehouse",
  "Astronaut Bunny Exploring Mars",
  "Deep Sea Ocean Submersible Exploration",
  "Little Mechanical Fox Repairing Forest Toys",
  "Baby Dinosaur Finding Ancient Constellations",
  "Solar Powered Race Car Championship"
];

export class VirtueTechAgentCore {
  constructor(options = {}) {
    this.queue = [...(options.queue || DEFAULT_TOPIC_QUEUE)];
    this.isCompleted = false;
    this.processedCount = 0;
    this.logs = [];
    this.logFn = options.logFn || null;

    // Initialize Specialized Subagents
    this.storyboardAgent = new StoryboardAgent();
    this.promptAgent = new PromptAgent();
    this.vectorArtAgent = new VectorArtAgent();
    this.monetizationAgent = new MonetizationAgent();
    this.packagingAgent = new PackagingAgent();
  }

  log(subagent, msg) {
    const timestamp = new Date().toISOString().split("T")[1].slice(0, 8);
    const formatted = `[${timestamp}] [${subagent}] ${msg}`;
    this.logs.push(formatted);
    if (this.logFn) {
      this.logFn(formatted);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Run one complete multi-agent cycle for the next queued topic
   */
  async runNextCycle() {
    if (this.queue.length === 0) {
      this.log("Manager Agent", "Task queue empty. All delegated subagent jobs finished.");
      this.isCompleted = true;
      return null;
    }

    const rawTopic = this.queue.shift();
    this.log("Manager Agent", `Delegating project '${rawTopic}' across subagent hierarchy...`);

    // 1. DELEGATE TO STORYBOARD AGENT
    this.log("Storyboard Subagent", `Generating 12-page narrative arc & moral virtue integration for '${rawTopic}'...`);
    const bookData = this.storyboardAgent.generate12PageStoryboard({
      topic: rawTopic,
      purpose: "commercial",
      targetAge: "4-9 years",
      artStyle: "Bold Line Art"
    });

    // 2. DELEGATE TO PROMPT ENGINEERING AGENT
    this.log("Prompt Subagent", `Formulating locked SDXL/Flux diffusion prompts & negative prompt filters...`);
    bookData.pages.forEach(page => {
      const prompts = this.promptAgent.generatePagePrompts(page, bookData);
      page.prompt = prompts.positivePrompt;
      page.negativePrompt = prompts.negativePrompt;
      page.overlayDirective = prompts.overlayDirective;
    });

    // 3. DELEGATE TO VECTOR ART AGENT
    this.log("Vector Art Subagent", `Synthesizing 12 high-contrast binary SVGs with .colorable-region targets...`);
    const renderedSvgs = [];
    bookData.pages.forEach(page => {
      const { svgHtml } = this.vectorArtAgent.renderPageSVG(page, bookData);
      page.svgHtml = svgHtml;
      renderedSvgs.push(svgHtml);
    });

    // 4. DELEGATE TO MONETIZATION AGENT ($1.00 per 12 Pages Target)
    this.log("Monetization Subagent", `Simulating 12-page click-through ad impressions (Leaderboard + Sidebar + Footer)...`);
    for (let i = 0; i < 12; i++) {
      this.monetizationAgent.recordPageClickThrough(i);
    }
    this.monetizationAgent.recordRewardedVideoCompletion();
    const revSummary = this.monetizationAgent.getRevenueSummary();
    this.log("Monetization Subagent", `Revenue Target Achieved: $${revSummary.totalSessionRevenue.toFixed(2)} generated across 12 pages ($0.083/page rate).`);

    // 5. DELEGATE TO PACKAGING AGENT (Amazon KDP & License)
    this.log("Packaging Subagent", `Generating Amazon KDP 8.5x11 PDF layout & Commercial Resale Rights Certificate...`);
    const printableHtml = this.packagingAgent.generatePrintableBookPackage(bookData, renderedSvgs);
    const licenseHtml = this.packagingAgent.generateCommercialLicense(bookData);

    this.processedCount++;
    this.log("Manager Agent", `Successfully compiled Issue #${this.processedCount}: '${bookData.title}'.`);

    return {
      bookData,
      renderedSvgs,
      printableHtml,
      licenseHtml,
      revSummary
    };
  }

  async runAll() {
    this.log("Manager Agent", "Starting Autonomous Multi-Agent Orchestration Loop...");
    const results = [];
    while (!this.isCompleted && this.queue.length > 0) {
      const res = await this.runNextCycle();
      if (res) results.push(res);
    }
    this.log("Manager Agent", `Autonomous Multi-Agent Loop Completed! Finished ${this.processedCount} books.`);
    return results;
  }
}

export {
  StoryboardAgent,
  PromptAgent,
  VectorArtAgent,
  MonetizationAgent,
  PackagingAgent,
  RANDOM_PROMPT_IDEAS
};
