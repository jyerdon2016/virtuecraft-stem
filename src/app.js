/**
 * ColoringCraft Studio - Main Application & Multi-Agent UI Engine
 * Subdomain: coloring.shomerepair.com
 */

import { APP_CONFIG } from "./config.js";
import {
  StoryboardAgent,
  PromptAgent,
  VectorArtAgent,
  MonetizationAgent,
  PackagingAgent,
  RANDOM_PROMPT_IDEAS,
  VirtueTechAgentCore
} from "./agent/agentCore.js";

// Global Subagent Instances
const storyboardAgent = new StoryboardAgent();
const promptAgent = new PromptAgent();
const vectorArtAgent = new VectorArtAgent();
const monetizationAgent = new MonetizationAgent({
  bannerEcpm: APP_CONFIG.ECPM_BANNER_BENCHMARK,
  rewardedEcpm: APP_CONFIG.REWARDED_VIDEO_ECPM
});
const packagingAgent = new PackagingAgent();

// Application State
let currentBook = null;
let currentStepPageIndex = 0; // 0 to 11 (Pages 1 to 12)
let activeColor = "#1e40af"; // Default Royal Blue
let colorHistory = [];
let colorRedoStack = [];
let activeAgentLoop = null;

// Simulated Rotating Sponsor Ads for Page-by-Page Refresh
const ROTATING_ADS = [
  {
    title: "Start Your Amazon KDP Publishing Empire Today!",
    desc: "Sell high-margin printable coloring books on Amazon KDP & Etsy with zero inventory.",
    sponsor: "KDP FastTrack",
    icon: "🚀"
  },
  {
    title: "Christian STEM Academy Homeschool Curriculum",
    desc: "Full year hands-on robotics, science, and virtue activity packs for ages 4-12.",
    sponsor: "STEM Faith",
    icon: "✝️"
  },
  {
    title: "Premium 72-Pack Artist Dual-Tip Brush Pens",
    desc: "Vibrant, non-bleed watercolor markers perfect for adult & children's coloring.",
    sponsor: "ColorArt Craft",
    icon: "🖌️"
  },
  {
    title: "Print On Demand: Fast Paperback Dropshipping!",
    desc: "Turn your digital vector coloring pages into physical books shipped via Amazon Prime.",
    sponsor: "PrintLulu Express",
    icon: "📚"
  },
  {
    title: "Interactive Drawing Tablets for Kids & Teens",
    desc: "Durable digital stylus pads for homeschool art, digital painting, and animation.",
    sponsor: "DrawTech Pro",
    icon: "📱"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCustomizerControls();
  initStepStudio();
  initColorStudioPalette();
  initAdMonetization();
  initKDPExports();
  initSubagentHub();

  // Initial Book Load: Default Theme
  buildBookFromInputs();

  // Check for successful Stripe payment callback
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("success") === "true") {
    monetizationAgent.purchaseCommercialPass();
    updateRevenueDisplays();
    alert("🎉 Payment Successful! Your $1.00 Commercial Resale Pass is active! You can now print, download, or sell your 12-page book with full commercial rights.");
    document.querySelector('[data-tab="commercial-kdp"]')?.click();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Admin Mode: Unhide revenue analytics and subagent console only if ?admin=true
  if (urlParams.get("admin") === "true") {
    document.querySelectorAll(".admin-only").forEach(el => el.style.display = "inline-block");
    const trustBadge = document.getElementById("customer-trust-badge");
    if (trustBadge) {
      trustBadge.innerHTML = `
        <span class="ticker-label">💰 Goal Tracker:</span>
        <strong id="ticker-revenue-val" style="color: #15803d;">$0.00</strong>
        <span class="ticker-progress" id="ticker-progress-bar">0%</span>
      `;
    }
    updateRevenueDisplays();
  }
});

