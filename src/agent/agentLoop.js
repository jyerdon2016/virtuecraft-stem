/**
 * VirtueCraft STEM - Node.js CLI Agent Loop Runner & File Exporter
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

    const { bookData, printableHtml, licenseHtml } = result;
    const exportInfo = this.exportToDisk(bookData.topic, bookData, printableHtml, licenseHtml);
    this.log("Manager Agent", `EXPORT: Successfully saved book artifacts to '${exportInfo.filePath}'`);
    return { ...result, ...exportInfo };
  }

  exportToDisk(topic, bookData, printableHtml, licenseHtml) {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const safeFilename = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const jsonPath = path.join(OUTPUT_DIR, `${safeFilename}-series.json`);
    const htmlPath = path.join(OUTPUT_DIR, `${safeFilename}-printable.html`);
    const licensePath = path.join(OUTPUT_DIR, `${safeFilename}-commercial-license.html`);

    fs.writeFileSync(jsonPath, JSON.stringify(bookData, null, 2), "utf8");
    fs.writeFileSync(htmlPath, printableHtml, "utf8");
    fs.writeFileSync(licensePath, licenseHtml, "utf8");

    // Also write default demo file for immediate browser preview
    const defaultPreviewPath = path.join(OUTPUT_DIR, "year1-issue1-robotics-printable.html");
    fs.writeFileSync(defaultPreviewPath, printableHtml, "utf8");

    return { filePath: htmlPath, jsonPath, licensePath };
  }
}

if (process.argv[1] && process.argv[1].endsWith("agentLoop.js")) {
  const runner = new VirtueTechCLIAgentLoop();
  runner.runAll();
}
