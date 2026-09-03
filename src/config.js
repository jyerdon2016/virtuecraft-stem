/**
 * VirtueCraft STEM / Coloring Studio - Domain & Application Configuration
 * 
 * Supports primary domain or custom subdomain under shomerepair.com
 * (e.g. coloring.shomerepair.com or books.shomerepair.com)
 */

export const APP_CONFIG = {
  SUBDOMAIN: "coloring",
  ROOT_DOMAIN: "shomerepair.com",
  get FULL_DOMAIN() {
    return `${this.SUBDOMAIN}.${this.ROOT_DOMAIN}`;
  },
  get SITE_URL() {
    return `https://${this.FULL_DOMAIN}`;
  },
  APP_NAME: "ColoringCraft Studio",
  TAGLINE: "Custom AI Coloring Books for Kids & Commercial Resale",
  SUPPORT_EMAIL: "support@shomerepair.com",
  
  // Monetization Target Constants ($1.00 for every 12 pages)
  TARGET_REVENUE_PER_12_PAGES: 1.00,
  TARGET_RATE_PER_PAGE: 0.0833, // $1.00 / 12 pages
  ECPM_BANNER_BENCHMARK: 6.50,
  REWARDED_VIDEO_ECPM: 28.00,
  COMMERCIAL_LICENSE_FEE: 1.00
};
