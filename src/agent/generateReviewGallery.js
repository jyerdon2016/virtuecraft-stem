import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateColoringBook } from "../engine/coloringBookGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reviewDir = path.resolve(__dirname, "../../output/reviews/super_squirrel");

if (!fs.existsSync(reviewDir)) {
  fs.mkdirSync(reviewDir, { recursive: true });
}

const book = generateColoringBook("Super Squirrel: Forest Guardian & Acorn Tech", 1);

const imgMap = {
  1: "./images/page1_flight_planning.jpg",
  2: "./images/page2_workshop_safety.jpg",
  3: "./images/page3_canopy_gliding.jpg",
  4: "./images/page4_acorn_radar.jpg",
  5: "./images/page5_solar_treehouse.jpg",
  6: "./images/page6_gentle_rescue.jpg",
  11: "./images/page11_canopy_maze.jpg",
  12: "./images/page12_stem_catapult.jpg"
};

const pagesHtml = book.pages.map(p => {
  const imgSrc = imgMap[p.pageNumber];
  return `
    <div class="page-review-card" id="page-${p.pageNumber}">
      <div class="card-header">
        <div class="badge-group">
          <span class="badge badge-page">Page ${p.pageNumber}</span>
          <span class="badge badge-virtue">✝️ ${p.virtue}</span>
          <span class="badge badge-skill">⚡ ${p.technicalSkill}</span>
        </div>
        <h2>${p.title}</h2>
      </div>
      
      <div class="card-body">
        <div class="image-col">
          ${imgSrc ? `
            <img src="${imgSrc}" alt="${p.title}" class="coloring-preview-img" />
            <div class="img-caption">✨ AI-Generated High-Resolution 300 DPI Coloring Page</div>
          ` : `
            <div class="placeholder-box">
              <div style="font-size: 3rem;">🐿️</div>
              <strong>Ready for AI Generation</strong>
              <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;">Use the locked prompt formula on the right with Midjourney / Flux / SDXL to render this page.</p>
            </div>
          `}
        </div>

        <div class="info-col">
          <div class="section-box">
            <h3>📖 5-Sentence Story Narrative:</h3>
            <p class="narrative-text">${p.narrative}</p>
          </div>

          <div class="section-box prompt-container">
            <h3>🎨 Locked Diffusion Prompt (Copy & Paste):</h3>
            <div class="code-snippet">${p.prompt}</div>
          </div>

          <div class="section-box neg-prompt-container">
            <h3>🚫 Locked Negative Prompt:</h3>
            <div class="code-snippet neg-snippet">${p.negativePrompt}</div>
          </div>

          <div class="meta-footer">
            <span>🔍 <strong>Seek-and-Find Overlay:</strong> ${p.hiddenCount}x '${p.hiddenShape}'</span>
            ${p.stemProjectDetails ? `<div style="margin-top: 0.5rem; color: #0d9488; font-weight: bold;">🔨 Includes Hands-On Household STEM Build: ${p.stemProjectDetails.projectName}</div>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}).join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Super Squirrel Coloring Book - Complete Review Dossier</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem 1rem; }
    .container { max-width: 1200px; margin: 0 auto; }
    
    .hero-banner { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 2px solid #334155; border-radius: 20px; padding: 2.5rem; text-align: center; margin-bottom: 2.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
    .hero-banner h1 { font-family: 'Outfit', sans-serif; font-size: 2.6rem; font-weight: 800; color: #f59e0b; margin-bottom: 0.5rem; }
    .hero-banner p { font-size: 1.1rem; color: #94a3b8; max-width: 800px; margin: 0 auto; }
    
    .covers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-top: 2rem; max-width: 900px; margin-left: auto; margin-right: auto; }
    .cover-card { background: #0f172a; border: 2px solid #334155; border-radius: 16px; padding: 1.25rem; text-align: center; box-shadow: 0 8px 16px rgba(0,0,0,0.4); }
    .cover-img { width: 100%; max-width: 360px; height: auto; border-radius: 12px; border: 3px solid #f59e0b; box-shadow: 0 6px 15px rgba(245, 158, 11, 0.2); }
    .cover-meta { margin-top: 1rem; text-align: left; }
    .cover-meta h3 { font-family: 'Outfit', sans-serif; font-size: 1.2rem; color: #f59e0b; margin-bottom: 0.25rem; }
    .cover-meta p { font-size: 0.9rem; color: #94a3b8; line-height: 1.5; }
    
    .stats-row { display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap; }
    .stat-pill { background: #1e293b; border: 1px solid #475569; padding: 0.5rem 1.25rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; }
    
    .page-review-card { background: #1e293b; border: 1px solid #334155; border-radius: 18px; margin-bottom: 2.5rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }
    .card-header { background: #243248; padding: 1.25rem 2rem; border-bottom: 1px solid #334155; }
    .card-header h2 { font-family: 'Outfit', sans-serif; font-size: 1.6rem; color: #ffffff; margin-top: 0.4rem; }
    
    .badge-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .badge { font-size: 0.8rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 12px; display: inline-block; }
    .badge-page { background: #d97706; color: #ffffff; }
    .badge-virtue { background: #0d9488; color: #ffffff; }
    .badge-skill { background: #1e40af; color: #ffffff; }
    
    .card-body { display: grid; grid-template-columns: 440px 1fr; gap: 2rem; padding: 2rem; }
    @media (max-width: 960px) { .card-body { grid-template-columns: 1fr; } }
    
    .image-col { text-align: center; }
    .coloring-preview-img { width: 100%; max-width: 420px; border-radius: 12px; border: 3px solid #000; box-shadow: 0 6px 12px rgba(0,0,0,0.4); background: #ffffff; }
    .img-caption { font-size: 0.85rem; color: #38bdf8; font-weight: 600; margin-top: 0.6rem; }
    
    .placeholder-box { background: #0f172a; border: 2px dashed #475569; border-radius: 12px; padding: 4rem 1.5rem; text-align: center; color: #94a3b8; }
    
    .info-col { display: flex; flex-direction: column; gap: 1.25rem; }
    .section-box { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 1.25rem; }
    .section-box h3 { font-family: 'Outfit', sans-serif; font-size: 1.05rem; color: #f59e0b; margin-bottom: 0.5rem; }
    
    .narrative-text { font-size: 1rem; line-height: 1.7; color: #e2e8f0; }
    
    .code-snippet { background: #020617; border: 1px solid #1e293b; padding: 0.85rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; color: #38bdf8; line-height: 1.5; word-break: break-word; }
    .neg-snippet { color: #f87171; }
    
    .meta-footer { font-size: 0.9rem; color: #cbd5e1; border-top: 1px solid #334155; padding-top: 0.75rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero-banner">
      <h1>🐿️ Super Squirrel: Forest Guardian &amp; Acorn Tech</h1>
      <p style="color: #cbd5e1; margin-top: 0.5rem; font-size: 1.15rem;"><strong>My ADHD Superpower Edition</strong> — Full Color Front &amp; Back Covers with 12 Sequential Story &amp; STEM Activity Pages</p>
      
      <div class="covers-grid">
        <div class="cover-card">
          <img src="./images/front_cover_color.jpg" alt="Super Squirrel Full Color Front Cover" class="cover-img" />
          <div class="cover-meta">
            <h3>🎨 Full-Color Front Cover</h3>
            <p>Vibrant Pixar/Disney animated style featuring Sammy soaring with his ADHD "IDEA" lightbulb, fidget gyro, and superhero cape.</p>
          </div>
        </div>

        <div class="cover-card">
          <img src="./images/back_cover_color.jpg" alt="Super Squirrel Full Color Back Cover" class="cover-img" />
          <div class="cover-meta">
            <h3>📖 Full-Color Back Cover</h3>
            <p>"Unleash Your Inner Superpower!" featuring Sammy's thumbs-up, blurb, 3 activity preview badges, and ISBN barcode.</p>
          </div>
        </div>
      </div>

      <div class="stats-row" style="margin-top: 2rem;">
        <span class="stat-pill">🌈 Full-Color Front &amp; Back Covers</span>
        <span class="stat-pill">⚡ ADHD Superpower &amp; Hyper-Focus Theme</span>
        <span class="stat-pill">📖 12 Sequential Story Pages</span>
        <span class="stat-pill">✝️ 10 Christian Virtues</span>
        <span class="stat-pill">🧩 Page 11 Canopy Maze</span>
        <span class="stat-pill">🔨 Page 12 STEM Catapult</span>
      </div>
    </div>

    ${pagesHtml}
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(reviewDir, "review_gallery.html"), html, "utf8");
console.log("Successfully generated review_gallery.html at", path.join(reviewDir, "review_gallery.html"));