/* ==========================================================
 * 1. Navigation Tabs
 * ========================================================== */
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabTarget = btn.getAttribute("data-tab");

      navButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const targetElement = document.getElementById(`tab-${tabTarget}`);
      if (targetElement) targetElement.classList.add("active");

      // When switching to gallery, refresh grid
      if (tabTarget === "full-gallery" && currentBook) {
        renderFullGallery(currentBook);
      }
    });
  });

  document.getElementById("print-current-btn")?.addEventListener("click", () => {
    window.print();
  });
}

/* ==========================================================
 * 2. Customizable Creator Form & Random Idea Generator
 * ========================================================== */
function initCustomizerControls() {
  const topicInput = document.getElementById("book-topic-input");
  const titleInput = document.getElementById("book-title-input");
  const recipientInput = document.getElementById("book-recipient-input");
  const purposeSelect = document.getElementById("book-purpose-select");
  const ageSelect = document.getElementById("book-age-select");
  const styleSelect = document.getElementById("book-style-select");
  const generateBtn = document.getElementById("generate-book-btn");
  const randomBtn = document.getElementById("random-idea-btn");

  // Random Idea Button Trigger
  randomBtn?.addEventListener("click", () => {
    const randomIdea = storyboardAgent.getRandomIdea();
    topicInput.value = randomIdea.topic;
    titleInput.value = randomIdea.title;
    styleSelect.value = randomIdea.style;
    
    // Animate button feedback
    randomBtn.textContent = "✨ Idea Applied!";
    setTimeout(() => {
      randomBtn.textContent = "🎲 Random Idea / Surprise Me!";
    }, 1200);

    buildBookFromInputs();
  });

  // Quick Prompt Chips Click
  document.querySelectorAll(".chip-btn").forEach(chip => {
    chip.addEventListener("click", () => {
      const ideaTopic = chip.getAttribute("data-idea");
      topicInput.value = ideaTopic;
      titleInput.value = `The Adventures of ${ideaTopic}`;
      buildBookFromInputs();
    });
  });

  // Generate Button Click
  generateBtn?.addEventListener("click", () => {
    buildBookFromInputs();
  });
}

function buildBookFromInputs() {
  const topic = document.getElementById("book-topic-input")?.value.trim() || "Friendly Robot Building a Treehouse";
  const title = document.getElementById("book-title-input")?.value.trim() || `The Adventures of ${topic}`;
  const recipient = document.getElementById("book-recipient-input")?.value.trim() || "Young Adventurer";
  const purpose = document.getElementById("book-purpose-select")?.value || "kids";
  const targetAge = document.getElementById("book-age-select")?.value || "4-9 years";
  const artStyle = document.getElementById("book-style-select")?.value || "Bold Line Art";

  // 1. Delegate to Storyboard Subagent
  currentBook = storyboardAgent.generate12PageStoryboard({
    topic,
    title,
    recipientName: recipient,
    purpose,
    targetAge,
    artStyle
  });

  // 2. Delegate to Prompt Subagent
  currentBook.pages.forEach((page, idx) => {
    const prompts = promptAgent.generatePagePrompts(page, currentBook);
    page.prompt = prompts.positivePrompt;
    page.negativePrompt = prompts.negativePrompt;
    page.overlayDirective = prompts.overlayDirective;

    // Assign real AI Diffusion image URL if not already set (e.g. from Super Squirrel)
    if (!page.realImageUrl) {
      page.realImageUrl = promptAgent.buildDiffusionImageUrl(page.prompt, 1000 + (idx + 1) * 79);
    }
  });

  // 3. Delegate to Vector Art Subagent
  currentBook.renderedSvgs = [];
  currentBook.pages.forEach(page => {
    const { svgHtml, hiddenPositions } = vectorArtAgent.renderPageSVG(page, currentBook);
    page.svgHtml = svgHtml;
    page.hiddenPositions = hiddenPositions;
    currentBook.renderedSvgs.push(svgHtml);
  });

  // Reset to Step 0 (Page 1)
  currentStepPageIndex = 0;
  buildStepCrumbs();
  loadStepStudioPage(0, false);
  updateRevenueDisplays();
}

/* ==========================================================
 * 3. Step-by-Step Page Generator Flow (Ad Monetization Driver)
 * ========================================================== */
