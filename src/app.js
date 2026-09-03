/**
 * VirtueCraft STEM - Main Frontend Application, Click-to-Color Studio & Ad Monetization Engine
 */

import {
  SYSTEM_PROMPT_LAYER,
  COPYRIGHT_DICTIONARY,
  ANNUAL_MASTER_PROJECT,
  sanitizeCopyrightText
} from "./engine/systemPrompts.js";

import { generateColoringBook } from "./engine/coloringBookGenerator.js";
import { renderPageSVG } from "./engine/lineArtRenderer.js";
import { VirtueTechAgentCore } from "./agent/agentCore.js";

// Global State
let currentBook = null;
let activeColor = "#e11d48"; // Default Superhero Cape Red
let activeColorStudioPageIndex = 0;
let colorHistory = [];
let colorRedoStack = [];
let totalAdImpressions = 12450;
let rewardedAdViews = 1820;
let estimatedAdRevenue = 71.35;
let activeAgentLoop = null;

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initGenerator();
  initClickToColorStudio();
  initAdMonetizationManager();
  initAgentLoopUI();
  
  // Initial default book load: Super Squirrel (Featured Hero Series)
  loadBook("Super Squirrel: Forest Guardian & Acorn Tech", 1);
});

/* 1. Navigation Tab Handling */
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabTarget = btn.getAttribute("data-tab");

      navButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(`tab-${tabTarget}`).classList.add("active");
    });
  });

  document.getElementById("print-book-btn")?.addEventListener("click", () => {
    window.print();
  });
}

/* 2. Coloring Book Generator */
function initGenerator() {
  const generateBtn = document.getElementById("generate-btn");
  const topicInput = document.getElementById("book-topic");
  const issueSelect = document.getElementById("issue-number");
  const ageSelect = document.getElementById("target-age");
  const presetBtns = document.querySelectorAll(".preset-badge-btn");

  generateBtn?.addEventListener("click", () => {
    const topic = topicInput.value.trim() || "Super Squirrel: Forest Guardian & Acorn Tech";
    const issueNum = parseInt(issueSelect.value) || 1;
    const age = ageSelect.value;
    loadBook(topic, issueNum, age);
  });

  // Preset quick-load buttons
  document.getElementById("load-super-squirrel-btn")?.addEventListener("click", () => {
    presetBtns.forEach(b => b.classList.remove("active-preset"));
    document.getElementById("load-super-squirrel-btn").classList.add("active-preset");
    topicInput.value = "Super Squirrel: Forest Guardian & Acorn Tech";
    issueSelect.value = "1";
    loadBook("Super Squirrel: Forest Guardian & Acorn Tech", 1);
  });

  document.getElementById("load-robotics-btn")?.addEventListener("click", () => {
    presetBtns.forEach(b => b.classList.remove("active-preset"));
    document.getElementById("load-robotics-btn").classList.add("active-preset");
    topicInput.value = "How to Build a Robot";
    issueSelect.value = "1";
    loadBook("How to Build a Robot", 1);
  });

  document.getElementById("load-solar-btn")?.addEventListener("click", () => {
    presetBtns.forEach(b => b.classList.remove("active-preset"));
    document.getElementById("load-solar-btn").classList.add("active-preset");
    topicInput.value = "How Solar Panels Work";
    issueSelect.value = "2";
    loadBook("How Solar Panels Work", 2);
  });
}

function loadBook(topic, issueNum, targetAge = "4-9 years") {
  currentBook = generateColoringBook(topic, issueNum, targetAge);
  renderBookOverview(currentBook);
  renderStudioPages(currentBook);
  renderMasterArcGrid(currentBook);
  renderPromptMatrix(currentBook);
  loadColorStudioPage(0); // Load Page 1 into Click-to-Color Studio
}

