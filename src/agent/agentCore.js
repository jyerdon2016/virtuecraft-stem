/**
 * VirtueTech AI - Browser & Node Autonomous Agent Core Logic
 */

import {
  sanitizeCopyrightText
} from "../engine/systemPrompts.js";

import {
  generateColoringBook
} from "../engine/coloringBookGenerator.js";

export const DEFAULT_TOPIC_QUEUE = [
  "How to Build a Robot",
  "How Solar Panels Work",
  "How Computer Coding Works",
  "How Water Filtration Works",
  "How Wind Turbines Generate Power",
  "How 3D Printers Create Objects"
];

export class VirtueTechAgentCore {
  constructor(options = {}) {
    this.queue = [...(options.queue || DEFAULT_TOPIC_QUEUE)];
    this.isCompleted = false;
    this.processedCount = 0;
    this.logs = [];
    this.apiKey = options.apiKey || "";
  }

  log(msg) {
    const timestamp = new Date().toISOString().split("T")[1].slice(0, 8);
    const formatted = `[${timestamp}] [Agent Loop] ${msg}`;
    this.logs.push(formatted);
    console.log(formatted);
  }

  /**
   * Run one cycle of the agent loop for the next queued topic
   */
  async runNextCycle() {
    if (this.queue.length === 0) {
      this.log("Task queue empty. Agent loop completed.");
      this.isCompleted = true;
      return null;
    }

    const rawTopic = this.queue.shift();
    this.log(`1. OBSERVE: Processing target topic '${rawTopic}'`);

    // 2. SANITIZE
    const { sanitizedText: cleanTopic, replacedIPs } = sanitizeCopyrightText(rawTopic);
    if (replacedIPs.length > 0) {
      this.log(`2. SANITIZE: Replaced protected IPs: ${replacedIPs.map(r => `${r.from} -> ${r.to}`).join(", ")}`);
    } else {
      this.log(`2. SANITIZE: Topic is clean and copyright-safe.`);
    }

    // 3. SEQUENCE 12-ISSUE ANNUAL ARC
    this.log(`3. SEQUENCE: Generating 12-Issue Annual Series for '${cleanTopic}'`);
    const fullSeries = [];

    for (let issueNum = 1; issueNum <= 12; issueNum++) {
      const issueData = generateColoringBook(cleanTopic, issueNum, "4-9 years");

      if (this.apiKey) {
        try {
          this.log(`3.1 GEMINI API: Calling Gemini 2.5 Flash for Issue #${issueNum}...`);
          const apiNote = await fetchGeminiSynthesis(this.apiKey, cleanTopic, issueNum);
          if (apiNote) issueData.aiNote = apiNote;
        } catch (err) {
          this.log(`3.1 GEMINI API Notice: Using local rule engine (${err.message})`);
        }
      }

      fullSeries.push(issueData);
    }

    // 4. SYNTHESIZE & RENDER
    this.log(`4. SYNTHESIZE: Rendered 12 vector SVG mazes, seek-and-find directives & STEM blueprints.`);

    this.processedCount++;
    return {
      topic: cleanTopic,
      series: fullSeries,
      totalIssues: fullSeries.length
    };
  }

  async runAll() {
    this.log("Starting Autonomous Agent Loop...");
    const results = [];
    while (!this.isCompleted && this.queue.length > 0) {
      const res = await this.runNextCycle();
      if (res) results.push(res);
    }
    this.log(`Autonomous Agent Loop Finished! Processed ${this.processedCount} topics.`);
    return results;
  }
}

async function fetchGeminiSynthesis(apiKey, topic, issueNum) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const promptText = `Refine technical skill and virtue coloring book step for topic '${topic}', Issue #${issueNum}. Provide 1 concise sentence.`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }]
    })
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}