let currentCanvas = null;
let currentCtx = null;
let canvasHistory = [];
let canvasRedoStack = [];

function initStepStudio() {
  const prevBtn = document.getElementById("prev-step-btn");
  const nextBtn = document.getElementById("next-step-btn");
  const quickExportBtn = document.getElementById("quick-export-all-btn");

  prevBtn?.addEventListener("click", () => {
    if (currentStepPageIndex > 0) {
      saveCurrentPageEdits();
      loadStepStudioPage(currentStepPageIndex - 1, false);
    }
  });

  nextBtn?.addEventListener("click", () => {
    if (currentBook && currentStepPageIndex < currentBook.pages.length - 1) {
      saveCurrentPageEdits();
      loadStepStudioPage(currentStepPageIndex + 1, true);
    } else if (currentStepPageIndex === 11) {
      saveCurrentPageEdits();
      document.querySelector('[data-tab="commercial-kdp"]')?.click();
    }
  });

  quickExportBtn?.addEventListener("click", () => {
    saveCurrentPageEdits();
    openPrintableWindow();
  });

  document.getElementById("step-page-title-input")?.addEventListener("input", (e) => {
    if (currentBook && currentBook.pages[currentStepPageIndex]) {
      currentBook.pages[currentStepPageIndex].title = e.target.value;
    }
  });
}

function buildStepCrumbs() {
  const container = document.getElementById("step-crumbs-container");
  if (!container) return;
  container.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const btn = document.createElement("button");
    btn.className = `crumb-btn ${i === currentStepPageIndex ? "active" : ""}`;
    btn.textContent = `Pg ${i + 1}`;
    btn.addEventListener("click", () => {
      saveCurrentPageEdits();
      loadStepStudioPage(i, true);
    });
    container.appendChild(btn);
  }
}

function loadStepStudioPage(pageIndex, recordAd = false) {
  if (!currentBook || !currentBook.pages[pageIndex]) return;
  currentStepPageIndex = pageIndex;
  const page = currentBook.pages[pageIndex];

  // 1. Record Ad Monetization if user clicked through
  if (recordAd) {
    monetizationAgent.recordPageClickThrough(pageIndex);
    rotateAdBanners();
    updateRevenueDisplays();
  }

  // 2. Update Stepper Header & Progress Track
  const progressPercent = Math.round(((pageIndex + 1) / 12) * 100);
  const progressFill = document.getElementById("stepper-progress-fill");
  if (progressFill) progressFill.style.width = `${progressPercent}%`;

  const stepTitle = document.getElementById("current-step-title");
  if (stepTitle) stepTitle.textContent = `Page ${pageIndex + 1} of 12: ${page.title}`;

  // Update Breadcrumb buttons
  const crumbButtons = document.querySelectorAll(".crumb-btn");
  crumbButtons.forEach((btn, idx) => {
    btn.classList.remove("active");
    if (idx === pageIndex) btn.classList.add("active");
    if (idx < pageIndex) btn.classList.add("completed");
  });

  // 3. Update Center Canvas Meta & Canvas
  document.getElementById("canvas-page-badge").textContent = `Page ${pageIndex + 1} of 12`;
  document.getElementById("canvas-virtue-badge").textContent = `Virtue: ${page.virtue}`;
  document.getElementById("canvas-skill-badge").textContent = `Skill: ${page.skill || "Creative Art"}`;

  renderActiveArtwork(page);

  // 4. Update Right Column Edit Textboxes & Diffusion Prompt
  const titleInput = document.getElementById("step-page-title-input");
  const narrativeInput = document.getElementById("step-page-narrative-input");
  const seekDesc = document.getElementById("step-page-seek-desc");

  if (titleInput) titleInput.value = page.title;
  if (narrativeInput) narrativeInput.value = page.narrative;
  if (seekDesc) {
    seekDesc.innerHTML = `
      <p>Find all ${page.hiddenCount} '${page.hiddenShape}' symbols hidden in the line art!</p>
      <div style="margin-top: 8px; font-size: 11px; background: #fff; padding: 6px 8px; border-radius: 6px; border: 1px solid #cbd5e1;">
        <strong>🤖 Diffusion Prompt:</strong>
        <p style="color: #475569; margin: 4px 0;">${page.prompt}</p>
        <button id="copy-prompt-btn" class="btn btn-sm btn-secondary" style="margin-top: 4px;">📋 Copy Prompt</button>
      </div>
    `;

    document.getElementById("copy-prompt-btn")?.addEventListener("click", () => {
      navigator.clipboard?.writeText(page.prompt);
      alert("📋 Prompt copied to clipboard for Midjourney / SDXL / Flux!");
    });
  }

  // 5. Update Prev/Next Buttons
  const prevBtn = document.getElementById("prev-step-btn");
  const nextBtn = document.getElementById("next-step-btn");

  if (prevBtn) prevBtn.disabled = pageIndex === 0;
  if (nextBtn) {
    if (pageIndex === 11) {
      nextBtn.textContent = "🎉 Finish & Export 12 Pages ➔";
    } else {
      nextBtn.textContent = `Generate Page ${pageIndex + 2} ➡️`;
    }
  }
}