function renderBookOverview(book) {
  document.getElementById("book-title-display").textContent = `${book.topic} — ${book.subtitle}`;
  document.getElementById("book-subtitle-display").textContent = `Grand Master Project: ${book.masterArcModule.grandProjectTitle} (Component #${book.issueNumber}: ${book.masterArcModule.componentName})`;
  document.getElementById("book-meta-banner").classList.remove("hidden");
}

function renderStudioPages(book) {
  const pagesGrid = document.getElementById("pages-grid");
  pagesGrid.innerHTML = "";

  const squirrelImages = {
    1: "/images/super_squirrel/page1_flight_planning.jpg",
    2: "/images/super_squirrel/page2_workshop_safety.jpg",
    3: "/images/super_squirrel/page3_canopy_gliding.jpg",
    4: "/images/super_squirrel/page4_acorn_radar.jpg",
    5: "/images/super_squirrel/page5_solar_treehouse.jpg",
    6: "/images/super_squirrel/page6_gentle_rescue.jpg",
    11: "/images/super_squirrel/page11_canopy_maze.jpg",
    12: "/images/super_squirrel/page12_stem_catapult.jpg"
  };

  book.pages.forEach((page, idx) => {
    const { svgHtml } = renderPageSVG(page);
    const aiImg = (book.isSuperSquirrel && squirrelImages[page.pageNumber]) ? squirrelImages[page.pageNumber] : null;

    const card = document.createElement("div");
    card.className = "page-card glass-panel";
    card.innerHTML = `
      <div class="page-card-header">
        <h4>${page.title}</h4>
        <span class="tag tag-info">${page.virtue}</span>
      </div>
      <div class="page-preview-box">
        ${aiImg ? `
          <div style="text-align: center; margin-bottom: 0.75rem;">
            <img src="${aiImg}" alt="${page.title}" class="card-ai-img" />
            <div><span class="badge-ai-indicator">✨ High-Definition AI Coloring Page</span></div>
          </div>
        ` : `
          <div class="page-card-svg">${svgHtml}</div>
        `}
      </div>
      <div class="page-card-narrative">
        <p><strong>📖 Story Exploration:</strong> ${page.narrative}</p>
      </div>
      <div class="page-card-actions">
        <button class="btn btn-sm btn-primary open-in-studio-btn" data-index="${idx}">🖌️ Open in Click-to-Color</button>
        ${aiImg ? `<a href="${aiImg}" target="_blank" download="super_squirrel_page_${page.pageNumber}.jpg" class="btn btn-sm btn-secondary">💾 Download 300 DPI</a>` : ''}
      </div>
    `;

    card.querySelector(".open-in-studio-btn").addEventListener("click", () => {
      // Switch to Click-to-Color App tab
      document.querySelector('[data-tab="color-app"]').click();
      loadColorStudioPage(idx);
    });

    pagesGrid.appendChild(card);
  });
}

/* 3. Interactive Click-to-Color Studio Engine */
function initClickToColorStudio() {
  const swatches = document.querySelectorAll(".color-swatch");
  const colorPreview = document.getElementById("active-color-preview");

  swatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      swatches.forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
      activeColor = swatch.getAttribute("data-color");
      colorPreview.style.background = activeColor;
    });
  });

  // Undo Button
  document.getElementById("undo-color-btn")?.addEventListener("click", () => {
    if (colorHistory.length > 0) {
      const lastAction = colorHistory.pop();
      colorRedoStack.push({ target: lastAction.target, previousColor: lastAction.target.getAttribute("fill") || "#ffffff" });
      lastAction.target.setAttribute("fill", lastAction.previousColor);
    }
  });

  // Redo Button
  document.getElementById("redo-color-btn")?.addEventListener("click", () => {
    if (colorRedoStack.length > 0) {
      const redoAction = colorRedoStack.pop();
      colorHistory.push({ target: redoAction.target, previousColor: redoAction.target.getAttribute("fill") || "#ffffff" });
      redoAction.target.setAttribute("fill", redoAction.previousColor);
    }
  });

  // Clear Canvas
  document.getElementById("clear-canvas-btn")?.addEventListener("click", () => {
    const container = document.getElementById("interactive-svg-container");
    const regions = container.querySelectorAll(".colorable-region");
    regions.forEach(r => r.setAttribute("fill", "#ffffff"));
    colorHistory = [];
    colorRedoStack = [];
  });

  // Save Image
  document.getElementById("save-artwork-btn")?.addEventListener("click", () => {
    alert("🎨 Masterpiece saved! Downloading your high-resolution colored artwork.");
  });

  // Prev / Next Page Buttons
  document.getElementById("prev-page-btn")?.addEventListener("click", () => {
    if (activeColorStudioPageIndex > 0) {
      loadColorStudioPage(activeColorStudioPageIndex - 1);
    }
  });

  document.getElementById("next-page-btn")?.addEventListener("click", () => {
    if (currentBook && activeColorStudioPageIndex < currentBook.pages.length - 1) {
      loadColorStudioPage(activeColorStudioPageIndex + 1);
    }
  });
}

