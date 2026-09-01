/**
 * VirtueTech AI - Main Frontend Application
 */

import {
  SYSTEM_PROMPT_LAYER,
  COPYRIGHT_DICTIONARY,
  ANNUAL_MASTER_PROJECT,
  sanitizeCopyrightText
} from "./engine/systemPrompts.js";

import {
  generateColoringBook
} from "./engine/coloringBookGenerator.js";

import {
  renderPageSVG
} from "./engine/lineArtRenderer.js";

// Global Application State
let currentBook = null;
let currentArcadePageIndex = 0;
let foundShapes = new Set();

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initGenerator();
  initSanitizer();
  initSystemRulesDisplay();
  renderMasterArcGrid(1);
  
  // Default Initial Load: Issue #1 of Robotics
  loadBook("How to Build a Robot", 1);
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

  // Print button handler
  document.getElementById("print-book-btn")?.addEventListener("click", () => {
    window.print();
  });

  // Switch to Master Arc tab from summary banner
  document.getElementById("view-arc-btn")?.addEventListener("click", () => {
    document.querySelector('[data-tab="master-arc"]').click();
  });
}

/* 2. Book Generator & Presets */
function initGenerator() {
  const generateBtn = document.getElementById("generate-book-btn");
  const topicInput = document.getElementById("book-topic");
  const issueSelect = document.getElementById("issue-number");
  const ageSelect = document.getElementById("book-age");

  generateBtn.addEventListener("click", () => {
    const topic = topicInput.value.trim() || "How to Build a Robot";
    const issueNum = parseInt(issueSelect.value) || 1;
    const age = ageSelect.value;

    loadBook(topic, issueNum, age);
  });

  // Presets
  document.querySelectorAll(".pill-btn").forEach(presetBtn => {
    presetBtn.addEventListener("click", () => {
      const key = presetBtn.getAttribute("data-preset");
      let presetTopic = "How to Build a Robot";
      if (key === "solar") presetTopic = "How Solar Panels Work";
      if (key === "coding") presetTopic = "How Computer Coding Works";
      if (key === "water") presetTopic = "How Water Filtration Works";

      document.getElementById("book-topic").value = presetTopic;
      loadBook(presetTopic, 1);
    });
  });
}

function loadBook(topic, issueNum = 1, age = "4-9 years") {
  currentBook = generateColoringBook(topic, issueNum, age);
  renderBook(currentBook);
}

/* 3. Render Book Pages & UI Components */
function renderBook(book) {
  currentBook = book;
  
  // Display Header
  document.getElementById("book-title-display").innerText = book.topic;
  document.getElementById("book-subtitle-display").innerText = book.subtitle;
  document.getElementById("issue-badge").innerText = `Issue #${book.issueNumber} of 12`;

  const container = document.getElementById("pages-container");
  container.innerHTML = "";

  book.pages.forEach(page => {
    const card = document.createElement("div");
    card.className = "page-card";

    // Generate SVG line art for this page
    const { svgHtml } = renderPageSVG(page);

    let typeTag = `<span class="badge badge-purple">Story Step</span>`;
    if (page.type === "puzzle") typeTag = `<span class="badge badge-gold">🧩 Vector Maze Puzzle</span>`;
    if (page.type === "stem-project") typeTag = `<span class="badge badge-green">🔨 Household STEM Project</span>`;

    card.innerHTML = `
      <div class="page-card-header">
        <h4>${escapeHtml(page.title)}</h4>
        ${typeTag}
      </div>

      <div class="page-card-preview">
        ${svgHtml}
      </div>

      <div class="page-card-body">
        <div class="page-card-meta">
          <span class="badge badge-blue">Virtue: ${escapeHtml(page.virtue)}</span>
          <span class="badge badge-green">Skill: ${escapeHtml(page.technicalSkill)}</span>
          <span class="badge badge-gold">Hidden: ${page.hiddenCount} '${escapeHtml(page.hiddenShape)}'</span>
        </div>
        <p><strong>Visual Concept:</strong> ${escapeHtml(page.narrative)}</p>
        <div class="prompt-box">
          <strong>Backend Image Prompt:</strong><br>${escapeHtml(page.prompt)}
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Update Matrix Table, Master Arc & Arcade
  updatePromptMatrixTable(book);
  renderMasterArcGrid(book.issueNumber);
  initArcade(book);
}

/* 4. Master Arc Components Grid */
function renderMasterArcGrid(activeIssueNum = 1) {
  const container = document.getElementById("arc-components-grid");
  if (!container) return;

  container.innerHTML = "";

  ANNUAL_MASTER_PROJECT.issues.forEach(item => {
    const card = document.createElement("div");
    const isActive = item.issue === activeIssueNum;
    card.className = `arc-card ${isActive ? "active-issue" : ""}`;

    card.innerHTML = `
      <div class="arc-card-header">
        <span class="badge ${isActive ? "badge-green" : "badge-blue"}">Issue #${item.issue}</span>
        ${isActive ? '<span class="badge badge-gold">Active Issue</span>' : ''}
      </div>
      <div class="arc-card-title">${escapeHtml(item.componentName)}</div>
      <p style="font-size: 0.85rem; margin-top: 0.4rem;"><strong>STEM Build:</strong> ${escapeHtml(item.stemProject)}</p>
      <div class="arc-card-hint">"${escapeHtml(item.hint)}"</div>
    `;

    container.appendChild(card);
  });
}

/* 5. Prompt Matrix Table */
function initSystemRulesDisplay() {
  const rulesContainer = document.getElementById("system-rules-text");
  if (rulesContainer) {
    rulesContainer.innerText = SYSTEM_PROMPT_LAYER.trim();
  }
}

function updatePromptMatrixTable(book) {
  const tbody = document.getElementById("matrix-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  book.pages.forEach(page => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>Page ${page.pageNumber}</strong></td>
      <td>${escapeHtml(page.technicalSkill)}</td>
      <td><span class="badge badge-blue">${escapeHtml(page.virtue)}</span></td>
      <td><span class="badge badge-gold">Embed ${page.hiddenCount} '${escapeHtml(page.hiddenShape)}'</span></td>
      <td><code class="prompt-code">${escapeHtml(page.prompt)}</code></td>
    `;
    tbody.appendChild(tr);
  });
}