function saveCurrentPageEdits() {
  if (!currentBook || !currentBook.pages[currentStepPageIndex]) return;
  const page = currentBook.pages[currentStepPageIndex];
  const titleInput = document.getElementById("step-page-title-input");
  const narrativeInput = document.getElementById("step-page-narrative-input");

  if (titleInput) page.title = titleInput.value.trim();
  if (narrativeInput) page.narrative = narrativeInput.value.trim();
}

function renderActiveArtwork(page) {
  const container = document.getElementById("active-page-svg-container");
  if (!container) return;
  container.innerHTML = "";

  if (page.realImageUrl) {
    const wrap = document.createElement("div");
    wrap.className = "canvas-interactive-wrapper";
    wrap.innerHTML = `
      <div class="canvas-loading-spinner" id="canvas-loading-spinner">⏳ Loading AI Coloring Page...</div>
      <canvas id="active-coloring-canvas" class="coloring-canvas" width="600" height="800"></canvas>
    `;
    container.appendChild(wrap);

    const canvas = document.getElementById("active-coloring-canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    currentCanvas = canvas;
    currentCtx = ctx;
    canvasHistory = [];
    canvasRedoStack = [];

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const spinner = document.getElementById("canvas-loading-spinner");
      if (spinner) spinner.style.display = "none";
      ctx.drawImage(img, 0, 0, 600, 800);
      canvasHistory.push(ctx.getImageData(0, 0, 600, 800));
    };
    img.onerror = () => {
      const spinner = document.getElementById("canvas-loading-spinner");
      if (spinner) spinner.style.display = "none";
      // Fallback to SVG
      container.innerHTML = page.svgHtml;
      attachSvgClickListeners(container);
    };
    img.src = page.realImageUrl;

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);

      floodFillCanvas(canvas, ctx, x, y, activeColor);
    });
  } else {
    container.innerHTML = page.svgHtml;
    attachSvgClickListeners(container);
  }
}

function attachSvgClickListeners(container) {
  const regions = container.querySelectorAll(".colorable-region");
  regions.forEach(region => {
    region.addEventListener("click", (e) => {
      e.stopPropagation();
      const prev = region.getAttribute("fill") || "#ffffff";
      colorHistory.push({ target: region, previousColor: prev });
      colorRedoStack = [];
      region.setAttribute("fill", activeColor);
    });
  });

  const overlaySymbols = container.querySelectorAll(".digital-overlay-symbol");
  overlaySymbols.forEach(symbol => {
    symbol.addEventListener("click", (e) => {
      e.stopPropagation();
      symbol.classList.toggle("found");
      alert("✨ You spotted a hidden vector shape! Wonderful eye!");
    });
  });
}

