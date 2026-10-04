# TeamForge 🚀

A polished student collaboration platform for discovering projects, finding teammates and building ambitious ideas together.

## Run locally

The project is intentionally zero-build:

1. Clone the repository.
2. Open `index.html` in Chrome/Edge, or use VS Code + Live Server.
3. Start editing `index.html`, `styles.css` and `app.js`.

No Node.js, database or API key is required for the demo.

## Features

- Premium responsive landing page
- Explore projects with search, category filters and sorting
- Project details modal
- Save/bookmark projects
- Join-team requests
- Create and publish projects
- Builder/team matching page
- Personal dashboard
- Editable profile
- Notifications
- Command palette (`Ctrl + K` / `Cmd + K`)
- Toast feedback
- LocalStorage persistence
- Mobile responsive navigation
- Seeded demo data for presentations

## File structure

```text
TeamForge/
├── index.html
├── styles.css
├── app.js
├── favicon.svg
├── .gitignore
├── .nojekyll
├── README.md
└── .github/
    └── workflows/
        └── pages.yml
```

## Push to GitHub

### First time

```bash
git init
git add .
git commit -m "Initial TeamForge release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### After editing

```bash
git add .
git commit -m "Update TeamForge UI"
git push
```

## GitHub Pages

This repository already includes a GitHub Actions workflow at `.github/workflows/pages.yml`.

After pushing to `main`, open:

**GitHub → Settings → Pages → Source: GitHub Actions**

The workflow will publish the site automatically after each push.

## Vercel

You can also import the GitHub repository into Vercel. Every push to `main` can then trigger a new deployment automatically.

## Important

This is a complete frontend MVP. Project, profile, bookmark and request data currently persist in the browser using LocalStorage. A production version can connect the existing UI to Supabase/Firebase/Node + PostgreSQL for real authentication, accounts, chat, image uploads and shared team data.
