# Sub-Project Integration Guide for shomerepair.com

This guide provides 3 straightforward methods to integrate **`virtue-tech-coloring-books`** as a sub-project inside your primary **`shomerepair.com`** website and repository.

---

## 🛠️ Method 1: Git Submodule (Recommended for Public Standalone Repos)

If `virtue-tech-coloring-books` remains a public open-source repo and you want to pull it directly into your `shomerepair.com` repository:

### Step 1: Add as a Git Submodule in `shomerepair.com`
Open terminal in your `shomerepair.com` repository root:

```bash
cd /path/to/shomerepair.com

# Add virtue-tech-coloring-books as a submodule under public/virtuecraft-stem
git submodule add https://github.com/YOUR_GITHUB_USERNAME/virtue-tech-coloring-books.git public/virtuecraft-stem
```

### Step 2: Initialize Submodules when Cloning
When deploying or cloning `shomerepair.com`:
```bash
git clone --recurse-submodules https://github.com/YOUR_GITHUB_USERNAME/shomerepair.com.git
```

---

## 🏗️ Method 2: Sub-Path Hosting (`shomerepair.com/virtuecraft-stem`)

If you want `virtue-tech-coloring-books` to run at a specific sub-folder URL like **`https://shomerepair.com/virtuecraft-stem/`**:

### Step 1: Update `vite.config.js` in `virtue-tech-coloring-books`
Set the `base` configuration option to your target sub-path:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/virtuecraft-stem/', // Sub-path on shomerepair.com
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
```

### Step 2: Build and Copy to `shomerepair.com/public/virtuecraft-stem/`
```bash
# Inside virtue-tech-coloring-books directory:
npm run build

# Copy build output to shomerepair.com's public folder:
cp -r dist/* /path/to/shomerepair.com/public/virtuecraft-stem/
```

Now visiting **`https://shomerepair.com/virtuecraft-stem/`** will load the full interactive Click-to-Color app seamlessly!

---

## 📦 Method 3: NPM Workspaces Monorepo

If `shomerepair.com` uses an NPM / Yarn / pnpm Monorepo setup:

### Step 1: Copy Project Folder
Copy `virtue-tech-coloring-books` into your `shomerepair.com` monorepo:
```
shomerepair.com/
├── package.json
├── apps/
│   ├── main-site/
│   └── virtuecraft-stem/ (This project)
```

### Step 2: Update Root `package.json` in `shomerepair.com`
```json
{
  "name": "shomerepair-monorepo",
  "private": true,
  "workspaces": [
    "apps/*"
  ],
  "scripts": {
    "dev:stem": "npm run dev --workspace=apps/virtuecraft-stem",
    "build:stem": "npm run build --workspace=apps/virtuecraft-stem"
  }
}
```

---

## 🎯 Summary Recommendation

| Requirement | Best Integration Choice | URL Outcome |
| :--- | :--- | :--- |
| **Keep public standalone repo + link into site** | **Method 1 (Git Submodule)** | `shomerepair.com/virtuecraft-stem` |
| **Simple sub-folder deployment** | **Method 2 (Vite Base Sub-Path)** | `shomerepair.com/virtuecraft-stem` |
| **Single combined repository monorepo** | **Method 3 (NPM Workspaces)** | Integrated package |