function floodFillCanvas(canvas, ctx, startX, startY, hexColor, tolerance = 38) {
  const width = canvas.width;
  const height = canvas.height;
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

  const rgb = hexToRgb(hexColor);
  if (!rgb) return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const startIdx = (startY * width + startX) * 4;
  const startR = data[startIdx];
  const startG = data[startIdx + 1];
  const startB = data[startIdx + 2];

  // Do not fill if clicked on dark contours
  if (startR < 65 && startG < 65 && startB < 65) return;

  // Do not fill if already close to the fill color
  if (Math.abs(startR - rgb.r) < 12 && Math.abs(startG - rgb.g) < 12 && Math.abs(startB - rgb.b) < 12) return;

  function matches(idx) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return Math.abs(r - startR) <= tolerance && Math.abs(g - startG) <= tolerance && Math.abs(b - startB) <= tolerance;
  }

  const queue = [startX, startY];
  const visited = new Uint8Array(width * height);
  visited[startY * width + startX] = 1;

  while (queue.length > 0) {
    const curY = queue.pop();
    const curX = queue.pop();
    const curIdx = (curY * width + curX) * 4;

    data[curIdx] = rgb.r;
    data[curIdx + 1] = rgb.g;
    data[curIdx + 2] = rgb.b;
    data[curIdx + 3] = 255;

    const neighbors = [
      [curX + 1, curY],
      [curX - 1, curY],
      [curX, curY + 1],
      [curX, curY - 1]
    ];

    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!visited[nPos]) {
          visited[nPos] = 1;
          const nIdx = nPos * 4;
          if (matches(nIdx)) {
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  canvasHistory.push(ctx.getImageData(0, 0, width, height));
  canvasRedoStack = [];
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16)
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16)
    };
  }
  return null;
}

function rotateAdBanners() {
  const randomAd = ROTATING_ADS[Math.floor(Math.random() * ROTATING_ADS.length)];
  const topTitle = document.getElementById("ad-top-title");
  const topDesc = document.getElementById("ad-top-desc");
  const sidebarTitle = document.getElementById("sidebar-ad-title");
  const sidebarDesc = document.getElementById("sidebar-ad-desc");
  const topImpId = document.getElementById("ad-top-imp-id");

  if (topTitle) topTitle.textContent = randomAd.title;
  if (topDesc) topDesc.textContent = randomAd.desc;
  if (sidebarTitle) sidebarTitle.textContent = randomAd.title;
  if (sidebarDesc) sidebarDesc.textContent = randomAd.desc;
  if (topImpId) topImpId.textContent = monetizationAgent.bannerImpressions;
}

function updateRevenueDisplays() {
  const summary = monetizationAgent.getRevenueSummary();
  
  const tickerVal = document.getElementById("ticker-revenue-val");
  const tickerProgress = document.getElementById("ticker-progress-bar");
  const footerRevenue = document.getElementById("footer-revenue-val");

  if (tickerVal) tickerVal.textContent = `$${summary.totalSessionRevenue.toFixed(2)}`;
  if (tickerProgress) tickerProgress.textContent = `${summary.targetProgressPercent}% of $1.00 Goal`;
  if (footerRevenue) footerRevenue.textContent = `$${summary.totalSessionRevenue.toFixed(2)}`;

  const metricPages = document.getElementById("metric-pages-viewed");
  const metricImpressions = document.getElementById("metric-ad-impressions");
  const metricRewarded = document.getElementById("metric-rewarded-views");
  const metricTotal = document.getElementById("metric-total-revenue");

  if (metricPages) metricPages.textContent = summary.pagesViewed;
  if (metricImpressions) metricImpressions.textContent = summary.bannerImpressions;
  if (metricRewarded) metricRewarded.textContent = summary.rewardedViews;
  if (metricTotal) metricTotal.textContent = `$${summary.totalSessionRevenue.toFixed(2)}`;
}

/* ==========================================================
 * 4. Interactive Click-to-Color Studio Palette
 * ========================================================== */
