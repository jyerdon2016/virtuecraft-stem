/**
 * VirtueCraft STEM - Node.js CLI Agent Loop Runner & File Exporter
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VirtueTechAgentCore, DEFAULT_TOPIC_QUEUE } from "./agentCore.js";
import { renderPageSVG } from "../engine/lineArtRenderer.js";
import { generateColoringBook } from "../engine/coloringBookGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.resolve(__dirname, "../../output/books");

export class VirtueTechCLIAgentLoop extends VirtueTechAgentCore {
  constructor(options = {}) {
    super(options);
  }

  async runNextCycle() {
    const result = await super.runNextCycle();
    if (!result) return null;

    // Export to Disk
    const exportInfo = this.exportToDisk(result.topic, result.series);
    this.log(`5. EXPORT: Successfully saved series artifacts to '${exportInfo.filePath}'`);
    return { ...result, ...exportInfo };
  }

  exportToDisk(topic, series) {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const safeFilename = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const jsonPath = path.join(OUTPUT_DIR, `${safeFilename}-series.json`);
    const htmlPath = path.join(OUTPUT_DIR, `${safeFilename}-printable.html`);

    fs.writeFileSync(jsonPath, JSON.stringify(series, null, 2), "utf8");
    fs.writeFileSync(htmlPath, buildPrintableBundleHtml(topic, series), "utf8");

    // Also export Year 1 Issue #1 Standalone Dedicated 12-Page Printable Package
    if (series.length > 0) {
      const issue1 = series[0]; // Issue #1
      const year1Issue1Path = path.join(OUTPUT_DIR, "year1-issue1-robotics-printable.html");
      fs.writeFileSync(year1Issue1Path, buildSingleIssuePrintableHtml(issue1), "utf8");
    }

    return { filePath: htmlPath, jsonPath };
  }
}

/**
 * Renders a full 12-page printable SVG document for a single issue (Year 1 Issue #1)
 */
export function buildSingleIssuePrintableHtml(issue) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year 1 Issue #1: ${escapeXml(issue.topic)} - Complete 12-Page Printable Issue</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #0f172a; padding: 2rem; }
    .container { max-width: 800px; margin: 0 auto; }
    .header-banner { text-align: center; background: #ffffff; border: 2px stroke #1e40af; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .header-banner h1 { font-family: 'Outfit', sans-serif; font-size: 2rem; color: #1e40af; margin-bottom: 0.25rem; }
    .header-banner p { color: #0d9488; font-weight: 600; font-size: 1rem; }
    .meta-badges { display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.75rem; flex-wrap: wrap; }
    .badge { font-size: 0.8rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 12px; font-family: 'Outfit', sans-serif; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-teal { background: #ccfbf1; color: #0f766e; }
    .badge-gold { background: #fef3c7; color: #92400e; }
    
    .page-sheet { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 1rem; margin-bottom: 2.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
    .page-sheet svg { width: 100%; height: auto; display: block; }
    
    @media print {
      body { background: white !important; padding: 0 !important; }
      .header-banner { display: none !important; }
      .page-sheet { border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; page-break-after: always; height: 100vh; display: flex; justify-content: center; align-items: center; }
      .page-sheet svg { max-height: 98vh !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-banner">
      <h1>🎨 VirtueCraft STEM: Year 1 Issue #1</h1>
      <p>${escapeXml(issue.topic)} — ${escapeXml(issue.subtitle)}</p>
      <div class="meta-badges">
        <span class="badge badge-blue">Ages 4-9</span>
        <span class="badge badge-teal">10 Virtues Integrated</span>
        <span class="badge badge-gold">Page 11: Circuit Pathfinder Maze</span>
        <span class="badge badge-blue">Page 12: STEM Project & Master Blueprint Clue #1</span>
      </div>
    </div>

    <!-- Render All 12 Full Vector SVG Pages -->
    ${issue.pages.map(page => {
      const { svgHtml } = renderPageSVG(page);
      return `<div class="page-sheet">${svgHtml}</div>`;
    }).join("\n")}
  </div>
</body>
</html>`;
}

function buildPrintableBundleHtml(topic, series) {
  return buildSingleIssuePrintableHtml(series[0]);
}

function escapeXml(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// CLI Execution Entry Point
if (process.argv[1] && process.argv[1].endsWith("agentLoop.js")) {
  const runner = new VirtueTechCLIAgentLoop();
  runner.runAll();
}