/* 6. Copyright Sanitizer Sandbox */
function initSanitizer() {
  const inputTxt = document.getElementById("sanitizer-input");
  const runBtn = document.getElementById("run-sanitizer-btn");
  const outputBox = document.getElementById("sanitizer-output");
  const mappingBody = document.getElementById("ip-mapping-body");

  // Populate Mapping Table
  if (mappingBody) {
    mappingBody.innerHTML = "";
    COPYRIGHT_DICTIONARY.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong style="color: #c53030;">${escapeHtml(item.original)}</strong></td>
        <td><span class="badge badge-green">${escapeHtml(item.generic)}</span></td>
        <td><span class="badge badge-blue">${escapeHtml(item.category)}</span></td>
      `;
      mappingBody.appendChild(tr);
    });
  }

  // Run Sanitizer
  if (runBtn) {
    runBtn.addEventListener("click", () => {
      const text = inputTxt.value;
      const { sanitizedText, replacedIPs } = sanitizeCopyrightText(text);

      let replacedInfo = "";
      if (replacedIPs.length > 0) {
        replacedInfo = `<br><br><small style="color: #27ae60;"><strong>Protected IPs Replaced:</strong> ${replacedIPs.map(r => `${r.from} &rarr; ${r.to}`).join(", ")}</small>`;
      } else {
        replacedInfo = `<br><br><small style="color: #718096;">(No trademarked IPs detected)</small>`;
      }

      outputBox.innerHTML = `<div>${escapeHtml(sanitizedText)} ${replacedInfo}</div>`;
    });
  }
}

/* 7. Seek-and-Find Game Arcade */
function initArcade(book) {
  const pageList = document.getElementById("arcade-page-list");
  if (!pageList) return;

  pageList.innerHTML = "";
  foundShapes.clear();

  book.pages.forEach((page, idx) => {
    const btn = document.createElement("button");
    btn.className = `arcade-page-btn ${idx === 0 ? "active" : ""}`;
    btn.innerText = `Page ${page.pageNumber}: ${page.title.split(":")[1] || page.title}`;
    
    btn.addEventListener("click", () => {
      document.querySelectorAll(".arcade-page-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentArcadePageIndex = idx;
      renderArcadeStage(book.pages[idx]);
    });

    pageList.appendChild(btn);
  });

  renderArcadeStage(book.pages[0]);
}

function renderArcadeStage(page) {
  const wrapper = document.getElementById("svg-canvas-wrapper");
  const foundCountEl = document.getElementById("found-count");
  const totalCountEl = document.getElementById("total-count");
  const gameStatus = document.getElementById("game-status");

  foundShapes.clear();
  totalCountEl.innerText = page.hiddenCount;
  foundCountEl.innerText = "0";
  gameStatus.innerText = `Find ${page.hiddenCount} hidden '${page.hiddenShape}' shapes in the line art below!`;

  const { svgHtml } = renderPageSVG(page);
  wrapper.innerHTML = svgHtml;

  // Attach click listeners to hidden shape paths
  const hiddenElements = wrapper.querySelectorAll(".hidden-shape");
  hiddenElements.forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = el.getAttribute("data-id");

      if (!foundShapes.has(id)) {
        foundShapes.add(id);
        el.classList.add("found");
        foundCountEl.innerText = foundShapes.size;

        if (foundShapes.size === page.hiddenCount) {
          gameStatus.innerHTML = `<strong style="color: #27ae60;">🎉 WINNER! You found all ${page.hiddenCount} hidden '${page.hiddenShape}' shapes on this page!</strong>`;
        } else {
          gameStatus.innerText = `Great eye! You found ${foundShapes.size} of ${page.hiddenCount} shapes!`;
        }
      }
    });
  });
}

function escapeHtml(str = "") {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
