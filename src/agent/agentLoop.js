/**
 * VirtueTech AI - Node.js CLI Agent Loop Runner & File Exporter
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VirtueTechAgentCore, DEFAULT_TOPIC_QUEUE } from "./agentCore.js";

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

    return { filePath: htmlPath, jsonPath };
  }
}

function buildPrintableBundleHtml(topic, series) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeXml(topic)} - Complete 12-Issue Printable Bundle</title>
  <style>
    body { font-family: sans-serif; background: #f8fafc; padding: 2rem; color: #0f172a; }
    h1 { color: #2563eb; text-align: center; }
    .issue-card { background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; }
    @media print { .issue-card { page-break-after: always; } }
  </style>
</head>
<body>
  <h1>🎨 VirtueTech AI: ${escapeXml(topic)}</h1>
  <p style="text-align: center;">Complete 12-Issue Annual Series | STEM Skills & Christian Virtues</p>
  <hr style="margin: 2rem 0;">

  ${series.map(issue => `
    <div class="issue-card">
      <h2>Issue #${issue.issueNumber}: ${escapeXml(issue.subtitle)}</h2>
      <p><strong>Master Arc Component:</strong> ${escapeXml(issue.masterArcModule.componentName)}</p>
      <p><strong>STEM Project:</strong> ${escapeXml(issue.masterArcModule.stemProject)}</p>
      <p><strong>Pages Count:</strong> ${issue.pages.length} Pages</p>
    </div>
  `).join("")}
</body>
</html>`;
}

function escapeXml(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// CLI Execution
if (process.argv[1] && process.argv[1].endsWith("agentLoop.js")) {
  const runner = new VirtueTechCLIAgentLoop();
  runner.runAll();
}
