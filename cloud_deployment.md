# ☁️ Cloud Serverless Auto-Scaling & Subdomain Deployment Guide

This guide details how to deploy **ColoringCraft Studio** on an auto-scaling cloud serverless container platform so you **never have to worry about scaling or server maintenance**, and how to map it to your custom subdomain **`coloring.shomerepair.com`**.

---

## 🚀 Option 1: Google Cloud Run (Recommended Serverless Auto-Scaling)

Google Cloud Run runs the Docker container serverlessly:
- **Zero Server Maintenance**: Automatically scales from 0 instances up to 1,000+ container instances in seconds based on web traffic.
- **Cost Effective**: Costs **$0.00** when no one is using the site (scales to zero).
- **Fast Global Edge**: Built-in HTTPS SSL certificates, HTTP/2, and global load balancing.

### Step 1: Deploy with One Command via Google Cloud CLI (`gcloud`)
```bash
# Build and deploy container directly to Cloud Run
gcloud run deploy coloring-craft-studio \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 100 \
  --memory 512Mi \
  --cpu 1
```

### Step 2: Map Subdomain `coloring.shomerepair.com` in Cloud Run
1. In the Google Cloud Console, navigate to **Cloud Run > Manage Custom Domains**.
2. Click **Add Mapping**.
3. Select service: `coloring-craft-studio`.
4. Enter domain: **`coloring.shomerepair.com`**.
5. Google Cloud will provide a CNAME record value (e.g. `ghs.googlehosted.com.`).

---

## 🔥 Option 2: Firebase App Hosting / Firebase Hosting

If you prefer Firebase's global CDN:

### Step 1: Initialize Firebase in the Project Root
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login and deploy
firebase login
firebase init hosting
```
When prompted:
- What do you want to use as your public directory? **`dist`**
- Configure as a single-page app? **`Yes`**
- Set up automatic builds with GitHub? **`No`** (or Yes if desired)

### Step 2: Build and Deploy
```bash
npm run build
firebase deploy --only hosting
```

### Step 3: Add Custom Subdomain in Firebase Console
1. In Firebase Console, go to **Hosting > Add Custom Domain**.
2. Enter: **`coloring.shomerepair.com`**.
3. Copy the CNAME or A records provided by Firebase.

---

## ⚡ Option 3: Vercel / Cloudflare Pages (Instant Git Edge CDN)

1. Push your repository to GitHub:
   ```bash
   git push origin master
   ```
2. In Vercel or Cloudflare Pages dashboard:
   - Import repository: `virtue-tech-coloring-books`.
   - Framework preset: **Vite**.
   - Build command: `npm run build`.
   - Output directory: `dist`.
3. In **Domains / Custom Domains**, add:
   - **`coloring.shomerepair.com`**.

---

## 🌐 DNS Configuration for `shomerepair.com` (Registrar / Cloudflare / GoDaddy)

Log in to the DNS management portal where `shomerepair.com` is registered (GoDaddy, Namecheap, Google Domains, Cloudflare, Route53, etc.) and add this CNAME record:

| Record Type | Host / Name | Points To / Target Value | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `coloring` | `ghs.googlehosted.com` (Cloud Run) *OR* `cname.vercel-dns.com` (Vercel) | Automatic / 300s |

### Verification:
After DNS propagates (typically 2 to 15 minutes), test in your terminal or browser:
```bash
nslookup coloring.shomerepair.com
```
And visit:
**`https://coloring.shomerepair.com`**

The site will be live with automated SSL/TLS encryption, serving 12-page custom coloring books with page-by-page ad monetization!
