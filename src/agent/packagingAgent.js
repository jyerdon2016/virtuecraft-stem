/**
 * Commercial KDP & Print Packaging Subagent
 * 
 * Prepares complete 12-page coloring books for personal home printing or commercial sale:
 *   - Amazon KDP 8.5" x 11" bleed & margin specs
 *   - Front & Back Book Cover HTML/SVG generator
 *   - Commercial Resale Rights & Private Label Rights (PLR) License Certificate
 *   - High-resolution printable HTML/PDF compilation
 */

export class PackagingAgent {
  constructor() {
    this.agentName = "Commercial KDP & Print Packaging Subagent";
    this.version = "2.0";
  }

  /**
   * Generates a formal Commercial Resale Rights Certificate
   */
  generateCommercialLicense(bookData = {}) {
    const topic = bookData.topic || "Custom Coloring Book";
    const author = bookData.recipientOrAuthor || "Commercial Publisher";
    const licenseId = "LIC-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const issueDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Commercial Resale Rights Certificate - ${topic}</title>
        <style>
          body { font-family: 'Times New Roman', serif; background: #fdfbf7; padding: 40px; color: #1e293b; text-align: center; }
          .cert-border { border: 8px double #1e3a8a; padding: 30px; border-radius: 12px; background: #ffffff; max-width: 800px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
          h1 { font-size: 32px; color: #1e3a8a; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
          .cert-badge { font-size: 48px; margin: 10px 0; }
          .cert-text { font-size: 16px; line-height: 1.6; margin: 20px 0; }
          .licensee { font-size: 24px; font-weight: bold; color: #b45309; border-bottom: 2px solid #b45309; display: inline-block; padding: 0 20px 5px; }
          .terms-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; text-align: left; font-size: 13px; font-family: sans-serif; margin: 25px 0; }
          .seal-row { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; font-family: sans-serif; }
          .seal { border: 2px solid #b45309; border-radius: 50%; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: #b45309; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="cert-border">
          <div class="cert-badge">🛡️ ⚖️ 📚</div>
          <h1>Commercial Resale Rights Certificate</h1>
          <p style="color: #64748b; font-style: italic; font-size: 14px;">Official Master Resale & Amazon KDP Publishing License</p>
          
          <p class="cert-text">This certifies that:</p>
          <div class="licensee">${author}</div>
          
          <p class="cert-text">
            Is hereby granted full, non-exclusive, perpetual <strong>Commercial Resale & Distribution Rights</strong> for the 12-page coloring book work entitled:
            <br>
            <strong style="font-size: 20px; color: #1e3a8a;">"${topic}"</strong>
          </p>

          <div class="terms-box">
            <strong>Permitted Commercial Uses:</strong>
            <ul>
              <li>✅ Sell printed physical paperback editions on Amazon KDP, Barnes & Noble, or Lulu.</li>
              <li>✅ Sell digital printable PDF packages on Etsy, Gumroad, or personal e-commerce stores.</li>
              <li>✅ Modify covers, title, and branding to suit your custom publishing imprint.</li>
              <li>✅ Keep 100% of retail sales profits without royalty payments to the generator platform.</li>
            </ul>
          </div>

          <div class="seal-row">
            <div>
              <p><strong>License ID:</strong> ${licenseId}</p>
              <p><strong>Issued On:</strong> ${issueDate}</p>
            </div>
            <div class="seal">
              VERIFIED<br>COMMERCIAL<br>LICENSE
            </div>
            <div style="text-align: right;">
              <p><strong>Issued By:</strong></p>
              <p>coloring.shomerepair.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generates a 300 DPI Amazon KDP Ready Printable HTML document containing all 12 pages
   */
  generatePrintableBookPackage(bookData = {}, renderedSvgs = []) {
    const topic = bookData.topic || "Coloring Book";
    const author = bookData.recipientOrAuthor || "Adventure Press";
    const isCommercial = bookData.purpose === "commercial";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${topic} - 12-Page Printable Edition</title>
        <style>
          @page {
            size: 8.5in 11in;
            margin: 0.5in;
          }
          @media print {
            body { margin: 0; background: #fff; }
            .print-page { page-break-after: always; height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
            .no-print { display: none !important; }
          }
          body { font-family: 'Outfit', sans-serif; background: #e2e8f0; margin: 0; padding: 20px; }
          .controls-bar { background: #1e40af; color: #fff; padding: 15px 30px; border-radius: 8px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
          .print-btn { background: #f59e0b; color: #000; font-weight: bold; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 16px; }
          .print-page { background: #fff; width: 8.5in; min-height: 10in; margin: 20px auto; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 8px; box-sizing: border-box; }
          .page-header-line { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .page-svg-wrap svg { width: 100%; height: 7.5in; }
          .page-footer-line { display: flex; justify-content: space-between; font-size: 12px; color: #475569; border-top: 1px solid #cbd5e1; padding-top: 10px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="controls-bar no-print">
          <div>
            <h2 style="margin:0;">🖨️ Amazon KDP 8.5" x 11" Print Ready Package</h2>
            <p style="margin:4px 0 0; font-size: 14px;">"${topic}" — 12 High-Contrast Vector Pages (${isCommercial ? "Commercial Resale Edition" : `Gift for ${author}`})</p>
          </div>
          <button class="print-btn" onclick="window.print()">🖨️ Print / Save as 300 DPI PDF</button>
        </div>

        ${bookData.coverImages ? `
          <div class="print-page">
            <div class="page-header-line">
              <h2 style="margin:0; text-transform: uppercase; font-size: 20px;">${topic} - FULL COLOR FRONT COVER</h2>
            </div>
            <div class="page-svg-wrap" style="text-align: center;">
              <img src="${bookData.coverImages.front}" style="max-width: 100%; height: 7.5in; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);" />
            </div>
            <div class="page-footer-line">
              <span>Front Cover Edition</span>
              <span>Amazon KDP Glossy / Matte</span>
            </div>
          </div>
        ` : ""}

        ${bookData.pages.map((page, idx) => {
          const contentMarkup = page.realImageUrl 
            ? `<div style="text-align:center;"><img src="${page.realImageUrl}" style="max-width: 100%; height: 7.5in; object-fit: contain; border: 2px solid #000; border-radius: 8px;" /></div>`
            : renderedSvgs[idx] || "";

          return `
            <div class="print-page">
              <div class="page-header-line">
                <h2 style="margin:0; text-transform: uppercase; font-size: 20px;">${topic}</h2>
                <span style="font-size: 12px; color: #64748b;">Page ${idx + 1} of 12 • ${isCommercial ? "Published by " + author : "Created for " + author}</span>
              </div>
              <div class="page-svg-wrap">
                ${contentMarkup}
              </div>
              <div class="page-footer-line">
                <span>Published via coloring.shomerepair.com</span>
                <span>Amazon KDP Standard Bleed 8.5" x 11"</span>
                <span>Page ${idx + 1}</span>
              </div>
            </div>
          `;
        }).join("")}

        ${bookData.coverImages ? `
          <div class="print-page">
            <div class="page-header-line">
              <h2 style="margin:0; text-transform: uppercase; font-size: 20px;">${topic} - FULL COLOR BACK COVER</h2>
            </div>
            <div class="page-svg-wrap" style="text-align: center;">
              <img src="${bookData.coverImages.back}" style="max-width: 100%; height: 7.5in; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);" />
            </div>
            <div class="page-footer-line">
              <span>Back Cover & Barcode Zone</span>
              <span>Amazon KDP Standard</span>
            </div>
          </div>
        ` : ""}
      </body>
      </html>
    `;
  }
}