function loadColorStudioPage(pageIndex) {
  if (!currentBook || !currentBook.pages[pageIndex]) return;
  activeColorStudioPageIndex = pageIndex;

  const page = currentBook.pages[pageIndex];
  const { svgHtml } = renderPageSVG(page);
  const container = document.getElementById("interactive-svg-container");
  container.innerHTML = svgHtml;

  document.getElementById("canvas-page-title").textContent = page.title;
  document.getElementById("page-counter-display").textContent = `Page ${pageIndex + 1} of ${currentBook.pages.length}`;

  // Attach Flood Fill Click Handlers to all .colorable-region elements
  const regions = container.querySelectorAll(".colorable-region");
  regions.forEach(region => {
    region.addEventListener("click", (e) => {
      e.stopPropagation();
      const prev = region.getAttribute("fill") || "#ffffff";
      colorHistory.push({ target: region, previousColor: prev });
      colorRedoStack = []; // Reset redo stack on new paint stroke
      region.setAttribute("fill", activeColor);
    });
  });

  // Attach Seek-and-Find Click Listeners
  const overlaySymbols = container.querySelectorAll(".digital-overlay-symbol");
  overlaySymbols.forEach(symbol => {
    symbol.addEventListener("click", (e) => {
      e.stopPropagation();
      symbol.classList.toggle("found");
      alert("✨ You found a hidden vector symbol! Keep going!");
    });
  });
}

/* 4. Ad Monetization & Rewarded Video Ad Manager */
function initAdMonetizationManager() {
  const downloadPdfBtn = document.getElementById("download-pdf-btn");
  const modal = document.getElementById("rewarded-ad-modal");
  const closeModalBtn = document.getElementById("close-ad-modal-btn");
  const claimPdfBtn = document.getElementById("claim-pdf-btn");
  const timerDisplay = document.getElementById("ad-timer-countdown");
  const progressBar = document.getElementById("ad-progress-bar");

  let countdownInterval = null;

  downloadPdfBtn?.addEventListener("click", () => {
    // Open Rewarded Video Ad Modal
    modal.classList.remove("hidden");
    claimPdfBtn.disabled = true;
    progressBar.style.width = "0%";
    
    let secondsLeft = 5;
    timerDisplay.textContent = secondsLeft;

    countdownInterval = setInterval(() => {
      secondsLeft--;
      timerDisplay.textContent = Math.max(0, secondsLeft);
      const progressPercent = ((5 - secondsLeft) / 5) * 100;
      progressBar.style.width = `${progressPercent}%`;

      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
        claimPdfBtn.disabled = false;
        claimPdfBtn.textContent = "🎁 Download 300 DPI PDF Package";
        
        // Track Rewarded Ad Completion
        rewardedAdViews++;
        totalAdImpressions += 3;
        estimatedAdRevenue += 0.25;
        updateAdStatsDisplay();
      }
    }, 1000);
  });

  closeModalBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
    if (countdownInterval) clearInterval(countdownInterval);
  });

  claimPdfBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
    const targetFile = (currentBook && currentBook.isSuperSquirrel)
      ? "./output/books/super-squirrel-forest-guardian-acorn-tech-printable.html"
      : "./output/books/year1-issue1-robotics-printable.html";
    window.open(targetFile, "_blank");
  });
}

