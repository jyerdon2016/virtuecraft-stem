/**
 * VirtueCraft STEM - Node.js CLI Agent Loop Runner & File Exporter
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VirtueTechAgentCore, DEFAULT_TOPIC_QUEUE } from "./agentCore.js";
import { renderPageSVG } from "../engine/lineArtRenderer.js";

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
    fs.writeFileSync(htmlPath, buildSingleIssuePrintableHtml(series[0]), "utf8");

    if (series.length > 0) {
      const issue1 = series[0];
      const year1Issue1Path = path.join(OUTPUT_DIR, "year1-issue1-robotics-printable.html");
      fs.writeFileSync(year1Issue1Path, buildSingleIssuePrintableHtml(issue1), "utf8");
    }

    return { filePath: htmlPath, jsonPath };
  }
}

/**
 * Renders a full high-end 12-page magazine printable issue
 */
export function buildSingleIssuePrintableHtml(issue) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VirtueCraft STEM Magazine - Issue #1: ${escapeXml(issue.topic)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #0f172a; padding: 2rem; }
    .container { max-width: 900px; margin: 0 auto; }
    
    .magazine-header { text-align: center; background: #ffffff; border: 3px solid #1e40af; padding: 2rem; border-radius: 16px; margin-bottom: 2.5rem; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
    .magazine-masthead { font-family: 'Outfit', sans-serif; font-size: 2.4rem; font-weight: 800; color: #1e40af; letter-spacing: -0.02em; text-transform: uppercase; }
    .magazine-subhead { color: #0d9488; font-weight: 700; font-size: 1.1rem; margin-top: 0.25rem; }
    .meta-badges { display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap; }
    .badge { font-size: 0.85rem; font-weight: 700; padding: 0.35rem 0.85rem; border-radius: 20px; font-family: 'Outfit', sans-serif; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-teal { background: #ccfbf1; color: #0f766e; }
    .badge-gold { background: #fef3c7; color: #92400e; }
    
    .magazine-page-card { background: #ffffff; border: 2px solid #cbd5e1; border-radius: 16px; overflow: hidden; margin-bottom: 3rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
    .magazine-page-header { background: #f1f5f9; padding: 1.25rem 1.5rem; border-bottom: 2px solid #cbd5e1; display: flex; justify-content: space-between; align-items: center; }
    .magazine-page-header h2 { font-family: 'Outfit', sans-serif; font-size: 1.35rem; color: #1e40af; }
    
    .magazine-page-content { padding: 1.5rem; }
    .svg-wrapper { text-align: center; margin-bottom: 1.5rem; }
    .svg-wrapper svg { width: 100%; height: auto; max-height: 750px; }
    
    .editorial-narrative-box { background: #f8fafc; border-left: 5px solid #0d9488; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .editorial-title { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 800; color: #0d9488; margin-bottom: 0.5rem; }
    .editorial-paragraph { font-size: 1rem; line-height: 1.7; color: #334155; }
    
    @media print {
      body { background: white !important; padding: 0 !important; }
      .magazine-header { display: none !important; }
      .magazine-page-card { border: none !important; box-shadow: none !important; margin: 0 !important; page-break-after: always; height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
      .svg-wrapper svg { max-height: 70vh !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="magazine-header">
      <div class="magazine-masthead">VirtueCraft STEM Magazine</div>
      <div class="magazine-subhead">Year 1 Issue #1: ${escapeXml(issue.topic)} — ${escapeXml(issue.subtitle)}</div>
      <div class="meta-badges">
        <span class="badge badge-blue">Ages 4-9</span>
        <span class="badge badge-teal">10 Christian Virtues Integrated</span>
        <span class="badge badge-gold">Page 11: Circuit Pathfinder Maze</span>
        <span class="badge badge-blue">Page 12: Household STEM Project & Master Blueprint Clue #1</span>
      </div>
    </div>

    <!-- Render All 12 Pages with SVG Line Art and Vivid 5-Sentence Editorial Paragraphs -->
    ${issue.pages.map(page => {
      const { svgHtml } = renderPageSVG(page);
      return `
        <div class="magazine-page-card">
          <div class="magazine-page-header">
            <h2>${escapeXml(page.title)}</h2>
            <span class="badge badge-blue">Virtue: ${escapeXml(page.virtue)}</span>
          </div>

          <div class="magazine-page-content">
            <div class="svg-wrapper">
              ${svgHtml}
            </div>

            <div class="editorial-narrative-box">
              <div class="editorial-title">📖 Scene Exploration & Virtue Lesson:</div>
              <p class="editorial-paragraph">${escapeXml(page.narrative)}</p>
            </div>
          </div>
        </div>
      `;
    }).join("\n")}
  </div>
</body>
</html>`;
}

function escapeXml(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

if (process.argv[1] && process.argv[1].endsWith("agentLoop.js")) {
  const runner = new VirtueTechCLIAgentLoop();
  runner.runAll();
}