function initColorStudioPalette() {
  const swatches = document.querySelectorAll(".color-swatch");
  const swatchDisplay = document.getElementById("active-color-swatch-display");

  swatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      swatches.forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
      activeColor = swatch.getAttribute("data-color");
      if (swatchDisplay) swatchDisplay.style.background = activeColor;
    });
  });

  // Undo Button
  document.getElementById("undo-btn")?.addEventListener("click", () => {
    if (currentCanvas && currentCtx && canvasHistory.length > 1) {
      const popped = canvasHistory.pop();
      canvasRedoStack.push(popped);
      currentCtx.putImageData(canvasHistory[canvasHistory.length - 1], 0, 0);
    } else if (colorHistory.length > 0) {
      const lastAction = colorHistory.pop();
      colorRedoStack.push({ target: lastAction.target, previousColor: lastAction.target.getAttribute("fill") || "#ffffff" });
      lastAction.target.setAttribute("fill", lastAction.previousColor);
    }
  });

  // Redo Button
  document.getElementById("redo-btn")?.addEventListener("click", () => {
    if (currentCanvas && currentCtx && canvasRedoStack.length > 0) {
      const redoData = canvasRedoStack.pop();
      canvasHistory.push(redoData);
      currentCtx.putImageData(redoData, 0, 0);
    } else if (colorRedoStack.length > 0) {
      const redoAction = colorRedoStack.pop();
      colorHistory.push({ target: redoAction.target, previousColor: redoAction.target.getAttribute("fill") || "#ffffff" });
      redoAction.target.setAttribute("fill", redoAction.previousColor);
    }
  });

  // Clear Button
  document.getElementById("clear-btn")?.addEventListener("click", () => {
    if (currentCanvas && currentCtx && canvasHistory.length > 0) {
      const original = canvasHistory[0];
      currentCtx.putImageData(original, 0, 0);
      canvasHistory = [original];
      canvasRedoStack = [];
    } else {
      const container = document.getElementById("active-page-svg-container");
      const regions = container?.querySelectorAll(".colorable-region");
      regions?.forEach(r => r.setAttribute("fill", "#ffffff"));
      colorHistory = [];
      colorRedoStack = [];
    }
  });

  // Save Page Artwork Button
  document.getElementById("save-page-art-btn")?.addEventListener("click", () => {
    if (currentCanvas) {
      const link = document.createElement("a");
      link.download = `${currentBook?.topic || "coloring-page"}-page-${currentStepPageIndex + 1}.png`;
      link.href = currentCanvas.toDataURL("image/png");
      link.click();
    } else {
      alert("🎨 Masterpiece saved! Ready to print or share.");
    }
  });
}

/* ==========================================================
 * 5. Full 12-Page Gallery Rendering (Real AI Images)
 * ========================================================== */
function renderFullGallery(book) {
  const grid = document.getElementById("full-pages-grid");
  const subtitle = document.getElementById("gallery-subtitle");
  if (!grid || !book) return;

  grid.innerHTML = "";
  if (subtitle) subtitle.textContent = `"${book.title}" — 12 Complete AI Diffusion Coloring Pages (${book.subtitle})`;

  // Display Full-Color Covers if available
  if (book.coverImages) {
    const coverCard = document.createElement("div");
    coverCard.className = "page-card glass-panel";
    coverCard.innerHTML = `
      <div class="page-card-header">
        <h4>🎨 Full-Color Front Cover</h4>
        <span class="badge-pill tag-teal">KDP Cover</span>
      </div>
      <div class="gallery-img-container">
        <img src="${book.coverImages.front}" class="gallery-card-img" alt="Front Cover" />
      </div>
      <div class="page-card-narrative">
        <p><strong>Amazon KDP Cover:</strong> High-impact full-color cover with bold 3D title lettering and barcode area.</p>
      </div>
    `;
    grid.appendChild(coverCard);
  }

  book.pages.forEach((page, idx) => {
    const card = document.createElement("div");
    card.className = "page-card glass-panel";

    const artDisplay = page.realImageUrl 
      ? `<div class="gallery-img-container">
           <img src="${page.realImageUrl}" class="gallery-card-img" alt="${page.title}" loading="lazy" />
         </div>`
      : `<div class="page-card-svg">${page.svgHtml}</div>`;

    card.innerHTML = `
      <div class="page-card-header">
        <h4>${page.title}</h4>
        <span class="badge-pill tag-info">${page.virtue}</span>
      </div>
      ${artDisplay}
      <div class="page-card-narrative">
        <p>${page.narrative}</p>
      </div>
      <div class="page-card-actions">
        <button class="btn btn-sm btn-primary open-step-btn" data-index="${idx}">🖌️ Open in Step Studio</button>
      </div>
    `;

    card.querySelector(".open-step-btn")?.addEventListener("click", () => {
      document.querySelector('[data-tab="step-studio"]')?.click();
      loadStepStudioPage(idx, true);
    });

    grid.appendChild(card);
  });
}