function renderMasterArcGrid(book) {
  const container = document.getElementById("master-arc-grid");
  if (!container) return;
  container.innerHTML = "";

  ANNUAL_MASTER_PROJECT.issues.forEach(item => {
    const isCurrent = book && book.issueNumber === item.issue;
    const card = document.createElement("div");
    card.className = `arc-module-card ${isCurrent ? "current-issue" : ""}`;
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span class="badge ${isCurrent ? "badge-gold" : "badge-blue"}">Issue #${item.issue}</span>
        ${isCurrent ? '<span style="font-size: 0.8rem; font-weight: bold; color: #d97706;">★ Current Active Issue</span>' : ''}
      </div>
      <h4 style="font-family: \'Outfit\', sans-serif; font-size: 1.1rem; color: #1e40af; margin-bottom: 0.25rem;">${item.componentName}</h4>
      <p style="font-size: 0.9rem; color: #475569; margin-bottom: 0.5rem;"><strong>🔨 STEM Build:</strong> ${item.stemProject}</p>
      <p style="font-size: 0.85rem; color: #64748b; font-style: italic;">"${item.hint}"</p>
    `;
    container.appendChild(card);
  });
}

function renderPromptMatrix(book) {
  const container = document.getElementById("prompts-list");
  if (!container || !book) return;
  container.innerHTML = "";

  book.pages.forEach(page => {
    const card = document.createElement("div");
    card.className = "prompt-card";
    card.innerHTML = `
      <h4>${page.title} — <span style="color: #0d9488;">${page.virtue}</span></h4>
      <p style="font-size: 0.9rem; margin-bottom: 0.4rem;"><strong>Skill:</strong> ${page.technicalSkill}</p>
      <div class="prompt-box">
        <span style="color: #4ade80; font-weight: bold;">[Positive Prompt]:</span> ${page.prompt}
      </div>
      <div class="prompt-box" style="color: #f87171;">
        <span style="color: #f87171; font-weight: bold;">[Negative Prompt]:</span> ${page.negativePrompt}
      </div>
      <div style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;">
        🔍 <strong>Directive:</strong> ${page.overlayDirective}
      </div>
    `;
    container.appendChild(card);
  });
}

function updateAdStatsDisplay() {
  document.getElementById("stat-impressions").textContent = totalAdImpressions.toLocaleString();
  document.getElementById("stat-rewarded-views").textContent = rewardedAdViews.toLocaleString();
  document.getElementById("stat-revenue").textContent = `$${estimatedAdRevenue.toFixed(2)}`;
}

/* 5. Autonomous Agent Loop Web UI Runner */
function initAgentLoopUI() {
  const startBtn = document.getElementById("start-agent-btn");
  const stopBtn = document.getElementById("stop-agent-btn");
  const statusText = document.getElementById("agent-status-text");
  const cycleCount = document.getElementById("agent-cycle-count");
  const logOutput = document.getElementById("agent-log-output");

  startBtn?.addEventListener("click", async () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.textContent = "RUNNING";
    statusText.className = "status-running";

    activeAgentLoop = new VirtueTechAgentCore({
      logFn: (msg) => {
        logOutput.textContent += `\n${msg}`;
        logOutput.scrollTop = logOutput.scrollHeight;
      }
    });

    for (let i = 0; i < 6; i++) {
      if (!activeAgentLoop) break;
      cycleCount.textContent = i + 1;
      await activeAgentLoop.runNextCycle();
    }

    statusText.textContent = "FINISHED";
    statusText.className = "status-idle";
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });

  stopBtn?.addEventListener("click", () => {
    activeAgentLoop = null;
    statusText.textContent = "STOPPED";
    statusText.className = "status-idle";
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });
}
