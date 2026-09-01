# Domain Deployment Guide for shomerepair.com

This guide provides step-by-step instructions for deploying **VirtueCraft STEM** to your custom domain **`shomerepair.com`**.

---

## 🌐 1. DNS Configuration (Domain Registrar / Cloudflare / GoDaddy / Namecheap)

Log in to your domain registrar DNS settings for **`shomerepair.com`** and add the following records:

### A Records (Apex Domain `shomerepair.com`)
Points `shomerepair.com` to the static hosting IP servers (GitHub Pages / Netlify / Vercel):

| Type | Host | Points To / Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `185.199.108.153` | Automatic / 300 |
| **A** | `@` | `185.199.109.153` | Automatic / 300 |
| **A** | `@` | `185.199.110.153` | Automatic / 300 |
| **A** | `@` | `185.199.111.153` | Automatic / 300 |

### CNAME Record (Subdomain `www.shomerepair.com`)
| Type | Host | Points To / Value | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `www` | `shomerepair.com` | Automatic / 300 |

---

## 🛠️ 2. Build Production Package

Run the production build command in your project directory:

```bash
npm run build
```

This compiles all HTML, CSS, JavaScript, and custom SVG assets into the `dist/` directory, including the root `CNAME` file.

---

## 🚀 3. Deploy Options

### Option A: GitHub Pages Deployment
1. Push your repository to GitHub:
   ```bash
   git push origin master
   ```
2. Navigate to repository **Settings > Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch** (`master` / `dist`).
4. Under **Custom domain**, enter `shomerepair.com` and enable **Enforce HTTPS**.

### Option B: Netlify / Vercel / Cloudflare Pages
1. Drag and drop the `dist/` folder into your Netlify / Vercel dashboard.
2. In Domain Settings, add `shomerepair.com`.
3. Automatic SSL/TLS certificate will be provisioned in 2-5 minutes.

---

## 📊 4. Verify Live Setup
Once DNS propagates (usually 5 to 15 minutes), open your browser and visit:
- **`https://shomerepair.com`**
- Confirm HTTPS security lock icon is active.
- Verify Click-to-Color studio, AdSense banners, and Rewarded Video Ads function cleanly!
