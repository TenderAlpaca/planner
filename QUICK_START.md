# 🚀 Quick Start Guide

## First Time Setup (5 minutes)

### 1. Upload to GitHub

**Option A: GitHub Web Interface** (Easiest)
1. Go to https://github.com/new
2. Name it `date-planner`
3. Don't initialize with README
4. Create repository
5. On your computer, open terminal in the project folder
6. Run these commands:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/date-planner.git
git push -u origin main
```

**Option B: GitHub Desktop**
1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose this folder
4. Publish repository

### 2. Update Config

Edit `vite.config.js` and change:
```js
base: '/date-planner/',  // Must match your repo name!
```

### 3. Install & Deploy

```bash
npm install
npm run deploy
```

That's it! Your site is live at:
`https://YOUR_USERNAME.github.io/date-planner/`

---

## Daily Workflow

### Edit Data on GitHub
1. Go to your repo on GitHub
2. Navigate to `src/data/places.js` or `combos.js`
3. Click pencil icon to edit
4. Make changes
5. Commit changes
6. On your computer, run:
```bash
git pull
npm run deploy
```

### Edit Locally
1. Make changes to files
2. Test: `npm run dev`
3. Deploy:
```bash
git add .
git commit -m "Updated places"
git push
npm run deploy
```

---

## Troubleshooting

**404 Page Not Found**
→ Check that `vite.config.js` base matches your repo name

**Changes not showing**
→ Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**npm install fails**
→ Make sure Node.js is installed: https://nodejs.org/

**Need help?**
→ Check README.md for full documentation