/* ==========================================================
 * 6. Rewarded Video Ad Modal & Commercial KDP Exports
 * ========================================================== */
function initAdMonetization() {
  const downloadKdpBtn = document.getElementById("download-kdp-btn");
  const modal = document.getElementById("rewarded-ad-modal");
  const closeModalBtn = document.getElementById("close-ad-modal-btn");
  const claimPdfBtn = document.getElementById("claim-pdf-btn");
  const timerDisplay = document.getElementById("ad-timer-countdown");
  const progressBar = document.getElementById("ad-progress-bar");

  let countdownInterval = null;

  downloadKdpBtn?.addEventListener("click", () => {
    // Open Rewarded Video Modal to generate high-eCPM yield
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
        claimPdfBtn.textContent = "🎁 Download 300 DPI Amazon KDP PDF";

        // Record Rewarded Ad Yield
        monetizationAgent.recordRewardedVideoCompletion();
        updateRevenueDisplays();
      }
    }, 1000);
  });

  closeModalBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
    if (countdownInterval) clearInterval(countdownInterval);
  });

  claimPdfBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
    openPrintableWindow();
  });
}

function initKDPExports() {
  // Stripe Checkout Button
  document.getElementById("stripe-checkout-btn")?.addEventListener("click", () => {
    handleStripeCheckout();
  });

  // Download Interior Button
  document.getElementById("download-interior-btn")?.addEventListener("click", () => {
    openPrintableWindow();
  });

  // View License Button
  document.getElementById("view-license-btn")?.addEventListener("click", () => {
    openLicenseWindow();
  });
  document.getElementById("download-cert-btn")?.addEventListener("click", () => {
    openLicenseWindow();
  });

  // Generate Cover Preview
  document.getElementById("generate-cover-btn")?.addEventListener("click", () => {
    alert(`🎨 Amazon KDP Cover Preview generated for "${currentBook?.title || "Coloring Book"}"! 8.5x11 inches bleed margins applied.`);
  });
}

async function handleStripeCheckout() {
  const btn = document.getElementById("stripe-checkout-btn");
  const originalText = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ Redirecting to Stripe Checkout...";
  }

  try {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: currentBook?.topic || "Custom 12-Page Coloring Book"
      })
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Stripe Checkout error: " + (data.error || "Please check server setup"));
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    }
  } catch (err) {
    alert("Could not reach checkout server: " + err.message);
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
}

function openPrintableWindow() {
  if (!currentBook) return;
  const printableHtml = packagingAgent.generatePrintableBookPackage(currentBook, currentBook.renderedSvgs);
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(printableHtml);
    win.document.close();
  }
}

function openLicenseWindow() {
  if (!currentBook) return;
  const licenseHtml = packagingAgent.generateCommercialLicense(currentBook);
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(licenseHtml);
    win.document.close();
  }
}

/* ==========================================================
 * 7. Autonomous Subagent Orchestration Console
 * ========================================================== */
function initSubagentHub() {
  const startBtn = document.getElementById("start-agent-btn");
  const stopBtn = document.getElementById("stop-agent-btn");
  const statusText = document.getElementById("agent-status-text");
  const cycleCount = document.getElementById("agent-cycle-count");
  const logOutput = document.getElementById("agent-log-output");

  startBtn?.addEventListener("click", async () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.textContent = "RUNNING (ACTIVE)";
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

    statusText.textContent = "FINISHED (READY)";
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
