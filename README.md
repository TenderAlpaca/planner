# 🌹 Date Planner

A beautiful date planning app for exploring 95+ places and 35 ready-made plans across Southern Hungary.

## ✨ Features

- 95+ curated places (thermal baths, restaurants, castles, nature spots)
- 35 ready-made date plans (day trips to weekend getaways)
- Filter by mood, distance, duration
- Surprise me button for spontaneous dates
- Mobile-optimized interface
- Beautiful romantic dark theme

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Run dev server:**
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## 📦 Deploy to GitHub Pages

### One-Time Setup

1. **Update `vite.config.js`** - Change the base path to match your repo name:
```js
base: '/your-repo-name/',  // e.g., '/date-planner/'
```

2. **Install gh-pages** (if not already installed):
```bash
npm install --save-dev gh-pages
```

### Deploy

Run this command to build and deploy:
```bash
npm run deploy
```

This will:
- Build your app
- Push the built files to the `gh-pages` branch
- Your site will be live at: `https://yourusername.github.io/your-repo-name/`

### Enable GitHub Pages

After first deploy:
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: `gh-pages` branch
4. Save

Your site will be live in ~1 minute!

## 🎨 Customizing Data

All data is in the `src/data/` folder:

- **`places.js`** - All 95+ places (restaurants, thermal baths, etc.)
- **`combos.js`** - All 35 date plans
- **`config.js`** - Categories, filters, and settings

### Easy Edits on GitHub

You can edit the data files directly on GitHub:

1. Navigate to `src/data/places.js` (or `combos.js`)
2. Click the pencil icon to edit
3. Make your changes
4. Commit changes
5. Run `npm run deploy` locally (or set up GitHub Actions - see below)

### Adding a New Place

In `src/data/places.js`:

```js
{ 
  id: 96,  // Next available ID
  name: "New Place",
  loc: "City Name",
  km: 45,
  time: "40 min",
  cat: "food",  // adventure, explore, thermal, food, special
  vibes: ["romantic", "foodie"],
  desc: "Description here",
  tip: "Insider tip here",
  maps: "https://maps.google.com/?q=Place+Name",
  emoji: "🍷",
  duration: "half"  // half, full, weekend
}
```

## 🤖 Auto-Deploy with GitHub Actions (Optional)

Want automatic deploys when you push? Create `.github/workflows/deploy.yml`:

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
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Now every push to `main` auto-deploys! 🎉

## 📁 Project Structure

```
date-planner/
├── src/
│   ├── components/        # React components
│   │   ├── PlaceCard.jsx
│   │   ├── ComboCard.jsx
│   │   └── FilterBar.jsx
│   ├── data/             # All your data (edit these!)
│   │   ├── places.js     # 95+ places
│   │   ├── combos.js     # 35 date plans
│   │   └── config.js     # Categories & filters
│   ├── styles/
│   │   └── App.css       # All styles
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── index.html
├── package.json
├── vite.config.js        # Vite config (update base path!)
└── README.md
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool
- **CSS** - Styling (no frameworks needed)
- **GitHub Pages** - Free hosting

## 💡 Tips

- **Edit data in GitHub:** You can edit `places.js` and `combos.js` directly in GitHub's web interface
- **Mobile testing:** Run `npm run dev` and open on your phone using your computer's IP
- **Production preview:** Run `npm run preview` after building to test the production build locally

## 🎯 Common Tasks

**Add a new place:**
Edit `src/data/places.js`

**Add a new combo:**
Edit `src/data/combos.js`

**Change colors/styling:**
Edit `src/styles/App.css`

**Update filters:**
Edit `src/data/config.js`

---

Made with 🌹 for date planning in Southern Hungary
