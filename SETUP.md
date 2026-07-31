# Setting up the Asklepieion (React version)

This version is built with React and needs a build step, unlike the plain-HTML
version — GitHub will run that build for you automatically on every push, via
the workflow file already included in `.github/workflows/deploy.yml`. You
don't need Node.js installed on your own computer unless you want to preview
changes locally before pushing them.

## 1. Put this on GitHub

1. Create a free GitHub account if you don't have one: https://github.com/signup
2. Create a new **public** repository, e.g. named `asklepieion`.
3. Upload every file and folder in this project, keeping the structure intact
   (`src/`, `public/`, `content/`, `.github/` all need to stay where they are).

## 2. Point the site at your repo

Edit `src/config.js`:

```js
export const REPO_OWNER = "YOUR-GITHUB-USERNAME";
export const REPO_NAME = "asklepieion";
```

Re-upload the file with your real username filled in.

## 3. Turn on GitHub Pages (via Actions)

1. In your repo, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to **GitHub Actions**
   (not "Deploy from a branch" — that's for the old plain-HTML version).
3. Push (or re-upload) anything to the `main` branch — this triggers the
   workflow. Check the **Actions** tab to watch it build; it takes a minute
   or two the first time.
4. Once it succeeds, your live URL appears under Settings → Pages —
   something like `https://YOUR-USERNAME.github.io/asklepieion/`.

`vite.config.js` is already set to `base: '/Asklepieion/'` for the
ckn85.github.io/Asklepieion/ address. If you later point a custom domain at
the site, change that back to `base: '/'`.

## 4. Custom domain (optional, same as before)

Settings → Pages → Custom domain, plus the DNS records at your registrar.
Nothing else changes — this works the same way it did for the plain-HTML
version. No CNAME file needs adding to the project; GitHub Actions
deployments read the domain from your Pages settings directly.

## 5. Create a GitHub access token

1. https://github.com/settings/tokens → create a **fine-grained token**
   scoped to just this repository, with **Contents: read and write**.
2. Copy it somewhere safe.

## 6. Set up DecapBridge (the editor login)

1. Sign up free at https://decapbridge.com
2. Add a site: GitHub provider, your repo, the access token, and your admin
   URL (`https://your-domain-or-username.github.io/.../admin/index.html`).
3. Copy the generated `backend:` block into `public/admin/config.yml`,
   replacing the placeholder one at the top, and push it.

## 7. Log in and write

Visit `.../admin/`, set a password on first login, and create Tablets from
there. Saving commits straight to your repo. Since content is fetched live
at runtime (not baked in at build time), a new Tablet appears on the site
within a minute or two — no rebuild needed for content changes, only for
actual code changes.

## Previewing locally (optional)

If you have Node.js installed:

```
npm install
npm run dev
```

Opens a local preview at `http://localhost:5173`.

## Notes

- URLs for Tablets look like `yoursite.com/#/tablet/the-cardiac-cycle` — the
  `#` is intentional (a "hash router"), and is what lets client-side page
  navigation work on GitHub Pages without extra server configuration.
- If a hall's list says "Couldn't load Tablets," check `src/config.js` first.
- If the GitHub Actions build fails, the **Actions** tab shows exactly which
  step failed and why — worth pasting that error into a chat with Claude if
  you get stuck.


## Structure of this version

- `src/data/halls.js` — the single source of truth for every hall: its Greek
  name, marker letter, discipline, description, and chapter list. Edit a hall
  here and the plan, the hall page, and the Tablet labels all update together.
- `src/pages/HomePage.jsx` — masthead, floor plan, and the short creed. No hall
  detail lives here any more.
- `src/pages/HallPage.jsx` — one page per hall, at `/#/hall/trikka` and so on.
- `src/components/FloorPlan.jsx` — the plan itself; `GEOMETRY` at the bottom
  controls where each wing sits.
