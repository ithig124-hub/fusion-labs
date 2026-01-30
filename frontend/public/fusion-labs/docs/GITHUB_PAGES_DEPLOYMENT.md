# Deploying Fusion Labs to GitHub Pages

This guide explains how to deploy the Fusion Labs website to GitHub Pages for free hosting.

## Prerequisites

- GitHub account
- Git installed on your computer
- Node.js 18+ installed

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repository (e.g., `fusion-labs` or `widget-os-website`)
3. Make it **Public** (required for free GitHub Pages)
4. Click **Create repository**

## Step 2: Prepare the Build

### Set Homepage in package.json

Edit `/app/frontend/package.json` and add:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
  ...
}
```

Example:
```json
{
  "homepage": "https://ithig124-hub.github.io/fusion-labs",
  ...
}
```

### Install gh-pages

```bash
cd frontend
npm install gh-pages --save-dev
```

### Add Deploy Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    ...
  }
}
```

## Step 3: Build for Production

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build` folder.

## Step 4: Push to GitHub

### Initialize Git (if not already)

```bash
git init
git add .
git commit -m "Initial commit - Fusion Labs website"
```

### Add Remote and Push

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 5: Deploy to GitHub Pages

### Option A: Using gh-pages (Recommended)

```bash
npm run deploy
```

This automatically:
1. Builds your app
2. Creates a `gh-pages` branch
3. Pushes the build folder to that branch

### Option B: Manual GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Build
        run: |
          cd frontend
          npm run build
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/build
```

## Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

## Step 7: Access Your Site

Your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
```

Example:
```
https://ithig124-hub.github.io/fusion-labs
```

> Note: It may take 1-5 minutes for the site to become available after first deploy.

---

## Important Notes

### Client-Side Routing

GitHub Pages doesn't support client-side routing by default. To fix this:

1. Copy `index.html` to `404.html` in your build folder:
```bash
cp build/index.html build/404.html
```

2. Or use HashRouter instead of BrowserRouter in your React app.

### Custom Domain (Optional)

1. Go to Settings → Pages
2. Under "Custom domain", enter your domain (e.g., `fusionlabs.io`)
3. Create a `CNAME` file in your `public` folder with your domain

### HTTPS

GitHub Pages automatically provides free HTTPS for your site.

---

## Updating Your Site

To deploy updates:

```bash
# Make your changes
git add .
git commit -m "Update: description of changes"
git push origin main

# Deploy to GitHub Pages
npm run deploy
```

---

## File Structure After Setup

```
your-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml (if using GitHub Actions)
├── frontend/
│   ├── public/
│   │   ├── fusion-labs/        # All docs & firmware
│   │   └── index.html
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/                     # Not deployed (frontend only)
└── README.md
```

---

## Troubleshooting

### "Page not found" after deploy
- Wait 5 minutes for GitHub to process
- Check that gh-pages branch exists
- Verify Pages is enabled in Settings

### Routes not working
- Use HashRouter or add 404.html redirect
- Check homepage in package.json matches your URL

### Build fails
- Check Node version (18+ required)
- Run `npm ci` to clean install dependencies
- Check for build errors in console

---

## Quick Deploy Checklist

- [ ] Created GitHub repository (public)
- [ ] Set `homepage` in package.json
- [ ] Installed `gh-pages` package
- [ ] Added deploy scripts
- [ ] Ran `npm run deploy`
- [ ] Enabled GitHub Pages in Settings
- [ ] Verified site is live

---

## Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/#github-pages)
- [gh-pages npm package](https://www.npmjs.com/package/gh-pages)
